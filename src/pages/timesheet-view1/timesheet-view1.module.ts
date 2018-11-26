import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TimesheetView1Page } from './timesheet-view1';

@NgModule({
  declarations: [
    TimesheetView1Page,
  ],
  imports: [
    IonicPageModule.forChild(TimesheetView1Page),
  ],
})
export class TimesheetView1PageModule {}
