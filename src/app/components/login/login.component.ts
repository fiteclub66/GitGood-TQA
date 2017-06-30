import { Component, OnInit } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {_getAngularFireAuth, AngularFireAuth} from 'angularfire2/auth';
import * as firebase from 'firebase/app';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  user: Observable<firebase.User>;

  constructor(public afAuth: AngularFireAuth) {
    this.user = afAuth.authState;
  }


  login() {


    this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).then( function (result){

      window.location.href = "/dashboard";

    }).
      catch(function (error) {
      console.log(error.message);
    })
  }

  logout() {
    this.afAuth.auth.signOut();
  }


  ngOnInit() {
  }

}
