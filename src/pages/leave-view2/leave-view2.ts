import { AxserviceProvider } from './../../providers/axservice/axservice';
import { ParameterserviceProvider } from './../../providers/parameterservice/parameterservice';
import { LeaveAppTableContract } from './../../models/leave/leaveAppTableContact.interface';
import { Component, Pipe, NgModule, PipeTransform } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController, AlertController } from 'ionic-angular';
import { DateDiffPipe } from '../../pipes/date-diff/date-diff';
import * as moment from 'moment';

@IonicPage()
@Component({

  selector: 'page-leave-view2',
  templateUrl: 'leave-view2.html',
})
export class LeaveView2Page {

  leaveContact: LeaveAppTableContract[];
  isEditable: boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams, private axservice: AxserviceProvider,
    private parameterservice: ParameterserviceProvider, private toastCtrl: ToastController, 
    public loadingCtrl: LoadingController, public alertCtrl: AlertController) {
    this.getParams();
  }

  getParams() {
    this.leaveContact = Array(this.navParams.get("leaveDetails"));
    this.isEditable = this.navParams.get("isEditable");
  }
  ionViewDidLoad() {


  }
  goBack() {
    this.navCtrl.pop();
  }

  SaveLeave() {
    Object.keys(this.leaveContact).map(el => {
      var arr = this.leaveContact[el].ApplicationLine;
      arr.forEach(element => {
        element.LeaveDays = this.getDiffDays(element.ValidFrom, element.ValidTo);
      });
    });
    let loading = this.loadingCtrl.create({
      spinner: 'circles',
      content: 'Please wait...'
    });
    loading.present();
    this.axservice.updateEmplLeaveAppl(this.leaveContact[0]).subscribe(
      res => {
        loading.dismiss();
        this.leaveContact[0] = res;
        console.log(this.leaveContact);
        this.presentToast("Leave Updated successfully")
      },
      error => {
        loading.dismiss();
        this.presentToast("Connection Error");
      });
  }

  showConfirm() {
    const confirm = this.alertCtrl.create({
      title: 'Update',
      message: 'Do you want to update Leave?',
      buttons: [
        {
          text: 'Disagree',
          handler: () => {
          }
        },
        {
          text: 'Agree',
          handler: () => {
           this.SaveLeave();
          }
        }
      ]
    });
    confirm.present();
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
      this.navCtrl.getPrevious().data.leaveContact=this.leaveContact;
      this.navCtrl.pop();
    });
    toast.present();
  }

  getDiffDays(startDate, endDate) {
    startDate = moment(startDate);
    endDate = moment(endDate);
    var daysDiff = endDate.diff(startDate, 'days');
    return daysDiff + 1;
  }
}