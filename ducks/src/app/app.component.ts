import { Component, ModuleWithComponentFactories,Inject } from '@angular/core';
import {SwUpdate} from '@angular/service-worker';
import { ConnectionService } from 'ng-connection-service';
import { stripSummaryForJitFileSuffix } from '@angular/compiler/src/aot/util';
import { Location } from '@angular/common';

import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {AuthService} from 'src/app/service/auth.service';
import {CookieService} from 'src/app/service/cookie.service';

import {dbService} from 'src/app/service/db.service';

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


import { LocalWaterFood } from 'src/app/service/waterfood-local.service';
import {BiweeklyWaterFoodService} from 'src/app/service/waterfood-cloud.service';
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

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {

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

  public isLoading=false;

  //this makes sure updates are properly loaded.
  //needed cause pwas caching can make it hard to seee updates
  constructor(private connectionService:ConnectionService,updates:SwUpdate,public dialog: MatDialog, private location:Location,
    private authservice:AuthService,private weatherlocalservice:WeatherLocalService,private weathercloudservice:WeatherCloudService, private cookieservice:CookieService,
    private foodavailcloudservice:FoodAvailCloudService, private foodavaillocalservice: FoodAvailLocalService, private dbservice: dbService,
    public moistsoilservice:MoistsoilService,private waterfoodcloudservice:BiweeklyWaterFoodService, 
    private waterfoodlocalservice:LocalWaterFood,private watermanagementlocalservice: LocalWaterManagementService, 
    private watermanagementcloudservice: WatermanagementCloudService){
    
    //this is only run when the connection status changes
    this.connectionService.monitor().subscribe(isConnected => {
      this.isConnected = isConnected;
      
      if (this.isConnected) {
        this.cookieservice.setStatus("online") 
        this.status=localStorage.getItem('Status')
        this.openConnectionStatusDialog();
        
      }
      else {
        this.cookieservice.setStatus("offline") 
        this.status=localStorage.getItem('Status')
        this.openConnectionStatusDialog();
      }
    })
  }
  
  ngOnInit(){
    console.log(this.location.path())
    this.page=this.location.path()

    //find out which page you are on 
    if (this.page===""){
      this.openCASelectionDialog();
    }
  } 

  initial_onlineCheck() {
      console.log("CA in local storage is "+localStorage.getItem('CA'))
      this.selected_CA=localStorage.getItem('CA')
      this.online_status = window.navigator.onLine;
      if (this.online_status){
        //push all records into cloud
        this.pushtocloudfromlocal()
        this.cookieservice.setStatus("online") 
        this.status=localStorage.getItem('Status')
      }      

      else{
        this.cookieservice.setStatus("offline") 
        this.status=localStorage.getItem('Status')
      }

      var loginstatus=localStorage.getItem('logged in')
      console.log("loginstatus is "+loginstatus)
      if(loginstatus !== 'true'){
        this.openLoginDialog();
        this.openConnectionStatusDialog();
      }
}

//this function handles pushing data that is stored in local to the cloud
//once the app gets back online
pushtocloudfromlocal(){

  this.isLoading=true;
  this.openLoadingDialog()
  console.log("Loading is "+this.isLoading)
  console.log("pushing to cloud from local")

  //push all locally stored weather to cloud 
  this.weatherlocalservice.getWeather_all().
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
           this.weathercloudservice.addWeather(this.newWeather) 

          //delete the record from local
          console.log('deleting:'+record["id"])
          this.weatherlocalservice.deleteWeather(record["id"]);
        })

        this.downloadallprevs('Daily Weather Observations');
    }); 

  //push all locally stored FoodAvails to cloud 
  this.foodavaillocalservice.getFoodAvail().
    then(data => {
        this.foodavails = data;

        this.foodavails.forEach(record =>{
          this.newFoodAvail.CA=record['CA']
          this.newFoodAvail.unit=record['unit']
          this.newFoodAvail.pool=record['pool']
          this.newFoodAvail.structure=record['structure']
          this.newFoodAvail.date=record['date']
          this.newFoodAvail.sort_time=record['sort_time']
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
           this.foodavailcloudservice.addFoodAvail(this.newFoodAvail) 

          //delete the record from local
          console.log('deleting:'+record["id"])
          this.foodavaillocalservice.deleteFoodAvail(record["id"]);
        })

        this.downloadallprevs('Fall Food Availability')
    }); 

  //push all locally stored waterfood to cloud 
  this.waterfoodlocalservice.getData().
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
           this.waterfoodcloudservice.addWaterFood(this.newWaterFood) 

          //delete the record from local
          console.log('deleting:'+record["id"])
          this.waterfoodlocalservice.deleteWaterFood(record["id"]);
        })

        this.downloadallprevs('Biweekly');
    }); 
    this.watermanagementlocalservice.getWaterManagment().
    then(data => {
        this.watermanagements = data;

        this.watermanagements.forEach(record =>{
          this.newWaterManagement.CA=record["CA"],
          this.newWaterManagement.Unit=record["Unit"],
          this.newWaterManagement.Pool=record["Pool"],
          this.newWaterManagement.Structure=record["Structure"],
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
          this.newWaterManagement.Sort_time=record["Sort_time"]
          console.log("adding waterfood from local to cloud")
          console.log(record)

          //add the locally stored Weather to Cloud (if the record was already there it is being added
          //but sense everything is the same it is basically doing nothing)
           this.watermanagementcloudservice.addWaterManagement(this.newWaterManagement) 

          //delete the record from local
          console.log('deleting:'+record["id"])
          this.watermanagementlocalservice.deleteWaterManagement(record["id"]);
        })

        this.downloadallprevs('WaterManagement');
        
        this.isLoading=false;
        this.closeLoadingDialog();
        console.log("Loading is "+this.isLoading)
    }); 
}

