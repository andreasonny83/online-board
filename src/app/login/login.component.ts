import { Component, OnInit, HostBinding } from '@angular/core';
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { slideToLeft } from '../app.animations';

import { AuthService } from '../auth.service';
import { MdDialog, MdSnackBar } from '@angular/material';
import { DialogResetEmailComponent } from './dialog-reset-email';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  animations: [slideToLeft],
})
export class LoginComponent implements OnInit {
  @HostBinding('@routerTransition') routerTransition = '';

  public loginForm: FormGroup;
  public registerForm: FormGroup;
  public loginLoading: boolean;
  public registerLoading: boolean;

  constructor(
    public dialog: MdDialog,
    private authService: AuthService,
    private fb: FormBuilder,
    private snackBar: MdSnackBar,
  ) {
    this.createForm();
  }

  ngOnInit() { }

  public onLoginSubmit(): void {
    if (!!this.loginForm.valid) {
      this.loginLoading = true;

      this.authService
        .login(this.loginForm.value)
        .then(res => {
          this.loginForm.reset();
          this.loginLoading = false;
        });
    }
  }

  public onRegisterSubmit(): void {
    if (!!this.registerForm.valid) {
      this.registerLoading = true;
      this.authService
        .register(this.registerForm.value)
        .then(res => {
          this.registerForm.reset();
          this.registerLoading = false;
        });
    }
  }

  public resetPassword(): void {
    const dialogRef = this.dialog.open(DialogResetEmailComponent);

    dialogRef.afterClosed().subscribe((res: boolean) => {
      return !!res && this.snackBar.open(
        'Email reset correctly sent.',
        null,
        { duration: 6000 }
      );
    });
  }

  private createForm(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });

    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', this.validatePassword],
      displayName: ['', [
        Validators.required,
        Validators.minLength(4),
        Validators.pattern(/^([a-zA-Z'-_]+\s){0,4}[a-zA-Z'-_]+$/)
      ]],
    });
  }

  private validatePassword(formCtrl: FormControl) {
    if ('root' in formCtrl) {
      const password: AbstractControl = formCtrl.root.get('password');

      if (password && password.value && password.value === formCtrl.value) {
        return null;
      }
    }

    return {
      'validatePassword': { valid: false }
    };
  }
}
