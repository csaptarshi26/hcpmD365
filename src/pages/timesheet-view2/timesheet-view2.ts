import { TimesheetView3Page } from './../timesheet-view3/timesheet-view3';
import { Component, ComponentRef, ComponentFactoryResolver, ViewContainerRef, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { ModalController } from 'ionic-angular';

/**
 * Generated class for the TimesheetView2Page page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-timesheet-view2',
  templateUrl: 'timesheet-view2.html',
})
export class TimesheetView2Page {
  showDetails: any;
  @ViewChild('viewContainerRef', { read: ViewContainerRef }) VCR: ViewContainerRef;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public modalCtrl: ModalController, public viewCtrl: ViewController, private CFR: ComponentFactoryResolver) {
    this.showDetails = navParams.get('redirected');
  }
  send() {
    let componentFactory = this.CFR.resolveComponentFactory(TimesheetView2Page);
    let componentRef: ComponentRef<TimesheetView2Page> = this.VCR.createComponent(componentFactory);
    let currentComponent = componentRef.instance;
  }
  presentProfileModal() {
    let profileModal = this.modalCtrl.create(TimesheetView3Page);
    profileModal.present();
  }
  onClickCancel() {
    this.viewCtrl.dismiss();
  }
  ionViewDidLoad() {

  }
}
