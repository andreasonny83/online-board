import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { BoardService } from '../../services/board.service';

@Component({
  selector: 'app-invite-colaborators',
  templateUrl: './invite-colaborators.component.html',
})

export class InviteColaboratorsComponent implements OnInit{

  boardID: string;
  constructor(
    private route: ActivatedRoute,
      private boardService: BoardService
  ) {}

  ngOnInit() {
    console.log('boardService.currentBoard', this.boardService.currentBoard);
  }

  getBoardKey() {

  }
}
