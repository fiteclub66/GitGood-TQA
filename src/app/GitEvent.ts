/**
 * Created by Tenor on 7/24/2017.
 */

export class GitEvent {

  private _date: Date;
  private _endingHour: number;
  private _description: string;
  private _title:string;
  private _room: number;
  private _members: Array<string>;
  public _meetingDate: any;

  constructor(){
    this.setEvent(new Date(), 0,'','',0,[]);


  }


  public setEvent(date:Date, endingHour:number,description:string, title:string, room:number, members: Array<string>) {

    this._date = date;
    this._description = description;
    this._endingHour = endingHour;
    this._room = room;
    this._title = title;

    this._members = members;
    this.setMeetingDate();
  }
  private setMeetingDate(){
    this._meetingDate = {
      year:0,
      month:0,
      day:0,
      startingHour:0,
      endingHour: 0
    }
  }

  public getMembers(): Array<string> {
    return this._members;
  }

  public getDate(): Date{
    return this._date
  }

  public getStartingHour():number{
    return this._date.getHours();
  }

  public getEndingHour(): number {
    return this._endingHour;
  }

  public getDescription():string{
    return this._description;
  }

  public getTitle():string{
    return this._title;
  }

  public getRoom():number{
    return this._room;
  }




  public setDate(date: Date){
    this._date = date;
  }

  public setEndingHour(endingHour:number){
    this._endingHour = endingHour;
  }

  public setDescription(description: string){
    this._description = description;
  }

  public setTitle(title: string){
     this._title = title;
  }

  public setRoom(room:number){
    this._room = room;
  }

  public setMembers(members: Array<string>){
    this._members = members;
  }

  public addMember(member: string){
    this._members.push(member);
  }
}
