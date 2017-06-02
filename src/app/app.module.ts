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
  MdDialogModule,
  MdProgressSpinnerModule,
} from '@angular/material';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { DialogResetEmailComponent } from './login/dialog-reset-email';
import { DashboardComponent } from './dashboard/dashboard.component';
import { BoardPageComponent } from './board-page/board-page.component';
import { DroppingCardComponent } from './dropping-card/dropping-card.component';

import { FooterComponent } from './footer/footer.component';
import { BoardService } from './services/board.service';
import { BoardsListComponent } from './boards-list/boards-list.component';

import { AuthGuard } from './auth-guard.service';
import { AuthService } from './auth.service';

import { Keyobject, FilterColumn } from './pipes';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    DashboardComponent,
    BoardPageComponent,
    BoardsListComponent,
    DroppingCardComponent,
    FooterComponent,
    DialogResetEmailComponent,
    Keyobject,
    FilterColumn,
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
    DialogResetEmailComponent,
  ],
  providers: [
    AuthGuard,
    AuthService,
    BoardService,
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
