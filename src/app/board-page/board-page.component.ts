import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { FirebaseService } from '../firebase.service';

import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase/app';

import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'app-board-page',
  templateUrl: './board-page.component.html',
  styleUrls: ['./board-page.component.css']
})
export class BoardPageComponent implements OnInit {
  board: any[];
  boardUID: string;
  boardUID$: Observable<string>;
  columns: any[];

  constructor(
    private fireBase: FirebaseService,
    private route: ActivatedRoute,
  ) {
    this.columns = [
      {title: 'Goods', color: 'lightgreen', items: [{}, {}]},
      {title: 'Bads', color: 'lightpink', items: [{}, {}]},
      {title: 'Questions', color: 'lightblue', items: [{}, {}]},
    ];
  }

  ngOnInit() {
    this.route.params
      .switchMap((params: Params) => this.fireBase.getBoardObject(params['id']))
      .subscribe(res => this.board = res);
      // .subscribe(res => console.log(res));
      // .subscribe((boardUID) => this.board = this.fireBase.getBoard(boardUID));
    // console.log(this.boardUID);
    // this.board = this.fireBase.getBoard(this.boardUID);

  }

}
