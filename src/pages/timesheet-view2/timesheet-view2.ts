import { ParameterserviceProvider } from './../../providers/parameterservice/parameterservice';
import { timesheetLineDateList } from './../../models/timesheet/tsLineDateListContact.interface';
import { CalendarComponent } from 'ng-fullcalendar';
import { Options } from 'fullcalendar';
import { TimesheetDayPage } from './../timesheet-day/timesheet-day';
import { AxserviceProvider } from './../../providers/axservice/axservice';
import { TimesheetView1Page } from './../timesheet-view1/timesheet-view1';
import { TimesheetView3Page } from './../timesheet-view3/timesheet-view3';
import { Component, ComponentRef, ComponentFactoryResolver, ViewContainerRef, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Modal, AlertController, LoadingController } from 'ionic-angular';
import { ModalController } from 'ionic-angular';
import { timesheetLineList } from '../../models/timesheet/tsLineListContact.interface';
import { timesheetProject } from '../../models/timesheet/timesheetProject.interface';
import { timesheetActivity } from '../../models/timesheet/timesheetActivity.interface';
import { timesheetCategory } from '../../models/timesheet/timesheetCategory.interface';
import * as moment from 'moment';
import { ToastController } from 'ionic-angular';
declare var $: any;
import { Nav, Platform } from 'ionic-angular';
import { timesheetTableContact } from '../../models/timesheet/tsTableContract.interface';
import { Events } from 'ionic-angular';

