
import { AuthService } from './auth.service';
import {RouterTestingModule} from "@angular/router/testing";
import {async, inject, TestBed} from "@angular/core/testing";
import {AngularFireDatabase} from "angularfire2/database";
import {AngularFireAuth} from "angularfire2/auth";
import {AngularFireModule, FirebaseApp} from "angularfire2";
import {firebaseConfig} from "../../environments/environment.prod";
import {Router} from "@angular/router";



describe('AuthService', () => {


  let service: AuthService;

  beforeEach(() => {

    TestBed.configureTestingModule({


      providers:[AuthService, AngularFireAuth, AngularFireDatabase],
      imports:[AngularFireModule.initializeApp(firebaseConfig), RouterTestingModule ]
    }).compileComponents();

    service = TestBed.get(AuthService);
    service.loginEmail("testam@test.com", "password");

  });


  it('isLoggedIn()', inject([AuthService, AngularFireModule, AngularFireDatabase, AngularFireAuth, FirebaseApp],() => {

    //this returns the actual value
    expect(service.isLoggedIn()).toBeFalsy();

  }));

  it('loginGoogle()', () => {
    // This is for setting the wished return value. This way it does not make actual call to the DB
    spyOn(service, 'loginGoogle').and.returnValue(Promise);

    // this returns the actual value
    expect(service.loginGoogle()).toBe(Promise);

    // Checking if it was called. NOTICE THE MISSING PARENTHESIS
    expect(service.loginGoogle).toHaveBeenCalled();
  });


  it('getEEByEmail() with Email',(done: DoneFn)=> {


      //this returns the actual value

      service.getEEByEmail("testingm@test.com").take(1).subscribe(userList =>{


        expect(userList.length).toEqual(1);
        done();
      });

    });

  it('getEEByEmail() without Email',(done: DoneFn)=> {


    //this returns the actual value

    service.getEEByEmail("").take(1).subscribe(userList =>{


      expect(userList.length).toEqual(0);
      done();
    });



  });





});
