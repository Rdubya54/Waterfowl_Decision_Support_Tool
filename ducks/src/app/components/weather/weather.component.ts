import { Component, OnInit } from '@angular/core';
import { WeatherLocalService } from 'src/app/service/weather-local.service';
import { AngularFireDatabase } from 'angularfire2/database';
import { WeatherCloudService } from 'src/app/service/weather-cloud.service';
import { HttpClient } from '@angular/common/http';
import {AppComponent} from 'src/app/app.component';

import {
  Weather,
  IWeather
} from 'src/app/model/weather';
import { shiftInitState } from '@angular/core/src/view';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css'],
  providers:[WeatherLocalService,WeatherCloudService]
})

export class WeatherComponent implements OnInit {

  breakpoint:number;
  breakpoint_top:number;

  private localservice: WeatherLocalService;
  private cloudservice: WeatherCloudService;
  weathers: any[];
  newWeather: IWeather = new Weather();

  public CA_list: string[]=[];
  public selected_CA;
  public date_list: string[]=["Create New Record"];
  public selected_date;

  public status;
  public mode;

  public placeholderid;


  constructor(private comp:AppComponent,private http: HttpClient,private localService: WeatherLocalService, private cloudService:WeatherCloudService,
      private firebase: AngularFireDatabase) {
      this.localservice=localService;
      this.cloudservice=cloudService;
  }

  ngOnInit() {
    this.breakpoint_top = (window.innerWidth <= 768) ? 1 : 1;
    this.breakpoint = (window.innerWidth <= 768) ? 1 : 2;

    console.log(localStorage.getItem("CA"))

    this.selected_CA=localStorage.getItem("CA")

    this.status=localStorage.getItem('Status')

    //attempt to get coordinates of user, if it succeds, get weather data from api
    navigator.geolocation.getCurrentPosition((position) =>
      this.get_weather_from_api(position)
    );

    this.date_list=["Create New Record"];
 
    //if app is online push any locally cached data to the cloud
    if (this.status==="online"){

      //get available date's from dropdown menu
      console.log("selecteed CA IS "+this.selected_CA)
      this.cloudservice.get_available_Dates(this.selected_CA).subscribe(data => {
        data.forEach(doc => {
          this.date_list.push(doc.id)
        });
      });
    }

    else if (this.status==="offline"){
      this.localService.get_available_Dates(this.selected_CA).then(data => {
        this.weathers = data;

        this.weathers.forEach(record =>{
            var date=record["date"]
            this.date_list.push(date)
        });
      });
    }
  }


//this function fetches previous records and displays them on page.
//if app is in create record mode this function essetinally does nothing,
//if app is in update record mode, records for updating are fetched 
populate_page_with_data(CA,date){

  //put app in create record mode if Create New Record is selected
  if (date==="Create New Record"){
    this.mode = 'create record'
    //clear data on page
  }

  //put app in update record mode if a date/previous entry is selected
  else {
    this.mode = 'update record'
  }

  if (this.mode === "update record"){

    if (this.status==="online"){
      this.cloudservice.get_Weather_record(CA,date).
      subscribe(data=>{
        this.newWeather.CA=data.get('CA')
        this.newWeather.date=data.get('date');
        this.newWeather.area_ice=data.get('area_ice');
        this.newWeather.ice_thick=data.get('ice_thick');
        this.newWeather.low_temp=data.get('low_temp')
        this.newWeather.wind_dir=data.get('wind_dir');
        this.newWeather.wind_speed=data.get('wind_speed')
        this.newWeather.river_stage=data.get('river_stage');
        this.newWeather.other_observations=data.get('other_observations') 
        this.newWeather.sort_time=data.get('sort_time') 
      });
    }

    else if (this.status==="offline"){
      this.localService.get_Weather_record(CA,date).
      then(data => {
        this.weathers = data;
        this.weathers.forEach(record =>{
          console.log(record)
          this.placeholderid=record["id"]
          this.newWeather.CA=record["CA"]
          this.newWeather.date=record["date"]
          this.newWeather.area_ice=record["area_ice"]
          this.newWeather.ice_thick=record["ice_thick"]
          this.newWeather.low_temp=record["low_temp"]
          this.newWeather.wind_dir=record["wind_dir"]
          this.newWeather.wind_speed=record["wind_speed"]
          this.newWeather.river_stage=record["river_stage"]
          this.newWeather.other_observations=record["other_observations"]
          this.newWeather.date=record["sort_time"]
        });
      });
    }
  }
}

//adds data to either IndexDB or the Cloud depending on connection status
addData(){

  this.newWeather.CA=this.selected_CA;

  //only update date related fields when you are creating a new record
  if (this.mode === "create record"){
    this.getdatesfordb();
  }
  //push entry to cloud
  if (this.status==="online"){
    this.cloudservice.add_Weather_record(this.newWeather);
  }

  //push entry to IndexDB
  else if (this.status==="offline"){
    this.localService.add_Weather_record(this.newWeather);
  }

  //display data written dialogue and refresh the page
  this.comp.openDataWrittenDialog()
}

//creates timestamps to write to dbs
getdatesfordb(){
  console.log("creating dates")
  var d = new Date();
  var day1=d.getDate();
  //get month is zero based so add 1
  var month1=(d.getMonth()+1);
  var year1=d.getFullYear();
  var time=d.getTime()
  this.newWeather.sort_time=time.toString();
  var day=day1.toString();
  var month=month1.toString();
  var year=year1.toString();
  var stringg=month+ "-" + day + "-" + year;

  this.newWeather.date=  stringg;
}

//clears page of data
clearNewWeather() {
  this.newWeather = new Weather();
}

//this function fetches certain weather fields on the page
//with data from the OpenWeather API
async get_weather_from_api(position){
    
  const res = await fetch("http://api.openweathermap.org/data/2.5/weather?lat="+position.coords.latitude+"&lon="+position.coords.longitude+'&units=imperial&appid=80dc87045d3dae46154b1dc9f2455de1')
  const data = await res.json();

  console.log(data)

  this.newWeather.wind_dir=data.wind.deg.toString();
  this.newWeather.wind_dir=this.degToCompass(data.wind.deg).toString();
  this.newWeather.wind_speed=data.wind.speed.toString();
  this.newWeather.low_temp=data.main.temp_min.toString();

  return data
}

//this functions converts the degrees returned by the weather api 
//into actual cardinal directions
degToCompass(num) {
  var val = Math.floor((num / 22.5) + 0.5);
  var arr = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
  return arr[(val % 16)];
}

onResize(event) {
  this.breakpoint = (event.target.innerWidth <= 768) ? 1 : 2;
}

}
