import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {Http} from '@angular/http'
import { Router } from '@angular/router';
import { DataService } from "../data.service";

@Component({
  selector: 'agsmart-login',
  templateUrl: './agsmart-login.component.html',
  styleUrls: ['./agsmart-login.component.css']
})
export class AgsmartLoginComponent implements OnInit {
  private url = 'http://127.0.0.1:5000'
  name:string
  isAgsmart = true
  constructor(private http: Http, private router: Router, private data: DataService) { }

  ngOnInit():void {
    this.data.currentMessage.subscribe(message => this.name = message)
    this.data.loginPageStatus.subscribe(message => this.isAgsmart = message)
  }
  submit(param){
    if(this.isAgsmart == true){
      let post = {username: param.value.email, password: param.value.password}
      this.http.post(this.url+'/login_validation',post)
      .subscribe(response => {
        let json_data = response.json()
        if (json_data['response'] == 'SUCCESS'){
          this.data.changeMessage(json_data['name'])
          this.data.updateInitAddress(json_data['address'])
          this.router.navigate(['/dashboard']);
        }
        else{
          alert("failed")
        }
      })
    }
    else{
      let post = {username: param.value.email, password: param.value.password}
      this.http.post(this.url+'/verify_agworld_login',post)
      .subscribe(response => {
        let json_data = response.json()
        if (json_data['response'] == 'SUCCESS'){
          this.http.get(this.url+'/getagworldFarms')
          .subscribe(response => {
            let json_data = response.json()
            if (json_data['result'] == 'SUCCESS'){
              alert(JSON.stringify(json_data['response_farms']))
              let data = [json_data['response_farms']]
              this.data.sendAgWorldFarmData([json_data['response_farms']],7)
            }
            else{
              alert("failed")
            }
          })
        }
        else{
          alert("failed")
        }
      })
    }
  }
}
