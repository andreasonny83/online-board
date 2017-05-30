import { Injectable, Input } from '@angular/core';


@Injectable()
export class BoardService {

  @Input()
  _currentBoard: string;
  // private  _currentBoard: string = 'miau 2';

  set currentBoard(value: string) {
    console.log('Setter gets called');
    this._currentBoard = value;
  }

  get currentBoard():string {
    console.log('Getter gets called');
    return this._currentBoard;
  }
}
