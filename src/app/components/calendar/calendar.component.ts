import { Component, OnInit } from '@angular/core';
import {Observable} from "rxjs/Observable";
import * as firebase from 'firebase/app';
import {AngularFireAuth} from "angularfire2/auth";

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {


  user: Observable<firebase.User>;

  constructor(public afAuth: AngularFireAuth) {
    this.user = afAuth.authState;
  }


  ngOnInit() {
  }

}
