import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

@Injectable({
  providedIn: 'root'
})
export class WatermanagementSqlserverService {

  constructor(private http: Http) {

  }

  getWaterManagement(){
    this.http.get('https://wsdev12/webservices/wwmd/api/downloadwater/1001').subscribe(data=>
    console.log("sql server data is"+data))  
  }
}
