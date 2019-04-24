import { Component, OnInit} from '@angular/core';
import { FoodAvailLocalService } from 'src/app/service/food-avail-local.service';
import { AngularFireDatabase } from 'angularfire2/database';
import {MediaMatcher} from '@angular/cdk/layout';
import {ChangeDetectorRef, OnDestroy} from '@angular/core';
import {Globals} from 'src/app/extra/globals';
import {MatBottomSheet, MatBottomSheetRef} from '@angular/material';

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

  private localservice: FoodAvailLocalService;
  watermanagements: any[];
  newFoodAvail: IFoodAvail = new FoodAvail();
  local_records: any[];

  public previous_records;
  public second_previous_records;

  public buttonName: any = true;
  toggleActive:boolean = false;

  constructor(private localService: FoodAvailLocalService,  private globals:Globals,
    private firebase: AngularFireDatabase,private bottomSheet: MatBottomSheet) {
      this.localservice = localService;
  }

  openBottomSheet(): void {
    this.bottomSheet.open(BottomSheetOverviewExampleSheet);
  }

  ngOnInit() {
    this.getWatermanagement();
    this.breakpoint = (window.innerWidth <= 768) ? 1 : 2;

    this.localservice.getWaterManagment().
    then(students => {
        this.watermanagements = students;

        var listt=this.watermanagements;

/*         console.log("list is "+listt)
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
        console.log("it is "+this.second_previous_records); */


      }).catch(error => {
          console.error(error);
          alert(error.message);
      });

  }

  onResize(event) {
    this.breakpoint = (event.target.innerWidth <= 768) ? 1 : 2;
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


    var status=this.globals.role;

    //if app is offline, write to indexdb
    if (status=="offline"){
      this.localservice.addWaterManagement(this.newFoodAvail).
      then((addedWaterManagements: IFoodAvail[]) => {
      if (addedWaterManagements.length > 0) {
        this.watermanagements.push(addedWaterManagements[0]);
        this.clearNewWaterManagement();
        alert('Successfully added');
        location.reload();
      }
      })
      .catch(error => {
      console.error(error);
      alert(error.message);
      });
    }


  //if app is online, write to cloud (firestore for the time being)
  else{
    //this.cloudservice.addWaterManagement(this.newWaterManagement);    
  }
  }

  clearNewWaterManagement() {
    this.newFoodAvail = new FoodAvail();
  }


}

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

  millet_output=0;
  foxtail_output=0;
  rice_cut_output=0;
  panic_grass_output=0;
  crabgrass_output=0;
  sprangletop_output=0;
  lapathifolium_output=0;
  pennsylvanicum_output=0;
  coccineum_output=0;
  water_pepper_output=0;
  pigweed_output=0;
  bidens_output=0;
  other_seed_output=0;
  non_seed_output=0;
  open_water_output=0;
  recently_disced_output=0;

  chufa_output=0;
  redroot_output=0;
  sedge_output=0;
  rush_output=0;

  display_upper_table=false;
  display_lower_table=false;

  lower_total=0;
  upper_total=0;

  constructor(private bottomSheetRef: MatBottomSheetRef<BottomSheetOverviewExampleSheet>) {}

  openLink(event: MouseEvent): void {
    this.bottomSheetRef.dismiss();
    event.preventDefault();
  }

  calculate_percent(type,seedhead,plantheight,seedheight,seeddiameter){

/*     if (seedhead!='NULL'){
      seedhead=this.get_median_of_range(seedhead);
    }
    if (plantheight!='NULL'){
      plantheight=this.get_median_of_range(plantheight);
    }
    if (seedheight!='NULL'){
      seedheight=this.get_median_of_range(seedheight);
    }
    if (seeddiameter!='NULL'){
      seedhead=this.get_median_of_range(seedhead);
    } */

    console.log(type)
    console.log(seedhead)
    console.log(plantheight)
    console.log(seedheight)
    console.log(seeddiameter)

    if (seedhead && plantheight && seedheight && seeddiameter){
      seedhead=this.get_median_of_range(seedhead);
      plantheight=this.get_median_of_range(plantheight);
      seedheight=this.get_median_of_range(seedheight);
      seeddiameter=this.get_median_of_range(seeddiameter);
    



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
      this.millet_output=seed_prod;
      this.calculate_total("upper");
    }

    else if (type==='Foxtail'){
      seed_prod=(0.03289 * VolG);
      //convert from pounds to grams
      seed_prod=seed_prod*142.74;
      this.foxtail_output=seed_prod;
      this.calculate_total("upper");
    }

    else if (type==='Rice Cut Grass'){
      seed_prod=(0.2814 * HEADS);
      //convert from pounds to grams
      seed_prod=seed_prod*142.74;
      this.rice_cut_output=seed_prod;
      this.calculate_total("upper");
    }

    else if (type==='Panic Grass'){
      seed_prod=(0.36369 * plantheight) + (0.01107 * HEADS);
      //convert from pounds to grams
      seed_prod=seed_prod*142.74;
      this.panic_grass_output=seed_prod;
      this.calculate_total("upper");
    }

    else if (type==='Crabgrass'){
      seed_prod=(0.02798 * HEADS);
      //convert from pounds to grams
      seed_prod=seed_prod*142.74;
      this.crabgrass_output=seed_prod;
      this.calculate_total("upper");
    }

    else if (type==='Sprangletop'){
      seed_prod=(1.4432 * plantheight) + (0.00027 * VolE);
      //convert from pounds to grams
      seed_prod=seed_prod*142.74;
      this.sprangletop_output=seed_prod;
      this.calculate_total("upper");
    }

    else if (type==='Lapathifolium'){
      //seed_prod=(1.4432 * plantheight) + (0.00027 * VolE);
      //convert from pounds to grams
      seed_prod=seed_prod*142.74;
      this.lapathifolium_output=0;
      this.calculate_total("upper");
    }
    
    else if (type==='Pennsylvanicum'){
      //seed_prod=(1.4432 * plantheight) + (0.00027 * VolE);
      //convert from pounds to grams
      seed_prod=seed_prod*142.74;
      this.pennsylvanicum_output=0;
      this.calculate_total("upper");
    }

    else if (type==='Coccineum'){
      //seed_prod=(1.4432 * plantheight) + (0.00027 * VolE);
      //convert from pounds to grams
      seed_prod=seed_prod*142.74;
      this.coccineum_output=0;
      this.calculate_total("upper");
    }

    else if (type==='Water Pepper'){
      //seed_prod=(1.4432 * plantheight) + (0.00027 * VolE);
      //convert from pounds to grams
      seed_prod=seed_prod*142.74;
      this.water_pepper_output=0;
      this.calculate_total("upper");
    }

    else if (type==='Pigweed'){
      //seed_prod=(1.4432 * plantheight) + (0.00027 * VolE);
      //convert from pounds to grams
      seed_prod=seed_prod*142.74;
      this.pigweed_output=0;
      this.calculate_total("upper");
    }

    else if (type==='Bidens'){
      //seed_prod=(1.4432 * plantheight) + (0.00027 * VolE);
      //convert from pounds to grams
      seed_prod=seed_prod*142.74;
      this.bidens_output=0;
      this.calculate_total("upper");
    }

    else if (type==='Chufa'){
      //seed_prod=(1.4432 * plantheight) + (0.00027 * VolE);
      //convert from pounds to grams
      seed_prod=seed_prod*142.74;
      this.chufa_output=6;
      this.calculate_total("lower");
    }

    
    else if (type==='Redroot'){
      //seed_prod=(1.4432 * plantheight) + (0.00027 * VolE);
      //convert from pounds to grams
      seed_prod=seed_prod*142.74;
      this.redroot_output=6;
      this.calculate_total("lower");
    }

    
    else if (type==='Sedge'){
      //seed_prod=(1.4432 * plantheight) + (0.00027 * VolE);
      //convert from pounds to grams
      seed_prod=seed_prod*142.74;
      this.sedge_output=6;
      this.calculate_total("lower");
    }
    
    
    else if (type==='Rush'){
      //seed_prod=(1.4432 * plantheight) + (0.00027 * VolE);
      //convert from pounds to grams
      seed_prod=seed_prod*142.74;
      this.rush_output=0;
      this.calculate_total("lower");
    }

    else{
      this.millet_output=0;
    }
  }
  }

  get_median_of_range(value_range) {

    var increment=1;

    var is_decimal = value_range.includes(".")

    console.log(is_decimal)

    if (is_decimal===true){
      increment=0.01;
    }

    console.log(value_range)
    var res = value_range.split("-");
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
    
    console.log(median)
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
    console.log("in here")
    if (table==="upper"){
      console.log("in here2")
      this.upper_total=
      this.millet_output+
      this.foxtail_output+
      this.rice_cut_output+
      this.panic_grass_output+
      this.crabgrass_output+
      this.sprangletop_output+
      this.lapathifolium_output+
      this.pennsylvanicum_output+
      this.coccineum_output+
      this.water_pepper_output+
      this.pigweed_output+
      this.bidens_output+
      this.other_seed_output+
      this.non_seed_output+
      this.open_water_output+
      this.recently_disced_output;
      console.log("upper total is "+this.upper_total.toString())
    }

    else if (table==="lower"){
    console.log("in lower")
    this.lower_total=this.chufa_output+
    this.redroot_output+
    this.sedge_output+
    this.rush_output;
    }
  }

  test(){
    console.log("hiya buddy");
  }
}
