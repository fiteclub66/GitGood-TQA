
import { AuthService } from './auth.service';
import {RouterTestingModule} from "@angular/router/testing";
import { inject, TestBed} from "@angular/core/testing";
import {AngularFireDatabase} from "angularfire2/database";
import {AngularFireAuth} from "angularfire2/auth";
import {AngularFireModule, FirebaseApp} from "angularfire2";
import {firebaseConfig} from "../../environments/environment.prod";
import Spy = jasmine.Spy;
import {take} from "rxjs/operator/take";

describe('AuthService', () => {


  let service: AuthService;



  beforeEach(() => {

    TestBed.configureTestingModule({


      providers:[AuthService, AngularFireAuth, AngularFireDatabase],
      imports:[AngularFireModule.initializeApp(firebaseConfig), RouterTestingModule ]
    });
    service = TestBed.get(AuthService);
    service.afAuth.auth.signInAnonymously().catch(error => {
      console.log(error);
    })

  });



  it('isLoggedIn()', () => {

    //this returns the actual value
    expect(service.isLoggedIn()).toBeFalsy();

  });

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



  it('getAdminByEmail() without Email',(done: DoneFn)=> {


    //this returns the actual value

    service.getAdminByEmail("").take(1).subscribe(userList =>{


      expect(userList.length).toEqual(0);
      done();
    });

  })

  it('getAdminByEmail() with Email',(done: DoneFn)=> {


    //this returns the actual value

    service.getAdminByEmail('testa@test.com').take(1).subscribe(adminList =>{


      expect(adminList.length).toEqual(1);
      done();
    });



  })

  it('getEventsByMonth() without valid reservation date',(done: DoneFn)=> {

    service.getEventsByMonth(new Date(1,1,1)).then(answer => {
      expect(answer.length).toBe(0);
      done();
    });



  });

  it('getEventsByMonth() with valid reservation date',(done: DoneFn)=> {


    service.getEventsByMonth(new Date(2017,6,9)).then(answer => {
      console.log(answer);
      expect(answer.length).toBe(6);
      done();
    });




  })

  it('getEventsByYear() without valid reservation date',(done: DoneFn)=> {


    service.getEventsByYear(new Date(0,0,0)).take(1).subscribe(yearList =>{

      expect(yearList.length).toEqual(0);
      done();
    });



  })

  it('getEventsByYear() with valid reservation date',(done: DoneFn)=> {




    service.getEventsByYear(new Date(2017,6, 1)).take(1).subscribe(yearList =>{

      expect(yearList.length).toEqual(6);
      done();
    });



  })

  it('getEventsByDay() without valid reservation date',(done: DoneFn)=> {



    service.getEventsByDay(new Date(1,1,1)).then(dayList =>{

      expect(dayList.length).toEqual(0);
      done();
    });

  });


  it('getEventsByDay() with valid reservation date',(done: DoneFn)=> {


    service.getEventsByDay(new Date(2017,6, 13,1,1,1)).then(dayList =>{

      expect(dayList.length).toEqual(3);
      done();
    });



  })



});
