import { Component, OnInit, ViewChild,VERSION } from '@angular/core';
import { LocalWaterManagementService } from 'src/app/service/watermanagement-local.service';
import {Globals} from 'src/app/extra/globals';
import { AngularFireDatabase } from 'angularfire2/database';
import {WatermanagementCloudService} from 'src/app/service/watermanagement-cloud.service';
import {MediaMatcher} from '@angular/cdk/layout';
import {ChangeDetectorRef, OnDestroy} from '@angular/core';
import {ChartService} from 'src/app/service/chart.service';
import { MatSidenav } from '@angular/material';
import { Chart } from 'chart.js';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {AppComponent} from 'src/app/app.component';


import {
  Watermanagement,
  IWatermanagement
} from 'src/app/model/watermanagement';
import { stringToKeyValue } from '@angular/flex-layout/extended/typings/style/style-transforms';


@Component({
  selector: 'app-watermanagement',
  templateUrl: './watermanagement.component.html',
  styleUrls: ['./watermanagement.component.css'],
  providers:[LocalWaterManagementService,ChartService]
})
export class WatermanagementComponent implements OnInit {
  
  @ViewChild('rightSidenav') public sidenav: MatSidenav;
  ngVersion: string = VERSION.full;
  matVersion: string = '5.1.0'
  breakpoint:number;
  private localservice: LocalWaterManagementService;
  private cloudservice: WatermanagementCloudService;
  watermanagements: any[];
  newWaterManagement: IWatermanagement = new Watermanagement();
  local_records: any[];

  public previous_records;
  public second_previous_records;

  public buttonName: any = true;
  toggleActive:boolean = false;

  chart_loaded=false;

  chart = [];
  dates = [];
  elevation_data=[];
  gate_level_data=[];
  ducks_num_data=[];
  geese_num_data=[];
  Graph_Title;

   constructor(private comp:AppComponent, private localService: LocalWaterManagementService, private cloudService: WatermanagementCloudService, private globals:Globals,
    private firebase: AngularFireDatabase, private sidenavService:ChartService) {
      this.localservice = localService;
      this.cloudservice= cloudService;
  }

  ngOnInit() : void {
    this.sidenavService.setSidenav(this.sidenav);
    this.getWatermanagement();
    this.breakpoint = (window.innerWidth <= 768) ? 1 : 3;
    console.log("1 side nave is "+this.sidenav)

    this.sidenavService.setSidenav(this.sidenav);
    console.log("5 this sidnave is"+this.sidenav)
    this.localservice.getWaterManagment().
    then(students => {
        this.watermanagements = students;

        var listt=this.watermanagements;

        console.log("list is "+listt)
         
        for (let i = 0; i < listt.length; i++){
          var second_to_last_entry=last_entry
          console.log("it is "+listt[i])
          var last_entry=JSON.parse(JSON.stringify({"date":listt[i].date,"elevation":listt[i].elevation,
          "gate_manipulation":listt[0].gate_manipulation,"gate_level":listt[0].gate_level,"stoplog_change":listt[0].stoplog_change,
          "stoplog_level":listt[0].stoplog_level,"duck_numbers":listt[i].duck_numbers,
          "goose_numbers":listt[i].goose_numbers,"notes":listt[i].notes}));
          console.log("i am "+listt[i].date)
        }
  
        this.previous_records=last_entry;
        this.second_previous_records=second_to_last_entry;
        console.log("it is "+this.previous_records);
        console.log("it is "+this.second_previous_records); 

        this.makeChart();

      }).catch(error => {
          console.error(error);
          alert(error.message);
      });
  } 

