import { ParameterserviceProvider } from './../../providers/parameterservice/parameterservice';
import { AxserviceProvider } from './../../providers/axservice/axservice';
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController, Slides } from 'ionic-angular';
import { SalaryContract } from '../../models/worker/workerSalary.interface';
import * as moment from 'moment';
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
  @ViewChild(Slides) slides: Slides;
  
  worker: Worker;
  SalaryContract: SalaryContract ={} as SalaryContract;
  totalAmount: any = 0;
  currency: string;
  joiningDate: Date;
  isPayroll:boolean=false;
  todayDate:any;

  periodList: any = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController,
    private axservice: AxserviceProvider, private parameterservice: ParameterserviceProvider,
    private toastCtrl: ToastController) {

    this.joiningDate = this.parameterservice.joiningDate;

    this.periodList=this.getMonths(this.joiningDate,new Date());
  }

  ionViewDidLoad() {
    this.today();
    this.getSalaryDetails(new Date());
  }
  getSalaryDetails(month) {
    let loading = this.loadingCtrl.create({
      spinner: 'circles',
      content: 'Please wait...'
    });
    loading.present();
    this.axservice.getEmplSalaryRegister(this.parameterservice.user, month ).subscribe(
      res => {
        loading.dismiss();
        this.SalaryContract = res;
        console.log(this.SalaryContract);
        var arr=res.PayrollList;
        if(arr.length !=0 ){
          this.isPayroll=true;
        }else{
          this.isPayroll=false;
        }
        this.getTotalAmount()
      }, error => {
        loading.dismiss();
        this.errorToast("Error while connecting to server");
      }
    )
  }
  getTotalAmount() {
      var arr = this.SalaryContract.PayrollList;
      arr.forEach(key => {
        this.totalAmount = this.totalAmount + key.Amount;
        this.currency = key.Currency
      });
  }
  errorToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      position: 'top',
      duration:2000,
      showCloseButton: true,
      closeButtonText: "Ok"
    });
    toast.present();
  }

  getMonths(from,to) {
    var startDate = moment(from);
    var endDate = moment(to);
    
    var result = [];
    
    var currentDate = startDate.clone();
    
    while (currentDate.isBefore(endDate)) {
        result.push({month:endDate.format("YYYY-MM-01")});
        endDate.add(-1, 'month');
    }
    return result;
  }

  slideChanged() {
    let currentIndex = this.slides.getActiveIndex();
    this.getSalaryDetails(this.periodList[currentIndex].month);
  }
  nextSlide() {
    this.slides.slideNext();
  }
  prevSlide() {
    this.slides.slidePrev();
  }
  dateValue(date){
    this.getSalaryDetails(moment(date).format("YYYY-MM-01"));
    console.log(moment(date).format("YYYY-MM-01"));
  }
  today(){
    this.todayDate=moment().format('YYYY-MM')
  }
}
