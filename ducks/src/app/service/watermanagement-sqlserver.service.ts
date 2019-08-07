import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

@Injectable({
  providedIn: 'root'
})
export class WatermanagementSqlserverService {

  constructor(private http: Http) {

  }

  getWaterManagement(){
    
    this.http.get('https://testintra45ssl/ws/wwdmp/api/downloadwater/1001').subscribe(data=>{
    console.log("sql server data is"+data.json())
    var res_json = data.json();

    console.log("sql 1  Elevation is "+res_json.Elevation)
    console.log("sql 2 Elevation is "+res_json.wwdmWater_Recs.Elevation)
    console.log("sql 3 Elevation is "+res_json.wwdmWater_Recs[0].Elevation)
   });
  }
}
