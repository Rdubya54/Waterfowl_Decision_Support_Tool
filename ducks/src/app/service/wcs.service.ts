import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { WCS, IWCS } from '../model/water-control-structures';

@Injectable({
  providedIn: 'root'
})
export class WCSService extends BaseService{

  constructor() {
    super();
   }

   getAll(CA){
      return this.connection.select({
        from: "Water Control Structures",
        where:{
          CA: CA,
        }
      });
   }

   add_WCS_record(WCS: IWCS) {
    /* this.standardizeinputs(watermanagement) */
    return this.connection.insert({
      into: 'Water Control Structures',
      return: true, // as id is autoincrement, so we would like to    get the inserted value
      values: [WCS]
    });
  }

  clearTable(){
    this.connection.clear('Water Control Structures')
  }
}
