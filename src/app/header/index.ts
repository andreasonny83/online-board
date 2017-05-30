import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { HeaderMenuComponent } from './header-menu/header-menu.component';
import { MainToolbarComponent } from './main-toolbar/main-toolbar.component';
import { AuthService } from '../auth.service';
import { FirebaseModule } from '../../firebase';
import * as firebase from 'firebase/app';
import {
  MdToolbarModule,
  MdButtonModule,
  MdMenuModule,
  MdIconModule,
  MdSnackBarModule,
} from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    MdToolbarModule,
    MdButtonModule,
    MdMenuModule,
    MdIconModule,
    MdSnackBarModule,
    FirebaseModule,
    RouterModule,
  ],
  declarations: [
    HeaderMenuComponent,
    MainToolbarComponent,
  ],
  providers: [
    AuthService,
  ],
  exports: [
    MainToolbarComponent,
  ]
})
export class HeaderModule { }
