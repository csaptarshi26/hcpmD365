import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import 'rxjs/Rx';
import { ParameterserviceProvider } from '../parameterservice/parameterservice';
import { DateTime } from 'ionic-angular';

@Injectable()
export class StorageserviceProvider {

  

  constructor(private storage: Storage, private parameterservice: ParameterserviceProvider) {
    console.log('Hello StorageserviceProvider Provider');
  }

  getAllValuesFromStorage = Observable.create((observer) => {
    let variables = 0;
    this.storage.get('D365URL').then((data) => {
      this.parameterservice.D365URL = data;
      observer.next(data);
      variables++;
      if(variables == this.parameterservice.totalStorageVariables) {
        observer.complete();
      }
    })
    this.storage.get('authenticated').then((data) => {
      this.parameterservice.authenticated = data;
      observer.next(data);
      variables++;
      if(variables == this.parameterservice.totalStorageVariables) {
        observer.complete();
      }
    })
    this.storage.get('user').then((data) => {
      this.parameterservice.user = data;
      observer.next(data);
      variables++;
      if(variables == this.parameterservice.totalStorageVariables) {
        observer.complete();
      }
    })
    this.storage.get('token').then((data) => {
      this.parameterservice.token = data;
      observer.next(data);
      variables++;
      if(variables == this.parameterservice.totalStorageVariables) {
        observer.complete();
      }
    })
    this.storage.get('tokenExpiryDateTime').then((data) => {
      this.parameterservice.tokenExpiryDateTime = data;
      observer.next(data);
      variables++;
      if(variables == this.parameterservice.totalStorageVariables) {
        observer.complete();
      }
    })
    this.storage.get('employeeId').then((data) => {
      this.parameterservice.employeeId = data;
      observer.next(data);
      variables++;
      if(variables == this.parameterservice.totalStorageVariables) {
        observer.complete();
      }
    })
  })

  setD365URL(D365URL: string) {
    this.storage.set('D365URL', D365URL);
    this.parameterservice.D365URL = D365URL;
  }

  setAuthenticated(authenticated: boolean) {
    this.storage.set('authenticated', authenticated);
    this.parameterservice.authenticated = authenticated;
  }

  setLoginUser(user: string) {
    this.storage.set('user', user);
    this.parameterservice.user = user;
  }

  setToken(token: string) {
    this.storage.set('token', token);
    this.parameterservice.token = token;
  }

  setTokenExpiryDateTime(tokenExpiryDateTime: Date) {
    this.storage.set('tokenExpiryDateTime', tokenExpiryDateTime);
    this.parameterservice.tokenExpiryDateTime = tokenExpiryDateTime;
  }

  setEmployeeId(employeeId: string) {
    this.storage.set('employeeId', employeeId);
    this.parameterservice.employeeId = employeeId;
  }
}
