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
      name: 'Date',
      //notNull: true,
      dataType: DATA_TYPE.String
     },
     {
      name: 'CA',
      dataType: DATA_TYPE.String,
     },
     {
      name: 'Unit',
      dataType: DATA_TYPE.String
     },
     {
      name: 'Pool',
      dataType: DATA_TYPE.String,
     },
     {
      name: 'Structure',
      dataType: DATA_TYPE.String
     },
     {
      name: 'Elevation',
      dataType: DATA_TYPE.String,
     },
     {
      name: 'Gate_manipulation',
      dataType: DATA_TYPE.String,
     },
     {
      name: 'Gate_level',
      dataType: DATA_TYPE.String,
     },
     {
      name: 'Stoplog_change',
      dataType: DATA_TYPE.String,
     },
     {
      name: 'Stoplog_level',
      dataType: DATA_TYPE.String,
     },
     {
      name: 'Duck_numbers',
      dataType: DATA_TYPE.String,
     },
     {
      name: 'Goose_numbers',
      dataType: DATA_TYPE.String,
     },
     {
      name: 'Year',
      dataType: DATA_TYPE.String,
     },
     {
      name: 'Time',
      dataType: DATA_TYPE.String,
     },
     {
      name: 'Fiscal_year',
      dataType: DATA_TYPE.String,
     },
     {
      name: 'Notes',
      dataType: DATA_TYPE.String,
     },
     {
      name: 'Reasons',
      dataType: DATA_TYPE.String,
     },
     {
      name: 'Sort_time',
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
      name: 'Date',
      //notNull: true,
      dataType: DATA_TYPE.String
     },
     {
      name: 'CA',
      dataType: DATA_TYPE.String
     },
     {
      name: 'Unit',
      dataType: DATA_TYPE.String
     },
     {
      name: 'Pool',
      dataType: DATA_TYPE.String
     },
     {
      name: 'Percent_of_full_pool',
      dataType: DATA_TYPE.String,
     },
     {
      name: 'Less_than_six',
      dataType: DATA_TYPE.String,
     },
     {
      name: 'Seven_to_twelve',
      dataType: DATA_TYPE.String,
     },
     {
      name: 'Thirteen_or_more',
      dataType: DATA_TYPE.String,
     },
     {
      name: 'Habitat_standing',
      dataType: DATA_TYPE.String,
     },
     {
      name: 'Habitat_mowed',
      dataType: DATA_TYPE.String,
     },    
     {
      name: 'Habitat_disced',
      dataType: DATA_TYPE.String,
     },
     {
      name: 'Habitat_unharv_corn',
      dataType: DATA_TYPE.String,
     },
     {
      name: 'Habitat_harv_corn',
      dataType: DATA_TYPE.String,
     },
     {
      name: 'Habitat_unharv_milo',
      dataType: DATA_TYPE.String,
     },     
     {
      name: 'Habitat_harv_milo',
      dataType: DATA_TYPE.String,
     },
     {
      name: 'Habitat_unharv_beans',
      dataType: DATA_TYPE.String,
     },
     {
      name: 'Habitat_harv_beans',
      dataType: DATA_TYPE.String,
     },
     {
      name: 'Habitat_browse',
      dataType: DATA_TYPE.String,
     },
     ,
     {
      name: 'Ice_standing',
      dataType: DATA_TYPE.String,
     },     
     {
      name: 'Ice_mowed',
      dataType: DATA_TYPE.String,
     },
     {
      name: 'Ice_descend',
      dataType: DATA_TYPE.String,
     },
     {
      name: 'Ice_unharv_corn',
      dataType: DATA_TYPE.String,
     },
     {
      name: 'Ice_harv_corn',
      dataType: DATA_TYPE.String,
     },     
     {
      name: 'Ice_unharv_milo',
      dataType: DATA_TYPE.String,
     },
     {
      name: 'Ice_harv_milo',
      dataType: DATA_TYPE.String,
     },
     {
      name: 'Ice_unharv_beans',
      dataType: DATA_TYPE.String,
     },
     {
      name: 'Ice_harv_beans',
      dataType: DATA_TYPE.String,
     },     
     {
      name: 'Ice_unharv_beans',
      dataType: DATA_TYPE.String,
     },
     {
      name: 'Ice_browse',
      dataType: DATA_TYPE.String,
     },
     {
      name: 'Notes',
      dataType: DATA_TYPE.String,
     },
     {
      name: 'Actions',
      dataType: DATA_TYPE.String,
     },    
     {
      name: 'Response',
      dataType: DATA_TYPE.String,
     },
     {
      name: 'Year',
      dataType: DATA_TYPE.String,
     },
     {
      name: 'Time',
      dataType: DATA_TYPE.String,
     },
     {
      name: 'Fiscal_year',
      dataType: DATA_TYPE.String,
     },
     {
      name: 'Sort_time',
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