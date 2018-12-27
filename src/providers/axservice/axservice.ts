import { Http, RequestOptions, Headers, Response } from '@angular/http';
import { Injectable } from '@angular/core';
import { MSAdal, AuthenticationContext, AuthenticationResult } from '@ionic-native/ms-adal';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import 'rxjs/Rx';
import { StorageserviceProvider } from '../storageservice/storageservice';
import { ParameterserviceProvider } from '../parameterservice/parameterservice';
import { timesheetTableContact } from '../../models/timesheet/tsTableContract.interface';

@Injectable()
export class AxserviceProvider {

  constructor(public http: Http, private msAdal: MSAdal,
    private storageservice: StorageserviceProvider, private parameterservice: ParameterserviceProvider) {
    console.log('Hello AxserviceProvider Provider');
  }

  login = Observable.create((observer) => {
    //---------------
    this.storageservice.setD365URL('https://salamair-devaos.sandbox.ax.dynamics.com');
    this.parameterservice.D365URL = 'https://salamair-devaos.sandbox.ax.dynamics.com';
    //---------------
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

  getWorkerDetails(user: string): Observable<any>{
    let url = this.parameterservice.D365URL + '/api/services/AFZCRMServiceGroup/AFZCRMService/GetEmpPersonalDetails';
    let body = {_empId: user};
    let headers = new Headers({'Content-Type': 'application/Json', 'Authorization': 'Bearer '+this.parameterservice.token});
    let options = new RequestOptions({headers: headers});
    return this.http.post(url, JSON.stringify(body), options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getWorkerTimesheetPeriods(user: string): Observable<any>{
    let url = this.parameterservice.D365URL + '/api/services/AFZCRMServiceGroup/AFZCRMService/getWorkerTimesheetPeriods';
    let body = {_empId: user};
    let headers = new Headers({'Content-Type': 'application/Json', 'Authorization': 'Bearer '+this.parameterservice.token});
    let options = new RequestOptions({headers: headers});
    return this.http.post(url, JSON.stringify(body), options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getWorkerTimesheet(user: string, periodDate: Date): Observable<any>{
    let url = this.parameterservice.D365URL + '/api/services/AFZCRMServiceGroup/AFZCRMService/getEmplTSDetails';
    let body = {_empId: user, _periodDate: periodDate};
    let headers = new Headers({'Content-Type': 'application/Json', 'Authorization': 'Bearer '+this.parameterservice.token});
    let options = new RequestOptions({headers: headers});
    return this.http.post(url, JSON.stringify(body), options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getWorkerTimesheetProject(): Observable<any>{
    let url = this.parameterservice.D365URL + '/api/services/AFZCRMServiceGroup/AFZCRMService/getWorkerTimesheetProject';
    let body = {};
    let headers = new Headers({'Content-Type': 'application/Json', 'Authorization': 'Bearer '+this.parameterservice.token});
    let options = new RequestOptions({headers: headers});
    return this.http.post(url, JSON.stringify(body), options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getWorkerTimesheetActivity(projId: string): Observable<any>{
    let url = this.parameterservice.D365URL + '/api/services/AFZCRMServiceGroup/AFZCRMService/getWorkerTimesheetActivity';
    let body = {_projId: projId};
    let headers = new Headers({'Content-Type': 'application/Json', 'Authorization': 'Bearer '+this.parameterservice.token});
    let options = new RequestOptions({headers: headers});
    return this.http.post(url, JSON.stringify(body), options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getWorkerTimesheetCategory(): Observable<any>{
    let url = this.parameterservice.D365URL + '/api/services/AFZCRMServiceGroup/AFZCRMService/getWorkerTimesheetCategory';
    let body = {};
    let headers = new Headers({'Content-Type': 'application/Json', 'Authorization': 'Bearer '+this.parameterservice.token});
    let options = new RequestOptions({headers: headers});
    return this.http.post(url, JSON.stringify(body), options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  updateWorkerTimesheet(timesheetTableContact: timesheetTableContact): Observable<any>{
    let url = this.parameterservice.D365URL + '/api/services/AFZCRMServiceGroup/AFZCRMService/updateEmplTSDetails';
    let body = {_timesheetTableContract: timesheetTableContact};
    let headers = new Headers({'Content-Type': 'application/Json', 'Authorization': 'Bearer '+this.parameterservice.token});
    let options = new RequestOptions({headers: headers});
    return this.http.post(url, JSON.stringify(body), options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  submitWorkerTimesheet(timesheetTableContact: timesheetTableContact, comments: string): Observable<any>{
    let url = this.parameterservice.D365URL + '/api/services/AFZCRMServiceGroup/AFZCRMService/submitEmplTimesheet';
    let body = {_timesheetTableContract: timesheetTableContact, _comments: comments};
    let headers = new Headers({'Content-Type': 'application/Json', 'Authorization': 'Bearer '+this.parameterservice.token});
    let options = new RequestOptions({headers: headers});
    return this.http.post(url, JSON.stringify(body), options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  private extractData(res: Response) { 
    return res.json() || { };
  }

  private handleError (error: Response | any) { 
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  } 

}
