import { Component, OnInit } from '@angular/core';

import { AuthService } from '../auth.service';
import { FirebaseService } from '../firebase.service';

import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase/app';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  user: Observable<firebase.User>;

  constructor(
    private authService: AuthService,
    private fireBase: FirebaseService,
  ) {
    this.user = fireBase.user;
  }

  ngOnInit() { }

  logout() {
    this.authService.logout();
  }
}
