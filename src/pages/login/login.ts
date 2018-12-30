
import { SWIPER_CONFIG } from 'ngx-swiper-wrapper';
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Loading } from 'ionic-angular';
import { AxserviceProvider } from '../../providers/axservice/axservice';
import { ParameterserviceProvider } from '../../providers/parameterservice/parameterservice';
import { StorageserviceProvider } from '../../providers/storageservice/storageservice';
import * as moment from 'moment';
import { Slides } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  public user: string;
  public authenticated: boolean;

  @ViewChild(Slides) slides: Slides;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private axservice: AxserviceProvider, public loadingCtrl: LoadingController,
    private parameterservice: ParameterserviceProvider, public storageservice: StorageserviceProvider) {
      this.setFullcalendarEvents();
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
    this.authenticated = this.parameterservice.authenticated;
    this.user = this.parameterservice.user;
    if (this.authenticated == false) {
      this.login();
    }
  }

  setFullcalendarEvents() {
    var eventData =[{
      start: moment('2018-12-31').format("YYYY-MM-DD"),
      allDay: true,
      title: 'hi'
    }]
    this.setFullcalendarOptions(eventData);
  }
  setFullcalendarOptions(evntData: any) {
    console.clear();
    const component = this;
    var sdate = moment('2018-12-30').format("YYYY-MM-DD");
    var edate = moment('2019-01-05', "YYYY-MM-DD").add('days', 1)
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
        defaultView: 'basic',
        visibleRange: {
          start: sdate,
          end: edate
        },
        events: evntData
      });
      $('.fc-day-header span').each(function() {
        var fullTxt = $(this).html();
        var date=fullTxt.split(' ');
        var dayName=date[0];
        var month=date[1].split('/')[0];
        var day=date[1].split('/')[1];
        
        if(month.length==1) month="0" + month;
        if(day.length==1) day="0"+day;
        console.log("day name : " + dayName + " \nmonth : " + month + "\ndate : " + day )
        $(this).html(dayName +"\n" + month + "/" + day);
        
      });     
      $('#calendar').fullCalendar('removeEvents');
      $('#calendar').fullCalendar('addEventSource', evntData);
      $('#calendar').fullCalendar('rerenderEvents');
    });
  }
 
  login() {
    let loading = this.loadingCtrl.create({
      spinner: 'circles',
      content: 'Please wait...',
      duration:2000
    });
  
    loading.present();
    this.axservice.login.subscribe((data) => {
      loading.dismiss();
      console.log('Login ' + data);
      this.user = this.parameterservice.user;
      this.authenticated = true;
      this.axservice.createProxyUserToken.subscribe((data) => {
        this.navCtrl.pop();
      }, (error) => {

      })

    }, (error) => {
      loading.dismiss();
      console.log('Login - error ' + error);
    });
  }

  logout() {
    this.authenticated = false;
    this.storageservice.setAuthenticated(false);
    this.storageservice.setLoginUser("");
    this.storageservice.setEmployeeId("");
  }
}
