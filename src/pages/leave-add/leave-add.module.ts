import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LeaveAddPage } from './leave-add';

@NgModule({
  declarations: [
    LeaveAddPage,
  ],
  imports: [
    IonicPageModule.forChild(LeaveAddPage),
  ],
})
export class LeaveAddPageModule {}
