import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Http } from '@angular/http';
import { DataService } from '../data.service';
import { DataTableDirective } from 'angular-datatables';
import { MatPaginator } from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { MatTableFilter } from 'mat-table-filter';
import { DatePipe } from '@angular/common';
import {FormControl, FormGroup} from '@angular/forms';

export class AgData {
  field: string;
  crop: string;
  activity: string;
  updated: string;
  area: string;
  hours: string;
}

@Component({
  selector: 'list-view',
  templateUrl: './list-view.component.html',
  styleUrls: ['./list-view.component.css']
})
export class ListViewComponent implements OnInit {
  displayedColumns: string[] = ['Field', 'Crop', 'Activity Name','Last updated','Area','Input Hours'];
  dataSource;
  fields;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  private url = 'http://127.0.0.1:5000'
  title = 'datatables';
  pipe: DatePipe;

  filterForm = new FormGroup({
      fromDate: new FormControl(),
      toDate: new FormControl(),
  });

  get fromDate() { return this.filterForm.get('fromDate').value; }
  get toDate() { return this.filterForm.get('toDate').value; }


  ngOnInit(): void {
    let temp = []
    let filtered = []

    this.http.get(this.url+'/getagworldFields')
      .subscribe(response => {
        let json_data = response.json()
        if (json_data['result'] == 'SUCCESS'){
          temp = json_data['response_fields']
          for (var i=0; i<temp.length; i++) {
            if(temp[i].attributes.activity_fields[0].farm_name == 'Merced College-Large Blocks' && temp[i].attributes.activity_fields[0].crops.length != 0){
              filtered.push({
                field : temp[i].attributes.activity_fields[0].field_name,
                crop : temp[i].attributes.activity_fields[0].crops[0].crop_name,
                activity : temp[i].attributes.title,
                updated : new Date(temp[i].attributes.updated_at),
                area : temp[i].attributes.area,
                hours : temp[i].attributes.activity_inputs[0].total_time,
              })
            }
          }
          this.fields = filtered
          this.dataSource = new MatTableDataSource(filtered);
          this.pipe = new DatePipe('en');
          console.log(this.dataSource.filterPredicate);
          const defaultPredicate=this.dataSource.filterPredicate;
          this.dataSource.filterPredicate = (data, filter) =>{
            const formatted=this.pipe.transform(data.created,'MM/dd/yyyy');
            return formatted.indexOf(filter) >= 0 || defaultPredicate(data,filter) ;
          }
          //alert(JSON.stringify(this.dataSource))
        }
        else{
          alert('failed')
        }
    });
  }
  constructor(private data: DataService, private http: Http) { 
    
  }
  getDateRange(value) {
    this.dataSource.data = this.fields;
    // getting date from calendar
    const fromDate = value.fromDate;
    const toDate = value.toDate;
    this.dataSource.data = this.dataSource.data.filter(e=>e.updated > fromDate && e.updated < toDate ).sort((a, b) => a.updated - b.updated) ;
    console.log(fromDate, toDate);
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
