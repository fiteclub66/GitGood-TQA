///<reference path="../../../node_modules/rxjs/add/operator/mergeMap.d.ts"/>
import { Injectable } from '@angular/core';
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
    this.user = afAuth.auth.currentUser;
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
        orderByChild: 'year',
        equalTo: year

      }
    });
  }

  public getEventsByHour(reservation: any): FirebaseListObservable<any> {

    console.log(reservation.startingHour)
    return this.getEventsByDay(reservation).map(_dayList =>
      _dayList.filter(event =>
      event.startingHour === reservation.startingHour)) as FirebaseListObservable<any>;

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
      event.day === reservation.day)) as FirebaseListObservable<any>;

  }

  public getEventsByMonth(reservation: any ): FirebaseListObservable<any> {

    return this.getEventsByYear(reservation.year).map(_yearList =>
      _yearList.filter(event =>
      event.month === reservation.month)) as FirebaseListObservable<any>;

  }

  public getEventByID(id:string): FirebaseObjectObservable<any>{
    return this.db.object('/events/'+id);
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

  public getCurrentUserID(){
    return this.user.uid;
  }


  public createEvent(reservation: any) {




    this.checkStartAndEndTime(reservation).take(1).subscribe(dateAvailable => {

      if(dateAvailable){
        this.db.list('/events').push(reservation)
          .then(resolve => {
            console.log("Event created in the database successfully")
          })
          .catch(error => {
            console.log("Error occured\n" + error.message);
          })
      }
    });

  }

  public updateEvent(id: string, updatedEvent: any) {

    this.getEventByID(id).take(1).subscribe(event => {
      console.log(event.$key);

      if(event.members.includes(this.user.email)) {
        this.db.object('/events/' + event.$key).update(updatedEvent)
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
