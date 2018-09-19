import { Http, RequestOptions, Headers, Response } from '@angular/http';
import { Injectable } from '@angular/core';
import { MSAdal, AuthenticationContext, AuthenticationResult } from '@ionic-native/ms-adal';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import 'rxjs/Rx';
import { StorageserviceProvider } from '../storageservice/storageservice';
import { ParameterserviceProvider } from '../parameterservice/parameterservice';

@Injectable()
export class AxserviceProvider {

  constructor(public http: Http, private msAdal: MSAdal,
    private storageservice: StorageserviceProvider, private parameterservice: ParameterserviceProvider) {
    console.log('Hello AxserviceProvider Provider');
  }

  login = Observable.create((observer) => {
    let authContext: AuthenticationContext = this.msAdal.createAuthenticationContext('https://login.windows.net/common');
    authContext.acquireTokenAsync(this.parameterservice.D365URL, 'fe96cad0-da0f-48e9-af8d-124d17ce1e7e', 'https://AuthCRMClient',
     '','')
      .then((authResponse: AuthenticationResult) => {
        if( authResponse.accessToken != '') {
          this.storageservice.setAuthenticated(true);
          this.storageservice.setLoginUser(authResponse.userInfo.uniqueId);
        } else {
          this.storageservice.setAuthenticated(false);
          this.storageservice.setLoginUser('');
        }
        observer.next(authResponse);
      })
      .catch((e: any) => {
        this.storageservice.setAuthenticated(false);
        this.storageservice.setLoginUser('');
        observer.error(e);
        console.log('Authentication failed', e)
      });
  })

  createProxyUserToken = Observable.create((observer) => {
    let authContext: AuthenticationContext = this.msAdal.createAuthenticationContext('https://login.windows.net/common');
    authContext.acquireTokenSilentAsync(this.parameterservice.D365URL, 'fe96cad0-da0f-48e9-af8d-124d17ce1e7e',
     this.parameterservice.proxyUser)
      .then((authResponse: AuthenticationResult) => {
        this.storageservice.setToken(authResponse.accessToken);
        this.storageservice.setTokenExpiryDateTime(authResponse.expiresOn);
        observer.next(authResponse);
        console.log('Proxy user token is ' , authResponse.accessToken);
        console.log('Proxy user token will expire on ', authResponse.expiresOn);
      })
      .catch((e: any) => {
        this.storageservice.setToken('');
        observer.error(e);
        console.log('Authentication failed', e)
      });
  })

}
