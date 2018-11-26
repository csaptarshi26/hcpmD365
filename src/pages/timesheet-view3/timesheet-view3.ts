import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ModalController, ViewController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-timesheet-view3',
  templateUrl: 'timesheet-view3.html',
})
export class TimesheetView3Page {
  constructor(public navCtrl: NavController, public navParams: NavParams,public viewCtrl: ViewController) {
  }
  dismiss() {
    this.viewCtrl.dismiss();
  }
  ionViewDidLoad() {

  }
}
