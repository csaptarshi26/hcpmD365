import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Loading } from 'ionic-angular';
import { AxserviceProvider } from '../../providers/axservice/axservice';
import { ParameterserviceProvider } from '../../providers/parameterservice/parameterservice';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  public user: string;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private axservice: AxserviceProvider, public loadingCtrl: LoadingController,
    private parameterservice: ParameterserviceProvider) {
      
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
    this.user = this.parameterservice.user;
  }

  login() {
    let loading = this.loadingCtrl.create({
      spinner: 'dots',
      content: 'Please wait'
    });
    loading.present();
    this.axservice.login.subscribe((data) => {
      loading.dismiss();
      console.log('Login '+ data);
      this.user = this.parameterservice.user;
    }, (error) => {
      loading.dismiss();
      console.log('Login - error ' + error);
    });
  }  

}
