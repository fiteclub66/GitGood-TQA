import { BrowserModule } from '@angular/platform-browser';
import {NgModule, Pipe, PipeTransform} from '@angular/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {AppComponent} from './app.component';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {AngularFireModule} from 'angularfire2';
import {AngularFireDatabaseModule} from 'angularfire2/database';
import {AngularFireAuthModule} from 'angularfire2/auth';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginComponent } from './components/login/login.component';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { ErrorComponent } from './components/error/error.component';
import { LayoutComponent } from './components/layout/layout.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import {AuthService} from './services/auth.service';
import { EditComponent } from './components/meetings/edit/edit.component';
import { ViewComponent } from './components/meetings/view/view.component';
import {ScheduleComponent} from './components/schedules/view/schedule.component'
import {firebaseConfig} from '../environments/environment.prod';
import {CanActivateViaAuthGuardGuard} from "./guards/can-activate-via-auth-guard.guard";
import { CustomFormsModule } from 'ng2-validation'


const appRoutes: Routes = [
  {
    path: 'u/',component: LayoutComponent,
    canActivate: [CanActivateViaAuthGuardGuard],
    canActivateChild: [CanActivateViaAuthGuardGuard],
    children: [
      {path: 'u/calendar', component: CalendarComponent},
      {path: 'u/meetings/:id/edit', component: EditComponent},
      {path: 'u/meetings/:id', component: ViewComponent},
      {path: 'u/schedule', component: ScheduleComponent},
      {path: 'u/404', component: PageNotFoundComponent},
      {path: 'u/**', redirectTo: '/404'}
    ]
  },
  {path: '', redirectTo:'u/', pathMatch:'full'},

  {path: 'login', component: LoginComponent},

  {path: 'error', component: ErrorComponent},
  ];



@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    LoginComponent,
    PageNotFoundComponent,
    ErrorComponent,
    LayoutComponent,
    CalendarComponent,
    EditComponent,
    ViewComponent,
    ScheduleComponent
  ],
  imports: [
    NgbModule.forRoot(),
    RouterModule.forRoot(appRoutes),
    BrowserModule,
    FormsModule,
    CustomFormsModule,
    HttpModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule
  ],
  providers: [AuthService, CanActivateViaAuthGuardGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
