import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
  AbstractControl,
} from '@angular/forms';

import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  registerForm: FormGroup;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
  ) {
    this.createForm();
  }

  ngOnInit() { }

  createForm() {
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

  validatePassword(formCtrl: FormControl) {
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

  onLoginSubmit() {
    if (!!this.loginForm.valid) {
      this.authService
        .login(this.loginForm.value)
        .then(res => this.loginForm.reset());
    }
  }

  onRegisterSubmit() {
    if (!!this.registerForm.valid) {
      this.authService
        .register(this.registerForm.value)
        .then(res => this.registerForm.reset());
    }
  }
}
