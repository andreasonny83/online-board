import { NgModule, Inject, InjectionToken } from '@angular/core';
import { AngularFireModule, FirebaseAppConfig } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { FirebaseService, EMAIL_API_URL } from './firebase.service';

import {
  AngularFireDatabase,
  FirebaseListObservable,
  FirebaseObjectObservable,
} from 'angularfire2/database';

const firebaseConfig = {
  apiKey: 'AIzaSyDFLkSi_sP-TYSSrb9OPbXYyLI681VcTXE',
  authDomain: 'online-board.firebaseapp.com',
  databaseURL: 'https://online-board.firebaseio.com',
  storageBucket: 'online-board.appspot.com',
};

@NgModule({
  imports: [
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
  ],
  providers: [
    FirebaseService,
  ],
})
export class FirebaseModule { }

export {
  FirebaseService,
  AngularFireDatabase,
  FirebaseListObservable,
  FirebaseObjectObservable,
  EMAIL_API_URL,
};
