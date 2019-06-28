import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CookieService {

  constructor() { }

  setCA(CA_Name : string){
    localStorage.setItem("CA",CA_Name)
  }

  setStatus(Status : string){
    localStorage.setItem("Status",Status)
  }


}
