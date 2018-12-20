import { TimesheetView2Page } from './../timesheet-view2/timesheet-view2';
import { timesheetLineList } from './../../models/timesheet/tsLineListContact.interface';
import { TimesheetView1Page } from './../timesheet-view1/timesheet-view1';
import { timesheetTableContact } from '../../models/timesheet/tsTableContract.interface';
import { Component, Input, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ViewController } from 'ionic-angular';
import { CalendarComponent } from 'ng-fullcalendar';
import { Options } from 'fullcalendar';
import * as moment from 'moment'
import { timesheetLineDateList } from '../../models/timesheet/tsLineDateListContact.interface';

@IonicPage()
@Component({
  selector: 'page-timesheet-day',
  templateUrl: 'timesheet-day.html',
})
export class TimesheetDayPage {

  //@Input('tsTable') tsTableData;
  calendarOptions: Options;
  @ViewChild(CalendarComponent) ucCalendar: CalendarComponent;

  periodFrom: Date;
  periodTo: Date;
  eventData: any[];
  isEditable: boolean;
  dates:any[];

  tsLineDateList: timesheetLineDateList[];
  tsLineList: timesheetLineList;
  tsTable = {} as timesheetTableContact;


  constructor(public navCtrl: NavController, public navParams: NavParams, 
    public modalCtrl: ModalController, public viewCtrl: ViewController) {

    this.getParamData();
    this.dates=[];
    this.getBetweenDate();
  }
 
  editProjectDetails(lineList:any){
    let profileModal = this.modalCtrl.create(TimesheetView2Page,
      {
        lineList:lineList,
        periodFrom:this.periodFrom,
        periodTo:this.periodTo,
        isEditable:this.isEditable,
        tsTable:this.tsTable
      });
      profileModal.onDidDismiss(data => {
        
        if(data!=null){
          this.tsTable=data;
          this.tsLineList=data.TimesheetLineList;
        }
      });
    profileModal.present();
   
  }
  getBetweenDate(){
    var start = new Date(this.periodFrom);
    var end = new Date(this.periodTo);
    var loop = new Date(start);
    while (loop <= end) {
      this.dates.push({day:loop});
      var newDate = loop.setDate(loop.getDate() + 1);
      loop = new Date(newDate);
    }
  }
  ionViewDidLoad() {
  }
  ngOnInit() {

  }
  getParamData() {
    this.tsTable=this.navParams.get("tsTableContact");
    this.tsLineList = this.navParams.get("tsTableLine");
    this.periodFrom = this.navParams.get("startDate");
    this.periodTo = this.navParams.get("endDate");
    this.isEditable = this.navParams.get("isEditable");
    
  }
  
  goBack() {
    this.viewCtrl.dismiss();
  }
  submitTs(){
    console.log(this.tsTable)
  }
}
