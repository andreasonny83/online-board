import { Component, OnInit } from '@angular/core';

import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
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
  back: boolean;

  constructor(
    private authService: AuthService,
    private fireBase: FirebaseService,
    private route: Router,
  ) {
    this.user = fireBase.user;

    route.events.subscribe((url: any) => {
      if (url.urlAfterRedirects !== '/dashboard') {
        this.back = true;
      } else {
        this.back = false;
      }
    });
  }

  ngOnInit() {  }

  logout() {
    this.authService.logout();
  }
}
