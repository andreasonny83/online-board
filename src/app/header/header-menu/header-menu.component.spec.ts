import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../../auth.service';
import { BoardService } from '../../services/board.service';
import { FirebaseService } from '../../../firebase';

import {
  MdMenuModule,
  MdSnackBarModule,
  MdDialogModule,
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

describe('HeaderMenuComponent', () => {
  let component: HeaderMenuComponent;
  let fixture: ComponentFixture<HeaderMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        MdMenuModule,
        MdSnackBarModule,
        MdDialogModule,
        RouterTestingModule,
      ],
      providers: [
        AuthService,
        BoardService,
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

  it('should create an HeaderMenuComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should create an HeaderMenuComponent', () => {
    expect(component.user).toBeDefined();

    component.user.subscribe(user => {
      expect(user.emailVerified).toBeDefined();
      expect(user.displayName).toBeDefined();
      expect(user.displayName).toBe('test user');
      expect(user.email).toBeDefined();
      expect(user.email).toBe('test@user.com');
      expect(user.photoURL).toBeDefined();
      expect(user.providerId).toBeDefined();
      expect(user.uid).toBeDefined();
    });
  });

  it('should log out the user', () => {
    const authService = TestBed.get(AuthService);

    spyOn(authService, 'logout');

    component.logout();
    expect(authService.logout).toHaveBeenCalled();
  });

  describe('Display the user email in the header', () => {
    it('should display the user email when the user\'s email has been verified', () => {
      const de = fixture.debugElement.query(By.css('.user-name'));
      const el: HTMLElement = de.nativeElement;

      expect(el.innerText).toBe('test@user.com');
    });

    it('should not display the user menu when the user is not verified', () => {
      const firebaseService = TestBed.get(FirebaseService);
      firebaseService.userData.emailVerified = false;

      fixture.detectChanges();

      const de = fixture.debugElement.query(By.css('.menu-button'));

      expect(de).toBe(null);
    });
  });
});
