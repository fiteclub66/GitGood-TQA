
import { AuthService } from './auth.service';
import * as firebase from 'firebase/app';
import {DebugElement} from "@angular/core";



describe('AuthService', () => {

  let service: AuthService;

  beforeEach(async() => {

    service = new AuthService;


  });


  it('isLoggedIn()', () => {


    //this returns the actual value
    expect(service.isLoggedIn()).toBeFalsy();

  });

  it('loginGoogle()', () => {
    // This is for setting the wished return value. This way it does not make actual call to the DB
    spyOn(service, 'loginGoogle').and.returnValue(firebase.Promise);

    // this returns the actual value
    expect(service.loginGoogle()).toBe(firebase.Promise);

    // Checking if it was called. NOTICE THE MISSING PARENTHESIS
    expect(service.loginGoogle).toHaveBeenCalled();
  });


  it('getEEByEmail() with Email',(done: DoneFn)=> {


      service.loginEmail("testingm@test.com", "password");
      //this returns the actual value

      service.getEEByEmail("testingm@test.com").take(1).subscribe(userList =>{


        expect(userList.length).toEqual(1);
        done();
      });

    });

  it('getEEByEmail() without Email',(done: DoneFn)=> {


    service.loginEmail("testingm@test.com", "password");
    //this returns the actual value

    service.getEEByEmail("").take(1).subscribe(userList =>{


      expect(userList.length).toEqual(0);
      done();
    });

  });








});
