import { Component, OnInit, ViewChild,VERSION, Input, AfterViewInit,ElementRef } from '@angular/core';
import { LocalWaterManagementService } from 'src/app/service/watermanagement-local.service';
import { AngularFireDatabase } from 'angularfire2/database';
import {WatermanagementCloudService} from 'src/app/service/watermanagement-cloud.service';
import {WatermanagementSqlserverService} from 'src/app/service/watermanagement-sqlserver.service';
import {SevendayService} from 'src/app/service/sevenday.service';
import {MediaMatcher} from '@angular/cdk/layout';
import {ChangeDetectorRef, OnDestroy} from '@angular/core';
import {ChartService} from 'src/app/service/chart.service';
import { MatSidenav } from '@angular/material';
import { Chart } from 'chart.js';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {AppComponent} from 'src/app/app.component';
import {DropDownMenuDataService} from 'src/app/service/drop-down-menu-data.service';
import {MatBottomSheet, MatBottomSheetRef} from '@angular/material';

import {
  Watermanagement,
  IWatermanagement
} from 'src/app/model/watermanagement';

import { stringToKeyValue } from '@angular/flex-layout/extended/typings/style/style-transforms';
import { forEach } from '@angular/router/src/utils/collection';
import { MoistsoilService } from 'src/app/service/moistsoil.service';

@Component({
  selector: 'app-watermanagement',
  templateUrl: './watermanagement.component.html',
  styleUrls: ['./watermanagement.component.css'],
  providers:[LocalWaterManagementService,ChartService]
})
export class WatermanagementComponent implements OnInit {

  //need this for graphs 
  @ViewChild('rightSidenav') public sidenav: MatSidenav;
  ngVersion: string = VERSION.full;
  matVersion: string = '5.1.0'

  //breakpoints for resizing app for responsive design
  breakpoint:number;
  breakpoint_top:number;

  watermanagements: any[];
  newWaterManagement: IWatermanagement = new Watermanagement();

  //toggles chart view
  toggleActive:boolean = false;

  //define properties for charts
  chart = [];
  dates = [];
  elevation_data=[];
  gate_level_data=[];
  ducks_num_data=[];
  geese_num_data=[];
  Graph_Title;

  //define general properties
  public table = 'WaterManagement';
  public mode;
  public status;

  //define properties for dropdowns
  public CA_list: string[]=[];
  public selected_CA;
  public unit_list: string[]=[];
  public selected_unit;
  public Pool_list: string[]=[];
  public selected_Pool;
  public wcs_list: string[]=[];
  public selected_wcs;
  public date_list: string[]=["Create New Record"];
  public selected_date;
  public nav_list: string[]=[];

  //define properties for storing previous records
  public prev_data_master=[];
  public prev_data:string[]=[];
  public stored_size;
  public data_length=this.prev_data_master.length;

  public page;

  constructor(private comp:AppComponent, private localservice: LocalWaterManagementService, 
    private cloudservice: WatermanagementCloudService,private dropdownservice:DropDownMenuDataService, 
    private sidenavService:ChartService,private bottomSheet: MatBottomSheet, 
     private sevendayservice: SevendayService,private sqlserver_service:WatermanagementSqlserverService) {
       
  }

