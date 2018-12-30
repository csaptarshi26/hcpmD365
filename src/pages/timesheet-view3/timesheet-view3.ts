import { timesheetLineDateList } from './../../models/timesheet/tsLineDateListContact.interface';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { ModalController, ViewController } from 'ionic-angular';
import { timesheetLineList } from '../../models/timesheet/tsLineListContact.interface';

@IonicPage()
@Component({
  selector: 'page-timesheet-view3',
  templateUrl: 'timesheet-view3.html',
})
export class TimesheetView3Page {
  invalidHrs: boolean;
  tsLineDate: timesheetLineDateList[];
  tsLineList: timesheetLineList;
  date: any;
  isEditable: boolean;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public viewCtrl: ViewController, private toastCtrl: ToastController) {
    this.getParameterData();
  }
  getParameterData() {
    var list;
    list = this.navParams.get("DateLineList");
    this.isEditable = this.navParams.get("isEditable");
    this.tsLineList = this.navParams.get("lineList");
    this.tsLineDate = Array(list);
  }
  dismiss() {
    var commentFlag = false;
    if (this.isEditable) {
      Object.keys(this.tsLineDate).map(e => {
        if (this.tsLineDate[e].Hours > 24 || this.tsLineDate[e].Hours < 0) {
          this.presentToast("Hours should be within 0 to 24 ");
        } else {
          if (this.tsLineDate[e].Hours != 0 && !(this.invalidHrs)) {
            if (this.tsLineDate[e].ExternalComments == "") {
              commentFlag = true;
              this.presentToast("External Comment cannot be left blank");
            }
          }
        }
      })
    }
    if (!commentFlag && !this.invalidHrs) {
      this.viewCtrl.dismiss(this.tsLineList);
    }
  }
  validateHrs(hrsValue: any) {
    if (hrsValue > 24 || hrsValue < 0) {
      this.invalidHrs = true;
      this.presentToast("Hours should be within 0 to 24 ")
    } else {
      this.invalidHrs = false;
    }
  }
  ionViewDidLoad() {

  }
  presentToast(msg: any) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'top',
      showCloseButton: true,
      closeButtonText: "ok"
    });
    toast.present();
  }
}
