import { TestBed, async, inject } from '@angular/core/testing';

import { CanActivateViaAuthGuardGuard } from './can-activate-via-auth-guard.guard';
import {AuthService} from "../services/auth.service";
import {AngularFireAuth} from "angularfire2/auth";
import {AngularFireDatabase} from "angularfire2/database";
import {AngularFireModule} from "angularfire2";
import {firebaseConfig} from "../../environments/environment";
import {RouterTestingModule} from "@angular/router/testing";

describe('CanActivateViaAuthGuardGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ CanActivateViaAuthGuardGuard ],
      providers:[AuthService, AngularFireAuth, AngularFireDatabase],
      imports: [AngularFireModule.initializeApp(firebaseConfig), RouterTestingModule]
    })
  });

  it('should ...', inject([CanActivateViaAuthGuardGuard], (guard: CanActivateViaAuthGuardGuard) => {
    expect(guard).toBeTruthy();
  }));
});
