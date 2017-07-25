/**
 * Created by Tenor on 7/24/2017.
 */
import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';

export class Member{
  public name : string;
  public email: string;
}

export class GitEvent {

  public description: string;
  public title:string;
  private members: Array<Member>;
  public meetingDate: any;
  public $key:string;
  public room : number;

  constructor(){
    this.setEvent('','',[]);
  }

  static fromData(obj: any) : GitEvent
  {
    let e = new GitEvent();
    e.title = obj.title;
    e.description = obj.description;
    e.meetingDate = obj.meetingDate;
    e.$key = obj.$key;
    e.members = obj.members.map((member) => {
      let m  = new Member();
      m.email = member.email;
      m.name = member.name;
      return m;
    });
    e.room = obj.room;

    return e;

  }

  public getStartingDate() : Date {
        return new Date(this.meetingDate.year, this.meetingDate.month-1, this.meetingDate.day, this.meetingDate.startingHour/100,0,0)
   // return new Date(this.meetingDate.year, this.meetingDate.month, this.meetingDate.day, this.meetingDate.startingHour)
  }

  public getEndingDate() : Date {
    return new Date(this.meetingDate.year, this.meetingDate.month-1, this.meetingDate.day, this.meetingDate.endingHour/100,0,0)
    // return new Date(this.meetingDate.year, this.meetingDate.month, this.meetingDate.day, this.meetingDate.endingHour)
  }


  public setEvent(description:string, title:string, members: Array<Member>) {

    this.description = description;
    this.title = title;
    this.members = members;
    this.setEmptyMeetingDate();
  }


  private setEmptyMeetingDate(){
    this.meetingDate = {
      year:0,
      month:0,
      day:0,
      startingHour:8,
      endingHour: 9
    }
  }

  public getMeetingDate(): any{
    return this.meetingDate;
  }

  public getMembers(): Array<Member> {
    return this.members;
  }


  public getStartingHour():number{
    return this.meetingDate.startingHour;
  }

  public getEndingHour(): number {
    return this.meetingDate.endingHour;
  }

  public getDescription():string{
    return this.description;
  }

  public getTitle():string{
    return this.title;
  }


public updateMeetingDateByStruct(eventStruct : NgbDateStruct): void{
    this.meetingDate.year = eventStruct.year;
    this.meetingDate.month = eventStruct.month;
    this.meetingDate.day = eventStruct.day;
}


  public setEndingHour(endingHour:number){
    this.meetingDate.endingHour = endingHour;
  }

  public setDescription(description: string){
    this.description = description;
  }

  public setTitle(title: string){
     this.title = title;
  }


  public setMembers(members: Array<Member>){
    this.members = members;
  }

  public addMember(member: any){
    this.members.push(member);
  }
}
