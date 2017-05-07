import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl } from '@angular/forms';

import { FirebaseService } from '../firebase.service';

import { Observable } from 'rxjs/Observable';

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
  ) {
    this.boards = fireBase.getBoards();
    this.createForm();
  }

  ngOnInit() { }

  createForm() {
    this.newBoardForm = this.fb.group({
      boardName: ['', this.validateBoard.bind(this)],
    });
  }

  validateBoard(formCtrl: FormControl) {
    return this.fireBase.userBoardExisits(formCtrl.value)
      .then(val => {
        console.log(val);
        // console.log(val.$exists());
        // if (!val.$exists()) {
          // return null;
        // }

        return {
          'validateBoard': { valid: false }
        };
      }, () => {
        return null;
      });
  }

  createBoard() {
    this.fireBase.userBoardExisits('1a23');
      // .subscribe(val => console.log(val.$exists()));
      // .map(val => console.log(val));
  }

}
