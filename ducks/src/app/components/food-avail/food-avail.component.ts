import { Component, OnInit,EventEmitter,Output,Input} from '@angular/core';
import { FoodAvailLocalService } from 'src/app/service/food-avail-local.service';
import { AngularFireDatabase } from 'angularfire2/database';
import {MediaMatcher} from '@angular/cdk/layout';
import {ChangeDetectorRef, OnDestroy} from '@angular/core';
import {MatBottomSheet, MatBottomSheetRef} from '@angular/material';
import {AppComponent} from 'src/app/app.component';

import {dbService} from 'src/app/service/db.service';
import {LocalDbService} from 'src/app/service/local-db.service'
import {MoistsoilService} from 'src/app/service/moistsoil.service'
import {FoodAvailCloudService} from 'src/app/service/food-avail-cloud.service';


import {
  FoodAvail,
  IFoodAvail
} from 'src/app/model/food-avail';
import { stringToKeyValue } from '@angular/flex-layout/extended/typings/style/style-transforms';

@Component({
  selector: 'app-food-avail',
  templateUrl: './food-avail.component.html',
  styleUrls: ['./food-avail.component.css']
})

export class FoodAvailComponent implements OnInit {
  breakpoint:number;
  breakpoint_top:number;

  private localservice: FoodAvailLocalService;
  foodavails: any[];
  newFoodAvail: IFoodAvail = new FoodAvail();
  local_records: any[];

  public selected_CA;
  public unit_list: string[]=[];
  public selected_unit; 
  public Pool_list: string[]=[];
  public selected_Pool;
  public wcs_list: string[]=[];
  public selected_wcs;
  public date_list: string[]=["Create New Record"];
  public selected_date;
  public prev_data:string[]=[];

  public previous_records;
  public second_previous_records;

  public status;
  public placeholderid;

  public buttonName: any = true;
  toggleActive:boolean = false;

  constructor(private comp:AppComponent,private localService: FoodAvailLocalService,
    private cloudservice: FoodAvailCloudService, private dbservice:dbService,private dbservice_local:LocalDbService,private firebase: AngularFireDatabase,
    private bottomSheet: MatBottomSheet,public moistsoilservice:MoistsoilService) {
      this.localservice = localService;
      this.moistsoilservice=moistsoilservice;
      this.dbservice=dbservice;
  }

  //opens Moist Soil Calculator
  openBottomSheet(): void {
    this.bottomSheet.open(BottomSheetOverviewExampleSheet);
  }

