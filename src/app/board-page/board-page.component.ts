import { Component, OnInit } from '@angular/core';
import {Location, LocationStrategy, PathLocationStrategy} from '@angular/common';
import { ActivatedRoute, Params, RouterState } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Http, Response } from '@angular/http';

import { FirebaseService } from '../../firebase';

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
  ) {
    this.createForm();
  }

  ngOnInit() {
    console.log(location.href);
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

  inviteCollaborator() {
    const body = {
      from: 'Online Board',
      to: this.collaboratorsForm.controls.collaborator,
      subject: 'Collaboration request',
      text: `${this.route.url}`,
      html: `${this.route.url}`,
    };
    //
    // return this.http.post(`https://node-mailsender.herokuapp.com/send`, body)
  }
}
