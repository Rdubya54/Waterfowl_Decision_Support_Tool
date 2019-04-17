import {
  Injectable
 } from '@angular/core';
 import {
  BaseService
 } from './base.service';


import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
 
import { IWatermanagement } from '../model/watermanagement';
 @Injectable({
  providedIn: 'root'
 })
 export class LocalWaterManagementService extends BaseService {
  
  constructor() {
   super();
  }

  getWaterManagment() {
    return this.connection.select({
      from: 'WaterManagement'
    });
  }

  addWaterManagement(watermangement: IWatermanagement) {
    return this.connection.insert({
      into: 'WaterManagement',
      return: true, // as id is autoincrement, so we would like to    get the inserted value
      values: [watermangement]
    });
  }
  
  deleteWaterManagement(the_id){
    return this.connection.remove({
      from: 'WaterManagement',
      where: {
        id:the_id
      }
    });
  }
}