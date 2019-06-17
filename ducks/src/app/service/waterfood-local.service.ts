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

  getprevWaterFood(CA,unit,pool){
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

  
/*   getprevWaterFood_forupdate(CA,unit,pool,Sort_time){
    return this.connection.select({
      limit:1,
      from: "Biweekly_Water_Status_and_Food_Availability",
      where:{
        CA: CA,
        Unit:unit,
        Pool:pool,
        Sort_time: {
          '<': Sort_time
        },
      },
      order: {
        by: "Sort_time",
        type: "desc" 
      }
    });
  } */

  //this function loads an old record for updating
  loadOldWaterFood(CA,unit,pool,date){
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

  getData() {
    return this.connection.select({
      from: 'Biweekly_Water_Status_and_Food_Availability'
    });
  }

  addData(waterfood: IWaterFood) {
    return this.connection.insert({
      into: 'Biweekly_Water_Status_and_Food_Availability',
      return: true, // as id is autoincrement, so we would like to    get the inserted value
      values: [waterfood]
    });
  }

  
  deleteWaterFood(the_id){
    return this.connection.remove({
      from: 'Biweekly_Water_Status_and_Food_Availability',
      where: {
        id:the_id
      }
    });
  }
}