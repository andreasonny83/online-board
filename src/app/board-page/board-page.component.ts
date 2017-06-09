import { Component, OnInit, OnDestroy, HostBinding, ElementRef } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { slideToLeft } from '../app.animations';
import { BoardService, IBoardService } from '../services/board.service';
import { MdSnackBar } from '@angular/material';
import { FirebaseService, FirebaseObjectObservable } from '../../firebase';
import { Subscription } from 'rxjs/Subscription';
import * as firebase from 'firebase/app';

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
  public editElTempModel: string;
  public dragging: boolean;
  public isDraggable: boolean;
  public newItems: string[] = ['', '', ''];

  private draggingEl: string;
  private routerSubscriber$: Subscription;

  constructor(
    private fireBase: FirebaseService,
    private boardService: BoardService,
    private route: ActivatedRoute,
    private snackBar: MdSnackBar,
  ) {
    this.pageLoading = true;
    this.isDraggable = true;
    this.cardElevations = {};
  }

  public ngOnInit(): void {
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

  public pushPost(column: number): void {
    const authorName = this.fireBase.userInfo.name;
    const authorUID = this.fireBase.userInfo.uid;

    this.boardObj.$ref.ref
      .child('posts')
      .push({
        val: this.newItems[column],
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

      this.newItems[column] = '';
  }
  public initEditing(columnID: string, index: number, value: string): void {
    this.editEl = columnID + '-' + index;
    this.editElTempModel = value;
  }

  public updatePost(post: any, postRef): void {
    this.boardObj.$ref.ref
      .child(`posts/${post.key}`)
      // .update({val: postRef.value})
      .update({val: this.editElTempModel})
      .catch(err => {
        this.snackBar.open(
          'Ops! looks like you cannot edit this post at the moment.',
          null,
          { duration: 6000 });
      });

    console.log('this.editElTempModel', this.editElTempModel);
    this.editEl = null;
  }

  public discardChanges(post: any): void {
    post.value.val = post.value.val;
    this.editEl = null;
  }

  public isCurrentlyEdited(columnID, i): boolean {
    return this.editEl === columnID + '-' + i;
  }

  public getBoardModel(post, columnID, i) {
    if (this.isCurrentlyEdited(columnID, i)) {
      return this.editElTempModel;
    }
    return post.value.val;
  }

  public setBoardNewValue(newValue) {
    this.editElTempModel = newValue;
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

  public deletePost(post: any): void {
    let undo;
    const snackBarRef = this.snackBar.open('Deleting post...', 'Undo', { duration: 5000 });

    snackBarRef.afterDismissed().subscribe(() => {
      if (undo) {
        return;
      }

      this.boardObj.$ref.ref
        .child(`posts/${post.key}`)
        .remove()
        .catch(() => this.snackBar.open('You cannot bin this post. Make sure ou are the author.', null, { duration: 6000 }))
    });

    snackBarRef.onAction().subscribe(() => undo = true);
  }

  public ngOnDestroy(): void {
    this.routerSubscriber$.unsubscribe();
    this.boardService.currentBoard = <IBoardService>{};
  }
}
