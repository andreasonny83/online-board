import { Component, OnInit, OnDestroy, HostBinding } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Params } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { slideToLeft } from '../app.animations';
import { EmailsGenerator } from '../../email-templates';
import { BoardService } from '../services/board.service';
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
import { Subscription } from 'rxjs/subscription';
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
export class BoardPageComponent implements OnInit, OnDestroy {
  @HostBinding('@routerTransition') routerTransition = '';
  public boardID: string;
  public boardName: string;
  public boardObj: FirebaseObjectObservable<any>;
  public sendingInvite: boolean;
  public cardElevations: any;
  public pageLoading: boolean;
  public editEl: null;
  private routerSubscriber$: Subscription;

  constructor(
    private fireBase: FirebaseService,
    private boardService: BoardService,
    private route: ActivatedRoute,
    private location: Location,
    private snackBar: MdSnackBar,
  ) {
    this.pageLoading = true;
    this.cardElevations = {};
  }

  ngOnInit() {
    this.routerSubscriber$ = this.route.params
      .subscribe((res: {id: string}) => {
        this.boardID = res.id;
        this.boardService.currentBoard = this.boardID;
        this.boardObj = this.fireBase.getBoardObject(this.boardID);
      });

    this.boardObj
      .subscribe((res: IBoardObj) => {
        this.boardName = res.name;
        this.pageLoading = false;
      });
  }

  public elevateCard(i: number): void {
    this.cardElevations[i] = true;
  }

  public isElevated(i: number): boolean {
    return this.cardElevations[i];
  }

  public removeElevation(i: number): void {
    this.cardElevations[i] = false;
  }

  public pushPost(itemVal: any, column: number): void {
    const authorName = this.fireBase.userInfo.name;
    const authorUID = this.fireBase.userInfo.uid;

    this.boardObj.$ref.ref
      .child('posts')
      .push({
        val: itemVal.value,
        author: authorName,
        authorUID: authorUID,
        col: column,
      })
      .catch(err => {
        this.snackBar.open(`
          Please, make sure the feedback is not empty
          and you are a collaborator on this board.`,
          null, { duration: 6000 });
      });
  }

  public updatePost(post: any, postRef): void {
    this.boardObj.$ref.ref
      .child(`posts/${post.key}`)
      .update({val: postRef.value})
      .catch(err => {
        this.snackBar.open(
          'Ops! looks like you cannot edit this post at the moment.',
          null,
          { duration: 6000 });
      });

    this.editEl = null;
  }

  public discardChanges(post: any): void {
    post.value.val = post.value.val;
    this.editEl = null;
  }

  ngOnDestroy() {
    this.routerSubscriber$.unsubscribe();
    this.boardService.currentBoard = null;
  }
}
