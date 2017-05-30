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
  boardID: string;
  boardName: string;
  board: FirebaseListObservable<any[]>;
  boardObj: FirebaseObjectObservable<any>;
  columns: FirebaseListObservable<any[]>;
  sendingInvite: boolean;
  cardElevations: any;
  @HostBinding('@routerTransition') routerTransition = '';

  public pageLoading: boolean;
  editEl: null;
  
  constructor(
    private fireBase: FirebaseService,
    private route: ActivatedRoute,
    private location: Location,
    private http: Http,
    private snackBar: MdSnackBar,
  ) {
    this.pageLoading = true;
    this.cardElevations = {};
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
        this.pageLoading = false;
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

  elevateCard(i: number): void {
    this.cardElevations[i] = true;
  }

  isElevated(i: number): boolean {
    return this.cardElevations[i];
  }

  removeElevation(i: number): void {
    this.cardElevations[i] = false;
  }

  updateVal(evt: any, column: any, item: any) {
    this.columns.$ref.ref
      .child(column.$key)
      .child('items')
      .child(item.key)
      .update({val: evt });
  }

  pushItem(itemVal, column) {
    const authorName = this.fireBase.userInfo.name;
    const authorUID = this.fireBase.userInfo.uid;

    this.columns.$ref.ref
      .child(column.$key)
      .child('items')
      .push({
        val: itemVal.value,
        author: authorName,
        authorUID: authorUID,
      })
      .catch(err => {
        this.snackBar.open('Please, make sure the feedback is not empty, then try again.', null, { duration: 6000 });
      });
  }
  updatePost(item: any, column: any, post): void {
    this.board.$ref.ref
      .child(`columns/${column.$key}/items/${item.key}`)
      .update({val: post.value})
      .catch(err => {
        this.snackBar.open('Ops! looks like you cannot edit this post at the moment.', null, { duration: 6000 });
      });
    this.editEl = null;
  }

  discardChanges(item: any): void {
    item.value.val = item.value.val;
    this.editEl = null;
  }
}
