import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import 'rxjs/Rx';

@Injectable()
export class StorageserviceProvider {

  public D365URL: string;
  public authenticated: boolean;
  private totalStorageVariables: number = 2;

  constructor(private storage: Storage) {
    console.log('Hello StorageserviceProvider Provider');
  }

  getAllValuesFromStorage = Observable.create((observer) => {
    let variables = 0;
    this.storage.get('D365URL').then((data) => {
      this.D365URL = data;
      observer.next(data);
      variables++;
      if(variables == this.totalStorageVariables) {
        observer.complete();
      }
    })
    this.storage.get('authenticated').then((data) => {
      this.authenticated = data;
      observer.next(data);
      variables++;
      if(variables == this.totalStorageVariables) {
        observer.complete();
      }
    })
  })

  setD365URL(D365URL: string) {
    this.storage.set('D365URL', D365URL);
    this.D365URL = D365URL;
  }

  setAuthenticated(authenticated: boolean) {
    this.storage.set('authenticated', authenticated);
    this.authenticated = authenticated;
  }
}
