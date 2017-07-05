import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy{


  private sub: Subscription;

  constructor(public authService: AuthService) { }

  ngOnInit() {
    this.sub = this.authService.afAuth.authState.subscribe(authResp =>
      console.log('isAuthenticated: ', authResp)
  );

  }


  ngOnDestroy() {
    this.sub.unsubscribe();
  }



}
