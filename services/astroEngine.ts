
import { 
  PlanetPosition, HoroscopeData, FormInputs, 
  PanchangData, DasaPeriod, Yoga, Dosha 
} from '../types';
import { 
  PLANET_NAMES, DASA_ORDER, DASA_YEARS, RASHIS_TA, RASHIS_EN, RASHI_LORDS, 
  NAKSHATRAS_TA, TITHIS, YOGAS, KARANAS, VAARAS 
} from '../constants';

const NAKSHATRA_LORDS = DASA_ORDER.concat(DASA_ORDER, DASA_ORDER);
const DAYS_PER_YEAR = 365.2425;
const NAKSHATRA_SPAN = 360 / 27;

function toJulianDay(y: number, m: number, d: number, h: number, min: number) {
    if (m <= 2) { y--; m += 12; }
    const A = Math.floor(y / 100), B = 2 - A + Math.floor(A / 4);
    return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + d + B - 1524.5 + (h + min / 60) / 24;
}

function getLahiriAyanamsa(jd: number) {
    const T = (jd - 2451545) / 36525;
    const baseAyanamsa = 23.692;
    const precessionRate = 1.396971;
    const acceleration = 0.000308;
    return baseAyanamsa + precessionRate * T + acceleration * T * T;
}

function getSunLongitude(jd: number) {
    const T = (jd - 2451545) / 36525;
    let L = 280.46646 + 36000.76983 * T, M = (357.52911 + 35999.05029 * T) * Math.PI / 180;
    const C = 1.914602 * Math.sin(M) + 0.019993 * Math.sin(2 * M);
    return ((L + C) % 360 + 360) % 360;
}

function getMoonLongitude(jd: number) {
    const T = (jd - 2451545.0) / 36525.0;
    const Lp = (218.3164477 + 481267.88123421 * T) * Math.PI / 180;
    const D = (297.8501921 + 445267.1114034 * T) * Math.PI / 180;
    const M = (357.5291092 + 35999.0502909 * T) * Math.PI / 180;
    const Mp = (134.9633964 + 477198.8675055 * T) * Math.PI / 180;
    const F = (93.2720950 + 483202.0175233 * T) * Math.PI / 180;
    const E = 1 - 0.002516 * T;

    let sumL = 6.288774 * Math.sin(Mp);
    sumL += 1.274027 * Math.sin(2*D - Mp);
    sumL += 0.658314 * Math.sin(2*D);
    sumL += 0.213618 * Math.sin(2*Mp);
    sumL -= 0.185116 * E * Math.sin(M);
    sumL -= 0.114332 * Math.sin(2*F);
    
    let moonLon = Lp * 180 / Math.PI + sumL;
    return ((moonLon % 360) + 360) % 360;
}

function calculateAscendant(jd: number, lat: number, lon: number) {
    const T = (jd - 2451545) / 36525;
    let GMST = (280.46061837 + 360.98564736629 * (jd - 2451545)) % 360;
    const LST = (GMST + lon) % 360, eps = (23.439291 - 0.0130042 * T) * Math.PI / 180;
    const lstR = LST * Math.PI / 180, latR = lat * Math.PI / 180;
    let asc = Math.atan2(Math.cos(lstR), -(Math.sin(lstR) * Math.cos(latR) - Math.tan(eps) * Math.sin(latR))) * 180 / Math.PI;
    return asc < 0 ? asc + 360 : asc;
}

const getRashi = (lon: number) => {
    const idx = Math.floor(((lon % 360) + 360) % 360 / 30) % 12;
    return { 
        name: RASHIS_TA[idx], nameEn: RASHIS_EN[idx], index: idx, 
        degree: ((lon % 360) + 360) % 360 % 30, lord: RASHI_LORDS[idx]
    };
};

const getNakshatra = (lon: number) => {
    const normalizedLon = ((lon % 360) + 360) % 360;
    const idx = Math.floor(normalizedLon / NAKSHATRA_SPAN) % 27;
    const pada = Math.floor((normalizedLon % NAKSHATRA_SPAN) / (NAKSHATRA_SPAN / 4)) + 1;
    return { name: NAKSHATRAS_TA[idx], index: idx, pada, lord: NAKSHATRA_LORDS[idx] };
};

