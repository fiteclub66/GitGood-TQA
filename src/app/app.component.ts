import { Component } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import construct = Reflect.construct;
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import {AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable} from "angularfire2/database";
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  newData = '';
  newKey='';

  title = 'Conference Room Scheduler';

  user: Observable<firebase.User>;
   items: FirebaseListObservable<any[]>;
  constructor(public afAuth: AngularFireAuth, db: AngularFireDatabase) {
    this.user = afAuth.authState;
    this.items = db.list('/schedule', { preserveSnapshot: true });
  }


  removeDatabase() {
    const promise = this.items.remove();
    promise
      .then(_ => console.log('success'))
      .catch(err => console.log(err, 'You do not have access!'));
  }

  setHourToTaken(taken: string, hour: number) {
    const  post = {};
    post[hour] = taken;
    this.items
      .subscribe(snapshots => {
        snapshots.forEach(snapshot => {


          if (snapshot.val().hasOwnProperty(hour) ) {

            this.items.update(snapshot.key,post)
              .then(_ => console.log('success'))
              .catch(err => console.log(err, 'You dont have access!'));
          }


        });
      });
 }

  addNewHourEntry(newValue: string, myKey: string) {


    const  post = {};
    post[myKey] = newValue;
    const promise = this.items.push(post);
    promise
      .then(_ => console.log('success'))
      .catch(err => console.log(err, 'You dont have access!'));
  }





}

