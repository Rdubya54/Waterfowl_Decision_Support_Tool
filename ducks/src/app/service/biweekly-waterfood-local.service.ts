import {
  Injectable
 } from '@angular/core';
 import {
  BaseService
 } from './base.service';


import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
 
import { IWaterFood } from '../model/water-food';
 @Injectable({
  providedIn: 'root'
 })
 export class LocalWaterFood extends BaseService {
  
  constructor() {
   super();
  }

  //fetches available Waterfood dates
  get_available_Dates(CA,Unit,Pool){
    return this.connection.select({
      from: "Biweekly_Water_Status_and_Food_Availability",
      where:{
        CA: CA,
        Unit:Unit,
        Pool:Pool,
      },
      order: {
        by: "Sort_time",
        type: "desc" 
    }

    });
  }


  //returns the most previous record for pool. this data populates all of the prev columns
  get_prev_WaterFood_record(CA,unit,pool){
    return this.connection.select({
      from: "Biweekly_Water_Status_and_Food_Availability",
      limit:1,
      where:{
        CA: CA,
        Unit:unit,
        Pool:pool,
      },
      order: {
        by: "Sort_time",
        type: "desc" 
    }

    });
  }


  //this function loads an old record for updating that was selected on pages
  getWaterFood_selected(CA,unit,pool,date){
    return this.connection.select({
      from: "Biweekly_Water_Status_and_Food_Availability",
      limit:1,
      where:{
        CA: CA,
        Unit:unit,
        Pool:pool,
        Date:date
      },
      order: {
        by: "Sort_time",
        type: "desc" 
    }

    });  
  }

  //returns all records in IndexDB Biweekly Water Food table
  get_all_WaterFood_records() {
    return this.connection.select({
      from: 'Biweekly_Water_Status_and_Food_Availability'
    });
  }

  //inserts a new record into IndexDB
  add_WaterFood_record(waterfood: IWaterFood) {
    return this.connection.insert({
      into: 'Biweekly_Water_Status_and_Food_Availability',
      return: true, // as id is autoincrement, so we would like to    get the inserted value
      values: [waterfood]
    });
  }

  //deletes a record from IndexDb
  delete_WaterFood_record(the_id){
    return this.connection.remove({
      from: 'Biweekly_Water_Status_and_Food_Availability',
      where: {
        id:the_id
      }
    });
  }
}