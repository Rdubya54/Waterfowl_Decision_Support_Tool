import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Policy } from 'src/app/model/policy.model';
import {GaugeStats} from 'src/app/model/gauge-stats.model';
import { AngularFirestoreCollection } from 'angularfire2/firestore';

/* import { CA } from 'src/app/model/ca.model';
import { Observable } from 'rxjs'; */

@Injectable({
  providedIn: 'root'
})
export class GaugedataService {

/*   CAref:AngularFirestoreCollection<CA>;
  CA$:Observable<CA[]> */

  constructor(private firestore:AngularFirestore) { 
/*     this.CAref=this.firestore.collection('Gauge_Stats')
    this.CA$=this.CAref.valueChanges(); */
  }
/* getPolicies() {
  return this.firestore.collection('policies').snapshotChanges();
} */


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

}
