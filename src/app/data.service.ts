import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class DataService {

  private messageSource = new BehaviorSubject('default message');
  private userAddress = new BehaviorSubject('San Francisco');
  private isAgsmartLogin = new BehaviorSubject(true);
  private farms = new BehaviorSubject([]);
  private fields = new BehaviorSubject([]);
  private coord = new BehaviorSubject([]);
  private FarmLat = new BehaviorSubject([]);
  private FarmLng = new BehaviorSubject([]);
  private listViewFields = new BehaviorSubject([]);

  currentMessage = this.messageSource.asObservable();
  currentAddress = this.userAddress.asObservable();
  loginPageStatus = this.isAgsmartLogin.asObservable();
  coordList = this.coord.asObservable();
  Lat = this.FarmLat.asObservable();
  Lng = this.FarmLng.asObservable(); 
  cachedList = this.listViewFields.asObservable();

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
  sendFieldCoord(message){
    this.coord.next(message)
    alert('sent data')
  }
  sendFarmCoords(message1, message2){
    this.FarmLat.next(message1)
    this.FarmLng.next(message2)
  }
  cacheFields(message){
    this.listViewFields.next(message);
  }
}
