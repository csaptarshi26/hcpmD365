import { PayslipPage } from './../payslip/payslip';
import { LeaveBalanceContract } from './../../models/leave/leaveBalanceContract.interface';
import { SalaryContract } from './../../models/worker/workerSalary.interface';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
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
  leaveBalance: LeaveBalanceContract;

  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController,
    private axservice: AxserviceProvider, private parameterservice: ParameterserviceProvider,
    private toastCtrl: ToastController) {

    this.toggleDetails =
      {
        job: { value: false, icon: 'arrow-dropdown' },
        address: { value: false, icon: 'arrow-dropdown' },
        personal: { value: false, icon: 'arrow-dropdown' },
        document: { value: false, icon: 'arrow-dropdown' },
        leave:  {value:false,icon:'arrow-dropdown'}
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
    this.getLeaveBalanceDetails();
  }

  getLeaveBalanceDetails(){
    this.axservice.getEmplLeaveBalance(this.parameterservice.user).subscribe(
      res => {
        this.leaveBalance = res;
      }, error => {
        console.log(error);
      });
  }
  getWorkerDetails() {
    let loading = this.loadingCtrl.create({
      spinner: 'circles',
      content: 'Please wait...'
    });
    loading.present();
    this.axservice.getWorkerDetails(this.parameterservice.user).subscribe(res => {
      loading.dismiss();
      this.worker = Object(Array(res));
      console.log(this.worker);
    }, (error) => {
      loading.dismiss();
      this.errorToast("Error while connecting to server");
    })
  }
 
  showPayslip(){
    this.navCtrl.push('PayslipPage');
  }

  errorToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      position: 'top',
      showCloseButton: true,
      closeButtonText: "Ok"
    });
    toast.present();
  }

}
