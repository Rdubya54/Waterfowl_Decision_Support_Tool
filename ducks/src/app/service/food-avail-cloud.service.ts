import { Injectable } from '@angular/core';
import { IFoodAvail, FoodAvail } from 'src/app/model/food-avail';
import { IMoistSoil, MoistSoil } from 'src/app/model/moist-soil';
import { AngularFirestore } from 'angularfire2/firestore';

@Injectable({
  providedIn: 'root'
})
export class FoodAvailCloudService {

  constructor(private firestore:AngularFirestore) { }

  //this seperate add food avail from local is necessary because you wont have moistsoil service going when app initially loads
  add_FoodAvail_record_from_local(foodavail:IFoodAvail) {
    console.log('it is :'+foodavail.CA)

    return this.firestore.collection('Conservation_Areas').doc(foodavail.CA).collection("Units")
    .doc(foodavail.Unit).collection("Pools").doc(foodavail.Pool).collection("WCS").doc(foodavail.WCS).collection("Fall Food Availability").doc(foodavail.Date).set({
          CA:foodavail.CA,
          Unit:foodavail.Unit,
          Pool:foodavail.Pool,
          WCS:foodavail.WCS,
          Date:foodavail.Date,
          Sort_time:foodavail.Sort_time,
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

  add_FoodAvail_record(foodavail:IFoodAvail,moistsoil:IMoistSoil) {
    console.log('it is :'+foodavail.CA)

    return this.firestore.collection('Conservation_Areas').doc(foodavail.CA).collection("Units")
    .doc(foodavail.Unit).collection("Pools").doc(foodavail.Pool).collection("WCS").doc(foodavail.WCS).collection("Fall Food Availability").doc(foodavail.Date).set({
          CA:foodavail.CA,
          Unit:foodavail.Unit,
          Pool:foodavail.Pool,
          WCS:foodavail.WCS,
          Date:foodavail.Date,
          Sort_time:foodavail.Sort_time,
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
          millet_output:moistsoil.millet_output,
          foxtail_output:moistsoil.foxtail_output,
          rice_cut_output:moistsoil.rice_cut_output,
          panic_grass_output:moistsoil.panic_grass_output,
          crabgrass_output:moistsoil.crabgrass_output,
          sprangletop_output:moistsoil.sprangletop_output,
          lapathifolium_output:moistsoil.lapathifolium_output,
          pennsylvanicum_output:moistsoil.pennsylvanicum_output,
          coccineum_output:moistsoil.coccineum_output,
          water_pepper_output:moistsoil.water_pepper_output,
          pigweed_output:moistsoil.pigweed_output,
          bidens_output:moistsoil.bidens_output,
          chufa_output:moistsoil.chufa_output,
          redroot_output:moistsoil.redroot_output,
          sedge_output:moistsoil.sedge_output,
          rush_output:moistsoil.rush_output,
    });
  }

  //gets foodavail 
  get_FoodAvail_record(CA,unit,pool,wcs,date){
    return this.firestore.collection('Conservation_Areas').doc(CA).collection("Units").doc(unit).collection("Pools")
    .doc(pool).collection("WCS").doc(wcs).collection("Fall Food Availability").doc(date).get();
  }

  //get prev foodavails for offline tree walking purposes
  get_prev_FoodAvail_record(CA,unit,pool,wcs){
      return this.firestore.collection('Conservation_Areas').doc(CA).collection("Units").doc(unit).collection("Pools")
      .doc(pool).collection("WCS").doc(wcs).collection("Fall Food Availability", 
      ref=>ref.orderBy('Sort_time', 'desc').limit(1)).get();
  }

  //get Dates for dropdown menu
  get_available_Dates(CA,unit,pool,wcs) {
    return this.firestore.collection('Conservation_Areas').doc(CA).collection("Units").doc(unit)
    .collection("Pools").doc(pool).collection("WCS").doc(wcs).collection("Fall Food Availability")
    .get();
  }
}