  ngOnInit() : void {

  //set up layout stuff
  this.sidenavService.setSidenav(this.sidenav);
  this.breakpoint = (window.innerWidth <= 768) ? 1 : 3;
  this.breakpoint_top = (window.innerWidth <= 768) ? 1 : 1;
  this.sidenavService.setSidenav(this.sidenav);

  //clear all data from lists just in case
  this.CA_list=[];
  this.unit_list=[];
  this.Pool_list=[];
  this.wcs_list=[];

  //get the CA and online status saved in local storage
  this.selected_CA=localStorage.getItem("CA")
  this.status=localStorage.getItem('Status')

  //test sql server command
  this.sqlserver_service.getWaterManagement()

  if (this.status==="online"){
    //update local db for next time app is offline 
    //(now loading screen is necessary because this can happen in the
    //background nothing in local while user is connected will be affected)'
    this.localservice.clearTable();
    this.comp.downloadallprevs('WaterManagement')
  }


  //get available Units for CA for drop down from IndexDB (local)
  this.dropdownservice.getUnits(this.selected_CA).then(data => {
    this.watermanagements = data;

    var previous = 'none';

    this.watermanagements.forEach(record =>{
        var Unit=record["Unit"]

        //ensure that duplicates are not added to the drop down here
        if (Unit !== previous){
          this.unit_list.push(Unit)
          previous=Unit
          console.log('uNIT LIST IS '+this.unit_list)
        }
    });
  });
}


// fetches list of availabe pools in units for dropdown
getPools(CA,unit){
  //clear pool and wcs list
  this.Pool_list=[];
  this.wcs_list=[];
  this.date_list=["Create New Record"];
  this.clearNewWaterManagement();
  this.prev_data_master.length=0;
  this.data_length=0;

  //if app is offline
    //get pools from local and push into dropdown
    this.dropdownservice.getPools(CA,unit).then(data => {
      this.watermanagements = data;

      var previous='None';

      this.watermanagements.forEach(record =>{
          var pool=record["Pool"]

           //ensure that duplicates are not added to the drop down here
          if (pool !== previous){
            this.Pool_list.push(pool)
            previous=pool
          }
      });
    });
  
}

// fetch list of available strucutres in pool for dropdown
getWCS(CA,unit,pool){
  this.wcs_list=[];
  this.date_list=["Create New Record"];
  this.clearNewWaterManagement();
  this.prev_data_master.length=0;
  this.data_length=0;

    //fetch data from local and push into dropdown
    this.dropdownservice.getWCS(CA,unit,pool).then(data => {
      this.watermanagements = data;

      var previous='None';
      
      this.watermanagements.forEach(record =>{
          var wcs=record["WCS"]

          if (wcs !== previous){
            this.wcs_list.push(wcs)
            previous=wcs
          }
      });
    });

}

// fetches list of available record dates for pool for dropdown
getDates(CA,unit,pool,wcs){

  console.log("getting dates!!!")
  this.date_list=["Create New Record"];
  this.clearNewWaterManagement();
  this.prev_data_master.length=0;
  this.data_length=0;

  //uses location instead of this.status for method reuseablity purposes

  //if app is online
  if (this.status === "online"){
    //get data from cloud
    this.cloudservice.get_available_Dates(CA,unit,pool,wcs).subscribe(data => {
      data.forEach(doc => {
        this.date_list.push(doc.id)
      });
    });
  }

  //if app is offline
  else if (this.status === "offline"){
    //get data from LOCAL
    this.localservice.get_available_Dates(CA,unit,pool,wcs).then(data => {
      data.forEach(doc => {
        console.log(doc['Date'])
        this.date_list.push(doc['Date'])
      });
    });
  }
}

//this function fetches previous records and displays them on page.
//if app is in create record mode this function essetinally does nothing,
//if app is in update record mode, records for updating are fetched 
populate_page_with_data(CA,unit,pool,wcs,date){

  //put app in create record mode if Create New Record is selected
  if (date==="Create New Record"){
    this.mode = 'create record'
    //clear data on page
    this.clearNewWaterManagement();
  }

  //put app in update record mode if a date/previous entry is selected
  else {
    this.mode = 'update record'
  }

  if (this.mode === "update record"){

    this.data_length=0

    if (this.status==="online"){
      this.cloudservice.get_WaterManagement_record(CA,unit,pool,wcs,date).
      subscribe(data=>{
        this.newWaterManagement.Date=data.get('Date');
        this.newWaterManagement.Elevation=data.get('Elevation');
        this.newWaterManagement.Gate_manipulation=data.get('Gate_manipulation');
        this.newWaterManagement.Gate_level=data.get('Gate_level');
        this.newWaterManagement.Stoplog_change=data.get('Stoplog_change');
        this.newWaterManagement.Stoplog_level=data.get('Stoplog_level');
        this.newWaterManagement.Duck_numbers=data.get('Duck_numbers');
        this.newWaterManagement.Goose_numbers=data.get('Goose_numbers');
        this.newWaterManagement.Fiscal_year=data.get('Fiscal_year');
        this.newWaterManagement.Notes=data.get('Notes');
        this.newWaterManagement.Reasons=data.get('Reasons');
        this.newWaterManagement.Sort_time=data.get('Sort_time');
        this.newWaterManagement.UID=data.get('UID')
        this.newWaterManagement.Delete=data.get('Delete')
        this.newWaterManagement.Update_time=data.get('Update_time')
      });
  }

  else if (this.status==="offline"){
    this.localservice.get_WaterManagement_record(CA,unit,pool,wcs,date).then(data=> {

      this.watermanagements = data;
      console.log(data)
      this.watermanagements.forEach(record =>{
        this.newWaterManagement.CA=CA;
        this.newWaterManagement.Unit=unit;
        this.newWaterManagement.Pool=pool;
        this.newWaterManagement.WCS=wcs;
        this.newWaterManagement.Date=data[0]['Date'];
        this.newWaterManagement.Elevation=data[0]['Elevation'];
        this.newWaterManagement.Gate_manipulation=data[0]['Gate_manipulation'];
        this.newWaterManagement.Gate_level=data[0]['Gate_level'];
        this.newWaterManagement.Stoplog_change=data[0]['Stoplog_change'];
        this.newWaterManagement.Stoplog_level=data[0]['Stoplog_level'];
        this.newWaterManagement.Duck_numbers=data[0]['Duck_numbers'];
        this.newWaterManagement.Goose_numbers=data[0]['Goose_numbers'];
        this.newWaterManagement.Notes=data[0]['Notes']
        this.newWaterManagement.Reasons=data[0]['Reasons']
        this.newWaterManagement.UID=data[0]['UID']
        this.newWaterManagement.Update_time=data[0]['Update_time']
        this.newWaterManagement.Delete=data[0]['Delete']
      });
    });
  }
}
  //clear prev data list since we are not showing prev entry
  this.prev_data=[];
  this.prev_data_master=[];

  if (this.mode === "create record"){
    this.getprevWaterManagement(CA,unit,pool,wcs);
  }
}

//this function loads previous record data when app is in 
//create record mode
getprevWaterManagement(CA,unit,pool,wcs){

  //if no date selected, get the dates for dropdown
  if (this.mode === "create record"){
    this.clearNewWaterManagement();
  }

  if (this.status==="online"){
    this.cloudservice.get_prev_2_WaterManagement_records(CA,unit,pool,wcs).subscribe(data => {
      data.forEach(doc => {
        this.cloudservice.get_WaterManagement_record(CA,unit,pool,wcs,doc.id).
        subscribe(data=>{
          
          //make a copy of this list object using spread operator
          let prev_copy = {...this.prev_data}
          prev_copy['Date']=data.get('Date');
          prev_copy['Elevation']=data.get('Elevation');
          prev_copy['Gate_manipulation']=data.get('Gate_manipulation');
          prev_copy['Gate_level']=data.get('Gate_level');
          prev_copy['Stoplog_change']=data.get('Stoplog_change');
          prev_copy['Stoplog_level']=data.get('Stoplog_level');
          prev_copy['Duck_numbers']=data.get('Duck_numbers');
          prev_copy['Goose_numbers']=data.get('Goose_numbers');
          this.prev_data_master.push(prev_copy);
          this.data_length=this.prev_data_master.length

          if (this.prev_data_master.length===2){
            this.makeChart();
          }
        });     
      });    
    });
  }

  

  else if (this.status==="offline"){
    if (this.mode==="create record"){
      this.localservice.get_prev_2_WaterManagement_records(CA,unit,pool,wcs).then(data=> {

        this.watermanagements = data;

        this.watermanagements.forEach(record =>{
          //make a copy of this list object using spread operator
          let prev_copy = {...this.prev_data}
          this.prev_data.length=0;
          this.newWaterManagement.CA=CA;
          this.newWaterManagement.Unit=unit;
          this.newWaterManagement.Pool=pool;
          this.newWaterManagement.WCS=wcs;
          prev_copy['Date']=record['Date'];
          prev_copy['Elevation']=record['Elevation'];
          prev_copy['Gate_manipulation']=record['Gate_manipulation'];
          prev_copy['Gate_level']=record['Gate_level'];
          prev_copy['Stoplog_change']=record['Stoplog_change'];
          prev_copy['Stoplog_level']=record['Stoplog_level'];
          prev_copy['Duck_numbers']=record['Duck_numbers'];
          prev_copy['Goose_numbers']=record['Goose_numbers'];
          this.prev_data_master.push(prev_copy);
          this.data_length=this.prev_data_master.length

          if (this.prev_data_master.length===2){
            this.makeChart();
          }
        });  
      });
    }
  }
}

