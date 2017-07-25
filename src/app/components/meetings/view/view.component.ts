import {AuthService } from '../../../services/auth.service';
import {Component, OnDestroy, OnInit} from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import {Subscription} from "rxjs/Subscription";

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit, OnDestroy {

  _eventByID: Promise<any>;
  private sub: any;
  private id: string = "234";
  private meeting: any = {};


  constructor(private route: ActivatedRoute, private router: Router, public authService: AuthService) {
  }

  ngOnInit() {

    this.sub = this.route.params.subscribe(params => {
      this.id = params['id'];
      console.log('local ID', this.id);
      this._eventByID = this.authService.getEventByID(this.id).then(event => {
        console.log('matching', event);

        // if no meeting is found, redirect to 404
        if (!event) {
          this.router.navigate(['404'], {queryParams: {'message': `Meeting by ID ${this.id} not found`}});
        }
        else {
          this.meeting = event
        }
      });
    })


  }

  //expects format like 1000, 1300
  private formatTime(time: number): string {
    if (!time) {
      return ""
    }

    let prefix = '';
    let am = true;
    if (time > 1100) {
      am = false;
    }
    if (time < 1000) {
      prefix = time.toString()[0];
    }
    else {
      prefix = time.toString().slice(0, 2);
    }
    return `${prefix}:00 ${am ? "AM" : "PM"}`
  }

  ngOnDestroy() {
    this.sub.unsubscribe();

  }
}
