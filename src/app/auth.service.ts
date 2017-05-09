import { Injectable } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { FirebaseService } from './firebase.service';
import { MdSnackBar } from '@angular/material';

import { Observable } from 'rxjs/Observable';

@Injectable()
export class AuthService {

  constructor(
    private fb: FirebaseService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MdSnackBar,
  ) {
    fb.user
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

          if (!!res && !!res.uid) {
            this.snackBar.open(`Welcome back ${res.email}`, null, { duration: 6000 });
            return this.router.navigate(['/dashboard']);
          }

          return this.router.navigate(['/login']);
        },
        err => this.router.navigate(['/login']),
      );
  }

  isLoggedIn(): Observable<boolean> {
    return this.fb.user.map((res) => {
      return !!res && !!res.uid;
    });
  }

  register(formModel: IUserRegister): Promise<any> {
    return Promise.resolve(this.fb.register(formModel.email, formModel.password))
      .then(
        res => {
          this.fb.sendEmailVerification();
          this.logout();

          this.snackBar.open(
            `Please, check your inbox to verify that ${res.email}
            belongs to you.`,
            null,
            { duration: 6000 }
          );
          return Promise.resolve();
        },
        err => {
          this.snackBar.open(err.message || 'Server error.', null, { duration: 6000 });
          return Promise.reject(new Error(err));
        }
      ).catch((err) => {
        this.snackBar.open(err.message || 'Server error.', null, { duration: 6000 });
        return Promise.reject(new Error(err));
      });
  }

  login(formModel: IUserLogin): Promise<any> {
    return Promise.resolve(this.fb.login(formModel.email, formModel.password))
      .then(
        res => {},
        err => this.snackBar.open(err.message, null, { duration: 6000 })
      ).catch((err) => {
        this.snackBar.open(err.message || 'Server error.', null, { duration: 6000 });
        return Promise.reject(new Error(err));
      });
  }

  logout(): void {
    this.fb.logout();
  }
}
