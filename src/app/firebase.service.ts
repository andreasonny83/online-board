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
export
class FirebaseService {
  public user: Observable<firebase.User>;
  // public boardsList: FirebaseListObservable<any[]>;
  public usersList: FirebaseListObservable<any[]>;

  private uid: string;

  constructor(
    private afAuth: AngularFireAuth,
    private db: AngularFireDatabase,
  ) {
    this.user = afAuth.authState;

    afAuth.authState.subscribe(
      res => {
        this.uid = res && res.uid;

        if (!!res && !!res.uid) {
          this.usersList = db.list(`/users/${this.uid}`);
          db.list('/users').update(this.uid, {lastLogIn: Date.now()});
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

  sendEmailVerification(): void {
    this.afAuth.auth.currentUser.sendEmailVerification();
  }

  getBoards(): FirebaseListObservable<any[]> {
    return this.db.list(`/users/${this.uid}/boards`);
  }

  userBoardExisits(boardName: string): FirebaseObjectObservable<any> {
    return this.db.object(`/users/${this.uid}/boards/${boardName}`);
  }

  getBoard(boardUID: string): FirebaseListObservable<any[]> {
    return this.db.list(`/boards/${boardUID}`);
  }

  createBoard(boardName: string): firebase.Promise<any> {
    return this.db.list(`/boards`).push({ name: boardName });

    // return this.db.list(`/users/${this.uid}/boards`)
      // .update(boardName, { status: true });
  }

  deleteBoard(board: any) {
    // console.log(board);
    this.db.list(`/boards/${board.id}/`).remove();
      // .subscribe(
        // res => {
          // console.log(res);
        // }
      // );
  }

  logout(): void {
    this.afAuth.auth.signOut();
  }
}
