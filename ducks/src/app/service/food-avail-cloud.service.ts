import { Injectable } from '@angular/core';
import { IFoodAvail, FoodAvail } from 'src/app/model/food-avail';
import {IMoistSoil,MoistSoil} from 'src/app/model/moist-soil'
import { AngularFirestore } from 'angularfire2/firestore';
import { WaterFood } from '../model/water-food';

@Injectable({
  providedIn: 'root'
})
export class FoodAvailCloudService {

  constructor(private firestore:AngularFirestore) { }

  addFoodAvail(foodavail:IFoodAvail,moistsoil:IMoistSoil, CA,unit,pool,wcs,date,time) {

    console.log("ca is "+CA)
    console.log("ca is "+unit)
    console.log("ca is "+pool)
    console.log("ca is "+wcs)

    return this.firestore.collection('Gauge_Stats').doc(CA).collection("Units")
    .doc(unit).collection("Pools").doc(pool).collection("WCS").doc(wcs).collection("Fall Food Availability").doc("4-4-2019").set({
          Date:date,
          Sort_time:time,
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
          other_seed_output:"",
          non_seed_output:"",
          open_water_output:"",
          recently_disced_output:"",
          chufa_output:moistsoil.chufa_output,
          redroot_output:moistsoil.redroot_output,
          sedge_output:moistsoil.sedge_output,
          rush_output:moistsoil.rush_output,
    });
  }
}
