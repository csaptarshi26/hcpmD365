import { LeaveAppTableContract } from './../../models/leave/leaveAppTableContact.interface';
import { ParameterserviceProvider } from './../../providers/parameterservice/parameterservice';
import { AxserviceProvider } from './../../providers/axservice/axservice';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import * as moment from 'moment';
import { LeaveView2Page } from '../leave-view2/leave-view2';
@IonicPage()
@Component({
  selector: 'page-leave-calendar',
  templateUrl: 'leave-calendar.html',
})
export class LeaveCalendarPage {

  leaveApp: LeaveAppTableContract;
  constructor(public navCtrl: NavController, public navParams: NavParams, private axservice: AxserviceProvider,
    private parameterservice: ParameterserviceProvider,public loadingCtrl: LoadingController) {
  }

  ionViewDidLoad() {
    this.getLeaveApplication();
   
  }
  public ionViewWillEnter() {
    var data=this.navParams.get('leaveContact') || null;
    if(data !=null){ 
      this.leaveApp = data
      this.setFullcalendarEvents();
    }
  }
  goBack() {
    this.navCtrl.getPrevious().data.leaveApp=this.leaveApp;
    this.navCtrl.pop();
  }
  setFullcalendarEvents() {
    var eventData = [];
    Object.keys(this.leaveApp).map(el=>{
      var line=this.leaveApp[el].ApplicationLine;
      var status=this.leaveApp[el].Status;
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
          color: color,
          leaveDetails:this.leaveApp[el],
          editPageIndex:el
        });
      });
    })
    this.setFullcalendarOptions(eventData);
  }
  setFullcalendarOptions(evntData: any) {
    const component = this;
    $(document).ready(function () {
      $('#calendar12').fullCalendar({
        height:400,
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
        eventClick: (event) => {
          var d = moment(event.start).format("YYYY-MM-DD")
          component.navCtrl.push('LeaveView2Page',{
            leaveTable:component.leaveApp,
            leaveDetails:event.leaveDetails,
            isEditable:event.leaveDetails.IsEditable,
            editPageIndex:event.editPageIndex
          })
          console.log(event)
        },
        defaultView: 'month',
        events: evntData
      });
      $('#calendar12').fullCalendar('removeEvents');
      $('#calendar12').fullCalendar('addEventSource', evntData);
      $('#calendar12').fullCalendar('rerenderEvents');
    });
  }

  getLeaveApplication() {
    let loading = this.loadingCtrl.create({
      spinner: 'circles',
      content: 'Please wait...',
      duration : 2000
    });
    loading.present();
    this.axservice.getWorkerLeaveAppl(this.parameterservice.user).subscribe(
      res => {
        loading.dismiss();
        this.leaveApp = res;
        this.setFullcalendarEvents();
      },error => {
        loading.dismiss();
        console.log(error);
      }
    )
  }

  newLeave() {
    this.navCtrl.push('LeaveAddPage',{
      isEditable: true,
      leaveContract:this.leaveApp
    });
  }
}
