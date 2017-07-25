import { Injectable } from '@angular/core';
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours,
  isWeekend
} from 'date-fns';
import fedHolidays from '@18f/us-federal-holidays'

@Injectable()
export class DateService {

  constructor() { }


  private isHoliday = (date: Date) : boolean => {
  
  	return fedHolidays.isAHoliday(date);
  }

  public isDateDisabled = (date : Date) : boolean => {
  	if (date.getMonth() == 7 && date.getDate() == 4) {
  		console.log("4th",this.isHoliday(date) ,isWeekend(date), fedHolidays, date.toString())
  	}
  	return this.isHoliday(date) || isWeekend(date)
  }

  public isDateTimeDisabled = (date : Date) : boolean => {
  	return  this.isHoliday(date) || isWeekend(date) ||( date.getHours() <= 8 && date.getHours() >= 17 )
  }




}
