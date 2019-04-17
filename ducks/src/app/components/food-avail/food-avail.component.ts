import { Component, OnInit} from '@angular/core';
import { FoodAvailLocalService } from 'src/app/service/food-avail-local.service';
import { AngularFireDatabase } from 'angularfire2/database';
import {MediaMatcher} from '@angular/cdk/layout';
import {ChangeDetectorRef, OnDestroy} from '@angular/core';
import {Globals} from 'src/app/extra/globals';

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
    private firebase: AngularFireDatabase) {
      this.localservice = localService;
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
