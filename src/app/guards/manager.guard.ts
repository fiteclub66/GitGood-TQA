import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanActivateChild} from '@angular/router';
import { Observable } from 'rxjs/Observable';
import {AuthService} from "../services/auth.service";
import * as firebase from 'firebase/app';
import {AngularFireAuth} from "angularfire2/auth";

@Injectable()
export class ManagerGuard implements CanActivateChild {

  constructor(private router: Router, private authService: AuthService, private auth: AngularFireAuth) {
  }

  canActivateChild(): Observable<boolean> | Promise<boolean> | boolean {
     return this.auth.authState.map(authState => {
      console.log(authState);
        return this.authService.getManagerByEmail(authState.email).map(exists => {
         console.log(exists);
         if(exists.length === 0){
           this.router.navigate(['/u'])
         }
         return true;
       });
    }).flatMap(doubleObservableToSingle => doubleObservableToSingle);
  }

}
