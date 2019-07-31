import { Component, ModuleWithComponentFactories,Inject } from '@angular/core';
import {SwUpdate} from '@angular/service-worker';
import { ConnectionService } from 'ng-connection-service';
import { stripSummaryForJitFileSuffix } from '@angular/compiler/src/aot/util';
import { Location } from '@angular/common';

import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {CookieService} from 'src/app/service/cookie.service';

import {dbService} from 'src/app/service/cloud-db.service';

import {CropStats,ICropStats} from 'src/app/model/crop-stats';
import {GaugeStats,IGaugeStats} from 'src/app/model/gauge-stats';
import { GaugedataService } from 'src/app/service/gaugedata-cloud.service';
import { GaugeStatLocalService } from 'src/app/service/gaugedata-local.service';

import {Image,IImage} from 'src/app/model/image'
import { ImageLocalService } from 'src/app/service/image-local.service';

import { WCSService } from 'src/app/service/wcs.service';
import {
  WCS,
  IWCS
} from 'src/app/model/water-control-structures';

import { WeatherCloudService } from 'src/app/service/weather-cloud.service';
import { WeatherLocalService } from 'src/app/service/weather-local.service';
import {
  Weather,
  IWeather
} from 'src/app/model/weather';

import { FoodAvailCloudService } from 'src/app/service/food-avail-cloud.service';
import { FoodAvailLocalService } from 'src/app/service/food-avail-local.service';
import {MoistsoilService} from 'src/app/service/moistsoil.service';
import {
  FoodAvail,
  IFoodAvail
} from 'src/app/model/food-avail';


import { LocalWaterFood } from 'src/app/service/biweekly-waterfood-local.service';
import {BiweeklyWaterFoodService} from 'src/app/service/biweekly-waterfood-cloud.service';
import {
  WaterFood,
  IWaterFood
} from 'src/app/model/water-food';

