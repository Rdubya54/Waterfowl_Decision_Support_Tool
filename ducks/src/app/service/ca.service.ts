import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CAService {

  private CA: string = "CA";

  constructor() { }

  setCA(CA_Name : string){
    localStorage.setItem("CA",CA_Name)
  }

  setSettings(data: any) {
    localStorage.setItem(this.CA, JSON.stringify(data));
  }

  getUserSettings() {
    let data = localStorage.getItem(this.CA);
    return JSON.parse(data);
  }

  clearUserSettings() {
    localStorage.removeItem(this.CA);
  }

  cleanAll() {
    localStorage.clear()
  }
}
