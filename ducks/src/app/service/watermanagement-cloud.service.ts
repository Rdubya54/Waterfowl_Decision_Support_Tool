import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { IWatermanagement } from 'src/app/model/watermanagement';
import { AngularFirestore } from 'angularfire2/firestore';

@Injectable({
  providedIn: 'root'
})
export class WatermanagementCloudService {

  constructor(public db: AngularFirestore) { }

   addWaterManagement(watermanagement:IWatermanagement) {
    return this.db.collection('Watermanagement').add({
      date: watermanagement.date,
      pool: watermanagement.pool,
      structure: watermanagement.structure,
      elevation: watermanagement.elevation,
      gate_manipulation: watermanagement.gate_manipulation,
      gate_level: watermanagement.gate_level,
      stoplog_change: watermanagement.stoplog_change,
      stoplog_level:watermanagement.stoplog_level,
      goose_numbers:watermanagement.goose_numbers,
      duck_numbers:watermanagement.duck_numbers,
      year:watermanagement.year,
      time:watermanagement.time,
      fiscal_year:watermanagement.fiscal_year,
      notes:watermanagement.notes,
      reasons:watermanagement.reasons
    });
  }
}
