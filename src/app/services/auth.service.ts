///<reference path="../../../node_modules/rxjs/add/operator/mergeMap.d.ts"/>
import {Injectable, OnInit} from '@angular/core';
import {AngularFireAuth} from 'angularfire2/auth';
import {Router} from '@angular/router';
import * as firebase from 'firebase/app';
import {AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable} from 'angularfire2/database';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import {GitEvent} from "../models/GitEvent";
import {EmailService} from "./email.service";
import {Observable} from "rxjs/Observable";
@Injectable()
export class AuthService {

  user: any;



  constructor(public afAuth: AngularFireAuth,public db: AngularFireDatabase, private router: Router) {
    this.user = firebase.auth().currentUser;
  }


  createUser(email, password) {

    firebase.auth().createUserWithEmailAndPassword(email, password);
    firebase.auth().onAuthStateChanged(user => {
      user.sendEmailVerification();
      this.router.navigate(['a']);

    });
  }




  public getEventsByYear(_date: Date, room:number): FirebaseListObservable<any> {
  return this.db.list('/events/'+room, {
    query: {
      orderByChild: 'meetingDate/year',
      equalTo: _date.getFullYear()
    }
  });
}


  public getEventsByYearAllRooms(_date: Date):Promise<Array<any>> {

    return new Promise( resolve => {
      this.db.list('/events').subscribe(roomList =>{
        let eventsList =[];
        roomList.forEach((room, index)=>{
          console.log("room",room);
          for(let event in room){
            if(room[event].meetingDate.year === _date.getFullYear()){
              eventsList.push({...room[event]});
            }
          }
        });
        resolve(eventsList);
      })
    })
  }

  public getEventsByHour(reservation: Date, room:number): Promise<any> {


    return new Promise(resolver => {

      this.getEventsByDay(reservation,room).then(_dayList =>
        resolver(_dayList.filter(event =>
          event.meetingDate.startingHour === reservation.getHours()))
      )
    })
  }

  private checkStartAndEndTime(reservation: GitEvent, room:number) {



    let dateAvailable = true;
    const _date = new Date(reservation.getMeetingDate().year, reservation.getMeetingDate().month-1,
                            reservation.getMeetingDate().day, reservation.getStartingHour()/100);

    console.log(_date);
    return new Promise( resolve => {
      this.getEventsByDay(_date,room).then(_dayList => {

        console.log("dayList",_dayList);
        const endingHourInBetween = _dayList.filter(event =>
        event.meetingDate.endingHour > reservation.getEndingHour() && event.meetingDate.startingHour < reservation.getEndingHour());

        const startingHourInBetweenList = _dayList.filter(event =>
        event.meetingDate.endingHour > reservation.getStartingHour() && event.meetingDate.startingHour < reservation.getStartingHour());

        const startHourList = _dayList.filter(event => event.meetingDate.startingHour === reservation.getStartingHour());

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

          dateAvailable =  false;
        }

        resolve(dateAvailable);
      });
    });
  }



  public getEventsByDay(reservation: Date, room:number ): Promise<any> {

    return new Promise( resolver => {
      this.getEventsByMonth(reservation,room).then(_monthList => {

        console.log("monthList",_monthList);
        resolver(_monthList.filter(event =>
          event.meetingDate.day === reservation.getDate()
          )
        )
      })
    });

  }


  public getEventsByMonth(reservation: Date, room:number ): Promise<any> {

    return new Promise(resolve => {
      this.getEventsByYear(reservation,room).subscribe(_yearList => {
        //console.log(_yearList);
        resolve( _yearList.filter(event =>
        event.meetingDate.month === reservation.getMonth() + 1));
        // console.log(event.meetingDate.month === reservation.getMonth() + 1);
      });
    });
  }



  public getEventByID(id:string): Promise<any>{

    return new Promise(resolve => {
      this.db.object('/events/1/'+id).subscribe(event => {
        resolve(event);
      })
    });
  }

  public getEmployees(): FirebaseListObservable<any>{
    return this.db.list('/users/employees');
  }

  public getManagers(): FirebaseListObservable<any>{
    return this.db.list('/users/managers');
  }


  public getAdmins(): FirebaseListObservable<any>{
    return this.db.list('/users/admin');
  }

  public getWorkers(): Promise<any>{

    return new Promise((resolve, reject) =>{
      this.db.object('/users').subscribe(workerList  => {
    //    console.log('worker list', workerList);
      resolve(workerList);
      }, error=> {
        console.log('error was thrown', error);
      });
      })
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

      });

    }).catch(error => {
      console.log("Error login in: ", error);
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


  public createEvent(room: number,reservation: GitEvent) {

    this.checkStartAndEndTime(reservation,room).then(dateAvailable => {

      if(dateAvailable){
        this.db.list('/events/'+room).push(reservation)
          .then(resolve => {
            let email = new EmailService;
            email.sendInvitationToMultipleEmails(reservation.getMembers());
            console.log("Event created in the database successfully" + resolve)
          })
          .catch(error => {
            console.log("Error occurred\n" + error.message);
          })
      }
    });



  }

  public updateEvent(room: number, oldEvent:GitEvent, updatedEvent: GitEvent) {

    const oldEventREservation = new Date(oldEvent.getMeetingDate().year, oldEvent.getMeetingDate().month,oldEvent.getMeetingDate().day, oldEvent.getMeetingDate().startingHour);
    this.getEventsByHour(oldEventREservation,room).then(event => {

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
