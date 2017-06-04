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
  boardColumns: IMDColumns[];

  constructor(
    private authService: AuthService,
    private fireBase: FirebaseService,
    private boardService: BoardService,
    public dialog: MdDialog,
  ) {
    this.user = fireBase.user;
  }

  public ngOnInit() { }

  public inviteColaborators(): void {
    this.dialog.open(InviteColaboratorsComponent);
  }

  public logout(): void {
    this.authService.logout();
  }

  public isInsideBoard(): boolean {
    return !!this.boardService.currentBoard && !!this.boardService.currentBoard.uid;
  }

  public downloadBoard(): void {
    const a = document.createElement('a');

    this.generateBoardColumns(3, 3);

    const createdMd = this.generateTable('Goods', 0) +
                      this.generateTable('Bads', 1) +
                      this.generateList('Questions', 2);
    const blob = new Blob([createdMd], {type: 'text/markdown'});
    const url = window.URL.createObjectURL(blob);

    document.body.appendChild(a);
    a.href = url;
    a.download = `${this.boardService.currentBoard.name}.md`;
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }

  private generateTable(title: string, column: number): string {
    const header = this.tableHeader(title);
    const tableEnd = '|-\n|}\n';

    return header + this.boardColumns[column].value + tableEnd;
  }

  private generateList(title: string, column: number): string {
    const header = `=== ${title} ===\n`;

    return header + this.boardColumns[column].value;
  }

  private tableHeader(title: string): string {
    return `=== ${title} ===\n` +
      '{| class="wikitable" style="background-color:#ffffff"\n' +
      '! style="background-color:#FFE4E1" | Item\n' +
      '! style="background-color:#FFE4E1" | Description\n' +
      '! style="background-color:#FFE4E1" | Action\n|-\n';
  }

  private generateBoardColumns(columns: number, questionColumn: number): void {
    let posts = [];
    this.boardColumns = [];

    for (let i = 0; i < columns; i++) {
      this.boardColumns.push({count: 0, value: ''});
    }

    for (let key in this.boardService.currentBoard.posts) {
      if (this.boardService.currentBoard.posts.hasOwnProperty(key)) {
        posts.push(this.boardService.currentBoard.posts[key]);
      }
    }

    posts.map(post => {
      this.boardColumns[post.col].count++;

      if (post.col === questionColumn - 1) {
        return this.boardColumns[post.col]
          .value += `\n- ${post.val} (${post.author})\n`;
      }

      return this.boardColumns[post.col]
        .value += `| ${this.boardColumns[post.col].count}\n| ${post.val} (${post.author})\n|\n|-\n`;
    });
  }
}
