import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { FirebaseService, FirebaseObjectObservable } from '../../firebase';
import { BoardService, IBoardService } from '../services/board.service';

@Component ({
  selector:
    'app-floating-sticky-note, app-floating-sticky-note[activeSticky]',
  templateUrl: './floating-sticky-note.html',
  styleUrls: ['./floating-sticky-note.scss'],
})
export class FloatingStickyNoteComponent implements OnInit {
  @Input()
  public activeSticky;

  @ViewChild('textArea')
  public textArea;

  public stickyForm: FormGroup;

  private boardObj: FirebaseObjectObservable<any>;

  constructor(
    private fb: FormBuilder,
    private fireBase: FirebaseService,
    private boardService: BoardService,
  ) {}

  ngOnInit() {
    this.boardObj = this.fireBase.getBoardObject(this.boardService.currentBoard.uid);

    this.stickyForm = this.fb.group({
       chose: ['', Validators.required ],
       newPost: ['', Validators.required ],
    });
  }

  focus() {
    setTimeout(() => {
      this.textArea.nativeElement.focus();
      this.textArea.nativeElement.value = '';
    }, 100);
  }

  public pushPost(): void {
    const authorName = this.fireBase.userInfo.name;
    const authorUID = this.fireBase.userInfo.uid;

    this.boardObj.$ref.ref
      .child('posts')
      .push({
        val: this.fb.control['newPost'].value,
        author: authorName,
        authorUID: authorUID,
        col: this.stickyForm.controls['chose'].value.pos,
      })
      .catch(err => {
        // this.snackBar.open(`
        //   Please, make sure the feedback is not empty
        //   and you are a collaborator on this board.`,
        //   null, { duration: 6000 });
      });

      this.stickyForm.reset();
  }
}