  //creates timestamps to write to dbs
  getdatesfordb(action){

    //field for sort_time will never change after it's been created
    //when record is intiially created
    if (action!=='update'){

      var d = new Date();
      var day1=d.getDate();
      //get month is zero based so add 1
      var month1=(d.getMonth()+1);
      var year1=d.getFullYear();
      var time=d.getTime()
      this.newWaterManagement.Sort_time=time;

      //set update time same as sort time when creating new record
      this.newWaterManagement.Update_time=time;
      var day=day1.toString();
      var month=month1.toString();
      var year=year1.toString();
      var stringg=month+ "-" + day + "-" + year;
  
      this.newWaterManagement.Date=stringg;

      //create unique identifier also will never change on update
      this.newWaterManagement.UID=this.comp.generateUUID()

    }

    //when record is being updated
    else{
      var d = new Date();
      var day1=d.getDate();
      //get month is zero based so add 1
      var month1=(d.getMonth()+1);
      var year1=d.getFullYear();
      var time=d.getTime()

      //set update time to the time the record is updated
      this.newWaterManagement.Update_time=time;
    }
  }

  //adds data to either IndexDB or the Cloud depending on connection status
  addData(){

    this.newWaterManagement.CA=this.selected_CA;
    this.newWaterManagement.Unit=this.selected_unit;
    this.newWaterManagement.Pool=this.selected_Pool;
    this.newWaterManagement.WCS=this.selected_wcs;
    this.newWaterManagement.Delete=0;

    console.log("type here is "+typeof(this.newWaterManagement.Elevation))

    //only update date related fields when you are creating a new record
    if (this.mode === "create record"){
      this.getdatesfordb('new');
    }

    else{
      this.getdatesfordb('update')
    }

    //push entry to cloud
    if (this.status==="online"){
      this.cloudservice.add_WaterManagement_record(this.newWaterManagement);
    }

    //push entry to IndexDB
    else if (this.status==="offline"){
      this.localservice.add_WaterManagement_record(this.newWaterManagement);
    }

    //display data written dialogue and refresh the page
    this.comp.openDataWrittenDialog()
  }

