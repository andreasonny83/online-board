import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  public version: string;
  public homepage: string;

  constructor() { }

  ngOnInit() {
    this.version = environment.version;
    this.homepage = environment.homepage;
  }
}
