import { Injectable } from '@angular/core';

import {
  BaseService
 } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class DropDownMenuDataService extends BaseService {

  constructor() { 
    super();
  }

  getUnits(table,CA){
    return this.connection.select({
      from: table,
      where:{
        CA: CA,
      },
      order: {
        by: "Unit",
        type: "asc" 
    }

    });
  }

  getPools(table,CA,Unit){
    return this.connection.select({
      from: table,
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

  getWCS(table,CA,Unit,Pool){
    return this.connection.select({
      from: table,
      where:{
        CA: CA,
        Unit:Unit,
        Pool:Pool
      },
      order: {
        by: "WCS",
        type: "asc" 
    }
    });
  }


}
