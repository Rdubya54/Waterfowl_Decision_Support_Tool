import { Injectable } from '@angular/core';


import {
  MoistSoil,
  IMoistSoil
} from 'src/app/model/moist-soil';

@Injectable({
  providedIn: 'root'
})
export class MoistsoilService {

  newMoistSoil: IMoistSoil = new MoistSoil();

  constructor() { }

  setData (data) {
    this.newMoistSoil = data;
  }
  getData () {
    return this.newMoistSoil;
  }

  clearNewMoistSoilData (){
    this.newMoistSoil = new MoistSoil();
  }
}
