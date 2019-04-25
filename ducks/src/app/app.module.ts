import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

//I used angular fire 2 which is deprecated but you can still use
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

//import { ChartsModule } from 'ng4-charts/ng4-charts';
import { ChartsModule } from 'ng2-charts/ng2-charts';

import {MatExpansionModule} from '@angular/material/expansion';

import * as firebase from 'firebase/app';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { DataReviewComponent } from './components/data-review/data-review.component';
import { NavBarsComponent } from './components/nav-bars/nav-bars.component';
import { WeatherComponent } from './components/weather/weather.component';
import { LocalWaterManagementService } from 'src/app/service/watermanagement-local.service';

import { PumpManagementComponent } from './components/pump-management/pump-management.component';
import { PumpTableComponent } from './components/pump-table/pump-table.component';
import { MapServiceexService } from './service/map-serviceex.service';

import { BiweeklyWaterFoodComponent} from './components/biweekly-water-food/biweekly-water-food.component';
import { FoodAvailComponent, BottomSheetOverviewExampleSheet} from './components/food-avail/food-avail.component';

import {ConnectionStatusDialog} from 'src/app/app.component';
import {LoginDialog} from 'src/app/app.component';
import { MatDialogRef } from '@angular/material';

firebase.initializeApp(environment.firebase);

@NgModule({
  declarations: [
    AppComponent,
    WatermanagementComponent,
    DataReviewComponent,
    NavBarsComponent,
    WeatherComponent,
    BiweeklyWaterFoodComponent,
    FoodAvailComponent,
    PumpManagementComponent,
    PumpTableComponent,
    BottomSheetOverviewExampleSheet,
    ConnectionStatusDialog,
    LoginDialog,
    DataWrittenDialog,
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
  providers: [Globals,LocalWaterManagementService,WatermanagementComponent,MapServiceexService],
  bootstrap: [AppComponent]
})
export class AppModule { }

