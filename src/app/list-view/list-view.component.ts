import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Http } from '@angular/http';
import { DataService } from '../data.service';

@Component({
  selector: 'list-view',
  templateUrl: './list-view.component.html',
  styleUrls: ['./list-view.component.css']
})
export class ListViewComponent implements OnInit {

  fields;
  private url = 'http://127.0.0.1:5000'
  title = 'datatables';
  dtOptions: DataTables.Settings = {};
  constructor(private data: DataService, private http: Http) { }

  ngOnInit(): void {
    let temp = []
    let filtered = []
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      processing: true
    };
  
    this.http.get(this.url+'/getagworldFields')
      .subscribe(response => {
        let json_data = response.json()
        if (json_data['result'] == 'SUCCESS'){
          temp = json_data['response_fields']
          for (var i=0; i<temp.length; i++) {
            if(temp[i].attributes.activity_fields[0].farm_name == 'Merced College-Large Blocks' && temp[i].attributes.activity_fields[0].crops.length != 0){
              filtered.push(temp[i])
            }
          }
          //alert(JSON.stringify(filtered))
          this.fields = filtered
        }
        else{
          alert('failed')
        }
    });
    //this.data.fieldData.subscribe(message => this.fields = temp)
    /*if(this.fields.length == 0){
      this.http.get(this.url+'/getagworldFields')
      .subscribe(response => {
        let json_data = response.json()
        if (json_data['result'] == 'SUCCESS'){
          temp = json_data['response_fields']
          for (var i=0; i<temp.length; i++) {
            if(temp[i].attributes.activity_fields[0].farm_name == 'Merced College-Large Blocks' && temp[i].attributes.activity_fields[0].crops.length != 0){
              filtered.push(temp[i])
            }
          }
          this.fields = filtered
          //alert(JSON.stringify(json_data['response_fields']))
        }
        else{
          alert("failed")
        }
      })
    }*/
  }
}
