import { Injectable } from '@angular/core';
import { DateTime } from 'ionic-angular';

@Injectable()
export class ParameterserviceProvider {

  public D365URL: string;
  public authenticated: boolean;
  public user: string;
  public proxyUser = 'erp@salamair.com';
  public token: string;
  public tokenExpiryDateTime: Date;
  public employeeId: string;
  public colorList:any=[];
  public totalStorageVariables: number = 6;

  constructor() {
    console.log('Hello ParameterserviceProvider Provider');
    this.colorList=[];
    this.colorList.push(
      {bgColor:'#7EB6FF', textColor:'#ffffff'},
      {bgColor:'#ea5d5d', textColor:'#ffffff'},
      {bgColor:'#5dea8a', textColor:'#ffffff'},
      {bgColor:'#b9886a', textColor:'#ffffff'},
      {bgColor:'#8097b0', textColor:'#ffffff'},
      {bgColor:'#DB7093', textColor:'#FFFFFF'},
      {bgColor:'#B452CD', textColor:'#FFFFFF'},
      {bgColor:'#c343e2', textColor:'#FFFFFF'},
      {bgColor:'#2bafb0', textColor:'#FFFFFF'},
      {bgColor:'#b02b9f', textColor:'#FFFFFF'},
    )
  }

}