  ngOnInit() {
    this.breakpoint_top = (window.innerWidth <= 768) ? 1 : 1;
    this.breakpoint = (window.innerWidth <= 768) ? 1 : 2;

    console.log(localStorage.getItem("CA"))

    this.selected_CA=localStorage.getItem("CA")

    this.status=localStorage.getItem('Status')

    //commented this out may need to uncomment

/*     this.dbservice.getUnits(this.selected_CA).subscribe(data => {
      this.unit_list=[];
      this.Pool_list=[];
      this.wcs_list=[];
      data.forEach(doc => {
        this.unit_list.push(doc.id)
      });
  }); */

  
  //if app is online push any locally cached data to the cloud
  if (this.status==="online"){
    this.dbservice.getUnits(this.selected_CA).subscribe(data => {
      this.unit_list=[];
      this.Pool_list=[];
      this.wcs_list=[];
      data.forEach(doc => {
        this.unit_list.push(doc.id)
      });
  });

  }

  else if (this.status==="offline"){
    console.log("GETTING CAs")
    this.localService.getUnits(this.selected_CA).then(data => {
      this.foodavails = data;

      this.foodavails.forEach(record =>{
          var unit=record["unit"]
          this.unit_list.push(unit)
          console.log(this.unit_list)
      });
    });
  }
}


// fetches list of availabe units in CA for dropdown
getUnits(CA){
  this.unit_list=[];
  this.Pool_list=[];

  if (this.status==="online"){
  console.log("getting from oneline")
  this.dbservice.getUnits(CA).subscribe(data => {
    data.forEach(doc => {
      console.log("unit is "+doc.id)
      this.unit_list.push(doc.id)
    });
  });
  }

  else if (this.status==="offline"){
    console.log("getting from offline")
    this.localService.getUnits(CA).then(data => {
      this.foodavails = data;

      this.foodavails.forEach(record =>{
          var Unit=record["unit"]
          this.unit_list.push(Unit)
          console.log(this.unit_list)
      });
    });
  }
}

// fetches list of availabe pools in units for dropdown
getPools(CA,unit){
  this.Pool_list=[];

  if (this.status==="online"){
  this.dbservice.getPools(CA,unit).subscribe(data => {
    data.forEach(doc => {
      this.Pool_list.push(doc.id)
    });
  });
  }

  else if (this.status==="offline"){
    this.localService.getPools(CA,unit).then(data => {
      this.foodavails = data;

      this.foodavails.forEach(record =>{
          var pool=record["pool"]
          this.Pool_list.push(pool)
          console.log(this.Pool_list)
      });
    });
  }
}

// fetches list of available strucutres in pool for dropdown
getWCS(CA,unit,pool){
  this.wcs_list=[];

  if (this.status==="online"){
  this.dbservice.getWCS(CA,unit,pool).subscribe(data => {
    data.forEach(doc => {
      this.wcs_list.push(doc.id)
    });
  });
  }
  else if (this.status==="offline"){
    this.localService.getWCS(CA,unit,pool).then(data => {
      this.foodavails = data;

      this.foodavails.forEach(record =>{
          var wcs=record["structure"]
          this.wcs_list.push(wcs)
          console.log(this.wcs_list)
      });
    });
  }
}

// fetches list of available record dates for pool for dropdown
getDates(CA,unit,pool,wcs){
  this.date_list=["Create New Record"];
  console.log('locatin:'+location)

  if (this.status==="online"){
  this.dbservice.getDates_foodavail(CA,unit,pool,wcs).subscribe(data => {
    data.forEach(doc => {
      this.date_list.push(doc.id)
    });
  });
  }

  else if (this.status==="offline"){
  this.localService.getDates(CA,unit,pool,wcs).then(data => {
    data.forEach(doc => {
      console.log(doc['date'])
      this.date_list.push(doc['date'])
    });
  });
  }
}

//read a foodavail record
getFoodAvail(CA,Unit,Pool,WCS,date){

  //when you are only getting old data
  if (this.selected_date!=='Create New Record'){

    //populate page with old record
    if (this.status==="online"){
      console.log('fetching cloud')
      this.cloudservice.getFoodAvail(CA,Unit,Pool,WCS,date).
      subscribe(data=>{
        console.log(data)
        this.newFoodAvail.CA=data.get('CA')
        this.newFoodAvail.unit=data.get('unit')
        this.newFoodAvail.pool=data.get('pool')
        this.newFoodAvail.structure=data.get('structure')
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
        this.moistsoilservice.newMoistSoil.millet_output=data.get('millet_output')
        this.moistsoilservice.newMoistSoil.foxtail_output=data.get('foxtail_output')
        this.moistsoilservice.newMoistSoil.rice_cut_output=data.get('rice_cut_output')
        this.moistsoilservice.newMoistSoil.panic_grass_output=data.get('panic_grass_output')
        this.moistsoilservice.newMoistSoil.crabgrass_output=data.get('crabgrass_output')
        this.moistsoilservice.newMoistSoil.sprangletop_output=data.get('sprangletop_output')
        this.moistsoilservice.newMoistSoil.lapathifolium_output=data.get('lapathifolium_output')
        this.moistsoilservice.newMoistSoil.pennsylvanicum_output=data.get('pennsylvanicum_output')
        this.moistsoilservice.newMoistSoil.coccineum_output=data.get('coccineum_output')
        this.moistsoilservice.newMoistSoil.water_pepper_output=data.get('water_pepper_output')
        this.moistsoilservice.newMoistSoil.pigweed_output=data.get('pigweed_output')
        this.moistsoilservice.newMoistSoil.bidens_output=data.get('bidens_output')
        this.moistsoilservice.newMoistSoil.other_seed_output=data.get('other_seed_output')
        this.moistsoilservice.newMoistSoil.open_water_output=data.get('open_water_output')
        this.moistsoilservice.newMoistSoil.recently_disced_output=data.get('recently_disced_output')
        this.moistsoilservice.newMoistSoil.chufa_output=data.get('chufa_output')
        this.moistsoilservice.newMoistSoil.redroot_output=data.get('redroot_output')
        this.moistsoilservice.newMoistSoil.sedge_output=data.get('sedge_output')
        this.moistsoilservice.newMoistSoil.rush_output=data.get('rush_output')

      })
    }

      //populate page with old record
     else if (this.status==="offline"){
      this.localservice.getFoodAvail_selected(CA,Unit,Pool,WCS,date).
        then(data => {
            this.foodavails = data;
            this.foodavails.forEach(record =>{
              console.log(record)
              this.placeholderid=record["id"]
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
              this.moistsoilservice.newMoistSoil.millet_output=record['millet_output']
              this.moistsoilservice.newMoistSoil.foxtail_output=record['foxtail_output']
              this.moistsoilservice.newMoistSoil.rice_cut_output=record['rice_cut_output']
              this.moistsoilservice.newMoistSoil.panic_grass_output=record['panic_grass_output']
              this.moistsoilservice.newMoistSoil.crabgrass_output=record['crabgrass_output']
              this.moistsoilservice.newMoistSoil.sprangletop_output=record['sprangletop_output']
              this.moistsoilservice.newMoistSoil.lapathifolium_output=record['lapathifolium_output']
              this.moistsoilservice.newMoistSoil.pennsylvanicum_output=record['pennsylvanicum_output']
              this.moistsoilservice.newMoistSoil.coccineum_output=record['coccineum_output']
              this.moistsoilservice.newMoistSoil.water_pepper_output=record['water_pepper_output']
              this.moistsoilservice.newMoistSoil.pigweed_output=record['pigweed_output']
              this.moistsoilservice.newMoistSoil.bidens_output=record['bidens_output']
              this.moistsoilservice.newMoistSoil.other_seed_output=record['other_seed_output']
              this.moistsoilservice.newMoistSoil.open_water_output=record['open_water_output']
              this.moistsoilservice.newMoistSoil.recently_disced_output=record['recently_disced_output']
              this.moistsoilservice.newMoistSoil.chufa_output=record['chufa_output']
              this.moistsoilservice.newMoistSoil.redroot_output=record['redroot_output']
              this.moistsoilservice.newMoistSoil.sedge_output=record['sedge_output']
              this.moistsoilservice.newMoistSoil.rush_output=record['rush_output']
            });
        });
    }
  }
}

//write data to either local or cloud depending on online status
addData(selected_date){

    this.newFoodAvail.CA=this.selected_CA;
    this.newFoodAvail.unit=this.selected_unit
    this.newFoodAvail.pool=this.selected_Pool
    this.newFoodAvail.structure=this.selected_wcs

    //if updating a record you will already have all of this info
    if (selected_date==="Create New Record"){
      this.getdatesfordb()
    }

    else {
      this.newFoodAvail.date=this.selected_date
    }

    //if app is offline, write to indexdb
    if (this.status=="offline"){
    this.localservice.addFoodAvail(this.newFoodAvail).
    then((addedFoodAvails: IFoodAvail[]) => {
    if (addedFoodAvails.length > 0) {
      if(this.selected_date!=='Create New Record'){
        this.localService.deleteFoodAvail(this.placeholderid)
      }

      this.foodavails.push(addedFoodAvails[0]);
      this.clearNewFoodAvail();
    }
    })
  }

  //if app is online, write to cloud (firestore for the time being)
  else{
    this.cloudservice.addFoodAvail(this.newFoodAvail);
  }

  //display writtn to dialog and refresh the page
  this.comp.openDataWrittenDialog();
}
 
//creates timestamps to write to dbs
getdatesfordb(){
    var d = new Date();
    var day1=d.getDate();
    var month1=(d.getMonth()+1);
    var year1=d.getFullYear();
    var time1=d.getTime()
    var time=time1.toString();
    console.log(day1)
    console.log(month1)
    console.log(year1)
    var day=day1.toString();
    var month=month1.toString();
    var year=year1.toString();
    var stringg=month+ "-" + day + "-" + year;

    var full_date=stringg;
    console.log(full_date)


    this.newFoodAvail.date=full_date
    this.newFoodAvail.sort_time=time;
}

clearNewFoodAvail() {
    this.newFoodAvail = new FoodAvail();
}

onResize(event) {
    this.breakpoint = (event.target.innerWidth <= 768) ? 1 : 2; 
}

}

