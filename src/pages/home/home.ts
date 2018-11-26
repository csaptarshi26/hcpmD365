import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { StorageserviceProvider } from '../../providers/storageservice/storageservice';
import { AxserviceProvider } from '../../providers/axservice/axservice';
import { LoginPage } from '../login/login';
import { ParameterserviceProvider } from '../../providers/parameterservice/parameterservice';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController, private parameterservice: ParameterserviceProvider, 
    public storageservice: StorageserviceProvider, public axservice: AxserviceProvider,
    public loadingCtrl: LoadingController) {
      
      this.initializeStorageVariables();  
  }

  ionViewDidLoad() {
    
  }

  initializeStorageVariables() {
    let loading = this.loadingCtrl.create({
      spinner: 'dots',
      content: 'Please wait'
    });
    loading.present();
    this.storageservice.getAllValuesFromStorage.subscribe((data) => {
      console.log('Get value from storage ' + data);
    }, (error) => {
      loading.dismiss();
      console.log('Get value from storage - error ' + error);
    }, () => {
      loading.dismiss();
      console.log('Get value from storage - complete');
      this.navigatingToLogin();
    });
  }

  navigatingToLogin() {
    if(this.parameterservice.authenticated == true) {
      let loading = this.loadingCtrl.create({
        spinner: 'dots',
        content: 'Please wait'
      });
      loading.present();
      this.axservice.createProxyUserToken.subscribe((data) => {
        loading.dismiss();
        console.log('User token ' + data.accessToken);
      }, (error) => {
        loading.dismiss();
        console.log('Generating token error' + error);
      })
    } else {
      console.log('Navigating to Login page');
      this.navCtrl.push(LoginPage);
    }
  }

}
