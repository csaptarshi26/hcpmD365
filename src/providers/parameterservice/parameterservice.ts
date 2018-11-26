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

  public totalStorageVariables: number = 6;

  constructor() {
    console.log('Hello ParameterserviceProvider Provider');

     //needs to be eliminated
  }

}
