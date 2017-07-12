import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable} from "rxjs/Observable";
import * as firebase from 'firebase/app';
import {AngularFireAuth} from "angularfire2/auth";
import {AuthService} from "../../services/auth.service";
import {Subscription} from "rxjs/Subscription";

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit, OnDestroy {

  _root: Subscription;

  constructor(public afAuth: AngularFireAuth, public authService: AuthService) {

  }


  ngOnInit() {


    // gets the UID of the current user
    console.log(this.authService.getCurrentUserID());


  }


  ngOnDestroy(){
    this._root.unsubscribe();
  }

}
