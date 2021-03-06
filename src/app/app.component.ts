import { PayslipPage } from './../pages/payslip/payslip';
import { ParameterserviceProvider } from './../providers/parameterservice/parameterservice';
import { LeaveView1Page } from './../pages/leave-view1/leave-view1';
import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, ToastController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ProfilePage } from '../pages/profile/profile';
import { SettingsPage } from '../pages/settings/settings';
import { TimesheetView1Page } from '../pages/timesheet-view1/timesheet-view1';
import { StorageserviceProvider } from '../providers/storageservice/storageservice';
import { Events } from 'ionic-angular';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = ProfilePage;

  pages: Array<{ icon:string, title: string, component: any }>;
  authenticated: boolean = false;

  constructor(public platform: Platform, public statusBar: StatusBar, public storageservice: StorageserviceProvider,
    public splashScreen: SplashScreen, private parameterservice: ParameterserviceProvider,
    public events: Events, private toastCtrl: ToastController) {

    this.initializeApp();
    this.setMenuItems();
    // used for an example of ngFor and navigation

  }
  setMenuItems() {
    this.events.subscribe('loggedOut', () =>{ 
      this.authenticated = false;
      this.pages = [
        { icon:'contact', title: 'Profile', component: ProfilePage },
        { icon:'settings', title: 'Settings', component: SettingsPage }
      ];})
    this.events.subscribe('loggedin', () => {
      this.authenticated = true;
      this.pages = [
        { icon:'contact', title: 'Profile', component: ProfilePage },
        { icon:'time', title: 'Timesheet', component: TimesheetView1Page },
        { icon:'bicycle', title: 'Leave', component: LeaveView1Page },
        { icon:'logo-bitcoin', title: 'Payslip',component: PayslipPage},
        { icon:'settings', title: 'Settings', component: SettingsPage },
        { icon:'power', title: 'Logout', component : null}
      ];
    });
    if (!this.authenticated) {
      this.pages = [
        { icon:'contact', title: 'Profile', component: ProfilePage },
        { icon:'settings', title: 'Settings', component: SettingsPage }
      ];
    }
  }
  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.backgroundColorByHexString('#488aff');
      this.statusBar.styleLightContent();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    if(page.component){
      this.nav.setRoot(page.component);
    }else{
      this.logout();
    }
  }

  menuOpened() {
    this.setMenuItems();
  }
  logout() {
    this.events.publish('loggedOut');
    this.parameterservice.authenticated = false;
    this.authenticated = false;
    this.storageservice.setAuthenticated(false);
    this.storageservice.setLoginUser("");
    this.storageservice.setEmployeeId("");
    this.errorToast("Logged out succesfully");
    this.nav.setRoot(ProfilePage);
    
  }
  errorToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      position: 'top',
      duration:3000,
      showCloseButton: true,
      closeButtonText: "Ok"
    });
    toast.present();
  }
}
