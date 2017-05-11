import { Component, OnInit } from '@angular/core';

import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
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
}
