import {
  Injectable
 } from '@angular/core';
 import {
  BaseService
 } from './base.service';


import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
 
import { IFoodAvail } from '../model/food-avail';
 @Injectable({
  providedIn: 'root'
 })
 export class FoodAvailLocalService extends BaseService {
  
  constructor() {
   super();
  }

  getWaterManagment() {
    return this.connection.select({
      from: 'Fall_Food_Availability'
    });
  }

  addWaterManagement(watermangement: IFoodAvail) {
    return this.connection.insert({
      into: 'Fall_Food_Availability',
      return: true, // as id is autoincrement, so we would like to    get the inserted value
      values: [watermangement]
    });
  }
  
  deleteWaterManagement(the_id){
    return this.connection.remove({
      from: 'Fall_Food_Availability',
      where: {
        id:the_id
      }
    });
  }
}