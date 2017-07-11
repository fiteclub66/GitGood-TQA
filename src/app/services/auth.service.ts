///<reference path="../../../node_modules/rxjs/add/operator/mergeMap.d.ts"/>
import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {AngularFireAuth} from 'angularfire2/auth';
import {Router} from '@angular/router';
import * as firebase from 'firebase/app';
import {AngularFireDatabase, FirebaseListObservable} from 'angularfire2/database';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import {reject} from "q";
import {take} from "rxjs/operator/take";

@Injectable()
export class AuthService {

  user: Observable<firebase.User>;

  constructor(public afAuth: AngularFireAuth, public router: Router, public db: AngularFireDatabase) {
    this.user = afAuth.authState;
  }


  createUser(email, password) {

    firebase.auth().createUserWithEmailAndPassword(email, password).then(function (results) {
      console.log(results)
    });
  }


  public  getEventsByRoot(): FirebaseListObservable<any> {

    return this.db.list('/events');
  }


  private getEventsByYear(year: number): FirebaseListObservable<any> {

    return this.db.list('/events', {
      query: {
        orderByChild: 'year',
        equalTo: year

      }
    });
  }

  private getEventsByHour(reservation: any) {

    console.log(reservation.startingHour)
    return this.getEventsByDay(reservation).map(_dayList => _dayList.filter(event => event.startingHour === reservation.startingHour));

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

  private getEventsByDay(reservation: any ) {

    return this.getEventsByMonth(reservation).map(_monthList => _monthList.filter(event => event.day === reservation.day));

  }

  public getEventsByMonth(reservation: any ) {

    return this.getEventsByYear(reservation.year).map(_yearList => _yearList.filter(event => event.month === reservation.month));

  }


  loginEmail(email: string, password: string) {


    const route = this.router;
    this.afAuth.auth.signInWithEmailAndPassword(email, password).then(function (result) {
      console.log(result);
      route.navigate(['/calendar']);
    });

  }

  isLoggedIn() {

    this.afAuth.authState.subscribe(auth => {
      return !!auth;
    });
  }

  loginGoogle() {

    const route = this.router;
    this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider).then(function (result) {
      route.navigate(['']);
      console.log(result);
    });
  }

  logout() {
    const route = this.router;

    this.afAuth.auth.signOut().then(function () {
      route.navigate(['/login']);
      console.log("GOODBYE!");

    })

  }


  public getEvents(dataType: string, reservation: any): FirebaseListObservable<any> {

    switch (dataType) {

      case "root":

        return this.getEventsByRoot();
      case "year":
        return this.getEventsByYear(reservation);

      case "month":

        return this.getEventsByMonth(reservation) as (FirebaseListObservable<any>);

      case "day":

        return this.getEventsByDay(reservation) as (FirebaseListObservable<any>);

      case "hour":

        return this.getEventsByHour(reservation) as (FirebaseListObservable<any>);
    }

  }


  public createEvent(date: any, startObject: any, endObject: any) {


    const reservationObject = Object.assign(date, startObject, endObject);

    this.checkStartAndEndTime(reservationObject).take(1).subscribe(dateAvailable => {

      if(dateAvailable){
        this.db.list('/events').push(reservationObject)
          .then(resolve => {
            console.log("Event created in the database successfully")
          })
          .catch(error => {
            console.log("Error occured\n" + error.message);
          })
      }
    });

  }

  public updateEvent(reservation: any, oldEvent: any) {

    const user = firebase.auth().currentUser;
    const self = this;

    this.getEventsByHour(oldEvent).take(1).subscribe(event => {
      console.log(event[0].$key);

      if(reservation.members.includes(user.email)) {
        self.db.object('/events/' + event[0].$key).update(reservation)
          .then( result => {
            console.log("Event updated successfully!");
          })
          .catch(error => {
            console.log("Error: " + error.message);
          });
      }

    })


  }


}
