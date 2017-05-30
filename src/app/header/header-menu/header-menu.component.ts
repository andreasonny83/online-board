import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth.service';
import { FirebaseService } from '../../../firebase';

import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase/app';

@Component({
  selector: 'app-header-menu',
  templateUrl: './header-menu.component.html',
  styleUrls: ['./header-menu.component.css']
})
export class HeaderMenuComponent implements OnInit {
  user: Observable<firebase.User>;

  constructor(
    private authService: AuthService,
    private fireBase: FirebaseService,
  ) {
    this.user = fireBase.user;
  }

  ngOnInit() { }

  public logout() {
    this.authService.logout();
  }

  public downloadBoard() {
    return;
  }

  public goTo(route: string) {
    return;
  }
}
