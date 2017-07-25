import { Injectable } from '@angular/core';
declare var emailjs: any;
@Injectable()
export class EmailService {

  email:any;
  constructor() {
  }


  public sendInvitation(email:string, name:string){

    this.email =  emailjs;
    this.email.send(
      "default_service",
      "temp",
      {to_name:name, notes:"Check this out", to_email: email, message_html:'\
      <html> \
      <head> \
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"> \
      <meta name="viewport" content="width=device-width, initial-scale=1.0"> \
      <title>Meeting Invitation</title> \
      <style type="text/css"> \
        @media(max-width:480px){ \
      table[class=main_table],table[class=layout_table]{width:300px !important;} \
      table[class=layout_table] tbody tr td.header_image img{width:300px !important;height:auto !important;} \
    }\
    a{color:#37aadc}\
    </style>\
    </head>\
    <body>\
      <table border="0" cellpadding="0" cellspacing="0" width="100%"> \
    <tbody> \
      <tr> \
        <td align="center" valign="top"> \
    <table border="0" cellpadding="0" cellspacing="0" class="main_table" width="600"> \
    <tbody> \
      <tr> \
        <td> \
          <table border="0" cellpadding="0" cellspacing="0" class="layout_table" style="border-collapse:collapse;border:1px solid #CCCCCC;" width="100%" > \
    <tbody> \
      <tr> \
        <td align="left" class="header_image"> \
    <img height="120" src="https://firebasestorage.googleapis.com/v0/b/conferenceroomscheduler-daca7.appspot.com/o/email_header_red.jpg?alt=media&token=641e0361-25b0-431f-b195-8957a2f6b343"\
     width="600" style="border:0;display:block;"> \
    </td> \
    </tr> \
    <tr><td style="font-size:13px;line-height:13px;margin:0;padding:0;">&nbsp;</td></tr> \
    <tr> \
      <td align="center" valign="top"> \
    <table align="center" border="0" cellpadding="0" cellspacing="0" width="85%"> \
    <tbody> \
      <tr> \
        <td align="center"> \
    <p style="font-family:Arial, Helvetica, sans-serif;font-size:14px;line-height:22px;"> \
      You have been invited to attend a meeting by Juan Tenorio Arzola<br> \
    </p> \
    </td> \
    </tr> \
    </tbody> \
    </table> \
    <table> \
      <tr> \
        <td> <button style="width: 140px"> Accept </button> </td> \
    <td> <button style="width: 140px"> Decline </button> </td> \
    <td> <button style="width: 140px"> Propose New Time </button> </td> \
    </tr> \
    </table> \
    <table> \
      <tr> \
        <td></td> \
    <td> \
      <button style="width: 140px"> View Event </button> \
    </td> \
    </tr> \
    </table> \
    </td> \
    </tr> \
    <tr><td style="font-size:13px;line-height:13px;margin:0;padding:0;">&nbsp;</td></tr> \
    <tr> \
      <td align="left" class="header_image"><a href="https://www.sparkpost.com/"><img height="67" src="https://firebasestorage.googleapis.com/v0/b/conferenceroomscheduler-daca7.appspot.com/o/email_footer_red.jpg?alt=media&token=68f5b2e2-54ba-4bc5-8b84-16fe88535382\0\
      " width="600" style="border:0;display:block;" alt="Sent via SparkPost"></a></td> \
      </tr> \
      </tbody> \
      </table> \
      </td> \
      </tr> \
      </tbody> \
      </table> \
      </td> \
      </tr> \
      </tbody> \
      </table> \
      </body> \
      </html>'
      }
    ).then(response => {
      console.log(response)
    }).catch( error =>{
      console.log(error);
    })
}


  public sendInvitationToMultipleEmails(users:Array<any>){
    users.forEach(invitee =>{
      this.sendInvitation(invitee.email, invitee.name);
    })
  }




}
