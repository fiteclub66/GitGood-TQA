import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanActivateChild} from '@angular/router';
import { Observable } from 'rxjs/Observable';
import {AngularFireAuth} from "angularfire2/auth";
import {AuthService} from "../services/auth.service";

@Injectable()
export class AdminGuard  implements CanActivateChild {

  constructor(private router: Router, private authService: AuthService, private auth: AngularFireAuth) {
  }

  canActivateChild(): Observable<boolean> | Promise<boolean> | boolean {
    return this.auth.authState.map(authState => {
      console.log(authState);
      return this.authService.getAdminByEmail(authState.email).map(exists => {
        console.log(exists);
        if(exists.length === 0){
          this.router.navigate(['/m'])
        }
        return true;
      });
    }).flatMap(doubleObservableToSingle => doubleObservableToSingle);
  }

}
