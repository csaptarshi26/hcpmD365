import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Loading } from 'ionic-angular';
import { AxserviceProvider } from '../../providers/axservice/axservice';
import { ParameterserviceProvider } from '../../providers/parameterservice/parameterservice';
import { StorageserviceProvider } from '../../providers/storageservice/storageservice';
import * as moment from 'moment';
import { CalendarComponent } from 'ng-fullcalendar';
import { Options } from 'fullcalendar';
@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  public user: string;
  public authenticated: boolean;

  calendarOptions: Options;
  eventData: any[];
  @ViewChild(CalendarComponent) ucCalendar: CalendarComponent;

 
  constructor(public navCtrl: NavController, public navParams: NavParams,
    private axservice: AxserviceProvider, public loadingCtrl: LoadingController,
    private parameterservice: ParameterserviceProvider, public storageservice: StorageserviceProvider) {
     
    
     
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

 
}
