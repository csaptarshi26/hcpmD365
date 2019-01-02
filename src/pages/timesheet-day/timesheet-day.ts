import { ParameterserviceProvider } from './../../providers/parameterservice/parameterservice';
import { CommentsPage } from './../comments/comments';
import { AxserviceProvider } from './../../providers/axservice/axservice';
import { TimesheetView2Page } from './../timesheet-view2/timesheet-view2';
import { TimesheetLineList } from './../../models/timesheet/tsLineListContact.interface';
import { TimesheetView1Page } from './../timesheet-view1/timesheet-view1';
import { TimesheetTableContact } from '../../models/timesheet/tsTableContract.interface';
import { Component, Input, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ViewController, LoadingController, ToastController } from 'ionic-angular';
import { CalendarComponent } from 'ng-fullcalendar';
import { Options } from 'fullcalendar';
import * as moment from 'moment'
import { TimesheetLineDateList } from '../../models/timesheet/tsLineDateListContact.interface';
import { TimesheetPeriodDateList } from '../../models/timesheet/timesheetPeriodDate.interface';

@IonicPage()
@Component({
  selector: 'page-timesheet-day',
  templateUrl: 'timesheet-day.html',
})
export class TimesheetDayPage {

  calendarOptions: Options;
  @ViewChild(CalendarComponent) ucCalendar: CalendarComponent;

  fcHeader: any = 0;

  periodFrom: Date;
  periodTo: Date;
  eventData: any[];
  isEditable: boolean;
  dates: any[];
  colorList: any = [];

  tsLineDateList: TimesheetLineDateList[];
  tsLineList: TimesheetLineList;
  tsTable = {} as TimesheetTableContact;
  tsChanged: boolean = false;
  periodDateList: TimesheetPeriodDateList[] = [];

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

    this.periodDateList.push(this.tsTable.TimesheetPeriodDateList);
    console.log(this.periodDateList)
  }

  goBack() {
    if (this.tsChanged) {
      this.viewCtrl.dismiss(this.tsTable);
    } else {
      this.viewCtrl.dismiss();
    }
  }
  addTsLine() {
    var obj: TimesheetLineList;
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
    var sdate = moment(this.periodFrom).format("YYYY-MM-DD");
    var edate = moment(this.periodTo, "YYYY-MM-DD").add('days', 1)
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
        defaultView: 'basic',
        visibleRange: {
          start: sdate,
          end: edate
        },
        dayRender: (date, cell) => {
          var today = new Date();
          if (moment(date).format("YYYY-MM-DD") === moment(today).format("YYYY-MM-DD")) {
            cell.css("background-color", "#E5E5F7");
          }
          //   if (tsLineList != null) {
          //     Object.keys(tsLineList).map(el => {
          //       var arr = tsLineList[el].TimesheetLineDateList;
          //       arr.forEach(key => {
          //         if (moment(date).format("YYYY-MM-DD") == moment(key.LineDate).format("YYYY-MM-DD")) {
          //           if (key.WorkingHours == 0) {
          //             cell.css("background-color", "#f4f4f4");
          //           }
          //         }
          //       });
          //     });
          //   }
        },
        events: evntData
      });
      $('.fc-day-header span').each(function () {

        var fullTxt = $(this).html();
        var date = fullTxt.split(' ');
        var dayName = date[0];
        var month = date[1].split('/')[0];
        var day = date[1].split('/')[1];

        if (month.length == 1) month = "0" + month;
        if (day.length == 1) day = "0" + day;
        $(this).html(dayName + " " + month + "/" + day);

      });
      $('#calendar1').fullCalendar('removeEvents');
      $('#calendar1').fullCalendar('addEventSource', evntData);
      $('#calendar1').fullCalendar('rerenderEvents');
    });
  }
}
