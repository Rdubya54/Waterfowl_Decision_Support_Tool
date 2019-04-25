import { Component, OnInit} from '@angular/core';
import { LocalWaterFood } from 'src/app/service/waterfood-local.service';
import { AngularFireDatabase } from 'angularfire2/database';
import {MediaMatcher} from '@angular/cdk/layout';
import {ChangeDetectorRef, OnDestroy} from '@angular/core';
import {Globals} from 'src/app/extra/globals';
import {AppComponent} from 'src/app/app.component';

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

  constructor(private comp:AppComponent,private localService: LocalWaterFood,  private globals:Globals,
    private firebase: AngularFireDatabase) {
      this.localservice = localService;
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
    //this.cloudservice.addWaterManagement(this.newWaterManagement);    
  }
  }

  clearNewWaterManagement() {
    this.newWaterFood = new WaterFood();
  }
}

