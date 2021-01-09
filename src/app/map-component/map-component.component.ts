import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import {Http} from '@angular/http'
import { Router } from '@angular/router';
import apiKeys from '../key.json'
@Component({
  selector: 'map-component',
  templateUrl: './map-component.component.html',
  styleUrls: ['./map-component.component.css']
})
export class MapComponentComponent implements OnInit {
  name = 'My first AGM project';
  address = 'San Francisco'
  temp = ''
  isActive = true
  isActiveLogin = false
  isActiveListView = false
  agWorldFarms = []
  z = 17
  lat = 51.678418;
  lng = 7.809007;
  private url = 'http://127.0.0.1:5000'
  constructor(private http: Http, private router: Router,private data: DataService) { }

  ngOnInit(): void {
    this.data.currentAddress.subscribe(message => this.address = message)
    this.http.get(this.url+'/find_session')
      .subscribe(response => {
        let json_data = response.json()
        if (json_data['code'] == 'SUCCESS'){
          this.name = json_data['name']
          this.geocodeAddress(json_data['address'])
          this.agWorldFarms = [json_data['response_farms']]
          this.z = json_data['zoom']
        }
        else{
          this.data.currentMessage.subscribe(message => this.name = message)
          this.geocodeAddress(this.address)
        }
      })
  }
  geocodeAddress(location:string){
    const address = location
    this.http.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + 
              address + '&key='+apiKeys['mapsAPI']).subscribe(response =>{
                this.temp = JSON.stringify(response.json())
                let res = response.json()
                this.lat = res['results'][0].geometry.location.lat
                this.lng = res['results'][0].geometry.location.lng
              });
  }
  makeAllFalse(){
    this.isActive = false;
    this.isActiveLogin = false;
    this.isActiveListView = false;
  }
  showLoginService(){
    this.makeAllFalse();
    this.isActiveLogin = true;
    this.data.changeLoginType();
  }
  showListView(){
    this.makeAllFalse();
    this.isActiveListView = true;
  }
  defaultView(){
    this.makeAllFalse();
    this.isActive = true;
    let temp = []
    this.data.farmData.subscribe(message => temp = message[0])
    this.data.farmData.subscribe(message => this.z = message[1])
    if(temp.length!=0){
      this.agWorldFarms = temp
    }
  }
}
