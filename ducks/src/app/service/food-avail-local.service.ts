import {
  Injectable
 } from '@angular/core';
 import {
  BaseService
 } from './base.service';


import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
 
import { IFoodAvail } from '../model/food-avail';
import { IMoistSoil } from '../model/moist-soil';

 @Injectable({
  providedIn: 'root'
 })
 export class FoodAvailLocalService extends BaseService {
  
  constructor() {
   super();
  }

  get_available_Dates(CA,Unit,Pool,wcs){
    return this.connection.select({
      from: "Fall_Food_Availability",
      where:{
        CA: CA,
        Unit:Unit,
        Pool:Pool,
        WCS:wcs
      },
      order: {
        by: "Sort_time",
        type: "desc" 
    }

    });
  }

  get_all_FoodAvail_records() {
    return this.connection.select({
      from: 'Fall_Food_Availability'
    });
  }

  get_selected_FoodAvail_record(CA,Unit,Pool,wcs,date) {
    return this.connection.select({
      from: 'Fall_Food_Availability',
      where:{
        CA: CA,
        Unit:Unit,
        Pool:Pool,
        WCS:wcs,
        Date:date
      }
    });
  }

  add_FoodAvail_record(foodavail: IFoodAvail,moistsoil:IMoistSoil) {
    console.log('Unit is g '+foodavail.Unit)
    return this.connection.insert({
      into: 'Fall_Food_Availability',
      return: true, // as id is autoincrement, so we would like to    get the inserted value
      values: [foodavail,moistsoil]
    });
  }
  
  delete_FoodAvail_record(the_id){
    return this.connection.remove({
      from: 'Fall_Food_Availability',
      where: {
        id:the_id
      }
    });
  }
}