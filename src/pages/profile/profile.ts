import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AxserviceProvider } from '../../providers/axservice/axservice';
import { ParameterserviceProvider } from '../../providers/parameterservice/parameterservice';
import { worker } from '../../models/worker/worker.interface';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  worker: worker;
  name: string;
  personnelNumber: string;
  phone: string;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private axservice: AxserviceProvider, private parameterservice: ParameterserviceProvider) {
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
    this.getWorkerDetails();
    this.getSalaryDetails()
  }

  getWorkerDetails() {
    this.axservice.getWorkerDetails(this.parameterservice.user).subscribe(res => {
      this.worker = res;
      this.name = this.worker.Name;
      this.personnelNumber = this.worker.personnelNumber;
      this.phone = this.worker.Phone;
      console.log(res);
    }, (error) => {
      console.log('get worker details: '+ error);
    })
  }
  getSalaryDetails(){
    this.axservice.getEmplSalaryRegister(this.parameterservice.user,new Date()).subscribe(
      res =>{
        console.log(res);
      },error =>{
        console.log(error);
      }
    )
  }

}
