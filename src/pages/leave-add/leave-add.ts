import { LeaveAppTableContract } from './../../models/leave/leaveAppTableContact.interface';
import { LeaveBalanceContract } from './../../models/leave/leaveBalanceContract.interface';
import { AxserviceProvider } from './../../providers/axservice/axservice';
import { ParameterserviceProvider } from './../../providers/parameterservice/parameterservice';
import { LeaveAppLineContract } from './../../models/leave/leaveAppLineContract.interface';
import { Component } from '@angular/core';
import * as moment from 'moment';
import { IonicPage, NavController, NavParams, LoadingController, ToastController, AlertController, ModalController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-leave-add',
  templateUrl: 'leave-add.html',
})
export class LeaveAddPage {

  leaveLine: LeaveAppLineContract = {} as LeaveAppLineContract;
  leaveBalance: LeaveBalanceContract;
  leaveContract: LeaveAppTableContract;
  newLeave: LeaveAppTableContract = {} as LeaveAppTableContract;
  balance: any = null;
  isEditable: boolean;


  constructor(public navCtrl: NavController, public navParams: NavParams, private axservice: AxserviceProvider,
    private parameterservice: ParameterserviceProvider, public loadingCtrl: LoadingController,
    private toastCtrl: ToastController, public alertCtrl: AlertController, public modalCtrl: ModalController) {

    this.isEditable = navParams.get("isEditable");
    this.leaveContract = navParams.get("leaveContract");
    this.setFullcalendarEvents();
  }

  ionViewDidLoad() {
    this.getLeaveBalance();
  }
  goBack() {
    this.navCtrl.pop();
  }
  selectedLeaveCode(code) {
    Object.keys(this.leaveBalance).map(el => {
      if (this.leaveBalance[el].Code == code) {
        this.balance = this.leaveBalance[el].Balance;
      }
    });
    this.setFullcalendarEvents();
  }
  getLeaveBalance() {
    this.axservice.getEmplLeaveBalance(this.parameterservice.user).subscribe(
      res => {
        this.leaveBalance = res;
      }, error => {
        console.log(error);
      });
  }
  createNewLeave() {
    var len = Object.keys(this.leaveContract).length;

    this.newLeave.ApplicationLine = Object(Array(this.leaveLine));
    this.newLeave.EmpId = this.parameterservice.user;
    this.newLeave.PeriodFrom = this.leaveLine.ValidFrom;
    this.newLeave.PeriodTo = this.leaveLine.ValidTo;

    this.createLeaveServiceCall(len);
  }

  createLeaveServiceCall(len) {
    this.axservice.updateEmplLeaveAppl(this.newLeave).subscribe(
      res => {
        if (res.Error) {
          this.errorToast(res.Remarks)
        } else {
          this.leaveContract[len] = res;
          this.presentToast("Leave Created");
        }
      }, error => {
        this.errorToast("Connection Error");
      })
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
  validator() {
    if (typeof this.leaveLine.AbsenceCode === "undefined") {
      this.errorToast("Leave Type Cann't be blank");
    } else if (typeof this.leaveLine.ValidFrom === "undefined") {
      this.errorToast("Start Date Cann't be blank");
    } else if (typeof this.leaveLine.ValidTo === "undefined") {
      this.errorToast("End Date Cann't be blank");
    } else if ((this.leaveLine.ValidFrom == this.leaveLine.ValidTo) &&
      (typeof this.leaveLine.hours === "undefined")) {
      this.errorToast("Hours Cann't be blank");
    } else {
      return true;
    }
    return false;
  }
  showConfirm() {
    if (this.validator()) {
      const confirm = this.alertCtrl.create({
        title: 'Add',
        message: 'Are you sure you want to Apply Leave for the given date?',
        buttons: [
          {
            text: 'Disagree',
            handler: () => {
            }
          },
          {
            text: 'Agree',
            handler: () => this.createNewLeave()
          }
        ]
      });
      confirm.present();
    }
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
      this.navCtrl.getPrevious().data.leaveContact = this.leaveContract;
      this.navCtrl.pop();
    });
    toast.present();
  }

  setFullcalendarEvents() {
    var eventData = [];

    Object.keys(this.leaveContract).map(el=>{
      var line=this.leaveContract[el].ApplicationLine;
      var status=this.leaveContract[el].Status;
      var color="";
      if(status=="Started") color="grey";
      else if(status=="Created" || status=="Submitted") color="#488aff";
      else if(status=="Rejected") color="#f53d3d";
      else if(status=="Approved") color="#2bc158";
      else color="#488aff"
      line.forEach(key => {
        eventData.push({
          start: moment(key.ValidFrom).format("YYYY-MM-DD"),
          end:moment(key.ValidTo,"YYYY-MM-DD").add(1,'days'),
          allDay: true,
          title: key.AbsenceCode,
          color: color
        });
      });
    })

    if (typeof this.leaveLine.ValidFrom  !== "undefined" && typeof this.leaveLine.ValidTo  !== "undefined") {
      eventData.push({
        start: moment(this.leaveLine.ValidFrom).format("YYYY-MM-DD"),
        end: moment(this.leaveLine.ValidTo, "YYYY-MM-DD").add(1, 'days'),
        allDay: true,
        title: this.leaveLine.AbsenceCode,
      });
    }

    this.setFullcalendarOptions(eventData);

  }
  setFullcalendarOptions(evntData: any) {
    const component = this;
    var date = new Date();

    var edate = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    if (typeof this.leaveLine.ValidFrom  !== "undefined" && 
    typeof this.leaveLine.ValidTo  !== "undefined") {
      edate=this.leaveLine.ValidTo;
    }
    
    $(document).ready(function () {
     (<any>$('#calendar1')).fullCalendar({
        height: 300,
        editable: true,
        eventLimit: false,
        header: {
          left: 'prev',
          center: 'title',
          right: 'next'
        },
       
        dayClick: (date) => {
          var d = moment(date).format("YYYY-MM-DD")
        },
        defaultView: 'month',
        events: evntData
      });
      (<any>$('#calendar1')).fullCalendar('gotoDate', moment(edate));
      (<any>$('#calendar1')).fullCalendar('removeEvents');
      (<any>$('#calendar1')).fullCalendar('addEventSource', evntData);
      (<any>$('#calendar1')).fullCalendar('rerenderEvents');
    });
  }

}
