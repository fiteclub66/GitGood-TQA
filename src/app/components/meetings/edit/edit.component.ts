import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import {AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {

  constructor(private route: ActivatedRoute, public authService: AuthService) { }

  ngOnInit() {
  	this.sub = this.route.params.subscribe(params => {
  		this.id = params['id'];
  	})

    this.authService.getEvents("day" ,{year:2018, month:2, day:6}, function(root){console.log(root);});
  }
  private sub : any;
  private id : string = "234";

  ngOnDestroy(){
  	this.sub.unsubscribe()
  }

}
