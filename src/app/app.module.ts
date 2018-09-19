import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

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

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    SettingsPage,
    ProfilePage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    SettingsPage,
    ProfilePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    MSAdal,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AxserviceProvider,
    StorageserviceProvider,
    ParameterserviceProvider
  ]
})
export class AppModule {}
