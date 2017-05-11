import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppRoutingModule } from './app-routing.module';
import { FirebaseModule } from '../firebase';
import {
  MdToolbarModule,
  MdCardModule,
  MdInputModule,
  MdButtonModule,
  MdMenuModule,
  MdSnackBarModule,
  MdListModule,
  MdIconModule
} from '@angular/material';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { BoardPageComponent } from './board-page/board-page.component';
import { HeaderMenuComponent } from './header-menu/header-menu.component';
import { MainToolbarComponent } from './main-toolbar/main-toolbar.component';

import { AuthGuard } from './auth-guard.service';
import { AuthService } from './auth.service';

import { Keyobject } from './pipes';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    DashboardComponent,
    BoardPageComponent,
    Keyobject,
    HeaderMenuComponent,
    MainToolbarComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    FirebaseModule,
    // AngularMaterial
    MdToolbarModule,
    MdCardModule,
    MdInputModule,
    MdButtonModule,
    MdMenuModule,
    MdSnackBarModule,
    MdListModule,
    MdIconModule,
    // App Modules
    AppRoutingModule,
  ],
  providers: [
    AuthGuard,
    AuthService,
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
