
export enum ChartStyle {
  TAMIL_SOUTH = 'TAMIL_SOUTH',
  ENGLISH_SOUTH = 'ENGLISH_SOUTH',
  ENGLISH_NORTH = 'ENGLISH_NORTH'
}

export enum Language {
  TAMIL = 'ta',
  ENGLISH = 'en'
}

export interface PlanetPosition {
  name: string;
  name_ta: string;
  symbol: string;
  longitude: number;
  sign: number;
  signName: string;
  signName_ta: string;
  degree: number;
  nakshatra: string;
  nakshatra_ta: string;
  pada: number;
  house: number;
  status: string;
  lord: string;
}

export interface DasaPeriod {
  planet: string;
  start: Date;
  end: Date;
  years: number;
  fullYears: number;
  isPartial: boolean;
  bhuktis: {
    planet: string;
    start: Date;
    end: Date;
    years: number;
  }[];
}

export interface Yoga {
  name: string;
  planets: string;
  effect: string;
}

export interface Dosha {
  name: string;
  severity: string;
  house: string | number;
  effect: string;
  remedy: string;
}

export interface PanchangData {
  tithi: string;
  paksha: string;
  nakshatra: string;
  yoga: string;
  karana: string;
  vaara: string;
  rahuKaal: [number, number];
  abhijit: [number, number];
  amritKaal: [number, number];
}

export interface HoroscopeData {
  name: string;
  dob: string;
  tob: string;
  place: string;
  lat: number;
  lng: number;
  timezone: string;
  ayanamsa: number;
  lagna: PlanetPosition;
  planets: PlanetPosition[];
  rasiChart: Record<number, { symbol: string; tamil: string }[]>;
  navamsaChart: Record<number, { symbol: string; tamil: string }[]>;
  panchang: PanchangData;
  dasas: DasaPeriod[];
  yogas: Yoga[];
  doshas: Dosha[];
}

export interface FormInputs {
  name: string;
  dob: string;
  tob: string;
  ampm: string;
  place: string;
  latitude: string;
  longitude: string;
  chartType: ChartStyle;
  language: Language;
}

export interface PlaceSearchResult {
  display_name: string;
  lat: string;
  lon: string;
}
