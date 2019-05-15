import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import {GaugeStats} from 'src/app/model/gauge-stats.model';
import { AngularFirestoreCollection } from 'angularfire2/firestore';
import * as firebase from 'firebase/app';
import 'firebase/storage';

@Injectable({
  providedIn: 'root'
})
export class dbService {



constructor(private firestore:AngularFirestore) { 
}

getCAs() {
  return this.firestore.collection('Gauge_Stats').get();    
}

getUnits(CA) {
  return this.firestore.collection('Gauge_Stats').doc(CA).collection("Units").get();
}

getPools(CA,unit) {
  console.log("selected CA is "+CA)
  return this.firestore.collection('Gauge_Stats').doc(CA).collection("Units").doc(unit).collection("Pools").get();
}

getWCS(CA,unit,pool) {
  console.log("selected pool is "+pool)
  return this.firestore.collection('Gauge_Stats').doc(CA).collection("Units").doc(unit).collection("Pools").doc(pool).collection("WCS").get();
}

getDates(CA,unit,pool,wcs) {
  console.log("selected pool is "+pool)
  return this.firestore.collection('Gauge_Stats').doc(CA).collection("Units").doc(unit)
  .collection("Pools").doc(pool).collection("WCS").doc(wcs).collection("Water Management")
  .get();
}

getDates_waterfood(CA,unit,pool) {
  console.log("selected pool is "+pool)
  return this.firestore.collection('Gauge_Stats').doc(CA).collection("Units").doc(unit)
  .collection("Pools").doc(pool).collection("Biweekly Water and Food Availability")
  .get();
}


}
