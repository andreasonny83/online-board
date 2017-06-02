import {
  async,
  fakeAsync,
  tick,
  ComponentFixture,
  TestBed,
  inject
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from '../auth.service';
import { LoginComponent } from './login.component';
import { FirebaseService } from '../../firebase';
import { ReactiveFormsModule } from '@angular/forms';
import {
  MdInputModule,
  MdSnackBarModule,
  MdDialogModule,
  MdSnackBar,
} from '@angular/material';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase/app';

class FirebaseServiceStub  {
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

class AuthServiceStub  {
  public shouldLogIn: boolean;

  constructor() { }

  public login(formModel: any): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.shouldLogIn) {
        reject('error');
      } else {
        resolve(true);
      }
    });
  }
}

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let loginBtn: DebugElement;
  let registerBtn: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        ReactiveFormsModule,
        MdInputModule,
        MdSnackBarModule,
        MdDialogModule,
        RouterTestingModule,
      ],
      providers: [
        { provide: AuthService, useClass: AuthServiceStub },
        { provide: FirebaseService, useClass: FirebaseServiceStub },
      ],
      declarations: [
        LoginComponent,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    loginBtn = fixture.debugElement.query(By.css('.form__login button[type="submit"]'));
    registerBtn = fixture.debugElement.query(By.css('.form__register button[type="submit"]'));
  });

  it('should create a LoginComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should create a login and a register form', () => {
    expect(component.loginForm).toBeDefined();
    expect(component.registerForm).toBeDefined();
  });

  it('the forms should be initially invalid', () => {
    expect(component.loginForm.valid).toBeFalsy();
    expect(component.registerForm.valid).toBeFalsy();
  });

  it('the login and register buttons should be initially disabled', () => {
    expect(loginBtn.nativeElement.getAttribute('disabled')).toBe('');
    expect(registerBtn.nativeElement.getAttribute('disabled')).toBe('');
  });

  describe('Login form', () => {
    it('the login form should be invalid with an invalid email address', () => {
      component.loginForm.controls['email'].setValue('wrongemail');
      fixture.detectChanges();
      expect(loginBtn.nativeElement.getAttribute('disabled')).toBe('');
      expect(component.loginForm.valid).toBeFalsy();

      component.loginForm.controls['email'].setValue('wrongemail@.');
      component.loginForm.controls['password'].setValue('123456');
      fixture.detectChanges();
      expect(loginBtn.nativeElement.getAttribute('disabled')).toBe('');
      expect(component.loginForm.valid).toBeFalsy();

      component.loginForm.controls['email'].setValue('validemail@@test.com');
      component.loginForm.controls['password'].setValue('123456');
      fixture.detectChanges();
      expect(loginBtn.nativeElement.getAttribute('disabled')).toBe('');
      expect(component.loginForm.valid).toBeFalsy();
    });

    it('the login form should be invalid with a not valid password', () => {
      component.loginForm.controls['email'].setValue('validemail@test.com');
      component.loginForm.controls['password'].setValue('123');
      fixture.detectChanges();
      expect(loginBtn.nativeElement.getAttribute('disabled')).toBe('');
      expect(component.loginForm.valid).toBeFalsy();

      component.loginForm.controls['password'].setValue('12345');
      fixture.detectChanges();
      expect(loginBtn.nativeElement.getAttribute('disabled')).toBe('');
      expect(component.loginForm.valid).toBeFalsy();
    });

    it('the login form should be valid only when an email address and password are provided', () => {
      component.loginForm.controls['email'].setValue('validemail@test.com');
      component.loginForm.controls['password'].setValue('123456');
      fixture.detectChanges();
      expect(loginBtn.nativeElement.getAttribute('disabled')).toBe(null);
      expect(component.loginForm.valid).toBeTruthy();
    });
  });

  describe('Register form', () => {
    it('the register form should be invalid with an invalid email address', () => {
      component.registerForm.controls['email'].setValue('wrongemail');
      fixture.detectChanges();
      expect(registerBtn.nativeElement.getAttribute('disabled')).toBe('');
      expect(component.loginForm.valid).toBeFalsy();

      component.registerForm.controls['email'].setValue('wrongemail@.');
      component.registerForm.controls['password'].setValue('123456');
      fixture.detectChanges();
      expect(registerBtn.nativeElement.getAttribute('disabled')).toBe('');
      expect(component.registerForm.valid).toBeFalsy();

      component.registerForm.controls['email'].setValue('validemail@@test.com');
      component.registerForm.controls['password'].setValue('123456');
      fixture.detectChanges();
      expect(registerBtn.nativeElement.getAttribute('disabled')).toBe('');
      expect(component.registerForm.valid).toBeFalsy();
    });

    it('the register form should be invalid with a not valid password', () => {
      component.registerForm.controls['email'].setValue('validemail@test.com');
      component.registerForm.controls['password'].setValue('123');
      fixture.detectChanges();
      expect(registerBtn.nativeElement.getAttribute('disabled')).toBe('');
      expect(component.registerForm.valid).toBeFalsy();

      component.registerForm.controls['password'].setValue('12345');
      fixture.detectChanges();
      expect(registerBtn.nativeElement.getAttribute('disabled')).toBe('');
      expect(component.registerForm.valid).toBeFalsy();
    });

    it('the register form should be invalid with a not valid display name', () => {
      component.registerForm.controls['email'].setValue('validemail@test.com');
      component.registerForm.controls['password'].setValue('123456');
      component.registerForm.controls['confirmPassword'].setValue('123456');
      fixture.detectChanges();
      expect(registerBtn.nativeElement.getAttribute('disabled')).toBe('');
      expect(component.registerForm.valid).toBeFalsy();

      component.registerForm.controls['email'].setValue('validemail@test.com');
      component.registerForm.controls['password'].setValue('123456');
      component.registerForm.controls['confirmPassword'].setValue('123456');
      component.registerForm.controls['displayName'].setValue('Jon');
      fixture.detectChanges();
      expect(registerBtn.nativeElement.getAttribute('disabled')).toBe('');
      expect(component.registerForm.valid).toBeFalsy();
    });

    it('the register form should be invalid with an invalid password confirmation', () => {
      component.registerForm.controls['email'].setValue('validemail@test.com');
      component.registerForm.controls['password'].setValue('123456');
      component.registerForm.controls['displayName'].setValue('John');
      fixture.detectChanges();
      expect(registerBtn.nativeElement.getAttribute('disabled')).toBe('');
      expect(component.registerForm.valid).toBeFalsy();

      component.registerForm.controls['email'].setValue('validemail@test.com');
      component.registerForm.controls['password'].setValue('123456');
      component.registerForm.controls['confirmPassword'].setValue('654321');
      component.registerForm.controls['displayName'].setValue('John');
      fixture.detectChanges();
      expect(registerBtn.nativeElement.getAttribute('disabled')).toBe('');
      expect(component.registerForm.valid).toBeFalsy();

      component.registerForm.controls['email'].setValue('validemail@test.com');
      component.registerForm.controls['password'].setValue('123456');
      component.registerForm.controls['confirmPassword'].setValue('654321');
      component.registerForm.controls['displayName'].setValue('John');
      fixture.detectChanges();
      expect(registerBtn.nativeElement.getAttribute('disabled')).toBe('');
      expect(component.registerForm.valid).toBeFalsy();
    });

    it('the register form should be valid only when all the fields are provided and they are all correct', () => {
      component.registerForm.controls['email'].setValue('validemail@test.com');
      component.registerForm.controls['password'].setValue('123456');
      component.registerForm.controls['confirmPassword'].setValue('123456');
      component.registerForm.controls['displayName'].setValue('John');
      fixture.detectChanges();
      expect(registerBtn.nativeElement.getAttribute('disabled')).toBe(null);
      expect(component.registerForm.valid).toBeTruthy();
    });
  });

  describe('onLoginSubmit', () => {
    it('should perform a login', async(() => {
      const authService: AuthServiceStub = TestBed.get(AuthService);
      const loginSpy = spyOn(authService, 'login').and.callThrough();

      authService.shouldLogIn = true;

      component.loginForm.controls['email'].setValue('validemail@test.com');
      component.loginForm.controls['password'].setValue('123456');
      component.onLoginSubmit();
      fixture.detectChanges();

      expect(component.loginLoading).toBe(true);

      fixture.whenStable().then(() => { // wait for async
        expect(loginSpy).toHaveBeenCalled();
        expect(component.loginLoading).toBe(false);
      });
    }));

    it('should reset the form after the login', async(() => {
      const authService: AuthServiceStub = TestBed.get(AuthService);
      const resetSpy = spyOn(component.loginForm, 'reset').and.callThrough();

      authService.shouldLogIn = true;

      component.loginForm.controls['email'].setValue('validemail@test.com');
      component.loginForm.controls['password'].setValue('123456');
      component.onLoginSubmit();
      fixture.detectChanges();

      fixture.whenStable().then(() => { // wait for async
        expect(resetSpy).toHaveBeenCalled();
        expect(component.loginForm.controls['email'].value).toBe(null);
        expect(component.loginForm.controls['password'].value).toBe(null);
        expect(component.loginLoading).toBe(false);
      });
    }));

    it('should display an error when the login fails', async(() => { }));

    it('should display a loading spinner', () => { });
  });

});
