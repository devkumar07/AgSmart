import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AgmCoreModule } from '@agm/core';
import {RouterModule} from '@angular/router';
import { AppComponent } from './app.component';
import { FormsModule }   from '@angular/forms';
import { HomeComponentComponent } from './home-component/home-component.component';
import { MapComponentComponent } from './map-component/map-component.component';
import { AgsmartLoginComponent } from './agsmart-login/agsmart-login.component';
import { HttpModule } from '@angular/http';
import { DataService } from './data.service';
import { ListViewComponent } from './list-view/list-view.component';
import { DataTablesModule } from 'angular-datatables';
import { HttpClientModule } from '@angular/common/http';
import apiKeys from './key.json';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSliderModule } from '@angular/material/slider';
import { MatTableModule } from '@angular/material/table' 
import { MatPaginatorModule } from '@angular/material/paginator';
import {MatTableFilter, MatTableFilterModule} from 'mat-table-filter'
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import { MatNativeDateModule } from '@angular/material/core';
import {FormGroup,ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule} from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
@NgModule({
  declarations: [
    AppComponent,
    HomeComponentComponent,
    MapComponentComponent,
    AgsmartLoginComponent,
    ListViewComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    HttpClientModule,
    DataTablesModule,
    MatSliderModule,
    MatDatepickerModule,
    MatTableModule,
    MatInputModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatTableFilterModule,
    RouterModule.forRoot([
      {
        path: '', 
        component: HomeComponentComponent
      },
      {
        path:'dashboard', 
        component: MapComponentComponent
      },
      {
        path:'login', 
        component: AgsmartLoginComponent
      }
    ]),
    AgmCoreModule.forRoot({
      apiKey: apiKeys['mapsAPI']
    }),
    BrowserAnimationsModule
  ],
  providers: [DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
