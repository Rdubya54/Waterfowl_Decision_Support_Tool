import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import 'firebase/firestore';

import { environment } from '../environments/environment';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { FormsModule }   from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent, DataWrittenDialog } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';

import { MaterialModule } from './material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HttpClient, HttpClientModule } from '@angular/common/http';
import { WatermanagementComponent } from 'src/app/components/watermanagement/watermanagement.component';
import {Globals} from 'src/app/extra/globals';
import { from } from 'rxjs';

import { FlexLayoutModule } from '@angular/flex-layout';

import { ChartsModule } from 'ng2-charts/ng2-charts';

import {MatExpansionModule} from '@angular/material/expansion';

import * as firebase from 'firebase/app';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { NavBarsComponent } from './components/nav-bars/nav-bars.component';
import { WeatherComponent } from './components/weather/weather.component';
import { LocalWaterManagementService } from 'src/app/service/watermanagement-local.service';

import { BiweeklyWaterFoodComponent} from './components/biweekly-water-food/biweekly-water-food.component';
import { FoodAvailComponent, BottomSheetOverviewExampleSheet} from './components/food-avail/food-avail.component';

import {ConnectionStatusDialog} from 'src/app/app.component';
import {LoginDialog} from 'src/app/app.component';
import { MatDialogRef } from '@angular/material';
import { GaugeStatsComponent } from './components/gauge-stats/gauge-stats.component';
import {MoistsoilService} from "./service/moistsoil.service"



firebase.initializeApp(config);

firebase.firestore().enablePersistence()
  .catch(function(err) {
      if (err.code == 'failed-precondition') {
          console.log("multipel tabs")
          // Multiple tabs open, persistence can only be enabled
          // in one tab at a a time.
          // ...
      } else if (err.code == 'unimplemented') {
        console.log("bad broswer")
          // The current browser does not support all of the
          // features required to enable persistence
          // ...
      }
  });


@NgModule({
  declarations: [
    AppComponent,
    WatermanagementComponent,
    NavBarsComponent,
    WeatherComponent,
    BiweeklyWaterFoodComponent,
    FoodAvailComponent,
    BottomSheetOverviewExampleSheet,
    ConnectionStatusDialog,
    LoginDialog,
    DataWrittenDialog,
    GaugeStatsComponent,
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFirestoreModule.enablePersistence(),
    AppRoutingModule,
    HttpClientModule,
    MaterialModule,
    BrowserAnimationsModule,
    FormsModule,
    FlexLayoutModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: true }),
    ChartsModule,
    MatExpansionModule,
  ],
  entryComponents: [BiweeklyWaterFoodComponent, BottomSheetOverviewExampleSheet,ConnectionStatusDialog,LoginDialog,DataWrittenDialog],
  providers: [Globals,LocalWaterManagementService,WatermanagementComponent,FoodAvailComponent,AppComponent,MoistsoilService],
  bootstrap: [AppComponent]
})
export class AppModule { }

