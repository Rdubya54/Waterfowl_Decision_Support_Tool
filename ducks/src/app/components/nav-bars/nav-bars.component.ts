import { Component, OnInit } from '@angular/core';
import {MediaChange, MediaObserver} from '@angular/flex-layout';

import {MediaMatcher} from '@angular/cdk/layout';
import {ChangeDetectorRef, OnDestroy} from '@angular/core';

import { Router } from '@angular/router';

import { Location } from '@angular/common';

import { GaugeStatLocalService } from 'src/app/service/gaugedata-local.service';
import { ImageLocalService } from 'src/app/service/image-local.service';
import { LocalWaterFood } from 'src/app/service/biweekly-waterfood-local.service';
import { FoodAvailLocalService } from 'src/app/service/food-avail-local.service';
import { LocalWaterManagementService } from 'src/app/service/watermanagement-local.service';
import { WeatherLocalService } from 'src/app/service/weather-local.service';
import { WCSService } from 'src/app/service/wcs.service';
import { AppComponent } from 'src/app/app.component';


@Component({
  selector: 'app-nav-bars',
  templateUrl: './nav-bars.component.html',
  styleUrls: ['./nav-bars.component.css']
})
export class NavBarsComponent implements OnInit {

  mobileQuery: MediaQueryList;

  private _mobileQueryListener: () => void;
  public status;

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher,private router:Router, private location:Location
    ,private gaugelocalservice:GaugeStatLocalService,private imagelocalservice:ImageLocalService,private waterfoodlocalservice:LocalWaterFood,
    private foodavaillocalservice:FoodAvailLocalService,private watermanagementlocalservice:LocalWaterManagementService,
    private weatherlocalservice:WeatherLocalService,private wcslocalservice:WCSService, private app:AppComponent) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }  

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
  
  ngOnInit() {
    this.status=localStorage.getItem('Status')
  }

  change_CA(){
      //dont allow change CA's unless user has a connection
      if (this.status==="online"){
        //cclear indexdb, do not need to push to the cloud first because
        //changing CA's will not be allowed without connection
        localStorage.removeItem("CA");
        this.gaugelocalservice.clearTable();
        this.imagelocalservice.clearTable();
        this.waterfoodlocalservice.clearTable();
        this.foodavaillocalservice.clearTable();
        this.watermanagementlocalservice.clearTable();
        this.weatherlocalservice.clearTable();
        this.wcslocalservice.clearTable();

        this.router.navigate(['/'])

        //clear browser history otherwise it doesn't redirect properly
        this.location.replaceState('/')
        location.reload()
      }

      else{
        alert('Cant Change CAs without an internet connection')
      }
  }
}
