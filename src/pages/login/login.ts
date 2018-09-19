import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Loading } from 'ionic-angular';
import { AxserviceProvider } from '../../providers/axservice/axservice';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private axservice: AxserviceProvider, public loadingCtrl: LoadingController) {
      
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
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
    }, (error) => {
      loading.dismiss();
      console.log('Login - error ' + error);
    });
  }  

}
