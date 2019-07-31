import { Component, OnInit} from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import {MediaMatcher} from '@angular/cdk/layout';
import {ChangeDetectorRef, OnDestroy} from '@angular/core';
import {AppComponent} from 'src/app/app.component';

import {DropDownMenuDataService} from 'src/app/service/drop-down-menu-data.service';
import {BiweeklyWaterFoodService} from 'src/app/service/biweekly-waterfood-cloud.service';
import { LocalWaterFood } from 'src/app/service/biweekly-waterfood-local.service';
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
  breakpoint_params:number;

  public CA_list: string[]=[];
  public selected_CA;
  public unit_list: string[]=[];
  public selected_unit; 
  public Pool_list: string[]=[];
  public selected_Pool;
  public prev_data:string[]=[];
  public date_list: string[]=["Create New Record"];
  public selected_date;

  waterfoods: any[];
  newWaterFood: IWaterFood = new WaterFood();
  local_records: any[];

  public previous_records;
  public second_previous_records;

  public status;
  public mode;
  public table =  'Biweekly_Water_Status_and_Food_Availability';

  public buttonName: any = true;
  toggleActive:boolean = false;

  constructor(private comp:AppComponent,private localservice: LocalWaterFood,
    private cloudservice:BiweeklyWaterFoodService,
    private dropdownservice:DropDownMenuDataService) {
    }


  ngOnInit() {
    
    this.breakpoint = (window.innerWidth <= 768) ? 1 : 4;
    this.breakpoint_params = (window.innerWidth <= 768) ? 1 : 1;

    this.CA_list=[];
    this.unit_list=[];
    this.Pool_list=[];
    this.date_list=["Create New Record"];

    console.log(localStorage.getItem("CA"))

    this.selected_CA=localStorage.getItem("CA")
    this.status=localStorage.getItem('Status')

    if (this.status==="online"){
      //update local db for next time app is offline 
      //(now loading screen is necessary because this can happen in the
      //background nothing in local while user is connected will be affected)'
      this.localservice.clearTable();
      this.comp.downloadallprevs('Biweekly')
    }

    this.dropdownservice.getUnits(this.selected_CA).then(data => {
      this.waterfoods = data;

      var previous='None';

      this.waterfoods.forEach(record =>{
          var Unit=record["Unit"]
          
          if (Unit !== previous){
            this.unit_list.push(Unit)
            previous=Unit
          }
      });
    });   

  }
  

//get pools for drop down
getPools(CA,unit){
  this.Pool_list=[];
  this.date_list.length=0;
  this.date_list=["Create New Record"];
  this.clearNewWaterFood();
  this.prev_data.length=0;

    this.dropdownservice.getPools(CA,unit).then(data => {
      this.waterfoods = data;

      var previous='None'
      
      this.waterfoods.forEach(record =>{
          var pool=record["Pool"]

          console.log("Pool:"+pool)
          console.log("Pool list:"+this.Pool_list)

          if (pool !== previous){
            this.Pool_list.push(pool)
            previous=pool
          }
      });
    });   
}

//get dates for drop down
getDates(CA,unit,pool){
  this.date_list=["Create New Record"];

  this.prev_data.length=0;

  if (this.status==="online"){
  this.cloudservice.get_available_Dates(CA,unit,pool).subscribe(data => {
    data.forEach(doc => {
      this.date_list.push(doc.id)
    });
  });
  }

  else if (this.status==="offline"){
    this.localservice.get_available_Dates(CA,unit,pool).then(data => {
      this.waterfoods = data;

      this.waterfoods.forEach(record =>{
          var date=record["Date"]
          this.date_list.push(date)
          console.log(this.date_list)
      });
    });   
  }

}

//this function fetches previous records and displays them on page.
//if app is in create record mode this function essetinally does nothing,
//if app is in update record mode, records for updating are fetched 
populate_page_with_data(CA,unit,pool,date){

    //put app in create record mode if Create New Record is selected
    if (date==="Create New Record"){
      this.mode = 'create record'
      //clear data on page
      this.clearNewWaterFood();
    }

    //put app in update record mode if a date/previous entry is selected
    else {
      this.mode = 'update record'
    }

    if (this.mode === "update record"){

      if (this.status==="online"){
        this.cloudservice.get_WaterFood_record(CA,unit,pool,date).
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

    else if (this.status==="offline"){
      console.log("date is "+date)
      this.localservice.getWaterFood_selected(CA,unit,pool,date).then(data=> {

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
  }
    //clear prev data list since we are not showing prev entry
    this.prev_data=[];

    if (this.mode === "create record"){
      this.getprevWaterFood(CA,unit,pool,date);
    }
}

//this function loads previous record data when app is in 
//create record mode
getprevWaterFood(CA,unit,pool,date){
  //if no date selected, get the date
  if (this.mode==="create record"){
    this.clearNewWaterFood();
  }

  if (this.status==="online"){
    this.cloudservice.get_prev_WaterFood_record(CA,unit,pool,date).subscribe(data => {
      data.forEach(doc => {
        this.cloudservice.get_WaterFood_record(CA,unit,pool,doc.id).
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

  else if (this.status==="offline"){
    console.log("Dateeeee is "+date)
    console.log("CA HERE is "+CA)
    if (date==="" || date==="Create New Record" ){
      console.log("outhe")
      console.log("CA uth is "+CA)
      this.localservice.get_prev_WaterFood_record(CA,unit,pool).then(data=> {

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


//adds data to either IndexDB or the Cloud depending on connection status
addData(){
  this.newWaterFood.CA=this.selected_CA;
  this.newWaterFood.Unit=this.selected_unit;
  this.newWaterFood.Pool=this.selected_Pool;

  //only update date related fields when you are creating a new record
  if (this.mode === "create record"){
    this.getdatesfordb();
  }

  //push entry to cloud
  if (this.status==="online"){
    this.cloudservice.add_WaterFood_record(this.newWaterFood);
  }

  //push entry to IndexDB
  else if (this.status==="offline"){
    this.localservice.add_WaterFood_record(this.newWaterFood);
  }

  //display data written dialogue and refresh the page
  this.comp.openDataWrittenDialog()
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

onResizeparams(event){
  this.breakpoint_params = (event.target.innerWidth <= 768) ? 1 : 1;
}

//clears all fields
clearNewWaterFood() {
  this.newWaterFood = new WaterFood();
}
}