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


  handleAddMember(obj: any) {
    console.log(obj);
    this.event.members.push(obj.originalObject);
    this.searchString = '';
  }

  removeUser(index: number){
    this.event.members.splice(index, 1);
  }

  ngOnInit() {

    this.members = this.authService.getWorkers().subscribe(users => {
      let mergedUsers = Object.assign({}, users.employees, users.managers, users.admin);
      let usersArray = Object.keys(mergedUsers).map((k) => mergedUsers[k]);
      console.log(usersArray);
      this.dataService = this.completerService.local(usersArray, 'name', 'name').descriptionField('email');

    });

    this.sub = this.route.params.subscribe(params => {
      this.id = params['id'];
    });

  }



  ngOnDestroy(){

    this.members.unsubscribe();
    this.sub.unsubscribe();
  }

}
