import { Component, OnInit, HostBinding } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  @HostBinding('class.back-btn') back = false;

  constructor(
    private route: Router,
  ) {
    route.events.subscribe((url: any) => {
      const page: string = url.urlAfterRedirects;

      this.back = page !== '/dashboard' && page !== '/login';
    });
  }

  ngOnInit() {  }
}