/**
 * Generated class for the TimesheetView2Page page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-timesheet-view2',
  templateUrl: 'timesheet-view2.html',
})
export class TimesheetView2Page {
  @ViewChild(Nav) nav: Nav;
  calendarOptions: Options;
  @ViewChild(CalendarComponent) ucCalendar: CalendarComponent;

  isEditable: boolean;
  periodFrom: Date;
  periodTo: Date;

  newTSContact=<timesheetTableContact>{};

  newTsLine = <timesheetLineList>{};
  tsTable: timesheetTableContact = {} as timesheetTableContact;
  tsLineList: timesheetLineList[];
  tsLineDate: timesheetLineDateList[];
  tsProject: timesheetProject;
  tsActivity: timesheetActivity;
  tsCategory: timesheetCategory;

  constructor(public navCtrl: NavController, public navParams: NavParams, public events: Events,
    public modalCtrl: ModalController, public viewCtrl: ViewController, public alertCtrl: AlertController,
    private axservice: AxserviceProvider, private toastCtrl: ToastController, public loadingCtrl: LoadingController,
    private parameterservice: ParameterserviceProvider) {
    this.getParameters();
    this.getWorkerTimesheetProjects();
    this.getWorkerTimesheetCategory();
    if (this.tsLineList != null) this.getWorkerTimesheetActivity(this.tsLineList[0].ProjId);
    this.setFullcalendarEvents(this.tsLineList);

  }
  getParameters() {
    var tsLineData: timesheetLineList;
    this.tsTable = this.navParams.get("tsTable");
    this.periodFrom = this.navParams.get("periodFrom")
    this.periodTo = this.navParams.get("periodTo");
    tsLineData = this.navParams.get("lineList");
    this.isEditable = this.navParams.get("isEditable");
    if (tsLineData != null) {
      this.tsLineList = Array(tsLineData);
    } else {
      this.tsLineDate = this.getBetweenDates();
      this.newTsLine.TimesheetLineDateList = Object(this.tsLineDate);
    }
  }
  selectedProject(project: any) {
    console.log(project);
    this.getWorkerTimesheetActivity(project);
  }
  getWorkerTimesheetProjects() {
    this.axservice.getWorkerTimesheetProject().subscribe(res => {
      this.tsProject = res;
    }, (error) => {
      console.log('Error - get worker project details: ' + error);
    })
  }

  getWorkerTimesheetActivity(proj: any) {
    this.axservice.getWorkerTimesheetActivity(proj).subscribe(res => {
      this.tsActivity = res;
    }, (error) => {
      console.log('Error - get worker activity details: ' + error);
    })
  }
  getWorkerTimesheetCategory() {
    this.axservice.getWorkerTimesheetCategory().subscribe(res => {
      this.tsCategory = res;
      // console.log(this.tsCategory);
    }, (error) => {
      console.log('Error - get worker category details: ' + error);
    })
  }

  presentProfileModal(clickedDate: any) {
    let profileModal = this.modalCtrl.create(TimesheetView3Page, { days: clickedDate });
    profileModal.present();
  }
  goBack() {
    this.viewCtrl.dismiss();
  }
  setFullcalendarEvents(tslineList) {
    var eventData = [];
    if (tslineList != null) {
      Object.keys(tslineList).map(el => {
        var arr = tslineList[el].TimesheetLineDateList;
        arr.forEach(key => {
          if (key.Hours != 0) {
            eventData.push({
              start: moment(key.LineDate).format("YYYY-MM-DD"),
              allDay: true,
              title: key.Hours
            });
          }
        });
      });
    }
    this.setFullcalendarOptions(eventData);
  }
  setFullcalendarOptions(evntData: any) {
    const component = this;
    $(document).ready(function () {
      $('#calendar').fullCalendar({
        height: 200,
        editable: true,
        eventLimit: false,
        header: {
          left: '',
          center: 'title',
          right: ''
        },
        defaultView: 'basicWeek',
        visibleRange: {
          start: moment(this.periodFrom).format("YYYY-MM-DD"),
          end: moment(this.periodTo).format("YYYY-MM-DD")
        },
        dayClick: (date) => {
          var d = moment(date).format("YYYY-MM-DD")
          component.modal(d);
        },
        eventClick: function (event) {
          alert(event.title);
        },
        events: evntData
      });
      $('#calendar').fullCalendar('removeEvents');
      $('#calendar').fullCalendar('addEventSource', evntData);
      $('#calendar').fullCalendar('rerenderEvents');
    });
  }
  presentCommentModal(selectedDateList, tsLineList) {
    let profileModal = this.modalCtrl.create(TimesheetView3Page,
      {
        DateLineList: selectedDateList,
        isEditable: this.isEditable,
        lineList: tsLineList
      });
    profileModal.present();
    profileModal.onDidDismiss(data => {
      if (data != null) {
        if (data.constructor === Object) {
          data.TimesheetLineDateList = Array(data.TimesheetLineDateList);
          data = Array(data);
        }
        this.setFullcalendarEvents(data);
      }
    })
  }
  modal(d: any) {
    var selectedDateList;
    if (this.tsLineList != null) {
      selectedDateList = this.getSelectedDateLineList(this.tsLineList, d);
      this.presentCommentModal(selectedDateList, this.tsLineList);
    } else {
      let selectedDateList;
      selectedDateList = this.getSelectedDateLineList(Array(this.newTsLine), d);
      this.presentCommentModal(selectedDateList, Array(this.newTsLine));
    }
  }
  getBetweenDates() {
    var dateString = this.periodFrom;
    var actualDate = new Date(dateString);
    var lineDateList = [];
    for (var i = 0; i < 7; i++) {
      var dt = new Date(actualDate.getFullYear(), actualDate.getMonth(), actualDate.getDate() + i);
      lineDateList.push({
        ExternalComments: "",
        Hours: 0,
        InternalComments: "",
        LineDate: moment(dt).format("YYYY-MM-DD HH:mm:ss")
      });
    }
    return lineDateList;
  }
  getSelectedDateLineList(tsline, d) {
    var selectedDateList;
    Object.keys(tsline).map(el => {
      var arr = tsline[el].TimesheetLineDateList;
      arr.forEach(dateListItem => {
        if (moment(dateListItem.LineDate).format("YYYY-MM-DD") == d) {
          selectedDateList = dateListItem;
          return;
        }
      });
    });
    return selectedDateList;
  }
  updateTimesheet() {
    if (typeof this.tsTable === "undefined") {
      this.newTSContact.PeriodFrom=this.periodFrom;
      this.newTSContact.PeriodTo=this.periodTo;
      this.newTSContact.IsEditable=true;
      this.newTSContact.EmplId=this.parameterservice.user;
      this.newTSContact.TimesheetLineList=this.newTsLine;

      this.tsTable=this.newTSContact;
    } else {
      if (!(Object.keys(this.newTsLine).length === 0 && this.newTsLine.constructor === Object)) {
        var len = Object.keys(this.tsTable.TimesheetLineList).length;
        var lineNum = 0;
        if (len != 0) {
          lineNum = this.tsTable.TimesheetLineList[len - 1].LineNum;
          this.newTsLine.LineNum = lineNum + 1;
          Object.keys(this.tsTable.TimesheetLineList).map(e => {
            this.tsTable.TimesheetLineList[len] = this.newTsLine;
          });
        } else {
          this.newTsLine.LineNum = lineNum + 1;
          this.tsTable.TimesheetLineList[len] = this.newTsLine;
        }
      }
    }
    console.log(this.tsTable);
    this.showConfirm(this.tsTable);
  }

  updateWorkerTimesheet(tsTableContact: timesheetTableContact) {
    let loading = this.loadingCtrl.create({
      spinner: 'circles',
      content: 'Please wait...',
      duration: 1000
    });
    loading.present();
    this.axservice.updateWorkerTimesheet(tsTableContact).subscribe(
      (res) => {
        this.tsTable = res;
        console.log(res);
        console.log(this.tsTable);
        loading.dismiss();
        this.presentToast("Timesheet Updated Successfully")
      },
      (error) => {
        loading.dismiss();
        this.presentToast("Error - updating timesheet" + error)
      }
    );
  }
  showConfirm(tsTable) {
    const confirm = this.alertCtrl.create({
      title: 'Update Timesheet Line?',
      message: 'Are you sure you want to update this Timesheet Line?',
      buttons: [
        {
          text: 'Disagree',
          handler: () => {
           console.log("disagree clicked");
          }
        },
        {
          text: 'Agree',
          handler: () => {
            this.updateWorkerTimesheet(tsTable)
          }
        }
      ]
    });
    confirm.present();
  }
  presentToast(msg: any) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 1000,
      position: 'top',
      showCloseButton: true,
      closeButtonText: "ok"
    });

    toast.onDidDismiss(() => {
      console.log(this.tsTable);
      this.viewCtrl.dismiss(this.tsTable);
      //this.navCtrl.pop();this.tsTable
    });
    toast.present();
  }
}
