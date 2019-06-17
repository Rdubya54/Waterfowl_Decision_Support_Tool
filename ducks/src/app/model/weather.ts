export class IWeather {

    id?: number;
    CA:string;
    date:string;
    area_ice: string;
    ice_thick: string;
    low_temp:string;
    wind_dir:string;
    wind_speed:string;
    river_stage:string;
    other_observations:string;
    sort_time:string
}

export class Weather implements IWeather {
    id: 0;
    CA:"";
    date:"";
    area_ice: "";
    ice_thick: "";
    low_temp:"";
    wind_dir:"";
    wind_speed:"";
    river_stage:"";
    other_observations:"";
    sort_time:"";
}