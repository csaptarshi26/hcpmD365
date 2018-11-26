import { timesheetLineList } from '../../models/timesheet/tsLineListContact.interface';
import { timesheetTableContact } from '../../models/timesheet/tsTableContract.interface';
import { TimesheetView2Page } from './../timesheet-view2/timesheet-view2';
import { Component, ViewChild, ViewContainerRef, ComponentFactoryResolver, ComponentRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AxserviceProvider } from '../../providers/axservice/axservice';
import { ParameterserviceProvider } from '../../providers/parameterservice/parameterservice';
import * as _ from "lodash";
import { TimesheetDayPage } from '../timesheet-day/timesheet-day';

@IonicPage()
@Component({
  selector: 'page-timesheet-view1',
  templateUrl: 'timesheet-view1.html',
})

export class TimesheetView1Page {
  TimesheetTableContact: timesheetTableContact;
  TimesheetLineList: timesheetLineList;
  startDate:any;
  endDate:any;
  showDetails:boolean=false;

  @ViewChild('viewContainerRef', { read: ViewContainerRef }) VCR: ViewContainerRef;

  constructor(public navCtrl: NavController, public navParams: NavParams, private axservice: AxserviceProvider,
    private parameterservice: ParameterserviceProvider, private CFR: ComponentFactoryResolver) {
    
  }
  redirect() {
    this.navCtrl.push(TimesheetView2Page, {
      redirected: true
    })
  }
  send() {
    let componentFactory = this.CFR.resolveComponentFactory(TimesheetDayPage);
    let componentRef: ComponentRef<TimesheetDayPage> = this.VCR.createComponent(componentFactory);
    let currentComponent = componentRef.instance;
  }
  ionViewDidLoad() {
    this.getWorkerCurrentTimesheet();
  }
  getWorkerCurrentTimesheet() {
    this.axservice.getWorkerCurrentTimesheet(this.parameterservice.user).subscribe(res => {
      this.TimesheetTableContact=res;      
      this.showDetails=true;
      console.log(res.TimesheetLineList);
    }, (error) => {
      this.showDetails=false;
      console.log('Error - get worker ts period details: ' + error);
    })
  }

}
