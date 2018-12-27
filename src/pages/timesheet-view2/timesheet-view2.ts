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
import { Validators } from '@angular/forms';

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
  isNewTs:boolean;

  newTSContact = <timesheetTableContact>{};

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
      this.isNewTs=false;
    } else {
      this.tsLineDate = this.getBetweenDates();
      this.isNewTs=true;
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
    this.setFullcalendarOptions(eventData, tslineList);
  }
  setFullcalendarOptions(evntData: any, tsLineList) {
    const component = this;
    $(document).ready(function () {
      $('#calendar').fullCalendar({
        height: 200,
        editable: true,
        eventLimit: false,
        header: {
          left: '',
          center: '',
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
        eventClick: (event) => {
          var d = moment(event.start).format("YYYY-MM-DD")
          component.modal(d);
        },
        dayRender: (date, cell) => {
          var today = new Date();
          if (moment(date).format("YYYY-MM-DD") === moment(today).format("YYYY-MM-DD")) {
            cell.css("background-color", "#E5E5F7");
          }
          if (tsLineList != null) {
            Object.keys(tsLineList).map(el => {
              var arr = tsLineList[el].TimesheetLineDateList;
              arr.forEach(key => {
                if (moment(date).format("YYYY-MM-DD") == moment(key.LineDate).format("YYYY-MM-DD")) {
                  if (key.WorkingHours == 0) {
                    cell.css("background-color", "#f4f4f4");
                  }
                }
              });
            });
          }
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
  validator(tsDetail) {
    Object.keys(tsDetail.TimesheetLineList).map(e => {
     
      if(this.isNewTs){
        const line = tsDetail.TimesheetLineList[e];
      }else{
        const line = tsDetail.TimesheetLineList[e];
        console.log(line);
      }
    });
    return false;
  }
  updateWorkerTimesheet(tsTableContact: timesheetTableContact) {
    let loading = this.loadingCtrl.create({
      spinner: 'circles',
      content: 'Please wait...'
    });
    loading.present();
    loading.dismiss();
    if(this.validator(tsTableContact)){

    }
    this.axservice.updateWorkerTimesheet(tsTableContact).subscribe(
      (res) => {
        this.tsTable = res;
        loading.dismiss();
        this.presentToast("Timesheet Updated Successfully")
      },
      (error) => {
        loading.dismiss();
        this.presentToast("Error - updating timesheet" + error)
      }
    );
  }
  showConfirm() {
    const confirm = this.alertCtrl.create({
      title: 'Update',
      message: 'Do you want to update the line?',
      buttons: [
        {
          text: 'Disagree',
          handler: () => {
          }
        },
        {
          text: 'Agree',
          handler: () => {
            this.lineNumOpp();
            this.updateWorkerTimesheet(this.tsTable);
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
      this.viewCtrl.dismiss(this.tsTable);
    });
    toast.present();
  }
  lineNumOpp() {
    if (typeof this.tsTable === "undefined") {
      this.newTSContact.PeriodFrom = this.periodFrom;
      this.newTSContact.PeriodTo = this.periodTo;
      this.newTSContact.IsEditable = true;
      this.newTSContact.EmplId = "000020";
      this.newTSContact.TimesheetNumber = "";
      var arr = [];
      arr = Array(this.newTsLine);
      this.newTSContact.TimesheetLineList = Object(arr);
      this.tsTable = this.newTSContact;
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
  }
}
