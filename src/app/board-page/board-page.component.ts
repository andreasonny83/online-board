import { Component, OnInit, OnDestroy, HostBinding, ElementRef } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { slideToLeft } from '../app.animations';
import { BoardService, IBoardService } from '../services/board.service';
import { MdSnackBar } from '@angular/material';
import { FirebaseService, FirebaseObjectObservable } from '../../firebase';
import { Subscription } from 'rxjs/Subscription';
import * as firebase from 'firebase/app';

interface IBoardObj {
  columns: any[];
  invites: any[];
  name: string;
  posts?: any[];
}

@Component({
  selector: 'app-board-page',
  templateUrl: './board-page.component.html',
  styleUrls: ['./board-page.component.scss'],
  animations: [slideToLeft],
})
export class BoardPageComponent implements OnInit, OnDestroy {
  @HostBinding('@routerTransition') routerTransition = '';
  public boardObj: FirebaseObjectObservable<any>;
  public sendingInvite: boolean;
  public cardElevations: any;
  public pageLoading: boolean;
  public editEl: string;
  public dragging: boolean;

  private draggingEl: string;
  private routerSubscriber$: Subscription;

  constructor(
    private fireBase: FirebaseService,
    private boardService: BoardService,
    private route: ActivatedRoute,
    private snackBar: MdSnackBar,
  ) {
    this.pageLoading = true;
    this.cardElevations = {};
  }

  public ngOnInit() {
    this.routerSubscriber$ = this.route.params
      .subscribe((res: {id: string}) => {
        this.boardService.currentBoard.uid = res.id;
        this.boardObj = this.fireBase.getBoardObject(res.id);
      });

    this.boardObj
      .subscribe((res: IBoardObj) => {
        this.boardService.currentBoard.name = res.name;
        this.boardService.currentBoard.posts = res.posts;
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

  public onDragStart(event: DragEvent, postKey: any, columnID: number, postEl: number): void {
    this.draggingEl = `${columnID}-${postEl}`;
    event.dataTransfer.setData('boardID', this.boardService.currentBoard.uid);
    event.dataTransfer.setData('postKey', postKey);

    this.dragging = true;
  }

  public postClass(columnID: number, index: number): string {
    return this.draggingEl === `${columnID}-${index}` ?
      'mat-card note pinned-note dragging mat-elevation-z20' :
      'mat-card note pinned-note mat-elevation-z2';
  }

  public onDrop(event: DragEvent): void {
    this.dragging = false;
    this.draggingEl = null;
    event.preventDefault();
  }

  public ngOnDestroy(): void {
    this.routerSubscriber$.unsubscribe();
    this.boardService.currentBoard = <IBoardService>{};
  }
}