/////////////////////////////////////////moist soil code////////////////////////////////////////////////////////////////////

export interface PeriodicElement {
  Plant_Species: string;
  Percent_of_Pool: string;
  Number_of_Seed_Heads: any;
  Plant_Height: string;
  Seed_Height: string;
  Seed_Diameter: string;
}

const UPPER_DATA: PeriodicElement[] = [
  {Plant_Species: "Millet", Percent_of_Pool: "", Number_of_Seed_Heads: "", Plant_Height: '',Seed_Height:'',Seed_Diameter:''},
  {Plant_Species: "Foxtail", Percent_of_Pool: "", Number_of_Seed_Heads: '', Plant_Height: '',Seed_Height:'',Seed_Diameter:''},
  {Plant_Species: "Rice Cut Grass", Percent_of_Pool: "", Number_of_Seed_Heads: '', Plant_Height: '',Seed_Height:'',Seed_Diameter:''},
  {Plant_Species: "Panic Grass", Percent_of_Pool: "", Number_of_Seed_Heads: '', Plant_Height: '',Seed_Height:'',Seed_Diameter:''},
  {Plant_Species: "Crabgrass", Percent_of_Pool: "", Number_of_Seed_Heads: '', Plant_Height: '',Seed_Height:'',Seed_Diameter:''},
  {Plant_Species: "Sprangletop", Percent_of_Pool: "", Number_of_Seed_Heads: '', Plant_Height: '',Seed_Height:'',Seed_Diameter:''},
  {Plant_Species: "Lapathifolium", Percent_of_Pool: "", Number_of_Seed_Heads: '', Plant_Height: '',Seed_Height:'',Seed_Diameter:''},
  {Plant_Species: "Pennsylvanicum", Percent_of_Pool: "", Number_of_Seed_Heads: '', Plant_Height: '',Seed_Height:'',Seed_Diameter:''},
  {Plant_Species: "Coccineum", Percent_of_Pool: "", Number_of_Seed_Heads: '', Plant_Height: '',Seed_Height:'',Seed_Diameter:''},
  {Plant_Species: "Water Pepper", Percent_of_Pool: "", Number_of_Seed_Heads: '', Plant_Height: '',Seed_Height:'',Seed_Diameter:''},
  {Plant_Species: "Pigweed", Percent_of_Pool: "", Number_of_Seed_Heads: '', Plant_Height: '',Seed_Height:'',Seed_Diameter:''},
  {Plant_Species: "Bidens", Percent_of_Pool: "", Number_of_Seed_Heads: '', Plant_Height: '',Seed_Height:'',Seed_Diameter:''},
  {Plant_Species: "Other Seed", Percent_of_Pool: "", Number_of_Seed_Heads: '', Plant_Height: '',Seed_Height:'',Seed_Diameter:''},
  {Plant_Species: "Non Seed", Percent_of_Pool: "", Number_of_Seed_Heads: '', Plant_Height: '',Seed_Height:'',Seed_Diameter:''},
  {Plant_Species: "Open Water", Percent_of_Pool: "", Number_of_Seed_Heads: '', Plant_Height: '',Seed_Height:'',Seed_Diameter:''},
  {Plant_Species: "Recently Disced", Percent_of_Pool: "", Number_of_Seed_Heads: '', Plant_Height: '',Seed_Height:'',Seed_Diameter:''},
];

