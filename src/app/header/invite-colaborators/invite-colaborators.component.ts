import { Component, OnInit} from '@angular/core';
import { Location } from '@angular/common';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FirebaseService, FirebaseListObservable, FirebaseObjectObservable } from '../../../firebase';
import { EmailsGenerator } from '../../../email-templates';
import { Http, RequestOptions, Headers } from '@angular/http';
import { MdSnackBar } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute, Params } from '@angular/router';
import { BoardService } from '../../services/board.service';

interface IBoardObj {
  columns: any[];
  invites: any[];
  name: string;
}

@Component({
  selector: 'app-invite-colaborators',
  templateUrl: './invite-colaborators.component.html',
  styleUrls: ['./invite-colaborators.component.css']
})


export class InviteColaboratorsComponent implements OnInit {
  collaboratorsForm: FormGroup;
  sendingInvite: boolean;
  boardID: string;
  boardName: string;
  boardObj: FirebaseObjectObservable<any>;

  ngOnInit() {
    this.boardID = this.boardService.currentBoard;
  }

  constructor(
    private fireBase: FirebaseService,
    private fb: FormBuilder,
    private http: Http,
    private snackBar: MdSnackBar,
    private route: ActivatedRoute,
    private location: Location,
    private boardService: BoardService,
  ) {
      this.createForm();
    }

  public inviteCollaborator() {
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
        Validators.pattern(/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-]+$/)
      ]],
    });
  }

  private inviteCollaboratorSuccessHandler(): void {
    this.sendingInvite = false;
    this.collaboratorsForm.reset();

    this.snackBar.open('Your message has been correctly delivered.', null, { duration: 6000 });
  }

  private inviteCollaboratorErrorHandler(err): void {
    this.sendingInvite = false;
    this.collaboratorsForm.reset();

    this.snackBar.open(err, null, { duration: 6000 });
  }
}
