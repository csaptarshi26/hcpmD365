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

  leaveTable:LeaveAppTableContract;
  leaveContact: LeaveAppTableContract[];
  isEditable: boolean;
  editPageIndex:any=null;

  constructor(public navCtrl: NavController, public navParams: NavParams, private axservice: AxserviceProvider,
    private parameterservice: ParameterserviceProvider, private toastCtrl: ToastController, 
    public loadingCtrl: LoadingController, public alertCtrl: AlertController) {
    this.getParams();
  }

  getParams() {
    this.leaveTable=this.navParams.get("leaveTable");
    this.leaveContact = Array(this.navParams.get("leaveDetails"));
    this.isEditable = this.navParams.get("isEditable");
    this.editPageIndex=this.navParams.get("editPageIndex");
  }
  ionViewDidLoad() {


  }
  goBack() {
    this.navCtrl.pop();
  }

  SaveLeave() {
    let loading = this.loadingCtrl.create({
      spinner: 'circles',
      content: 'Please wait...'
    });
    loading.present();
    this.axservice.updateEmplLeaveAppl(this.leaveContact[0]).subscribe(
      res => {
        loading.dismiss();
        if(res.Error){
          this.errorToast(res.Remarks)
        }else{
          this.leaveContact[0] = res;
          this.leaveTable[this.editPageIndex]=res;
          console.log(this.leaveContact);
          this.presentToast("Leave Created");
        }
      },
      error => {
        loading.dismiss();
        this.presentToast("Connection Error");
      });
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
      this.navCtrl.getPrevious().data.leaveContact=this.leaveTable;
      this.navCtrl.pop();
    });
    toast.present();
  }
}