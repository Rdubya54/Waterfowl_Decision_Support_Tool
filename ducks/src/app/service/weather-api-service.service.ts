import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Globals} from 'src/app/extra/globals';
import { last } from '@angular/router/src/utils/collection';
import {LocationService} from 'src/app/service/location.service'

@Injectable({
  providedIn: 'root'
})
export class WeatherApiServiceService {

  public lat;
  public long;
  public currentLocation;
  private locationservice;
  private joke;

  constructor(private http: HttpClient,private globals:Globals,locationservice:LocationService) { 
    this.locationservice=locationservice;

  }

  getweather(){

    //this format works
    //const url = this.http.get('http://api.openweathermap.org/data/2.5/forecast?id=524901&APPID=80dc87045d3dae46154b1dc9f2455de1')
    //console.log(url)

    if (navigator.geolocation) {
      return navigator.geolocation.getCurrentPosition((position)=>{
        this.long = position.coords.longitude;
        this.lat = position.coords.latitude;
        console.log(this.long)
        console.log(this.lat)
        const res = this.http.get("api.openweathermap.org/data/2.5/weather?lat="+this.lat+"&lon="+this.long)
        console.log(res)

        return res;

      });
    } 

    else {
      console.log("No support for geolocation")
    }
 
  }

}
