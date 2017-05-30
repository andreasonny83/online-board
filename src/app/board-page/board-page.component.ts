import { Component, OnInit, HostBinding } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Params } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { slideToLeft } from '../app.animations';
import { EmailsGenerator } from '../../email-templates';
import { MdSnackBar } from '@angular/material';
import {
  Http,
  Response,
  RequestOptions,
  Headers
} from '@angular/http';
import {
  FirebaseService,
  FirebaseListObservable,
  FirebaseObjectObservable
} from '../../firebase';

import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase/app';
import 'rxjs/add/operator/switchMap';

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

  constructor(
    private fireBase: FirebaseService,
    private route: ActivatedRoute,
    private location: Location,
    private fb: FormBuilder,
    private http: Http,
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
        this.snackBar.open('Please, make sure the feedback is not empty, then try again.', null, { duration: 6000 });
      });
  }

  public updatePost(post: any, postRef): void {
    this.boardObj.$ref.ref
      .child(`posts/${post.key}`)
      .update({val: postRef.value})
      .catch(err => {
        this.snackBar.open('Ops! looks like you cannot edit this post at the moment.', null, { duration: 6000 });
      });

    this.editEl = null;
  }

  public discardChanges(post: any): void {
    post.value.val = post.value.val;
    this.editEl = null;
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

    this.sendEmail(body);
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

  private sendEmail(body: any): void {
    const headers = new Headers({ 'Content-Type': 'application/json' }); // Set content type to JSON
    const options = new RequestOptions({ headers: headers }); // Create a request option
    const collaboratorEmail = this.collaboratorsForm.controls.collaborator.value;
    const boardID = this.boardID;
    const boardName = this.boardName;

    this.http
      .post(`https://node-mailsender.herokuapp.com/send`, JSON.stringify(body), options)
      .map(res => res.json())
      .catch(() => this.errorHandler())
      .subscribe(
        res => {
          if (!!res.sent && /^250 OK/.test(res.sent)) {
            this.fireBase.inviteCollaborator(collaboratorEmail, boardID, boardName);

            this.collaboratorsForm.reset();
            this.sendingInvite = false;
            this.snackBar.open('Your message has been correctly delivered.', null, { duration: 6000 });
          } else {
            this.errorHandler();
          }
        },
        err => this.errorHandler());
  }

  private errorHandler(): Observable<any> {
    this.sendingInvite = false;

    this.snackBar.open(`Is not possible to send the email at the moment.
                       Please, try again later or contact the support.`,
                       null, { duration: 6000 });

    return Observable.throw('Server error');
  }
}
