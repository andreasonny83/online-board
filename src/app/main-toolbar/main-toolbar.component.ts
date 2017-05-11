import { Component, OnInit } from '@angular/core';

import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-main-toolbar',
  templateUrl: './main-toolbar.component.html',
  styleUrls: ['./main-toolbar.component.css']
})
export class MainToolbarComponent implements OnInit {

  title = 'Online Board';
  back: boolean;

  constructor(
    private authService: AuthService,
    private route: Router,
  ) {
    route.events.subscribe((url: any) => {
      if (url.urlAfterRedirects !== '/dashboard') {
        this.back = true;
      } else {
        this.back = false;
      }
    });
  }

  ngOnInit() {  }

  public getVisibility() {
    if (this.back) {
      return 'visible';
    }
    return 'hidden';
  }
}
