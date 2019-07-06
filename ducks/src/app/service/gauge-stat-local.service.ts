import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { GaugeStats, IGaugeStats } from '../model/gauge-stats';

@Injectable({
  providedIn: 'root'
})
export class GaugeStatLocalService extends BaseService{

  constructor() { 
    super();
  }

  getUnits(CA){
    return this.connection.select({
      from: "Gauge Stats",
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
      from: "Gauge Stats",
      where:{
        CA: CA,
        Unit:Unit,
      }
    });
  }

  getWCS(CA,Unit,Pool){
    return this.connection.select({
      from: "Gauge Stats",
      where:{
        CA: CA,
        Unit:Unit,
        Pool:Pool
      }
    });
  }

  getGauges(CA,Unit,Pool,wcs){
    return this.connection.select({
      from: "Gauge Stats",
      where:{
        CA: CA,
        Unit:Unit,
        Pool:Pool,
        Structure:wcs
      }
    });
  }

  getImage(CA,Unit,Pool,wcs,gauge){
    return this.connection.select({
      from: "Gauge Stats",
      where:{
        CA: CA,
        Unit:Unit,
        Pool:Pool,
        Structure:wcs,
        Gauge:gauge
      }
    });
  }


  addGaugeStat(gaugestats: IGaugeStats) {
    /* this.standardizeinputs(watermanagement) */
    //console.log("C!!!!!!!!!! CA IS "+gaugestats.Image)
    return this.connection.insert({
      into: 'Gauge Stats',
      return: true, // as id is autoincrement, so we would like to    get the inserted value
      values: [gaugestats]
    });
  }

}
