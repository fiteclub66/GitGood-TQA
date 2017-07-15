///<reference path="../../../node_modules/rxjs/add/operator/mergeMap.d.ts"/>
import {Injectable, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {AngularFireAuth} from 'angularfire2/auth';
import {Router} from '@angular/router';
import * as firebase from 'firebase/app';
import {AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable} from 'angularfire2/database';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';

@Injectable()
export class AuthService {

  user: any;





  constructor(public afAuth: AngularFireAuth, public router: Router, public db: AngularFireDatabase) {
    this.user = firebase.auth().currentUser;
  }


  createUser(email, password) {

    firebase.auth().createUserWithEmailAndPassword(email, password).then(function (results) {
      console.log(results)
    });
  }


  public  getEventsByRoot(): FirebaseListObservable<any> {

    return this.db.list('/events');
  }


  public getEventsByYear(year: number): FirebaseListObservable<any> {

    return this.db.list('/events', {
      query: {
        orderByChild: 'meetingDate/year',
        equalTo: year

      }
    });
  }

  public getEventsByHour(reservation: any): FirebaseListObservable<any> {

    console.log(reservation.startingHour)
    return this.getEventsByDay(reservation).map(_dayList =>
      _dayList.filter(event =>
      event.meetingDate.startingHour === reservation.startingHour)) as FirebaseListObservable<any>;

  }

  private checkStartAndEndTime(reservation: any) {


    return this.getEventsByDay(reservation).map(_dayList => {

      const endingHourInBetween = _dayList.filter(event =>
      event.endingHour > reservation.endingHour && event.startingHour < reservation.endingHour);

      const startingHourInBetweenList = _dayList.filter(event =>
      event.endingHour > reservation.startingHour && event.startingHour < reservation.startingHour);

      const startHourList = _dayList.filter(event => event.startHour === reservation.startingHour);

      if (endingHourInBetween.length > 0 || startHourList.length > 0 || startingHourInBetweenList.length > 0) {

        try {
          throw new RangeError();
        }
        catch (e) {
          if (e instanceof RangeError) {
            if (endingHourInBetween.length > 0) {
              console.log('The ending hour overlaps with another reservation!');
            }
            if (startHourList.length > 0) {
              console.log('The starting hour is already taken!');
            }
            if (startingHourInBetweenList.length > 0) {
              console.log('The starting hour lands in between the time of another meeting!');
            }
          }
        }

        return false;
      }

        return true;

    });
  }

  public getEventsByDay(reservation: any ): FirebaseListObservable<any> {

    return this.getEventsByMonth(reservation).map(_monthList =>
      _monthList.filter(event =>
      event.meetingDate.day === reservation.day)) as FirebaseListObservable<any>;

  }

  public getEventsByMonth(reservation: any ): FirebaseListObservable<any> {

    return this.getEventsByYear(reservation.year).map(_yearList =>
      _yearList.filter(event =>
      event.meetingDate.month === reservation.month)
    ) as FirebaseListObservable<any>;

  }

  public getEventByID(id:string): FirebaseObjectObservable<any>{
    return this.db.object('/events/'+id);
  }

  public getMembers(): FirebaseListObservable<any>{
    return this.db.list('/users');
  }



  loginEmail(email: string, password: string) {


    console.log(email);
    const route = this.router;
    const self = this;
    this.afAuth.auth.signInWithEmailAndPassword(email, password).then(function (result) {
      self.user = result.user;
      self.getAdminByEmail(result.email).take(1).subscribe(AdminFound => {

        self.getManagerByEmail(result.email).take(1).subscribe(managerFound => {

          if (AdminFound.length === 0 && managerFound.length === 0) {
            self.db.object('/users/employees/' + result.uid).set({
              name: result.displayName,
              email: result.email
            });
          }

        });


      });


      route.navigate(['/a']);

      console.log(result);
    });

  }

  isLoggedIn() {

    this.afAuth.authState.subscribe(auth => {
      return !!auth;
    });
  }

  loginGoogle() {

    const route = this.router;
    const self = this;
    this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider).then(function (result) {
      self.user = result.user;

      self.getAdminByEmail(self.user.email).take(1).subscribe(AdminFound => {

        self.getManagerByEmail(self.user.email).take(1).subscribe(managerFound => {

        if(AdminFound.length ===  0 && managerFound.length === 0){
          self.db.object('/users/employees/'+self.user.uid).set({name:self.user.displayName, email: self.user.email});
        }

        });


      });




      route.navigate(['/a']);

      console.log(result);
    });
  }

  public getEEByEmail(email: string): FirebaseListObservable<any>{
    return this.db.list('/users/employees', {
      query: {
        orderByChild: 'email',
        equalTo: email
      }
    });
  }

  public getManagerByEmail(email: string): FirebaseListObservable<any>{


    return this.db.list('/users/managers', {

      query: {
        orderByChild: 'email',
        equalTo: email
      }

    });
  }


  public getAdminByEmail(email: string): FirebaseListObservable<any>{


    return this.db.list('/users/admin', {

      query: {
        orderByChild: 'email',
        equalTo: email
      }

    });
  }

  public makeEEManager(email: string){

    this.getEEByEmail(email).subscribe(employee => {
      console.log(employee);
      this.db.object('users/managers/' + employee[0].$key).set(employee[0])
        .then(() => {
        this.db.list('users/employees').$ref.ref.child(employee[0].$key).remove();
        });
    })

  }



  public makeEEAdmin(email: string){

    this.getEEByEmail(email).subscribe(employee => {
      console.log(employee);
      this.db.object('users/admin/' + employee[0].$key).set(employee[0])
        .then(() => {
          this.db.list('users/employees').$ref.ref.child(employee[0].$key).remove();
        });
    })

  }

  logout() {
    const route = this.router;

    this.afAuth.auth.signOut().then(function () {
      route.navigate(['login']);
      console.log("GOODBYE!");

    })

  }

  public getCurrentUserID(){
    return this.user.uid;
  }


  public createEvent(reservation: any, room: string) {




    this.checkStartAndEndTime(reservation).take(1).subscribe(dateAvailable => {

      if(dateAvailable){
        this.db.list('/events/'+room).push(reservation)
          .then(resolve => {
            console.log("Event created in the database successfully" + resolve)
          })
          .catch(error => {
            console.log("Error occured\n" + error.message);
          })
      }
    });

  }

  public updateEvent(room: string, oldEvent:any, updatedEvent: any) {

    this.getEventsByHour(oldEvent).take(1).subscribe(event => {
      console.log(event.$key);

      if(event.members.includes(this.user.email)) {
        this.db.object('/events/' + room + event.$key).update(updatedEvent)
          .then( result => {
            console.log("Event updated successfully!" + result);
          })
          .catch(error => {
            console.log("Error: " + error.message);
          });
      }

    })


  }


}
