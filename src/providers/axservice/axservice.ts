import { LeaveAppTableContract } from './../../models/leave/leaveAppTableContact.interface';
import { Http, RequestOptions, Headers, Response } from '@angular/http';
import { Injectable } from '@angular/core';
import { MSAdal, AuthenticationContext, AuthenticationResult } from '@ionic-native/ms-adal';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import 'rxjs/Rx';
import { StorageserviceProvider } from '../storageservice/storageservice';
import { ParameterserviceProvider } from '../parameterservice/parameterservice';
import { TimesheetTableContact } from '../../models/timesheet/tsTableContract.interface';
import { HTTP } from '@ionic-native/http';

@Injectable()
export class AxserviceProvider {

  constructor(public http: Http, private msAdal: MSAdal,
    private storageservice: StorageserviceProvider, private parameterservice: ParameterserviceProvider,
    private hTTP: HTTP) {
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
        // console.log('Proxy user token is ' , authResponse.accessToken);
        // console.log('Proxy user token will expire on ', authResponse.expiresOn);
      })
      .catch((e: any) => {
        this.storageservice.setToken('');
        observer.error(e);
        console.log('Authentication failed', e)
      });
  })

  getWorkerDetails(user: string): Observable<any>{
    var service = Observable.create((observer) => {
      let url = this.parameterservice.D365URL + '/api/services/AFZCRMServiceGroup/AFZCRMService/GetEmpPersonalDetails';
      this.hTTP.setDataSerializer( "utf8" );
      let body = {_empId: user};
      this.hTTP.post(url, JSON.stringify(body), {"Content-Type": "application/json","Authorization": "Bearer "+this.parameterservice.token}).then( data => {      
        observer.next(JSON.parse(data.data));
      }).catch( error => {
        observer.error(error);
      });
    });
    return service;
  }

  getWorkerTimesheetPeriods(user: string): Observable<any>{
    var service = Observable.create((observer) => {
      let url = this.parameterservice.D365URL + '/api/services/AFZCRMServiceGroup/AFZCRMService/getWorkerTimesheetPeriods';
      this.hTTP.setDataSerializer( "utf8" );
      let body = {_empId: user};
      this.hTTP.post(url, JSON.stringify(body), {"Content-Type": "application/json","Authorization": "Bearer "+this.parameterservice.token}).then( data => {      
        observer.next(JSON.parse(data.data));
      }).catch( error => {
        observer.error(error);
      });
    });
    return service;
  }
  
  getWorkerTimesheet(user: string, periodDate: Date): Observable<any> {
    var service = Observable.create((observer) => {
      let url = this.parameterservice.D365URL + '/api/services/AFZCRMServiceGroup/AFZCRMService/getEmplTSDetails';
      this.hTTP.setDataSerializer( "utf8" );
      let body = {_empId: user, _periodDate: periodDate};
      this.hTTP.post(url, JSON.stringify(body), {"Content-Type": "application/json","Authorization": "Bearer "+this.parameterservice.token}).then( data => {      
        observer.next(JSON.parse(data.data));
      }).catch( error => {
        observer.error(error);
      });
    });
    return service;
  }  

  getWorkerTimesheetProject(): Observable<any>{
    var service = Observable.create((observer) => {
      let url = this.parameterservice.D365URL + '/api/services/AFZCRMServiceGroup/AFZCRMService/getWorkerTimesheetProject';
      this.hTTP.setDataSerializer( "json" );      
      this.hTTP.post(url, {}, {"Content-Type": "application/json","Authorization": "Bearer "+this.parameterservice.token}).then( data => {      
        observer.next(JSON.parse(data.data));
      }).catch( error => {
        observer.error(error);
      });
    });
    return service;
  }

  getWorkerTimesheetActivity(projId: string): Observable<any>{
    var service = Observable.create((observer) => {
      let url = this.parameterservice.D365URL + '/api/services/AFZCRMServiceGroup/AFZCRMService/getWorkerTimesheetActivity';
      this.hTTP.setDataSerializer( "utf8" );
      let body = {_projId: projId};
      this.hTTP.post(url, JSON.stringify(body), {"Content-Type": "application/json","Authorization": "Bearer "+this.parameterservice.token}).then( data => {      
        observer.next(JSON.parse(data.data));
      }).catch( error => {
        observer.error(error);
      });
    });
    return service;
  }

  getWorkerTimesheetCategory(): Observable<any>{
    var service = Observable.create((observer) => {
      let url = this.parameterservice.D365URL + '/api/services/AFZCRMServiceGroup/AFZCRMService/getWorkerTimesheetCategory';
      this.hTTP.setDataSerializer( "json" );      
      this.hTTP.post(url, {}, {"Content-Type": "application/json","Authorization": "Bearer "+this.parameterservice.token}).then( data => {      
        observer.next(JSON.parse(data.data));
      }).catch( error => {
        observer.error(error);
      });
    });
    return service;
  }

  updateWorkerTimesheet(TimesheetTableContact: TimesheetTableContact): Observable<any>{
    var service = Observable.create((observer) => {
      let url = this.parameterservice.D365URL + '/api/services/AFZCRMServiceGroup/AFZCRMService/updateEmplTSDetails';
      this.hTTP.setDataSerializer( "utf8" );
      let body = {_timesheetTableContract: TimesheetTableContact};
      this.hTTP.post(url, JSON.stringify(body), {"Content-Type": "application/json","Authorization": "Bearer "+this.parameterservice.token}).then( data => {      
        observer.next(JSON.parse(data.data));
      }).catch( error => {
        observer.error(error);
      });
    });
    return service;
  }

  submitWorkerTimesheet(TimesheetTableContact: TimesheetTableContact, comments: string): Observable<any>{
    var service = Observable.create((observer) => {
      let url = this.parameterservice.D365URL + '/api/services/AFZCRMServiceGroup/AFZCRMService/submitEmplTimesheet';
      this.hTTP.setDataSerializer( "utf8" );
      let body = {_timesheetTableContract: TimesheetTableContact, _comments: comments};
      this.hTTP.post(url, JSON.stringify(body), {"Content-Type": "application/json","Authorization": "Bearer "+this.parameterservice.token}).then( data => {      
        observer.next(JSON.parse(data.data));
      }).catch( error => {
        observer.error(error);
      });
    });
    return service;
  }

  getWorkerLeaveAppl(user: string): Observable<any> {
    var service = Observable.create((observer) => {
      let url = this.parameterservice.D365URL + '/api/services/AFZCRMServiceGroup/AFZCRMService/getEmplLeaveAppl';
      this.hTTP.setDataSerializer( "utf8" );
      let body = {_empId: user};
      this.hTTP.post(url, JSON.stringify(body), {"Content-Type": "application/json","Authorization": "Bearer "+this.parameterservice.token}).then( data => {      
        observer.next(JSON.parse(data.data));
      }).catch( error => {
        observer.error(error);
      });
    });
    return service;
  } 
  
  updateEmplLeaveAppl(contract: LeaveAppTableContract): Observable<any> {
    var service = Observable.create((observer) => {
      let url = this.parameterservice.D365URL + '/api/services/AFZCRMServiceGroup/AFZCRMService/updateEmplLeaveAppl';
      this.hTTP.setDataSerializer( "utf8" );
      let body = {_contract: contract};
      this.hTTP.post(url, JSON.stringify(body), {"Content-Type": "application/json","Authorization": "Bearer "+this.parameterservice.token}).then( data => {      
        observer.next(JSON.parse(data.data));
      }).catch( error => {
        observer.error(error);
      });
    });
    return service;
  } 

  submitEmplLeaveAppl(contract: LeaveAppTableContract, comments: string): Observable<any> {
    var service = Observable.create((observer) => {
      let url = this.parameterservice.D365URL + '/api/services/AFZCRMServiceGroup/AFZCRMService/submitEmplLeaveAppl';
      this.hTTP.setDataSerializer( "utf8" );
      let body = {_contract: contract, _comments: comments};
      this.hTTP.post(url, JSON.stringify(body), {"Content-Type": "application/json","Authorization": "Bearer "+this.parameterservice.token}).then( data => {      
        observer.next(JSON.parse(data.data));
      }).catch( error => {
        observer.error(error);
      });
    });
    return service;
  } 

  getEmplLeaveBalance(user: string): Observable<any> {
    var service = Observable.create((observer) => {
      let url = this.parameterservice.D365URL + '/api/services/AFZCRMServiceGroup/AFZCRMService/getEmpLeaveBalance';
      this.hTTP.setDataSerializer( "utf8" );
      let body = {_empId: user};
      this.hTTP.post(url, JSON.stringify(body), {"Content-Type": "application/json","Authorization": "Bearer "+this.parameterservice.token}).then( data => {      
        observer.next(JSON.parse(data.data));
      }).catch( error => {
        observer.error(error);
      });
    });
    return service;
  } 

  getEmplSalaryRegister(user: string, date: Date): Observable<any> {
    var service = Observable.create((observer) => {
      let url = this.parameterservice.D365URL + '/api/services/AFZCRMServiceGroup/AFZCRMService/getWorkerSalaryRegister';
      this.hTTP.setDataSerializer( "utf8" );
      let body = {_empId: user, _date: date};
      this.hTTP.post(url, JSON.stringify(body), {"Content-Type": "application/json","Authorization": "Bearer "+this.parameterservice.token}).then( data => {      
        observer.next(JSON.parse(data.data));
      }).catch( error => {
        observer.error(error);
      });
    });
    return service;
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
