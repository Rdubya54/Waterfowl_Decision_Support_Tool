import { Component, OnInit } from '@angular/core';
import { WeatherLocalService } from 'src/app/service/weather-local.service';
import {Globals} from 'src/app/extra/globals';
import { AngularFireDatabase } from 'angularfire2/database';
import { WeatherCloudService } from 'src/app/service/weather-cloud.service';
import {WeatherApiServiceService} from 'src/app/service/weather-api-service.service'
import { HttpClient } from '@angular/common/http';

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

  private localservice: WeatherLocalService;
  private cloudservice: WeatherCloudService;
  watermanagements: any[];
  newWeather: IWeather = new Weather();
  local_records: any[];

  joke: any;
  ress:any;

   constructor(private http: HttpClient,private apiservice:WeatherApiServiceService, private localService: WeatherLocalService, private cloudService:WeatherCloudService, private globals:Globals,private firebase: AngularFireDatabase) {
      this.localservice = localService;
      this.cloudservice= cloudService;
  }
  ngOnInit() {
    //this.getWeather();
    //this.getWeatherapi();
  }

  //this was function we were using, only commented out so app would build
/*   getWeatherapi(){
    this.apiservice.getweather().subscribe(res =>{
      console.log(res);
    });
  } */

  getWeather() {
    this.localservice.getWeather().
    then(students => {
        this.watermanagements = students;
    }).catch(error => {
        console.error(error);
        alert(error.message);
    });
}

addWeather() {
  alert("online stat is "+this.globals.role);

  var status=this.globals.role;

  //if app is offline, write to indexdb
  if (status=="offline"){
    this.localservice.addWeather(this.newWeather).
    then((addedWaterManagements: IWeather[]) => {
    if (addedWaterManagements.length > 0) {
      this.watermanagements.push(addedWaterManagements[0]);
      this.clearNewWeather();
      alert('Successfully added');
    }
    })
    .catch(error => {
    console.error(error);
    alert(error.message);
    });
  }
  //if app is online, write to cloud (firestore for the time being)
  else{
    this.cloudservice.addWeather(this.newWeather);    
  }
  }

  clearNewWeather() {
    this.newWeather = new Weather();
   }

}
