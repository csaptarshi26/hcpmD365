import { PipesModule } from './../../pipes/pipes.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LeaveView2Page } from './leave-view2';

@NgModule({
  declarations: [
    LeaveView2Page,
  ],
  imports: [
    IonicPageModule.forChild(LeaveView2Page),
    PipesModule
  ],
})
export class LeaveView2PageModule {}
