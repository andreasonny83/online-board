import { Component, OnInit } from '@angular/core';

import { MdDialog } from '@angular/material';
import { AuthService } from '../../auth.service';
import { FirebaseService } from '../../../firebase';
import { BoardService } from '../../services/board.service';
import { InviteColaboratorsComponent } from '../invite-colaborators/invite-colaborators.component';

import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase/app';

interface IMDColumns {
  count: number;
  value: string;
}

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

  public isInsideBoard() {
    return !!this.boardService.currentBoard && !!this.boardService.currentBoard.uid;
  }

  public downloadBoard() {
    const createdMd = this.goodsTable() + '\n' + this.badsTable() + '\n' + this.questionsList();

     const a = document.createElement('a');
     document.body.appendChild(a);
     const blob = new Blob([createdMd], {type: 'text/markdown'}),
     url = window.URL.createObjectURL(blob);
     a.href = url;
     a.download = this.boardService.currentBoard.name + '.md';
     a.click();
     window.URL.revokeObjectURL(url);
     document.body.removeChild(a);
  };

  private goodsTableHeader() {
    return  '=== Goods ===\n' +
            '{| class="wikitable" style="background-color:#ffffff"\n' +
            '! style="background-color:#f0fff0" | Item\n' +
            '! style="background-color:#f0fff0" | Description\n' +
            '! style="background-color:#f0fff0" | Action\n' +
            '|-\n'
  }

  private goodsTable() {
    const column = this.createBoardColumns();
    const header = this.goodsTableHeader();
    const tableEnd = '|-\n|}';

    return header + column[0].value + tableEnd;
  }

  private badsTableHeader() {
    return  '=== Bads ===\n' +
            '{| class="wikitable" style="background-color:#ffffff"\n' +
            '! style="background-color:#FFE4E1" | Item\n' +
            '! style="background-color:#FFE4E1" | Description\n' +
            '! style="background-color:#FFE4E1" | Action\n' +
            '|-\n'
  }

  private badsTable() {
    const column = this.createBoardColumns();
    const header = this.badsTableHeader();
    const tableEnd = '|-\n|}';

    return header + column[1].value + tableEnd;
  }

  private questionsHeader() {
    return  '=== Questions ===\n'
  }

  private questionsList() {
    const column = this.createBoardColumns();
    const header = this.questionsHeader();
    const tableEnd = '|-\n|}';

    return header + column[2].value;
  }

  private createBoardColumns() {
    const mdColumns: IMDColumns[] = [
      {
        count: 0,
        value: ''
      },
      {
        count: 0,
        value: ''
      },
      {
        count: 0,
        value: ''
      }
    ];

    const posts = this.boardService.currentBoard.posts;
      for ( const key in posts) {
        if (key) {
          const post = posts[key];
          const author = post.author;
          const col = post.col;
          const value = post.val;
          mdColumns[col].count += 1;

          if (col !== 2) {
            mdColumns[col].value +=
            '| ' + mdColumns[col].count + '\n' +
            '| ' + value + ' (' + author + ')' + '\n' +
            '|\n' +
            '|-\n';
          } else {
            mdColumns[col].value +=
            '\n' +
            '- ' + value + ' (' + author + ')' + '\n';
          }
        }
      }

      return mdColumns;
  }
}
