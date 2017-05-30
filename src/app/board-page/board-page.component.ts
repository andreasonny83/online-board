import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Params } from '@angular/router';
import { Http, Response, RequestOptions, Headers } from '@angular/http';

import { FirebaseService, FirebaseListObservable, FirebaseObjectObservable } from '../../firebase';
import { MdSnackBar } from '@angular/material';

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
  styleUrls: ['./board-page.component.scss']
})
export class BoardPageComponent implements OnInit {
  boardID: string;
  boardName: string;
  board: FirebaseListObservable<any[]>;
  boardObj: FirebaseObjectObservable<any>;
  columns: FirebaseListObservable<any[]>;
  sendingInvite: boolean;
  cardElevations: any;

  constructor(
    private fireBase: FirebaseService,
    private route: ActivatedRoute,
    private location: Location,
    private http: Http,
    private snackBar: MdSnackBar,
  ) {
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

  editItem(item) {
    // const email = this.fireBase.dbRef.child('users').orderByChild('email').equalTo('andreasonny83@gmail.com');
    // email.once('value').then((res) => console.log(res));

    // this.board.update('members', {test: true});

    this.snackBar.open(`Ops! this is not yet available.
                       Please, try again in future as we're currently working on it.`,
                       null, { duration: 6000 });
  }
}
