///<reference path="../../../node_modules/rxjs/add/operator/mergeMap.d.ts"/>
import {Injectable, OnInit} from '@angular/core';
import {AngularFireAuth} from 'angularfire2/auth';
import {Router} from '@angular/router';
import * as firebase from 'firebase/app';
import {AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable} from 'angularfire2/database';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';

@Injectable()
export class AuthService {

  user: any;



  constructor(public afAuth: AngularFireAuth,public db: AngularFireDatabase, private router: Router) {
    this.user = firebase.auth().currentUser;
  }




  createUser(email, password) {

    firebase.auth().createUserWithEmailAndPassword(email, password);
    this.router.navigate(['/a']);
  }


  public  getEventsByRoot(): FirebaseListObservable<any> {

    return this.db.list('/events', {
      query: {
        orderByChild: 'meetingDate/year'
      }
    });
  }


  public getEventsByYear(_date: Date): FirebaseListObservable<any> {

    return this.db.list('/events', {
      query: {
        orderByChild: 'meetingDate/year',
        equalTo: _date.getFullYear()
      }
    });
  }

  public getEventsByHour(reservation: Date): FirebaseListObservable<any> {


    return this.getEventsByDay(reservation).map(_dayList =>
      _dayList.filter(event =>
      event.meetingDate.startingHour === reservation.getHours())) as FirebaseListObservable<any>;

  }

  private checkStartAndEndTime(reservation: any) {

    console.log(reservation);

    const _date = new Date(reservation.meetingDate.year, reservation.meetingDate.month-1, reservation.meetingDate.day, reservation.meetingDate.startingHour/100,0,0,0);

    console.log(_date);
    return this.getEventsByDay(_date).map(_dayList => {

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

  public getEventsByDay(reservation: Date ): FirebaseListObservable<any> {

    return this.getEventsByMonth(reservation).map(_monthList =>
      _monthList.filter(event =>
      event.meetingDate.day === reservation.getDay())) as FirebaseListObservable<any>;

  }

  public getEventsByMonth(reservation: Date ): FirebaseListObservable<any> {

    return this.getEventsByYear(reservation).map(_yearList =>
      _yearList.filter(event =>
      event.meetingDate.month === reservation.getMonth())
    ) as FirebaseListObservable<any>;

  }

  public getEventByID(id:string): FirebaseObjectObservable<any>{
    return this.db.object('/events/'+id);
  }

  public getUsers(): FirebaseListObservable<any>{
    return this.db.list('/users/employees');
  }

  public getManagers(): FirebaseListObservable<any>{
    return this.db.list('/users/managers');
  }


  public getAdmins(): FirebaseListObservable<any>{
    return this.db.list('/users/admin');
  }

  public getWorkers(): any{

    return this.db.object('/users');
  }






  loginEmail(email: string, password: string) {

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


      route.navigate(['/a']).catch(error =>{
        console.log(error);
      });

    });

  }

  isLoggedIn() {

    this.afAuth.authState.subscribe(auth => {
      return !!auth;
    });
  }

  loginGoogle():firebase.Promise<any> {

    const route = this.router;
    const self = this;
    return this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider).then(function (result) {
      self.user = result.user;

      self.getAdminByEmail(self.user.email).take(1).subscribe(AdminFound => {

        self.getManagerByEmail(self.user.email).take(1).subscribe(managerFound => {

        if(AdminFound.length ===  0 && managerFound.length === 0){
          self.db.object('/users/employees/'+self.user.uid).set({name:self.user.displayName, email: self.user.email});
        }

        });


      });

      route.navigate(['/a']).catch(error => {
        console.log(error);
      });

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

      this.db.object('users/managers/' + employee[0].$key).set(employee[0])
        .then(() => {
        this.db.list('users/employees').$ref.ref.child(employee[0].$key).remove();
        });
    })

  }


  public makeManagerUser(email: string){

    this.getManagerByEmail(email).subscribe(employee => {

      this.db.object('users/employees/' + employee[0].$key).set(employee[0])
        .then(() => {
          this.db.list('users/managers').$ref.ref.child(employee[0].$key).remove();
        });
    })

  }


  public makeEEAdmin(email: string){

    this.getEEByEmail(email).subscribe(employee => {

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


  public createEvent(room: number,reservation: any) {




    this.checkStartAndEndTime(reservation).take(1).subscribe(dateAvailable => {

      if(dateAvailable){
        this.db.list('/events/'+room).push(reservation)
          .then(resolve => {
            console.log("Event created in the database successfully" + resolve)
          })
          .catch(error => {
            console.log("Error occurred\n" + error.message);
          })
      }
    });

  }

  public updateEvent(room: number, oldEvent:any, updatedEvent: any) {

    this.getEventsByHour(oldEvent).take(1).subscribe(event => {

      if(event.members.includes(this.user.email)) {
        this.db.object('/events/' + room + "/" + event.$key).update(updatedEvent)
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
