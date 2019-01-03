import { LeaveAppLineContract } from './../../models/leave/leaveAppLineContract.interface';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-leave-add',
  templateUrl: 'leave-add.html',
})
export class LeaveAddPage {

  leaveLine:LeaveAppLineContract = {} as LeaveAppLineContract;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    
  }
  goBack() {
    this.navCtrl.pop();
  }

}
