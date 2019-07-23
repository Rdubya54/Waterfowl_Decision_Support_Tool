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
  public CA_list: string[]=[];

  standardizeinputs(watermanagement: IWatermanagement){
    var CA=watermanagement.CA.toUpperCase();
    CA=CA.replace(/ /g,"_");
    watermanagement.CA=CA;

    var Unit=watermanagement.Unit.toUpperCase();
    Unit=Unit.replace(/ /g,"_");
    watermanagement.Unit=Unit;

    var Pool=watermanagement.Pool.toUpperCase();
    Pool=Pool.replace(/ /g,"_");
    watermanagement.Pool=Pool;    

    var Structure=watermanagement.WCS.toUpperCase();
    Structure=Structure.replace(/ /g,"_");
    watermanagement.WCS=Structure;    

  }

  get_available_Dates(CA,Unit,Pool,wcs){
    return this.connection.select({
      from: "WaterManagement",
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

  get_all_WaterManagment_records() {
    return this.connection.select({
      from: 'WaterManagement'
    });
  }

  get_prev_2_WaterManagement_records(CA,unit,pool,wcs){
    console.log(wcs)
    return this.connection.select({
      from: "WaterManagement",
      limit:2,
      where:{
        CA: CA,
        Unit:unit,
        Pool:pool,
        WCS: wcs,
      },
      order: {
        by: "Sort_time",
        type: "desc" 
    }

    });
  }

  get_WaterManagement_record(CA,unit,pool,wcs,date){
    console.log(wcs)
    return this.connection.select({
      from: "WaterManagement",
      where:{
        CA: CA,
        Unit:unit,
        Pool:pool,
        WCS: wcs,
        Date:date
      },
      order: {
        by: "Sort_time",
        type: "desc" 
    }

    });
  }

  get_prev_7_WaterManagement_records(CA,unit,pool,wcs){
    console.log(wcs)
    return this.connection.select({
      from: "WaterManagement",
      limit:7,
      where:{
        CA: CA,
        Unit:unit,
        Pool:pool,
        WCS: wcs,
      },
      order: {
        by: "Sort_time",
        type: "asc" 
    }

    });
  }

  add_WaterManagement_record(watermanagement: IWatermanagement) {
    /* this.standardizeinputs(watermanagement) */
    console.log("C!!!!!!!!!! CA IS "+watermanagement.CA)
    return this.connection.insert({
      into: 'WaterManagement',
      return: true, // as id is autoincrement, so we would like to    get the inserted value
      values: [watermanagement]
    });
  }
  
  delete_WaterManagement_record(the_id){
    return this.connection.remove({
      from: 'WaterManagement',
      where: {
        id:the_id
      }
    });
  }
}