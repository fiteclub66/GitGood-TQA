import {Component, OnDestroy, OnInit} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {AuthService } from '../../../services/auth.service';
import {Subscription} from "rxjs/Subscription";
import { CompleterService, CompleterData } from 'ng2-completer';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit, OnDestroy {

  members: Subscription;
  private sub: any;
  private id = "0";
  protected dataService: CompleterData;
  private searchString = '';


  public event = {
    meetingDate:{
      startingHour:'',
      day:'',
      month:'',
      year:'',
      endingHour:'',
    },
    members: []
  };
  constructor(private route: ActivatedRoute, public authService: AuthService, private completerService: CompleterService) {

  }

  day: Subscription;



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


    this.members = this.authService.getMembers().subscribe(memberList =>{
      console.log(memberList);
      this.dataService = this.completerService.local(memberList, 'name', 'name').descriptionField('email');
    });




    this.sub = this.route.params.subscribe(params => {
      this.id = params['id'];
    });

    this.day = this.authService.getEventsByDay({year:2017, month:7, day:6}).subscribe(x => console.log(x));
  }



  ngOnDestroy(){

    this.members.unsubscribe();
    this.sub.unsubscribe();
    this.day.unsubscribe();
  }

}
