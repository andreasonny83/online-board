import { Component, OnInit } from '@angular/core';

import { AuthService } from '../../auth.service';
import { FirebaseService } from '../../../firebase';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase/app';
import { MdDialog } from '@angular/material';
import { InviteColaboratorsComponent } from '../invite-colaborators/invite-colaborators.component';

@Component({
  selector: 'app-header-menu',
  templateUrl: './header-menu.component.html',
  styleUrls: ['./header-menu.component.scss'],
  entryComponents: [ InviteColaboratorsComponent ]
})
export class HeaderMenuComponent implements OnInit {
  user: Observable<firebase.User>;

  constructor(
    private authService: AuthService,
    private fireBase: FirebaseService,
    public dialog: MdDialog,
  ) {
    this.user = fireBase.user;
  }

  public inviteColaborators() {
    this.dialog.open(InviteColaboratorsComponent);
  }

  ngOnInit() {}

  logout() {
    this.authService.logout();
  }

  downloadBoard() {}
}
