import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AxserviceProvider } from '../../providers/axservice/axservice';
import { ParameterserviceProvider } from '../../providers/parameterservice/parameterservice';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  worker: Worker;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    private axservice: AxserviceProvider, private parameterservice: ParameterserviceProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
    this.getWorkerDetails();
  }

  getWorkerDetails() {
    this.axservice.getWorkerDetails(this.parameterservice.user).subscribe(res => {
      this.worker = res;
    })
  }

}
