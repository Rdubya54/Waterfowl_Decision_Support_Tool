export class IWatermanagement {

        id?: number;
        CA:string;
        Unit:string;
        Pool:string;
        WCS:string;
        Date: string;
        Elevation: string;
        Gate_manipulation:string;
        Gate_level:string;
        Stoplog_change:string;
        Stoplog_level:string;
        Duck_numbers:string;
        Goose_numbers:string;
        Year:string;
        Time:string;
        Fiscal_year:string;
        Notes:string;
        Reasons:string;
        Sort_time:string;
        Update_time:string;
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
    Elevation: '';
    Gate_manipulation:'';
    Gate_level:'';
    Stoplog_change:'';
    Stoplog_level:'';
    Duck_numbers:'';
    Goose_numbers:'';
    Year:'';
    Time:'';
    Fiscal_year:'';
    Notes:'';
    Reasons:'';
    Sort_time:'';
    Update_time:'';
    UID:'';
    Delete:0;
}