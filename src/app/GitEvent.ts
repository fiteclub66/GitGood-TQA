/**
 * Created by Tenor on 7/24/2017.
 */

export class GitEvent {

  private description: string;
  private title:string;
  private members: Array<string>;
  public meetingDate: any;

  constructor(){
    this.setEvent('','',[]);
  }


  public setEvent(description:string, title:string, members: Array<string>) {

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
      startingHour:0,
      endingHour: 0
    }
  }

  public getMeetingDate(): any{
    return this.meetingDate;
  }

  public getMembers(): Array<string> {
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





  public setEndingHour(endingHour:number){
    this.meetingDate.endingHour = endingHour;
  }

  public setDescription(description: string){
    this.description = description;
  }

  public setTitle(title: string){
     this.title = title;
  }


  public setMembers(members: Array<string>){
    this.members = members;
  }

  public addMember(member: string){
    this.members.push(member);
  }
}
