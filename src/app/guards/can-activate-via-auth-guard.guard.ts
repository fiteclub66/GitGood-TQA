import { Injectable } from '@angular/core';
import {AngularFireAuth} from "angularfire2/auth";
import { CanActivateChild, Router} from "@angular/router";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/do';
import {Observable} from "rxjs/Observable";

@Injectable()
export class CanActivateViaAuthGuardGuard implements CanActivateChild{
  constructor(
    private afAuth: AngularFireAuth,
    private router: Router
  ) {}

  canActivateChild(): Observable<boolean> {
    return this.afAuth.authState
      .take(1)
      .map(authState => !!authState)
      .do(auth => !auth ? this.router.navigate(['/login']) : true);
  }
}