const getNavamsaRashi = (lon: number) => {
    const normalizedLon = ((lon % 360) + 360) % 360;
    const rashiIdx = Math.floor(normalizedLon / 30);
    const degInRashi = normalizedLon % 30;
    const navamsaPada = Math.floor(degInRashi / (30/9));
    const startSigns = [0, 9, 6, 3];
    const navamsaIdx = (startSigns[rashiIdx % 4] + navamsaPada) % 12;
    return { name: RASHIS_TA[navamsaIdx], index: navamsaIdx };
};

function addYearsUTC(date: Date, years: number) {
    return new Date(date.getTime() + years * DAYS_PER_YEAR * 86400000);
}

function calculateBhuktis(mahadasaPlanet: string, startDate: Date, mahadasaYears: number, fullYearsTotal: number | null = null) {
    const bhuktis = [];
    const startIdx = DASA_ORDER.indexOf(mahadasaPlanet);
    let cursor = startDate;
    const baseYears = fullYearsTotal || mahadasaYears;

    for (let i = 0; i < 9; i++) {
        const planet = DASA_ORDER[(startIdx + i) % 9];
        const years = (baseYears * DASA_YEARS[planet]) / 120;
        const end = addYearsUTC(cursor, years);
        bhuktis.push({ planet, start: new Date(cursor), end: new Date(end), years });
        cursor = end;
    }
    return bhuktis;
}

function detectYogas(planets: Record<string, number>, lagnaIdx: number): Yoga[] {
    const yogas: Yoga[] = [];
    const moonR = getRashi(planets.Moon).index;
    const jupR = getRashi(planets.Jupiter).index;
    const sunR = getRashi(planets.Sun).index;
    const mercR = getRashi(planets.Mercury).index;

    if (Math.abs(jupR - moonR) % 3 === 0) {
        yogas.push({ name: "கஜகேசரி யோகம்", planets: "குரு, சந்திரன்", effect: "Fame, wealth, and high intelligence." });
    }
    if (sunR === mercR) {
        yogas.push({ name: "புதாதித்ய யோகம்", planets: "சூரியன், புதன்", effect: "Skill in arts and communication." });
    }
    return yogas.length > 0 ? yogas : [{ name: "சாமான்ய யோகம்", planets: "General", effect: "Balanced life." }];
}

function detectDoshas(planets: Record<string, number>, lagnaIdx: number): Dosha[] {
    const doshas: Dosha[] = [];
    const marsH = ((getRashi(planets.Mars).index - lagnaIdx + 12) % 12) + 1;
    if ([1, 2, 4, 7, 8, 12].includes(marsH)) {
        doshas.push({ name: "குஜ தோஷம்", severity: "Moderate", house: marsH, effect: "Marital delays.", remedy: "Mangal Shanti." });
    }
    return doshas;
}

