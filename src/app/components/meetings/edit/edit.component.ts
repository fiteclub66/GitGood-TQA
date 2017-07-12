import {Component, OnDestroy, OnInit} from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import {AuthService } from '../../../services/auth.service';
import {Subscription} from "rxjs/Subscription";
import { CompleterService, CompleterData } from 'ng2-completer';


@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit, OnDestroy {

  constructor(private route: ActivatedRoute, public authService: AuthService, private completerService: CompleterService) {
    this.dataService = completerService.local(this.users, 'name', 'name').descriptionField('email');
  }

  day: Subscription;

  private users = [{email: 'foo@bar.com', name: 'foo bar'}, {email:'hello@world.com', name:'Hello World'}, {name:'Juan', email:'jtenorio@gmail.com'}, {name:'Stephen Strickland', email:'stephenstrickland@live.com'}];
  private sub: any;
  private id = "0";
  protected dataService: CompleterData;
  private searchString = '';


  private event = {
    startingDate: {

    },
    startingHour: 8,
    endingHour: 9,
    members: []
  }

  handleAddMember(obj: any)
  {
    console.log(obj);
    this.event.members.push(obj.originalObject);
    this.searchString = '';
  }

  removeUser(index: number){
    this.event.members.splice(index, 1);
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
