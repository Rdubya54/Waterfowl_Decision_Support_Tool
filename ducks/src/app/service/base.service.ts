import {
  IdbService
 } from './idb.service';
 import {
  IDataBase,
  DATA_TYPE,
  ITable
 } from 'jsstore';
import { IFoodAvail } from '../model/food-avail';
 export class BaseService {
  dbname = 'Waterfowl_Wetland_Management';
  constructor() {
   // turn on jsstore log status - help you to debug
   // turn off it in production or when you dont need
   this.connection.setLogStatus(true);
   this.initJsStore();
  }
 get connection() {
   return IdbService.idbCon;
  }
 initJsStore() {
   this.connection.isDbExist(this.dbname).then(isExist => {
    if (isExist) {
      console.log("in here")
     this.connection.openDb(this.dbname);
    } else {
      console.log("in there")
     const dataBase = this.getDatabase();
     this.connection.createDb(dataBase);
    }
   }).catch(err => {
    // this will be fired when indexedDB is not supported.
    alert(err.message);
   });
  }
 private getDatabase() {
   const tblWaterManagement: ITable = {
    name: 'WaterManagement',
    columns: [{
      name: 'id',
      primaryKey: true,
      autoIncrement: true
     },
     {
      name: 'date',
      //notNull: true,
      dataType: DATA_TYPE.String
     },
     {
      name: 'pool',
      dataType: DATA_TYPE.String,
     },
     {
      name: 'structure',
      dataType: DATA_TYPE.String
     },
     {
      name: 'elevation',
      dataType: DATA_TYPE.String,
     },
     {
      name: 'gate_manipulation',
      dataType: DATA_TYPE.String,
     },
     {
      name: 'gate_level',
      dataType: DATA_TYPE.String,
     },
     {
      name: 'stoplog_change',
      dataType: DATA_TYPE.String,
     },
     {
      name: 'stoplog_level',
      dataType: DATA_TYPE.String,
     },
     {
      name: 'duck_numbers',
      dataType: DATA_TYPE.String,
     },
     {
      name: 'goose_numbers',
      dataType: DATA_TYPE.String,
     },
     {
      name: 'year',
      dataType: DATA_TYPE.String,
     },
     {
      name: 'time',
      dataType: DATA_TYPE.String,
     },
     {
      name: 'fiscal_year',
      dataType: DATA_TYPE.String,
     },
     {
      name: 'notes',
      dataType: DATA_TYPE.String,
     },
     {
      name: 'reasons',
      dataType: DATA_TYPE.String,
     }
    ],
  }
  const tblWeather: ITable = {
    name: 'Daily_Weather_Observations',
    columns: [{
      name: 'id',
      primaryKey: true,
      autoIncrement: true
     },
     {
      name: 'month',
      //notNull: true,
      dataType: DATA_TYPE.String
     },
     {
      name: 'day',
      dataType: DATA_TYPE.String,
     },
     {
      name: 'area_ice',
      dataType: DATA_TYPE.String
     },
     {
      name: 'ice_thick',
      dataType: DATA_TYPE.String,
     },
     {
      name: 'low_temp',
      dataType: DATA_TYPE.String,
     },
     {
      name: 'wind_dir',
      dataType: DATA_TYPE.String,
     },
     {
      name: 'wind_speed',
      dataType: DATA_TYPE.String,
     },
     {
      name: 'river_stage',
      dataType: DATA_TYPE.String,
     },
     {
      name: 'other_observations',
      dataType: DATA_TYPE.String,
     }
    ]
  };
  const tblWaterFood: ITable = {
    name: 'Biweekly_Water_Status_and_Food_Availability',
    columns: [{
      name: 'id',
      primaryKey: true,
      autoIncrement: true
     },
     {
      name: 'month',
      //notNull: true,
      dataType: DATA_TYPE.String
     },
     {
      name: 'day',
      dataType: DATA_TYPE.String,
     },
     {
      name: 'pool',
      dataType: DATA_TYPE.String
     },
     {
      name: 'percent_of_full_pool',
      dataType: DATA_TYPE.String,
     },
     {
      name: 'less_than_six',
      dataType: DATA_TYPE.String,
     },
     {
      name: 'seven_to_twelve',
      dataType: DATA_TYPE.String,
     },
     {
      name: 'thirteen_or_more',
      dataType: DATA_TYPE.String,
     },
     {
      name: 'habitat_standing',
      dataType: DATA_TYPE.String,
     },
     {
      name: 'habitat_mowed',
      dataType: DATA_TYPE.String,
     },    
     {
      name: 'habitat_disced',
      dataType: DATA_TYPE.String,
     },
     {
      name: 'habitat_unharv_corn',
      dataType: DATA_TYPE.String,
     },
     {
      name: 'habitat_harv_corn',
      dataType: DATA_TYPE.String,
     },
     {
      name: 'habitat_unharv_milo',
      dataType: DATA_TYPE.String,
     },     
     {
      name: 'habitat_harv_milo',
      dataType: DATA_TYPE.String,
     },
     {
      name: 'habitat_unharv_beans',
      dataType: DATA_TYPE.String,
     },
     {
      name: 'habitat_harv_beans',
      dataType: DATA_TYPE.String,
     },
     {
      name: 'habitat_browse',
      dataType: DATA_TYPE.String,
     },
     ,
     {
      name: 'ice_standing',
      dataType: DATA_TYPE.String,
     },     
     {
      name: 'ice_mowed',
      dataType: DATA_TYPE.String,
     },
     {
      name: 'ice_descend',
      dataType: DATA_TYPE.String,
     },
     {
      name: 'ice_unharv_corn',
      dataType: DATA_TYPE.String,
     },
     {
      name: 'ice_harv_corn',
      dataType: DATA_TYPE.String,
     },     
     {
      name: 'ice_unharv_milo',
      dataType: DATA_TYPE.String,
     },
     {
      name: 'ice_harv_milo',
      dataType: DATA_TYPE.String,
     },
     {
      name: 'ice_unharv_beans',
      dataType: DATA_TYPE.String,
     },
     {
      name: 'ice_harv_beans',
      dataType: DATA_TYPE.String,
     },     
     {
      name: 'ice_unharv_beans',
      dataType: DATA_TYPE.String,
     },
     {
      name: 'ice_browse',
      dataType: DATA_TYPE.String,
     },
     {
      name: 'notes',
      dataType: DATA_TYPE.String,
     },
     {
      name: 'actions',
      dataType: DATA_TYPE.String,
     },    
     {
      name: 'response',
      dataType: DATA_TYPE.String,
     },
     {
      name: 'year',
      dataType: DATA_TYPE.String,
     },
     {
      name: 'time',
      dataType: DATA_TYPE.String,
     },
     {
      name: 'fiscal_year',
      dataType: DATA_TYPE.String,
     },
    ]
  };

  const tblFoodAvail: ITable = {
    name: 'Fall_Food_Availability',
    columns: [{
      name: 'id',
      primaryKey: true,
      autoIncrement: true
     },
     {
      name: 'month',
      //notNull: true,
      dataType: DATA_TYPE.String
     },
     {
      name: 'day',
      dataType: DATA_TYPE.String,
     },
     {
      name: 'year',
      dataType: DATA_TYPE.String
     },
     {
      name: 'structure',
      dataType: DATA_TYPE.String,
     },
     {
      name: 'corn_unharv',
      dataType: DATA_TYPE.String,
     },
     {
      name: 'corn_harv',
      dataType: DATA_TYPE.String,
     },     
     {
      name: 'corn_yield',
      dataType: DATA_TYPE.String,
     },     
     {
      name: 'corn_yield_field',
      dataType: DATA_TYPE.String,
     },
     {
      name: 'beans_unharv',
      dataType: DATA_TYPE.String,
     },
     {
      name: 'beans_harv',
      dataType: DATA_TYPE.String,
     },     
     {
      name: 'beans_yield',
      dataType: DATA_TYPE.String,
     },
     {
      name: 'beans_yield_field',
      dataType: DATA_TYPE.String,
     },
     {
      name: 'milo_unharv',
      dataType: DATA_TYPE.String,
     },    
     {
      name: 'milo_harv',
      dataType: DATA_TYPE.String,
     },
     {
      name: 'milo_yield',
      dataType: DATA_TYPE.String,
     },
     ,
     {
      name: 'milo_yield_field',
      dataType: DATA_TYPE.String,
     },     
     {
      name: 'wheat_green',
      dataType: DATA_TYPE.String,
     },
     {
      name: 'wheat_harv',
      dataType: DATA_TYPE.String,
     },
     {
      name: 'soil_standing',
      dataType: DATA_TYPE.String,
     },
     {
      name: 'soil_mowed',
      dataType: DATA_TYPE.String,
     },
     {
      name: 'soil_disced',
      dataType: DATA_TYPE.String,
     },
     {
      name: 'yield_score',
      dataType: DATA_TYPE.String,
     },     
    ]
  };


   const dataBase: IDataBase = {
    name: this.dbname,
    tables: [tblWaterManagement,tblWeather,tblWaterFood,tblFoodAvail]
   };
   return dataBase;
  }
 }