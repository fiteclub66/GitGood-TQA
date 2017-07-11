import {AuthService } from '../../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit {

  constructor(private route: ActivatedRoute, private router: Router, public authService: AuthService) { }

   ngOnInit() {
  	this.sub = this.route.params.subscribe(params => {
  		this.id = params['id'];
  		console.log('local ID', this.id);
  		this.authService.getEvents("root" ,{}, (root) => {
  			console.log(root);
  			console.log(root.length);

  			let meetings = root.filter(meeting => meeting.$key == this.id);
  			console.log('matching', meetings);
  			//if no meeting is found, redirect to 404
  			if(meetings.length == 0)
  			{
  				this.router.navigate(['/404'], {queryParams: {'message': `Meeting by ID ${this.id} not found`}});
  			}
  			else{
  				this.meeting = meetings[0]
  			}
  			
  		});
  	})

    
  }

  private filterMeetings(meeting){
  	return meeting.$key == this.id;
  }
  private sub : any;
  private id : string = "234";
  private meeting : any = {};

  //expects format like 1000, 1300
  private formatTime(time: number) : string
  {
  	let prefix = '';
  	let am = true;
  	if(time > 1100)
  	{
  		am = false;
  	}
  	if(time < 1000)
  	{
  		prefix = time.toString()[0];
  	}
  	else{
  		prefix = time.toString().slice(0, 2);
  	}
  	return `${prefix}:00 ${am ? "AM" :  "PM"}`
  }

  ngOnDestroy(){
  	this.sub.unsubscribe()
  }

}
