export class ICropStats {
    id: string;
    Name:string;
    Total_Acres:string;
    Dry:string;
    Sixinch:string;
    Twelveinch:string;
    Eightteeninch:string;
    Flooded:string;
    Crop_array:Object;
}

export class CropStats implements ICropStats {
    id: string;
    Name:string;
    Total_Acres:string;
    Dry:string;
    Sixinch:string;
    Twelveinch:string;
    Eightteeninch:string;
    Flooded:string;
    Crop_array:Object;
}