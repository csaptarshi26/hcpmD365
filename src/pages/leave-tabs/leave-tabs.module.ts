import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LeaveTabsPage } from './leave-tabs';

@NgModule({
  declarations: [
    LeaveTabsPage,
  ],
  imports: [
    IonicPageModule.forChild(LeaveTabsPage),
  ],
})
export class LeaveTabsPageModule {}
