import { Component, OnInit } from '@angular/core';
import {Observable} from "rxjs/Observable";
import * as firebase from 'firebase/app';
import {AngularFireAuth} from "angularfire2/auth";
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {


  user: Observable<firebase.User>;

  constructor(public afAuth: AngularFireAuth, public authService: AuthService) {
    this.user = afAuth.authState;
  }


  ngOnInit() {

    const obj = {
      year: 2018,
      month:2,
      day:5,
      hour:5

    };

/*    this.authService.getEvents("jgkgh", obj, function (result) {
      console.log(result);
    });*/

    this.authService.createEvent(obj, obj, obj);
  }

}
