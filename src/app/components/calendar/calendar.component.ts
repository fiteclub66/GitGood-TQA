import {Component, OnDestroy, OnInit, ChangeDetectionStrategy, ViewChild, TemplateRef, ViewEncapsulation} from '@angular/core';
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
  CalendarEventTimesChangedEvent,
  CalendarMonthViewDay
} from 'angular-calendar';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import fedHolidays from '@18f/us-federal-holidays'




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
  encapsulation: ViewEncapsulation.None,
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit, OnDestroy {

  _user: Observable<firebase.User>;
  _root: Subscription;
  view: string = 'month';
  viewDate: Date = new Date();
  @ViewChild('modalContent') modalContent: TemplateRef<any>;

  constructor(public afAuth: AngularFireAuth, public authService: AuthService, private modal: NgbModal) {
    this._user = afAuth.authState;


  }
  refresh: Subject<any> = new Subject();


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

beforeMonthViewRender({body}: {body: CalendarMonthViewDay[]}): void {
  //var holidays = fedHolidays.allForYear(2017);
  //console.log(body);
    body.forEach((day) => {
      //console.log(day.date)
      if (fedHolidays.isAHoliday(day.date)) {
         day.cssClass = 'odd-cell';
      }

      // if (day.date.getDate() % 2 === 1 && day.inMonth) {
      //   day.cssClass = 'odd-cell';
      // }
    });
  }


  events: CalendarEvent[] = [{
    start: subDays(startOfDay(new Date()), 1),
    end: addDays(new Date(), 1),
    title: 'A 3 day event',
    color: colors.red,
    actions: this.actions
  }, {
    start: startOfDay(new Date()),
    title: 'An event with no end date',
    color: colors.yellow,
    actions: this.actions
  }, {
    start: subDays(endOfMonth(new Date()), 3),
    end: addDays(endOfMonth(new Date()), 3),
    title: 'A long event that spans 2 months',
    color: colors.blue
  }, {
    start: addHours(startOfDay(new Date()), 2),
    end: new Date(),
    title: 'A draggable and resizable event',
    color: colors.yellow,
    actions: this.actions,
    resizable: {
      beforeStart: true,
      afterEnd: true
    },
    //draggable: true
  }];

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
    this.modalData = {event, action};
    this.modal.open(this.modalContent, {size: 'lg'});
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


  /**
  * Select Stuff below
  **/

  public items:Array<any> = [
    {
      id: 1,
      text: 'My Schedule',
      children: [
        {id: 54, text: 'Stephen Strickland'}
      ]
    },
    {
      id: 2,
      text: 'My Team',
      children: [
        {id: 2, text: 'Joe Smith'},
        {id: 9, text: 'Juan Tenorio'}
      ]
    },
    {
      id: 3,
      text: 'Shared Schedules',
      children: [
        {id: 3, text: 'Cameron Fite'},
        {id: 10, text: 'Brandon Cross'}
      ]
    }
    ];
  private value:any = {};
  private _disabledV:string = '0';
  private disabled:boolean = false;
 
  private get disabledV():string {
    return this._disabledV;
  }
 
  private set disabledV(value:string) {
    this._disabledV = value;
    this.disabled = this._disabledV === '1';
  }
 
  public selected(value:any):void {
    console.log('Selected value is: ', value);
  }
 
  public removed(value:any):void {
    console.log('Removed value is: ', value);
  }
 
  public refreshValue(value:any):void {
    this.value = value;
  }


  ngOnInit() {

  }


  ngOnDestroy(){

  }

}
