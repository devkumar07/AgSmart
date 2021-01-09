import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { DataService } from '../data.service';

@Component({
  selector: 'list-view',
  templateUrl: './list-view.component.html',
  styleUrls: ['./list-view.component.css']
})
export class ListViewComponent implements OnInit {

  fields = []
  private url = 'http://127.0.0.1:5000'
  constructor(private data: DataService, private http: Http) { }

  ngOnInit(): void {
    let temp = []
    //this.data.fieldData.subscribe(message => this.fields = temp)
    if(this.fields.length == 0){
      this.http.get(this.url+'/getagworldFields')
      .subscribe(response => {
        let json_data = response.json()
        if (json_data['result'] == 'SUCCESS'){
          this.fields = json_data['response_fields']
          //alert(JSON.stringify(json_data['response_fields']))
        }
        else{
          alert("failed")
        }
      })
    }
  }

}
