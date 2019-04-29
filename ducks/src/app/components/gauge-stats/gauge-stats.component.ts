import { Component, OnInit,Inject } from '@angular/core';

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
import * as firebase from 'firebase/app';
import 'firebase/storage';



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

  public image_url;

  constructor(private gaugeservice:GaugedataService,private firestore:AngularFirestore) {
   
/*     this.image_url = storage.refFromURL('gs://ducks-110db.appspot.com/BB_1_1A_134_35_Reclassed_Surface.jpg')
    console.log(this.image_url.getDownloadUrl) */
    


}

  ngOnInit() {

    this.breakpoint = (window.innerWidth <= 768) ? 1 : 2;

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

      this.getImage(this.image_name);
      console.log(this.sixinch)
    });
  }



  getImage(image_name){
    //this.image_url="https://firebasestorage.googleapis.com/v0/b/ducks-110db.appspot.com/o/BB_1_1A_134_25_Reclassed_Surface.jpg?alt=media&token=ba8abe52-80f0-4fac-84cd-0c0b608e9860";
    var storage = firebase.storage().ref();
    var ref = storage.child(image_name+".jpg")
    ref.getDownloadURL().then(url =>{
        console.log(url)
        this.image_url=url;
        console.log(this.image_name)
    });  
  }
}
