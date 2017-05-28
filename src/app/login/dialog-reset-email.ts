import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../firebase';
import { MdDialogRef } from '@angular/material';
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
  AbstractControl,
} from '@angular/forms';

@Component({
  selector: 'app-dialog-reset-email',
  template: `
    <h2 md-dialog-title>Reset your password</h2>

    <form [formGroup]="resetForm"
          (ngSubmit)="resetPassword()"
          class="form"
          novalidate>

      <md-dialog-content>
        <md-input-container class="input-field">
          <input mdInput
                 placeholder="Email address"
                 type="email"
                 name="email"
                 formControlName="email">
        </md-input-container>
      </md-dialog-content>

      <md-dialog-actions align="end">
        <button md-raised-button
                type="submit"
                name="reset"
                [disabled]="!resetForm.valid || loading"
                (click)="resetPassword()"
                color="primary">
                <span>Reset</span>
                <md-spinner color="primary"
                            strokeWidth="8"
                            *ngIf="loading"
                            class="loading-spinner-bt"></md-spinner>
        </button>
      </md-dialog-actions>

    </form>
  `,
  styles: [`
    .form { padding: 20px; }
    .input-field { min-width: 300px; }
  `]
})
export class DialogResetEmailComponent {
  public resetForm: FormGroup;
  public loading: boolean;

  constructor(
    public dialogRef: MdDialogRef<DialogResetEmailComponent>,
    private fb: FormBuilder,
    private fireBase: FirebaseService,
  ) {
    this.createForm();
  }

  createForm() {
    this.resetForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  resetPassword() {
    this.loading = true;
    this.fireBase
      .resetEmail(this.resetForm.controls.email.value)
      .then(result => {
        this.dialogRef.close(true);
      })
      .catch(() => this.dialogRef.close(true));
  }
}
