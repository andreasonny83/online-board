import { Component, OnInit } from '@angular/core';
import { environment } from '../environments/environment';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    trigger('fadeIn', [
      state('show', style({ opacity: 1 })),

      transition(':enter', [ // void => *
        style({ opacity: 0 }),
        animate('.3s ease-in'),
      ])
    ])
  ]
})
export class AppComponent implements OnInit {
  public title: string;
  public floatingClass: boolean;
  public version: number;

  ngOnInit() {
    this.version = environment.version;
    this.title = 'Online Board';
  }

  onScroll(event) {
    this.floatingClass = event.target.scrollTop > 0;
  }
}
