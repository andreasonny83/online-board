import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { HeaderMenuComponent } from './header-menu/header-menu.component';
import { MainToolbarComponent } from './main-toolbar/main-toolbar.component';
import { InviteColaboratorsComponent } from './invite-colaborators/invite-colaborators.component';
import { AuthService } from '../auth.service';
import { FirebaseModule } from '../../firebase';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import * as firebase from 'firebase/app';
import {
  MdToolbarModule,
  MdButtonModule,
  MdMenuModule,
  MdIconModule,
  MdSnackBarModule,
  MdDialogModule,
  MdInputModule,
} from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    MdToolbarModule,
    MdButtonModule,
    MdMenuModule,
    MdIconModule,
    MdSnackBarModule,
    MdDialogModule,
    MdInputModule,
    FirebaseModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [
    HeaderMenuComponent,
    MainToolbarComponent,
    InviteColaboratorsComponent,
  ],
  providers: [
    AuthService,
  ],
  entryComponents: [
    InviteColaboratorsComponent,
  ],
  exports: [
    MainToolbarComponent,
  ]
})
export class HeaderModule { }
