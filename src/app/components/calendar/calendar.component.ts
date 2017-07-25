import {Component, OnDestroy, OnInit, ChangeDetectionStrategy, ViewChild, TemplateRef} from '@angular/core';
import {Observable} from "rxjs/Observable";
import * as firebase from 'firebase/app';
import {AngularFireAuth} from "angularfire2/auth";
import {AuthService} from "../../services/auth.service";
import {Subscription} from "rxjs/Subscription";
import { Subject } from 'rxjs/Subject';
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours
} from 'date-fns';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarMonthViewDay,
  CalendarEventTimesChangedEvent
} from 'angular-calendar';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {FirebaseListObservable} from "angularfire2/database";
import {EmailService} from "../../services/email.service";
import {HttpClient} from "selenium-webdriver/http";
import {Http, HttpModule} from "@angular/http";
import {GitEvent} from "../../models/GitEvent";
import { Router, ActivatedRoute } from '@angular/router';






const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3'
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF'
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA'
  }
};



@Component({
  selector: 'app-calendar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
  providers:[HttpModule]
})
export class CalendarComponent implements OnInit, OnDestroy {

  _user: Observable<firebase.User>;
  _root: FirebaseListObservable<any>;
  view: string = 'month';
  refresh: Subject<any> = new Subject();
  viewDate: Date = new Date();
  @ViewChild('modalContent') modalContent: TemplateRef<any>;

  constructor(public afAuth: AngularFireAuth, public authService: AuthService, private modal: NgbModal,private http:Http, private r:ActivatedRoute, private router: Router) {
    this._user = afAuth.authState;

    this._root = authService.getEventsByYear(this.viewDate,1);

  }



  actions: CalendarEventAction[] = [{
    label: '<i class="fa fa-fw fa-pencil"></i>',
    onClick: ({event}: {event: CalendarEvent}): void => {
      this.handleEvent('Edited', event);
    }
  }, {
    label: '<i class="fa fa-fw fa-times"></i>',
    onClick: ({event}: {event: CalendarEvent}): void => {
      this.events = this.events.filter(iEvent => iEvent !== event);
      this.handleEvent('Deleted', event);
    }
  }];

    excludeDays: number[] = [0, 6];
    skipWeekends(direction: 'back' | 'forward'): void {
    if (this.view === 'day') {
      if (direction === 'back') {
        while (this.excludeDays.indexOf(this.viewDate.getDay()) > -1) {
          this.viewDate = subDays(this.viewDate, 1);
        }
      } else if (direction === 'forward') {
        while (this.excludeDays.indexOf(this.viewDate.getDay()) > -1) {
          this.viewDate = addDays(this.viewDate, 1);
        }
      }
    }
  }


    events: CalendarEvent[] = [];
  // events: Array<CalendarEvent<{gitEvent: GitEvent}>> = new Array<CalendarEvent<{gitEvent: GitEvent}>>({
  //   start: subDays(startOfDay(new Date()), 1),
  //   end: addDays(new Date(), 1),
  //   title: 'A 3 day event',
  //   color: colors.red,
  //   actions: this.actions
  // });
  //  = [{
  //   start: subDays(startOfDay(new Date()), 1),
  //   end: addDays(new Date(), 1),
  //   title: 'A 3 day event',
  //   color: colors.red,
  //   actions: this.actions
  // }, {
  //   start: startOfDay(new Date()),
  //   title: 'An event with no end date',
  //   color: colors.yellow,
  //   actions: this.actions
  // }, {
  //   start: subDays(endOfMonth(new Date()), 3),
  //   end: addDays(endOfMonth(new Date()), 3),
  //   title: 'A long event that spans 2 months',
  //   color: colors.blue
  // }, {
  //   start: addHours(startOfDay(new Date()), 2),
  //   end: new Date(),
  //   title: 'A draggable and resizable event',
  //   color: colors.yellow,
  //   actions: this.actions,
  //   resizable: {
  //     beforeStart: true,
  //     afterEnd: true
  //   },
  //   draggable: true
  // }];

 activeDayIsOpen: boolean = true;

  dayClicked({date, events}: {date: Date, events: CalendarEvent[]}): void {

    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
        this.viewDate = date;
      }
    }
  }

  eventTimesChanged({event, newStart, newEnd}: CalendarEventTimesChangedEvent): void {
    event.start = newStart;
    event.end = newEnd;
    this.handleEvent('Dropped or resized', event);
    this.refresh.next();
  }

  handleEvent(action: string, event: CalendarEvent): void {
    // this.router.navigate(['404'], {queryParams: {'message': `Meeting by ID ${this.id} not found`}});

    this.router.navigate(['../meetings', event.meta.gitEvent.$key], { relativeTo: this.r })
    // this.modalData = {event, action};
    // this.modal.open(this.modalContent, {size: 'lg'});
  }

   modalData: {
    action: string,
    event: CalendarEvent
  };

  addEvent(): void {
    this.events.push({
      title: 'New event',
      start: startOfDay(new Date()),
      end: endOfDay(new Date()),
      color: colors.red,
      draggable: true,
      resizable: {
        beforeStart: true,
        afterEnd: true
      }
    });
    this.refresh.next();
  }


  ngOnInit() {
    // Grabs events from the database and formats it for the calendar
    this._root.take(1).subscribe(x => {
      console.log("XX",x);
      x.forEach(entry => {

        console.log(entry.meetingDate);
        let event = GitEvent.fromData(entry);
         this.events.push(
         {
           title: event.title,
           start: event.getStartingDate(),
           end: event.getEndingDate(),
           color: colors.blue,
           meta:{
             gitEvent: event
           }
           
         });
         this.refresh.next();
        // this.events.push({
        //   title: entry.title,
        //   start:startOfDay( new Date(entry.meetingDate.year, entry.meetingDate.month-1, entry.meetingDate.day, entry.meetingDate.startingHour/100,0,0)),
        //   end: endOfDay(new Date(entry.meetingDate.year, entry.meetingDate.month-1, entry.meetingDate.day, entry.meetingDate.endingHour/100,0,0)),
        //   color: colors.red,
        //   draggable: true,
        //   resizable: {
        //     beforeStart: true,
        //     afterEnd: true
        //   }
        // })
      })


    });



  }

  beforeMonthViewRender({ body }: { body: CalendarMonthViewDay[] }): void {
    // body.forEach(day => {
    //   day.badgeTotal = day.events.filter(
    //     event => event.meta.incrementsBadgeTotal
    //   ).length;
    // });
  }


  ngOnDestroy(){
  }

}
