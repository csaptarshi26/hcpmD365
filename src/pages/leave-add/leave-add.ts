import { LeaveAppTableContract } from './../../models/leave/leaveAppTableContact.interface';
import { LeaveBalanceContract } from './../../models/leave/leaveBalanceContract.interface';
import { AxserviceProvider } from './../../providers/axservice/axservice';
import { ParameterserviceProvider } from './../../providers/parameterservice/parameterservice';
import { LeaveAppLineContract } from './../../models/leave/leaveAppLineContract.interface';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController, AlertController, ModalController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-leave-add',
  templateUrl: 'leave-add.html',
})
export class LeaveAddPage {

  leaveLine: LeaveAppLineContract = {} as LeaveAppLineContract;
  leaveBalance: LeaveBalanceContract;
  leaveContract: LeaveAppTableContract;
  newLeave: LeaveAppTableContract = {} as LeaveAppTableContract;
  balance: any = null;
  isEditable: boolean;


  constructor(public navCtrl: NavController, public navParams: NavParams, private axservice: AxserviceProvider,
    private parameterservice: ParameterserviceProvider, public loadingCtrl: LoadingController,
    private toastCtrl: ToastController, public alertCtrl: AlertController, public modalCtrl: ModalController) {

    this.isEditable = navParams.get("isEditable");
    this.leaveContract = navParams.get("leaveContract");
  }

  ionViewDidLoad() {
    this.getLeaveBalance();
  }
  goBack() {
    this.navCtrl.pop();
  }
  selectedLeaveCode(code) {
    Object.keys(this.leaveBalance).map(el => {
      if (this.leaveBalance[el].Code == code) {
        this.balance = this.leaveBalance[el].Balance;
      }
    })
  }
  getLeaveBalance() {
    this.axservice.getEmplLeaveBalance(this.parameterservice.user).subscribe(
      res => {
        this.leaveBalance = res;
      }, error => {
        console.log(error);
      });
  }
  createNewLeave() {
    var len = Object.keys(this.leaveContract).length;

    this.newLeave.ApplicationLine = Object(Array(this.leaveLine));
    this.newLeave.EmpId = this.parameterservice.user;
    this.newLeave.PeriodFrom = this.leaveLine.ValidFrom;
    this.newLeave.PeriodTo = this.leaveLine.ValidTo;

    this.createLeaveServiceCall(len);
  }

  createLeaveServiceCall(len) {
    this.axservice.updateEmplLeaveAppl(this.newLeave).subscribe(
      res => {
        if(res.Error){
          this.errorToast(res.Remarks)
        }else{
          this.leaveContract[len] = res;
          this.presentToast("Leave Created");
        }
      }, error => {
        this.errorToast("Connection Error");
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
  validator(){
    if(typeof this.leaveLine.AbsenceCode === "undefined"){
      this.errorToast("Absence Code Cann't be blank");
    }else if(typeof this.leaveLine.ValidFrom === "undefined"){
      this.errorToast("Start Date Cann't be blank");
    }else if(typeof this.leaveLine.ValidTo === "undefined"){
      this.errorToast("End Date Cann't be blank");
    }else if((this.leaveLine.ValidFrom == this.leaveLine.ValidTo) &&
     (typeof this.leaveLine.hours === "undefined")){
      this.errorToast("Hours Cann't be blank");
    }else{
      return true;
    }
    return false;
  }
  showConfirm() {
    if(this.validator()){
      const confirm = this.alertCtrl.create({
        title: 'Add',
        message: 'Are you sure you want to Apply Leave for the given date?',
        buttons: [
          {
            text: 'Disagree',
            handler: () => {
            }
          },
          {
            text: 'Agree',
            handler: () => this.createNewLeave()
          }
        ]
      });
      confirm.present();
    }
  }

  presentToast(msg: any) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 2000,
      position: 'top',
      showCloseButton: true,
      closeButtonText: "ok"
    });
    toast.onDidDismiss(() => {
      this.navCtrl.getPrevious().data.leaveContact=this.leaveContract;
      this.navCtrl.pop();
    });
    toast.present();
  }

}