const LOWER_DATA: PeriodicElement[] = [
  {Plant_Species: "Chufa", Percent_of_Pool: "", Number_of_Seed_Heads: '', Plant_Height: '',Seed_Height:'',Seed_Diameter:''},
  {Plant_Species: "Redroot", Percent_of_Pool: "", Number_of_Seed_Heads: '', Plant_Height: '',Seed_Height:'',Seed_Diameter:''},
  {Plant_Species: "Sedge", Percent_of_Pool: "", Number_of_Seed_Heads: '', Plant_Height: '',Seed_Height:'',Seed_Diameter:''},
  {Plant_Species: "Rush", Percent_of_Pool: "", Number_of_Seed_Heads: '', Plant_Height: '',Seed_Height:'',Seed_Diameter:''}
];


@Component({
  selector: 'mosit-soil-calculator',
  templateUrl: 'moist-soil-calculator.html',
  styleUrls: ['moist-soil-calculator.css']
})
export class BottomSheetOverviewExampleSheet {

  displayedColumns: string[] = ['Plant_Species', 'Percent_of_Pool', 'Number_of_Seed_Heads', 'Plant_Height', 'Seed_Height','Seed_Diameter'];
  upper_dataSource = UPPER_DATA;
  lower_dataSource = LOWER_DATA;

