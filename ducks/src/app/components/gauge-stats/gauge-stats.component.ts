import { Component, OnInit,Inject } from '@angular/core';

import {
  Watermanagement,
  IWatermanagement
} from 'src/app/model/watermanagement';

import {GaugedataService} from 'src/app/service/gaugedata.service';
import { GaugeStats } from 'src/app/model/gauge-stats.model';
import { CastExpr } from '@angular/compiler';
import { AngularFirestoreCollection } from 'angularfire2/firestore';
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
  public symbo_url;

  constructor(private gaugeservice:GaugedataService,private firestore:AngularFirestore) {
    this.getSymbology();
  }

  ngOnInit() {
    this.breakpoint = (window.innerWidth <= 768) ? 1 : 2;

    this.gaugeservice.getCAs().subscribe(data => {
        this.CA_list=[];
        this.Pool_list=[];
        this.wcs_list=[];
        this.gauge_list=[];
        data.forEach(doc => {
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
        this.Pool_list.push(doc.id)
      });
  });
  }
  
  getWCS(CA,pool){
    this.wcs_list=[];
    this.gauge_list=[];
    this.gaugeservice.getWCS(CA,pool).subscribe(data => {
      data.forEach(doc => {
        this.wcs_list.push(doc.id)
      });
  });
  }

  getGauge(CA,pool,wcs){
    this.gauge_list=[];
    this.gaugeservice.getGauge(CA,pool,wcs).subscribe(data => {
      data.forEach(doc => {
        this.gauge_list.push(doc.id)
      });
  });
  }

  getStats(CA,pool,wcs,gauge){
    this.gaugeservice.getStats(CA,pool,wcs,gauge).subscribe(data => {
      this.image_name=data.get('Image_Name');
      this.dry=data.get('Dry_not_Flooded');
      this.sixinch=data.get('Shallowly_Flooded_0_6in')
      this.twelveinch=data.get('Shallowly_Flooded_6_12in')
      this.eighteeninch=data.get('Shallowly_Flooded_12_18in')
      this.eighteenplus=data.get('Full_Flooded_18in')

      this.getImage(CA,pool,this.image_name);
    });
  }

  getImage(CA,pool,image_name){
    var storage = firebase.storage().ref();
    var imagepath=CA+"_"+pool+'/'+image_name+".jpg"
    console.log(imagepath)
    var ref = storage.child(imagepath)
    ref.getDownloadURL().then(url =>{
        console.log(url)
        this.image_url=url;
        console.log(this.image_name)
    });  
  }

  getSymbology(){
    var storage = firebase.storage().ref();
    var imagepath='symbology/Symbology_Image.JPG'
    console.log(imagepath)
    var ref = storage.child(imagepath)
    ref.getDownloadURL().then(url =>{
        console.log(url)
        this.symbo_url=url;
        console.log(this.image_name)
    });    
  }

  onResize(event) {
    this.breakpoint = (event.target.innerWidth <= 768) ? 1 : 2;
    //this.breakpoint = (event.target.innerWidth > 500) ? 1 : 3;
  }
}
