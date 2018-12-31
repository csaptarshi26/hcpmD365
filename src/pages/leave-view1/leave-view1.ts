import { LeaveApp } from './../../models/Leave/LeaveAppContact.interface';
import { AxserviceProvider } from './../../providers/axservice/axservice';
import { ParameterserviceProvider } from './../../providers/parameterservice/parameterservice';
import { LeaveView2Page } from './../leave-view2/leave-view2';
import { TimesheetView1Page } from './../timesheet-view1/timesheet-view1';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the LeaveView1Page page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-leave-view1',
  templateUrl: 'leave-view1.html',
})
export class LeaveView1Page {
  
  leaveApp:LeaveApp;
  status: String = "all";
  constructor(public navCtrl: NavController, public navParams: NavParams,private axservice: AxserviceProvider,
    private parameterservice: ParameterserviceProvider) {
  }

  ionViewDidLoad() {
    this.getLeaveApplication();
  }

  getLeaveApplication(){
    this.axservice.getWorkerLeaveAppl(this.parameterservice.user).subscribe(
      res =>{
        this.leaveApp=res;
        console.log(res);
      },
      error =>{

      }
    )
  }
}
