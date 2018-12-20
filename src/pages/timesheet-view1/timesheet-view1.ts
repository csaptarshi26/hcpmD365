import { timesheetLineList } from './../../models/timesheet/tsLineListContact.interface';
import { timesheetTableContact } from '../../models/timesheet/tsTableContract.interface';
import { TimesheetView2Page } from './../timesheet-view2/timesheet-view2';
import { Component, ViewChild, ViewContainerRef, ComponentFactoryResolver, ComponentRef } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ToastController, AlertController, LoadingController } from 'ionic-angular';
import { AxserviceProvider } from '../../providers/axservice/axservice';
import { ParameterserviceProvider } from '../../providers/parameterservice/parameterservice';
import * as _ from "lodash";
import { TimesheetDayPage } from '../timesheet-day/timesheet-day';

@IonicPage()
@Component({
  selector: 'page-timesheet-view1',
  templateUrl: 'timesheet-view1.html',
})

export class TimesheetView1Page {

  tsTableContact: timesheetTableContact;
  TimesheetLineList: timesheetLineList;
  periodFrom: Date;
  periodTo: Date;
  status: String = "all";
  showDetails: boolean = false;

  tsIndex:any;

  @ViewChild('viewContainerRef', { read: ViewContainerRef }) VCR: ViewContainerRef;

  constructor(public navCtrl: NavController, public navParams: NavParams, private axservice: AxserviceProvider,
    private parameterservice: ParameterserviceProvider, public modalCtrl: ModalController, public alertCtrl: AlertController,
    private CFR: ComponentFactoryResolver, private toastCtrl: ToastController, public loadingCtrl: LoadingController) {

  }
  modalPage(tsTableDetails: timesheetTableContact, details: any, isEditable: boolean) {
    let profileModal = this.modalCtrl.create(TimesheetDayPage,
      {
        tsTableContact: tsTableDetails,
        tsTableLine: details,
        startDate: this.periodFrom,
        endDate: this.periodTo,
        isEditable: isEditable
      });

    profileModal.onDidDismiss(data => {
      if(data!=null){
        this.tsTableContact = data;
      }
    });
    profileModal.present();


  }
  send() {
    let componentFactory = this.CFR.resolveComponentFactory(TimesheetDayPage);
    let componentRef: ComponentRef<TimesheetDayPage> = this.VCR.createComponent(componentFactory);
    let currentComponent = componentRef.instance;
  }
  ionViewDidLoad() {
    this.getWorkerCurrentTimesheet();
  }
  deleteTs(lineList, tsDetails) {
    this.showConfirm(lineList, tsDetails);
  }

  //DELETE TIMESHEETLINE OPERATION WHICH IS CALLED WHEN USER AGREES ON CONFIRM ALERT
  deleteTsOperation(lineList, tsDetails) {
    let loading = this.loadingCtrl.create({
      spinner: 'circles',
      content: 'Please wait...',
      duration: 2000
    });
    var arr = tsDetails.TimesheetLineList;
    arr.forEach(el => {
      if (el == lineList) {
        el.IsDeleted = 1;
        loading.present();
      }
    });
    loading.dismiss();
    this.DeleteWorkerTimesheet(tsDetails);
  }

  //METHOD TO REMOVE PERTICULAR 'ELEMENT' FROM GIVEN 'ARRAY'

  getWorkerCurrentTimesheet() {
    let loading = this.loadingCtrl.create({
      spinner: 'circles',
      content: 'Please wait...',
      duration: 2000
    });

    loading.present();
    this.axservice.getWorkerCurrentTimesheet(this.parameterservice.user).subscribe(res => {
      loading.dismiss();
      if (res != null) {
        this.showDetails = true;
        console.log(res)
        this.tsTableContact = res;
        this.showDetails = true;
        this.periodFrom = this.tsTableContact[0].PeriodFrom;
        this.periodTo = this.tsTableContact[0].PeriodTo;
      }
    }, (error) => {
      this.showDetails = false;
      console.log('Error - get worker ts period details: ' + error);
    })
  }
  newTimesheet() {
    this.navCtrl.push(TimesheetView2Page,{isEditable:true});
  }
  //METHOD TO UPDATE/DELETE TIMESHEET
  DeleteWorkerTimesheet(tsTableContact: timesheetTableContact) {
    var msg;
    this.axservice.updateWorkerTimesheet(tsTableContact).subscribe(
      (res) => this.presentToast("Timesheet Deleted Successfully"),
      error => this.presentToast("Error While Deleting Timesheet Line" + error)
    );

  }

  // TOAST FOR SUCCESSFULLY DELETING TIMESHEETLINE
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

  // CONFIRM ALERT WHEN DELETING TIMESHEETLINE
  showConfirm(lineList, tsDetails) {
    const confirm = this.alertCtrl.create({
      title: 'Delete Timesheet Line?',
      message: 'Are you sure you want to delete this Timesheet Line?',
      buttons: [
        {
          text: 'Disagree',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Agree',
          handler: () => {
            let loading = this.loadingCtrl.create({
              spinner: 'circles',
              content: 'Please wait...',
              duration: 1000
            });

            loading.present();
            this.deleteTsOperation(lineList, tsDetails);
          }
        }
      ]
    });
    confirm.present();
  }

  newTsLine(tsDetails,i:any) {
    this.tsIndex=i;
    var obj: timesheetLineList;
    let profileModal = this.modalCtrl.create(TimesheetView2Page,
      {
        lineList: obj,
        periodFrom: this.periodFrom,
        periodTo: this.periodTo,
        isEditable: true,
        tsTable: tsDetails
      });

    profileModal.onDidDismiss(data=>{
      if(data!=null){ 
        this.tsTableContact[this.tsIndex]=data;
        console.log(this.tsTableContact);
      }
    })
    profileModal.present();
  }

  doRefresh(refresher) {
    setTimeout(() => {
      this.getWorkerCurrentTimesheet();
      refresher.complete();
    }, 2000);
  }
}
