import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { IWatermanagement } from 'src/app/model/watermanagement';
import { HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class WatermanagementSqlserverService {

    constructor(private http: Http,private httpclient:HttpClient) {

    }

    //pushes a water management record to the db
    add_WaterManagement_record(watermanagement:IWatermanagement) {
       
        const httpOptions = {
          headers: new HttpHeaders({
            'Content-Type':  'application/json',
            'Authorization': 'my-auth-token'
          })
        }

        return this.httpclient.post<IWatermanagement>('https://testintra45ssl/ws/wwdmp/api/uploadwater/getwaterdata', watermanagement, httpOptions)
    }
  
    //get the two latest records for the WCS
    get_prev_2_WaterManagement_records(CA,unit,pool,wcs){

    }
  
    //get the seven latest records for the WCS
    get_prev_7_WaterManagement_records(CA,unit,pool,wcs){

    }
  
    //gets watermanagement fields for an individual record
    get_WaterManagement_record(){
      return this.http.get('https://testintra45ssl/ws/wwdmp/api/downloadwater/1001')

        /*     this.http.get('https://testintra45ssl/ws/wwdmp/api/downloadwater/1001').subscribe(data=>{
      console.log("sql server data is"+data.json())
      var res_json = data.json();

      console.log("sql 1  Elevation is "+res_json.Elevation)
      console.log("sql 2 Elevation is "+res_json.wwdmWater_Recs.Elevation)
      console.log("sql 3 Elevation is "+res_json.wwdmWater_Recs[0].Elevation)
    }); */
    }
  
    get_available_Dates(CA,unit,pool,wcs) {

    }
}
