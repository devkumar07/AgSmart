import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class DataService {

  private messageSource = new BehaviorSubject('default message');
  private userAddress = new BehaviorSubject('San Francisco');
  private isAgsmartLogin = new BehaviorSubject(true);
  private farms = new BehaviorSubject([]);
  private fields = new BehaviorSubject([]);
  currentMessage = this.messageSource.asObservable();
  currentAddress = this.userAddress.asObservable();
  loginPageStatus = this.isAgsmartLogin.asObservable();
  farmData = this.farms.asObservable();
  fieldData = this.fields.asObservable();
  constructor() { }

  changeMessage(message: string) {
    this.messageSource.next(message)
  }
  updateInitAddress(message:string){
    this.userAddress.next(message)
  }
  changeLoginType(){
    this.isAgsmartLogin.next(false)
  }
  sendAgWorldFarmData(message,s){
    this.farms.next([message,s])
  }
  sendAgWorldFieldData(message){
    this.fields.next(message)
  }
}
