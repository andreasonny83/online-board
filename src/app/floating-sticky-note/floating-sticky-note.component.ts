import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirebaseService, FirebaseObjectObservable } from '../../firebase';
import { BoardService } from '../services/board.service';
import { MdSnackBar } from '@angular/material';

@Component ({
  selector:
    'app-floating-sticky-note',
  templateUrl: './floating-sticky-note.html',
  styleUrls: ['./floating-sticky-note.scss'],
})
export class FloatingStickyNoteComponent implements OnInit {
  @ViewChild('textArea')
  public textArea;

  public active: boolean;
  public stickyForm: FormGroup;

  private boardObj: FirebaseObjectObservable<any>;

  constructor(
    private fb: FormBuilder,
    private fireBase: FirebaseService,
    private boardService: BoardService,
    private snackBar: MdSnackBar,
  ) {
    this.stickyForm = this.fb.group({
       chose: ['', Validators.required ],
       newPost: ['', Validators.required ],
    });
  }

  ngOnInit() {
    this.boardObj = this.fireBase.getBoardObject(this.boardService.currentBoard.uid);
  }

  focus(): void {
    if (!!this.active) {
      return;
    }

    setTimeout(() => {
      this.textArea.nativeElement.focus();
      this.stickyForm.controls['newPost'].setValue('');
    }, 0);
  }

  public pushPost(): void {
    const authorName = this.fireBase.userInfo.name;
    const authorUID = this.fireBase.userInfo.uid;

    if (this.stickyForm.invalid) {
      this.snackBar.open(`
        Please, make sure the feedback is not empty
        and you have selected a column in where to push this message to.`,
        null, { duration: 6000 });

      return;
    }

    this.boardObj.$ref.ref
      .child('posts')
      .push({
        val: this.stickyForm.controls['newPost'].value,
        author: authorName,
        authorUID: authorUID,
        col: this.stickyForm.controls['chose'].value.pos,
      })
      .then(() => this.active = false)
      .catch(err => {
        this.snackBar.open(`
          Error. Only collaborators have the rights to write new feedbacks.`,
          null, { duration: 6000 });
      });

      this.stickyForm.reset();
  }
}
