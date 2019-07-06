export class IGaugeStats {
    id: string;
    CA:string;
    Unit:string;
    Pool:string;
    Structure:string;
    Gauge:string;
    Image_Name:string;
    Image:object;
}

export class GaugeStats implements IGaugeStats {
    id: string;
    CA:string;
    Unit:string;
    Pool:string;
    Gauge:string;
    Structure:string;
    Image_Name:string;
    Image:object;
}