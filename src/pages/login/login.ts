
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


  setFullcalendarEvents() {
    var eventData = [];
    eventData.push({
      start: moment('2019-01-10').format("YYYY-MM-DD"),
      end:moment('2019-01-11',"YYYY-MM-DD").add(1,'days'),
      allDay: true,
      title: 'hi',
      color: 'red'
    });
    this.setFullcalendarOptions(eventData);
  }
  setFullcalendarOptions(evntData: any) {
    const component = this;
    var sdate = moment('2019-01-01').format("YYYY-MM-DD");
    var edate = moment('2019-01-31', "YYYY-MM-DD").add('days', 1)
    $(document).ready(function () {
      $('#calendar1').fullCalendar({
        height:500,
        editable: true,
        eventLimit: false,
        header: {
          left: 'prev,next',
          center: 'title',
          right: 'month,year'
        },
        defaultView: 'month',
        visibleRange: {
          start: sdate,
          end: edate
        },
        
        events: evntData
      });
      $('#calendar1').fullCalendar('removeEvents');
      $('#calendar1').fullCalendar('addEventSource', evntData);
      $('#calendar1').fullCalendar('rerenderEvents');
    });
  }
}
