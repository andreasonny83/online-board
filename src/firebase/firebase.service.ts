import { Injectable } from '@angular/core';

import {
  AngularFireDatabase,
  FirebaseListObservable,
  FirebaseObjectObservable,
} from 'angularfire2/database';

import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class FirebaseService {
  public user: Observable<firebase.User>;
  public usersList: FirebaseListObservable<any[]>;
  public userList: FirebaseListObservable<any[]>;
  public userBoards: FirebaseListObservable<any[]>;
  public boardsList: any;
  public dbRef: firebase.database.Reference;

  public uid: string;

  constructor(
    private afAuth: AngularFireAuth,
    private db: AngularFireDatabase,
  ) {
    this.user = afAuth.authState;

    // Sharing a subscriber to be used in auth.service.ts will increase performances
    this.user
      .share()
      .subscribe(
        res => {
          this.uid = res && res.uid;

          if (!!res && !!res.uid) {
            this.dbRef = firebase.database().ref('/');
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
      .createUserWithEmailAndPassword(email, password);
  }

  login(email: string, password: string): firebase.Promise<any> {
    return this.afAuth.auth
      .signInWithEmailAndPassword(email, password);
  }

  sendEmailVerification(): firebase.Promise<any> {
    return this.afAuth.auth.currentUser
      .sendEmailVerification();
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
      });
  }

  removeBoard(boardUID: string): firebase.Promise<any> {
    return this.dbRef
      .child(`boards/${boardUID}/members`)
      .child(this.uid)
      .remove(() => {
        // Try to remove the entire board if this was the last member
        this.dbRef.child('boards').child(boardUID).remove();
        // Remove the reference from the user boards
        this.dbRef.child(`users/${this.uid}/boards`).child(boardUID).remove();
      });
  }

  findUserBoards() {
    return this.db.list(`/boards`, {
      query: {
        // startAt: '-KjqxtaBNBzpk7nwRidk'
        limitToFirst: 2
        // equalTo: '-KjqxtaBNBzpk7nwRidk'
      }
    });
  }

  logout(): void {
    this.afAuth.auth.signOut();
  }
}