  makeChart(){
    //check what data you have before you build chart 
    if(this.second_previous_records && this.previous_records){
      this.dates=[this.second_previous_records.date,this.previous_records.date,"Current Entry"];
      this.elevation_data=[this.second_previous_records.elevation,this.previous_records.elevation,this.newWaterManagement.elevation];
      this.gate_level_data=[this.second_previous_records.gate_level,this.previous_records.gate_level,this.newWaterManagement.gate_level];
      this.ducks_num_data=[this.second_previous_records.duck_numbers,this.previous_records.duck_numbers,this.newWaterManagement.duck_numbers];
      this.geese_num_data=[this.second_previous_records.goose_numbers,this.previous_records.goose_numbers,this.newWaterManagement.goose_numbers];

    }

    else if (this.previous_records){
      this.dates=[this.previous_records.date,"Current Entry"]
      this.elevation_data=[this.previous_records.elevation,this.newWaterManagement.elevation];
      this.gate_level_data=[this.previous_records.gate_level,this.newWaterManagement.gate_level];
      this.ducks_num_data=[this.previous_records.duck_numbers,this.newWaterManagement.duck_numbers];
      this.geese_num_data=[this.previous_records.goose_numbers,this.newWaterManagement.goose_numbers];
    }

    else{
      this.dates=["Current Entry"];
      this.elevation_data=[this.newWaterManagement.elevation];
      this.gate_level_data=[this.newWaterManagement.gate_level];
      this.ducks_num_data=[this.newWaterManagement.duck_numbers];
      this.geese_num_data=[this.newWaterManagement.goose_numbers];
    }

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
        }
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
        }
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
        }
      }
    })
    return "done";  
  }

  updateChart(chart_name){

    console.log("update chart"+chart_name)

    //check what data you have before you build chart 
    if(this.second_previous_records && this.previous_records){
      
      this.dates=[this.second_previous_records.date,this.previous_records.date,"Current Entry"];
      this.elevation_data=[this.second_previous_records.elevation,this.previous_records.elevation,this.newWaterManagement.elevation];
      this.gate_level_data=[this.second_previous_records.gate_level,this.previous_records.gate_level,this.newWaterManagement.gate_level];
      this.ducks_num_data=[this.second_previous_records.duck_numbers,this.previous_records.duck_numbers,this.newWaterManagement.duck_numbers];
      this.geese_num_data=[this.second_previous_records.goose_numbers,this.previous_records.goose_numbers,this.newWaterManagement.goose_numbers];

    }

    else if (this.previous_records){
      this.dates=[this.previous_records.date,"Current Entry"]
      this.elevation_data=[this.previous_records.elevation,this.newWaterManagement.elevation];
      this.gate_level_data=[this.previous_records.gate_level,this.newWaterManagement.gate_level];
      this.ducks_num_data=[this.previous_records.duck_numbers,this.newWaterManagement.duck_numbers];
      this.geese_num_data=[this.previous_records.goose_numbers,this.newWaterManagement.goose_numbers];
    }

    else{
      this.dates=["Current Entry"];
      this.elevation_data=[this.newWaterManagement.elevation];
      this.gate_level_data=[this.newWaterManagement.gate_level];
      this.ducks_num_data=[this.newWaterManagement.duck_numbers];
      this.geese_num_data=[this.previous_records.goose_numbers,this.newWaterManagement.goose_numbers];
    }


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
        }
      }
    })
  }

  else{

    if (this.newWaterManagement.duck_numbers && this.newWaterManagement.goose_numbers){
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
        }
      })    
    }

    else if (this.newWaterManagement.duck_numbers){
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
        }
      })       

    }
  
    }
  }

	toggleRightSidenav(chart_name) {
    this.toggleActive = !this.toggleActive;
    console.log("2 side nave is "+this.sidenav)

    //call a render chart function, then toggel sidenav
    //this.makeChart(chart_name);
    this.sidenav.toggle();
    console.log('Clicked');
	}

  getWatermanagement() {
      this.localservice.getWaterManagment().
      then(students => {
          this.watermanagements = students;

          var listt=this.watermanagements;

          console.log("list is "+listt)
          for (let i = 0; i < listt.length; i++){
            var second_to_last_entry=last_entry
            console.log("it is "+listt[i])
            var last_entry=[listt[i].date,listt[i].elevation,listt[i].gate_manipulation,listt[i].gate_level,
            listt[i].stoplog_change,listt[i].stoplog_level,listt[i].duck_numbers,listt[i].goose_numbers,listt[i].notes]
            console.log("i am "+listt[i].date)
          }
    
          this.previous_records=last_entry;
          this.second_previous_records=second_to_last_entry;
          console.log("it is "+this.previous_records);
          console.log("it is "+this.second_previous_records);
        
         

      }).catch(error => {
          console.error(error);
          alert(error.message);
      });
  }

  addWaterManagement() {
    console.log(this.newWaterManagement.duck_numbers);

    var status=this.globals.role;

    //if app is offline, write to indexdb
    if (status=="offline"){
      this.localservice.addWaterManagement(this.newWaterManagement).
      then((addedWaterManagements: IWatermanagement[]) => {
      if (addedWaterManagements.length > 0) {
        this.watermanagements.push(addedWaterManagements[0]);
        this.clearNewWaterManagement();
        this.comp.openDataWrittenDialog();
        
      }
      })
      .catch(error => {
      console.error(error);
      alert(error.message);
      });
    }
  

  //if app is online, write to cloud (firestore for the time being)
  else{
    this.cloudservice.addWaterManagement(this.newWaterManagement);    
  }
  }

  clearNewWaterManagement() {
    this.newWaterManagement = new Watermanagement();
   }

   onResize(event) {
    this.breakpoint = (event.target.innerWidth <= 768) ? 1 : 3;
    //this.breakpoint = (event.target.innerWidth > 500) ? 1 : 3;
  }





}
