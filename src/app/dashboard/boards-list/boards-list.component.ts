import { Component, OnInit, Input } from '@angular/core';
import { FirebaseService } from '../../../firebase';
import { MdSnackBar } from '@angular/material';

import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-boards-list',
  templateUrl: './boards-list.component.html',
  styleUrls: ['./boards-list.component.scss'],
})
export class BoardsListComponent implements OnInit {
  @Input() public loading: boolean;
  @Input() public boards: Observable<any[]>;

  public busy: number;

  constructor(
    private fireBase: FirebaseService,
    private snackBar: MdSnackBar,
  ) {
    this.loading = true;
  }

  ngOnInit() {}

  deleteBoard(board: any, index: number) {
    this.busy = index;

    this.fireBase
      .removeBoard(board.$key)
      .then(() => this.busy = null)
      .catch(err => this.errorHandler(err));
  }

  errorHandler(err: any) {
    this.snackBar.open(err.message, null, {duration: 6000});
    this.busy = null;
  }
}
