import { Component, OnInit, HostBinding } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Params } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { slideToLeft } from '../app.animations';
import { EmailsGenerator } from '../../email-templates';
import { MdSnackBar } from '@angular/material';
import { FirebaseService, FirebaseObjectObservable } from '../../firebase';
import * as firebase from 'firebase/app';

interface IBoardObj {
  columns: any[];
  invites: any[];
  name: string;
}

@Component({
  selector: 'app-board-page',
  templateUrl: './board-page.component.html',
  styleUrls: ['./board-page.component.scss'],
  animations: [slideToLeft],
})
export class BoardPageComponent implements OnInit {
  @HostBinding('@routerTransition') routerTransition = '';

  public boardID: string;
  public boardName: string;
  public boardObj: FirebaseObjectObservable<any>;
  public collaboratorsForm: FormGroup;
  public sendingInvite: boolean;
  public cardElevations: any;
  public pageLoading: boolean;
  public editEl: string;
  public dragging: boolean;
  public showDroppingBoxes: boolean;

  constructor(
    private fireBase: FirebaseService,
    private route: ActivatedRoute,
    private location: Location,
    private fb: FormBuilder,
    private snackBar: MdSnackBar,
  ) {
    this.pageLoading = true;
    this.createForm();
    this.cardElevations = {};
  }

  ngOnInit() {
    this.route.params
      .subscribe((res: {id: string}) => {
        this.boardID = res.id;
        this.boardObj = this.fireBase.getBoardObject(this.boardID);
      });

    this.boardObj
      .subscribe((res: IBoardObj) => {
        this.boardName = res.name;
        this.pageLoading = false;
      });
  }

  public elevateCard(i: number): void {
    this.cardElevations[i] = true;
  }

  public isElevated(i: number): boolean {
    return this.cardElevations[i];
  }

  public removeElevation(i: number): void {
    this.cardElevations[i] = false;
  }

  public pushPost(itemVal: any, column: number): void {
    const authorName = this.fireBase.userInfo.name;
    const authorUID = this.fireBase.userInfo.uid;

    this.boardObj.$ref.ref
      .child('posts')
      .push({
        val: itemVal.value,
        author: authorName,
        authorUID: authorUID,
        col: column,
      })
      .catch(err => {
        this.snackBar.open(`
          Please, make sure the feedback is not empty
          and you are a collaborator on this board.`,
          null, { duration: 6000 });
      });
  }

  public updatePost(post: any, postRef): void {
    this.boardObj.$ref.ref
      .child(`posts/${post.key}`)
      .update({val: postRef.value})
      .catch(err => {
        this.snackBar.open(
          'Ops! looks like you cannot edit this post at the moment.',
          null,
          { duration: 6000 });
      });

    this.editEl = null;
  }

  public discardChanges(post: any): void {
    post.value.val = post.value.val;
    this.editEl = null;
  }

  public onDragStart(event: any, postKey: any, columnID: number) {
    this.showDroppingBoxes = true;
    event.dataTransfer.setData('postKey', postKey);
    event.dataTransfer.setData('columnID', columnID);

    this.dragging = true;
    setTimeout(() => this.dragging = true, 100);
  }

  public onDrop(event: DragEvent) {
    console.log('drop');
    const postKey = event.dataTransfer.getData('postKey');
    this.dragging = false;

    event.preventDefault();
  }

  public allowDrop(event: DragEvent) {
    event.preventDefault();
  }

  public onDropOutside(event: DragEvent) {
    this.dragging = false;
    event.preventDefault();
  }

  public inviteCollaborator(): void {
    const html = EmailsGenerator.inviteCollaborator(
        this.fireBase.userInfo.name,
        location.origin + this.location.prepareExternalUrl(this.location.path()),
        location.origin,
      );

    const body: IMailSender = {
      from: 'Online Board',
      to: this.collaboratorsForm.controls.collaborator.value,
      subject: 'Collaboration request',
      text: '',
      html: html,
    };

    this.sendingInvite = true;

    this.fireBase
      .inviteCollaborator(body, this.collaboratorsForm.controls.collaborator.value, this.boardID, this.boardName)
      .subscribe(
        res => this.inviteCollaboratorSuccessHandler(),
        err => this.inviteCollaboratorErrorHandler(err));
  }

  private createForm() {
    this.collaboratorsForm = this.fb.group({
      collaborator: ['', [
        Validators.required,
        Validators.email,
        Validators.pattern(/^[a-zA-Z0-9.!#$%&’*+\/=?^_`{|}~-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-]+$/),
      ]],
    });
  }

  private inviteCollaboratorErrorHandler(err): void {
    this.sendingInvite = false;
    this.collaboratorsForm.reset();

    this.snackBar.open(err, null, { duration: 6000 });
  }

  private inviteCollaboratorSuccessHandler(): void {
    this.sendingInvite = false;
    this.collaboratorsForm.reset();

    this.snackBar.open('Your message has been correctly delivered.', null, { duration: 6000 });
  }
}
