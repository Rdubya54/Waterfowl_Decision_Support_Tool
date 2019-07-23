import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import {GaugeStats} from 'src/app/model/gauge-stats';
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
  return this.firestore.collection('Conservation_Areas').get();    
}

getUnits(CA) {
  return this.firestore.collection('Conservation_Areas').doc(CA).collection("Units").get();
}

getPools(CA,unit) {
  console.log("selected CA is "+CA)
  return this.firestore.collection('Conservation_Areas').doc(CA).collection("Units").doc(unit).collection("Pools").get();
}

getWCS(CA,unit,pool) {
  console.log("selected pool is "+pool)
  return this.firestore.collection('Conservation_Areas').doc(CA).collection("Units").doc(unit).collection("Pools").doc(pool).collection("WCS").get();
}

getDates(CA,unit,pool,wcs) {
  console.log("selected pool is "+pool)
  return this.firestore.collection('Conservation_Areas').doc(CA).collection("Units").doc(unit)
  .collection("Pools").doc(pool).collection("WCS").doc(wcs).collection("Water Management",ref=>ref.orderBy('Sort_time', 'desc'))
  .get();
}

getDates_foodavail(CA,unit,pool,wcs) {
  console.log("selected pool is "+pool)
  return this.firestore.collection('Conservation_Areas').doc(CA).collection("Units").doc(unit)
  .collection("Pools").doc(pool).collection("WCS").doc(wcs).collection("Fall Food Availability")
  .get();
}

getDates_waterfood(CA,unit,pool) {
  console.log("selected pool is "+pool)
  return this.firestore.collection('Conservation_Areas').doc(CA).collection("Units").doc(unit)
  .collection("Pools").doc(pool).collection("Biweekly Water and Food Availability")
  .get();
}

getDates_weather(CA){
  return this.firestore.collection('Conservation_Areas').doc(CA).collection("Daily Weather Observation",ref=>ref.orderBy('sort_time', 'desc'))
  .get();
}

getGauges(CA,unit,pool,wcs){
  return this.firestore.collection('Conservation_Areas').doc(CA).collection("Units").doc(unit)
  .collection("Pools").doc(pool).collection("WCS").doc(wcs).collection("Gauges")
  .get();
}

getImageName(CA,unit,pool,wcs,gauge){
  return this.firestore.collection('Conservation_Areas').doc(CA).collection("Units").doc(unit)
  .collection("Pools").doc(pool).collection("WCS").doc(wcs).collection("Gauges").doc(gauge).collection('Stats')
  .doc("Image_Name").get();
}

getStats(CA,unit,pool,wcs,gauge){
  return this.firestore.collection('Conservation_Areas').doc(CA).collection("Units").doc(unit)
  .collection("Pools").doc(pool).collection("WCS").doc(wcs).collection("Gauges").doc(gauge).collection('Stats')
  .doc("Flooded_Habitat_By_Acres").get();
}

}
