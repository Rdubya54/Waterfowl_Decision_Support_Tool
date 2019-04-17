import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  constructor() { }
  public currentLocation;

  get_location(){
    window.navigator.geolocation.getCurrentPosition(
      (position) => {
        /* Location tracking code */
        this.currentLocation = position.coords.latitude;
        console.log("right here it is"+this.currentLocation)
        
      },
      (failure) => {
        if (failure.message.indexOf("Only secure origins are allowed") == 0) {
          alert('Only secure origins are allowed by your browser.');
        }
      }
    )
      return this.currentLocation;

  }
}
