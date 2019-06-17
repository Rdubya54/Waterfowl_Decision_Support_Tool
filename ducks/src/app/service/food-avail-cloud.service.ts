import { Injectable } from '@angular/core';
import { IFoodAvail, FoodAvail } from 'src/app/model/food-avail';
import { AngularFirestore } from 'angularfire2/firestore';

@Injectable({
  providedIn: 'root'
})
export class FoodAvailCloudService {

  constructor(private firestore:AngularFirestore) { }

  addFoodAvail(foodavail:IFoodAvail) {
    console.log('it is :'+foodavail.CA)

    return this.firestore.collection('Conservation_Areas').doc(foodavail.CA).collection("Units")
    .doc(foodavail.unit).collection("Pools").doc(foodavail.pool).collection("WCS").doc(foodavail.structure).collection("Fall Food Availability").doc(foodavail.date).set({
          CA:foodavail.CA,
          unit:foodavail.unit,
          pool:foodavail.pool,
          wcs:foodavail.structure,
          date:foodavail.date,
          sort_time:foodavail.sort_time,
          corn_unharv:foodavail.corn_unharv,
          corn_harv:foodavail.corn_harv,
          corn_yield:foodavail.corn_yield,
          corn_yield_field:foodavail.corn_yield_field,
          beans_unharv:foodavail.beans_unharv,
          beans_harv:foodavail.beans_harv,
          beans_yield:foodavail.beans_yield,
          beans_yield_field:foodavail.beans_yield_field,
          milo_unharv:foodavail.milo_unharv,
          milo_harv:foodavail.milo_harv,
          milo_yield:foodavail.milo_yield,
          milo_yield_field:foodavail.milo_yield_field,
          wheat_green:foodavail.wheat_green,
          wheat_harv:foodavail.wheat_harv,
          soil_standing:foodavail.soil_standing,
          soil_mowed:foodavail.soil_mowed,
          soil_disced:foodavail.soil_disced,
          millet_output:foodavail.millet_output,
          foxtail_output:foodavail.foxtail_output,
          rice_cut_output:foodavail.rice_cut_output,
          panic_grass_output:foodavail.panic_grass_output,
          crabgrass_output:foodavail.crabgrass_output,
          sprangletop_output:foodavail.sprangletop_output,
          lapathifolium_output:foodavail.lapathifolium_output,
          pennsylvanicum_output:foodavail.pennsylvanicum_output,
          coccineum_output:foodavail.coccineum_output,
          water_pepper_output:foodavail.water_pepper_output,
          pigweed_output:foodavail.pigweed_output,
          bidens_output:foodavail.bidens_output,
          chufa_output:foodavail.chufa_output,
          redroot_output:foodavail.redroot_output,
          sedge_output:foodavail.sedge_output,
          rush_output:foodavail.rush_output,
    });
  }

  //gets foodavail 
  getFoodAvail(CA,unit,pool,wcs,date){
    return this.firestore.collection('Conservation_Areas').doc(CA).collection("Units").doc(unit).collection("Pools")
    .doc(pool).collection("WCS").doc(wcs).collection("Fall Food Availability").doc(date).get();
  }

  //get prev foodavails for offline tree walking purposes
  getprevFoodAvails(CA,unit,pool,wcs){

      return this.firestore.collection('Conservation_Areas').doc(CA).collection("Units").doc(unit).collection("Pools")
      .doc(pool).collection("WCS").doc(wcs).collection("Fall Food Availability", 
      ref=>ref.orderBy('sort_time', 'desc').limit(1)).get();
  }
}
