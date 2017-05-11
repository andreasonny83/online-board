import { Injectable } from '@angular/core';

import {
  AngularFireDatabase,
  FirebaseListObservable,
  FirebaseObjectObservable,
} from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

import { MdSnackBar } from '@angular/material';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

@Injectable()
export
class FirebaseService {
  public user: Observable<firebase.User>;
  // public boardsList: FirebaseListObservable<any[]>;
  public usersList: FirebaseListObservable<any[]>;
  public userList: FirebaseListObservable<any[]>;
  public userBoards: FirebaseListObservable<any[]>;
  public boardsList: FirebaseListObservable<any[]>;

  public uid: string;

  constructor(
    private afAuth: AngularFireAuth,
    private db: AngularFireDatabase,
    private snackBar: MdSnackBar,
  ) {
    this.user = afAuth.authState;

    // Sharing a subscriber to be used in auth.service.ts will increase performances
    this.user
      .share()
      .subscribe(
        res => {
          this.uid = res && res.uid;

          if (!!res && !!res.uid) {
            this.usersList = db.list('/users');
            this.usersList.update(this.uid, {lastLogIn: Date.now()});
            this.userList = db.list(`/users/${this.uid}`);
            this.userBoards = db.list(`/users/${this.uid}/boards`);
            this.boardsList = db.list(`/boards`);
          }
        });
  }

  validateString(val: string) {
    const regex = /[\.\#\$\[\]]/g;
    return regex.test(val);
  }

  register(email: string, password: string): firebase.Promise<any> {
    return this.afAuth.auth
      .createUserWithEmailAndPassword(email, password)
      .catch(err => this.snackBar.open(err.message, null, { duration: 6000 }));
  }

  login(email: string, password: string): firebase.Promise<any> {
    return this.afAuth.auth
      .signInWithEmailAndPassword(email, password)
      .catch(err => this.snackBar.open(err.message, null, { duration: 6000 }));
  }

  sendEmailVerification(): firebase.Promise<any> {
    return this.afAuth.auth.currentUser
      .sendEmailVerification()
      .catch(err => this.snackBar.open(err.message, null, { duration: 6000 }));
  }

  getBoard(boardUID: string): FirebaseListObservable<any[]> {
    return this.db.list(`/boards/${boardUID}`);
  }

  getBoardObject(boardUID: string): FirebaseObjectObservable<any[]> {
    return this.db.object(`/boards/${boardUID}`);
  }

  createBoard(boardName: string): firebase.Promise<any> {
    const userBoardData = {};
    const boardData = {
      name: boardName,
      members: {},
      columns: {
        first: {title: 'Goods', color: 'lightgreen', pos: 0 },
        second: {title: 'Bads', color: 'lightpink', pos: 1 },
        third: {title: 'Questions', color: 'lightblue', pos: 2 },
      }
    };

    boardData.members[this.uid] = true;

    return this.boardsList.push(boardData)
      .then((res) => {
        userBoardData[res.key] = boardName;
        this.userList.update('boards', userBoardData);
      })
      .catch(err => this.snackBar.open(err.message, null, { duration: 6000 }));
  }

  removeUserBoard(boardUID: string) {
    this.userBoards
      .remove(boardUID)
      .catch(err => this.snackBar.open(err.message, null, { duration: 6000 }));
  }

  removeBoard(boardUID: string) {
    this.db.list(`/boards/${boardUID}/members`)
      .remove(this.uid)
      .then(() => this.removeUserBoard(boardUID))
      .catch(err => this.snackBar.open(err.message, null, { duration: 6000 }));

    // const targetBoard = this.db.list(`/boards/${boardUID}/members`);

    // targetBoard
      // .subscribe(res => {
        // console.log('removing global board');
        // if (!!res && res.length === 1 && res[0].$key === this.uid) {
          // Delete the entire board record if I'm the only member left in it
          // this.db.list(`/boards/${boardUID}`)
            // .remove()
            // Then delete the board reference from the user boards
            // .then(() => this.removeUserBoard(boardUID))
            // .catch(err => this.snackBar.open(err.message, null, { duration: 6000 }));
        // } else {
          // If the board is still in use by someone else, just remove me from the members
          // this.db.list(`/boards/${boardUID}/members`)
            // .remove(this.uid)
            // Then delete the board reference from the user boards
            // .then(() => this.removeUserBoard(boardUID))
            // .catch(err => this.snackBar.open(err.message, null, { duration: 6000 }));
        // }
      // },
      // err => this.snackBar.open(err.message, null, { duration: 6000 })
    // );
  }

  getSubscriberName(uid: string) {
    const users: any = this.usersList;

    return users.$ref
      .child(uid)
      .once('value')
      .then(function(snapshot) {
        return snapshot.val().name;
      });
  }

  logout(): void {
    this.afAuth.auth.signOut();
  }
}
