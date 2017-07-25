import {Component, OnDestroy, OnInit} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {AuthService } from '../../../services/auth.service';
import {DateService } from '../../../services/date.service';

import {Subscription} from "rxjs/Subscription";
import { CompleterService, CompleterData } from 'ng2-completer';
import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import {GitEvent} from "../../../models/GitEvent";

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit, OnDestroy {

  members: Promise<any>;
  private sub: any;
  private id = "0";
  protected dataService: CompleterData;
  private searchString = '';
  event:GitEvent;



  constructor(private route: ActivatedRoute, private dateService: DateService, public authService: AuthService, private completerService: CompleterService) {

  }

  rooms = [{number:1,name:"Room 1"}, {number:2,name:"Room 2"},{number:3,name:"Room 3"},];


  handleAddMember(obj: any) {
    console.log(obj);
    this.event.addMember(obj.originalObject);
    this.searchString = '';
  }

  removeUser(index: number){
    this.event.getMembers().splice(index, 1);
  }

  ngOnInit() {

  this.event = new GitEvent();

  console.log(this.event);

    this.members = this.authService.getWorkers().then(users => {
      const mergedUsers = Object.assign({}, users.employees, users.managers, users.admin);
      const usersArray = Object.keys(mergedUsers).map((k) => mergedUsers[k]);
      console.log(usersArray);
      this.dataService = this.completerService.local(usersArray, 'name', 'name').descriptionField('email');

    });

    this.sub = this.route.params.subscribe(params => {
      this.id = params['id'];
    });
    //this.day = this.authService.getEventsByDay({year:2017, month:7, day:6}).subscribe(x => console.log(x));
  }

  disabledDays = (date: NgbDateStruct, current: { year: number; month: number; }): boolean => {
    //console.log(date, current)

    if (date.day === 4) {
      console.log('disabled?', date, new Date(date.year, date.month - 1, date.day, 0, 0, 0).toString(),
        this.dateService.isDateDisabled(new Date(date.year, date.month - 1, date.day, 0, 0, 0))
      );
    }
    return this.dateService.isDateDisabled(new Date(date.year, date.month - 1, date.day, 0, 0, 0));

  };





  ngOnDestroy(){

    this.sub.unsubscribe();
  }

}
