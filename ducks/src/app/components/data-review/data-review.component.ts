import { Component, OnInit } from '@angular/core';

import {Globals} from 'src/app/extra/globals';
import { AngularFireDatabase } from 'angularfire2/database';
import {WatermanagementCloudService} from 'src/app/service/watermanagement-cloud.service';
import { LocalWaterFood } from 'src/app/service/waterfood-local.service';
import { LocalWaterManagementService } from 'src/app/service/watermanagement-local.service';
import {FoodAvailLocalService} from 'src/app/service/food-avail-local.service';

import {
  Watermanagement,
  IWatermanagement
} from 'src/app/model/watermanagement';
import { WeatherLocalService } from 'src/app/service/weather-local.service';


@Component({
  selector: 'app-data-review',
  templateUrl: './data-review.component.html',
  styleUrls: ['./data-review.component.css']
})
export class DataReviewComponent implements OnInit {

  private localservice_watermanagement: LocalWaterManagementService;
  private localservice_waterfood:LocalWaterFood;
  private localservice_foodavail:FoodAvailLocalService;
  private localservice_weather: WeatherLocalService;
  private cloudservice: WatermanagementCloudService;
  watermanagements: any[];
  newWaterManagement: IWatermanagement = new Watermanagement();
  local_records: any[];
  watermanagement_Columns: string[] = ['date','pool','structure','elevation','gate_manipulation','gate_level',
                                'stop_change','stop_level','duck_numbers','goose_numbers','year','time',
                              'fiscal_year','notes','reasons'];

  waterfood_Columns: string[] = ['buttons','month','day','pool','percent_of_full_pool','less_than_six','seven_to_twelve',
  'thirteen_or_more','habitat_standing','habitat_mowed','habitat_disced','habitat_unharv_corn','habitat_harv_corn',
  'habitat_unharv_milo','habitat_harv_milo','habitat_unharv_beans','habitat_harv_beans','habitat_browse',
  'ice_standing','ice_mowed','ice_disced','ice_unharv_corn','ice_harv_corn','ice_unharv_milo','ice_harv_milo',
  'ice_unharv_beans','ice_harv_beans','ice_browse','notes','actions','response','year','time','fiscal_year'];

  foodavail_Columns: string[] = ['month','day','year','structure','corn_unharv','corn_harv','corn_yield',
  'corn_yield_field','beans_unharv','beans_harv','beans_yield','beans_yield_field','milo_unharv','milo_harv',
  'milo_yield','milo_yield_field','wheat_green','wheat_harv','soil_standing','soil_mowed','soil_disced',
  'yield_score'];

  tables: string[]=['Water Management', 'Biweekly Water Status and Food Availability', 'Fall Food Availability'];
  selected_table:'WaterManagement';
  selectedValue: string;
  table="";

   constructor(private localService_WaterManagement: LocalWaterManagementService, 
    private localService_Weather:WeatherLocalService, private localService_WaterFood:LocalWaterFood,
    private lcoalService_Foodavail:FoodAvailLocalService,
    private cloudService: WatermanagementCloudService, 
    private globals:Globals,private firebase: AngularFireDatabase) {
      this.localservice_watermanagement = localService_WaterManagement;
      this.localservice_waterfood=localService_WaterFood;
      this.localservice_foodavail=lcoalService_Foodavail;
      this.localservice_weather=localService_Weather;
      this.cloudservice= cloudService;
  }

  ngOnInit() {
    this.fetchData(this.selected_table);
  }

  fetchData(selected_table){
    console.log("table is "+selected_table);

    if (selected_table=='Water Management'){
      this.getWatermanagement()

    }

    else if (selected_table=='Biweekly Water Status and Food Availability'){
      this.getWaterfood()

    }

    else if (selected_table=='Fall Food Availability'){
      this.getFoodavail()
    }

    else{
      this.getWeather();
    }

    this.table=selected_table;
  }

  deleteEntry(entry_id, selected_table){
    console.log("entry is "+entry_id);

    if (selected_table=='Water Management'){
      this.deleteWatermanagement(entry_id)

    }

    else if (selected_table=='Biweekly Water Status and Food Availability'){
      this.deleteWaterfood(entry_id)

    }

    else if (selected_table=='Fall Food Availability'){
      this.deleteFoodavail(entry_id)
    }

    else{
    }
  }

  getWatermanagement() {
    this.localservice_watermanagement.getWaterManagment().
    then(students => {
        this.watermanagements = students;
    }).catch(error => {
        console.error(error);
        alert(error.message);
    });
    console.log(this.watermanagements);
  }

  deleteWatermanagement(entry_id) {
    this.localservice_watermanagement.deleteWaterManagement(entry_id).catch(error => {
        console.error(error);
        alert(error.message);
    });
    console.log(this.watermanagements);
    location.reload();
  }

  getWaterfood() {
    this.localservice_waterfood.getWaterManagment().
    then(students => {
        this.watermanagements = students;
    }).catch(error => {
        console.error(error);
        alert(error.message);
    });
    console.log(this.watermanagements);
  }

  deleteWaterfood(entry_id) {
    this.localservice_waterfood.deleteWaterManagement(entry_id).catch(error => {
        console.error(error);
        alert(error.message);
    });
    console.log(this.watermanagements);
    location.reload();
  }

  getFoodavail() {
    this.localservice_foodavail.getWaterManagment().
    then(students => {
        this.watermanagements = students;
    }).catch(error => {
        console.error(error);
        alert(error.message);
    });
    console.log(this.watermanagements);
  }

  deleteFoodavail(entry_id) {
    this.localservice_foodavail.deleteWaterManagement(entry_id).catch(error => {
        console.error(error);
        alert(error.message);
    });
    location.reload();
    console.log(this.watermanagements);
  }

  getWeather() {
    this.localservice_weather.getWeather().
    then(students => {
        this.watermanagements = students;
    }).catch(error => {
        console.error(error);
        alert(error.message);
    });
    console.log(this.watermanagements)
}

  addCachedData(){

    //iterate through every record in IndexDB and write to cloud. then delete
    //record from IndexDB so it is not duplicated
/*     this.localService.getWaterManagment().
    then(local_records => {
          this.local_records = local_records;
          //iterate through locally stored records
          for (let local_entry of this.local_records){
            //add the record to the cloud
            this.cloudservice.addWaterManagement(local_entry);
            //delete the record locally to ensure it is not duplicated
            //also delete individually to insure no records get deleted without
            this.localService.deleteWaterManagement(local_entry.id);
          }
      }).catch(error => {
          console.error(error);
          alert(error.message);
      }); */
  }  
}
