import { Component, OnInit } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {_getAngularFireAuth, AngularFireAuth} from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import {FormControl, FormGroup} from "@angular/forms";
import {Router} from "@angular/router";
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  user: Observable<firebase.User>;

  myform: FormGroup;


  ngOnInit() {

    this.myform = new FormGroup({
      name: new FormGroup({
        firstName: new FormControl(),
        lastName: new FormControl(),
      }),
      email: new FormControl(),
      password: new FormControl(),
      language: new FormControl()
    });
  }
  constructor(public afAuth: AngularFireAuth, private router: Router) {
    this.user = afAuth.authState;
  }


  createUser(email, password) {

    firebase.auth().createUserWithEmailAndPassword(email, password);
  }

  loginEmail(email: string, password: string ) {


    var route = this.router;
    this.afAuth.auth.signInWithEmailAndPassword(email, password).then(function (result){
      console.log(result);
      route.navigate(['']);
      this.r
    }).catch( function (error){
      console.log(error);
    });

  }

  loginGoogle(){

    var route = this.router;
    this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider).then( function (result) {
      route.navigate(['']) ;
      console.log(result);
    });
  }

  logout() {
    this.afAuth.auth.signOut();
  }



}
