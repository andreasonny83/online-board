import {
  Component,
  OnInit,
  Input,
} from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-main-toolbar',
  templateUrl: './main-toolbar.component.html',
  styleUrls: ['./main-toolbar.component.css'],
})
export class MainToolbarComponent implements OnInit {
  @Input() public floating: boolean;
  @Input() public version: boolean;
  @Input() public title: boolean;

  public back = false;

  constructor(
    private authService: AuthService,
    private route: Router,
  ) {
    route.events.subscribe((url: any) => {
      const page: string = url.urlAfterRedirects;

      this.back = page !== '/dashboard' && page !== '/login';
    });
  }

  ngOnInit() { }
}
