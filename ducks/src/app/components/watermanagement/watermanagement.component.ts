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
import {dbService} from 'src/app/service/db.service';



import {
  Watermanagement,
  IWatermanagement
} from 'src/app/model/watermanagement';
import { stringToKeyValue } from '@angular/flex-layout/extended/typings/style/style-transforms';
import { forEach } from '@angular/router/src/utils/collection';


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
  breakpoint_top:number;
  private localservice: LocalWaterManagementService;
  watermanagements: any[];
  newWaterManagement: IWatermanagement = new Watermanagement();
  local_records: any[];

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

  public prev_data_master=[];
  public prev_data:string[]=[];
  public prev_data_2:string[]=[];
  public doc_array=[];

  public data_length=this.prev_data_master.length;
   constructor(private comp:AppComponent, private localService: LocalWaterManagementService, private cloudservice: WatermanagementCloudService, public globals:Globals,
     private dbservice_cloud:dbService, private sidenavService:ChartService) {
  }

  ngOnInit() : void {

//set up layout stuff
this.sidenavService.setSidenav(this.sidenav);
this.breakpoint = (window.innerWidth <= 768) ? 1 : 3;
this.breakpoint_top = (window.innerWidth <= 768) ? 1 : 1;
this.sidenavService.setSidenav(this.sidenav);

this.CA_list=[];
this.unit_list=[];
this.Pool_list=[];
this.wcs_list=[];


  //if app is online push any locally cached data to the cloud
  if (this.globals.role==="online"){
    this.pushtocloudfromlocal();

    //get available CA's from dropdown menu
    this.dbservice_cloud.getCAs().subscribe(data => {
      data.forEach(doc => {
        this.CA_list.push(doc.id)
      });
    }); 
  }

  else if (this.globals.role==="offline"){
    console.log("GETTING CAs")
    this.localService.getCAs().then(data => {
      this.watermanagements = data;

      this.watermanagements.forEach(record =>{
          var CA=record["CA"]
          this.CA_list.push(CA)
          console.log(this.CA_list)
      });
    });
  }
} 


//fetches list of availabe units in CA for dropdown
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
    this.localService.getUnits(CA).then(data => {
      this.watermanagements = data;

      this.watermanagements.forEach(record =>{
          var Unit=record["Unit"]
          this.unit_list.push(Unit)
          console.log(this.unit_list)
      });
    });    
  }
}


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
    this.localService.getPools(CA,unit).then(data => {
      this.watermanagements = data;

      this.watermanagements.forEach(record =>{
          var pool=record["Pool"]
          this.Pool_list.push(pool)
          console.log(this.Pool_list)
      });
    });   
  }

}
  
//fetche list of available strucutres in pool for dropdown
getWCS(CA,unit,pool){
  this.wcs_list=[];

  if (this.globals.role==="online"){
  this.dbservice_cloud.getWCS(CA,unit,pool).subscribe(data => {
    data.forEach(doc => {
      this.wcs_list.push(doc.id)
    });
  });
  }
  else if (this.globals.role==="offline"){
    this.localService.getWCS(CA,unit,pool).then(data => {
      this.watermanagements = data;

      this.watermanagements.forEach(record =>{
          var wcs=record["Structure"]
          this.wcs_list.push(wcs)
          console.log(this.wcs_list)
      });
    });   
  }
}

//fetches list of available record dates for pool for dropdown
getDates(CA,unit,pool,wcs,location){
  this.date_list=["Create New Record"];

  if (location === "cloud"){
  this.dbservice_cloud.getDates(CA,unit,pool,wcs).subscribe(data => {
    data.forEach(doc => {
      this.date_list.push(doc.id)
    });
  });
  }

  else if (location === "local"){
  this.localService.getDates(CA,unit,pool,wcs).then(data => {
    data.forEach(doc => {
      console.log(doc['Date'])
      this.date_list.push(doc['Date'])
    });
  });
  }
}

