import { ParameterserviceProvider } from './../../providers/parameterservice/parameterservice';
import { AxserviceProvider } from './../../providers/axservice/axservice';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { SalaryContract } from '../../models/worker/workerSalary.interface';

/**
 * Generated class for the PayslipPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-payslip',
  templateUrl: 'payslip.html',
})
export class PayslipPage {

  worker: Worker;
  SalaryContract: SalaryContract;
  totalAmount:any=0;
  currency:string;

  constructor(public navCtrl: NavController, public navParams: NavParams,public loadingCtrl: LoadingController,
    private axservice: AxserviceProvider, private parameterservice: ParameterserviceProvider,
    private toastCtrl: ToastController) {
  }

  ionViewDidLoad() {
    this.getSalaryDetails();
  }
  getSalaryDetails() {
    let loading = this.loadingCtrl.create({
      spinner: 'circles',
      content: 'Please wait...'
    });
    loading.present();
    this.axservice.getEmplSalaryRegister(this.parameterservice.user, new Date('2018-09-01')).subscribe(
      res => {
        loading.dismiss();
        this.SalaryContract =Object(Array(res));
        console.log(this.SalaryContract);
        this.getTotalAmount()
      }, error => {
        loading.dismiss();
        this.errorToast("Error while connecting to server");
      }
    )
  }
  getTotalAmount(){
    Object.keys(this.SalaryContract).map(el=>{
      var arr=this.SalaryContract[el].PayrollList;
      arr.forEach(key => {
        this.totalAmount=this.totalAmount + key.Amount;
        this.currency=key.Currency
      });
    })
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
