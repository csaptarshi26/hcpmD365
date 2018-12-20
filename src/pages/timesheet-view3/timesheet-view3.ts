import { timesheetLineDateList } from './../../models/timesheet/tsLineDateListContact.interface';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ModalController, ViewController } from 'ionic-angular';
import { timesheetLineList } from '../../models/timesheet/tsLineListContact.interface';

@IonicPage()
@Component({
  selector: 'page-timesheet-view3',
  templateUrl: 'timesheet-view3.html',
})
export class TimesheetView3Page {
  tsLineDate:timesheetLineDateList[];
  tsLineList:timesheetLineList;
  date:any;
  isEditable:boolean;
  constructor(public navCtrl: NavController, public navParams: NavParams,public viewCtrl: ViewController) {
    this.getParameterData();
  }
  getParameterData(){
    var list;
    list=this.navParams.get("DateLineList");
    this.isEditable=this.navParams.get("isEditable");
    this.tsLineList=this.navParams.get("lineList");
    this.tsLineDate=Array(list);
  }
  dismiss() {
    this.viewCtrl.dismiss();
  }
  ionViewDidLoad() {

  }
  save(savedData:any){
    this.viewCtrl.dismiss(this.tsLineList);
  }
}
