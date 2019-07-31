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

  getAll(CA){
    return this.connection.select({
      from: "Gauge Stats",
      where:{
        CA: CA,
      }
    });
  }

  getUnits(CA){
    return this.connection.select({
      from: "Gauge Stats",
      where:{
        CA: CA,
      },
      order: {
        by: "Unit",
        type: "asc" 
    }
    });
  }

  getPools(CA,Unit){
    return this.connection.select({
      from: "Gauge Stats",
      where:{
        CA: CA,
        Unit:Unit,
      },
      order: {
        by: "Pool",
        type: "asc" 
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
      },
      order: {
        by: "Structure",
        type: "asc" 
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
        WCS:wcs
      },      
      order: {
        by: "Gauge",
        type: "asc" 
    }
    });
  }

  getStats(CA,Unit,Pool,wcs,gauge){
    return this.connection.select({
      from: "Gauge Stats",
      where:{
        CA: CA,
        Unit:Unit,
        Pool:Pool,
        WCS:wcs,
        Gauge:gauge
      }
    });
  }


  addGaugeStat(gaugestats) {
    return this.connection.insert({
      into: 'Gauge Stats',
      return: true, // as id is autoincrement, so we would like to    get the inserted value
      values: [gaugestats]
    });
  }

  clearTable(){
    this.connection.clear('Gauge Stats')
  }

}
