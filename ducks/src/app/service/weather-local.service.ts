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

  get_available_Dates(CA){
    return this.connection.select({
      from: 'Daily_Weather_Observations',
      where:{
        CA: CA,
      },
      order: {
        by: "Sort_time",
        type: "desc" 
    }

    });
  }

  get_Weather_record(CA,date) {
    return this.connection.select({
      from: 'Daily_Weather_Observations',
      where:{
        CA: CA,
        date:date
      },
      order: {
        by: "Sort_time",
        type: "desc" 
    }
    });
  }

  
  get_all_Weather_records() {
    return this.connection.select({
      from: 'Daily_Weather_Observations'
    });
  }

  add_Weather_record(weather: IWeather) {
    return this.connection.insert({
      into: 'Daily_Weather_Observations',
      return: true, // as id is autoincrement, so we would like to    get the inserted value
      values: [weather]
    });
  }
  
  delete_Weather_record(the_id){
    return this.connection.remove({
      from: 'Daily_Weather_Observations',
      where: {
        id:the_id
      }
    });
  }

}
