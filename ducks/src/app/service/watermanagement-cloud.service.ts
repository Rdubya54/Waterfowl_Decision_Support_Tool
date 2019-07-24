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
   add_WaterManagement_record(watermanagement:IWatermanagement) {

    console.log('type is:'+typeof(watermanagement.Elevation))
  
    return this.firestore.collection('Conservation_Areas').doc(watermanagement.CA).collection("Units")
    .doc(watermanagement.Unit).collection("Pools").doc(watermanagement.Pool).collection("WCS").doc(watermanagement.WCS)
    .collection("Water Management")
    .doc(watermanagement.Date).set({
      CA:watermanagement.CA,
      Unit:watermanagement.Unit,
      Pool:watermanagement.Pool,
      WCS:watermanagement.WCS,
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
      Sort_time:watermanagement.Sort_time,
      Update_time:watermanagement.Update_time,
      UID:watermanagement.UID,
      Delete:watermanagement.Delete,
    });
  }

  //get the two latest records for the WCS
  get_prev_2_WaterManagement_records(CA,unit,pool,wcs){
    return this.firestore.collection('Conservation_Areas').doc(CA).collection("Units").doc(unit).
      collection("Pools").doc(pool).collection("WCS").doc(wcs).collection("Water Management", 
      ref=>ref.orderBy('Sort_time', 'desc').limit(2)).get();
  }

  //get the seven latest records for the WCS
  get_prev_7_WaterManagement_records(CA,unit,pool,wcs){
    return this.firestore.collection('Conservation_Areas').doc(CA).collection("Units").doc(unit).
      collection("Pools").doc(pool).collection("WCS").doc(wcs).collection("Water Management", 
      ref=>ref.orderBy('Sort_time', 'asc').limit(7)).get()
  }

  //gets watermanagement fields for an individual record
  get_WaterManagement_record(CA,unit,pool,wcs,record){
    return this.firestore.collection('Conservation_Areas').doc(CA).collection("Units").doc(unit).collection("Pools")
    .doc(pool).collection("WCS").doc(wcs).collection("Water Management").doc(record).get();
  }

  get_available_Dates(CA,unit,pool,wcs) {
    console.log("selected pool is "+pool)
    return this.firestore.collection('Conservation_Areas').doc(CA).collection("Units").doc(unit)
    .collection("Pools").doc(pool).collection("WCS").doc(wcs).collection("Water Management",ref=>ref.orderBy('Sort_time', 'desc'))
    .get();
  }
}
