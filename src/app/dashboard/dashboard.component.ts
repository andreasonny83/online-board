import { Component, OnInit, HostBinding } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { slideToLeft } from '../app.animations';
import { FirebaseService, FirebaseListObservable } from '../../firebase';
import { MdSnackBar } from '@angular/material';

import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  animations: [ slideToLeft ],
})
export class DashboardComponent implements OnInit {
  @HostBinding('@routerTransition') routerTransition = '';

  public boards: FirebaseListObservable<any[]>;
  public user: Observable<any>;
  public newBoardForm: FormGroup;
  public pageLoading: boolean;
  public creatingBoard: boolean;

  constructor(
    private fireBase: FirebaseService,
    private fb: FormBuilder,
    private snackBar: MdSnackBar,
  ) {
    this.pageLoading = true;
    this.createForm();
    this.boards = fireBase.userBoards;
    this.user = fireBase.user;
  }

  ngOnInit() {
    this.boards.subscribe(res => {
      this.pageLoading = false;
    });
  }

  createForm() {
    this.newBoardForm = this.fb.group({
      boardName: ['', Validators.required],
    });
  }

  createBoard() {
    const val = this.newBoardForm.controls.boardName.value;

    if (this.fireBase.validateString(val)) {
      return this.snackBar.open(`Boards cannot contain ".", "#", "$", "[", or "]"`, null, {duration: 6000});
    }

    this.creatingBoard = true;

    this.fireBase
      .createBoard(val)
      .then(() => {
        this.newBoardForm.reset();
        this.snackBar.open(`${val} board successfully created!`, null, {duration: 6000});
        this.creatingBoard = false;
      })
      .catch(err => {
        this.snackBar.open(err.message, null, {duration: 6000});
        this.creatingBoard = false;
      });
  }

}
