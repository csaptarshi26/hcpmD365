import { SalaryContract } from './../../models/worker/workerSalary.interface';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AxserviceProvider } from '../../providers/axservice/axservice';
import { ParameterserviceProvider } from '../../providers/parameterservice/parameterservice';
import { Worker } from '../../models/worker/worker.interface';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  worker: Worker;
  SalaryContract: SalaryContract;
  toggleDetails: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private axservice: AxserviceProvider, private parameterservice: ParameterserviceProvider) {

    this.toggleDetails =
      {
        job: { value: false, icon: 'arrow-dropdown' },
        address: { value: false, icon: 'arrow-dropdown' },
        personal: { value: false, icon: 'arrow-dropdown' },
        document: { value: false, icon: 'arrow-dropdown' }
      }
  }
  toggleCard(data) {
    if (data.value) {
      data.value = false;
      data.icon = 'arrow-dropdown';
    } else {
      data.value = true;
      data.icon = 'arrow-dropup';
    }
  }
  ionViewDidLoad() {
    this.getWorkerDetails();
    this.getSalaryDetails()
  }

  getWorkerDetails() {
    this.axservice.getWorkerDetails(this.parameterservice.user).subscribe(res => {
      this.worker = Object(Array(res));
      console.log(this.worker);
    }, (error) => {
      console.log(error);
    })
  }
  getSalaryDetails() {
    this.axservice.getEmplSalaryRegister(this.parameterservice.user, new Date()).subscribe(
      res => {
        this.SalaryContract = res;
        console.log(res);
      }, error => {
        console.log(error);
      }
    )
  }

}
