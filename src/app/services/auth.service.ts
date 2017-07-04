import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {AngularFireAuth} from 'angularfire2/auth';
import {Router} from '@angular/router';
import * as firebase from 'firebase/app';
import {AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable} from 'angularfire2/database';
import 'rxjs/add/operator/map';


@Injectable()
export class AuthService {

  user: Observable<firebase.User>;

  constructor(public afAuth: AngularFireAuth, public router: Router, public db: AngularFireDatabase) {
    this.user = afAuth.authState;
  }



  createUser(email, password) {

    firebase.auth().createUserWithEmailAndPassword(email, password).then(function(results){
      console.log(results)
    }).catch( function(errors){
      console.log(errors)
    });
  }


  private getSchedule(){

    return this.db.object('/schedule');
  }


  private getScheduleYear(year: number) {

    return this.db.object('/schedule/' + year)

  }

  private getScheduleHour(year: number, month: number, day: number, hour: number){
    return this.db.object('/schedule/' + year + '/' + month + '/' + day + '/' + hour + '/')
  }

  private getScheduleDay(year: number, month: number, day: number){
    return this.db.object('/schedule/' + year + '/' + month + '/' + day + '/')
  }

  private getScheduleMonth(year: number, month: number){
    return this.db.object('/schedule/' + year + '/' + month )
  }


  loginEmail(email: string, password: string) {


    const route = this.router;
    this.afAuth.auth.signInWithEmailAndPassword(email, password).then(function (result){
      console.log(result);
      route.navigate(['/calendar']);
    }).catch( function (error){
      console.log(error);
    });

  }

  isLoggedIn() {

     this.afAuth.authState.subscribe(auth => {
       if(auth) {
         return true;
       }
       else {
         return false;
       }
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


   getEventsArray(kindOfData: string, value, callback): Array<any> {
    let list;

    switch (kindOfData){

      case "root":

        list = this.getSchedule();
        break;
      case "year":
        list = this.getScheduleYear(value.year);
        break;
      case "month":
        list = this.getScheduleMonth(value.year, value.month);
        break;
      case "day":
        list = this.getScheduleDay(value.year, value.month, value.day);
        break;
      case "hour":
        list = this.getScheduleHour(value.year, value.month, value.day, value.hour);
        break;

       default:
        callback( ["ERROR: Wrong identifier"]);
        return
    }

    list.subscribe((items: Array<any>) => {
      callback(items)
    })

  }


}