//get last record for EVERY tree endpoint from cloud
downloadallprevs(table){
  console.log('downloading all prevs')
  if (table==='Daily Weather Observations'){
      console.log("downloading weather")
      console.log('selected CA:'+this.selected_CA)
      this.weathercloudservice.getprevWeather(this.selected_CA).subscribe(data => {
        data.forEach(doc => {
        console.log(doc.id)
          console.log("THIS is "+doc.id)
          var date=doc.id;
          
          
          this.weathercloudservice.getWeather(this.selected_CA,date).
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

            this.weatherlocalservice.addWeather(this.newWeather).
            then((addedWaterManagements: IWeather[]) => {
            if (addedWaterManagements.length > 0) {

        
              this.weathers.push(addedWaterManagements[0]);
              this.clearNewWeather();
            }
            })
            console.log('data not yet created')
          })
          
      });
    }); 
  }

  if (table==='Fall Food Availability'){

    console.log("Fall Fooad Avail CA is "+this.selected_CA)
    
    this.dbservice.getUnits(this.selected_CA).subscribe(data => {
      data.forEach(doc => {
        console.log("Unit is"+doc.id)
        var Unit=doc.id;
        this.dbservice.getPools(this.selected_CA,Unit).subscribe(data => {
          data.forEach(doc => {
            console.log("Pool is"+doc.id)
            var Pool=doc.id;
            this.dbservice.getWCS(this.selected_CA,Unit,Pool).subscribe(data => {
              data.forEach(doc => {
                console.log("WCS is"+doc.id)
                var wcs=doc.id;
                this.foodavailcloudservice.getprevFoodAvails(this.selected_CA,Unit,Pool,wcs).subscribe(data => {
                  data.forEach(doc => {
                  console.log(doc.id)
                    console.log("Date is "+doc.id)
                    var date=doc.id;
                    this.foodavailcloudservice.getFoodAvail(this.selected_CA,Unit,Pool,wcs,date).
                    subscribe(data=>{
                      this.newFoodAvail.CA=data.get('CA')
                      this.newFoodAvail.unit=data.get('unit')
                      this.newFoodAvail.pool=data.get('pool')
                      this.newFoodAvail.structure=data.get('wcs')
                      this.newFoodAvail.date=data.get('date')
                      this.newFoodAvail.sort_time=data.get('sort_time')
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
                        
                      this.foodavaillocalservice.addFoodAvail(this.newFoodAvail).
                      then((addedFoodAvails: IFoodAvail[]) => {
                      if (addedFoodAvails.length > 0) {
                        this.clearNewFoodAvail();
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

    console.log('Biweekly CA is '+this.selected_CA)

    this.dbservice.getUnits(this.selected_CA).subscribe(data => {
      data.forEach(doc => {
        console.log("Biweekly Unit is"+doc.id)
        var Unit=doc.id;
        this.dbservice.getPools(this.selected_CA,Unit).subscribe(data => {
          data.forEach(doc => {
            console.log("Biweekly Pool is"+doc.id)
            var Pool=doc.id;
              this.waterfoodcloudservice.getprevWaterFood(this.selected_CA,Unit,Pool,"").subscribe(data => {
                data.forEach(doc => {
                console.log(doc.id)
                  console.log("Biweekly Date is "+doc.id)
                  var date=doc.id;
                  this.waterfoodcloudservice.getWaterFood(this.selected_CA,Unit,Pool,date).
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
                        
                    this.waterfoodlocalservice.addData(this.newWaterFood).
                    then((addedWaterFoods: IWaterFood[]) => {
                    if (addedWaterFoods.length > 0) {
                      this.clearNewWaterFood();
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
    this.dbservice.getUnits(this.selected_CA).subscribe(data => {
      data.forEach(doc => {
        console.log("CA is"+doc.id)
        var Unit=doc.id;
        this.dbservice.getPools(this.selected_CA,Unit).subscribe(data => {
          data.forEach(doc => {
            console.log("CA is"+doc.id)
            var Pool=doc.id;
            this.dbservice.getWCS(this.selected_CA,Unit,Pool).subscribe(data => {
              data.forEach(doc => {
                console.log("CA is"+doc.id)
                var wcs=doc.id;
                this.watermanagementcloudservice.getprevWaterManagement(this.selected_CA,Unit,Pool,wcs,"").subscribe(data => {
                  data.forEach(doc => {
                  console.log(doc.id)
                    var date=doc.id;
                    this.watermanagementcloudservice.getWaterManagement(this.selected_CA,Unit,Pool,wcs,date).
                    subscribe(data=>{
                      this.newWaterManagement.CA=this.selected_CA;
                      this.newWaterManagement.Unit=Unit;
                      this.newWaterManagement.Pool=Pool;
                      this.newWaterManagement.Structure=wcs;
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
                  
                      //put watermanagement record into IndexDB
                      this.watermanagementlocalservice.addWaterManagement(this.newWaterManagement).
                      then((addedWaterManagements: IWatermanagement[]) => {
                        if (addedWaterManagements.length > 0) {
                          this.clearNewWaterManagement();
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
  this.authservice.setLoggedIn(false);
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

  offline_message="No internet connection detected. Entry was saved locally to the browser. App will push this data to the cloud\
  once it is open and detects an internet connection. DO NOT DELETE HISTORY OR COOKIES BEFORE THIS HAPPENS OR ENTRY WILL BE LOST.";

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

  constructor(public dialogRef: MatDialogRef<LoginDialog>,private authservice:AuthService) {}

  login() : void {
    if(this.username == 'admin' && this.password == 'admin'){
     //this.router.navigate(["user"]);
     console.log('success')
     this.authservice.setLoggedIn(true);
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
