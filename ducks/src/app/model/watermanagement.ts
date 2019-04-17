export class IWatermanagement {

        id?: number;
        date: string;
        pool: string;
        structure: string;
        elevation: string;
        gate_manipulation:string;
        gate_level:string;
        stoplog_change:string;
        stoplog_level:string;
        duck_numbers:string;
        goose_numbers:string;
        year:string;
        time:string;
        fiscal_year:string;
        notes:string;
        reasons:string;
}

export class Watermanagement implements IWatermanagement {
    id: 0;
    date: '';
    pool: '';
    structure: '';
    elevation: '';
    gate_manipulation:'';
    gate_level:'';
    stoplog_change:'';
    stoplog_level:'';
    duck_numbers:'';
    goose_numbers:'';
    year:'';
    time:'';
    fiscal_year:'';
    notes:'';
    reasons:'';
}