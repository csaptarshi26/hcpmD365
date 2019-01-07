import { TimesheetLineList } from './../../models/timesheet/tsLineListContact.interface';
import { TimesheetTableContact } from '../../models/timesheet/tsTableContract.interface';
import { TimesheetView2Page } from './../timesheet-view2/timesheet-view2';
import { Component, ViewChild, ViewContainerRef, ComponentFactoryResolver, ComponentRef } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ToastController, AlertController, LoadingController } from 'ionic-angular';
import { AxserviceProvider } from '../../providers/axservice/axservice';
import { ParameterserviceProvider } from '../../providers/parameterservice/parameterservice';
import * as _ from "lodash";
import { TimesheetDayPage } from '../timesheet-day/timesheet-day';
import { Slides } from 'ionic-angular';
import * as moment from 'moment'
import { TimesheetPeriodDateList } from '../../models/timesheet/timesheetPeriodDate.interface';

@IonicPage()
@Component({
  selector: 'page-timesheet-view1',
  templateUrl: 'timesheet-view1.html',
})

export class TimesheetView1Page {
  @ViewChild(Slides) slides: Slides;
  tsTableContact: TimesheetTableContact;
  TimesheetLineList: TimesheetLineList;
  periodFrom: Date;
  periodTo: Date;
  status: String = "all";
  showDetails: boolean = false;

  pageRefreshed: boolean = false;

  periodList: any = [];
  DelTsLineIndex: any;

  tsIndex: any;

  @ViewChild('viewContainerRef', { read: ViewContainerRef }) VCR: ViewContainerRef;

  constructor(public navCtrl: NavController, public navParams: NavParams, private axservice: AxserviceProvider,
    private parameterservice: ParameterserviceProvider, public modalCtrl: ModalController, public alertCtrl: AlertController,
    private CFR: ComponentFactoryResolver, private toastCtrl: ToastController, public loadingCtrl: LoadingController) {

  }
  modalPage(tsTableDetails: TimesheetTableContact, details: any, isEditable: boolean, i: any) {
    let profileModal = this.modalCtrl.create(TimesheetDayPage,
      {
        tsTableContact: tsTableDetails,
        tsTableLine: details,
        startDate: this.periodFrom,
        endDate: this.periodTo,
        isEditable: isEditable
      });

    profileModal.onDidDismiss(data => {
      if (data != null) {
        this.tsTableContact[i] = data;
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
    this.getWorkerCurrentTimesheet(new Date());
  }
  deleteTs(lineList, tsDetails, i) {
    this.DelTsLineIndex = i;
    this.showConfirm(lineList, tsDetails);
  }

  //DELETE TIMESHEETLINE OPERATION WHICH IS CALLED WHEN USER AGREES ON CONFIRM ALERT
  deleteTsOperation(lineList, tsDetails) {
    var arr = tsDetails.TimesheetLineList;
    arr.forEach(el => {
      if (el == lineList) {
        el.IsDeleted = 1;
      }
    });
    this.DeleteWorkerTimesheet(tsDetails);
  }

  //METHOD TO REMOVE PERTICULAR 'ELEMENT' FROM GIVEN 'ARRAY'

  getWorkerCurrentTimesheet(periodDate: Date) {
    let loading = this.loadingCtrl.create({
      spinner: 'circles',
      content: 'Please wait...'
    });
    if (!this.pageRefreshed) {
      loading.present();
    }
    this.showDetails = false;
    this.axservice.getWorkerTimesheet(this.parameterservice.user, periodDate).subscribe(res => {
      loading.dismiss();
      if (res != null && res[0].TimesheetNumber != "") this.showDetails = true;
      console.log(res)
      this.tsTableContact = res;
      this.periodFrom = this.tsTableContact[0].PeriodFrom;
      this.periodTo = this.tsTableContact[0].PeriodTo;
      this.getList();
    }, (error) => {
      loading.dismiss();
      this.showDetails = false;
      console.log( error);
    });

  }
  newTimesheet() {
    let newTS = this.modalCtrl.create(TimesheetView2Page, {
      isEditable: true,
      periodFrom: this.periodFrom,
      periodTo: this.periodTo,
      periodList:this.tsTableContact[0].TimesheetPeriodDateList
    });
    newTS.onDidDismiss(data => {
      if (data != null) {
        var len = Object.keys(this.tsTableContact).length;
        Object.keys(this.tsTableContact).map(e => {
          if (len == 1 && this.tsTableContact[e].TimesheetNumber == "") {
            data.TimesheetPeriodDateList = this.tsTableContact[e].TimesheetPeriodDateList;
            len = 0;
            this.showDetails = true;
          }
          this.tsTableContact[len] = data;
        })
      }
    });
    newTS.present();
  }
  //METHOD TO UPDATE/DELETE TIMESHEET
  DeleteWorkerTimesheet(tsTable: TimesheetTableContact) {
    let loading = this.loadingCtrl.create({
      spinner: 'circles',
      content: 'Please wait...'
    });
    loading.present();

    this.axservice.updateWorkerTimesheet(tsTable).subscribe(
      (res) => {
        if (!(typeof this.DelTsLineIndex === "undefined")) {
          this.tsTableContact[this.DelTsLineIndex] = res;
        }
        console.log(this.tsTableContact);
        loading.dismiss();
        this.presentToast("Timesheet Deleted Successfully")
      },
      error => { loading.dismiss(); this.presentToast("Error While Deleting Timesheet Line") }
    );

  }

  // TOAST FOR SUCCESSFULLY DELETING TIMESHEETLINE
  presentToast(msg: any) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
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

  newTsLine(tsDetails, i: any) {
    this.tsIndex = i;
    var obj: TimesheetLineList;
    let profileModal = this.modalCtrl.create(TimesheetView2Page,
      {
        lineList: obj,
        periodFrom: this.periodFrom,
        periodTo: this.periodTo,
        isEditable: true,
        tsTable: tsDetails,
        periodList:this.tsTableContact[0].TimesheetPeriodDateList
      });

    profileModal.onDidDismiss(data => {
      if (data != null) {
        this.tsTableContact[this.tsIndex] = data;
        console.log(this.tsTableContact);
      }
    })
    profileModal.present();
  }

  doRefresh(refresher) {
    setTimeout(() => {
      this.pageRefreshed = true;
      this.getWorkerCurrentTimesheet(this.periodFrom);
      refresher.complete();
    }, 2000);
  }

  DeleteHeader(details) {
    this.showConfirmForHeaderDelete(details);

  }
  showConfirmForHeaderDelete(tsDetails) {
    const confirm = this.alertCtrl.create({
      title: 'Delete Timesheet Header?',
      message: 'Are you sure you want to delete this Timesheet Header?',
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
            tsDetails.IsDeleted = 1;
            this.DeleteWorkerTimesheet(tsDetails);
          }
        }
      ]
    });
    confirm.present();
  }
  goToSlide() { this.slides.slideTo(2, 500); }

