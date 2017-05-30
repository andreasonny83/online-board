import { Component, OnInit } from '@angular/core';
import { BoardService } from '../../services/board.service';

@Component({
  selector: 'app-invite-colaborators',
  templateUrl: './invite-colaborators.component.html',
})

export class InviteColaboratorsComponent implements OnInit {

  boardID: string;
  constructor(
      private boardService: BoardService
  ) {}

  ngOnInit() {
    this.boardID = this.boardService.currentBoard;
  }
}
