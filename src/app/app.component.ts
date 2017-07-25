import {Component, Pipe, PipeTransform} from '@angular/core';
import construct = Reflect.construct;
import {Router} from "@angular/router";
import {AngularFireAuth} from "angularfire2/auth";
import {AuthService} from "./services/auth.service";
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  constructor(router:Router, auth: AngularFireAuth, authService: AuthService) {

   router.navigate(['/a']);
  }
}
