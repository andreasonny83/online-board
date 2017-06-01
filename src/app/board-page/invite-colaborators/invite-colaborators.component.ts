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
      const self = this;

      const html = EmailsGenerator.inviteCollaborator(
          self.fireBase.userInfo.name,
          location.origin + self.location.prepareExternalUrl(self.location.path()),
          location.origin,
        );

      const body: IMailSender = {
        from: 'Online Board',
        to: self.collaboratorsForm.controls.collaborator.value,
        subject: 'Collaboration request',
        text: '',
        html: html,
      };

      self.sendingInvite = true;

      const headers = new Headers({ 'Content-Type': 'application/json' }); // Set content type to JSON
      const options = new RequestOptions({ headers: headers }); // Create a request option

      self.http
        .post(`https://node-mailsender.herokuapp.com/send`, JSON.stringify(body), options)
        .map(res => res.json())
        .catch(() => self.errorHandler())
        .subscribe(
          res => {
            if (!!res.sent && /^250 OK/.test(res.sent)) {
              self.fireBase.inviteCollaborator(
                self.collaboratorsForm.controls.collaborator.value,
                self.boardID,
                self.boardName,
              );

              self.collaboratorsForm.reset();
              self.sendingInvite = false;
              self.snackBar.open('Your message has been correctly delivered.', null, { duration: 6000 });
            } else {
              self.errorHandler();
            }
          },
          err => self.errorHandler());
    }

  private createForm() {
    this.collaboratorsForm = this.fb.group({
      collaborator: ['', [
        Validators.required,
        Validators.email,
        Validators.pattern(/^[a-zA-Z0-9.!#$%&’*+\/=?^_`{|}~-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-]+$/)
      ]],
    });
  }

  private errorHandler(): Observable<any> {
    this.sendingInvite = false;

    this.snackBar.open(`Is not possible to send the email at the moment.
                       Please, try again later or contact the support.`,
                       null, { duration: 6000 });

    return Observable.throw('Server error');
  }
}