import {WatermanagementCloudService} from 'src/app/service/watermanagement-cloud.service';
import { LocalWaterManagementService } from 'src/app/service/watermanagement-local.service';
import {
  Watermanagement,
  IWatermanagement
} from 'src/app/model/watermanagement';
import { Observable } from 'rxjs';
import 'rxjs/add/observable/timer';
import { last } from '@angular/router/src/utils/collection';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {

  WCSs:any[];
  newWCS:IWCS=new WCS();

  image:any[];
  newImage:IImage=new Image();

  cropstats:any[];
  newCropStats:ICropStats = new CropStats();

  gaugestats:any[];
  newGaugeStat:IGaugeStats = new GaugeStats();

  weathers: any[];
  newWeather: IWeather = new Weather();

  foodavails: any[];
  newFoodAvail: IFoodAvail = new FoodAvail();

  waterfoods: any[];
  newWaterFood: IWaterFood = new WaterFood();

  watermanagements: any[];
  newWaterManagement: IWatermanagement = new Watermanagement();

  isConnected = true;
  title = 'ducks';
  datapeice: any;
  public role:string;
  public logged_in:boolean;
  public page:string;
  online_status=false;
  public status;
  public selected_CA;

  public promise1;
  public promise2;


  public downloadstatuscheck = Observable.timer(1000, 1000);

  //this makes sure updates are properly loaded.
  //needed cause pwas caching can make it hard to seee updates
  constructor(private connectionService:ConnectionService,updates:SwUpdate,public dialog: MatDialog, private path:Location,
    private weatherlocalservice:WeatherLocalService,private weathercloudservice:WeatherCloudService, private cookieservice:CookieService,
    private foodavailcloudservice:FoodAvailCloudService, private foodavaillocalservice: FoodAvailLocalService, private cloud_db_service: dbService,
    public moistsoilservice:MoistsoilService,private waterfoodcloudservice:BiweeklyWaterFoodService, 
    private waterfoodlocalservice:LocalWaterFood,private watermanagementlocalservice: LocalWaterManagementService, 
    private watermanagementcloudservice: WatermanagementCloudService,
    private gaugestatscloudservice:GaugedataService, private gaugestatslocalservice:GaugeStatLocalService, 
    private imagelocalservice:ImageLocalService,private WCSlocalservice:WCSService){
    
    //this is only run when the connection status changes
    this.connectionService.monitor().subscribe(isConnected => {
      this.isConnected = isConnected;
      
      //if online open dialog and change status
      if (this.isConnected) {
        this.cookieservice.setStatus("online") 
        this.status=localStorage.getItem('Status')
        this.openConnectionStatusDialog();
      }

      //if offline do the same 
      else {
        this.cookieservice.setStatus("offline") 
        this.status=localStorage.getItem('Status')
        this.openConnectionStatusDialog();
      }

      //take user back to landing page of the app to ensure app updates every table
      location.replace("");
    })
  }
  
  //on page load
  ngOnInit(){
    //get page
    this.page=this.path.path()

    //if on app landing page 
    if (this.page===""){
      //open CA selection if a CA has not been chosen
      if (localStorage.getItem('CA')===null){
        this.openCASelectionDialog();
      }
      //if CA has already been chosen, start doing updates
      else {
        this.initial_onlineCheck();
      }
    }
  } 

  //when page first loads this other online check needs to be done, this.connectionService.monitor()
  //will not get the connection status at the beginning of the page load
  initial_onlineCheck() {
      //get SELETED CA
      this.selected_CA=localStorage.getItem('CA')
      this.online_status = window.navigator.onLine;

      //if online
      if (this.online_status){
        //push all records into cloud
        
        this.openUpdatingDialog();

        //set statuses
        this.cookieservice.setStatus("online") 
        this.status=localStorage.getItem('Status')
      }      

      //if offline
      else{
        //set statuses
        this.cookieservice.setStatus("offline") 
        this.status=localStorage.getItem('Status')
      }

}

//this function handles pushing data that is stored in local to the cloud
//once the app gets back online
pushtocloudfromlocal(table){
  //push all locally stored weather to cloud 
  console.log("pushing table "+table)

  return new Promise((resolve, reject) => {

    if (table==="Daily Weather Observations"){
      this.weatherlocalservice.get_all_Weather_records().
      then(data => {
          this.weathers = data;

          this.weathers.forEach(record =>{
            this.newWeather.CA=record["CA"]
            this.newWeather.date=record["date"]
            this.newWeather.area_ice=record["area_ice"]
            this.newWeather.ice_thick=record["ice_thick"]
            this.newWeather.low_temp=record["low_temp"]
            this.newWeather.wind_dir=record["wind_dir"]
            this.newWeather.wind_speed=record["wind_speed"]
            this.newWeather.river_stage=record["river_stage"]
            this.newWeather.other_observations=record["other_observations"]
            this.newWeather.sort_time=record["sort_time"]

            console.log("adding weather from local to cloud")
            console.log(record)

            //add the locally stored Weather to Cloud (if the record was already there it is being added
            //but sense everything is the same it is basically doing nothing)
            this.weathercloudservice.add_Weather_record(this.newWeather) 

            //delete the record from local
            console.log('deleting:'+record["id"])
            this.weatherlocalservice.delete_Weather_record(record["id"]);
          })

          console.log("resolving weather")
          resolve(data)
      }); 
  }

  if (table==='Fall Food Availability'){
    //push all locally stored FoodAvails to cloud 
    this.foodavaillocalservice.get_all_FoodAvail_records().
    then(data => {
        this.foodavails = data;

        this.foodavails.forEach(record =>{
          this.newFoodAvail.CA=record['CA']
          this.newFoodAvail.Unit=record['Unit']
          this.newFoodAvail.Pool=record['Pool']
          this.newFoodAvail.WCS=record['WCS']
          this.newFoodAvail.Date=record['Date']
          this.newFoodAvail.Sort_time=record['Sort_time']
          this.newFoodAvail.corn_unharv=record['corn_unharv']
          this.newFoodAvail.corn_harv=record['corn_harv']
          this.newFoodAvail.corn_yield=record['corn_yield']
          this.newFoodAvail.corn_yield_field=record['corn_yield_field']
          this.newFoodAvail.beans_unharv=record['beans_unharv']
          this.newFoodAvail.beans_harv=record['beans_harv']
          this.newFoodAvail.beans_yield=record['beans_yield']
          this.newFoodAvail.beans_yield_field=record['beans_yield_field']
          this.newFoodAvail.milo_unharv=record['milo_unharv']
          this.newFoodAvail.milo_harv=record['milo_harv']
          this.newFoodAvail.milo_yield=record['milo_yield']
          this.newFoodAvail.milo_yield_field=record['milo_yield_field']
          this.newFoodAvail.wheat_green=record['wheat_green']
          this.newFoodAvail.wheat_harv=record['wheat_harv']
          this.newFoodAvail.soil_standing=record['soil_standing']
          this.newFoodAvail.soil_mowed=record['soil_mowed']
          this.newFoodAvail.soil_disced=record['soil_disced']
          this.newFoodAvail.millet_output=record['millet_output']
          this.newFoodAvail.foxtail_output=record['foxtail_output']
          this.newFoodAvail.rice_cut_output=record['rice_cut_output']
          this.newFoodAvail.panic_grass_output=record['panic_grass_output']
          this.newFoodAvail.crabgrass_output=record['crabgrass_output']
          this.newFoodAvail.sprangletop_output=record['sprangletop_output']
          this.newFoodAvail.lapathifolium_output=record['lapathifolium_output']
          this.newFoodAvail.pennsylvanicum_output=record['pennsylvanicum_output']
          this.newFoodAvail.coccineum_output=record['coccineum_output']
          this.newFoodAvail.water_pepper_output=record['water_pepper_output']
          this.newFoodAvail.pigweed_output=record['pigweed_output']
          this.newFoodAvail.bidens_output=record['bidens_output']
          this.newFoodAvail.other_seed_output=record['other_seed_output']
          this.newFoodAvail.open_water_output=record['open_water_output']
          this.newFoodAvail.recently_disced_output=record['recently_disced_output']
          this.newFoodAvail.chufa_output=record['chufa_output']
          this.newFoodAvail.redroot_output=record['redroot_output']
          this.newFoodAvail.sedge_output=record['sedge_output']
          this.newFoodAvail.rush_output=record['rush_output'] 

          console.log("adding foodavail from local to cloud")
          console.log(record)

          //add the locally stored Weather to Cloud (if the record was already there it is being added
          //but sense everything is the same it is basically doing nothing)
          if (this.newFoodAvail.CA){
           this.foodavailcloudservice.add_FoodAvail_record_from_local(this.newFoodAvail) 
          }

          //delete the record from local
          console.log('deleting:'+record["id"])
          this.foodavaillocalservice.delete_FoodAvail_record(record["id"]);
        })
        console.log("resolving foodavail")
        resolve(data)
    }); 
    }

    if (table==="Biweekly"){
      this.waterfoodlocalservice.get_all_WaterFood_records().
      then(data => {
          this.waterfoods = data;
  
          this.waterfoods.forEach(record =>{
            this.newWaterFood.CA=record["CA"],
            this.newWaterFood.Unit=record["Unit"],
            this.newWaterFood.Pool=record["Pool"],
            this.newWaterFood.Date=record["Date"],
            this.newWaterFood.percent_of_full_pool=record["percent_of_full_pool"];
            this.newWaterFood.less_than_six=record["less_than_six"];
            this.newWaterFood.seven_to_twelve=record["seven_to_twelve"]
            this.newWaterFood.thirteen_or_more=record["thirteen_or_more"]
            this.newWaterFood.habitat_standing=record["habitat_standing"]
            this.newWaterFood.habitat_disced=record["habitat_disced"]
            this.newWaterFood.habitat_mowed=record["habitat_mowed"]
            this.newWaterFood.habitat_harv_corn=record["habitat_harv_corn"]
            this.newWaterFood.habitat_unharv_corn=record["habitat_unharv_corn"]
            this.newWaterFood.habitat_harv_beans=record["habitat_harv_beans"]
            this.newWaterFood.habitat_unharv_beans=record["habitat_unharv_beans"]
            this.newWaterFood.habitat_harv_milo=record["habitat_harv_milo"]
            this.newWaterFood.habitat_unharv_milo=record["habitat_unharv_milo"]
            this.newWaterFood.habitat_browse=record["habitat_browse"]
            this.newWaterFood.ice_standing=record["ice_standing"]
            this.newWaterFood.ice_disced=record["ice_disced"]
            this.newWaterFood.ice_mowed=record["ice_mowed"]
            this.newWaterFood.ice_harv_corn=record["ice_harv_corn"]
            this.newWaterFood.ice_unharv_corn=record["ice_unharv_corn"]
            this.newWaterFood.ice_harv_beans=record["ice_harv_beans"]
            this.newWaterFood.ice_unharv_beans=record["ice_unharv_beans"]
            this.newWaterFood.ice_harv_milo=record["ice_harv_milo"]
            this.newWaterFood.ice_unharv_milo=record["ice_unharv_milo"]
            this.newWaterFood.ice_browse=record["ice_browse"]
            this.newWaterFood.notes=record["notes"]
            this.newWaterFood.response=record["response"]
            this.newWaterFood.actions=record["actions"]
            this.newWaterFood.Sort_time=record["Sort_time"]
            console.log("adding waterfood from local to cloud")
            console.log(record)
  
            //add the locally stored Weather to Cloud (if the record was already there it is being added
            //but sense everything is the same it is basically doing nothing)
             this.waterfoodcloudservice.add_WaterFood_record(this.newWaterFood) 
  
            //delete the record from local
            console.log('deleting:'+record["id"])
            this.waterfoodlocalservice.delete_WaterFood_record(record["id"]);
          })
          console.log("resolving waterfood")
          resolve(data);
      }); 
    }


    if (table==="WaterManagement"){
      console.log('getting water management')
      this.watermanagementlocalservice.get_all_WaterManagment_records().
      then(data => {
          this.watermanagements = data;

          this.watermanagements.forEach(record =>{
            this.newWaterManagement.CA=record["CA"],
            this.newWaterManagement.Unit=record["Unit"],
            this.newWaterManagement.Pool=record["Pool"],
            this.newWaterManagement.WCS=record["WCS"],
            this.newWaterManagement.Date=record["Date"],
            this.newWaterManagement.Elevation=record["Elevation"],
            this.newWaterManagement.Gate_manipulation=record["Gate_manipulation"],
            this.newWaterManagement.Gate_level=record["Gate_level"],
            this.newWaterManagement.Stoplog_change=record["Stoplog_change"],
            this.newWaterManagement.Stoplog_level=record["Stoplog_level"],
            this.newWaterManagement.Duck_numbers=record["Duck_numbers"],
            this.newWaterManagement.Goose_numbers=record["Goose_numbers"],
            this.newWaterManagement.Year=record["Year"],
            this.newWaterManagement.Time=record["Time"],
            this.newWaterManagement.Fiscal_year=record["Fiscal_year"],
            this.newWaterManagement.Notes=record["Notes"],
            this.newWaterManagement.Reasons=record["Reasons"],
            this.newWaterManagement.Sort_time=record["Sort_time"],
            this.newWaterManagement.Update_time=record["Update_time"],
            this.newWaterManagement.UID=record["UID"],
            this.newWaterManagement.Delete=record["Delete"]
            console.log("adding waterfood from local to cloud")
            console.log(record)
  
            //add the locally stored Weather to Cloud (if the record was already there it is being added
            //but sense everything is the same it is basically doing nothing)
             this.watermanagementcloudservice.add_WaterManagement_record(this.newWaterManagement) 
  
            //delete the record from local
            console.log('deleting:'+record["id"])
            this.watermanagementlocalservice.delete_WaterManagement_record(record["id"]);
          })
  
          console.log("resolving watermangement")
          resolve(data)
      }); 
    }
  });
}

//get last record for EVERY tree endpoint from cloud
downloadallprevs(table){
  console.log('downloading all prevs '+table)

  var CA=localStorage.getItem('CA')

  return new Promise((resolve, reject) => {
    if (table==='Daily Weather Observations'){
        console.log("downloading weather")
        console.log('selected CA:'+CA)
        this.weathercloudservice.get_prev_Weather_record(CA).subscribe(data => {
          data.forEach(doc => {
          console.log(doc.id)
            console.log("THIS is "+doc.id)
            var date=doc.id;
            
            
            this.weathercloudservice.get_Weather_record(CA,date).
            subscribe(data=>{
              console.log('Adding data :'+data.get('date'))
              console.log('Adding data :'+data.get('low temp'))
              this.newWeather.CA=data.get('CA')
              this.newWeather.date=data.get('date');
              this.newWeather.area_ice=data.get('area_ice');
              this.newWeather.ice_thick=data.get('ice_thick');
              this.newWeather.low_temp=data.get('low_temp')
              this.newWeather.wind_dir=data.get('wind_dir');
              this.newWeather.wind_speed=data.get('wind_speed')
              this.newWeather.river_stage=data.get('river_stage');
              this.newWeather.other_observations=data.get('other_observations') 
              this.newWeather.sort_time=data.get('sort_time') 

              this.weatherlocalservice.add_Weather_record(this.newWeather).
              then((addedWaterManagements: IWeather[]) => {
              if (addedWaterManagements.length > 0) {

                this.clearNewWeather();
                resolve(data)
              }
              })
              console.log('data not yet created')
            })
        });
      }); 
    }

    if (table==='WCSs'){
    //get all gaugestat records to see if they have already been downloaded
    this.WCSlocalservice.getAll(CA)
      .then(data =>{
        if (data.length>0){
          console.log("wcs data full")
          resolve(data)
        }

        else {
          //only download WCSs if they aren't already downloaded since these rarely change
          console.log("fetching wcss")
          this.cloud_db_service.getUnits(CA).subscribe(data => {
            data.forEach(doc =>{
              var unit =doc.id
              this.cloud_db_service.getPools(CA,unit).subscribe(data=>{
                data.forEach(doc =>{
                  var pool=doc.id
                  this.cloud_db_service.getWCS(CA,unit,pool).subscribe(data=>{
                    data.forEach(doc =>{ 
                      var wcs=doc.id
                      console.log("addin wcs "+wcs)
                      console.log("adding wcs "+this.newWCS)

                      let copyWCS=Object.assign({},this.newWCS);
                      copyWCS.CA=CA;
                      copyWCS.Unit=unit;
                      copyWCS.Pool=pool;
                      copyWCS.WCS=wcs
                      this.WCSlocalservice.add_WCS_record(copyWCS).
                      then((addedWCS: IWCS[]) => {
                        this.clearNewWCS();
                        resolve(data)
                      })
                    })
                })
                })
              })
            })
          });          
        }
      })
    }

    if (table==='Fall Food Availability'){

      console.log("Fall Fooad Avail CA is "+CA)
      
      this.cloud_db_service.getUnits(CA).subscribe(data => {
        data.forEach(doc => {
          console.log("Unit is"+doc.id)
          var Unit=doc.id;
          this.cloud_db_service.getPools(CA,Unit).subscribe(data => {
            data.forEach(doc => {
              console.log("Pool is"+doc.id)
              var Pool=doc.id;
              this.cloud_db_service.getWCS(CA,Unit,Pool).subscribe(data => {
                data.forEach(doc => {
                  console.log("WCS is"+doc.id)
                  var wcs=doc.id;
                  this.foodavailcloudservice.get_prev_FoodAvail_record(CA,Unit,Pool,wcs).subscribe(data => {
                    data.forEach(doc => {
                    console.log(doc.id)
                      console.log("Date is "+doc.id)
                      var date=doc.id;
                      this.foodavailcloudservice.get_FoodAvail_record(CA,Unit,Pool,wcs,date).
                      subscribe(data=>{
                        this.newFoodAvail.CA=data.get('CA')
                        this.newFoodAvail.Unit=data.get('Unit')
                        console.log('Unit is g '+this.newFoodAvail.Unit)
                        this.newFoodAvail.Pool=data.get('Pool')
                        this.newFoodAvail.WCS=data.get('WCS')
                        this.newFoodAvail.Date=data.get('Date')
                        this.newFoodAvail.Sort_time=data.get('Sort_time')
                        this.newFoodAvail.corn_unharv=data.get('corn_unharv')
                        this.newFoodAvail.corn_harv=data.get('corn_harv')
                        this.newFoodAvail.corn_yield=data.get('corn_yield')
                        this.newFoodAvail.corn_yield_field=data.get('corn_yield_field')
                        this.newFoodAvail.beans_unharv=data.get('beans_unharv')
                        this.newFoodAvail.beans_harv=data.get('beans_harv')
                        this.newFoodAvail.beans_yield=data.get('beans_yield')
                        this.newFoodAvail.beans_yield_field=data.get('beans_yield_field')
                        this.newFoodAvail.milo_unharv=data.get('milo_unharv')
                        this.newFoodAvail.milo_harv=data.get('milo_harv')
                        this.newFoodAvail.milo_yield=data.get('milo_yield')
                        this.newFoodAvail.milo_yield_field=data.get('milo_yield_field')
                        this.newFoodAvail.wheat_green=data.get('wheat_green')
                        this.newFoodAvail.wheat_harv=data.get('wheat_harv')
                        this.newFoodAvail.soil_standing=data.get('soil_standing')
                        this.newFoodAvail.soil_mowed=data.get('soil_mowed')
                        this.newFoodAvail.soil_disced=data.get('soil_disced')
                        this.newFoodAvail.millet_output=data.get('millet_output')
                        this.newFoodAvail.foxtail_output=data.get('foxtail_output')
                        this.newFoodAvail.rice_cut_output=data.get('rice_cut_output')
                        this.newFoodAvail.panic_grass_output=data.get('panic_grass_output')
                        this.newFoodAvail.crabgrass_output=data.get('crabgrass_output')
                        this.newFoodAvail.sprangletop_output=data.get('sprangletop_output')
                        this.newFoodAvail.lapathifolium_output=data.get('lapathifolium_output')
                        this.newFoodAvail.pennsylvanicum_output=data.get('pennsylvanicum_output')
                        this.newFoodAvail.coccineum_output=data.get('coccineum_output')
                        this.newFoodAvail.water_pepper_output=data.get('water_pepper_output')
                        this.newFoodAvail.pigweed_output=data.get('pigweed_output')
                        this.newFoodAvail.bidens_output=data.get('bidens_output')
                        this.newFoodAvail.other_seed_output=data.get('other_seed_output')
                        this.newFoodAvail.open_water_output=data.get('open_water_output')
                        this.newFoodAvail.recently_disced_output=data.get('recently_disced_output')
                        this.newFoodAvail.chufa_output=data.get('chufa_output')
                        this.newFoodAvail.redroot_output=data.get('redroot_output')
                        this.newFoodAvail.sedge_output=data.get('sedge_output')
                        this.newFoodAvail.rush_output=data.get('rush_output')

                        console.log("FOOOD: "+this.newFoodAvail)
                          
                        this.foodavaillocalservice.add_FoodAvail_record(this.newFoodAvail,this.moistsoilservice.newMoistSoil).
                        then((addedFoodAvails: IFoodAvail[]) => {
                        if (addedFoodAvails.length > 0) {
                          this.clearNewFoodAvail();
                          resolve(data)
                        }
                        })
                      })
                  });
                }); 
                });
              });
            });
          });
        });
      });
    }

    if (table==='Biweekly'){

      console.log('Biweekly CA is '+CA)

      this.cloud_db_service.getUnits(CA).subscribe(data => {
        data.forEach(doc => {
          console.log("Biweekly Unit is"+doc.id)
          var Unit=doc.id;
          this.cloud_db_service.getPools(CA,Unit).subscribe(data => {
            data.forEach(doc => {
              console.log("Biweekly Pool is"+doc.id)
              var Pool=doc.id;
                this.waterfoodcloudservice.get_prev_WaterFood_record(CA,Unit,Pool,"").subscribe(data => {
                  data.forEach(doc => {
                  console.log(doc.id)
                    console.log("Biweekly Date is "+doc.id)
                    var date=doc.id;
                    this.waterfoodcloudservice.get_WaterFood_record(CA,Unit,Pool,date).
                    subscribe(data=>{
                      this.newWaterFood.CA=data.get('CA');                                                                          
                      this.newWaterFood.Unit=Unit;
                      this.newWaterFood.Pool=Pool;
                      this.newWaterFood.Sort_time=data.get('Sort_time');
                      this.newWaterFood.Date=data.get('Date');
                      this.newWaterFood.percent_of_full_pool=data.get("Percent_of_Pool_Full");
                      this.newWaterFood.less_than_six=data.get("Percentage_Flooded_under_Six_Inches");
                      this.newWaterFood.seven_to_twelve=data.get("Percentage_Flooded_Seven_to_Tweleve_Inches");
                      this.newWaterFood.thirteen_or_more=data.get("Percentage_Flooded_Thirteen_or_more_Inches");
                      this.newWaterFood.habitat_standing=data.get("Percentage_Habitat_Flooded_Moist_Soil_Standing");
                      this.newWaterFood.habitat_mowed=data.get("Percentage_Habitat_Flooded_Moist_Soil_Mowed");
                      this.newWaterFood.habitat_disced=data.get("Percentage_Habitat_Flooded_Moist_Soil_Disced");
                      this.newWaterFood.habitat_unharv_corn=data.get("Percentage_of_Habitat_Flooded_Unharvested_Corn");
                      this.newWaterFood.habitat_harv_corn=data.get("Percentage_of_Habitat_Flooded_Harvested_Corn");
                      this.newWaterFood.habitat_unharv_beans=data.get("Percentage_of_Habitat_Flooded_Unharvested_Beans");
                      this.newWaterFood.habitat_harv_beans=data.get("Percentage_of_Habitat_Flooded_Harvested_Beans");
                      this.newWaterFood.habitat_unharv_milo=data.get("Percentage_of_Habitat_Flooded_Unharvested_Milo");
                      this.newWaterFood.habitat_harv_milo=data.get("Percentage_of_Habitat_Flooded_Harvested_Milo");
                      this.newWaterFood.habitat_browse=data.get("Percentage_of_Habitat_Flooded_Green_Browse");
                      this.newWaterFood.ice_standing=data.get("Percentage_of_Ice_on_Flooded_Habitat_Moist_Soil_Standing");
                      this.newWaterFood.ice_mowed=data.get("Percentage_of_Ice_on_Flooded_Habitat_Moist_Soil_Mowed");
                      this.newWaterFood.ice_disced=data.get("Percentage_of_Ice_on_Flooded_Habitat_Moist_Soil_Disced");
                      this.newWaterFood.ice_unharv_corn=data.get("Percentage_of_Ice_on_Flooded_Habitat_Moist_Soil_Unharvested_Corn");
                      this.newWaterFood.ice_harv_corn=data.get("Percentage_of_Ice_on_Flooded_Habitat_Moist_Soil_Harvested_Corn");
                      this.newWaterFood.ice_unharv_beans=data.get("Percentage_of_Ice_on_Flooded_Habitat_Moist_Soil_Unharvested_Beans");
                      this.newWaterFood.ice_harv_beans=data.get("Percentage_of_Ice_on_Flooded_Habitat_Moist_Soil_Harvested_Beans");
                      this.newWaterFood.ice_unharv_milo=data.get("Percentage_of_Ice_on_Flooded_Habitat_Moist_Soil_Unharvested_Milo");
                      this.newWaterFood.ice_harv_milo=data.get("Percentage_of_Ice_on_Flooded_Habitat_Moist_Soil_Harvested_Milo");
                      this.newWaterFood.ice_browse=data.get("Percentage_of_Ice_on_Flooded_Habitat_Moist_Soil_Ice_Browse");
                      this.newWaterFood.notes=data.get("Notes")
                      this.newWaterFood.actions=data.get("Upcoming_actions");
                      this.newWaterFood.response=data.get("Response_to_last_action");
                      this.newWaterFood.fiscal_year=data.get("fiscal_year");

                      console.log("BIWEEKLY: "+this.newWaterFood)
                          
                      this.waterfoodlocalservice.add_WaterFood_record(this.newWaterFood).
                      then((addedWaterFoods: IWaterFood[]) => {
                      if (addedWaterFoods.length > 0) {
                        this.clearNewWaterFood();
                        resolve(data)
                      }
                      })
                });
              }); 
            });
          }); 
        });
      }); 
    });
  }

  if (table==='WaterManagement'){
      this.cloud_db_service.getUnits(CA).subscribe(data => {
        data.forEach(doc => {
          console.log("CA is"+doc.id)
          var Unit=doc.id;
          this.cloud_db_service.getPools(CA,Unit).subscribe(data => {
            data.forEach(doc => {
              console.log("CA is"+doc.id)
              var Pool=doc.id;
              this.cloud_db_service.getWCS(CA,Unit,Pool).subscribe(data => {
                data.forEach(doc => {
                  console.log("CA is"+doc.id)
                  var wcs=doc.id;
                  this.watermanagementcloudservice.get_prev_7_WaterManagement_records(CA,Unit,Pool,wcs).subscribe(data => {
                    data.forEach(doc => {
                    console.log(doc.id)
                      var date=doc.id;
                      this.watermanagementcloudservice.get_WaterManagement_record(CA,Unit,Pool,wcs,date).
                      subscribe(data=>{
                        this.newWaterManagement.CA=CA;
                        this.newWaterManagement.Unit=Unit;
                        this.newWaterManagement.Pool=Pool;
                        this.newWaterManagement.WCS=wcs;
                        this.newWaterManagement.Date=data.get('Date');
                        this.newWaterManagement.Elevation=data.get('Elevation');
                        this.newWaterManagement.Gate_manipulation=data.get('Gate_manipulation');
                        this.newWaterManagement.Gate_level=data.get('Gate_level');
                        this.newWaterManagement.Stoplog_change=data.get('Stoplog_change');
                        this.newWaterManagement.Stoplog_level=data.get('Stoplog_level');
                        this.newWaterManagement.Duck_numbers=data.get('Duck_numbers')
                        this.newWaterManagement.Goose_numbers=data.get('Goose_numbers');
                        this.newWaterManagement.Notes=data.get('Notes');
                        this.newWaterManagement.Reasons=data.get('Reasons')
                        this.newWaterManagement.Sort_time=data.get('Sort_time')
                        this.newWaterManagement.UID=data.get('UID')
                        this.newWaterManagement.Delete=data.get('Delete')
                        this.newWaterManagement.Update_time=data.get('Update_time')
                    
                        //put watermanagement record into IndexDB
                        this.watermanagementlocalservice.add_WaterManagement_record(this.newWaterManagement).
                        then((addedWaterManagements: IWatermanagement[]) => {
                          if (addedWaterManagements.length > 0) {
                            this.clearNewWaterManagement();
                            resolve(data)
                          }
                        })                   
                      })
                    });
                  });
                });
              });
            });
          });
        });
      });

    }

    if (table==='Gauge Stats'){
      //not sure how if loading spinner is delaying cause database is delaying in writing, or if its actaully delaying to 
      //early

      //get all gaugestat records to see if they have already been downloaded
      this.gaugestatslocalservice.getAll(CA)
      .then(data =>{
        if (data.length>0){
          console.log("data full")
          console.log("resolving prev gauge stats")
          resolve(data)
        }

        else {
          console.log("in gauge stats")

          var num_units=0
          var unit_count=0
          var num_pools=0
          var pool_count=0
          var num_wcs=0
          var wcs_count=0
          var num_gauges=0
          var gauge_count=0
    
          //download symbology image 
          var symbourl='https://firebasestorage.googleapis.com/v0/b/waterfowltool.appspot.com/o/symbology%2FSymbology_Image.JPG?alt=media&token=d746a218-ab78-48dd-8a06-a76b45c41dd0'
          this.loadImage(symbourl,this.cFunction,this.newImage,this.imagelocalservice,"symbo")
    
          this.cloud_db_service.getUnits(CA).subscribe(data => {
            num_units+=data.size
            console.log("num units:"+num_units)
            data.forEach((doc) => {
              unit_count++
              var Unit=doc.id;
              console.log("...Unit is "+Unit)
              this.cloud_db_service.getPools(CA,Unit).subscribe(data => {
                console.log("num pools:"+num_pools)
                num_pools+=data.size
                data.forEach(doc => {
                  pool_count++
                  var Pool=doc.id;
                  console.log("...Pool is "+Pool)
                  this.cloud_db_service.getWCS(CA,Unit,Pool).subscribe(data => {
                    console.log("num wcs:"+num_wcs)
                    num_wcs+=data.size
                    data.forEach(doc => {
                      wcs_count++
                      var wcs=doc.id;
                      console.log("...wcs is "+wcs)
                      this.cloud_db_service.getGauges(CA,Unit,Pool,wcs).subscribe(data => {
                        num_gauges+=data.size
                        console.log("num gauges:"+num_gauges)
                        data.forEach(doc => {
                          gauge_count++
                          var gauge=doc.id;
                          console.log("...Gauge is "+gauge)
                          //get name of image
                          this.gaugestatscloudservice.getImageName(CA,Unit,Pool,wcs,gauge).subscribe(data => {
    
                              var image_name=data.get('Image_Name')
    
                              console.log("...Image name is"+image_name)
    
                              //make a deep copy of the object otherwise one same record will written for every record
                              let copystat=Object.assign({},this.newGaugeStat);
    
                              //get the image from the storage bucket
                              var imageurl = this.gaugestatscloudservice.getImage(CA,Unit,Pool,wcs,gauge,image_name).then(imageurl =>{
    
                                console.log(imageurl)
    
                                //get stats for the gauge level
                                this.gaugestatscloudservice.getHabitat(CA,Unit,Pool,wcs,gauge).subscribe(data => {
    
                                  copystat.CA=CA;
                                  copystat.Unit=Unit;
                                  copystat.Pool=Pool;
                                  copystat.WCS=wcs;
                                  copystat.Gauge=gauge;
                                  copystat.Image_Name=image_name;
                                  copystat.Total_Acres=data.get('Total_Acres')
                                  copystat.Dry=data.get('Dry_not_flooded')
                                  copystat.Sixinch=data.get('Shallowly_Flooded_0_6in')
                                  copystat.Twelveinch=data.get('Shallowly_Flooded_6_12in')
                                  copystat.Eightteeninch=data.get('Shallowly_Flooded_12_18in')
                                  copystat.Flooded=data.get('Full_Flooded_18in')
    
                                  copystat.Crop_Stats=[];
    
                                  console.log("...Dry is "+copystat.Dry)
    
                                  //put the image into the database as a blob
                                  this.loadImage(imageurl,this.cFunction,this.newImage,this.imagelocalservice,image_name) 
                                  
                                  //get the crop names
                                  this.gaugestatscloudservice.getCrops(CA,Unit,Pool,wcs,gauge).subscribe(data => {
    
                                      console.log("...snapshot is "+data.docs.length)
                                      var counter=0;
                                      var length=data.docs.length;
                                      //get stats for each crop
    
                                      //if there is crop data (sometimes there wont be)
                                      if (length>0){
                                        data.forEach(doc =>{
    
                                          //make a deep copy of the object otherwise one same record will written for every record
                                          let cropcopy=Object.assign({},this.newCropStats);
    
                                          console.log("...Crop Name is" + doc.id)
                                          var crop_name = doc.id
    
                                          cropcopy.Name = crop_name
                                          
                                          this.gaugestatscloudservice.getCropStats(CA,Unit,Pool,wcs,gauge,crop_name).subscribe(data => {
    
                                            console.log("...total acres is "+data.get('Total Acres'))
                                          
                                            counter++;
    
                                            cropcopy.Total_Acres=data.get('Total Acres')
                                            cropcopy.Dry=data.get('Dry_not_flooded')
                                            cropcopy.Sixinch=data.get('Shallowly_Flooded_0_6in')
                                            cropcopy.Twelveinch=data.get('Shallowly_Flooded_6-12in')
                                            cropcopy.Eightteeninch=data.get('Shallowly_Flooded_12_18in')
                                            cropcopy.Flooded=data.get('Full_Flooded_18in')
    
    
                                            console.log("...crop list is "+cropcopy)
    
                                            console.log("...counter is "+counter)
                                            
                                            copystat.Crop_Stats.push(cropcopy)
    
                                            if (counter === length){
                                              this.pushGaugeStatRecord(copystat,this.gaugestatslocalservice)
                                              console.log("resolving 1 ")
                                              //resolve(data)
                                            }
                                          });
                                        })
                                      }
    
                                      //if there was no crop data finsih pushing the record
                                      else {
                                        this.pushGaugeStatRecord(copystat,this.gaugestatslocalservice)
                                        console.log("resolving 2 ")
                                        //resolve(data)
                                      }
    
    
                                      if (unit_count===num_units && pool_count===num_pools && wcs_count===num_wcs && gauge_count===num_gauges){
                                        console.log("resolving units2:"+unit_count)
                                        console.log("resolving units4:"+pool_count)
                                        console.log("resolving units6:"+wcs_count)
                                        console.log("resolving units8:"+gauge_count)
                                        resolve(data)
                                      }
                                  });
                                });
                              });
                              
                          });
                      });
                    });
                  });
                });
              });
            });
          });
          });
        }
      });
      }
    })
}

updatecloudanddownloadrecords(){
  Promise.all([this.pushtocloudfromlocal('Daily Weather Observations'),this.pushtocloudfromlocal('Fall Food Availability'),
  this.pushtocloudfromlocal('Biweekly'),this.pushtocloudfromlocal('WaterManagement')]).then(result=>{
    console.log('we waited ' +result)
    Promise.all([this.downloadallprevs('Daily Weather Observations'),this.downloadallprevs('Fall Food Availability'),
    this.downloadallprevs('Biweekly'),this.downloadallprevs('WaterManagement'),this.downloadallprevs('WCSs'),
    this.downloadallprevs('Gauge Stats')]).then(result=>{
      this.closeLoadingDialog();
    })
  }); 
}

generateUUID() { // Public Domain/MIT
  var d = new Date().getTime();
  if (typeof performance !== 'undefined' && typeof performance.now === 'function'){
      d += performance.now(); //use high-precision timer if available
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
}

pushGaugeStatRecord(copystat,gaugestatslocalservice){
  gaugestatslocalservice.addGaugeStat(copystat).
  then((addedGaugeStats: IGaugeStats[]) => {
  }) 
}

loadImage(url,cFunction,newImage,service,image_name){

  console.log("image url is "+url)
  var xhttp;
  xhttp=new XMLHttpRequest();
  xhttp.responseType = 'blob';
  xhttp.onreadystatechange = function() {
    console.log("ready is "+this.readyState)
    console.log("ready staus is "+this.status)
    //code was previously getting the image url from firebase storage bucket but was storing image
    //in indexdb as null because CORS was not probably configured in storage bucket. I fixed it using instructions
    //here https://stackoverflow.com/questions/37760695/firebase-storage-and-access-control-allow-origin
    if (this.readyState == 4) {
      cFunction(this,newImage,service,image_name);
    }
 };
  xhttp.open("GET", url, true);
  xhttp.send();
}

cFunction(xhttp,newImage,service,image_name){
  var blob = xhttp.response;
  newImage.Image=blob
  newImage.Image_Name=image_name;

  console.log('ready adding image '+typeof(newImage.Image_Name))

  //put gaugestat record into IndexDB
  service.addImage(newImage).
  then((addedImages: IImage[]) => {
    if (addedImages.length > 0) {
    }
  })    
}

clearNewWCS() {
  this.newWCS = new WCS();
}

clearNewWaterManagement() {
  this.newWaterManagement = new Watermanagement();
}

clearNewWaterFood() {
  this.newWaterFood = new WaterFood();
}

clearNewWeather() {
  this.newWeather = new Weather();
}

clearNewFoodAvail() {
  this.newFoodAvail = new FoodAvail();
}

logout(){
  console.log('success')
  //this.authservice.setLoggedIn(false);
  console.log(localStorage.getItem('logged out'));
  this.openLogoutDialog();
}

openCASelectionDialog(): void {
  const dialogRef = this.dialog.open(CASelectionDialog, {
    width: '250px',
  });

  dialogRef.afterClosed().subscribe(result => {
    console.log('The dialog was closed');
    
    this.initial_onlineCheck();
  });
}

openUpdatingDialog(): void {
  const dialogRef = this.dialog.open(UpdatingDialog, {
    width: '250px',
  });

  dialogRef.afterClosed().subscribe(result => {
    console.log('The dialog was closed');
    this.openLoadingDialog();
    this.updatecloudanddownloadrecords();
  });
}

openDataWrittenDialog(): void {
  const dialogRef = this.dialog.open(DataWrittenDialog, {
    width: '250px',
  });

  dialogRef.afterClosed().subscribe(result => {
    console.log('The dialog was closed');
    location.reload();
  });
}

openConnectionStatusDialog(): void {
    const dialogRef = this.dialog.open(ConnectionStatusDialog, {
      width: '250px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
}

openLoginDialog(): void {
  const dialogRef = this.dialog.open(LoginDialog, {
    width: '250px',
  });

  dialogRef.afterClosed().subscribe(result => {
    console.log('The dialog was closed');
  });
}

openLogoutDialog(): void {
  const dialogRef = this.dialog.open(LogoutDialog, {
    width: '250px',
  });

  dialogRef.afterClosed().subscribe(result => {
    console.log('The dialog was closed');
  });
}

openLoadingDialog(): void {
  const dialogRef = this.dialog.open(LoadingDialog, {
    width: '250px',
  });

  dialogRef.afterClosed().subscribe(result => {
    console.log('The dialog was closed');
  });
}

closeLoadingDialog(): void {
  const dialogRef = this.dialog.closeAll();
}


}

@Component({
  selector: 'connection-status-popup',
  templateUrl: 'connection-status-popup.html',
  styleUrls:["dialog-styles.css"]
})
export class UpdatingDialog {

  public status;

  offline_message="No internet connection detected! Any data entered will be stored locally in browser.";

  online_message="Connection detected. Your local data is going to be used to update the cloud now.";

  constructor(public dialogRef: MatDialogRef<UpdatingDialog>) {}

  ngOnInit(){
    this.status=localStorage.getItem('Status')
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}


@Component({
  selector: 'connection-status-popup',
  templateUrl: 'connection-status-popup.html',
  styleUrls:["dialog-styles.css"]
})
export class ConnectionStatusDialog {

  public status;

  offline_message="No internet connection detected! Any data entered will be stored locally in browser.";

  online_message="Internet connection detected! Any data entered will be pushed directly to the cloud.\
  Any locally stored data is now also being pushed to the cloud.";

  constructor(public dialogRef: MatDialogRef<ConnectionStatusDialog>) {}

  ngOnInit(){
    this.status=localStorage.getItem('Status')
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}

@Component({
  selector: 'data-written-dialog',
  templateUrl: 'data-written-dialog.html',
})
export class DataWrittenDialog {

  public status;

  offline_message="No Internet Connection Detected. Remember to open the app with a connection periodically so that your data makes it to the cloud.";

  online_message="Internet Connection Detected. Entry was saved to the cloud." ;

  constructor(public dialogRef: MatDialogRef<DataWrittenDialog>) {}

  ngOnInit(){
    this.status=localStorage.getItem('Status')
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'login-dialog',
  templateUrl: 'login-dialog.html',
})
export class LoginDialog {  
  username: string;
  password: string;

  constructor(public dialogRef: MatDialogRef<LoginDialog>) {}

  login() : void {
    if(this.username == 'admin' && this.password == 'admin'){
     //this.router.navigate(["user"]);
     console.log('success')
     //this.authservice.setLoggedIn(true);
     console.log(localStorage.getItem('logged in'));
     this.dialogRef.close();
    }else {
      console.log("Invalid credentials");
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'logout-dialog',
  templateUrl: 'logout-dialog.html',
})
export class LogoutDialog {  

  constructor(public dialogRef: MatDialogRef<LogoutDialog>) {}

    onNoClick(): void {
      this.dialogRef.close();
    }
}


@Component({
  selector: 'CAselection',
  templateUrl: 'CASelection.html',
  styleUrls:["CASelection.css"]
})
export class CASelectionDialog {

  selectedCA: string;
  CAs: string[] = ['BK LEECH', 'Duck_Creek', 'Eagle_Bluffs', 'Grand Pass'];

  constructor(public dialogRef: MatDialogRef<CASelectionDialog>,private cookieservice:CookieService) {}
  

  onNoClick(): void {
    this.cookieservice.setCA(this.selectedCA);
    this.dialogRef.close();
  }

}

@Component({
  selector: 'LoadingDialog',
  templateUrl: 'loading-dialog.html',
  styleUrls:["loading-dialog.css"]
})
export class LoadingDialog {


  constructor(public dialogRef: MatDialogRef<CASelectionDialog>,private cookieservice:CookieService) {}
  
  onNoClick(): void {
    this.dialogRef.close();
  }

}
