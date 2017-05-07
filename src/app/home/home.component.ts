import { Component, OnInit, HostBinding } from '@angular/core';

import { AuthService } from '../auth.service';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  items: FirebaseListObservable<any[]>;
  user: Observable<firebase.User>;

  currUser: any;

  constructor(
    private authService: AuthService,
    afAuth: AngularFireAuth,
    db: AngularFireDatabase,
  ) {
    this.user = afAuth.authState;
    this.user.subscribe(res => this.currUser = res);
    this.items = db.list('boards');
    // this.items = db.list('/items', { preserveSnapshot: true });
  }

  ngOnInit() {
    // this.items
    //   .subscribe(snapshots => {
    //     snapshots.forEach(snapshot => {
    //       console.log(snapshot.key);
    //       console.log(snapshot.val());
    //     });
    //   });
  }

  logout() {
    this.authService.logout();
  }
}