  display_upper_table=false;
  display_lower_table=false;

  lower_total=0;
  upper_total=0;

  constructor(private bottomSheetRef: MatBottomSheetRef<BottomSheetOverviewExampleSheet>,private food:FoodAvailComponent,
    public moistsoilservice:MoistsoilService) {}

  openLink(event: MouseEvent): void {
    this.bottomSheetRef.dismiss();
    event.preventDefault();
  }

  calculate_percent(type,seedhead,plantheight,seedheight,seeddiameter){
    console.log(type)
    console.log(seedhead)
    console.log(plantheight)
    console.log(seedheight)
    console.log(seeddiameter)

    if (seedhead && plantheight && seedheight && seeddiameter){
      var seedhead_og=seedhead;
      seedhead=this.get_median_of_range(seedhead,type,'seedhead');
      plantheight=this.get_median_of_range(plantheight,type,'plantheight');
      seedheight=this.get_median_of_range(seedheight,type,'seedheight');
      seeddiameter=this.get_median_of_range(seeddiameter,type,'seeddiameter');

      console.log(seedhead)
      console.log(plantheight)
      console.log(seedheight)
      console.log(seeddiameter)
  


    var π = 3.1416; 
    var r = seeddiameter/2;
    var h = seedheight;
    var HEADS=seedhead;
    var RSquare=r*r;
    var RCube=r*r*r;
    var VolE=(HEADS)*(3.1416*RSquare*h/3);
    var VolG=(HEADS)*(3.1416*RSquare*h);
    var VolH=(HEADS)*(1.33*3.1416*RCube/2);

    var seed_prod;


    if (type==='Millet'){
      //estimating seed production for millet/barnyard grass
      seed_prod=(plantheight*3.67855) + (0.000696 * VolE);
      //convert from pounds to grams
      console.log("calculated")
      seed_prod=seed_prod*142.74;
      seed_prod=seed_prod.toFixed(2);
      this.moistsoilservice.newMoistSoil.millet_output=seed_prod;
      this.calculate_total("upper");
    }

    else if (type==='Foxtail'){
      seed_prod=(0.03289 * VolG);
      //convert from pounds to grams
      seed_prod=seed_prod*142.74;
      seed_prod=seed_prod.toFixed(2);
      this.moistsoilservice.newMoistSoil.foxtail_output=seed_prod;
      this.calculate_total("upper");
    }

    else if (type==='Rice Cut Grass'){
      seed_prod=(0.2814 * HEADS);
      //convert from pounds to grams
      seed_prod=seed_prod*142.74;
      seed_prod=seed_prod.toFixed(2);
      this.moistsoilservice.newMoistSoil.rice_cut_output=seed_prod;
      this.calculate_total("upper");
    }

    else if (type==='Panic Grass'){
      seed_prod=(0.36369 * plantheight) + (0.01107 * HEADS);
      //convert from pounds to grams
      seed_prod=seed_prod*142.74;
      seed_prod=seed_prod.toFixed(2);
      this.moistsoilservice.newMoistSoil.panic_grass_output=seed_prod;
      this.calculate_total("upper");
    }

    else if (type==='Crabgrass'){
      seed_prod=(0.02798 * HEADS);
      //convert from pounds to grams
      seed_prod=seed_prod*142.74;
      seed_prod=seed_prod.toFixed(2);
      this.moistsoilservice.newMoistSoil.crabgrass_output=seed_prod;
      this.calculate_total("upper");
    }

    else if (type==='Sprangletop'){
      seed_prod=(1.4432 * plantheight) + (0.00027 * VolE);
      //convert from pounds to grams
      seed_prod=seed_prod*142.74;
      seed_prod=seed_prod.toFixed(2);
      this.moistsoilservice.newMoistSoil.sprangletop_output=seed_prod;
      this.calculate_total("upper");
    }

    else if (type==='Lapathifolium'){
      seed_prod=(0.10673*HEADS);
      //convert from pounds to grams
      seed_prod=seed_prod*142.74;
      seed_prod=seed_prod.toFixed(2);
      this.moistsoilservice.newMoistSoil.lapathifolium_output=seed_prod;
      this.calculate_total("upper");
    }
    
    else if (type==='Pennsylvanicum'){
      seed_prod=(0.10673*HEADS);
      //convert from pounds to grams
      seed_prod=seed_prod*142.74;
      seed_prod=seed_prod.toFixed(2);
      this.moistsoilservice.newMoistSoil.pennsylvanicum_output=seed_prod;
      this.calculate_total("upper");
    }

    else if (type==='Coccineum'){
      seed_prod=(0.10673*HEADS);
      //convert from pounds to grams
      seed_prod=seed_prod*142.74;
      seed_prod=seed_prod.toFixed(2);
      this.moistsoilservice.newMoistSoil.coccineum_output=seed_prod;
      this.calculate_total("upper");
    }

    else if (type==='Water Pepper'){
      seed_prod=(0.484328*plantheight)+(0.0033*VolG);
      //convert from pounds to grams
      seed_prod=seed_prod*142.74;
      seed_prod=seed_prod.toFixed(2);
      this.moistsoilservice.newMoistSoil.water_pepper_output=seed_prod;
      this.calculate_total("upper");
    }

    else if (type==='Pigweed'){
      seed_prod=seedhead_og;
      this.moistsoilservice.newMoistSoil.pigweed_output=seed_prod;
      this.calculate_total("upper");
    }

    else if (type==='Bidens'){
      seed_prod=seedhead_og;
      this.moistsoilservice.newMoistSoil.bidens_output=seed_prod;
      this.calculate_total("upper");
    }

    else if (type==='Chufa'){
      seed_prod=(0.00208*VolH);
      //convert from pounds to grams
      seed_prod=seed_prod*142.74;
      seed_prod=seed_prod.toFixed(2);
      this.moistsoilservice.newMoistSoil.chufa_output=seed_prod;
      this.calculate_total("lower");
    }

    
    else if (type==='Redroot'){
      seed_prod=(3.08247*HEADS)+(2.38866*seeddiameter)-(3.40976*seedheight);
      //convert from pounds to grams
      seed_prod=seed_prod*142.74;
      seed_prod=seed_prod.toFixed(2);
      this.moistsoilservice.newMoistSoil.redroot_output=seed_prod;
      this.calculate_total("lower");
    }

    
    else if (type==='Sedge'){
      seed_prod=(2.00187*plantheight)+(0.01456*HEADS);
      //convert from pounds to grams
      seed_prod=seed_prod*142.74;
      seed_prod=seed_prod.toFixed(2);
      this.moistsoilservice.newMoistSoil.sedge_output=seed_prod;
      this.calculate_total("lower");
    }
    
    
    else if (type==='Rush'){
      //seed_prod=(1.4432 * plantheight) + (0.00027 * VolE);
      //convert from pounds to grams
      seed_prod=seed_prod*142.74;
      seed_prod=seed_prod.toFixed(2);
      this.moistsoilservice.newMoistSoil.rush_output=seed_prod;
      this.calculate_total("lower");
    }

    else{
    }
  }
}

