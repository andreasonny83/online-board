import { Injectable } from '@angular/core';

export interface IBoardService {
  name: string;
  uid: string;
  posts?: { [key: string]: IBoardPost } | null;
}

@Injectable()
export class BoardService {
  public currentBoard: IBoardService;

  constructor() {
    this.currentBoard = <IBoardService>{};
  }
}
