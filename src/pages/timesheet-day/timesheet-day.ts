import { ParameterserviceProvider } from './../../providers/parameterservice/parameterservice';
import { CommentsPage } from './../comments/comments';
import { AxserviceProvider } from './../../providers/axservice/axservice';
import { TimesheetView2Page } from './../timesheet-view2/timesheet-view2';
import { timesheetLineList } from './../../models/timesheet/tsLineListContact.interface';
import { TimesheetView1Page } from './../timesheet-view1/timesheet-view1';
import { timesheetTableContact } from '../../models/timesheet/tsTableContract.interface';
import { Component, Input, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ViewController, LoadingController, ToastController } from 'ionic-angular';
import { CalendarComponent } from 'ng-fullcalendar';
import { Options } from 'fullcalendar';
import * as moment from 'moment'
import { timesheetLineDateList } from '../../models/timesheet/tsLineDateListContact.interface';

@IonicPage()
@Component({
  selector: 'page-timesheet-day',
  templateUrl: 'timesheet-day.html',
})
export class TimesheetDayPage {

  calendarOptions: Options;
  @ViewChild(CalendarComponent) ucCalendar: CalendarComponent;

  periodFrom: Date;
  periodTo: Date;
  eventData: any[];
  isEditable: boolean;
  dates: any[];
  colorList: any = [];

  tsLineDateList: timesheetLineDateList[];
  tsLineList: timesheetLineList;
  tsTable = {} as timesheetTableContact;
  tsChanged: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, private axservice: AxserviceProvider,
    public modalCtrl: ModalController, public viewCtrl: ViewController, public paramService: ParameterserviceProvider,
    private toastCtrl: ToastController, public loadingCtrl: LoadingController) {

    this.getParamData();
    this.dates = [];
    this.getBetweenDate();
    this.colorList = this.paramService.colorList;
  }

  editProjectDetails(lineList: any) {
    let profileModal = this.modalCtrl.create(TimesheetView2Page,
      {
        lineList: lineList,
        periodFrom: this.periodFrom,
        periodTo: this.periodTo,
        isEditable: this.isEditable,
        tsTable: this.tsTable
      });
    profileModal.onDidDismiss(data => {

      if (data != null) {
        this.tsChanged = true;
        this.tsTable = data;
        this.tsLineList = data.TimesheetLineList;
        this.setFullcalendarEvents(this.tsLineList);
      }
    });
    profileModal.present();

  }
  getBetweenDate() {
    var start = new Date(this.periodFrom);
    var end = new Date(this.periodTo);
    var loop = new Date(start);
    while (loop <= end) {
      this.dates.push({ day: loop });
      var newDate = loop.setDate(loop.getDate() + 1);
      loop = new Date(newDate);
    }
  }
  ionViewDidLoad() {
  }
  getParamData() {
    this.tsTable = this.navParams.get("tsTableContact");
    this.tsLineList = this.navParams.get("tsTableLine");
    this.periodFrom = this.navParams.get("startDate");
    this.periodTo = this.navParams.get("endDate");
    this.isEditable = this.navParams.get("isEditable");
    this.setFullcalendarEvents(this.tsLineList);

  }

  goBack() {
    if (this.tsChanged) {
      this.viewCtrl.dismiss(this.tsTable);
    } else {
      this.viewCtrl.dismiss();
    }
  }
  addTsLine() {
    var obj: timesheetLineList;
    let profileModal = this.modalCtrl.create(TimesheetView2Page,
      {
        lineList: obj,
        periodFrom: this.periodFrom,
        periodTo: this.periodTo,
        isEditable: true,
        tsTable: this.tsTable
      });

    profileModal.onDidDismiss(data => {
      if (data != null) {
        this.tsChanged = true;
        this.tsTable = data;
        this.tsLineList = data.TimesheetLineList;
        this.setFullcalendarEvents(this.tsLineList);
      }
    })
    profileModal.present();
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
      this.viewCtrl.dismiss(this.tsTable);
    });
    toast.present();
  }

  setFullcalendarEvents(tslineList) {
    var eventData = [];
    if (tslineList != null) {
      Object.keys(tslineList).map(el => {
        if (tslineList[el].IsDeleted == 0) {
          var arr = tslineList[el].TimesheetLineDateList;
          var bgColor = this.paramService.colorList[Number(el)].bgColor;
          var txtColor = this.paramService.colorList[Number(el)].textColor;
          arr.forEach(key => {
            if (key.Hours != 0) {
              eventData.push({
                start: moment(key.LineDate).format("YYYY-MM-DD"),
                allDay: true,
                title: key.Hours,
                color: bgColor,
                textColor: txtColor
              });
            }
          });
        }
      });
    }
    this.setFullcalendarOptions(eventData, tslineList);
  }
  setFullcalendarOptions(evntData: any, tsLineList) {
    const component = this;
    $(document).ready(function () {
      $('#calendar1').fullCalendar({
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
        dayRender: (date, cell) => {
          var today = new Date();
          if (moment(date).format("YYYY-MM-DD") === moment(today).format("YYYY-MM-DD")) {
            cell.css("background-color", "#caddff");
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
      $('#calendar1').fullCalendar('removeEvents');
      $('#calendar1').fullCalendar('addEventSource', evntData);
      $('#calendar1').fullCalendar('rerenderEvents');
    });
  }
}
