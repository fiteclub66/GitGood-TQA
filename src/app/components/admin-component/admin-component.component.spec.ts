import {async, ComponentFixture, inject, TestBed} from '@angular/core/testing';

import { AdminComponentComponent } from './admin-component.component';
import {AuthService} from "../../services/auth.service";
import {RouterTestingModule} from "@angular/router/testing";
import {firebaseConfig} from "../../../environments/environment.prod";
import {AngularFireModule} from "angularfire2";
import {AngularFireDatabase} from "angularfire2/database";
import {AngularFireAuth} from "angularfire2/auth";

describe('AdminComponentComponent', () => {
  let component: AdminComponentComponent;
  let fixture: ComponentFixture<AdminComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminComponentComponent ],
      providers:[AuthService, AngularFireAuth, AngularFireDatabase],
      imports: [AngularFireModule.initializeApp(firebaseConfig), RouterTestingModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', inject([AuthService],(service: AuthService) => {
    expect(component).toBeTruthy();
  }));
});
