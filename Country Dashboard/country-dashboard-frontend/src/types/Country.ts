export interface Country {
    name: {common: string};
    capital?: string[];
    population: number;
    region: string;
    flags: {svg: string};
    currencies?: object;
    languages?: object;
    timezones?: string[];
    latlng?: number[];
}