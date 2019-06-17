import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { IWatermanagement } from 'src/app/model/watermanagement';
import { AngularFirestore } from 'angularfire2/firestore';

@Injectable({
  providedIn: 'root'
})
export class WatermanagementCloudService {

  constructor(private firestore:AngularFirestore) { }


   //this function pushes a water management record to the cloud
   addWaterManagement(watermanagement:IWatermanagement) {
  
    return this.firestore.collection('Conservation_Areas').doc(watermanagement.CA).collection("Units")
    .doc(watermanagement.Unit).collection("Pools").doc(watermanagement.Pool).collection("WCS").doc(watermanagement.Structure)
    .collection("Water Management")
    .doc(watermanagement.Date).set({
      CA:watermanagement.CA,
      Unit:watermanagement.Unit,
      Pool:watermanagement.Pool,
      WCS:watermanagement.Structure,
      Date:watermanagement.Date,
      Elevation: watermanagement.Elevation,
      Gate_manipulation: watermanagement.Gate_manipulation,
      Gate_level: watermanagement.Gate_level,
      Stoplog_change: watermanagement.Stoplog_change,
      Stoplog_level:watermanagement.Stoplog_level,
      Goose_numbers:watermanagement.Goose_numbers,
      Duck_numbers:watermanagement.Duck_numbers,
      Year:"dummy_year",
      Time:"dummy time",
      Fiscal_year:"dummy_fiscal",
      Notes:watermanagement.Notes,
      Reasons:watermanagement.Reasons,
      Sort_time:watermanagement.Sort_time
    });
  }

  //get the two latest records for the WCS
  getprevWaterManagement(CA,unit,pool,wcs,sort_time){

    console.log('sort time is '+sort_time)

    //WHEN you need the last two for the pump at a specific time (used when viewing old records)
    if (sort_time){
      return this.firestore.collection('Conservation_Areas').doc(CA).collection("Units").doc(unit).
      collection("Pools").doc(pool).collection("WCS").doc(wcs).collection("Water Management", 
      ref=>ref.orderBy('Sort_time', 'desc').where('Sort_time',"<",sort_time).limit(2)).get();  
 
    }

    //when you just need the last two for the pump
    else{
      return this.firestore.collection('Conservation_Areas').doc(CA).collection("Units").doc(unit).
      collection("Pools").doc(pool).collection("WCS").doc(wcs).collection("Water Management", 
      ref=>ref.orderBy('Sort_time', 'desc').limit(2)).get();
    }
  }

  //gets watermanagement fields for an individual record
  getWaterManagement(CA,unit,pool,wcs,record){
    return this.firestore.collection('Conservation_Areas').doc(CA).collection("Units").doc(unit).collection("Pools")
    .doc(pool).collection("WCS").doc(wcs).collection("Water Management").doc(record).get();
  }


}