  submitTs(details, i) {
    let commentModal = this.modalCtrl.create('CommentsPage');
    commentModal.onDidDismiss(comment => {
      if (comment != null) this.SubmitWorkerTimesheet(details, comment, i);
    });
    commentModal.present();
  }

  SubmitWorkerTimesheet(tsTableContact: TimesheetTableContact, comment: string, i: any) {
    var msg;
    let loading = this.loadingCtrl.create({
      spinner: 'circles',
      content: 'Please wait...'
    });
    loading.present();
    console.log(tsTableContact);
    this.axservice.submitWorkerTimesheet(tsTableContact, comment).subscribe(
      (res) => {
        this.tsTableContact[i] = res;
        console.log(res);
        loading.dismiss();
        this.presentToast("Timesheet Submitted Successfully")
      },
      error => {
        loading.dismiss();
        this.presentToast("Error While Submitted Timesheet Line")
      }
    );
  }


  getList() {
    var sDate = new Date(moment(this.periodFrom).format("YYYY-MM-DD"));
    var eDate = new Date(moment(this.periodTo).format("YYYY-MM-DD"));
    for (var i = 0; i < 24; i++) {
      this.periodList.push({ periodFrom: sDate, periodTo: eDate })

      var prevPeriodFrom = new Date(sDate);
      var prevPeriodTo = new Date(eDate);

      prevPeriodFrom.setDate(prevPeriodFrom.getDate() - 7);
      prevPeriodTo.setDate(prevPeriodTo.getDate() - 7);

      sDate = prevPeriodFrom;
      eDate = prevPeriodTo;
    }
  }
  slideChanged() {
    let currentIndex = this.slides.getActiveIndex();
    this.getWorkerCurrentTimesheet(this.periodList[currentIndex].periodFrom);
  }
  nextSlide() {
    this.slides.slideNext();
  }
  prevSlide() {
    this.slides.slidePrev();
  }

}