  //clears all fields in the app
  clearNewWaterManagement() {
    this.newWaterManagement = new Watermanagement();
   }

   //for formatting
   onResize(event) {
    this.breakpoint = (event.target.innerWidth <= 768) ? 1 : 3;
    //this.breakpoint = (event.target.innerWidth > 500) ? 1 : 3;
  }

  //for formatting
	toggleRightSidenav(chart_name) {
    this.toggleActive = !this.toggleActive;
    //call a render chart function, then toggel sidenav
    //this.makeChart(chart_name);
    this.sidenav.toggle();
  }

  //makes delete field as 1 which indicates to the server to 
  //delete the record. this fucntion does not actually delete from 
  //the database, just marks it for deleteion
  DeleteRecord(watermanagement){

    watermanagement.Delete=1;
    if (this.status==="online"){
      this.cloudservice.add_WaterManagement_record(this.newWaterManagement);
    }

    if (this.status==="offline"){
      this.localservice.add_WaterManagement_record(this.newWaterManagement)
    }

    this.comp.openDataWrittenDialog();
  }

  //creates initial chart
  makeChart(){
    console.log('l chart ')
    this.dates=[this.prev_data_master[1]['Date'],this.prev_data_master[0]['Date'],"Current Entry"];
    this.elevation_data=[this.prev_data_master[1]['Elevation'],this.prev_data_master[0]['Elevation'],this.newWaterManagement.Elevation];
    this.gate_level_data=[this.prev_data_master[1]['Gate_level'],this.prev_data_master[0]['Gate_level'],this.newWaterManagement.Gate_level];
    this.ducks_num_data=[this.prev_data_master[1]['Duck_numbers'],this.prev_data_master[0]['Duck_numbers'],this.newWaterManagement.Duck_numbers];
    this.geese_num_data=[this.prev_data_master[1]['Goose_numbers'],this.prev_data_master[0]['Goose_number'],this.newWaterManagement.Goose_numbers];

    this.Graph_Title="Water Elevation";

     this.chart = new Chart('canvas_elevation', {
      type: 'line',
      data: {
        labels: this.dates,
        datasets: [
          {
            data: this.elevation_data,
            borderColor: '#3cba9f',
            fill: false
          },
        ]
      },
      options: {
        legend: {
          display: false
        },
        scales: {
          xAxes: [{
            display: true
          }],
          yAxes: [{
            display: true
          }]
        },
        responive:true
      }
    })

    this.Graph_Title="Gate Level";

    this.chart = new Chart('canvas_gate_level', {
      type: 'line',
      data: {
        labels: this.dates,
        datasets: [
          {
            data: this.gate_level_data,
            borderColor: '#3cba9f',
            fill: false
          },
        ]
      },
      options: {
        legend: {
          display: false
        },
        scales: {
          xAxes: [{
            display: true
          }],
          yAxes: [{
            display: true
          }]
        },
        responive:true
      }
    })

    this.Graph_Title="Number of Ducks and Geese";

    this.chart = new Chart('canvas_birds', {
      type: 'line',
      data: {
        labels: this.dates,
        datasets: [
          {
            label:"Geese",
            data: this.geese_num_data,
            borderColor: 'red',
            fill: false
          },
          {
            label:"Ducks",
            data: this.ducks_num_data,
            borderColor: '#3cba9f',
            fill: false
          },
        ]
      },
      options: {
        legend: {
          display: true
        },
        scales: {
          xAxes: [{
            display: true
          }],
          yAxes: [{
            display: true
          }]
        },
        responive:true
      }
    })
    return "done";
  }

