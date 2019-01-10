import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { LeaveBalanceContract } from './../../models/leave/leaveBalanceContract.interface';
import { SalaryContract } from './../../models/worker/workerSalary.interface';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { AxserviceProvider } from '../../providers/axservice/axservice';
import { ParameterserviceProvider } from '../../providers/parameterservice/parameterservice';
import { Worker } from '../../models/worker/worker.interface';
import { StorageserviceProvider } from '../../providers/storageservice/storageservice';
import * as moment from 'moment'

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  worker: Worker;
  SalaryContract: SalaryContract;
  toggleDetails: any;
  leaveBalance: LeaveBalanceContract;
  authenticated: Boolean;

  imgSrc: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController,
    private axservice: AxserviceProvider, private parameterservice: ParameterserviceProvider, private sanitizer: DomSanitizer,
    private toastCtrl: ToastController, public storageservice: StorageserviceProvider) {

    this.toggleDetails =
      {
        job: { value: false, icon: 'arrow-dropdown' },
        address: { value: false, icon: 'arrow-dropdown' },
        personal: { value: false, icon: 'arrow-dropdown' },
        document: { value: false, icon: 'arrow-dropdown' },
        leave: { value: false, icon: 'arrow-dropdown' }
      }
  }
  toggleCard(data) {
    if (data.value) {
      data.value = false;
      data.icon = 'arrow-dropdown';
    } else {
      data.value = true;
      data.icon = 'arrow-dropup';
    }
  }
  ionViewDidLoad() {
    this.initializeStorageVariables();
  }

  getLeaveBalanceDetails() {
    this.axservice.getEmplLeaveBalance(this.parameterservice.user).subscribe(
      res => {
        this.leaveBalance = res;
      }, error => {
        console.log(error);
      });
  }
  checkDate(res){
    if(moment(res.JoiningDate).format("YYYY-MM-DD")===moment('1900-01-01').format("YYYY-MM-DD")){
      res.joiningDate="";
    }
    if(moment(res.DateOfBirth).format("YYYY-MM-DD")===moment('1900-01-01').format("YYYY-MM-DD")){
      res.DateOfBirth="";
    }
    if(moment(res.AnniversaryDate).format("YYYY-MM-DD")===moment('1900-01-01').format("YYYY-MM-DD")){
      res.AnniversaryDate="";
    }
    if(moment(res.PassportIssueDate).format("YYYY-MM-DD")===moment('1900-01-01').format("YYYY-MM-DD")){
      res.PassportIssueDate="";
    }
    if(moment(res.PassportExpiry).format("YYYY-MM-DD")===moment('1900-01-01').format("YYYY-MM-DD")){
      res.PassportExpiry="";
    }
    if(moment(res.CivilIdExpiry).format("YYYY-MM-DD")===moment('1900-01-01').format("YYYY-MM-DD")){
      res.DateOfBirth="";
    }
    if(moment(res.VisaExpiry).format("YYYY-MM-DD")===moment('1900-01-01').format("YYYY-MM-DD")){
      res.DateOfBirth="";
    }
    return res;
  }
  getWorkerDetails() {
    let loading = this.loadingCtrl.create({
      spinner: 'circles',
      content: 'Please wait...'
    });
    loading.present();
    this.axservice.getWorkerDetails(this.parameterservice.user).subscribe(res => {
      loading.dismiss();
      this.worker = Object(Array(this.checkDate(res)));
      this.imgSrc = res.Image;
    }, (error) => {
      loading.dismiss();
      this.errorToast("Error while connecting to server");
    })
  }

  showPayslip() {
    this.navCtrl.push('PayslipPage',{joiningDate:this.worker[0].JoiningDate});
  }

  errorToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      position: 'top',
      showCloseButton: true,
      closeButtonText: "Ok"
    });
    toast.present();
  }

  initializeStorageVariables() {
    let loading = this.loadingCtrl.create({
      spinner: 'dots',
      content: 'Please wait'
    });
    loading.present();
    this.storageservice.getAllValuesFromStorage.subscribe((data) => {
      console.log('Get value from storage ' + data);
    }, (error) => {
      loading.dismiss();
      console.log('Get value from storage - error ' + error);
      this.navigatingToLogin();
    }, () => {
      loading.dismiss();
      console.log('Get value from storage - complete');
      this.navigatingToLogin();
    });
  }

  navigatingToLogin() {
    this.authenticated = this.parameterservice.authenticated;
    if (this.authenticated == true) {

      this.getWorkerDetails();
      this.getLeaveBalanceDetails();

      this.axservice.createProxyUserToken.subscribe((data) => {

        console.log('User token ' + data.accessToken);
      }, (error) => {

        console.log('Generating token error' + error);
      })
    } else {
      console.log('Navigating to Login page');
      this.callAADLogin();
    }
  }

  callAADLogin() {
    this.axservice.login.subscribe((data) => {
      console.log('Login ' + data);

      this.axservice.createProxyUserToken.subscribe((data) => {

        this.authenticated = this.parameterservice.authenticated;
        this.getWorkerDetails();
        this.getLeaveBalanceDetails();
      }, (error) => {

      })
    }, (error) => {
      console.log('Login - error ' + error);
    });

  }

  login() {
    this.callAADLogin();
  }
  logout() {

    this.authenticated = false;
    this.storageservice.setAuthenticated(false);
    this.storageservice.setLoginUser("");
    this.storageservice.setEmployeeId("");

    this.errorToast("Logged out succesfully");
  }


  public getImageStr() {
    if (this.imgSrc == null) {
      return "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBw8SDw8TEw8NFRIXDRYVFxcVFQ8NFRUVFRUWFhUbExUYHSggGBolGxUWITEhJSkrLi4uFx8zODMtNygtLisBCgoKDg0OFxAQGjAdHx0tKy0tLTErLS0tLy0tLS0rLS0tLS0tLi0tKy0tLS0rLS0rLS0tLS0tLS0tLSstKy0tLf/AABEIAOEA4QMBEQACEQEDEQH/xAAbAAEAAgMBAQAAAAAAAAAAAAAAAQYCBQcDBP/EAEMQAAECAwQGBQkGBQQDAAAAAAEAAgMRMQQhYXEFBhJBUfATIoGRsQcyUnKCkqHB8RQjQmKywhZDotHhY2ST0jM0VP/EABoBAQADAQEBAAAAAAAAAAAAAAABBAUDAgb/xAAyEQEAAgECAgYJBQEBAQAAAAAAAQIDBBEhMQUSQVFxsRMyUmGBkaHR8BUiQsHh8TMj/9oADAMBAAIRAxEAPwDt6BPggE7ggE7t6ATLNAJlmgTlVAnvKADvKDV2/WGywZ7cZsx+Fv3ju0Cnau+PTZcnKFfJqsWPha3FXrZr+KQoBI4xHBv9LZ+KuU6On+VvkpZOk4/hX5tPadc7c+j4bB+Rg8XTVmuhwx2b/FVtr809u3w++7XRdO2x1bTaOx7mfpku0afFHKsfJxnUZZ52n5/Z87rfHP8APjnOJEPzXv0dPZj5PHpL+1PzkFvjCkaP77x809HTuj5HpL+1Pzl7wtNWttLTaO173fAkrxODFPOsfJ6rqMscrT8332fXC3MrFa/B7Gn4iRXK2iwz2bO1ddnjt38Ybix6/n+bZwcYbpdzXf3Va/R0fxt8/wA/pap0nP8AKvy/P7WDR+tFji0jBrvRf92cgTcTkVUyaTLTnG/guY9Zhvynbx4NwDvVZaAe5ABnkgAzyQJ8EAncEAncKoBPegmaAgg8EEYD6IFLhXmqBTNApmgUvNeaIGJ+iCu6Z1us8EkN+9iDc09Vp/M/jgJq5h0V78Z4Qo59djx8K/un87VL0prJarRMOiFrPQZNje3ee0rTxaXHj5Rv4svLq8uThM7eDUBWeatyEBQCApBQCkEBQCkbHRmnLTAl0cQ7I/A7rs9007JLhl0+PJ60fd2xanJi9Wfh2LnofXSDFk2MOidxrDJz/D23YrNzaC9eNOMfVq4ekKW4X/bP0WgODhcerxG/LBUGgmtwQMB9EClwQKZoFMSgkCVaoJQQTuCCKXCvNUCmaBTNApea80QfJpLSUGzs6SK8AbhUk8GjeV0xYrZJ2rDnlzUxV3tLnentaY9om0ThwvRBvcPzu35C7NbODSUxcZ4yxNRrb5eEcI/ObQq2piHIQFAICkFAKQQFAICkFAINtoTWGPZjJrtqHO9jqeyfwnLuXDPpqZefCe9Ywaq+Hlxju/OTo2htNQbSycMycB1mm5zezeMQsXNgvina3zbmDUUzRvX5NjS4Li7lM0CmJQKXmvNEEgbyglBBPCqCKZoFM0Cl5rzRBqNYdPQ7KybutFI6jAfi7gMe5WNPprZp7o71bU6muGO+Z5Q5lpG3xY8QxIri527cGjg0bgtzHjrjrtWNmBky2yW3tO8vmXt4FJyFAICApBQCkEBQCApBQCApBB62W0vhPa+G5zXihHN4wXm1YtHVmN4eqXtWetE7S6RqxrKy0DYcA2OBeKB/Et/ssXU6WcXGOMNzS6uM0bTwt5+CwUxKprpS815ogYlBIG8oJmggmWaCKZoFLzXmiDUax6cZZYe0ZOiumGM+bsB/hWNNp5zW90c1bU6mMNe+Z5Q5darS+K90SI4uc4zJPNwwW9SkViIjhEPn73te0zM7zLyXp5FByFIKAQFIKAUggKAQFIKAQFIICAgyhvLSHNJDgZggyIIoQdyiYiY2kiZid44Olap6xC0N2IkhHaL922OLRx4jkYmq0vop60cp+je0erjNHVt60fVYcSqa6YlBIvv3IMpoMSZZoIpea80QfJpXSDLPBfFiUAuG8k0AxK6Ysc5LRWHPNlripNpcm0lbokeK6LEPWJpuaNwGAX0GPHXHWKx2Pm8uS2S02nnL5l0eBQchSCgEBSCgFI9bLZYkR2yxj3u4NBd3yovNr1pG9p2eqUtedqxu3cHU23OEyyGz1nt/bNVZ12GO3f4LVdBnns2+KYupduAnswnYNeP3AKI12Ge+Pgmej80d0/FprbYI0IyiwojOG0CAcjQ9is0yUvxrO6rfHfHwtGz517eBAUggICAoBB6WeO+G9r2uLXtdMEbiotWLRMW5SmtprMTXnDq2r2mGWqCIlweLnt9F2GBqP8LA1GCcV9uzsfRabPGam/b2tnW805quCwkX5eKDJBibr0EYn6IOYa36a+0R5NP3UMkN4OP4nfIYZrd0mD0VN55ywNbqPS32jlH5u0KtKYhyFIKAQFIKAUiw6r6tG0npIm02CDK64vIqG8BxPZlT1WqjF+2ONvJd0mknN+63Cvm6NY7HDgsDWMaxo3AS7+JxWLe9rzvad23SlaRtWNoe2JXl7K3mnNUGEaC2I0te1rmGocA4HMFTFprO8cEWrFo2mN1A1q1V6IOjQATCHnNqWYtO9vhlTX0us6/7L8/NjavRejib05d3d/iqLQZwoBAUgoBAUgg2er2lnWaO19+wbnt4t45io/yuGowxlpt29jvps84bxPZ2usQ3h4DgQWEAgjeDeDkvn5iYnaX0cTExvDOc8lCWSDE8Sgrmu2lTBs+yDKJEm0cWt/Gc5GXarmiw9e+88oUddn9Hj6sc7fkuaLcYQhyEBQCApBQCkfXomwmPHhwh+J154NF7j3ArllyRjpNp7HTDjnLeKR2uvWaAyGxrWgBrWgNA3AL561ptMzPOX0taxWIrHKHpiV5eit5ogVy8UCuXigOE5i6VD/ZByfWfRf2a0vY3zD12YNO7sII7AvoNNm9Ljie3tfOarD6LJMdnOGqVhXEBQCApBAQEF+8n+ldtjrO43s6zMWE3jsJ7jgsjX4drekjt5+LY6Ozb1nHPZy8Fwnwos5ppkggjeUHKNatI/aLVEcD1GnYZ6rSb+0zPaFv6XF6PHEd/F87q8vpMszHZwahWVbkKAQEBSCgFIILd5OLODGjxD+GEGjDbJ/6fFZ3SNtqVjvnyaXRld72nujz/AOL/AIlZDZK3mnNUCuXigVy8UCtw5yQMB9EFO8pFnHR2d4qIhZ2OG1f7vxWl0db91qsvpOsdWtvft+fJQ1rMgUAgKQQEBQCD69E24wI8OKJ9V9+LTc4dxK8ZccZKTTvdMOT0d4v3Oww4gcAWyIIBB3SN4XzkxtO0vponeN4ZyUJarWe29DZYz5yOzst9Z3VB7Jz7F302P0mWsK+qyejxWtHNyUL6Hm+c5CAoBAUgoBSCAguvk1cJ2qfCGe7pP7rL6Sj1J8f6avRc8bx4f2vFbzRZbWK5eKBXLxQK3DnJAwH0QKXBBVfKM4CywhvNpB7mPn4q/wBHf+k+H9wzukv/ACjx/qXPFsMUQFIICAoBAQFI6ZqLbuksjWfihuLD6tW/Ay9lYeux9XLv38W9oMnXwxHdw+yxqmuqT5SbXdAhChLoh7Oq3xd3LT6Opxtb4MrpPJwrT4qMtVkigEBSCgFIICgEFg1Htoh2xocZNiNLPaMi34iXaqmtx9fFvHZxXNBkimWInt4fZ02uXisNvlcvFArcEDAfRApcECmaDn/lEtodGhwgZ7DS53rPlIdjQD7S1+j8e1JvPb/TG6Syda8Ujs/tUloM0UggICAoBAUgoFr8nVr2bREh7nwp+0w3fBzu5UOkKb44t3T5tHo2+2Sa98eToqx205hr3H27c8bmQ2M+G0f1Lc0NdsMe/dga+2+afdtH9/2rytqYgKQUApBAUAgKRIJnMEiRmN16jmcnUNVtPNtUIBxAitHXFNr8zcDv4HsWFqtPOK28cp5fZ9BpNTGau0+tHP7t5W4KqtmA+iBS4IFM0Gu07peHZYRe6RebmN3ud8gN5XbBgtlttHxcNRnrhrvPPscntMdz3ve8ze5xJOJ4L6CtYrERHY+ctabzMz2vNekCAgKAQEBSCgFI2erMfo7ZZnf6wb7/AFP3Lhqa9bFaPd5cXfS26uak+/z4OuL559I5BrFF2rZaT/uHj3Ts/JfRaeNsVY90PmtRO+W8++fs166uIpBQCkEBQCApBQCD0s8d7HtcxzmuBucLiFFqxaNp4wmtprPWidpXPRWvQkGx4Zn6bAD3s3dncs3L0fx3xz8JauHpLhtkj4x9lhgay2FwGzaYQ9cmF37UlTtpc0fxnzXK6vBMb9aPLzZRdYrEwf8AswT6rukPc2aiNLmn+MpnV4Y/nDRaT16hNBEBjnu9J4LG+7U5XK1j6PtPG87KmXpKscMcb++eX3Uq3W2LGeYkV5c87zuHBo3DBalMdccbVjZlZMlslutad3zr28CAgICgEBSCgFIIM4MTYc129rg7uM/komN4mO9MW2mJ7na9sL5nZ9Tu4zpIzjx8Y7z/AFlfSY/Ur4Q+YyevbxnzfOvbwICAgKAQFIKAQFIIM4UJzjJjXOPBoLz3BRMxXnwTWJtyjd9sPQVsNLNH7WOb4rlOoxR/KHWNNmn+MpfoG2NrZo/Y0u8FEajF7UJnS5vZl8Uezvh+eyIw/ma5niutbVtyndxtW1ecbeLzXpAgICgEBAUgoBSCAoEOoclMInk6Z9sdxKxOpDf68ueaREo0Yf67/wBRWxj9SvhDEyevbxnzfOvTwKQQEBQCkFAICkbnQmrVotMiAGQ/TdOR9UVd4Yqrm1ePFw5z3LWDR5MvHlHeumjtULJClNpiv4vvb7gu75rNya3Lblwj3fdqY9BipzjrT7/s30OG1gDWtaBwADR3BVJmZ4yuRERG0MqYlQkpea80QQ5oIO0ARwN4SJ2JjdpdIaqWOKCTDEN3GHKHLNvmnuVrHrMtO3fxVMmiw37NvBTtM6o2iCC9v3sMXzaCHAfmZ8xPsWlh1tMnCeEszPocmPjH7o/OxXqq4pCgEBSCgFIICgEEGhyUwieTpH2c8CsXrN7qqPp+Hs2u0j/cPPvOLh4rUwTvir4Qx9RXbLePfL4F2chAUAgKQUAgKReNV9UhJsW0NmathmjcYg3n8u7fwGVqtb/DH8/s1tJof55fl9/sutLh9FmNUpmgUxKBS815ogYlAxKBW805qgVy8UFW1n1UbG2okABsWpFzWxP7Ox37+Kv6bWTT9t+MeX+M/VaKL/vpwnz/ANc8e0glpBBBkQRIgioI4rYid+TEmNuaFIKAUggICgFIyZD2iG8SB33KJnbiRG/Dvdq6FvAL5rrS+p6sOY68QNi3RT6bWvHu7J+LStvRW3wx7mDrq7Z59+0tCraoKAQFIKAQFIt+ougtt32h46rXShg0LhV3ZuxyWdrtR1Y9HXt5tLQabrT6S3KOX3X6lwrzVZDZKZoFM0Cl5rzRAxKBiUCt5pzVArl4oFcvFArcKc0QU/XvQQc02iG3rNH3gG9vpZjfhktLQ6jafR25TyZmv00THpa845/nuUJarHFIICAoBSCgbDV6B0lrszd3TNPY07R+AXLUW6uK0+5201etlpHv/wBdgXzr6VRfKTZb7PFwdDP6m/vWp0dfhavx/Poyek6ca2+H59VJWmyhAUgoBAUj2sdmdFiQ4bfOc8NGEzX5rxe8UrNp7HqlJvaKx2uxWSzthQ2Q2CTWsDRkN5xXzl7Ta02ntfT0pFKxWOUPWma8vRTEoFLzXmiBiUDEoFbzTmqBXLxQK5eKBW4U5ogYD6IIc0SLZAzF87xI1mm+xzci07o/7PaYsK+QdNvqm9vwMuxfRYMnpMcWfNajF6PJNeyOXg+BdnEUAgKQUAgtHk9su3anP3Q4R95/VHw21R6QvtjivfK/0dTfLNu6PP8AJdIWM3Gl1usPS2OMPxNG23Nl5liRMdqs6TJ1MsT38FXWY+vhtHdx+TlK33zwgKAQFIKBY9QrPtW0GXmQnO7TJg/UVT19uri275/1d6Pp1s2/dE/Z0qmaxG8UxKBS815ogYlAxKBW805qgVy8UCuXigVuFOaIGA+iBgEClwrzVBQvKRZtmLZ4m90NzT7BBH6z3LW6Ot+21e5j9J0/dW3f/X/VPWkzBQCkFAICkdI1AsWxZS+V8R5Pst6rfBx7Vi6/J1snV7m50dj6uLrT/JaJKivsSOKDkWsGj+gtMSHKTZ7TPUde3uvHYvodPl9Jji35u+a1OL0WSa/Lwa5dnEQFIICgW3ycOAjxxvMES7HCfiFn9I+pXxaXRk/vt4OgUxKyGyUvNeaIGJQMSgVvNOaoFcvFArl4oFbhTmiBgPogYBApcK81QKYlBTfKTIQ7NOpiP7pCfiFpdG+tZl9J+rXxURarIFIKAQFI97BZHRosOE2r3huXE9gmexeMl4pWbT2PeOk3tFY7XY7PCaxjIbBJrWhowAEgvm7Wm0zM9r6atYrERHY9ZKHpBHcgquvui+lgiM0daFXiYZr3Vymr+gzdW/UnlPmz+kMPWp14518nO1sMQUggICDeamWwQrbCnR4MM+1e3+oNVXWU62GfdxW9Dfq5o9/D8+LqNLzXmiwX0BiUDEoFbzTmqBXLxQK5eKBW4U5ogYD6IGAQKXCvNUCmJQKXmvNEHO/KFa9q0sZP/wAcK/BzzMjuDVs9H06uObd8+TE6Sv1skVjsjz/IVZX2eKAQFIILt5PdFefaCOLGfvI8PeWX0hm5Y48Z/pq9G4eeWfCP7+y8YBZbWSggieSDFwDgR+GhxwyQcp1m0QbNHc0T6N3WYcN7cxTu4r6DTZ/S037Y5vnNVg9Dfbsnl+e5qVYVxAQFAlriCCCQQZgioIpJPE37nWNXNLttMBr5jpANl7fRdgOBqP8AC+f1GGcV9uzsfR6bPGam/b2tpiVwWCt5pzVArl4oFcvFArcKc0QMB9EDAIFLhXmqBTEoFLzXmiD5dKW9lnhPixDQXDeTua3ErpixzktFYc8uWMdJtLkNrtDokR8R56znFxzPDBfRUrFaxEdj5q95vabTzl5KXkQFIIPt0Po59ojshN3mbj6LR5x53kLlmyxipNpdcOGct4rDrlmgNhsZDYJNa0AYAccV89a02mZntfSVrFaxWOUPWl29eXpKCCJ5IIrcEGu0/ollpgmGZBwva70Xbuw0Oa7YM04r9aPi4ajBGanVn4OUWqzvhPdDe2T2ukRzUb19BW0WiJryl87ek1tMW5w8l6eRQCApHtZLXFhO2ocR7HcWkt7+K8WpW8bWjd6pe1J3rOzbwdbrcKxWuH5mQz4AKvOiwz2bfFZrrs8du/wfUzXm172WYj1Xif8AUuc9H4p5TP58HSOkssc4j8+L3GvsffAg9hePmvP6dT2pe/1O/swz/j+L/wDPD99w+Sj9Or7X0T+p29n6sv4/fT7Kz/kP/VR+mx7X0/1P6nb2Pr/h/H76Cys/5Cf2p+mx7X0/0/U7ex9f8Y/x/E3WaH77j8lP6bX2voj9Tt7P1YHX2PugQZ5vKn9Op7Uo/U7+zDxfr1a9zLMPZiH9y9R0fi7Zn8+DzPSWWeUR9fu+aNrjbj/MY31WM/dNe40OGOcb/Fztr888p2+DVW7SMeMQYsV75UmbhkBcFYpipT1Y2V8mW+T1p3fKvbmICkFAljSSGtBJJAAF5JNwAxSZ2Ijd1HVXQgssKRkYz5F5rs8Gg8B8TNYWq1HpbcOUcn0Gk0/oacec8/s3dLhXmqqraRdmglBB4IIwH0QKXBBX9bNXRaGBzJCO0XGm2PRcfAq5pdT6Kdp5SpavSxmjePWj6+5zSIwtJa4EOBIINxBFQQtuJiY3hgzExO09jFAUggICgEBAUgoBSCAoBAUgoBAUggIOg6nat9FKNFb96R1Wn+WDvP5j8Fj6zVdf9lOXn/jZ0Wk6n/0vz7Pd/q2UuFearPaRTEoJF2aCUEE7ggilwQKZoFMSgr2tGrLbQOkZJscCtA/gHY8Crml1U4uFuMeSlq9HGaOtXhbzc3tEB8N7mva5rwZEG4jnitqtotHWid4YVqzWerMbS816QICgEBAUgoBSCAgKAUgoBAUggljSSGtBJJkAASSTuA3lRM7ERu6Bqrqr0WzFjAGLVraiHieLvBZGq1nX/ZTl5/42dJoup+/Jz7u7/VspcK81We0imJQKZ80QSBvNUEoIJ3CqCKZoFMSgUvNeaIGJQazTegoNqb94Nl4HVeJbTc+Iw8F3wai+KeHLuV8+mpmjjz73ONM6Dj2Z3XbNk+q8TLTn6JwPxW1h1FMscOfcw8+mvhnjy72sXdwFAICkFAKQQFAICkFAICkEH26L0VHtD9mEwni43Nb6zvlVcsuamKN7S64cN8s7Vh0XV/VuFZRMdeNK95HmzqGDcPiVjajVWy8OUd33ben0lMPHnPf9m7pcK81VVbKYlApnzRApeUEgbygyQYk96CKZoFLzXmiBiUDEoFbzTmqDGJDDwQ4AsIkQQCDmDuUxMxO8ImImNpVLTGpDHzdZ3bB9B0yw+qat+IyWhh19o4ZOPv7Wbm6OrPHHw93YpmkNGx4BlFhubfWrT6rhcVp48tMnqTuy8mG+P142fIujmKAUggKAQFIKAQFI97HYosZ2zChvefyicszQdq8XyVpG9p2e6Y7XnasbrfofUahtD/YYf1P+Q71nZukOzHHx/wAaWHo3tyz8I+/2XOz2dkNoZDY1rRuAkB/lZtrTad5ndqVrWsbVjaHpS4V5qvL0UxKBTPmiBS8oGJ+iCRfeUEzQCggCV+9AA3lAA3lAlOtECU8vFAN+SAeG5BjEhhw2S0EEXggESyNVMTMcYRMRPCVf0jqbZInmNdCdxYer7pu7pK3j12WvPj4qeTQYb8uHh9letuolob/44kKIMZwnd14+KuU6Qxz60TH1Ur9G5I9WYn6NPadX7ZD86zRfZHS/pmrNdTitytHl5qttLmrzrPn5NfFhOZ5zXNP5gW+K7RMTy4uNomOcbPMEcQp2ed4JjiE2N4Zw2F3mgnIF3gomduaYjflxfdZ9BWuJ5tmjSxaYY73SXK2oxV52h2rpstuVZ8vNuLHqNan+e6FDGfSO7m3fFVr9IY49XeVmnR2WfWmI+v581gsGpNlZLbL4pxOw3sa35kqpk1+S3q8F3H0dirxt+5YoMBjGhkNjWtG5oDQMgFStabTvM7rtaxWNojZ6YBQ9FKV5qgSliUACWaABvNUADeUCU7ygVyQZIIQEBAKCSgICCAgBAQSghBjEophEq7bvOOauU5Kd+bzstRmpsiqywPNGSp25rleT0Xl6EAIICAgICAgIJQQUEoIQf//Z";
    } else {
      var img = "data:image/jpeg;base64," + this.imgSrc;
      return this.sanitizer.bypassSecurityTrustUrl(img);
    }
  }
}
