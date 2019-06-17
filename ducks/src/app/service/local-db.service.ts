import {
  Injectable
 } from '@angular/core';
 import {
  BaseService
 } from './base.service';


import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
 
import { IWaterFood } from '../model/water-food';
import { until } from 'protractor';
 @Injectable({
  providedIn: 'root'
 })

@Injectable({
  providedIn: 'root'
})

export class LocalDbService extends BaseService{

  constructor(){
    super();
  }


  getCAs() {
    return this.connection.select({
      from: 'Biweekly_Water_Status_and_Food_Availability'
    });
  }

  getUnits(CA){
    return this.connection.select({
      from: "Biweekly_Water_Status_and_Food_Availability",
      where:{
        CA: CA,
      },
      order: {
        by: "Sort_time",
        type: "desc" 
    }

    });
  }

  getPools(CA,Unit){
    return this.connection.select({
      from: "Biweekly_Water_Status_and_Food_Availability",
      where:{
        CA: CA,
        Unit:Unit,
      },
      order: {
        by: "Sort_time",
        type: "desc" 
    }

    });
  }


  getDates(CA,Unit,Pool){
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

  getDates_2(CA,Unit,Pool,wcs){
    return this.connection.select({
      from: "Biweekly_Water_Status_and_Food_Availability",
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
}
