import { TestBed, async, inject } from '@angular/core/testing';

import { AdminGuard } from './admin.guard';
import {RouterTestingModule} from "@angular/router/testing";
import {AuthService} from "../services/auth.service";
import {AngularFireAuth} from "angularfire2/auth";
import {AngularFireDatabase} from "angularfire2/database";
import {AngularFireModule} from "angularfire2";
import {firebaseConfig} from "../../environments/environment";

describe('AdminGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminGuard ],
      providers:[AuthService, AngularFireAuth, AngularFireDatabase],
      imports: [AngularFireModule.initializeApp(firebaseConfig), RouterTestingModule]
    })

  });

  it('should ...', inject([AdminGuard], (guard: AdminGuard) => {
    expect(guard).toBeTruthy();
  }));
});
