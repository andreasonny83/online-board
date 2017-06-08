import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppRoutingModule } from './app-routing.module';
import { FirebaseModule, EMAIL_API_URL } from '../firebase';
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
  MdRadioModule,
} from '@angular/material';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { DialogResetEmailComponent } from './login/dialog-reset-email';
import { DashboardComponent } from './dashboard/dashboard.component';
import { BoardPageComponent } from './board-page/board-page.component';
import { DroppingCardComponent } from './dropping-card/dropping-card.component';
import { FloatingStickyNoteComponent } from './floating-sticky-note/floating-sticky-note.component';
import { ClickOutsideDirective } from './click-outside.directive';

import { FooterComponent } from './footer/footer.component';
import { BoardService } from './services/board.service';
import { BoardsListComponent } from './boards-list/boards-list.component';

import { AuthGuard } from './auth-guard.service';
import { AuthService } from './auth.service';
import { environment } from '../environments/environment';

import { Keyobject, FilterColumn } from './pipes';

// Must export the config
const firebaseConfig = {
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
    BoardsListComponent,
    DroppingCardComponent,
    FooterComponent,
    DialogResetEmailComponent,
    FloatingStickyNoteComponent,
    // Pipes
    Keyobject,
    FilterColumn,
    // Directives
    ClickOutsideDirective,
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
    MdRadioModule,
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
    { provide: EMAIL_API_URL, useValue: environment.EMAIL_API_URL },
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
