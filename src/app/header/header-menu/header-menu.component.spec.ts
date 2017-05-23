import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthService } from '../../auth.service';
import { RouterTestingModule } from '@angular/router/testing';
import { FirebaseService } from '../../../firebase';
import { Observable } from 'rxjs/Observable';

import {
  MdToolbarModule,
  MdButtonModule,
  MdMenuModule,
  MdIconModule,
  MdSnackBarModule,
} from '@angular/material';

import { HeaderMenuComponent } from './header-menu.component';

class FirebaseMockService  {
  public user: Observable<any>;
  public userData: any;

  constructor() {
    this.userData = {
      emailVerified: true,
      displayName: 'test user',
      email: 'test@user.com',
      photoURL: null,
      providerId: 'providerId',
      uid: 'uid',
    };

    this.user = Observable.of(this.userData);
  }
}

describe('BoardPageComponent', () => {
  let component: HeaderMenuComponent;
  let fixture: ComponentFixture<HeaderMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MdToolbarModule,
        MdButtonModule,
        MdMenuModule,
        MdIconModule,
        MdSnackBarModule,
        RouterTestingModule,
      ],
      providers: [
        AuthService,
        { provide: FirebaseService, useClass: FirebaseMockService }
      ],
      declarations: [
        HeaderMenuComponent,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
