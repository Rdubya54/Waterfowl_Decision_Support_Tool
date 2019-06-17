import { Component, OnInit} from '@angular/core';
import { LocalWaterFood } from 'src/app/service/waterfood-local.service';
import { AngularFireDatabase } from 'angularfire2/database';
import {MediaMatcher} from '@angular/cdk/layout';
import {ChangeDetectorRef, OnDestroy} from '@angular/core';
import {Globals} from 'src/app/extra/globals';
import {AppComponent} from 'src/app/app.component';

import {dbService} from 'src/app/service/db.service';
import {LocalDbService} from 'src/app/service/local-db.service'
import {BiweeklyWaterFoodService} from 'src/app/service/waterfood-cloud.service';

import {
  WaterFood,
  IWaterFood
} from 'src/app/model/water-food';
import { stringToKeyValue } from '@angular/flex-layout/extended/typings/style/style-transforms';

@Component({
  selector: 'app-biweekly-water-food',
  templateUrl: './biweekly-water-food.component.html',
  styleUrls: ['./biweekly-water-food.component.css']
})
export class BiweeklyWaterFoodComponent implements OnInit {

  breakpoint:number;
  breakpoint_top:number;

  public CA_list: string[]=[];
  public selected_CA;
  public unit_list: string[]=[];
  public selected_unit; 
  public Pool_list: string[]=[];
  public selected_Pool;
  public prev_data:string[]=[];
  public date_list: string[]=["Create New Record"];
  public selected_date;

  private localservice: LocalWaterFood;
  waterfoods: any[];
  newWaterFood: IWaterFood = new WaterFood();
  local_records: any[];

  public previous_records;
  public second_previous_records;

  public buttonName: any = true;
  toggleActive:boolean = false;

  constructor(private comp:AppComponent,private localService: LocalWaterFood,  public globals:Globals,
    private dbservice_cloud:dbService, private dbservice_local:LocalDbService,private cloudservice:BiweeklyWaterFoodService) {
      this.localservice = localService;
      this.dbservice_cloud=dbservice_cloud;
      this.cloudservice=cloudservice;
    }


