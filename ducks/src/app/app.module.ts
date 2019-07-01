import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import 'firebase/firestore';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { FormsModule }   from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent, DataWrittenDialog, LogoutDialog } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';

import { MaterialModule } from './material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HttpClient, HttpClientModule } from '@angular/common/http';
import { WatermanagementComponent, PastSevenDays } from 'src/app/components/watermanagement/watermanagement.component';
import { from } from 'rxjs';

import { FlexLayoutModule } from '@angular/flex-layout';

import { MatRadioModule } from '@angular/material';

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
import {CASelectionDialog} from 'src/app/app.component';
import { MatDialogRef } from '@angular/material';
import { GaugeStatsComponent } from './components/gauge-stats/gauge-stats.component';
import {MoistsoilService} from "./service/moistsoil.service"
import { ChartService } from './service/chart.service';

var config = {
  apiKey: "AIzaSyChqXN2Wz2FRywEUwfEkfoxJJtc3hvr0CY",
  authDomain: "waterfowltool.firebaseapp.com",
  databaseURL: "https://waterfowltool.firebaseio.com",
  projectId: "waterfowltool",
  storageBucket: "waterfowltool.appspot.com",
  messagingSenderId: "559890301050",
  appId: "1:559890301050:web:8aca959fb66bcdd3"
}; 

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
    PastSevenDays,
    ConnectionStatusDialog,
    LoginDialog,
    LogoutDialog,
    DataWrittenDialog,
    CASelectionDialog,
    GaugeStatsComponent,
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(config),
    AngularFireDatabaseModule,
    AngularFirestoreModule.enablePersistence(),
    AppRoutingModule,
    HttpClientModule,
    MaterialModule,
    BrowserAnimationsModule,
    FormsModule,
    MatRadioModule,
    FlexLayoutModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: true }),
    ChartsModule,
    MatExpansionModule,
  ],
  entryComponents: [BiweeklyWaterFoodComponent, PastSevenDays, WatermanagementComponent, BottomSheetOverviewExampleSheet,ConnectionStatusDialog,LoginDialog,LogoutDialog,DataWrittenDialog,CASelectionDialog],
  providers: [LocalWaterManagementService,WatermanagementComponent,FoodAvailComponent,AppComponent,MoistsoilService,ChartService],
  bootstrap: [AppComponent]
})
export class AppModule { }

