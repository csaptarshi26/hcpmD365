import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TimesheetDayPage } from './timesheet-day';

@NgModule({
  declarations: [
    TimesheetDayPage,
  ],
  imports: [
    IonicPageModule.forChild(TimesheetDayPage),
  ],
})
export class TimesheetDayPageModule {}
