import { Component, OnInit } from '@angular/core';
import { environment } from '../environments/environment';
import { fadeIn } from './app.animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [fadeIn],
})
export class AppComponent implements OnInit {
  public title: string;
  public homepage: string;
  public floatingClass: boolean;
  public version: string;

  constructor() { }

  ngOnInit() {
    this.version = environment.version;
    this.homepage = environment.homepage;
    this.title = 'Online Board';
  }

  onScroll(event) {
    this.floatingClass = event.target.scrollTop > 0;
  }
}