  ngOnInit() {
    this.breakpoint = (window.innerWidth <= 768) ? 1 : 4;
    this.breakpoint_top = (window.innerWidth <= 768) ? 1 : 1;

    this.CA_list=[];
    this.unit_list=[];
    this.Pool_list=[];
    this.date_list=["Create New Record"];

    //if app is online push any locally cached data to the cloud
    if (this.globals.role==="online"){
      /* this.pushtocloudfromlocal(); */

      this.dbservice_cloud.getCAs().subscribe(data => {
        data.forEach(doc => {
          this.CA_list.push(doc.id)
        });
      });
    }

    if (this.globals.role=="offline"){
       this.dbservice_local.getCAs().then(data => {
        this.waterfoods = data;

        this.waterfoods.forEach(record =>{
            var CA=record["CA"]
            this.CA_list.push(CA)
            console.log(this.CA_list)
        });
      });
    }
  }

//get units for drop down
getUnits(CA){
  this.unit_list=[];
  this.Pool_list=[];

  if (this.globals.role==="online"){
  this.dbservice_cloud.getUnits(CA).subscribe(data => {
    data.forEach(doc => {
      console.log("unit is "+doc.id)
      this.unit_list.push(doc.id)
    });
  });
  }

  else if (this.globals.role==="offline"){
    this.dbservice_local.getUnits(CA).then(data => {
      this.waterfoods = data;

      this.waterfoods.forEach(record =>{
          var Unit=record["Unit"]
          this.unit_list.push(Unit)
          console.log(this.unit_list)
      });
    });    
  }
}

//get pools for drop down
getPools(CA,unit){
  this.Pool_list=[];

  if (this.globals.role==="online"){
  this.dbservice_cloud.getPools(CA,unit).subscribe(data => {
    data.forEach(doc => {
      this.Pool_list.push(doc.id)
    });
  });
  }

  else if (this.globals.role==="offline"){
    this.dbservice_local.getPools(CA,unit).then(data => {
      this.waterfoods = data;

      this.waterfoods.forEach(record =>{
          var pool=record["Pool"]
          this.Pool_list.push(pool)
          console.log(this.Pool_list)
      });
    });   
  }
}

//get dates for drop down
getDates(CA,unit,pool){
  this.date_list=["Create New Record"];

  if (this.globals.role==="online"){
  this.dbservice_cloud.getDates_waterfood(CA,unit,pool).subscribe(data => {
    data.forEach(doc => {
      this.date_list.push(doc.id)
    });
  });
  }

  else if (this.globals.role==="offline"){
    this.dbservice_local.getDates(CA,unit,pool).then(data => {
      this.waterfoods = data;

      this.waterfoods.forEach(record =>{
          var date=record["Date"]
          this.date_list.push(date)
          console.log(this.date_list)
      });
    });   
  }

}


//get last record for EVERY pool from cloud
/* downloadallprevs(){
  this.dbservice_cloud.getCAs().subscribe(data => {
    data.forEach(doc => {
      console.log("CA is"+doc.id)
      var CA=doc.id
      this.dbservice_cloud.getUnits(CA).subscribe(data => {
        data.forEach(doc => {
          console.log("CA is"+doc.id)
          var Unit=doc.id;
          this.dbservice_cloud.getPools(CA,Unit).subscribe(data => {
            data.forEach(doc => {
              console.log("CA is"+doc.id)
              var Pool=doc.id;
                this.cloudservice.getprevWaterFood(CA,Unit,Pool,"").subscribe(data => {
                  data.forEach(doc => {
                  console.log(doc.id)
                    console.log("THIS is "+doc.id)
                    var date=doc.id;
                    this.getindividualrecord(CA,Unit,Pool,date)
                });
              }); 
            });
          }); 
        });
      }); 
    });
  });
} */

//this function is for updating old records 
updateWaterFood(CA,unit,pool,date){
    if (this.globals.role==="online"){
    this.cloudservice.getWaterFood(CA,unit,pool,date).
    subscribe(data=>{
      this.newWaterFood.CA=data.get('CA');
      this.newWaterFood.Unit=data.get('Unit');
      this.newWaterFood.Pool=data.get('Pool')
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

  });

}
  else if (this.globals.role==="offline"){
    console.log("date is "+date)
    this.localservice.loadOldWaterFood(CA,unit,pool,date).then(data=> {

      this.waterfoods = data;
      console.log(data)
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

      });
    });
  }
    //clear prev data list since we are not showing prev entry
    this.prev_data=[];

    if (date==="Create New Record"){
      this.getprevWaterFood(CA,unit,pool,date);
    }
}

//retrives an indivudal waterfood record from the cloud, using the CA,unit,pool, and date
getindividualrecord(CA,unit,pool,date){
  this.cloudservice.getWaterFood(CA,unit,pool,date).
  subscribe(data=>{
    this.newWaterFood.CA=CA;                                                                          
    this.newWaterFood.Unit=unit;
    this.newWaterFood.Pool=pool;
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


    this.local_addData("from_cloud"); 

  })
}


//this function handles pushing data that is stored in local to the cloud
//once the app gets back online
/* pushtocloudfromlocal(){
  console.log("pushing to cloud from local")
  this.localService.getData().
    then(data => {
        this.waterfoods = data;

        this.waterfoods.forEach(record =>{
          console.log(record)
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

          //add the locally stored Watermanagement to Cloud (if the record was already there it is being added
          //but sense everything is the same it is basically doing nothing)
           this.cloudservice.addWaterFood(this.newWaterFood,) 

          //delete the record from local
          this.localService.deleteWaterFood(record["id"]);
        })

        //now redownload database from cloud now that it has been updated with
        //the local data that was pushed
        this.downloadallprevs()
          
      }).catch(error => {
          console.error(error);
          alert(error.message);
  }); 
} */

