import { TestBed, inject } from '@angular/core/testing';
import * as firebase from 'firebase/app';
import { AuthService } from './auth.service';
import {AngularFireAuth} from "angularfire2/auth";
import {AngularFireModule, FirebaseApp, FirebaseAppName} from "angularfire2";
import {firebaseConfig} from "../../environments/environment.prod";
import {AngularFireDatabase} from "angularfire2/database";

describe('AuthService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthService, AngularFireAuth, AngularFireDatabase],
      imports:[AngularFireModule.initializeApp(firebaseConfig)]
    }).compileComponents();
  });

  it('should be created', inject([AuthService, AngularFireAuth, FirebaseApp, AngularFireDatabase], (service: AuthService) => {
    expect(service).toBeTruthy();
  }));
});
