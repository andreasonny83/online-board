import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppRoutingModule } from './app-routing.module';

import {
  MdToolbarModule,
  MdCardModule,
  MdInputModule,
  MdButtonModule,
  MdSnackBarModule,
  MdListModule,
  MdIconModule,
} from '@angular/material';

import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import {
  AngularFireDatabaseModule,
  FirebaseListObservable,
} from 'angularfire2/database';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { BoardPageComponent } from './board-page/board-page.component';

import { AuthGuard } from './auth-guard.service';
import { FirebaseService } from './firebase.service';
import { AuthService } from './auth.service';

// Must export the config
export const firebaseConfig = {
  apiKey: 'AIzaSyDFLkSi_sP-TYSSrb9OPbXYyLI681VcTXE',
  authDomain: 'online-board.firebaseapp.com',
  databaseURL: 'https://online-board.firebaseio.com',
  storageBucket: 'online-board.appspot.com',
};

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    DashboardComponent,
    BoardPageComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpModule,
    // AngularMaterial
    MdToolbarModule,
    MdCardModule,
    MdInputModule,
    MdButtonModule,
    MdSnackBarModule,
    MdListModule,
    MdIconModule,
    // AngularFire
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    // App Modules
    AppRoutingModule,
  ],
  providers: [
    AuthGuard,
    FirebaseService,
    AuthService,
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
