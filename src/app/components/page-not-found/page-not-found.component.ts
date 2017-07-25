import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.css']
})
export class PageNotFoundComponent implements OnInit {

  constructor(private route: ActivatedRoute) { 

  }

  ngOnInit() {
  	this.sub = this.route.queryParams.subscribe(queryParams => {
  		this.message = queryParams['message'];
  	})
  }
  private sub : any;
  private message : string = "";

  ngOnDestroy(){
  	this.sub.unsubscribe()
  }

}
