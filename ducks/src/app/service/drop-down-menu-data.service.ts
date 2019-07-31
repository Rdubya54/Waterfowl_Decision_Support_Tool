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

  getUnits(CA){
    return this.connection.select({
      from: "Water Control Structures",
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
      from: "Water Control Structures",
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
      from: "Water Control Structures",
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