  //update chart when data changes live inside of app
  updateChart(chart_name){

    this.dates=[this.prev_data_master[1]['Date'],this.prev_data_master[0]['Date'],"Current Entry"];
    this.elevation_data=[this.prev_data_master[1]['Elevation'],this.prev_data_master[0]['Elevation'],this.newWaterManagement.Elevation];
    this.gate_level_data=[this.prev_data_master[1]['Gate_level'],this.prev_data_master[0]['Gate_level'],this.newWaterManagement.Gate_level];
    this.ducks_num_data=[this.prev_data_master[1]['Duck_numbers'],this.prev_data_master[0]['Duck_numbers'],this.newWaterManagement.Duck_numbers];
    this.geese_num_data=[this.prev_data_master[1]['Goose_numbers'],this.prev_data_master[0]['Goose_number'],this.newWaterManagement.Goose_numbers];

    if (chart_name=="elevation"){
      var data_for_Chart=this.elevation_data;
      var chart_type ='canvas_elevation';
    }

    else if (chart_name=="gate_level"){
      var data_for_Chart=this.gate_level_data;
      var chart_type ='canvas_gate_level';
    }

    else if (chart_name=="bird_nums"){
     var chart_type ='canvas_birds';
    }

    if (chart_name=="elevation"||chart_name=="gate_level"){
    this.chart = new Chart(chart_type, {
      type: 'line',
      data: {
        labels: this.dates,
        datasets: [
          {
            data: data_for_Chart,
            borderColor: '#3cba9f',
            fill: false
          },
        ]
      },
      options: {
        legend: {
          display: false
        },
        scales: {
          xAxes: [{
            display: true
          }],
          yAxes: [{
            display: true
          }]
        },
        responive:true
      }
    })
  }

  else{

    if (this.newWaterManagement.Duck_numbers && this.newWaterManagement.Goose_numbers){
      this.chart = new Chart(chart_type, {
        type: 'line',
        data: {
          labels: this.dates,
          datasets: [
            {
              label:"Geese",
              data: this.geese_num_data,
              borderColor: 'red',
              fill: false
            },
            {
              label:"Ducks",
              data: this.ducks_num_data,
              borderColor: '#3cba9f',
              fill: false
            },
          ]
        },
        options: {
          legend: {
            display: true
          },
          scales: {
            xAxes: [{
              display: true
            }],
            yAxes: [{
              display: true
            }]
          }
        },
        responive:true
      })
    }

    else if (this.newWaterManagement.Duck_numbers){
      this.chart = new Chart(chart_type, {
        type: 'line',
        data: {
          labels: this.dates,
          datasets: [
            {
              label:"Geese",
              data: this.geese_num_data,
              borderColor: 'red',
              fill: false
            },
            {
              label:"Ducks",
              data: this.ducks_num_data,
              borderColor: '#3cba9f',
              fill: false
            },
          ]
        },
        options: {
          legend: {
            display: true
          },
          scales: {
            xAxes: [{
              display: true
            }],
            yAxes: [{
              display: true
            }]
          }
        },
        responive:true
      })
    }
    }
  }

