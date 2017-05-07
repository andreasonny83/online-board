import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl } from '@angular/forms';

import { FirebaseService } from '../firebase.service';
import { MdSnackBar } from '@angular/material';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  boards: Observable<any>;
  newBoardForm: FormGroup;

  constructor(
    private fireBase: FirebaseService,
    private fb: FormBuilder,
    private snackBar: MdSnackBar,
  ) {
    this.boards = fireBase.getBoards();
    this.createForm();
  }

  ngOnInit() { }

  createForm() {
    this.newBoardForm = this.fb.group({
      boardName: ['', Validators.required],
    });
  }

  createBoard() {
    const val = this.newBoardForm.controls.boardName.value;
    this.fireBase.userBoardExisits(val)
      .subscribe(
        res => {
          if (!res.$exists()) {
            this.snackBar.open(`${val} board successfully created!`, null, {duration: 4000});
            return this.fireBase.createBoard(val);
          }

          this.snackBar.open(`A board called ${val} already exisits.`, null, {duration: 4000});
        }
      );
  }

}
