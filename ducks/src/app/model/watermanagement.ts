export class IWatermanagement {
        id?: number;
        CA:string;
        Unit:string;
        Pool:string;
        WCS:string;
        Date: string;
        Elevation: number;
        Gate_manipulation:number;
        Gate_level:number;
        Stoplog_change:number;
        Stoplog_level:number;
        Duck_numbers:number;
        Goose_numbers:number;
        Month:number;
        Day:number;
        Year:number;
        Time:string;
        Fiscal_year:number;
        Notes:string;
        Reasons:string;
        Sort_time:number;
        Update_time:number;
        UID:string;
        Delete:number;
}

export class Watermanagement implements IWatermanagement {
    id: 0;
    CA:'';
    Unit:'';
    Pool:'';
    WCS:'';
    Date:'';
    Elevation: null;
    Gate_manipulation:null;
    Gate_level:null;
    Stoplog_change:null;
    Stoplog_level:null;
    Duck_numbers:null;
    Goose_numbers:null;
    Month:null;
    Day:null;
    Year:null;
    Time:null;
    Fiscal_year:null;
    Notes:'';
    Reasons:'';
    Sort_time:null;
    Update_time:null;
    UID:'';
    Delete:0;
}