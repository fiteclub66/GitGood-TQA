import { TestBed, inject } from '@angular/core/testing';
import { AuthService } from './auth.service';
import {AngularFireAuth} from "angularfire2/auth";
import {AngularFireModule, FirebaseApp} from "angularfire2";
import {firebaseConfig} from "../../environments/environment.prod";
import {AngularFireDatabase} from "angularfire2/database";
import * as firebase from 'firebase/app';
describe('AuthService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthService, AngularFireAuth, AngularFireDatabase],
      imports:[AngularFireModule.initializeApp(firebaseConfig)]
    }).compileComponents();
  });


  it('isLoggedIn()', inject([AuthService, AngularFireAuth, FirebaseApp, AngularFireDatabase], (service: AuthService) => {

    //this returns the actual value
    expect(service.isLoggedIn()).toBeFalsy();

  }));

  it('loginGoogle()', inject([AuthService, AngularFireAuth, FirebaseApp, AngularFireDatabase], (service: AuthService) => {
    // This is for setting the wished return value. This way it does not make actual call to the DB
    spyOn(service, 'loginGoogle').and.returnValue(firebase.Promise);

    // this returns the actual value
    expect(service.loginGoogle()).toBe(firebase.Promise);

    // Checking if it was called. NOTICE THE MISSING PARENTHESIS
    expect(service.loginGoogle).toHaveBeenCalled();
  }));
});
