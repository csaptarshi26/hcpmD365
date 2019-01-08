
import { SWIPER_CONFIG } from 'ngx-swiper-wrapper';
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Loading, Toggle } from 'ionic-angular';
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
  startDate: string = null;
  endDate: string = null;
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
  login() {
    let loading = this.loadingCtrl.create({
      spinner: 'circles',
      content: 'Please wait...',
      duration: 2000
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

  setFullcalendarEvents() {
    var eventData = [];
    if (this.startDate != null && this.endDate != null) {
      eventData.push({
        start: moment(this.startDate).format("YYYY-MM-DD"),
        end: moment(this.endDate, "YYYY-MM-DD").add(1, 'days'),
        allDay: true,
        title: 'hi',
      });
    }
    this.setFullcalendarOptions(eventData);
  }
  setFullcalendarOptions(evntData: any) {
    const component = this;
    $(document).ready(function () {
      $('#calendar1').fullCalendar({
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
      $('#calendar1').fullCalendar('removeEvents');
      $('#calendar1').fullCalendar('addEventSource', evntData);
      $('#calendar1').fullCalendar('rerenderEvents');
    });
  }
}
