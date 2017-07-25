
import { AuthService } from './auth.service';
import {RouterTestingModule} from "@angular/router/testing";
import { inject, TestBed} from "@angular/core/testing";
import {AngularFireDatabase} from "angularfire2/database";
import {AngularFireAuth} from "angularfire2/auth";
import {AngularFireModule, FirebaseApp} from "angularfire2";
import {firebaseConfig} from "../../environments/environment.prod";
import Spy = jasmine.Spy;
import {GitEvent} from "../models/GitEvent";

describe('AuthService', () => {


  let service: AuthService;


  beforeEach(() => {

    TestBed.configureTestingModule({


      providers: [AuthService, AngularFireAuth, AngularFireDatabase],
      imports: [AngularFireModule.initializeApp(firebaseConfig), RouterTestingModule]
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


  it('getEEByEmail() with Email', (done: DoneFn) => {

    //this returns the actual value

    service.getEEByEmail("teste@test.com").take(1).subscribe(userList => {

      expect(userList.length).toEqual(1);
      done();
    });

  });

  it('getEEByEmail() without Email', (done: DoneFn) => {


    //this returns the actual value

    service.getEEByEmail("").take(1).subscribe(userList => {


      expect(userList.length).toEqual(0);
      done();
    });


  });

  it('getManagerByEmail() without Email', (done: DoneFn) => {


    //this returns the actual value

    service.getManagerByEmail("").take(1).subscribe(managerList => {


      expect(managerList.length).toEqual(0);
      done();
    });


  });

  it('getManagerByEmail() with Email', (done: DoneFn) => {


    //this returns the actual value

    service.getManagerByEmail("testingm@test.com").take(1).subscribe(managerList => {


      expect(managerList.length).toEqual(1);
      done();
    })


  });

  it('getAdminByEmail() without Email', (done: DoneFn) => {


    //this returns the actual value

    service.getAdminByEmail("").take(1).subscribe(userList => {


      expect(userList.length).toEqual(0);
      done();
    })

  });

  it('getAdminByEmail() with Email', (done: DoneFn) => {


    //this returns the actual value

    service.getAdminByEmail('testa@test.com').take(1).subscribe(adminList => {


      expect(adminList.length).toEqual(1);
      done();
    })


  });

  it('getEventsByMonth() without valid reservation date', (done: DoneFn) => {

    service.getEventsByMonth(new Date(1, 1, 1), 1).then(answer => {
      expect(answer.length).toBe(0);
      done();
    })


  });

  it('getEventsByMonth() with valid reservation date', (done: DoneFn) => {


    service.getEventsByMonth(new Date(2017, 6, 9), 1).then(answer => {
      console.log(answer);
      expect(answer.length).toBe(9);
      done();
    })


  });

  it('getEventsByYear() without valid reservation date', (done: DoneFn) => {


    service.getEventsByYear(new Date(0, 0, 0), 0).take(1).subscribe(yearList => {

      expect(yearList.length).toEqual(0);
      done();
    })

  });

  it('getEventsByYear() with valid reservation date', (done: DoneFn) => {


    service.getEventsByYear(new Date(2017, 6, 1), 1).take(1).subscribe(yearList => {

      expect(yearList.length).toEqual(10);
      done();
    })

  });

  it('getEventsByDay() without valid reservation date', (done: DoneFn) => {


    service.getEventsByDay(new Date(1, 1, 1), 1).then(dayList => {

      expect(dayList.length).toEqual(0);
      done();
    })

  });

  it('getEventsByDay() with valid reservation date', (done: DoneFn) => {


    service.getEventsByDay(new Date(2017, 6, 13, 1, 1, 1), 1).then(dayList => {

      expect(dayList.length).toEqual(2);
      done();
    })

  });

  it('getEventsByHour() without valid reservation date', (done: DoneFn) => {


    service.getEventsByHour(new Date(2017, 6, 13, 15, 1, 1), 1).then(hourList => {

      expect(hourList.length).toEqual(0);
      done();
    })

  });

  it('getEventsByHour() with valid reservation date', (done: DoneFn) => {


    service.getEventsByHour(new Date(2017, 6, 13, 1, 1, 1), 1).then(hourList => {

      expect(hourList.length).toEqual(0);
      done();
    })

  });
  it('getEventbyID() without valid ID', (done: DoneFn) => {

    service.getEventByID("ggggggggggggggggg").take(1).subscribe(thisEvent => {
      expect(thisEvent.$value).toBeNull();
      done();
    })

  });
  it('getEventbyID() with valid ID', (done: DoneFn) => {

    service.getEventByID("KpqmlH0p7v1zl34qswN").take(1).subscribe(thisevent => {

      expect(Object.keys(thisevent).length).toBe(1);
      done();
    })

  });

  it('getWorkers()', (done: DoneFn) => {

    service.getWorkers().then(workerObj => {
    //  console.log('worker object', workerObj);
      expect(Object.keys(workerObj).length).toBeGreaterThan(0);
      done();
    }).catch(error => console.log(error));

  });


 /* it('getCurrentUserID()', (done: DoneFn) => { //Did not need to use, but kept in case it became useful later

    service.getCurrentUserID().take(1).subscribe(uid => {
      expect(uid).toBe(!null);
      done();
    });

  });
*/

  it('getEmployees()', (done: DoneFn) => {

    service.getEmployees().take(1).subscribe(workerList => {
      expect(workerList.length).toBeGreaterThan(0);
      done();
    });

  });

  it('getManagers()', (done: DoneFn) => {

    service.getManagers().take(1).subscribe(managerList => {
      expect(managerList.length).toBeGreaterThan(0);
      done();
    });

  });

  it('getAdmins()', (done: DoneFn) => {

    service.getAdmins().take(1).subscribe(adminList => {
      expect(adminList.length).toBeGreaterThan(0);
      done();
    });

  });

  it('makeEEmanager()', () => {
    spyOn(service, 'makeEEManager').and.returnValue(Promise);

    expect(service.makeEEManager("")).toBe(Promise);

    expect(service.makeEEManager).toHaveBeenCalled();
  });

  it('makeManagerUser()', () => {
    spyOn(service, 'makeManagerUser').and.returnValue(Promise);

    expect(service.makeManagerUser("")).toBe(Promise);

    expect(service.makeManagerUser).toHaveBeenCalled();
  });

  it('makeEEAdmin()', () => {
    spyOn(service, 'makeEEAdmin').and.returnValue(Promise);

    expect(service.makeEEAdmin("")).toBe(Promise);

    expect(service.makeEEAdmin).toHaveBeenCalled();
  });

  it('createUser()', () => {
    spyOn(service, 'createUser').and.returnValue(Promise);

    expect(service.createUser("", "")).toBe(Promise);

    expect(service.createUser).toHaveBeenCalled();

  });

  it('createEvent()', () => {
    spyOn(service, 'createEvent').and.returnValue(Promise);

    expect(service.createEvent(1, new GitEvent())).toBe(Promise);

    expect(service.createEvent).toHaveBeenCalled();
  });

  it('updateEvent()', () => {
    spyOn(service, 'updateEvent').and.returnValue(Promise);

    expect(service.updateEvent(1, new GitEvent(), new GitEvent())).toBe(Promise);

    expect(service.updateEvent).toHaveBeenCalled();
  });

  it('getEventsByYearAllRooms() with valid reservation date', (done: DoneFn) => {


    service.getEventsByYearAllRooms(new Date(2017, 1, 1)).then(yearList => {
      console.log('all rooms', yearList);
      expect(yearList.length).toBeGreaterThan(0);

      done();
    })

  });

})