  get_median_of_range(value_range,type,button) {

    var increment=1;

    console.log('range:'+value_range)
    console.log('type:'+type)

    var is_decimal = value_range.includes(".")
    var is_max = value_range.includes("+")
    var is_min = value_range.includes('<')


    if (is_decimal===true){
      increment=0.01;
    }

    if (is_max==false && is_min==false){
      console.log('is normal')
      console.log(value_range)
      var res = value_range.split("-");
      console.log(res[0])
      console.log(res[1])

      var lower_limit=Number(res[0]);
      var upper_limit=Number(res[1]);

      var median_array=[];
      var i;

      for (i = lower_limit; i <= upper_limit; i=(i+increment)) { 
        median_array.push(i);
      } 

      console.log(median_array)
      var median = 0, numsLen = median_array.length;
      
      console.log("nums length is "+numsLen)
      // is even
      if (numsLen % 2 === 0 ) 
      {
          console.log("even")
          // average of two middle numbers
          
          median = (median_array[numsLen / 2 - 1] + median_array[numsLen / 2]) / 2;
      } 
      else { // is odd
          // middle number only
          console.log("odd")
          median = median_array[(numsLen - 1) / 2];
      }
    }

    else if(is_min==true){
      console.log('is min')
      if (type==='Panic Grass'){
        if (button==='seedhead'){
          median=5.5;
        }
        else if (button==='plantheight'){
          median=0.50;
        }
      }
      else if (type==='Crabgrass'){
        if (button==='seedhead'){
          median=5.5;
        }
      }
      else if (type==='Sprangletop'){
        if (button==='seedhead'){
          median=5.5;
        }
        else if (button==='plantheight'){
          median=.255;
        }
        else if (button==='seedheight'){
          median=7.5;
        }
        else if (button==='seeddiameter'){
          median=4.5;
        }
      }
      else if (type==='Water Pepper'){
        if (button==='plantheight'){
          median=0.205;
        }
      }

      else if (type==='Sedge'){
        if (button==='seedhead'){
          median=2.5;
        }

        else if (button==='plantheight'){
          median=0.25;
        }
      } 
    }

    //if this is a button that says for example 19+ you have to hard code the medians
    else if (is_max==true){
      console.log('is max')
      if (type==='Millet'){
        if (button==='seedhead'){
          median=21.5;
        }
        else if (button==='plantheight'){
          median=1.75;
        }
        else if (button==='seedheight'){
          median=21.5;
        }
        else if (button==='seeddiameter'){
          median=14.5;
        }
      }

      else if (type==='Foxtail'){
        if (button==='seedhead'){
          median=14.5;
        }
        else if (button==='plantheight'){
          median=-99999;
        }
        else if (button==='seedheight'){
          median=11;
        }
        else if (button==='seeddiameter'){
          median=2.05;
        }
      }

      else if (type==='Rice Cut Grass'){
        if (button==='seedhead'){
          median=11;
        }
      }

      else if (type==='Panic Grass'){
        if (button==='seedhead'){
          median=15.5;
        }
        else if (button==='plantheight'){
          median=1.50;
        }
      }

      else if (type==='Crabgrass'){
        if (button==='seedhead'){
          median=15.5;
        }
      }

      else if (type==='Sprangletop'){
        if (button==='seedhead'){
          median=15.5;
        }
        else if (button==='plantheight'){
          median=.755;
        }
        else if (button==='seedheight'){
          median=22.5;
        }
        else if (button==='seeddiameter'){
          median=12.5;
        }
      }

      else if (type==='Lapathifolium'){
        if (button==='seedhead'){
          median=42.5;
        }
      }

      else if (type==='Pennsylvanicum'){
        if (button==='seedhead'){
          median=42.5;
        }
      }

      else if (type==='Coccineum'){
        if (button==='seedhead'){
          median=42.5;
        }
      }

      else if (type==='Water Pepper'){
        if (button==='seedhead'){
          median=42.5;
        }
        else if (button==='plantheight'){
          median=1.105;
        }
        else if (button==='seedheight'){
          median=11;
        }
        else if (button==='seeddiameter'){
          median=1.1;
        }
      }

      else if (type==='Chufa'){
        if (button==='seedhead'){
          median=11;
        }
        else if (button==='seeddiameter'){
          median=21.5;
        }
      }

      else if (type==='Redroot'){
        if (button==='seedhead'){
          median=5.5;
        }
        else if (button==='seedheight'){
          median=11;
        }
        else if (button==='seeddiameter'){
          median=11;
        }
      } 

      else if (type==='Sedge'){
        if (button==='seedhead'){
          median=7.5;
        }
        else if (button==='plantheight'){
          median=0.75;
        }
      } 

    }
    
    console.log('median:'+median)
    return median;
  }

