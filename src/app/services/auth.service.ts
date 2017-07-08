///<reference path="../../../node_modules/rxjs/add/operator/mergeMap.d.ts"/>
import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {AngularFireAuth} from 'angularfire2/auth';
import {Router} from '@angular/router';
import * as firebase from 'firebase/app';
import {AngularFireDatabase, FirebaseListObservable} from 'angularfire2/database';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';

@Injectable()
export class AuthService {

  user: Observable<firebase.User>;

  constructor(public afAuth: AngularFireAuth, public router: Router, public db: AngularFireDatabase) {
    this.user = afAuth.authState;
  }



  createUser(email, password) {

    firebase.auth().createUserWithEmailAndPassword(email, password).then(function(results){
      console.log(results)
    });
  }


  private getEventsByRoot(): FirebaseListObservable<any>{

    return this.db.list('/events');
  }


   private getEventsByYear(year: number): FirebaseListObservable<any>{

    return this.db.list('/events', {
      query: {
        orderByChild: 'year',
        equalTo: year

      }
    });
  }

  private getEventsByHour(year: number, month: number, day: number, hour: number, callback){

    this.getEventsByDay(year, month, day, function (dayList) {
      callback(dayList.filter(y => y.valueOf().hour === hour));
    });
  }

  private getEventsByDay(year: number, month: number, day: number, callback){
    this.getEventsByMonth(year, month, function (monthList) {
      callback(monthList.filter(y => y.valueOf().day === day));
    });
  }

  private getEventsByMonth(year: number, month: number, callback){

    this.getEventsByYear(year).subscribe(x => {
      callback(x.filter(y => y.valueOf().month === month));
    });

  }


  loginEmail(email: string, password: string) {


    const route = this.router;
    this.afAuth.auth.signInWithEmailAndPassword(email, password).then(function (result){
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
    this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider).then( function (result) {
      route.navigate(['']) ;
      console.log(result);
    });
  }

  logout() {
    const route = this.router;

    this.afAuth.auth.signOut().then( function () {
      route.navigate(['/login']);
      console.log("GOODBYE!");

    })

  }


   public getEvents(dataType: string, object: any, callback): Array<any> {

    switch (dataType){

      case "root":

        this.getEventsByRoot().subscribe(rootList => {
          callback(rootList);
        });
        break;
      case "year":

        this.getEventsByYear(object.year).subscribe(yearList => {
          callback(yearList)
        });
        break;

      case "month":
        this.getEventsByMonth(object.year, object.month, function (result) {
          callback(result);
        });
        break;
      case "day":
        this.getEventsByDay(object.year,object.month,object.day,function (result) {
          callback(result);
        })
        break;
      case "hour":
        this.getEventsByHour(object.year,object.month,object.day, object.hour,function (result) {
          callback(result);
        })
        break;

       default:
        callback( ["ERROR: Wrong identifier"]);
        return
    }

  }


  public createEvent(date: any, startObject: any, endObject: any){

    this.getEventsByHour(date.year, date.month, date.day, startObject.hour, function (result) {
      if(result){
        console.log(result)
        console.log("Sorry, that date and time is already taken!");
      }
      else {
        const event = Object.assign(date, startObject, endObject);
        this.db.database.ref('/events').push(event);
      }
    })


  }



}
