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
    HttpModule,
    HttpClientModule,
    DataTablesModule,
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
      apiKey: 'AIzaSyDaCbpln35NftchaoxdBJ_tusL5rg99hVc'
    })
  ],
  providers: [DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
