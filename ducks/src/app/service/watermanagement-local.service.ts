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

    var Structure=watermanagement.Structure.toUpperCase();
    Structure=Structure.replace(/ /g,"_");
    watermanagement.Structure=Structure;    

  }


  getWaterManagment() {
    return this.connection.select({
      from: 'WaterManagement'
    });
  }

  getprevWaterManagements(CA,unit,pool,wcs){
    console.log(wcs)
    return this.connection.select({
      from: "WaterManagement",
      where:{
        CA: CA,
        Unit:unit,
        Pool:pool,
        Structure: wcs,
      },
      order: {
        by: "Sort_time",
        type: "desc" 
    }

    });
  }

  getpast7WaterManagement(CA,unit,pool,wcs){
    console.log(wcs)
    return this.connection.select({
      from: "WaterManagement",
      limit:7,
      where:{
        CA: CA,
        Unit:unit,
        Pool:pool,
        Structure: wcs,
      },
      order: {
        by: "Sort_time",
        type: "desc" 
    }

    });
  }


  getprevWaterManagement_forupdate(CA,unit,pool,wcs,date){
    console.log(wcs)
    return this.connection.select({
      from: "WaterManagement",
      where:{
        CA: CA,
        Unit:unit,
        Pool:pool,
        Structure: wcs,
        Date:date
      },
      order: {
        by: "Sort_time",
        type: "desc" 
    }

    });
  }

  addWaterManagement(watermanagement: IWatermanagement) {
    /* this.standardizeinputs(watermanagement) */
    console.log("C!!!!!!!!!! CA IS "+watermanagement.CA)
    return this.connection.insert({
      into: 'WaterManagement',
      return: true, // as id is autoincrement, so we would like to    get the inserted value
      values: [watermanagement]
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


  getCAs() {
    return this.connection.select({
      from: 'WaterManagement'
    });
  }

  getUnits(CA){
    return this.connection.select({
      from: "WaterManagement",
      where:{
        CA: CA,
      },
      order: {
        by: "Unit",
        type: "desc" 
    }

    });
  }

  getPools(CA,Unit){
    return this.connection.select({
      from: "WaterManagement",
      where:{
        CA: CA,
        Unit:Unit,
      },
      order: {
        by: "Pool",
        type: "desc" 
    }
    });
  }

  getWCS(CA,Unit,Pool){
    return this.connection.select({
      from: "WaterManagement",
      where:{
        CA: CA,
        Unit:Unit,
        Pool:Pool
      },
      order: {
        by: "WCS",
        type: "desc" 
    }
    });
  }

  getDates(CA,Unit,Pool,wcs){
    return this.connection.select({
      from: "WaterManagement",
      where:{
        CA: CA,
        Unit:Unit,
        Pool:Pool,
        Structure:wcs
      },
      order: {
        by: "Sort_time",
        type: "desc" 
    }
    });
  }

}