import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import {GaugeStats} from 'src/app/model/gauge-stats.model';
import { AngularFirestoreCollection } from 'angularfire2/firestore';
import * as firebase from 'firebase/app';
import 'firebase/storage';

@Injectable({
  providedIn: 'root'
})
export class GaugedataService {



constructor(private firestore:AngularFirestore) { 

}


getCAs() {
  return this.firestore.collection('Gauge_Stats').get();    
}

getPools(CA) {
  console.log("selected CA is "+CA)
  return this.firestore.collection('Gauge_Stats').doc(CA).collection("Pools").get();   
}

getWCS(CA,pool) {
  console.log("selected pool is "+pool)
  return this.firestore.collection('Gauge_Stats').doc(CA).collection("Pools").doc(pool).collection("WCS").get();   
}

getGauge(CA,pool,wcs) {
  console.log("selected wcs is "+wcs)
  return this.firestore.collection('Gauge_Stats').doc(CA).collection("Pools").doc(pool).collection("WCS").doc(wcs).collection("Gauges").get();   
}

getStats(CA,pool,wcs,gauge) {
  return this.firestore.collection('Gauge_Stats').doc(CA).collection('Pools')
  .doc(pool).collection('WCS').doc(wcs).collection('Gauges').doc(gauge).get();

}

/* getImage(CA,pool,image_name){
  var storage = firebase.storage().ref();
  var imagepath=CA+"_"+pool+'/'+image_name+".jpg"
  console.log(imagepath)
  var ref = storage.child(imagepath)
  ref.getDownloadURL().then(url =>{
      console.log(url)

      return url;
  });  
} */

}
