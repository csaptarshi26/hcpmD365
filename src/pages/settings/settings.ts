import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { StorageserviceProvider } from '../../providers/storageservice/storageservice';

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

  public D365URL: string;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public storageservice: StorageserviceProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingsPage');
    this.D365URL = this.storageservice.D365URL;
  }

}
