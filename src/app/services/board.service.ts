import { Injectable, Input } from '@angular/core';


@Injectable()
export class BoardService {

  @Input()
  _currentBoard: string;

  set currentBoard(value: string) {
    this._currentBoard = value;
  }

  get currentBoard(): string {
    return this._currentBoard;
  }
}
