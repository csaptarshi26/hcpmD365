import { LeaveView2Page } from './../leave-view2/leave-view2';
import { LeaveView1Page } from './../leave-view1/leave-view1';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the LeaveTabsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-leave-tabs',
  templateUrl: 'leave-tabs.html',
})
export class LeaveTabsPage {
  tab1Root = LeaveView1Page;
  tab2Root = LeaveView2Page;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LeaveTabsPage');
  }

}
