import { FileTransfer } from '@ionic-native/file-transfer/ngx';
import { PayslipPage } from './../pages/payslip/payslip';
import { PipesModule } from './../pipes/pipes.module';
import { LeaveView1Page } from './../pages/leave-view1/leave-view1';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { FullCalendarModule } from 'ng-fullcalendar';
import { SwiperModule } from 'ngx-swiper-wrapper';
import { SWIPER_CONFIG } from 'ngx-swiper-wrapper';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';
import { CustomFormsModule } from 'ng2-validation'  
import { MomentModule } from 'ngx-moment';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LoginPage } from '../pages/login/login';
import { MSAdal } from '@ionic-native/ms-adal';
import { AxserviceProvider } from '../providers/axservice/axservice';
import { HttpModule } from '@angular/http';
import { SettingsPage } from '../pages/settings/settings';
import { ProfilePage } from '../pages/profile/profile';
import { StorageserviceProvider } from '../providers/storageservice/storageservice';
import { IonicStorageModule } from '@ionic/storage';
import { ParameterserviceProvider } from '../providers/parameterservice/parameterservice';
import { TimesheetView1Page } from '../pages/timesheet-view1/timesheet-view1';
import { TimesheetView2Page } from '../pages/timesheet-view2/timesheet-view2';
import { TimesheetView3Page } from '../pages/timesheet-view3/timesheet-view3';
import { TimesheetDayPage } from '../pages/timesheet-day/timesheet-day';
import { HTTP } from '@ionic-native/http';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { File } from '@ionic-native/file';
import { FileOpener } from '@ionic-native/file-opener';
import { DocumentViewer } from '@ionic-native/document-viewer/ngx';
const DEFAULT_SWIPER_CONFIG: SwiperConfigInterface = {
  direction: 'horizontal',
  slidesPerView: 'auto'
};
@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    SettingsPage,    
    TimesheetView1Page,
    TimesheetView2Page,
    TimesheetView3Page,
    TimesheetDayPage,
    LeaveView1Page,
    ProfilePage,
    PayslipPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    BrowserAnimationsModule,
    IonicModule.forRoot(MyApp,{tabsPlacement: 'top'}),
    IonicStorageModule.forRoot(),
    FullCalendarModule,
    SwiperModule,
    MomentModule,
    CustomFormsModule,
    PipesModule,
    NgxDaterangepickerMd
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    SettingsPage,
    TimesheetView1Page,
    TimesheetView2Page,
    TimesheetView3Page,
    TimesheetDayPage,
    ProfilePage,
    LeaveView1Page,
    PayslipPage
  ],
  providers: [
    File,
    DocumentViewer,
    FileTransfer,
    FileOpener,
    StatusBar,
    SplashScreen,
    MSAdal,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AxserviceProvider,
    StorageserviceProvider,
    ParameterserviceProvider,
    HTTP,
    {
      provide: SWIPER_CONFIG,
      useValue: DEFAULT_SWIPER_CONFIG
    }
  ]
})
export class AppModule {}
