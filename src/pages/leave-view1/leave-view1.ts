import { LeaveAddPage } from './../leave-add/leave-add';
import { LeaveAppLineContract } from './../../models/leave/leaveAppLineContract.interface';
import { LeaveAppTableContract } from './../../models/leave/leaveAppTableContact.interface';
import { AxserviceProvider } from './../../providers/axservice/axservice';
import { ParameterserviceProvider } from './../../providers/parameterservice/parameterservice';
import { LeaveView2Page } from './../leave-view2/leave-view2';
import { TimesheetView1Page } from './../timesheet-view1/timesheet-view1';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController, AlertController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-leave-view1',
  templateUrl: 'leave-view1.html',
})
export class LeaveView1Page {

  pageRefreshed:boolean=false;
  leaveApp: LeaveAppTableContract;
  status: String = "all";


  constructor(public navCtrl: NavController, public navParams: NavParams, private axservice: AxserviceProvider,
    private parameterservice: ParameterserviceProvider,public loadingCtrl: LoadingController,
    private toastCtrl: ToastController, public alertCtrl: AlertController) {
  }
  public ionViewWillEnter() {
    var data=this.navParams.get('leaveContact') || null;
    if(data !=null) this.leaveApp = data
  }
  ionViewDidLoad() {
    this.getLeaveApplication();
  }
  getLeaveApplication() {
    let loading = this.loadingCtrl.create({
      spinner: 'circles',
      content: 'Please wait...',
      duration : 2000
    });
    if (!this.pageRefreshed) {
      loading.present();
    }
    this.axservice.getWorkerLeaveAppl(this.parameterservice.user).subscribe(
      res => {
        loading.dismiss();
        this.leaveApp = res;
        console.log(res);
      },
      error => {
        loading.dismiss();
        console.log(error);
      }
    )
  }

  submitLeave(leaveContact) {

  }

  deleteLeaveHeader(leaveContact:LeaveAppTableContract){
    //leaveContact.IsDeleted=true;
    this.showConfirm("Delete","Do you want to delete this Leave?",leaveContact);
  }
  deleteLeaveLine(LeaveLine:LeaveAppLineContract) {

    //LeaveLine.IsDeleted=true;
    console.log(LeaveLine);
    this.showConfirm("Delete","Do you want to delete this Leave Line?",LeaveLine);
  }
  newLeave() {
    this.navCtrl.push('LeaveAddPage');
  }

  editPage(details: LeaveAppTableContract) {
    this.navCtrl.push('LeaveView2Page', {
      leaveDetails: details,
      isEditable: details.IsEditable
    })
  }
  doRefresh(refresher) {
    setTimeout(() => {
      this.pageRefreshed=true;
      this.getLeaveApplication();
      refresher.complete();
    }, 2000);
  }

  showConfirm(title,msg,data) {
    const confirm = this.alertCtrl.create({
      title: title,
      message: msg,
      buttons: [
        {
          text: 'Disagree',
          handler: () => {
          }
        },
        {
          text: 'Agree',
          handler: () => {
           data.IsDeleted=true;
           console.log(this.leaveApp);
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
  }
}
