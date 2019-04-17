import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { IWeather } from 'src/app/model/weather';
import { AngularFirestore } from 'angularfire2/firestore';

@Injectable({
  providedIn: 'root'
})
export class WeatherCloudService {


  constructor(public db: AngularFirestore) { }

   addWeather(weather:IWeather) {
    return this.db.collection('Daily_Weather_Observations').add({
      month: weather.month,
      day: weather.day,
      area_ice: weather.area_ice,
      ice_thick: weather.ice_thick,
      low_temp: weather.low_temp,
      wind_dir: weather.wind_dir,
      wind_speed: weather.wind_speed,
      river_stage:weather.river_stage,
      other_observations:weather.other_observations,
      year:weather.year,
    });
  }
}
