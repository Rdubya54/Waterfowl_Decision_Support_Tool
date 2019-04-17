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

  getWeather() {
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
