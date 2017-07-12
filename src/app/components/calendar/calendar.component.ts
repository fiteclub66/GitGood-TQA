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


  constructor(public afAuth: AngularFireAuth, public authService: AuthService) {

  }


  ngOnInit() {




  }


  ngOnDestroy(){

  }

}
