import { ParameterserviceProvider } from './../../providers/parameterservice/parameterservice';
import { AxserviceProvider } from './../../providers/axservice/axservice';
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController, Slides } from 'ionic-angular';
import { SalaryContract } from '../../models/worker/workerSalary.interface';
import * as moment from 'moment';
import { File } from '@ionic-native/file';
import { Platform } from 'ionic-angular';
import { FileOpener } from '@ionic-native/file-opener';

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
  SalaryContract: SalaryContract = {} as SalaryContract;
  totalAmount: any = 0;
  currency: string;
  joiningDate: Date;
  isPayroll: boolean = false;
  todayDate: any;
  payslip: any = "";

  periodList: any = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController,
    private axservice: AxserviceProvider, private parameterservice: ParameterserviceProvider,
    private toastCtrl: ToastController, private file: File,
    private opener: FileOpener,
    public platform: Platform) {

    this.joiningDate = this.parameterservice.joiningDate;

    this.periodList = this.getMonths(this.joiningDate, new Date());
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
    this.axservice.getEmplSalaryRegister(this.parameterservice.user, month).subscribe(
      res => {
        loading.dismiss();
        this.SalaryContract = res;
        console.log(this.SalaryContract);
        var arr = res.PayrollList;
        if (arr.length != 0) {
          this.isPayroll = true;
          this.getPayslipPdf(month);
        } else {
          this.isPayroll = false;
        }
        this.getTotalAmount()
      }, error => {
        loading.dismiss();
        this.errorToast("Error while connecting to server");
      }
    )
  }
  downloadPayslip() {

    this.saveAndOpenPdf(this.payslip, "statement.pdf")
  }
  saveAndOpenPdf(pdf: string, filename: string) {
    //const writeDirectory = this.platform.is('ios') ? this.file.dataDirectory : this.file.externalDataDirectory;
    const writeDirectory = this.file.dataDirectory;
    this.file.writeFile(writeDirectory, filename, this.convertBaseb64ToBlob(pdf, 'application/pdf'), { replace: true })
      .then(() => {
        //this.loading.dismiss();
        this.opener.open(writeDirectory + filename, 'application/pdf')
          .catch(() => {
            console.log('Error opening pdf file');
            //this.loading.dismiss();
          });
      })
      .catch(() => {
        console.error('Error writing pdf file');
        //this.loading.dismiss();
      });
  }
  convertBaseb64ToBlob(b64Data, contentType): Blob {
    contentType = contentType || '';
    const sliceSize = 512;
    b64Data = b64Data.replace(/^[^,]+,/, '');
    b64Data = b64Data.replace(/\s/g, '');
    const byteCharacters = window.atob(b64Data);
    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    return new Blob(byteArrays, { type: contentType });
  }
  getPayslipPdf(month) {
    this.axservice.getPayslip(this.parameterservice.user, month).subscribe(res => {
      console.log(res);
      this.payslip = res;
    })
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
      duration: 2000,
      showCloseButton: true,
      closeButtonText: "Ok"
    });
    toast.present();
  }

  getMonths(from, to) {
    var startDate = moment(from);
    var endDate = moment(to);

    var result = [];

    var currentDate = startDate.clone();

    while (currentDate.isBefore(endDate)) {
      result.push({ month: endDate.format("YYYY-MM-01") });
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
  dateValue(date) {
    this.getSalaryDetails(moment(date).format("YYYY-MM-01"));
    console.log(moment(date).format("YYYY-MM-01"));
  }
  today() {
    this.todayDate = moment().format('YYYY-MM')
  }


}