//pushes data to IndexDB
local_addData(location){
    //if new record set these properties. if adding data already in cloud
    //the record already has these properties and you dont want to overwrite them
    if (location === "new"){
      this.getdatesfordb();
      this.newWaterFood.CA=this.selected_CA;
      this.newWaterFood.Unit=this.selected_unit;
      this.newWaterFood.Pool=this.selected_Pool;
      this.localService.addData(this.newWaterFood);
      this.comp.openDataWrittenDialog()
    }

    else{
      console.log("adding from cloud to local")
      this.localService.addData(this.newWaterFood);
    }

    

    console.log("date here is "+this.newWaterFood.Date)
}

//this function loads previous record data when page intially loads
getprevWaterFood(CA,unit,pool,date){
  console.log("CA now is "+CA)
  //if no date selected, get the date
  if (date==="Create New Record" || date===""){
    //get dates for date dropdown
    this.getDates(CA,unit,pool)
    this.clearNewWaterFood();
  }

  if (this.globals.role==="online"){
    this.cloudservice.getprevWaterFood(CA,unit,pool,date).subscribe(data => {
      data.forEach(doc => {
        this.cloudservice.getWaterFood(CA,unit,pool,doc.id).
        subscribe(data=>{
          this.prev_data['Date']=data.get('Date');
          this.prev_data['Percent_of_Pool_Full']=data.get('Percent_of_Pool_Full');
          this.prev_data['less_than_six']=data.get('Percentage_Flooded_under_Six_Inches');
          this.prev_data['seven_to_twelve']=data.get('Percentage_Flooded_Seven_to_Tweleve_Inches');
          this.prev_data['thirteen_or_more']=data.get('Percentage_Flooded_Thirteen_or_more_Inches');
          this.prev_data['habitat_standing']=data.get('Percentage_Habitat_Flooded_Moist_Soil_Standing');
          this.prev_data['habitat_mowed']=data.get('Percentage_Habitat_Flooded_Moist_Soil_Mowed');
          this.prev_data['habitat_disced']=data.get('Percentage_Habitat_Flooded_Moist_Soil_Disced');
          this.prev_data['habitat_unharv_corn']=data.get('Percentage_of_Habitat_Flooded_Unharvested_Corn');
          this.prev_data['habitat_harv_corn']=data.get('Percentage_of_Habitat_Flooded_Harvested_Corn');
          this.prev_data['habitat_unharv_milo']=data.get('Percentage_of_Habitat_Flooded_Unharvested_Milo');
          this.prev_data['habitat_harv_milo']=data.get('Percentage_of_Habitat_Flooded_Harvested_Milo');
          this.prev_data['habitat_unharv_beans']=data.get('Percentage_of_Habitat_Flooded_Unharvested_Beans');
          this.prev_data['habitat_harv_beans']=data.get('Percentage_of_Habitat_Flooded_Harvested_Beans');
          this.prev_data['habitat_browse']=data.get('Percentage_of_Habitat_Flooded_Green_Browse');
          this.prev_data['ice_standing']=data.get('Percentage_of_Ice_on_Flooded_Habitat_Moist_Soil_Standing');
          this.prev_data['ice_mowed']=data.get('Percentage_of_Ice_on_Flooded_Habitat_Moist_Soil_Mowed');
          this.prev_data['ice_disced']=data.get('Percentage_of_Ice_on_Flooded_Habitat_Moist_Soil_Disced');
          this.prev_data['ice_unharv_corn']=data.get('Percentage_of_Ice_on_Flooded_Habitat_Moist_Soil_Unharvested_Corn');
          this.prev_data['ice_harv_corn']=data.get('Percentage_of_Ice_on_Flooded_Habitat_Moist_Soil_Harvested_Corn');
          this.prev_data['ice_unharv_milo']=data.get('Percentage_of_Ice_on_Flooded_Habitat_Moist_Soil_Unharvested_Milo');
          this.prev_data['ice_harv_milo']=data.get('Percentage_of_Ice_on_Flooded_Habitat_Moist_Soil_Harvested_Milo');
          this.prev_data['ice_unharv_beans']=data.get('Percentage_of_Ice_on_Flooded_Habitat_Moist_Soil_Unharvested_Beans');
          this.prev_data['ice_harv_beans']=data.get('Percentage_of_Ice_on_Flooded_Habitat_Moist_Soil_Harvested_Beans');
          this.prev_data['ice_browse']=data.get('Percentage_of_Ice_on_Flooded_Habitat_Moist_Soil_Ice_Browse');
          console.log(this.prev_data['Percent_of_Pool_Full'])
        });     
      });    
    });
  }

  else if (this.globals.role==="offline"){
    console.log("Dateeeee is "+date)
    console.log("CA HERE is "+CA)
    if (date==="" || date==="Create New Record" ){
      console.log("outhe")
      console.log("CA uth is "+CA)
      this.localservice.getprevWaterFood(CA,unit,pool).then(data=> {

        this.waterfoods = data;

        this.waterfoods.forEach(record =>{
          this.prev_data['Date']=record["Date"],
          this.prev_data['Percent_of_Pool_Full']=record["percent_of_full_pool"];
          this.prev_data['less_than_six']=record["less_than_six"];
          this.prev_data['seven_to_twelve']=record["seven_to_twelve"]
          this.prev_data['thirteen_or_more']=record["thirteen_or_more"]
          this.prev_data['habitat_standing']=record["habitat_standing"]
          this.prev_data['habitat_disced']=record["habitat_disced"]
          this.prev_data['habitat_mowed'] =record["habitat_mowed"]
          this.prev_data['habitat_harv_corn']=record["habitat_harv_corn"]
          this.prev_data['habitat_unharv_corn']=record["habitat_unharv_corn"]
          this.prev_data['habitat_harv_beans']=record["habitat_harv_beans"]
          this.prev_data['habitat_unharv_beans']=record["habitat_unharv_beans"]
          this.prev_data['habitat_harv_milo']=record["habitat_harv_milo"]
          this.prev_data['habitat_unharv_milo']=record["habitat_unharv_milo"]
          this.prev_data['habitat_browse']=record["habitat_browse"]

          this.prev_data['ice_standing']=record["ice_standing"]
          this.prev_data['ice_disced'] =record["ice_disced"]
          this.prev_data['ice_mowed']=record["ice_mowed"]
          this.prev_data['ice_harv_corn']=record["ice_harv_corn"]
          this.prev_data['ice_unharv_corn']=record["ice_unharv_corn"]
          this.prev_data['ice_harv_beans']=record["ice_harv_beans"]
          this.prev_data['ice_unharv_beans']=record["ice_unharv_beans"]
          this.prev_data['ice_harv_milo']=record["ice_harv_milo"]
          this.prev_data['ice_unharv_milo']=record["ice_unharv_milo"]
          this.prev_data['ice_browse']=record["ice_browse"]

          this.prev_data['notes']=record["notes"]
          this.prev_data['response']=record["response"]
          this.prev_data['actions']=record["actions"]

          this.newWaterFood.Sort_time=record["Sort_time"]
        });  
      });
    }
}
}

//pushes data to the cloud
addData(){
      this.newWaterFood.CA=this.selected_CA;
      this.newWaterFood.Unit=this.selected_unit
      this.newWaterFood.Pool=this.selected_Pool

      this.getdatesfordb();
      this.cloudservice.addWaterFood(this.newWaterFood);   
      this.comp.openDataWrittenDialog();
}
  
//creates timestamps to write to dbs
getdatesfordb(){
  console.log("creating dates")
  var d = new Date();
  var day1=d.getDate();
  //get month is zero based so add 1
  var month1=(d.getMonth()+1);
  var year1=d.getFullYear();
  var time=d.getTime()
  this.newWaterFood.Sort_time=time.toString();
  var day=day1.toString();
  var month=month1.toString();
  var year=year1.toString();
  var stringg=month+ "-" + day + "-" + year;

  this.newWaterFood.Date=stringg;
}
    
//used to reformat page when screen is resized
onResize(event) {
  this.breakpoint = (event.target.innerWidth <= 768) ? 1 : 4;
}

//clears all fields
clearNewWaterFood() {
  this.newWaterFood = new WaterFood();
}
}