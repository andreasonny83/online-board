import { Component, OnInit, Input, Output, HostBinding, EventEmitter } from '@angular/core';
import { FirebaseService, FirebaseObjectObservable } from '../../../firebase';
import { fadeInOut } from '../../app.animations';

@Component({
  selector: 'app-dropping-card',
  templateUrl: './dropping-card.component.html',
  styleUrls: ['./dropping-card.component.scss'],
  animations: [fadeInOut],
})
export class DroppingCardComponent implements OnInit {
  @HostBinding('@fadeInOut') routerTransition = '';

  @Input() public show: boolean;
  @Input() public columnID: string;
  @Output() onDropped = new EventEmitter<DragEvent>();

  private boardObj: FirebaseObjectObservable<any>;

  constructor(
    private fireBase: FirebaseService,
  ) { }

  ngOnInit() { }

  public onDrop(event: DragEvent) {
    const boardID = event.dataTransfer.getData('boardID');
    const postKey = event.dataTransfer.getData('postKey');


    this.fireBase
      .getBoardObject(`${boardID}/posts/${postKey}`)
      .update({col: this.columnID});

    this.onDropped.emit(event);
  }

  public allowDrop(event: DragEvent) {
    event.preventDefault();
  }
}
