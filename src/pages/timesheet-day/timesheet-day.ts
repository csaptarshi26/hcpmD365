import { timesheetTableContact } from '../../models/timesheet/tsTableContract.interface';
import { Component, Input } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { TimesheetView3Page } from '../timesheet-view3/timesheet-view3';

@IonicPage()
@Component({
  selector: 'page-timesheet-day',
  templateUrl: 'timesheet-day.html',
})
export class TimesheetDayPage {
  
  @Input('tsDetails') tsDetails;

  activity:any;
  category:any;
  project:any;

  constructor(public navCtrl: NavController, public navParams: NavParams,public modalCtrl: ModalController) {
    
    console.log(this.tsDetails)

  }

  ionViewDidLoad() {
    
  }

  presentProfileModal() {
    let profileModal = this.modalCtrl.create(TimesheetView3Page);
    profileModal.present();
  }
}
