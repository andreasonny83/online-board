import { Component } from '@angular/core';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title: string;
  floatingClass: boolean;
  version: number;

  constructor() {
    this.version = environment.version;
    this.title = 'Online Board';
  }

  onScroll(event) {
    this.floatingClass = event.target.scrollTop > 0;
  }
}
