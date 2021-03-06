import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Http } from '@angular/http';
import { DataService } from '../data.service';
import { MatPaginator } from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { DatePipe } from '@angular/common';
import {FormControl, FormGroup} from '@angular/forms';

export class AgData {
  field: string;
  crop: string;
  activity: string;
  date: string;
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
  fields = [];
  coordinates;

  fieldFilter = new FormControl('');
  cropFilter = new FormControl('');
  activityFilter = new FormControl('');
  updatedFilter = new FormControl('');
  areaFilter = new FormControl('');
  hoursFilter = new FormControl('');

  filterValues = {
    fieldFilter: '',
    cropFilter: '',
    activityFilter: '',
    updatedFilter: '',
    areaFilter: '',
    hoursFilter: ''
  };

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

  createFilter(): (data: any, filter: string) => boolean {
    let filterFunction = function(data, filter): boolean {
      let searchTerms = JSON.parse(filter);
      return data.field.toLowerCase().indexOf(searchTerms.fieldFilter) !== -1
        && data.crop.toString().toLowerCase().indexOf(searchTerms.cropFilter) !== -1
        && data.activity.toLowerCase().indexOf(searchTerms.activityFilter) !== -1
        //&& data.updated.toLowerCase().indexOf(searchTerms.updatedFilter) !== -1
        && data.area.toLowerCase().indexOf(searchTerms.areaFilter) !== -1
        && data.hours.toLowerCase().indexOf(searchTerms.hoursFilter) !== -1;
    }
    return filterFunction;
  }
  computeMinMaxCoord(farmLat, farmLng){
    var minLat = 999
    var minLng = 999
    var maxLat = -999
    var maxLng = -999
    for(var i = 0; i < this.coordinates.length; i++){
      if(this.coordinates[i]['lat'] < minLat){
        minLat = this.coordinates[i]['lat']
      }
      if(this.coordinates[i]['lng'] < minLng){
        minLng = this.coordinates[i]['lng']
      }
    }

    for(var i = 0; i < this.coordinates.length; i++){
      if(this.coordinates[i]['lat'] > maxLat){
        maxLat = this.coordinates[i]['lat']
      }
      if(this.coordinates[i]['lng'] > maxLng){
        maxLng = this.coordinates[i]['lng']
      }
    }
    //alert(minLat+'<'+farmLat+'<'+maxLat)
    //alert(minLng+'<'+farmLng+'<'+maxLng)
    if ((minLat <= farmLat && farmLat <=maxLat) && (minLng <= farmLng && farmLng <= maxLng)){
      return true
    }
    return false
  }

  ngOnInit(): void {
    let temp = []
    let filtered = []
    let farmLat;
    let farmLng;
    let withinRange
    
    this.data.coordList.subscribe(message => this.coordinates = message)
    this.data.Lat.subscribe(message => farmLat = message)
    this.data.Lng.subscribe(message => farmLng = message)
    this.data.cachedList.subscribe(message => this.fields = message)
    //alert(this.fields)

    if(this.coordinates.length == 0){
      withinRange = true
      //alert('it is empty')
    } 
    else{
      withinRange = this.computeMinMaxCoord(farmLat,farmLng)
      //alert('it is filled')
    }
    setTimeout(() => { this.ngOnInit() }, 1000 * 10)
    if(this.fields.length == 0){
      this.http.get(this.url+'/getagworldFields')
        .subscribe(response => {
          let json_data = response.json()
          if (json_data['result'] == 'SUCCESS'){
            temp = json_data['response_fields']
            //alert(withinRange)
            for (var i=0; i<temp.length; i++) {
              for(var j = 0; j < temp[i].attributes.activity_fields.length; j++){
                if(temp[i].attributes.activity_fields[0].farm_name == 'Merced College-Large Blocks' && withinRange == true){
                  if(temp[i].attributes.activity_fields[0].crops.length == 0){
                    filtered.push({
                      field : temp[i].attributes.activity_fields[0].field_name,
                      crop : 'N/A',
                      activity : temp[i].attributes.title,
                      updated : new Date(temp[i].attributes.updated_at),
                      area : temp[i].attributes.area,
                      hours : temp[i].attributes.activity_inputs[0].total_time,
                    })
                  }
                  else{
                    for(var y = 0; y < temp[i].attributes.activity_fields[0].crops.length; y++){
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
                }
              }
            }
            this.fields = filtered
            this.data.cacheFields(filtered)
            //alert(JSON.stringify(this.dataSource))
          }
          else{
            alert('failed')
          }
      });
    }
    this.dataSource = new MatTableDataSource(this.fields);
    this.dataSource.filterPredicate = this.createFilter();
    this.dataSource.paginator = this.paginator;
    this.pipe = new DatePipe('en');
    this.fieldFilter.valueChanges
     .subscribe(
      field => {
        this.filterValues.fieldFilter = field;
        this.dataSource.filter = JSON.stringify(this.filterValues);
      }
    )
    this.cropFilter.valueChanges
      .subscribe(
        crop => {
          this.filterValues.cropFilter = crop;
          this.dataSource.filter = JSON.stringify(this.filterValues);
        }
      )
    this.activityFilter.valueChanges
      .subscribe(
        activity => {
          this.filterValues.activityFilter = activity;
          this.dataSource.filter = JSON.stringify(this.filterValues);
        }
      )
    this.updatedFilter.valueChanges
      .subscribe(
        updated => {
          this.filterValues.activityFilter = updated;
          this.dataSource.filter = JSON.stringify(this.filterValues);
        }
      )
    this.areaFilter.valueChanges
      .subscribe(
        area => {
          this.filterValues.activityFilter = area;
          this.dataSource.filter = JSON.stringify(this.filterValues);
        }
      )
    this.hoursFilter.valueChanges
      .subscribe(
        hours => {
          this.filterValues.hoursFilter = hours;
          this.dataSource.filter = JSON.stringify(this.filterValues);
        }
      )
      
  }
  constructor(private data: DataService, private http: Http) { 
    
  }
  getDateRange(value) {
    this.dataSource.data = this.fields;
    // getting date from calendar
    var fromDate = value.fromDate;
    var toDate = value.toDate;
    if(fromDate == null){
      fromDate = new Date('2000-01-01')
    }
    if(toDate == null){
      toDate = new Date('2050-01-01')
    }
    this.dataSource.data = this.dataSource.data.filter(e=>e.updated > fromDate && e.updated < toDate ).sort((a, b) => a.updated - b.updated) ;
    console.log(fromDate, toDate);
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
