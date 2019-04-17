export class IWeather {

    id?: number;
    month: string;
    day: string;
    area_ice: string;
    ice_thick: string;
    low_temp:string;
    wind_dir:string;
    wind_speed:string;
    river_stage:string;
    other_observations:string;
    year:string;
}

export class Weather implements IWeather {
    id: 0;
    month: "";
    day: "";
    area_ice: "";
    ice_thick: "";
    low_temp:"";
    wind_dir:"";
    wind_speed:"";
    river_stage:"";
    other_observations:"";
    year:"";
}