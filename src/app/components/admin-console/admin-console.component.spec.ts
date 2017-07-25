import {async, ComponentFixture, inject, TestBed} from '@angular/core/testing';

import { AdminConsoleComponent } from './admin-console.component';
import {AuthService} from "../../services/auth.service";
import {AngularFireAuth} from "angularfire2/auth";
import {AngularFireDatabase} from "angularfire2/database";
import {AngularFireModule, FirebaseApp} from "angularfire2";
import {RouterTestingModule} from "@angular/router/testing";
import {firebaseConfig} from "../../../environments/environment";

describe('AdminConsoleComponent', () => {
  let component: AdminConsoleComponent;
  let fixture: ComponentFixture<AdminConsoleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminConsoleComponent ],
      providers:[AuthService, AngularFireAuth, AngularFireDatabase],
      imports: [AngularFireModule.initializeApp(firebaseConfig), RouterTestingModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminConsoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', inject([AuthService, AngularFireAuth, AngularFireDatabase, FirebaseApp, RouterTestingModule], (service:AuthService) => {
    expect(component).toBeTruthy();
  }));
});
