import { Component, OnInit } from '@angular/core';

import {
  Watermanagement,
  IWatermanagement
} from 'src/app/model/watermanagement';

import {GaugedataService} from 'src/app/service/gaugedata.service';
import { Policy } from 'src/app/model/policy.model';
import { GaugeStats } from 'src/app/model/gauge-stats.model';
import { CastExpr } from '@angular/compiler';
import { AngularFirestoreCollection } from 'angularfire2/firestore';
import { CA } from 'src/app/model/ca.model';
import { Observable } from 'rxjs';
import { Query } from '@firebase/firestore-types'
import { AngularFirestore } from '@angular/fire/firestore';


@Component({
  selector: 'app-gauge-stats',
  templateUrl: './gauge-stats.component.html',
  styleUrls: ['./gauge-stats.component.css']
})
export class GaugeStatsComponent implements OnInit {

  breakpoint:number;

  public CA_list: string[]=[];
  public selected_CA;

  public Pool_list: string[]=[];
  public selected_Pool;

  public wcs_list: string[]=[];
  public selected_wcs;

  public gauge_list: string[]=[];
  public selected_gauge;

  public image_name=0;
  public dry=0;
  public sixinch=0;
  public twelveinch=0;
  public eighteeninch=0;
  public eighteenplus=0;

  constructor(private gaugeservice:GaugedataService,private firestore:AngularFirestore) { 
      const url = 'https://firebasestorage.googleapis.com/v0/b/ducks-110db.appspot.com/o/BB_1_1C_134_560006714_Reclassed_Surface.jpg?alt=media&token=011bddaa-86a3-4006-970a-f55324615f6a';
  }

  ngOnInit() {
    this.breakpoint = (window.innerWidth <= 768) ? 1 : 3;

    this.gaugeservice.getCAs().subscribe(data => {
        this.CA_list=[];
        this.Pool_list=[];
        this.wcs_list=[];
        this.gauge_list=[];
        console.log(this.CA_list)
        data.forEach(doc => {
          console.log(doc.id);
          console.log(doc.data);
          this.CA_list.push(doc.id)
        });
    });
  }

  getPools(CA){
    this.Pool_list=[];
    this.wcs_list=[];
    this.gauge_list=[];
    this.gaugeservice.getPools(CA).subscribe(data => {
      data.forEach(doc => {
        console.log(doc.id);
        console.log(doc.data);
        this.Pool_list.push(doc.id)
      });
  });
  }
  
  getWCS(CA,pool){
    this.wcs_list=[];
    this.gauge_list=[];
    this.gaugeservice.getWCS(CA,pool).subscribe(data => {
      data.forEach(doc => {
        console.log(doc.id);
        console.log(doc.data);
        this.wcs_list.push(doc.id)
      });
  });
  }

  getGauge(CA,pool,wcs){
    this.gauge_list=[];
    this.gaugeservice.getGauge(CA,pool,wcs).subscribe(data => {
      data.forEach(doc => {
        console.log(doc.id);
        console.log(doc.data);
        this.gauge_list.push(doc.id)
      });
  });
  }

  getStats(CA,pool,wcs,gauge){
    this.gaugeservice.getStats(CA,pool,wcs,gauge).subscribe(data => {
      console.log(data.data());
      console.log(data.get('Image_Name'));
      console.log('asdfas' + data.get('Shallowly_Flooded_6_12in'));

      this.image_name=data.get('Image_Name');
      this.dry=data.get('Dry_not_Flooded');
      this.sixinch=data.get('Shallowly_Flooded_0_6in')
      this.twelveinch=data.get('Shallowly_Flooded_6_12in')
      this.eighteeninch=data.get('Shallowly_Flooded_12_18in')
      this.eighteenplus=data.get('Full_Flooded_18in')


      console.log(this.sixinch)
    });
  }
}
