import { LeaveView1Page } from './../pages/leave-view1/leave-view1';
import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ProfilePage } from '../pages/profile/profile';
import { SettingsPage } from '../pages/settings/settings';
import { TimesheetView1Page } from '../pages/timesheet-view1/timesheet-view1';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = ProfilePage;

  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen) {
    
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Profile',         component: ProfilePage },
      { title: 'Timesheet',       component: TimesheetView1Page },
      { title: 'Leave',           component:LeaveView1Page},
      { title: 'Settings',        component: SettingsPage }
    ];
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
    this.nav.setRoot(page.component);
  }
}
