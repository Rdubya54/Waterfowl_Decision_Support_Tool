import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import {GaugeStats} from 'src/app/model/gauge-stats';
import { AngularFirestoreCollection } from 'angularfire2/firestore';
import * as firebase from 'firebase/app';
import 'firebase/storage';

@Injectable({
  providedIn: 'root'
})

//this service contains methods only for walking the json "tree" in the firestore database

export class dbService {



constructor(private firestore:AngularFirestore) { 
}

//return all CA's in cloud
getCAs() {
  return this.firestore.collection('Conservation_Areas').get();    
}

//return all units in CA in cloud
getUnits(CA) {
  return this.firestore.collection('Conservation_Areas').doc(CA).collection("Units").get();
}

//return all pools in units in CA in cloud
getPools(CA,unit) {
  console.log("selected CA is "+CA)
  return this.firestore.collection('Conservation_Areas').doc(CA).collection("Units").doc(unit).collection("Pools").get();
}

//return all wcs in pools in units in CA in cloud
getWCS(CA,unit,pool) {
  console.log("selected pool is "+pool)
  return this.firestore.collection('Conservation_Areas').doc(CA).collection("Units").doc(unit).collection("Pools").doc(pool).collection("WCS").get();
}

//return all gauges in wcs in pools in units in CA in cloud
getGauges(CA,unit,pool,wcs){
  return this.firestore.collection('Conservation_Areas').doc(CA).collection("Units").doc(unit)
  .collection("Pools").doc(pool).collection("WCS").doc(wcs).collection("Gauges")
  .get();
}



}
