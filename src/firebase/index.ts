import { NgModule } from '@angular/core';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { FirebaseService } from './firebase.service';

// Must export the config
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
  exports: [
    FirebaseService,
  ]
})
export class FirebaseModule { }

export {
  FirebaseService,
};
