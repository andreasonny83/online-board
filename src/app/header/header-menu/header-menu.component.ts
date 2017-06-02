import { Component, OnInit } from '@angular/core';

import { MdDialog } from '@angular/material';
import { AuthService } from '../../auth.service';
import { FirebaseService } from '../../../firebase';
import { BoardService } from '../../services/board.service';
import { InviteColaboratorsComponent } from '../invite-colaborators/invite-colaborators.component';

import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase/app';

@Component({
  selector: 'app-header-menu',
  templateUrl: './header-menu.component.html',
  styleUrls: ['./header-menu.component.scss'],
})
export class HeaderMenuComponent implements OnInit {
  user: Observable<firebase.User>;

  constructor(
    private authService: AuthService,
    private fireBase: FirebaseService,
    private boardService: BoardService,
    public dialog: MdDialog,
  ) {
    this.user = fireBase.user;
  }

  public ngOnInit() { }

  public inviteColaborators() {
    this.dialog.open(InviteColaboratorsComponent);
  }

  public logout() {
    this.authService.logout();
  }

  public downloadBoard() { }

  public isInsideBoard() {
    return !!this.boardService.currentBoard && !!this.boardService.currentBoard.uid;
  }

  public downloadBoard() {
     const a = document.createElement('a');
     document.body.appendChild(a);
     const blob = new Blob(['test'], {type: 'text/markdown'}),
     url = window.URL.createObjectURL(blob);
     a.href = url;
     a.download = 'testa.md';
     a.click();
     window.URL.revokeObjectURL(url);
     document.body.removeChild(a);
  };
}
