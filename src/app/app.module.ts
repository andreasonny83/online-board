import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppRoutingModule } from './app-routing.module';
import { FirebaseModule } from '../firebase';
import { CookieLawModule } from 'angular2-cookie-law';
import { HeaderModule } from './header';
import {
  MdToolbarModule,
  MdCardModule,
  MdInputModule,
  MdButtonModule,
  MdMenuModule,
  MdSnackBarModule,
  MdListModule,
  MdIconModule,
  MdProgressSpinnerModule,
  MdDialogModule,
} from '@angular/material';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { DialogResetEmail } from './login/dialog-reset-email';
import { DashboardComponent } from './dashboard/dashboard.component';
import { BoardPageComponent } from './board-page/board-page.component';
import { FooterComponent } from './footer/footer.component';

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
    FooterComponent,
    DialogResetEmail,
    Keyobject,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    FirebaseModule,
    CookieLawModule,
    // AngularMaterial
    MdToolbarModule,
    MdCardModule,
    MdInputModule,
    MdButtonModule,
    MdMenuModule,
    MdSnackBarModule,
    MdListModule,
    MdIconModule,
    MdProgressSpinnerModule,
    MdDialogModule,
    // App Modules
    HeaderModule,
    AppRoutingModule,
  ],
  entryComponents: [
    DialogResetEmail,
  ],
  providers: [
    AuthGuard,
    AuthService,
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
