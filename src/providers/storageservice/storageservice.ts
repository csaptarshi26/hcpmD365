import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';
import { ParameterserviceProvider } from '../parameterservice/parameterservice';

@Injectable()
export class StorageserviceProvider {

  constructor(private storage: Storage, private parameterservice: ParameterserviceProvider) {
    console.log('Hello StorageserviceProvider Provider');
  }

  getAllValuesFromStorage = Observable.create((observer) => {
    let variables = 0;
    this.storage.get('hcpmD365URL').then((data) => {
      this.parameterservice.D365URL = data;
      observer.next(data);
      variables++;
      if(variables == this.parameterservice.totalStorageVariables) {
        observer.complete();
      }
    })
    this.storage.get('hcpmAuthenticated').then((data) => {
      this.parameterservice.authenticated = data;
      observer.next(data);
      variables++;
      if(variables == this.parameterservice.totalStorageVariables) {
        observer.complete();
      }
    })
    this.storage.get('hcpmUser').then((data) => {
      this.parameterservice.user = data;
      observer.next(data);
      variables++;
      if(variables == this.parameterservice.totalStorageVariables) {
        observer.complete();
      }
    })
    this.storage.get('hcpmToken').then((data) => {
      this.parameterservice.token = data;
      observer.next(data);
      variables++;
      if(variables == this.parameterservice.totalStorageVariables) {
        observer.complete();
      }
    })
    this.storage.get('hcpmTokenExpiryDateTime').then((data) => {
      this.parameterservice.tokenExpiryDateTime = data;
      observer.next(data);
      variables++;
      if(variables == this.parameterservice.totalStorageVariables) {
        observer.complete();
      }
    })
    this.storage.get('hcpmEmployeeId').then((data) => {
      this.parameterservice.employeeId = data;
      observer.next(data);
      variables++;
      if(variables == this.parameterservice.totalStorageVariables) {
        observer.complete();
      }
    })
  })

  setD365URL(D365URL: string) {
    this.storage.set('hcpmD365URL', D365URL);
    this.parameterservice.D365URL = D365URL;
  }

  setAuthenticated(authenticated: boolean) {
    this.storage.set('hcpmAuthenticated', authenticated);
    this.parameterservice.authenticated = authenticated;
  }

  setLoginUser(user: string) {
    this.storage.set('hcpmUser', user);
    this.parameterservice.user = user;
  }

  setToken(token: string) {
    this.storage.set('hcpmToken', token);
    this.parameterservice.token = token;
  }

  setTokenExpiryDateTime(tokenExpiryDateTime: Date) {
    this.storage.set('hcpmTokenExpiryDateTime', tokenExpiryDateTime);
    this.parameterservice.tokenExpiryDateTime = tokenExpiryDateTime;
  }

  setEmployeeId(employeeId: string) {
    this.storage.set('hcpmEmployeeId', employeeId);
    this.parameterservice.employeeId = employeeId;
  }

  //hcpmEmployeeName
  //hcpmEmployeeImage
  //hcpmEmployeeEmail
  //hcpmEmployeePhone
}
