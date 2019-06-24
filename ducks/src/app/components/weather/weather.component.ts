import { Component, OnInit } from '@angular/core';
import { WeatherLocalService } from 'src/app/service/weather-local.service';
import {Globals} from 'src/app/extra/globals';
import { AngularFireDatabase } from 'angularfire2/database';
import { WeatherCloudService } from 'src/app/service/weather-cloud.service';
import { HttpClient } from '@angular/common/http';
import {AppComponent} from 'src/app/app.component';
import {dbService} from 'src/app/service/db.service';

import {
  Weather,
  IWeather
} from 'src/app/model/weather';

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

  public placeholderid;


  constructor(private comp:AppComponent,private http: HttpClient,private localService: WeatherLocalService, private cloudService:WeatherCloudService,
     public globals:Globals,private dbservice: dbService,private firebase: AngularFireDatabase) {
      this.localservice = localService;
      this.cloudservice= cloudService;
  }

  ngOnInit() {
    this.breakpoint_top = (window.innerWidth <= 768) ? 1 : 1;
    this.breakpoint = (window.innerWidth <= 768) ? 1 : 2;

    this.CA_list=[];
    this.date_list=[];

    

    //attempt to get coordinates of user, if it succeds, get weather data from api
    navigator.geolocation.getCurrentPosition((position) =>
      this.getlocation(position)
    );
 
    //if app is online push any locally cached data to the cloud
    if (this.globals.role==="online"){
      //this.pushtocloudfromlocal();

      //get available CA's from dropdown menu
      this.dbservice.getCAs().subscribe(data => {
        data.forEach(doc => {
          this.CA_list.push(doc.id)
        });
      });
    }

    else if (this.globals.role==="offline"){
      this.localService.getCAs().then(data => {
        this.weathers = data;

        this.weathers.forEach(record =>{
            var CA=record["CA"]
            this.CA_list.push(CA)
        });
      });
    }
  }

  // fetches list of available record dates for pool for dropdown
  getDates(CA){
    this.date_list=["Create New Record"];

    if (this.globals.role==="online"){
    console.log('fetching cloud')
    this.dbservice.getDates_weather(CA).subscribe(data => {
      data.forEach(doc => {
        this.date_list.push(doc.id)
      });
    });
    }

    else if (this.globals.role==="offline"){
    this.localService.getDates(CA).then(data => {
      data.forEach(doc => {
        this.date_list.push(doc['date'])
      });
    });
    }
  }


//read weather
getWeather(CA,date){

  //when you are only getting old data
  if (this.selected_date!=='Create New Record'){

    if (this.globals.role==="online"){
      console.log('fetching cloud')
      this.cloudService.getWeather(CA,date).
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
      })
    }

    else if (this.globals.role==="offline"){
      this.localservice.getWeather(CA,date).
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

addWeather(){

  this.newWeather.CA=this.selected_CA;
  this.getdatesfordb();

  //if app is offline, write to indexdb
  if (this.globals.role=="offline"){
    this.localservice.addWeather(this.newWeather).
    then((addedWaterManagements: IWeather[]) => {
    if (addedWaterManagements.length > 0) {
      if(this.selected_date!=='Create New Record'){
        this.localService.deleteWeather(this.placeholderid)
      }

      this.weathers.push(addedWaterManagements[0]);
      this.clearNewWeather();
    }
    })
  }
  //if app is online, write to cloud (firestore for the time being)
  else{
    this.cloudservice.addWeather(this.newWeather);    
  }

  this.comp.openDataWrittenDialog();
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

clearNewWeather() {
  this.newWeather = new Weather();
}


async getlocation(position){
    
  const res = await fetch("http://api.openweathermap.org/data/2.5/weather?lat="+position.coords.latitude+"&lon="+position.coords.longitude+'&units=imperial&appid=80dc87045d3dae46154b1dc9f2455de1')
  const data = await res.json();

  console.log(data)

  this.newWeather.wind_dir=data.wind.deg;
  this.newWeather.wind_dir=this.degToCompass(data.wind.deg)
  this.newWeather.wind_speed=data.wind.speed;
  this.newWeather.low_temp=data.main.temp_min;

  return data
}

degToCompass(num) {
  var val = Math.floor((num / 22.5) + 0.5);
  var arr = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
  return arr[(val % 16)];
}

onResize(event) {
  this.breakpoint = (event.target.innerWidth <= 768) ? 1 : 2;
}

}
