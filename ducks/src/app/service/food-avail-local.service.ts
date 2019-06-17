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

  getCAs() {
    return this.connection.select({
      from: 'Fall_Food_Availability'
    });
  }

  getUnits(CA){
    return this.connection.select({
      from: "Fall_Food_Availability",
      where:{
        CA: CA,
      },
      order: {
        by: "sort_time",
        type: "desc" 
    }

    });
  }

  getPools(CA,Unit){
    return this.connection.select({
      from: "Fall_Food_Availability",
      where:{
        CA: CA,
        unit:Unit,
      },
      order: {
        by: "sort_time",
        type: "desc" 
    }

    });
  }

  getWCS(CA,Unit,Pool){
    return this.connection.select({
      from: "Fall_Food_Availability",
      where:{
        CA: CA,
        unit:Unit,
        pool:Pool
      },
      order: {
        by: "sort_time",
        type: "desc" 
    }

    });
  }

  getDates(CA,Unit,Pool,wcs){
    return this.connection.select({
      from: "Fall_Food_Availability",
      where:{
        CA: CA,
        unit:Unit,
        pool:Pool,
        structure:wcs
      },
      order: {
        by: "sort_time",
        type: "desc" 
    }

    });
  }

  getFoodAvail() {
    return this.connection.select({
      from: 'Fall_Food_Availability'
    });
  }

  getFoodAvail_selected(CA,Unit,Pool,wcs,date) {
    return this.connection.select({
      from: 'Fall_Food_Availability',
      where:{
        CA: CA,
        unit:Unit,
        pool:Pool,
        structure:wcs,
        date:date
      }
    });
  }

  addFoodAvail(foodavail: IFoodAvail) {
    return this.connection.insert({
      into: 'Fall_Food_Availability',
      return: true, // as id is autoincrement, so we would like to    get the inserted value
      values: [foodavail]
    });
  }
  
  deleteFoodAvail(the_id){
    return this.connection.remove({
      from: 'Fall_Food_Availability',
      where: {
        id:the_id
      }
    });
  }
}