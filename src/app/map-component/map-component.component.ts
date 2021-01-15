import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import {Http} from '@angular/http'
import { Router } from '@angular/router';
import apiKeys from '../key.json'
import * as XLSX from 'xlsx';

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
  import_data: [][]
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
    /*let temp = []
    this.data.farmData.subscribe(message => temp = message[0])
    alert(temp)
    this.data.farmData.subscribe(message => this.z = message[1])
    if(temp != undefined){
      this.agWorldFarms = temp
    }*/
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
  onFileChange(evt: any) {
    const target : DataTransfer =  <DataTransfer>(evt.target);
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');

    const reader: FileReader = new FileReader();

    reader.onload = (e: any) => {
      const bstr: string = e.target.result;

      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

      const wsname : string = wb.SheetNames[0];

      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      //console.log(ws);

      this.import_data = (XLSX.utils.sheet_to_json(ws, { header: 1 }));

      console.log(this.import_data);

      let x = this.import_data.slice(1);
      console.log(x);
      let post = {dataFromExcel: this.import_data}
      this.http.post(this.url+'/file_data_upload',post)
      .subscribe(response => {
        let json_data = response.json()
        if (json_data['result'] == 'SUCCESS'){
          alert("File uploaded Successfully")
        }
      })
    };

    reader.readAsBinaryString(target.files[0]);

  }
}
