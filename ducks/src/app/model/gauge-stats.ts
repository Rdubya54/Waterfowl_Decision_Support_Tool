export class IGaugeStats {
    id: string;
    CA:string;
    Unit:string;
    Pool:string;
    WCS:string;
    Gauge:string;
    Image_Name:string;
    Image:object;
    Total_Acres:string;
    Dry:string;
    Sixinch:string;
    Twelveinch:string;
    Eightteeninch:string;
    Flooded:string;
    Crop_Stats:Array<Object>;
}

export class GaugeStats implements IGaugeStats {
    id: string;
    CA:string;
    Unit:string;
    Pool:string;
    Gauge:string;
    WCS:string;
    Image_Name:string;
    Image:object;
    Total_Acres:string;
    Dry:string;
    Sixinch:string;
    Twelveinch:string;
    Eightteeninch:string;
    Flooded:string;
    Crop_Stats:Array<Object>;
}