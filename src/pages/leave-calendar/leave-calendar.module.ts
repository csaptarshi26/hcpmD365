import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LeaveCalendarPage } from './leave-calendar';

@NgModule({
  declarations: [
    LeaveCalendarPage,
  ],
  imports: [
    IonicPageModule.forChild(LeaveCalendarPage),
  ],
})
export class LeaveCalendarPageModule {}
