import {Component, OnDestroy, OnInit} from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import {AuthService } from '../../../services/auth.service';
import {Subscription} from "rxjs/Subscription";

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit, OnDestroy {

  day: Subscription;
  private sub: any;
  private id = "234";


  constructor(private route: ActivatedRoute, public authService: AuthService) {

  }


  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.id = params['id'];
    });

    this.day = this.authService.getEvents("day", {year:2018, month:2, day:6}).subscribe(x => console.log(x));
  }


  ngOnDestroy(){

    this.sub.unsubscribe();
    this.day.unsubscribe();
  }

}
