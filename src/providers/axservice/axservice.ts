import { Http, RequestOptions, Headers, Response } from '@angular/http';
import { Injectable } from '@angular/core';
import { MSAdal, AuthenticationContext, AuthenticationResult } from '@ionic-native/ms-adal';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import 'rxjs/Rx';
import { StorageserviceProvider } from '../storageservice/storageservice';

@Injectable()
export class AxserviceProvider {

  public user: string;
  public proxyUser = 'erp@salamair.com';
  public token: string;

  constructor(public http: Http, private msAdal: MSAdal,
    public storageservice: StorageserviceProvider) {
    console.log('Hello AxserviceProvider Provider');
  }

  login = Observable.create((observer) => {
    let authContext: AuthenticationContext = this.msAdal.createAuthenticationContext('https://login.windows.net/common');
    authContext.acquireTokenAsync('https://salamair-devaos.sandbox.ax.dynamics.com', 'fe96cad0-da0f-48e9-af8d-124d17ce1e7e', 'https://AuthCRMClient',
     '','')
      .then((authResponse: AuthenticationResult) => {
        if( authResponse.accessToken != '') {
          this.storageservice.setAuthenticated(true);
        } else {
          this.storageservice.setAuthenticated(false);
        }
        this.user = authResponse.userInfo.uniqueId;
        observer.next(authResponse);
      })
      .catch((e: any) => {
        this.storageservice.setAuthenticated(false);
        observer.error(e);
        console.log('Authentication failed', e)
      });
  })

  createProxyUserToken = Observable.create((observer) => {
    let authContext: AuthenticationContext = this.msAdal.createAuthenticationContext('https://login.windows.net/common');
    authContext.acquireTokenSilentAsync('https://salamair-devaos.sandbox.ax.dynamics.com', 'fe96cad0-da0f-48e9-af8d-124d17ce1e7e',
     this.proxyUser)
      .then((authResponse: AuthenticationResult) => {
        this.token = authResponse.accessToken;
        observer.next(authResponse);
        console.log('Proxy user token is ' , authResponse.accessToken);
        console.log('Proxy user token will expire on ', authResponse.expiresOn);
      })
      .catch((e: any) => {
        observer.error(e);
        console.log('Authentication failed', e)
      });
  })

}
