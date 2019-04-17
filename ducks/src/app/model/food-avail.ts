export class IFoodAvail {

    id?: number;
    month: string;
    day: string;
    year: string;
    structure: string;
    corn_unharv:string;
    corn_harv:string;
    corn_yield:string;
    corn_yield_field:string;
    beans_unharv:string;
    beans_harv:string;
    beans_yield:string;
    beans_yield_field:string;
    milo_unharv:string;
    milo_harv:string;
    milo_yield:string;
    milo_yield_field:string;
    wheat_green:string;
    wheat_harv:string;
    soil_standing:string;
    soil_mowed:string;
    soil_disced:string;
    yield_score:string;
}

export class FoodAvail implements IFoodAvail {
    id?: 0;
    month: "";
    day: "";
    year: "";
    structure: "";
    corn_unharv:"";
    corn_harv:"";
    corn_yield:"";
    corn_yield_field:"";
    beans_unharv:"";
    beans_harv:"";
    beans_yield:"";
    beans_yield_field:"";
    milo_unharv:"";
    milo_harv:"";
    milo_yield:"";
    milo_yield_field:"";
    wheat_green:"";
    wheat_harv:"";
    soil_standing:"";
    soil_mowed:"";
    soil_disced:"";
    yield_score:"";
}