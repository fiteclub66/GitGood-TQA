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

  _user: Observable<firebase.User>;
  _root: Subscription;

  constructor(public afAuth: AngularFireAuth, public authService: AuthService) {
    this._user = afAuth.authState;

  }


  ngOnInit() {


    this.authService.getEventsByRoot().subscribe(root => {
      console.log(root[0]);
      this._root = root;
    });


  }


  ngOnDestroy(){
    this._root.unsubscribe();
  }

}
