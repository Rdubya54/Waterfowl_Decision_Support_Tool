import { Component, OnInit} from '@angular/core';
import { LocalWaterFood } from 'src/app/service/waterfood-local.service';
import { AngularFireDatabase } from 'angularfire2/database';
import {MediaMatcher} from '@angular/cdk/layout';
import {ChangeDetectorRef, OnDestroy} from '@angular/core';
import {Globals} from 'src/app/extra/globals';
import {MatBottomSheet, MatBottomSheetRef} from '@angular/material';

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

  private localservice: LocalWaterFood;
  watermanagements: any[];
  newWaterFood: IWaterFood = new WaterFood();
  local_records: any[];

  public previous_records;
  public second_previous_records;

  public buttonName: any = true;
  toggleActive:boolean = false;

  constructor(private localService: LocalWaterFood,  private globals:Globals,
    private firebase: AngularFireDatabase,private bottomSheet: MatBottomSheet) {
      this.localservice = localService;
  }

  openBottomSheet(): void {
    this.bottomSheet.open(BottomSheetOverviewExampleSheet);
  }

  ngOnInit() {
    this.getWatermanagement();
    this.breakpoint = (window.innerWidth <= 768) ? 1 : 4;

    this.localservice.getWaterManagment().
    then(students => {
        this.watermanagements = students;

        var listt=this.watermanagements;
        this.previous_records=listt[0];

      }).catch(error => {
          console.error(error);
          alert(error.message);
      });

  }

  onResize(event) {
    this.breakpoint = (event.target.innerWidth <= 768) ? 1 : 4;
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
      this.localservice.addWaterManagement(this.newWaterFood).
      then((addedWaterManagements: IWaterFood[]) => {
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
    this.newWaterFood = new WaterFood();
  }
}

///////code for moist soil calculator pop-up

export interface PeriodicElement {
  Plant_Species: string;
  Percent_of_Pool: string;
  Number_of_Seed_Heads: any;
  Plant_Height: string;
  Seed_Height: string;
  Seed_Diameter: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {Plant_Species: "Millet", Percent_of_Pool: "", Number_of_Seed_Heads: "", Plant_Height: '',Seed_Height:'',Seed_Diameter:''},
  {Plant_Species: "Foxtail", Percent_of_Pool: "", Number_of_Seed_Heads: '', Plant_Height: '',Seed_Height:'',Seed_Diameter:''},
];


@Component({
  selector: 'bottom-sheet-overview-example-sheet',
  templateUrl: 'bottom-sheet-overview-example-sheet.html',
  styleUrls: ['bottom-sheet-overview-example-sheet.css']
})
export class BottomSheetOverviewExampleSheet {

  displayedColumns: string[] = ['Plant_Species', 'Percent_of_Pool', 'Number_of_Seed_Heads', 'Plant_Height', 'Seed_Height','Seed_Diameter'];
  dataSource = ELEMENT_DATA;

  millet_output="";
  foxtail_output="";

  constructor(private bottomSheetRef: MatBottomSheetRef<BottomSheetOverviewExampleSheet>) {}

  openLink(event: MouseEvent): void {
    this.bottomSheetRef.dismiss();
    event.preventDefault();
  }

  calculate_percent(type,seedhead,plantheight,seedheight,seeddiameter){

    seedhead=this.get_median_of_range(seedhead);
    plantheight=this.get_median_of_range(plantheight);
    seedheight=this.get_median_of_range(seedheight);
    seeddiameter=this.get_median_of_range(seeddiameter);

    var π = 3.1416; 
    var r = seeddiameter/2;
    var h = seedheight;
    var HEADS=seedhead;
    var seed_prod;

    if (type==='Millet'){
      //estimating seed production for millet/barnyard grass
      seed_prod=(plantheight*3.67855) + (0.000696 * ((HEADS) * ((π*r*r*h)/3)))
      this.millet_output=seed_prod;
    }

    else if (type==='Foxtail'){
      this.foxtail_output="This part of app isn't functional yet";
    }

    else{
      this.millet_output="error";
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
}
