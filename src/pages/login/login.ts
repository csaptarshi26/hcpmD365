
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
        
  }
  
  // goToSlide() {this.slides.slideTo(2, 500);}
  // nextSlide() {this.slides.slideNext();}
  // prevSlide() {this.slides.slidePrev();}
  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
    this.authenticated = this.parameterservice.authenticated;
    this.user = this.parameterservice.user;
    if (this.authenticated == false) {
      this.login();
    }
    this.setFullcalendarEvents();
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
    var eventData = [
      {
        start: moment("2018-12-23").format("YYYY-MM-DD"),
        allDay: true,
        title: "hi"
      }
    ]
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
          center: '',
          right: ''
        },
        defaultView: 'basicWeek',
        visibleRange: {
          start: moment("2018-12-23T12:00:00").format("YYYY-MM-DD"),
          end: moment("2018-12-29T12:00:00").format("YYYY-MM-DD")
        },
        events: evntData,
        eventAfterRender: function(event, element, view) {
          $(element).css('width','97%');
        }
      });
      $('#calendar').fullCalendar('removeEvents');
      $('#calendar').fullCalendar('addEventSource', evntData);
      $('#calendar').fullCalendar('rerenderEvents');
    });
  }
 
}