  //opens past seven day page
  async openBottomSheet(){

    if (this.status==='online'){

      this.cloudservice.get_prev_7_WaterManagement_records(this.selected_CA,this.selected_unit,this.selected_Pool,this.selected_wcs).
      subscribe(data => {

        this.sevendayservice.past_7_data_master.length=0;

        data.forEach(doc => {
          console.log('date is '+data.size)
          this.stored_size=data.size
          this.cloudservice.get_WaterManagement_record(this.selected_CA,this.selected_unit,this.selected_Pool,this.selected_wcs,doc.id).
          subscribe(data=>{

            console.log("pushing date:"+data.get('Date'))

            this.sevendayservice.sevendaydata.Date=data.get('Date')
            this.sevendayservice.sevendaydata.Gate_level=data.get('Gate_level')
            this.sevendayservice.sevendaydata.Stoplog_level=data.get('Stoplog_level')

            this.sevendayservice.past_7_data_master.push(this.sevendayservice.sevendaydata);

            this.sevendayservice.past_7_data_master = JSON.parse(JSON.stringify(this.sevendayservice.past_7_data_master));

            console.log(this.sevendayservice.past_7_data_master)

            this.sevendayservice.sevendaydata=new Watermanagement();

            if (this.sevendayservice.past_7_data_master.length === this.stored_size){
              console.log("Master list is "+this.sevendayservice.past_7_data_master)
              this.bottomSheet.open(PastSevenDays);
            }
            
          });
        });
      });
    }

    if (this.status==='offline'){
      this.localservice.get_prev_7_WaterManagement_records(this.selected_CA,this.selected_unit,this.selected_Pool,this.selected_wcs).then(data => {
        
        this.sevendayservice.past_7_data_master.length=0;
        
        data.forEach(record =>{
            this.stored_size=data.length
            this.sevendayservice.sevendaydata.Date=record['Date']
            this.sevendayservice.sevendaydata.Gate_level=record['Gate_level']
            this.sevendayservice.sevendaydata.Stoplog_level=record['Stoplog_level']

            this.sevendayservice.past_7_data_master.push(this.sevendayservice.sevendaydata);

            this.sevendayservice.past_7_data_master = JSON.parse(JSON.stringify(this.sevendayservice.past_7_data_master));

            console.log(this.sevendayservice.past_7_data_master)

            this.sevendayservice.sevendaydata=new Watermanagement();

            if (this.sevendayservice.past_7_data_master.length === this.stored_size){
              console.log("Master list is "+this.sevendayservice.past_7_data_master)
              this.bottomSheet.open(PastSevenDays);
            }
        });
      });
    }
  }
}

@Component({
  selector: 'past-seven-days',
  templateUrl: 'past-seven-days.html',
  styleUrls: ['past-seven-days.css']
})
export class PastSevenDays implements OnInit, AfterViewInit{

  @ViewChild('canvas') canvasRef: ElementRef;

  constructor(private bottomSheetRef: MatBottomSheetRef<PastSevenDays>,
    private watermanagement: WatermanagementComponent,private sidenavService:ChartService,private elementref:ElementRef,
    private sevendayservice:SevendayService) {}

  chart_loaded=false;

  gate_chart = [];
  stoplog_chart=[];
  dates = [];
  stoplog_levels=[];
  gate_levels=[];
  ducks_num_data=[];
  geese_num_data=[];


  ngOnInit(){         
    console.log("sevend day data is "+this.sevendayservice.sevendaydata.Date)
  }

  ngAfterViewInit(){
    this.makeChart();

  }



   //creates initial chart
   makeChart(){

    console.log('json:'+this.sevendayservice.past_7_data_master)

    this.sevendayservice.past_7_data_master.forEach(doc => {

      console.log('doc:'+doc)

      this.dates.push(doc.Date)
      this.stoplog_levels.push(doc.Stoplog_level)
      this.gate_levels.push(doc.Gate_level)
    });


    console.log('dates:'+this.dates)
    console.log('elevation: '+this.gate_levels)
    

    var canvas = <HTMLCanvasElement> document.getElementById("gate_level");
    var ctx = canvas.getContext("2d");

     this.gate_chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.dates,
        datasets: [
          {
            data: this.gate_levels,
            borderColor: '#3cba9f',
            fill: false
          },
        ]
      },
      options: {
        legend: {
          display: false
        },
        scales: {
          xAxes: [{
            display: true
          }],
          yAxes: [{
            display: true
          }]
        }
      },
      responive:true
    })

    var canvas = <HTMLCanvasElement> document.getElementById("stoplog_level");
    var ctx = canvas.getContext("2d");

     this.stoplog_chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.dates,
        datasets: [
          {
            data: this.stoplog_levels,
            borderColor: '#3cba9f',
            fill: false
          },
        ]
      },
      options: {
        legend: {
          display: false
        },
        scales: {
          xAxes: [{
            display: true
          }],
          yAxes: [{
            display: true
          }]
        }
      },
      responive:true
    })

  }
}
