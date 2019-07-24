import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { IWeather,Weather } from 'src/app/model/weather';
import { AngularFirestore } from 'angularfire2/firestore';

@Injectable({
  providedIn: 'root'
})
export class WeatherCloudService {

  constructor(public firestore: AngularFirestore) { }

  add_Weather_record(Weather:IWeather){
    console.log("WEATHER IS "+Weather.date)
    return this.firestore.collection('Conservation_Areas').doc(Weather.CA)
    .collection("Daily Weather Observation").doc(Weather.date).set({
        CA:Weather.CA,
        date:Weather.date,
        sort_time:Weather.sort_time,
        area_ice: Weather.area_ice,
        ice_thick: Weather.ice_thick,
        low_temp: Weather.low_temp,
        wind_dir: Weather.wind_dir,
        wind_speed: Weather.wind_speed,
        river_stage:Weather.river_stage,
        other_observations:Weather.other_observations,
    });
  }

  //fetch a weather record
  get_Weather_record(CA,date){
    return this.firestore.collection('Conservation_Areas').doc(CA).collection("Daily Weather Observation").doc(date).get();
  }

  //get prev weather for offline tree walking purposes
  get_prev_Weather_record(CA){

      return this.firestore.collection('Conservation_Areas').doc(CA).collection("Daily Weather Observation", 
      ref=>ref.orderBy('sort_time', 'desc').limit(1)).get();
  }

  
  get_available_Dates(CA){
    return this.firestore.collection('Conservation_Areas').doc(CA).collection("Daily Weather Observation",ref=>ref.orderBy('sort_time', 'desc'))
    .get();
  }
}