export const computeHoroscope = async (inputs: FormInputs): Promise<HoroscopeData> => {
    const [d, m, y] = inputs.dob.split('-').map(Number);
    const [h, min] = inputs.tob.split(':').map(Number);
    let h24 = h;
    if (inputs.ampm === 'PM' && h !== 12) h24 += 12;
    if (inputs.ampm === 'AM' && h === 12) h24 = 0;

    const lat = parseFloat(inputs.latitude);
    const lon = parseFloat(inputs.longitude);
    const IST_OFFSET = 5.5;
    const jd = toJulianDay(y, m, d, h24 - IST_OFFSET, min);
    const ayanamsa = getLahiriAyanamsa(jd);

    const planetLons: Record<string, number> = {
        Sun: (getSunLongitude(jd) - ayanamsa + 360) % 360,
        Moon: (getMoonLongitude(jd) - ayanamsa + 360) % 360,
        Rahu: ((125.0445 - 0.05295376 * (jd - 2451545)) - ayanamsa + 360) % 360,
    };
    planetLons.Ketu = (planetLons.Rahu + 180) % 360;
    // Proxies for others for demo
    ['Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'].forEach(p => planetLons[p] = (Math.random() * 360));
    const ascSid = (calculateAscendant(jd, lat, lon) - ayanamsa + 360) % 360;
    
    const lagnaR = getRashi(ascSid);
    const moonN = getNakshatra(planetLons.Moon);

    const processedPlanets = Object.entries(planetLons).map(([name, lon]) => {
        const r = getRashi(lon);
        const n = getNakshatra(lon);
        const house = ((r.index - lagnaR.index + 12) % 12) + 1;
        return {
            name, name_ta: PLANET_NAMES[name].ta, symbol: PLANET_NAMES[name].symbol,
            longitude: lon, sign: r.index, signName: r.nameEn, signName_ta: r.name,
            degree: Number(r.degree.toFixed(2)), nakshatra: n.name, nakshatra_ta: n.name,
            pada: n.pada, house, status: "", lord: PLANET_NAMES[r.lord]?.en || r.lord
        };
    });

    const lagna: PlanetPosition = {
        name: 'Lagna', name_ta: PLANET_NAMES.Lagna.ta, symbol: PLANET_NAMES.Lagna.symbol,
        longitude: ascSid, sign: lagnaR.index, signName: lagnaR.nameEn, signName_ta: lagnaR.name,
        degree: Number(lagnaR.degree.toFixed(2)), nakshatra: getNakshatra(ascSid).name,
        nakshatra_ta: getNakshatra(ascSid).name, pada: getNakshatra(ascSid).pada, house: 1, status: "", lord: ""
    };

    const birthUtc = new Date(Date.UTC(y, m - 1, d, h24, min) - (5.5 * 3600000));
    const firstLord = DASA_ORDER[moonN.index % 9];
    const remYears = DASA_YEARS[firstLord] * (1 - ( (planetLons.Moon % NAKSHATRA_SPAN) / NAKSHATRA_SPAN ));
    
    const dasaTimeline: DasaPeriod[] = [{
        planet: firstLord, start: birthUtc, end: addYearsUTC(birthUtc, remYears),
        years: remYears, fullYears: DASA_YEARS[firstLord], isPartial: true,
        bhuktis: calculateBhuktis(firstLord, birthUtc, remYears, DASA_YEARS[firstLord])
    }];

    const rasiChart: Record<number, any> = {};
    [lagna, ...processedPlanets].forEach(p => {
        const h = p.house;
        if (!rasiChart[h]) rasiChart[h] = [];
        rasiChart[h].push({ symbol: p.symbol, tamil: p.name_ta });
    });

    return {
        name: inputs.name, dob: inputs.dob, tob: `${inputs.tob} ${inputs.ampm}`, place: inputs.place,
        lat, lng: lon, timezone: "IST", ayanamsa, lagna, planets: processedPlanets,
        rasiChart, navamsaChart: {}, // Simplified
        panchang: {
            tithi: TITHIS[Math.floor(((planetLons.Moon - planetLons.Sun + 360) % 360) / 12) % 15],
            paksha: ((planetLons.Moon - planetLons.Sun + 360) % 360) < 180 ? "சுக்ல பக்ஷம்" : "கிருஷ்ண பக்ஷம்",
            nakshatra: moonN.name, yoga: YOGAS[Math.floor(((planetLons.Sun + planetLons.Moon) % 360) / (360/27)) % 27],
            karana: KARANAS[Math.floor(((planetLons.Moon - planetLons.Sun + 360) % 360) / 6) % 11],
            vaara: VAARAS[birthUtc.getUTCDay()],
            rahuKaal: [15, 16.5], abhijit: [12, 12.8], amritKaal: [9, 10.5]
        },
        dasas: dasaTimeline, yogas: detectYogas(planetLons, lagnaR.index), doshas: detectDoshas(planetLons, lagnaR.index)
    };
};
