import { Injectable } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { FirebaseService } from '../firebase';
import { MdSnackBar } from '@angular/material';

import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase/app';

@Injectable()
export class AuthService {

  constructor(
    private fireBase: FirebaseService,
    private router: Router,
    private snackBar: MdSnackBar,
  ) {
    fireBase.user
      .share()
      .subscribe(
        res => {
          // New users should verify their email address first
          if (!!res && !res.emailVerified) {
            this.snackBar.open(
              `You must verify your email address first.
              Check your inbox at ${res.email} and click the activation link inside our email.`,
              null,
              { duration: 6000 }
            );

            this.logout();

            return this.router.navigate(['/login']);
          }

          if (!!res && !!res.uid && res.email && res.emailVerified) {
            if (this.router.url === '/login') {
              this.snackBar.open(`Welcome back ${res.email}`, null, { duration: 6000 });
              this.router.navigate(['/dashboard']);
            }

            return;
          }

          return this.router.navigate(['/login']);
        },
        err => this.router.navigate(['/login']),
      );
  }

  isLoggedIn(): Observable<boolean> {
    return this.fireBase
      .user
      .map(res => res && !!res.uid);
  }

  register(formModel: IUserRegister): firebase.Promise<any> {
    return this.fireBase
      .register(formModel.email, formModel.password, formModel.displayName)
      .then(() => this.snackBar
        .open('Please, check your inbox to verify that it belongs to you.', null, { duration: 6000 }))
      .catch((err) => {
        this.snackBar.open(err.message || 'Server error.', null, { duration: 6000 });
      });
  }

  login(formModel: IUserLogin): firebase.Promise<any> {
    return this.fireBase
      .login(formModel.email, formModel.password)
      .then(() => {})
      .catch((err) => {
        this.snackBar.open(err.message || 'Server error.', null, { duration: 6000 });
      });
  }

  redirectToDasboard(): void {
    this.router.navigate(['/dashboard']);
  }

  logout(): void {
    this.fireBase.logout();
  }
}
