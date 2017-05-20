import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Params } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Http, Response, RequestOptions, Headers } from '@angular/http';

import { FirebaseService, FirebaseListObservable, FirebaseObjectObservable } from '../../firebase';
import { EmailsGenerator } from '../../email-templates';
import { MdSnackBar } from '@angular/material';

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
  styleUrls: ['./board-page.component.css']
})
export class BoardPageComponent implements OnInit {
  boardID: string;
  boardName: string;
  board: FirebaseListObservable<any[]>;
  boardObj: FirebaseObjectObservable<any>;
  columns: FirebaseListObservable<any[]>;
  collaboratorsForm: FormGroup;
  sendingInvite: boolean;

  constructor(
    private fireBase: FirebaseService,
    private route: ActivatedRoute,
    private location: Location,
    private fb: FormBuilder,
    private http: Http,
    private snackBar: MdSnackBar,
  ) {
    this.createForm();
  }

  ngOnInit() {
    this.route.params
      .subscribe((res: {id: string}) => {
        this.boardID = res.id;
        this.board = this.fireBase.getBoard(this.boardID);
        this.columns = this.fireBase.getBoard(`${this.boardID}/columns`);
        this.boardObj = this.fireBase.getBoardObject(this.boardID);
      });

    this.boardObj
      .subscribe((res: IBoardObj) => {
        this.boardName = res.name;
      });
  }

  createForm() {
    this.collaboratorsForm = this.fb.group({
      collaborator: ['', [
        Validators.required,
        Validators.email,
        Validators.pattern(/^[a-zA-Z0-9.!#$%&’*+\/=?^_`{|}~-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-]+$/)
      ]],
    });
  }

  cardEmoticon(cardTitle: string) {
    switch (cardTitle) {
      case 'Goods':
      return 'sentiment_very_satisfied';

      case 'Bads':
      return 'mood_bad';

      case 'Questions':
      return 'sentiment_neutral';

      default:
      return '';
    }
  }

  updateVal(evt: any, column: any, item: any) {
    this.columns.$ref.ref
      .child(column.$key)
      .child('items')
      .child(item.key)
      .update({val: evt });
  }

  pushItem(itemVal, column) {
    const self = this;

    this.columns.$ref.ref
      .child(column.$key)
      .child('items')
      .push({
        val: itemVal.value,
        author: this.fireBase.userInfo.name,
      })
      .catch(err => {
        self.snackBar.open('Please, make sure the feedback is not empty, then try again.', null, { duration: 6000 });
      });
  }

  inviteCollaborator() {
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

  editItem(item) {
    // const email = this.fireBase.dbRef.child('users').orderByChild('email').equalTo('andreasonny83@gmail.com');
    // email.once('value').then((res) => console.log(res));

    // this.board.update('members', {test: true});

    this.snackBar.open(`Ops! this is not yet available.
                       Please, try again in future as we're currently working on it.`,
                       null, { duration: 6000 });
  }

  errorHandler(): Observable<any> {
    this.sendingInvite = false;

    this.snackBar.open(`Is not possible to send the email at the moment.
                       Please, try again later or contact the support.`,
                       null, { duration: 6000 });

    return Observable.throw('Server error');
  }
}
