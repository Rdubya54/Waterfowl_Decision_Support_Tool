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

  getWaterManagment() {
    return this.connection.select({
      from: 'Biweekly_Water_Status_and_Food_Availability'
    });
  }

  addWaterManagement(watermangement: IWaterFood) {
    return this.connection.insert({
      into: 'Biweekly_Water_Status_and_Food_Availability',
      return: true, // as id is autoincrement, so we would like to    get the inserted value
      values: [watermangement]
    });
  }
  
  deleteWaterManagement(the_id){
    return this.connection.remove({
      from: 'Biweekly_Water_Status_and_Food_Availability',
      where: {
        id:the_id
      }
    });
  }
}