import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

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

  constructor(
    private fireBase: FirebaseService,
    private route: ActivatedRoute,
  ) { }

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
}
