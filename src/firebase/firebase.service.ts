import { Injectable } from '@angular/core';

import {
  AngularFireDatabase,
  FirebaseListObservable,
  FirebaseObjectObservable,
} from 'angularfire2/database';

import {
  Http,
  Response,
  RequestOptions,
  Headers,
} from '@angular/http';

import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { MdSnackBar } from '@angular/material';

import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class FirebaseService {
  public user: Observable<firebase.User>;
  public usersList: FirebaseListObservable<any[]>;
  public userList: FirebaseListObservable<any[]>;
  public userInvites: FirebaseListObservable<any[]>;
  public userBoards: FirebaseListObservable<any[]>;
  public boardsList: any;
  public dbRef: firebase.database.Reference;

  public uid: string;
  public userInfo: IUserInfo;

  private isRegistering: boolean;

  constructor(
    private afAuth: AngularFireAuth,
    private db: AngularFireDatabase,
    private snackBar: MdSnackBar,
    private http: Http,
  ) {
    this.isRegistering = false;
    this.user = afAuth.authState;

    // Sharing a subscriber to be used in auth.service.ts will increase performances
    this.user
      .share()
      .subscribe(
        res => {
          if (!!res && !!res.uid && !!res.emailVerified) {
            // User is logged in and verified
            this.uid = res && res.uid;
            this.dbRef = firebase.database().ref('/');
            this.usersList = this.db.list('/users');
            this.usersList.update(this.uid, {lastLogIn: Date.now()});
            this.userList = this.db.list(`/users/${this.uid}`);
            this.userBoards = this.db.list(`/users/${this.uid}/boards`);
            this.boardsList = this.db.list(`/boards`);
            this.userInvites = this.db.list('/invites', {query: { orderByChild: 'email', equalTo: res.email }} );

            this.updateUserInfo();
            this.checkForInvites();
          }

          if (!!res && !res.emailVerified && !this.isRegistering) {
            // if the user is registering don't logout
            this.logout();
          }
        });
  }

  checkForInvites() {
    const self = this;

    this.userInvites
      .subscribe(invites => {
        invites.forEach((invite)  => {
          const boardElement = {};
          const boardMember = {};
          boardElement[invite.boardID] = invite.boardName;
          boardMember[self.uid] = true;

          self.getBoard(invite.boardID)
            .update('members', boardMember);

          self.userList
            .update(`boards`, boardElement)
            .then(() => {
              self.db.list('/invites').remove(invite.$key);
              self.snackBar.open(`
                Wow! Looks like someone invited you to collaborate with a new board.
                Check out your dashboard.`,
                null, { duration: 6000 });
            });
        });
      });
  }

  public validateString(val: string) {
    const regex = /[\.\#\$\[\]]/g;
    return regex.test(val);
  }

  public register(email: string, password: string, userName: string): firebase.Promise<any> {
    return this.afAuth.auth
      .createUserWithEmailAndPassword(email, password)
      .then(() => {
        this.sendEmailVerification();
        this.isRegistering = true;

        this.updateUsersTable(
          this.afAuth.auth.currentUser.uid,
          this.afAuth.auth.currentUser.email,
          userName,
        );
      });
  }

  public login(email: string, password: string): firebase.Promise<any> {
    return this.afAuth.auth
      .signInWithEmailAndPassword(email, password);
  }

  public sendEmailVerification(): firebase.Promise<any> {
    return this.afAuth.auth.currentUser
      .sendEmailVerification();
  }

  public resetEmail(email: string): firebase.Promise<any> {
    return this.afAuth.auth.sendPasswordResetEmail(email);
  }

  public updateUsersTable(uid: string, email: string, displayName: string) {
    const self = this;

    self.db
      .list('/users')
      .update(uid, {
        email: email,
        name: displayName,
        uid: uid,
      })
      .then(() => self.logout())
      .catch(() => self.logout());
  }

  public getBoard(boardUID: string): FirebaseListObservable<any[]> {
    return this.db.list(`/boards/${boardUID}`);
  }

  public getBoardObject(boardUID: string): FirebaseObjectObservable<any> {
    return this.db.object(`/boards/${boardUID}`);
  }

  public createBoard(boardName: string): firebase.Promise<any> {
    const userBoardData = {};
    const boardData = {
      name: boardName,
      members: {},
      cols: [
        {title: 'Goods', icon: 'sentiment_very_satisfied', color: 'lightgreen', pos: 0 },
        {title: 'Bads', icon: 'mood_bad', color: 'lightpink', pos: 1 },
        {title: 'Questions', icon: 'sentiment_neutral', color: 'lightblue', pos: 2 },
      ]
    };

    boardData.members[this.uid] = true;

    return this.boardsList.push(boardData)
      .then((res) => {
        userBoardData[res.key] = boardName;
        this.userList.update('boards', userBoardData);
      });
  }

  public removeBoard(boardUID: string): firebase.Promise<any> {
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

  public inviteCollaborator(body: any, collaboratorEmail: string, boardID: string, boardName: string): Observable<any> {
    const headers = new Headers({ 'Content-Type': 'application/json' }); // Set content type to JSON
    const options = new RequestOptions({ headers: headers }); // Create a request option
    const self = this;

    if (!collaboratorEmail) {
      return Observable.throw('An email address is required.');
    }

    if (!body || !boardID || !boardName) {
      return Observable.throw('Something wen wrong while trying to send the email.');
    }

    return new Observable(observer => {
      this.addCollaborator(collaboratorEmail, boardID, boardName)
        .toPromise()
        .then(() => this.sendEmail(body, options, observer))
        .catch(err => observer.error(`Ops! It looks like you don't have permissions to add collaboartors to this board.`));
      });
  }

  public logout(): void {
    this.afAuth.auth.signOut();
    this.uid = null;
    this.isRegistering = false;
  }

  private updateUserInfo() {
    this.userInfo = <IUserInfo>{};

    const userTable$ = this.db.list(`/users/${this.uid}`, { preserveSnapshot: true})
      .subscribe(snapshots => {
        snapshots.forEach((snapshot: any) => {
          if (snapshot.key && snapshot.val()) {
            this.userInfo[snapshot.key] = snapshot.val();
          }
        });

        userTable$.unsubscribe();
      },
      err => this.userInfo = <IUserInfo>{},
    );
  }

  private sendEmail(body: any, options: RequestOptions, observer: Observer<any>) {
    return this.http
      .post(`https://node-mailsender.herokuapp.com/send`, JSON.stringify(body), options)
      .map(res => res.json())
      .subscribe(
        res => {
          if (!!res.sent && /^250 OK/.test(res.sent)) {
            observer.next(true);
            observer.complete();
          } else {
            observer.error(`
              The collaborator has been added to the board
              but it has not been possible to send an email invitation to the user.`);
          }
        },
        err => observer.error(`
          The collaborator has been added to the board but
          it has not been possible to send an email invitation to the user.`));
  }

  private addCollaborator(email: string, boardID: string, boardName: string): Observable<any> {
    return new Observable(observer => {
      this.getBoard(`${boardID}/invites`)
        .push({'email': email})
        .then(() => {
          this.db
            .list('/invites')
            .push({
              email: email,
              boardID: boardID,
              boardName: boardName,
            })
            .then(() => observer.complete())
            .catch(() => observer.error());
        })
        .catch(() => observer.error());
      });
  }
}
