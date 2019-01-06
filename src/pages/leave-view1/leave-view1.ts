import { LeaveCalendarPage } from './../leave-calendar/leave-calendar';
import { LeaveAddPage } from './../leave-add/leave-add';
import { LeaveAppLineContract } from './../../models/leave/leaveAppLineContract.interface';
import { LeaveAppTableContract } from './../../models/leave/leaveAppTableContact.interface';
import { AxserviceProvider } from './../../providers/axservice/axservice';
import { ParameterserviceProvider } from './../../providers/parameterservice/parameterservice';
import { LeaveView2Page } from './../leave-view2/leave-view2';
import { TimesheetView1Page } from './../timesheet-view1/timesheet-view1';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController, AlertController, ModalController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-leave-view1',
  templateUrl: 'leave-view1.html',
})
export class LeaveView1Page {

  pageRefreshed:boolean=false;
  leaveApp: LeaveAppTableContract;
  status: String = "all";
  editPageIndex:any=null;


  constructor(public navCtrl: NavController, public navParams: NavParams, private axservice: AxserviceProvider,
    private parameterservice: ParameterserviceProvider,public loadingCtrl: LoadingController,
    private toastCtrl: ToastController, public alertCtrl: AlertController,public modalCtrl: ModalController) {
  }
  public ionViewWillEnter() {
    var data=this.navParams.get('leaveContact') || null;
    var dataFromCalendar=this.navParams.get("leaveApp") || null;
    if(dataFromCalendar != null) this.leaveApp =dataFromCalendar;
    if(data !=null && this.editPageIndex!=null) this.leaveApp = data
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
      },error => {
        loading.dismiss();
        console.log(error);
      }
    )
  }

  submitLeave(leaveContact,i) {
    let commentModal = this.modalCtrl.create('CommentsPage');
    commentModal.onDidDismiss(comment => {
      if (comment != null) this.submitLeaveServiceCall(leaveContact, comment,i);
    });
    commentModal.present();
  }
  submitLeaveServiceCall(leaveAppContact,comment,i){
    let loading = this.loadingCtrl.create({
      spinner: 'circles',
      content: 'Please wait...',
      duration : 2000
    });
    loading.present();
    this.axservice.submitEmplLeaveAppl(leaveAppContact,comment).subscribe(
      res=>{
        loading.dismiss();
        this.leaveApp[i]=res;
      },error=>{
        loading.dismiss();
        console.log(error);
      })
  }

  deleteLeaveHeader(leaveContact:LeaveAppTableContract,i){
    //leaveContact.IsDeleted=true;
    this.showConfirm("Delete","Do you want to delete this Leave?",leaveContact,i);
  }
  deleteLeaveLine(LeaveLine:LeaveAppLineContract,i) {
    //LeaveLine.IsDeleted=true;
    this.showConfirm("Delete","Do you want to delete this Leave Line?",LeaveLine,i);
  }
  newLeave() {
    this.navCtrl.push('LeaveAddPage',{
      isEditable: true,
      leaveContract:this.leaveApp
    });
  }

  editPage(details: LeaveAppTableContract,i) {
    this.editPageIndex=i;
    this.navCtrl.push('LeaveView2Page', {
      leaveTable:this.leaveApp,
      leaveDetails: details,
      isEditable: details.IsEditable,
      editPageIndex:i
    })
  }
  doRefresh(refresher) {
    setTimeout(() => {
      this.pageRefreshed=true;
      this.getLeaveApplication();
      refresher.complete();
    }, 2000);
  }
  deleteLeaveSerivceCall(leaveAppContact,i){
    console.log(leaveAppContact);
    let loading = this.loadingCtrl.create({
      spinner: 'circles',
      content: 'Please wait...',
      duration : 2000
    });
    loading.present();
    this.axservice.updateEmplLeaveAppl(leaveAppContact).subscribe(
      res=>{
        loading.dismiss();
        this.leaveApp[i]=res;
        this.presentToast("Leave Deleted Successfully");
      },error=>{
        loading.dismiss();
        console.log(error);
        this.presentToast("Connection Error");
      });
  }

  showConfirm(title,msg,data,i) {
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
           this.deleteLeaveSerivceCall(this.leaveApp[i],i);
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

    toast.present();
  }

  leaveCalendarPage(){
    this.navCtrl.push('LeaveCalendarPage')
  }
}
