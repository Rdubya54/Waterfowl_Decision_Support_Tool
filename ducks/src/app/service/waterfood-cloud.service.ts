import { Injectable } from '@angular/core';
import { IWaterFood, WaterFood } from 'src/app/model/water-food';
import { AngularFirestore } from 'angularfire2/firestore';

@Injectable({
  providedIn: 'root'
})
export class BiweeklyWaterFoodService {

  constructor(private firestore:AngularFirestore) { }

   addWaterFood(waterfood:IWaterFood) {
    console.log(waterfood)

    return this.firestore.collection('Conservation_Areas').doc(waterfood.CA).collection("Units")
    .doc(waterfood.Unit).collection("Pools").doc(waterfood.Pool).collection("Biweekly Water and Food Availability").doc(waterfood.Date).set({
              CA:waterfood.CA,
              Unit:waterfood.Unit,
              Pool:waterfood.Pool,
              Date:waterfood.Date,
              Percent_of_Pool_Full: waterfood.percent_of_full_pool,
              Percentage_Flooded_under_Six_Inches: waterfood.less_than_six,
              Percentage_Flooded_Seven_to_Tweleve_Inches: waterfood.seven_to_twelve,
              Percentage_Flooded_Thirteen_or_more_Inches: waterfood.thirteen_or_more,
              Percentage_Habitat_Flooded_Moist_Soil_Standing: waterfood.habitat_standing,
              Percentage_Habitat_Flooded_Moist_Soil_Mowed: waterfood.habitat_mowed,
              Percentage_Habitat_Flooded_Moist_Soil_Disced: waterfood.habitat_disced,
              Percentage_of_Habitat_Flooded_Unharvested_Corn: waterfood.habitat_unharv_corn,
              Percentage_of_Habitat_Flooded_Harvested_Corn: waterfood.habitat_harv_corn,
              Percentage_of_Habitat_Flooded_Unharvested_Milo: waterfood.habitat_unharv_milo,
              Percentage_of_Habitat_Flooded_Harvested_Milo: waterfood.habitat_harv_milo,
              Percentage_of_Habitat_Flooded_Unharvested_Beans: waterfood.habitat_unharv_beans,
              Percentage_of_Habitat_Flooded_Harvested_Beans: waterfood.habitat_harv_beans,
              Percentage_of_Habitat_Flooded_Green_Browse: waterfood.habitat_browse,
              Percentage_of_Ice_on_Flooded_Habitat_Moist_Soil_Standing: waterfood.ice_standing,
              Percentage_of_Ice_on_Flooded_Habitat_Moist_Soil_Mowed: waterfood.ice_mowed,
              Percentage_of_Ice_on_Flooded_Habitat_Moist_Soil_Disced: waterfood.ice_disced,
              Percentage_of_Ice_on_Flooded_Habitat_Moist_Soil_Unharvested_Corn: waterfood.ice_unharv_corn,
              Percentage_of_Ice_on_Flooded_Habitat_Moist_Soil_Harvested_Corn: waterfood.ice_harv_corn,
              Percentage_of_Ice_on_Flooded_Habitat_Moist_Soil_Unharvested_Milo: waterfood.ice_unharv_milo,
              Percentage_of_Ice_on_Flooded_Habitat_Moist_Soil_Harvested_Milo: waterfood.ice_harv_milo,
              Percentage_of_Ice_on_Flooded_Habitat_Moist_Soil_Unharvested_Beans: waterfood.ice_unharv_beans,
              Percentage_of_Ice_on_Flooded_Habitat_Moist_Soil_Harvested_Beans: waterfood.ice_harv_beans,
              Percentage_of_Ice_on_Flooded_Habitat_Moist_Soil_Ice_Browse: waterfood.ice_browse,
              Notes: waterfood.notes,
              Upcoming_actions: waterfood.actions,
              Response_to_last_action: waterfood.response,
              year: "dumyy",
              time: "dummy",
              fiscal_year: "dumy",
              Sort_time:waterfood.Sort_time
    });
  }

  //returns the last waterfood record pushed to cloud for a given pool (but not the fields)
  getprevWaterFood(CA,unit,pool,sort_time){

    //WHEN you need the last two for the pool at a specific time (used when viewing old records)
    if (sort_time){
      return this.firestore.collection('Conservation_Areas').doc(CA).collection("Units").doc(unit).
      collection("Pools").doc(pool).collection("Biweekly Water and Food Availability", 
      ref=>ref.orderBy('Sort_time', 'desc').where('Sort_time',"<",sort_time).limit(1)).get();  
 
    }

    //when you just need the last record
    else{
      return this.firestore.collection('Conservation_Areas').doc(CA).collection("Units").doc(unit).
      collection("Pools").doc(pool).collection("Biweekly Water and Food Availability", 
      ref=>ref.orderBy('Sort_time', 'desc').limit(1)).get();
    }
  }

  getWaterFood(CA,unit,pool,record){
    return this.firestore.collection('Conservation_Areas').doc(CA).collection("Units").doc(unit).collection("Pools")
    .doc(pool).collection("Biweekly Water and Food Availability").doc(record).get();
  }
}
