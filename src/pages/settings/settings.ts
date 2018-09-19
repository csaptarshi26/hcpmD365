import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { StorageserviceProvider } from '../../providers/storageservice/storageservice';
import { ParameterserviceProvider } from '../../providers/parameterservice/parameterservice';

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

  public D365URL: string;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private storageservice: StorageserviceProvider, private parameterservice: ParameterserviceProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingsPage');
    this.D365URL = this.parameterservice.D365URL;
  }

  ionViewWillLeave() {
    this.storageservice.setD365URL(this.D365URL);
  }

}
