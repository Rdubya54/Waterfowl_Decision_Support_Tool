import { Component, OnInit,Inject } from '@angular/core';

import {
  Watermanagement,
  IWatermanagement
} from 'src/app/model/watermanagement';

import {GaugedataService} from 'src/app/service/gaugedata.service';
import {GaugeStatLocalService} from 'src/app/service/gauge-stat-local.service';
import {ImageLocalService} from 'src/app/service/image-local.service'
import { GaugeStats } from 'src/app/model/gauge-stats';
import { CastExpr } from '@angular/compiler';
import { AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { Query } from '@firebase/firestore-types'
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import 'firebase/storage';
import { AppComponent } from 'src/app/app.component';

import {DomSanitizer} from '@angular/platform-browser';
import { CropStats } from 'src/app/model/crop-stats';

import {DropDownMenuDataService} from 'src/app/service/drop-down-menu-data.service';

@Component({
  selector: 'app-gauge-stats',
  templateUrl: './gauge-stats.component.html',
  styleUrls: ['./gauge-stats.component.css']
})
export class GaugeStatsComponent implements OnInit {

  breakpoint:number;

  //define dropdown menus
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


  //define lists for holding crop data
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

  public dry_per;
  public sixinch_per;
  public tweleveinch_per;
  public eighteeninch_per;
  public eighteenplus_per;

  public symbo_url;

  public status;
  public table="Gauge Stats";

  public cropstatus;
  public isLoading;

  public local_image;
  public local_image_name;
  public object_URL;
  public image_url;

  constructor(private gaugeservice:GaugedataService,private gaugeservice_local:GaugeStatLocalService,
    private firestore:AngularFirestore, private app:AppComponent,public sanitizer:DomSanitizer,
    private imageservice_local:ImageLocalService,private dropdownservice:DropDownMenuDataService) {
    
  }

  ngOnInit() {
    this.breakpoint = (window.innerWidth <= 768) ? 1 : 2;

    console.log(localStorage.getItem("CA"))

    this.selected_CA=localStorage.getItem("CA")

    this.status=localStorage.getItem('Status')

    this.getSymbology();

    this.dropdownservice.getUnits(this.table,this.selected_CA).then(data => {
      var previous='None'

      data.forEach(record =>{
          var unit=record["Unit"]

          if (unit !== previous){
            this.unit_list.push(unit)
            previous=unit
          }
      });
    });    
  }
  
  //fetch all pools for unit for dropdown
  getPools(CA,unit){
    this.Pool_list=[];
    this.wcs_list=[];
    this.gauge_list=[];

    this.dropdownservice.getPools(this.table,CA,unit).then(data => {
      var previous = 'None';

      data.forEach(record =>{
          var pool=record["Pool"]

          if (pool !== previous){
            this.Pool_list.push(pool)
            previous=pool
          }
      });
    });
  }
  
  //fetch all WCSs for pool for dropdown
  getWCS(CA,unit,pool){
    this.wcs_list=[];
    this.gauge_list=[];


    this.dropdownservice.getWCS(this.table,CA,unit,pool).then(data => {
      var previous = 'None';

      data.forEach(record =>{
          var wcs=record["WCS"]

          if (wcs !== previous){
            console.log("wcs is "+wcs)
            this.wcs_list.push(wcs)
            previous=wcs
          }
      });
    });      
    
  }

  //fetch all gauges for wcs for dropdown
  getGauge(CA,unit,pool,wcs){
    this.gauge_list=[];

    this.gaugeservice_local.getGauges(CA,unit,pool,wcs).then(data => {
      var previous = 'None';

      data.forEach(record =>{
          var gauge=record["Gauge"]

          if (gauge !== previous){
            console.log("gauge is "+gauge)
            this.gauge_list.push(gauge)
            previous=gauge
          }
      });
    });      
  }

  //fetch stats for the particular gauge for dropdown
  getStats(CA,unit,pool,wcs,gauge){

    this.cropstatus='No Crop Data Available For Pool';
    this.crop_master_list=[]

    this.gaugeservice_local.getStats(CA,unit,pool,wcs,gauge).then(data => {
      
      data.forEach(record =>{
        this.total_acres=record['Total_Acres']
        this.dry=record['Dry']
        this.sixinch=record['Sixinch']
        this.twelveinch=record['Twelveinch']
        this.eighteeninch=record['Eightteeninch']
        this.eighteenplus=record['Flooded']
        var crop_stats=record['Crop_Stats']

        this.dry_per=((this.dry/this.total_acres)*100).toFixed(2)
        this.sixinch_per=((this.sixinch/this.total_acres)*100).toFixed(2)
        this.tweleveinch_per=((this.twelveinch/this.total_acres)*100).toFixed(2)
        this.eighteeninch_per=((this.eighteeninch/this.total_acres)*100).toFixed(2)
        this.eighteenplus_per=((this.eighteenplus/this.total_acres)*100).toFixed(2)  

        crop_stats.forEach(crop_stat =>{

          this.cropstatus='';
          var crop=crop_stat.Name as string;
          var crop_list=[];
          this.crop_master_list[crop]=crop_list
          
          console.log("crop array offline is "+crop_stat.Name)

          crop_list['Total Acres']=crop_stat.Total_Acres;
          crop_list['Dry_not_flooded']=crop_stat.Dry
          crop_list['Shallowly_Flooded_0_6in']=crop_stat.Sixinch
          crop_list['Shallowly_Flooded_6-12in']=crop_stat.Twelveinch
          crop_list['Shallowly_Flooded_12_18in']=crop_stat.Eightteeninch
          crop_list['Full_Flooded_18in']=crop_stat.Flooded
          this.crop_master_list[crop]=crop_list;
          this.crop_keys=Object.keys(this.crop_master_list)

          crop_list['Dry_not_flooded %']=((crop_list['Dry_not_flooded']/crop_list['Total Acres'])*100).toFixed(2)
          crop_list['Shallowly_Flooded_0_6in %']=((crop_list['Shallowly_Flooded_0_6in']/crop_list['Total Acres'])*100).toFixed(2)
          crop_list['Shallowly_Flooded_6-12in %']=((crop_list['Shallowly_Flooded_6-12in']/crop_list['Total Acres'])*100).toFixed(2)
          crop_list['Shallowly_Flooded_12_18in %']=((crop_list['Shallowly_Flooded_12_18in']/crop_list['Total Acres'])*100).toFixed(2)
          crop_list['Full_Flooded_18in %']=((crop_list['Full_Flooded_18in']/crop_list['Total Acres'])*100).toFixed(2)

          this.local_image_name=record["Image_Name"];

          this.imageservice_local.getImage(this.local_image_name).then(data => {
        
            data.forEach(record =>{
              console.log('success')
              console.log('image is '+record["Image"])
              this.local_image=record["Image"];
    
              var URL = window.URL;
              this.object_URL = URL.createObjectURL(this.local_image);
            })
          });
        });
      })
    });
  }
  

  //fetch image for the particular Gauge Image
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
        this.isLoading=false
    });  

  }

  //get map symbology image
  getSymbology(){

    console.log("getting offline symbo")
    this.imageservice_local.getImage('symbo').then(data => {
      console.log("cuaght a symbo")
      data.forEach(record =>{
        this.local_image=record["Image"];
        console.log("symbo:"+this.local_image)
        var URL = window.URL;
        this.symbo_url = URL.createObjectURL(this.local_image);
      })
    });

  }

  onResize(event) {
    this.breakpoint = (event.target.innerWidth <= 768) ? 1 : 2;
    //this.breakpoint = (event.target.innerWidth > 500) ? 1 : 3;
  }
}