  toggle_table(input){
    if (input==='upper'){
      this.display_upper_table=true;
      this.display_lower_table=false;
    }
    else if (input==='lower'){
      this.display_lower_table=true;
      this.display_upper_table=false;
    }
  }

  calculate_total(table){
    if (table==="upper"){

      this.upper_total=0;

      if (this.moistsoilservice.newMoistSoil.millet_output && this.moistsoilservice.newMoistSoil.millet_output!==null){
        console.log(this.moistsoilservice.newMoistSoil.millet_output)
        this.upper_total=this.upper_total+Number(this.moistsoilservice.newMoistSoil.millet_output);
      }

      if (this.moistsoilservice.newMoistSoil.foxtail_output && this.moistsoilservice.newMoistSoil.foxtail_output!==null){
        console.log(this.moistsoilservice.newMoistSoil.foxtail_output)
        this.upper_total=this.upper_total+Number(this.moistsoilservice.newMoistSoil.foxtail_output);
      }

      if (this.moistsoilservice.newMoistSoil.rice_cut_output && this.moistsoilservice.newMoistSoil.rice_cut_output!==null){
        this.upper_total=this.upper_total+Number(this.moistsoilservice.newMoistSoil.rice_cut_output);
      }

      if (this.moistsoilservice.newMoistSoil.panic_grass_output && this.moistsoilservice.newMoistSoil.panic_grass_output!==null){
        this.upper_total=this.upper_total+Number(this.moistsoilservice.newMoistSoil.panic_grass_output);
      }

      if (this.moistsoilservice.newMoistSoil.crabgrass_output && this.moistsoilservice.newMoistSoil.crabgrass_output!==null){
        this.upper_total=this.upper_total+Number(this.moistsoilservice.newMoistSoil.crabgrass_output);
      }

      if (this.moistsoilservice.newMoistSoil.sprangletop_output && this.moistsoilservice.newMoistSoil.sprangletop_output!==null){
        this.upper_total=this.upper_total+Number(this.moistsoilservice.newMoistSoil.sprangletop_output);
      }

      if (this.moistsoilservice.newMoistSoil.lapathifolium_output && this.moistsoilservice.newMoistSoil.lapathifolium_output!==null){
        this.upper_total=this.upper_total+Number(this.moistsoilservice.newMoistSoil.lapathifolium_output);
      }

      if (this.moistsoilservice.newMoistSoil.pennsylvanicum_output && this.moistsoilservice.newMoistSoil.pennsylvanicum_output!==null){
        this.upper_total=this.upper_total+Number(this.moistsoilservice.newMoistSoil.pennsylvanicum_output);
      }

      if (this.moistsoilservice.newMoistSoil.coccineum_output && this.moistsoilservice.newMoistSoil.coccineum_output!==null){
        this.upper_total=this.upper_total+Number(this.moistsoilservice.newMoistSoil.coccineum_output);
      }

      if (this.moistsoilservice.newMoistSoil.water_pepper_output && this.moistsoilservice.newMoistSoil.water_pepper_output!==null){
        this.upper_total=this.upper_total+Number(this.moistsoilservice.newMoistSoil.water_pepper_output);
      }

      if (this.moistsoilservice.newMoistSoil.pigweed_output && this.moistsoilservice.newMoistSoil.pigweed_output!==null){
        this.upper_total=this.upper_total+Number(this.moistsoilservice.newMoistSoil.pigweed_output);
      }

      this.upper_total=Number(this.upper_total.toFixed(2))


      console.log("upper total is "+this.upper_total)
    }

    else if (table==="lower"){
    console.log("in lower")
    this.lower_total=
    this.moistsoilservice.newMoistSoil.chufa_output+
    this.moistsoilservice.newMoistSoil.redroot_output+
    this.moistsoilservice.newMoistSoil.sedge_output+
    this.moistsoilservice.newMoistSoil.rush_output;
    }
  }

}
