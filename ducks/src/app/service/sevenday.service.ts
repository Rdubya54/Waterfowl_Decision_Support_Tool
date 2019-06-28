import { Injectable } from '@angular/core';

import {
  Watermanagement,
  IWatermanagement
} from 'src/app/model/watermanagement';

@Injectable({
  providedIn: 'root'
})
export class SevendayService {

  sevendaydata: Watermanagement = new Watermanagement();

  public past_7_data_master=[];

  constructor() { }

  setData (data) {
    this.sevendaydata = data;
  }
  getData () {
    return this.sevendaydata;
  }
}
