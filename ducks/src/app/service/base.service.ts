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
     this.connection.openDb(this.dbname);
    } else {
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
      name: 'WCS',
      dataType: DATA_TYPE.String
     },
     {
      name: 'Elevation',
      dataType: DATA_TYPE.Number,
     },
     {
      name: 'Gate_manipulation',
      dataType: DATA_TYPE.Number,
     },
     {
      name: 'Gate_level',
      dataType: DATA_TYPE.Number,
     },
     {
      name: 'Stoplog_change',
      dataType: DATA_TYPE.Number,
     },
     {
      name: 'Stoplog_level',
      dataType: DATA_TYPE.Number,
     },
     {
      name: 'Duck_numbers',
      dataType: DATA_TYPE.Number,
     },
     {
      name: 'Goose_numbers',
      dataType: DATA_TYPE.Number,
     },
     {
      name: 'Year',
      dataType: DATA_TYPE.Number,
     },
     {
      name: 'Time',
      dataType: DATA_TYPE.Number,
     },
     {
      name: 'Fiscal_year',
      dataType: DATA_TYPE.Number,
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
      dataType: DATA_TYPE.Number,
     },
     {
      name: 'Update_time',
      dataType: DATA_TYPE.Number,
     },
     {
      name:'UID',
      dataType: DATA_TYPE.String,
     },
     {
      name: 'Delete',
      dataType: DATA_TYPE.Number,
     }
    ],
  };
  const tblWeather: ITable = {
    name: 'Daily_Weather_Observations',
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
      //notNull: true,
      dataType: DATA_TYPE.String
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
     },
     {
      name: 'Sort_time',
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
      name: 'CA',
      dataType: DATA_TYPE.String
     },
     {
      name: 'Unit',
      dataType: DATA_TYPE.String,
     },
     {
      name: 'Pool',
      dataType: DATA_TYPE.String
     },
     {
      name: 'WCS',
      dataType: DATA_TYPE.String,
     },
     {
      name: 'Date',
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
      name: 'millet_output',
      dataType: DATA_TYPE.String,
     },
     {
      name: 'foxtail_output',
      dataType: DATA_TYPE.String,
     },
     {
      name: 'rice_cut_output',
      dataType: DATA_TYPE.String,
     },
     {
      name: 'panic_grass_output',
      dataType: DATA_TYPE.String,
     },
     {
      name: 'crabgrass_output',
      dataType: DATA_TYPE.String,
     },
     {
      name: 'sprangletop_output',
      dataType: DATA_TYPE.String,
     },
     {
      name: 'lapathifolium_output',
      dataType: DATA_TYPE.String,
     },
     {
      name: 'pennsylvanicum_output',
      dataType: DATA_TYPE.String,
     },
     {
      name: 'coccineum_output',
      dataType: DATA_TYPE.String,
     },
     {
      name: 'water_pepper_output',
      dataType: DATA_TYPE.String,
     },
     {
      name: 'pigweed_output',
      dataType: DATA_TYPE.String,
     },
     {
      name: 'bidens_output',
      dataType: DATA_TYPE.String,
     },
     {
      name: 'other_seed_output',
      dataType: DATA_TYPE.String,
     },
     {
      name: 'open_water_output',
      dataType: DATA_TYPE.String,
     },
     {
      name: 'recently_disced_output',
      dataType: DATA_TYPE.String,
     },
     {
      name: 'chufa_output',
      dataType: DATA_TYPE.String,
     },
     {
      name: 'redroot_output',
      dataType: DATA_TYPE.String,
     },
     {
      name: 'sedge_output',
      dataType: DATA_TYPE.String,
     },
     {
      name: 'rush_output',
      dataType: DATA_TYPE.String,
     },
     {
      name: 'Sort_time',
      dataType: DATA_TYPE.String,
     }, 
    ]
    };
    const tblGaugeStats: ITable = {
      name: 'Gauge Stats',
      columns: [{
        name: 'id',
        primaryKey: true,
        autoIncrement: true
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
        name: 'WCS',
        dataType: DATA_TYPE.String
       },
       {
        name: 'Gauge',
        dataType: DATA_TYPE.String,
       },
       {
        name: 'Image_Name',
        dataType: DATA_TYPE.String,
       },
       {
        name: 'Crop_Stats',
        dataType: DATA_TYPE.Array,
       }
      ],
    };
    const tblImages: ITable = {
      name: 'Images',
      columns: [{
        name: 'id',
        primaryKey: true,
        autoIncrement: true
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
        name: 'WCS',
        dataType: DATA_TYPE.String
       },
       {
        name: 'Gauge',
        dataType: DATA_TYPE.String,
       },
       {
        name: 'Image_Name',
        dataType: DATA_TYPE.String,
       },
       {
        name: 'Image',
        dataType: DATA_TYPE.Object,
       }
      ],
    };


   const dataBase: IDataBase = {
    name: this.dbname,
    tables: [tblWaterManagement,tblWeather,tblWaterFood,tblFoodAvail,tblGaugeStats,tblImages]
   };
   return dataBase;
  }
 }