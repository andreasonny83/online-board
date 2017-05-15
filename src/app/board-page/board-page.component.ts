import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Params } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Http, Response, RequestOptions, Headers } from '@angular/http';

import { FirebaseService } from '../../firebase';
import { EmailsGenerator } from '../../email-templates';
import { MdSnackBar } from '@angular/material';

import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'app-board-page',
  templateUrl: './board-page.component.html',
  styleUrls: ['./board-page.component.css']
})
export class BoardPageComponent implements OnInit {
  boardID: string;
  board: any[];
  columns: any;
  collaboratorsForm: FormGroup;

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
      .switchMap((params: Params) => {
        this.boardID = params['id'];
        return this.fireBase.getBoardObject(this.boardID);
      })
      .subscribe(res => {
        this.board = res;
        this.columns = this.fireBase.getBoard(`${this.boardID}/columns`);
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
    this.columns.$ref
      .child(column.$key)
      .child('items')
      .child(item.key)
      .update({val: evt });
  }

  pushItem(itemVal, column) {
    this.columns.$ref
      .child(column.$key)
      .child('items')
      .push({
        val: itemVal.value,
        author: this.fireBase.uid,
      });
  }

  inviteCollaborator() {
    const self = this;

    const html = EmailsGenerator.inviteCollaborator(
        this.fireBase.userInfo.name,
        this.location.prepareExternalUrl(location.origin + this.location.path()),
        location.origin,
      );

    const body: IMailSender = {
      from: 'Online Board',
      to: this.collaboratorsForm.controls.collaborator.value,
      subject: 'Collaboration request',
      text: '',
      html: html,
    };

    const headers = new Headers({ 'Content-Type': 'application/json' }); // Set content type to JSON
    const options = new RequestOptions({ headers: headers }); // Create a request option

    this.http
      .post(`https://node-mailsender.herokuapp.com/send`, JSON.stringify(body), options)
      .map(res => res.json())
      .catch(() => this.errorHandler())
      .subscribe(
        res => {
          if (!!res.sent && /^250 OK/.test(res.sent)) {
            self.collaboratorsForm.reset();
            self.snackBar.open('Your message has been correctly delivered.', null, { duration: 6000 });
          } else {
            this.errorHandler();
          }
        },
        err => this.errorHandler());
  }

  errorHandler(): Observable<any> {
    this.snackBar.open(`Is not possible to send the email at the moment.
                       Please, try again later or contact the support.`,
                       null, { duration: 6000 });

    return Observable.throw('Server error');
  }
}