//get last two records for EVERY water control structure
downloadallprevs(){
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
              this.dbservice_cloud.getWCS(CA,Unit,Pool).subscribe(data => {
                data.forEach(doc => {
                  console.log("CA is"+doc.id)
                  var wcs=doc.id;
                  this.cloudservice.getprevWaterManagement(CA,Unit,Pool,wcs,"").subscribe(data => {
                    data.forEach(doc => {
                    console.log(doc.id)
                      var date=doc.id;
                      this.getindividualrecord(CA,Unit,Pool,wcs,date)
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

//retrives an indivudal watermangement record from the cloud
getindividualrecord(CA,unit,pool,wcs,date){
  this.cloudservice.getWaterManagement(CA,unit,pool,wcs,date).
  subscribe(data=>{
    this.newWaterManagement.CA=CA;                                                                          
    this.newWaterManagement.Unit=unit;
    this.newWaterManagement.Pool=pool;
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

    this.localaddWatermanagement("from_cloud");

  })
}

//get the previous records for the target wcs
//from local storage
getprevfromlocal(selected_CA,selected_unit,selected_Pool,selected_wcs,selected_date){
   console.log("selected date is "+selected_date)
  //get dates for dropdwown if no dates are selected
  if (selected_date==="Create New Record" || selected_date in window){
  //also get available dates for date drop down
  this.getDates(selected_CA,selected_unit,selected_Pool,selected_wcs,"local")
  } 

  //if a new record is being created, not an old record being edited
  if (selected_date==="Create New Record" || selected_date in window){
    console.log('fetching previous records from local!!!!!!')
    this.localService.getprevWaterManagements(selected_CA,selected_unit,selected_Pool,selected_wcs)
      .then(data=>{
            console.log(data)
            this.watermanagements=data;

            var listt=this.watermanagements;

            for (let i = 0; i < 2; i++){
              var second_to_last_entry=last_entry
              console.log("i is "+i)
              console.log("it is "+listt[i])
              var last_entry=JSON.parse(JSON.stringify({"Date":listt[i].Date,"Elevation":listt[i].Elevation,
              "Gate_manipulation":listt[i].Gate_manipulation,"Gate_level":listt[i].Gate_level,"Stoplog_change":listt[i].Stoplog_change,
              "Stoplog_level":listt[i].Stoplog_level,"Duck_numbers":listt[i].Duck_numbers,
              "Goose_numbers":listt[i].Goose_numbers,"Notes":listt[i].Notes}));
              console.log("i am "+listt[i].Date)
            }
            
            this.prev_data=[];
            this.prev_data_2=[];
            this.prev_data_master=[];
            this.prev_data=last_entry;
            this.prev_data_2=second_to_last_entry;
            console.log("it is "+this.prev_data);
            console.log("it is "+this.prev_data_2);
            this.prev_data_master.push(this.prev_data_2)
            this.prev_data_master.push(this.prev_data)
            this.data_length=this.prev_data_master.length
            this.makeChart()
      });
  }

  //if an old record is being updated
  else if (selected_date!=="Create New Record" && selected_date!==""){
    console.log('fetching previous records from local!!!!!!')
    this.localService.getprevWaterManagement_forupdate(selected_CA,selected_unit,selected_Pool,selected_wcs,selected_date)
      .then(data=>{
            console.log(data)
            console.log("old reccord bing upddate")
            this.watermanagements=data;

            this.newWaterManagement.CA=selected_CA;
            this.newWaterManagement.Unit=selected_unit;
            this.newWaterManagement.Pool=selected_Pool;
            this.newWaterManagement.Structure=selected_wcs;
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

            //clear previous data, we're not displaying it when updating from local
            this.prev_data=[];
            this.prev_data_2=[];
            this.prev_data_master=[];
            this.data_length=this.prev_data_master.length
      });
  }

}

//function adds records to IndexDB(local storage)
localaddWatermanagement(location){

      //if new record set these properties. if adding data already in cloud
      //the record already has these properties and you dont want to overwrite them
      if (location === "new"){

      this.getdatesfordb();
      this.newWaterManagement.CA=this.selected_CA;
      this.newWaterManagement.Unit=this.selected_unit;
      this.newWaterManagement.Pool=this.selected_Pool;
      this.newWaterManagement.Structure=this.selected_wcs;
    }

    else{
      console.log("adding from cloud to local")
    }

    console.log("date here is "+this.newWaterManagement.Date)

    //put watermanagement record into IndexDB
    this.localService.addWaterManagement(this.newWaterManagement).
    then((addedWaterManagements: IWatermanagement[]) => {
      if (addedWaterManagements.length > 0) {
  /*         this.watermanagements.push(addedWaterManagements[0]); */
        this.clearNewWaterManagement();

        //only refresh the page if a new record is being added. you dont want to refresh
        //everytime local pushes to the cloud otherwise it will keep refreshing even when theres 
        //no new data
        if (location === "new"){
        this.comp.openDataWrittenDialog();
        }
      }
      })
      .catch(error => {
      console.error(error);
      alert(error.message);
    });
}

//this function handles pushing data that is stored in local to the cloud
//once the app gets back online
pushtocloudfromlocal(){
  console.log("pushing to cloud from local")
  this.localService.getWaterManagment().
    then(data => {
        this.watermanagements = data;

        this.watermanagements.forEach(record =>{
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

          console.log("adding watermanagement from local to cloud")
          console.log(record)

          //add the locally stored Watermanagement to Cloud (if the record was already there it is being updated
          //but since everything is the same it is basically doing nothing)
          this.cloudservice.addWaterManagement(this.newWaterManagement,record["CA"],record["Unit"],record["Pool"],record["Structure"],
            record["Date"],record["Sort_time"])

          //delete the record from local
          this.localService.deleteWaterManagement(record["id"]);
        })

        //now redownload database from cloud now that it has been updated with
        //the local data that was pushed
        this.downloadallprevs()
          
      }).catch(error => {
          console.error(error);
          alert(error.message);
  }); 

 
}

//this function is for updating records in the cloud
updateWatermanagement(CA,unit,pool,wcs,date){
    this.cloudservice.getWaterManagement(CA,unit,pool,wcs,date).
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

      console.log(this.newWaterManagement.Sort_time)
      console.log("Date when grabbing is " +this.newWaterManagement.Date)

      //get two records that are after the record we are about to update
      this.cloudservice.getprevWaterManagement(CA,unit,pool,wcs,this.newWaterManagement.Sort_time).
      subscribe(data => {
  
        this.doc_array.length=0;
        this.prev_data_master.length=0;
  
        data.forEach(doc => {
        console.log(doc.id)
        this.doc_array.push(doc.id)

        });

        this.updateChartdata(CA,unit,pool,wcs)
        console.log("mast is"+this.prev_data_master)
        this.makeChart();

      });
  })
}

//updates chart data as current recrod changes
updateChartdata(CA,unit,pool,wcs){

    if (this.doc_array.length>=1){

      //get two records ready to put in chart 
      this.cloudservice.getWaterManagement(CA,unit,pool,wcs,this.doc_array[0]).
      subscribe(data=>{
        this.prev_data.length=0;
        this.prev_data['Date']=data.get('Date');
        console.log(data.get('Date'))
        this.prev_data['Elevation']=data.get('Elevation');
        this.prev_data['Gate_manipulation']=data.get('Gate_manipulation');
        this.prev_data['Gate_level']=data.get('Gate_level');
        this.prev_data['Stoplog_change']=data.get('Stoplog_change');
        this.prev_data['Stoplog_level']=data.get('Stoplog_level');
        this.prev_data['Duck_numbers']=data.get('Duck_numbers');
        this.prev_data['Goose_numbers']=data.get('Goose_numbers');
        this.prev_data_master.push(this.prev_data);
        this.data_length=this.prev_data_master.length
        console.log(this.prev_data_master)

      });

    }

    if (this.doc_array.length>=2){
      this.cloudservice.getWaterManagement(CA,unit,pool,wcs,this.doc_array[1]).
      subscribe(data=>{
        this.prev_data_2.length=0;
        this.prev_data_2['Date']=data.get('Date');
        console.log(data.get('Date'))
        this.prev_data_2['Elevation']=data.get('Elevation');
        this.prev_data_2['Gate_manipulation']=data.get('Gate_manipulation');
        this.prev_data_2['Gate_level']=data.get('Gate_level');
        this.prev_data_2['Stoplog_change']=data.get('Stoplog_change');
        this.prev_data_2['Stoplog_level']=data.get('Stoplog_level');
        this.prev_data_2['Duck_numbers']=data.get('Duck_numbers');
        this.prev_data_2['Goose_numbers']=data.get('Goose_numbers');
        this.prev_data_master.push(this.prev_data_2);
        this.data_length=this.prev_data_master.length
        console.log(this.prev_data_master)
        
      });
    }

    if(this.doc_array.length==0){
    this.prev_data.length=0;
    this.prev_data['Date']='None';
    this.prev_data['Elevation']='None';
    this.prev_data['Gate_manipulation']='None';
    this.prev_data['Gate_level']='None';
    this.prev_data['Stoplog_change']='None';
    this.prev_data['Stoplog_level']='None';
    this.prev_data['Duck_numbers']='None';
    this.prev_data['Goose_numbers']='None';
    this.prev_data_2.length=0;
    this.prev_data_2['Date']='None';
    this.prev_data_2['Elevation']='None';
    this.prev_data_2['Gate_manipulation']='None';
    this.prev_data_2['Gate_level']='None';
    this.prev_data_2['Stoplog_change']='None';
    this.prev_data_2['Stoplog_level']='None';
    this.prev_data_2['Duck_numbers']='None';
    this.prev_data_2['Goose_numbers']='None';
    this.prev_data_master.push(this.prev_data);
    this.prev_data_master.push(this.prev_data_2);
    }

    if(this.doc_array.length==1){
    this.prev_data.length=0;
    this.prev_data['Date']='None';
    this.prev_data['Elevation']='None';
    this.prev_data['Gate_manipulation']='None';
    this.prev_data['Gate_level']='None';
    this.prev_data['Stoplog_change']='None';
    this.prev_data['Stoplog_level']='None';
    this.prev_data['Duck_numbers']='None';
    this.prev_data['Goose_numbers']='None';
    this.prev_data_2.length=0;
    this.prev_data_2['Date']='None';
    this.prev_data_2['Elevation']='None';
    this.prev_data_2['Gate_manipulation']='None';
    this.prev_data_2['Gate_level']='None';
    this.prev_data_2['Stoplog_change']='None';
    this.prev_data_2['Stoplog_level']='None';
    this.prev_data_2['Duck_numbers']='None';
    this.prev_data_2['Goose_numbers']='None';
    this.prev_data_master.push(this.prev_data);
    this.prev_data_master.push(this.prev_data_2);
    }
}


//this function is for fetching previous records
getWatermanagement(CA,unit,pool,wcs,date) {

  if (this.globals.role==="online"){

    this.getDates(CA,unit,pool,wcs,"cloud")

    //this where code goes if we are going to update a record 
    if (date!=="none"){
      this.updateWatermanagement(CA,unit,pool,wcs,date) 
    }
    
    //this is where code goes if we are just creating a new one
    else{

      this.newWaterManagement.Date='';
      this.newWaterManagement.Elevation='';
      this.newWaterManagement.Gate_manipulation='';
      this.newWaterManagement.Gate_level='';
      this.newWaterManagement.Stoplog_change='';
      this.newWaterManagement.Stoplog_level='';
      this.newWaterManagement.Duck_numbers='';
      this.newWaterManagement.Goose_numbers='';
      this.newWaterManagement.Fiscal_year='';
      this.newWaterManagement.Notes='';
      this.newWaterManagement.Reasons='';
      this.newWaterManagement.Sort_time='Create New Record';      

    console.log(this.newWaterManagement.Sort_time)

    this.cloudservice.getprevWaterManagement(CA,unit,pool,wcs,this.newWaterManagement.Sort_time).
    subscribe(data => {

      this.doc_array.length=0;
      this.prev_data_master.length=0;

      data.forEach(doc => {
      console.log(doc.id)
      this.doc_array.push(doc.id)

      });        
      
        console.log(this.doc_array[0])


        this.cloudservice.getWaterManagement(CA,unit,pool,wcs,this.doc_array[0]).
      subscribe(data=>{
        this.prev_data.length=0;
        this.prev_data['Date']=data.get('Date');
        console.log(data.get('Date'))
        this.prev_data['Elevation']=data.get('Elevation');
        this.prev_data['Gate_manipulation']=data.get('Gate_manipulation');
        this.prev_data['Gate_level']=data.get('Gate_level');
        this.prev_data['Stoplog_change']=data.get('Stoplog_change');
        this.prev_data['Stoplog_level']=data.get('Stoplog_level');
        this.prev_data['Duck_numbers']=data.get('Duck_numbers');
        this.prev_data['Goose_numbers']=data.get('Goose_numbers');

        this.newWaterManagement.CA=CA;
        this.newWaterManagement.Unit=unit;
        this.newWaterManagement.Pool=pool;
        this.newWaterManagement.Structure=wcs;
        this.newWaterManagement.Date=this.prev_data['Date'];
        this.newWaterManagement.Elevation=this.prev_data['Elevation'];
        this.newWaterManagement.Gate_manipulation=this.prev_data['Gate_manipulation'];
        this.newWaterManagement.Gate_level=this.prev_data['Gate_level'];
        this.newWaterManagement.Stoplog_change=this.prev_data['Stoplog_change'];
        this.newWaterManagement.Stoplog_level=this.prev_data['Stoplog_level'];
        this.newWaterManagement.Duck_numbers=this.prev_data['Duck_numbers'];
        this.newWaterManagement.Goose_numbers=this.prev_data['Goose_numbers'];
        this.newWaterManagement.Notes=data.get('Notes');
        this.newWaterManagement.Reasons=data.get('Reasons')
      
        this.prev_data_master.push(this.prev_data);
        this.data_length=this.prev_data_master.length
        console.log(this.prev_data_master)

      });

      this.cloudservice.getWaterManagement(CA,unit,pool,wcs,this.doc_array[1]).
      subscribe(data=>{
        this.prev_data_2.length=0;
        this.prev_data_2['Date']=data.get('Date');
        console.log(data.get('Date'))
        this.prev_data_2['Elevation']=data.get('Elevation');
        this.prev_data_2['Gate_manipulation']=data.get('Gate_manipulation');
        this.prev_data_2['Gate_level']=data.get('Gate_level');
        this.prev_data_2['Stoplog_change']=data.get('Stoplog_change');
        this.prev_data_2['Stoplog_level']=data.get('Stoplog_level');
        this.prev_data_2['Duck_numbers']=data.get('Duck_numbers');
        this.prev_data_2['Goose_numbers']=data.get('Goose_numbers');
        this.prev_data_master.push(this.prev_data_2);
        this.data_length=this.prev_data_master.length
        console.log(this.prev_data_master)

        this.makeChart();
      });  
    }); 
    }
  }

  else if (this.globals.role==="offline"){
    this.getprevfromlocal(this.selected_CA,this.selected_unit,this.selected_Pool,this.selected_wcs,this.selected_date)
  }
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
    this.newWaterManagement.Sort_time=time.toString();
    var day=day1.toString();
    var month=month1.toString();
    var year=year1.toString();
    var stringg=month+ "-" + day + "-" + year;

    this.newWaterManagement.Date=  stringg;
  }

//add a watermangement recrod to the cloud
addWaterManagement(CA,unit,pool,wcs,date) {

  if (date==="Create New Record" || date===""){
      console.log("date in funciton is "+date)
      this.getdatesfordb();
  }
  else{
/*     full_date=this.newWaterManagement.Date */
  }
    console.log(this.newWaterManagement.Sort_time)
    this.cloudservice.addWaterManagement(this.newWaterManagement,CA,unit,pool,wcs,this.newWaterManagement.Date,this.newWaterManagement.Sort_time);
    //always also update local service when update cloud otherwise old local service record will overwrite updated record 
    //after it is pushed
    this.localService.addWaterManagement(this.newWaterManagement);    
    this.comp.openDataWrittenDialog();
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
  
  //creates initial chart
  makeChart(){
    this.dates=[this.prev_data_master[1]['Date'],this.prev_data_master[0]['Date'],"Current Entry"];
    this.elevation_data=[this.prev_data_master[1]['Elevation'],this.prev_data_master[0]['Elevation'],this.newWaterManagement.Elevation];
    this.gate_level_data=[this.prev_data_master[1]['Gate_level'],this.prev_data_master[0]['Gate_level'],this.newWaterManagement.Gate_level];
    this.ducks_num_data=[this.prev_data_master[1]['Duck_numbers'],this.prev_data_master[0]['Duck_numbers'],this.newWaterManagement.Duck_numbers];
    this.geese_num_data=[this.prev_data_master[1]['Goose_numbers'],this.prev_data_master[0]['Goose_number'],this.newWaterManagement.Goose_numbers];

    console.log(this.elevation_data)
    console.log(this.gate_level_data)
    console.log(this.ducks_num_data)
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
        }
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
        }
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
        }
      })       
    }
    }
  }
}