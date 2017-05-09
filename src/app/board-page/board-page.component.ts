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

  constructor(
    private fireBase: FirebaseService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.route.params
      .switchMap((params: Params) => this.fireBase.getBoardObject(params['id']))
      .subscribe(res => this.board = res);
  }

}
