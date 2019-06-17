import {
  Injectable
 } from '@angular/core';
 import {
  BaseService
 } from './base.service';


 import { Observable } from 'rxjs';
 import { map } from 'rxjs/operators';
  
 import { IWeather } from '../model/weather';
  @Injectable({
   providedIn: 'root'
  })

export class WeatherLocalService extends BaseService {

  constructor() { 
    super();
  }

  getCAs() {
    return this.connection.select({
      from: 'Daily_Weather_Observations'
    });
  }

  getDates(CA){
    return this.connection.select({
      from: 'Daily_Weather_Observations',
      where:{
        CA: CA,
      },
      order: {
        by: "sort_time",
        type: "desc" 
    }

    });
  }

  getWeather(CA,date) {
    return this.connection.select({
      from: 'Daily_Weather_Observations',
      where:{
        CA: CA,
        date:date
      },
      order: {
        by: "sort_time",
        type: "desc" 
    }
    });
  }

  
  getWeather_all() {
    return this.connection.select({
      from: 'Daily_Weather_Observations'
    });
  }

  addWeather(weather: IWeather) {
    return this.connection.insert({
      into: 'Daily_Weather_Observations',
      return: true, // as id is autoincrement, so we would like to    get the inserted value
      values: [weather]
    });
  }
  
  deleteWeather(the_id){
    return this.connection.remove({
      from: 'Daily_Weather_Observations',
      where: {
        id:the_id
      }
    });
  }

}
