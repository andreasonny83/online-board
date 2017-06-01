import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-dropping-card',
  template: `
  <div class="dropping-card"
       (dragover)="allowDrop($event)"
       (drop)="onDrop($event)">
    <div class="dropping-card__box"
         [class.show]="dragging">
      Drop Here
    </div>
  </div>
  `,
})
export class DroppingCardComponent {
  @Input() public showDroppingBoxes: boolean;
  dragging: boolean;

  public onDrop(event: DragEvent) {
    const postKey = event.dataTransfer.getData('postKey');
    this.dragging = false;

    event.preventDefault();
  }

  public allowDrop(event: DragEvent) {
    event.preventDefault();
  }

  public onDropOutside(event: DragEvent) {
    this.dragging = false;
    event.preventDefault();
  }
}
