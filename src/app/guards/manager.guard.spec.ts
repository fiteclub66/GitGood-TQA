import { TestBed, async, inject } from '@angular/core/testing';

import { ManagerGuard } from './manager.guard';
import {AuthService} from "../services/auth.service";
import {AngularFireAuth} from "angularfire2/auth";
import {AngularFireDatabase} from "angularfire2/database";
import {AngularFireModule} from "angularfire2";
import {firebaseConfig} from "../../environments/environment";
import {RouterTestingModule} from "@angular/router/testing";

describe('ManagerGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagerGuard ],
      providers:[AuthService, AngularFireAuth, AngularFireDatabase],
      imports: [AngularFireModule.initializeApp(firebaseConfig), RouterTestingModule]
    })
  });

  it('should ...', inject([ManagerGuard], (guard: ManagerGuard) => {
    expect(guard).toBeTruthy();
  }));
});
