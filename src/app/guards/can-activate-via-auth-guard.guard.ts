import { Injectable } from '@angular/core';
import {AngularFireAuth} from "angularfire2/auth";
import { CanActivate, CanActivateChild, Router} from "@angular/router";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/do';
import {Observable} from "rxjs/Observable";

@Injectable()
export class CanActivateViaAuthGuardGuard implements CanActivateChild, CanActivate {
  constructor(private router: Router, private auth: AngularFireAuth) {
  }

  canActivateChild(): Observable<boolean> {
    return this.auth.authState.map(authState => {
      console.log('activate?', !!authState);
      if(!(!!authState)){
        this.router.navigate(['login'])
      }
      return !!authState;
    });
  }

  canActivate(): Observable<boolean> {
    return this.auth.authState.map(authState => {
      console.log('activate?', !!authState);
      if(!(!!authState)){
        this.router.navigate(['login'])
      }
      return !!authState;
    });
  }
}

