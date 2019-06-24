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
  public unit_list: string[]=[];
  public selected_unit; 
  public Pool_list: string[]=[];
  public selected_Pool;
  public wcs_list: string[]=[];
  public selected_wcs;
  public gauge_list: string[]=[];
  public selected_gauge;


/*   public crop_master_list:{[key:string]:string[]}={}; */
  public crop_master_list:string[]=[];
  public crop_keys:string[]=[];
  public crop_values:string[]=[];

  objectKeys = Object.keys;


  public image_name=0;
  public total_acres=0;
  public dry=0;
  public sixinch=0;
  public twelveinch=0;
  public eighteeninch=0;
  public eighteenplus=0;

  public dry_per=0;
  public sixinch_per=0;
  public tweleveinch_per=0;
  public eighteeninch_per=0;
  public eighteenplus_per=0;

  public image_url;
  public symbo_url;

  public cropstatus;

  constructor(private gaugeservice:GaugedataService,private firestore:AngularFirestore) {
    this.getSymbology();
  }

  ngOnInit() {
    this.breakpoint = (window.innerWidth <= 768) ? 1 : 2;

    this.gaugeservice.getCAs().subscribe(data => {
        this.CA_list=[];
        this.unit_list=[];
        this.Pool_list=[];
        this.wcs_list=[];
        this.gauge_list=[];
        data.forEach(doc => {
          this.CA_list.push(doc.id)
        });
    });
  }

  //fetch all units for CA for dropdown
  getUnits(CA){
    this.unit_list=[];
    this.Pool_list=[];
    this.wcs_list=[];
    this.gauge_list=[];
    this.gaugeservice.getUnits(CA).subscribe(data => {
      data.forEach(doc => {
        this.unit_list.push(doc.id)
      });
  });
  }
  
  //fetch all pools for unit for dropdown
  getPools(CA,unit){
    this.Pool_list=[];
    this.wcs_list=[];
    this.gauge_list=[];
    this.gaugeservice.getPools(CA,unit).subscribe(data => {
      data.forEach(doc => {
        this.Pool_list.push(doc.id)
      });
  });
  }
  
  //fetch all WCSs for pool for dropdown
  getWCS(CA,unit,pool){
    this.wcs_list=[];
    this.gauge_list=[];
    this.gaugeservice.getWCS(CA,unit,pool).subscribe(data => {
      data.forEach(doc => {
        this.wcs_list.push(doc.id)
      });
  });
  }

  //fetch all gauges for wcs for dropdown
  getGauge(CA,unit,pool,wcs){
    this.gauge_list=[];
    this.gaugeservice.getGauge(CA,unit,pool,wcs).subscribe(data => {
      data.forEach(doc => {
        this.gauge_list.push(doc.id)
      });
  });
  }

  //fetch stats for the particular gauge for dropdown
  getStats(CA,unit,pool,wcs,gauge){
    this.gaugeservice.getStats(CA,unit,pool,wcs,gauge).subscribe(data => {

      this.gaugeservice.getHabitat(CA,unit,pool,wcs,gauge).subscribe(data => {
        this.total_acres=data.get('Total_Acres')
        this.dry=data.get('Dry_not_flooded');
        this.sixinch=data.get('Shallowly_Flooded_0_6in')
        this.twelveinch=data.get('Shallowly_Flooded_6-12in')
        this.eighteeninch=data.get('Shallowly_Flooded_12_18in')
        this.eighteenplus=data.get('Full_Flooded_18in')

        this.dry_per=(this.dry/this.total_acres)*100
        this.sixinch_per=(this.sixinch/this.total_acres)*100
        this.tweleveinch_per=(this.twelveinch/this.total_acres)*100
        this.eighteeninch_per=(this.eighteeninch/this.total_acres)*100
        this.eighteenplus_per=(this.eighteenplus/this.total_acres)*100

        this.cropstatus='No Crop Data Available For Pool';
        this.crop_master_list=[]

        this.gaugeservice.getImageName(CA,unit,pool,wcs,gauge).subscribe(data => {
          this.image_name=data.get('Image_Name')
          this.getImage(CA,pool,this.image_name)

          this.gaugeservice.getCrops(CA,unit,pool,wcs,gauge).subscribe(data => {
            data.forEach(doc => {
              this.cropstatus='';
              var crop=doc.id
              var crop_list=[];
              this.crop_master_list[crop]=crop_list
              this.gaugeservice.getCropStats(CA,unit,pool,wcs,gauge,crop).subscribe(data => {
                crop_list['Total Acres']=data.get('Total Acres');
                crop_list['Dry_not_flooded']=data.get('Dry_not_flooded');
                crop_list['Shallowly_Flooded_0_6in']=data.get('Shallowly_Flooded_0_6in');
                crop_list['Shallowly_Flooded_6-12in']=data.get('Shallowly_Flooded_6_12in');
                crop_list['Shallowly_Flooded_12_18in']=data.get('Shallowly_Flooded_12_18in');
                crop_list['Full_Flooded_18in']=data.get('Full_Flooded_18in');
                this.crop_master_list[crop]=crop_list;
                this.crop_keys=Object.keys(this.crop_master_list)

                crop_list['Dry_not_flooded %']=(crop_list['Dry_not_flooded']/crop_list['Total Acres'])*100
                crop_list['Shallowly_Flooded_0_6in %']=(crop_list['Shallowly_Flooded_0_6in']/crop_list['Total Acres'])*100
                crop_list['Shallowly_Flooded_6-12in %']=(crop_list['Shallowly_Flooded_6-12in']/crop_list['Total Acres'])*100
                crop_list['Shallowly_Flooded_12_18in %']=(crop_list['Shallowly_Flooded_12_18in']/crop_list['Total Acres'])*100
                crop_list['Full_Flooded_18in %']=(crop_list['Full_Flooded_18in']/crop_list['Total Acres'])*100
                //this.crop_values=Object.values(this.crop_master_list)
                console.log(this.crop_master_list)
                console.log(this.crop_values)
              }); 
            });
          });
        });      
      });
  });
  }

  //fetch image for the particular Gauge
  getImage(CA,pool,image_name){
    var storage = firebase.storage().ref();
    var CA =CA.replace(" ","_")
    var imagepath=CA+"_"+pool+'/'+image_name+".jpg"
    console.log(imagepath)
    var ref = storage.child(imagepath)
    ref.getDownloadURL().then(url =>{
        console.log(url)
        this.image_url=url;
        console.log(this.image_name)
    });  
  }

  //get map symbology image
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
