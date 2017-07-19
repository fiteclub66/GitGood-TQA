import {Component, OnChanges, OnInit} from '@angular/core';
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-admin-console',
  templateUrl: './admin-console.component.html',
  styleUrls: ['./admin-console.component.css']
})
export class AdminConsoleComponent implements OnInit {

  users: any;
  managers: any;
  admins: any;
  selectedUser: any;
  selectedManager: any;
  selectedAdmin: any;
  constructor(public auth: AuthService) {


  }

  ngOnInit() {

    this.selectedUser = "Users";
    this.selectedManager = "Managers";
    this.selectedAdmin = "Admins";
    this.users = this.auth.getUsers();
    this.managers = this.auth.getManager();
    this.admins = this.auth.getAdmin();




  }

  onUserChange(selected){
    console.log(selected);
    this.selectedUser = selected;
  }
  onManagerChange(selected){
    console.log(selected);
    this.selectedManager = selected;
  }
  onAdminChange(selected){
    console.log(selected);
    this.selectedAdmin = selected;
  }

}
