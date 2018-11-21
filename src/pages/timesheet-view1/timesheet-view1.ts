import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AxserviceProvider } from '../../providers/axservice/axservice';
import { ParameterserviceProvider } from '../../providers/parameterservice/parameterservice';


@IonicPage()
@Component({
  selector: 'page-timesheet-view1',
  templateUrl: 'timesheet-view1.html',
})
export class TimesheetView1Page {

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private axservice: AxserviceProvider, private parameterservice: ParameterserviceProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TimesheetView1Page');
    this.getWorkerCurrentTimesheet();
  }

  getWorkerCurrentTimesheet() {
    this.axservice.getWorkerCurrentTimesheet(this.parameterservice.user).subscribe(res => {
      
    }, (error) => {
      console.log('Error - get worker ts period details: '+ error);
    })
  }

}
