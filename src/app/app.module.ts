import { BrowserModule } from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {AppComponent} from './app.component';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {AngularFireModule} from 'angularfire2';
import {AngularFireDatabaseModule} from 'angularfire2/database';
import {AngularFireAuthModule} from 'angularfire2/auth';
import { LoginComponent } from './components/login/login.component';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { ErrorComponent } from './components/error/error.component';
import { LayoutComponent } from './components/layout/layout.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import {AuthService} from './services/auth.service';
import {DateService} from './services/date.service';
import { EditComponent } from './components/meetings/edit/edit.component';
import { ViewComponent } from './components/meetings/view/view.component';
import {ScheduleComponent} from './components/schedules/view/schedule.component'
import {firebaseConfig} from '../environments/environment.prod';
import {CanActivateViaAuthGuardGuard} from "./guards/can-activate-via-auth-guard.guard";
import { CustomFormsModule } from 'ng2-validation'
import { Ng2CompleterModule } from "ng2-completer";
import { CalendarModule } from 'angular-calendar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SelectModule } from 'ng2-select-compat';
import { ManagerComponent } from './components/manager/manager.component';
import {ManagerGuard} from "./guards/manager.guard";
import { AdminComponentComponent } from './components/admin-component/admin-component.component';
import {AdminGuard} from "./guards/admin.guard";
import { AdminConsoleComponent } from './components/admin-console/admin-console.component';
import {UserGuard} from "./guards/user.guard";




const appRoutes: Routes = [

  {
    path: 'u', component:LayoutComponent,
    canActivateChild: [CanActivateViaAuthGuardGuard, UserGuard],
    children: [

      {path: '', redirectTo: 'calendar', pathMatch:'full'},

      {path: 'calendar', component: CalendarComponent},
      {path: 'meetings/:id/edit', component: EditComponent},
      {path: 'meetings/:id', component: ViewComponent},
      {path: 'schedule', component: ScheduleComponent},
      {path: '**', redirectTo: '404'},
      {path: '404', component: PageNotFoundComponent},

    ]
  },

  {path: 'm', component:ManagerComponent,
  canActivateChild: [CanActivateViaAuthGuardGuard, ManagerGuard],
  children: [

  {path: '', redirectTo: 'calendar', pathMatch:'full'},

  {path: 'calendar', component: CalendarComponent},
  {path: 'meetings/:id/edit', component: EditComponent},
  {path: 'meetings/:id', component: ViewComponent},
  {path: 'schedule', component: ScheduleComponent},
  {path: '404', component: PageNotFoundComponent},
  {path: '**', redirectTo: '404'}
]
},

  {path: 'a', component:AdminComponentComponent,
    canActivateChild: [CanActivateViaAuthGuardGuard, AdminGuard],
    children: [

      {path: '', redirectTo: 'calendar', pathMatch:'full'},
      {path: 'calendar', component: CalendarComponent},
      {path: 'console', component: AdminConsoleComponent},
      {path: 'meetings/:id/edit', component: EditComponent},
      {path: 'meetings/:id', component: ViewComponent},
      {path: 'schedule', component: ScheduleComponent},
      {path: '**', redirectTo: '404'},
      {path: '404', component: PageNotFoundComponent},
    ]
  },


  {path: 'login', component: LoginComponent},

  {path: 'error', component: ErrorComponent},
  ];



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    PageNotFoundComponent,
    ErrorComponent,
    LayoutComponent,
    CalendarComponent,
    EditComponent,
    ViewComponent,
    ManagerComponent,
    ScheduleComponent,
    AdminComponentComponent,
    AdminConsoleComponent,
  ],
  imports: [
    NgbModule.forRoot(),
    RouterModule.forRoot(appRoutes),
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    CustomFormsModule,
    HttpModule,
    SelectModule,
    Ng2CompleterModule,
    CalendarModule.forRoot(),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule
  ],
  providers: [AuthService, CanActivateViaAuthGuardGuard, ManagerGuard, AdminGuard, DateService, UserGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
