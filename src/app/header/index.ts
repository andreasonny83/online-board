import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { HeaderMenuComponent } from './header-menu/header-menu.component';
import { MainToolbarComponent } from './main-toolbar/main-toolbar.component';
import { AuthService } from '../auth.service';
import { FirebaseService } from '../../firebase';
import * as firebase from 'firebase/app';
import {
  MdToolbarModule,
  MdButtonModule,
  MdMenuModule,
  MdIconModule,
} from '@angular/material';

@NgModule({
  declarations: [
    HeaderMenuComponent,
    MainToolbarComponent,
  ],
  imports: [
    CommonModule,
    MdToolbarModule,
    MdButtonModule,
    MdMenuModule,
    MdIconModule,
    RouterModule,
  ],
  providers: [
    AuthService,
    FirebaseService,
  ],
  exports: [
    MainToolbarComponent,
  ]
})
export class HeaderModule { }
