
export const PLANET_NAMES: Record<string, { en: string; ta: string; symbol: string }> = {
  'Lagna': { en: 'Ascendant', ta: 'லக்னம்', symbol: 'As' },
  'Sun': { en: 'Sun', ta: 'சூரியன்', symbol: '☉' },
  'Moon': { en: 'Moon', ta: 'சந்திரன்', symbol: '☽' },
  'Mars': { en: 'Mars', ta: 'செவ்வாய்', symbol: '♂' },
  'Mercury': { en: 'Mercury', ta: 'புதன்', symbol: '☿' },
  'Jupiter': { en: 'Jupiter', ta: 'குரு', symbol: '♃' },
  'Venus': { en: 'Venus', ta: 'சுக்ரன்', symbol: '♀' },
  'Saturn': { en: 'Saturn', ta: 'சனி', symbol: '♄' },
  'Rahu': { en: 'Rahu', ta: 'ராகு', symbol: '☊' },
  'Ketu': { en: 'Ketu', ta: 'கேது', symbol: '☋' },
};

export const DASA_YEARS: Record<string, number> = { 
  Ketu: 7, Venus: 20, Sun: 6, Moon: 10, Mars: 7, 
  Rahu: 18, Jupiter: 16, Saturn: 19, Mercury: 17 
};

export const DASA_ORDER = ["Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury"];

export const RASHIS_TA = ["மேஷம்", "ரிஷபம்", "மிதுனம்", "கடகம்", "சிம்மம்", "கன்னி", "துலாம்", "விருச்சிகம்", "தனுசு", "மகரம்", "கும்பம்", "மீனம்"];
export const RASHIS_EN = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
export const RASHI_LORDS = ["Mars", "Venus", "Mercury", "Moon", "Sun", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Saturn", "Jupiter"];

export const NAKSHATRAS_TA = ["அசுவினி", "பரணி", "கிருத்திகை", "ரோகிணி", "மிருகசீரிடம்", "திருவாதிரை", "புனர்பூசம்", "பூசம்", "ஆயில்யம்", "மகம்", "பூரம்", "உத்திரம்", "அஸ்தம்", "சித்திரை", "சுவாதி", "விசாகம்", "அனுஷம்", "கேட்டை", "மூலம்", "பூராடம்", "உத்திராடம்", "திருவோணம்", "அவிட்டம்", "சதயம்", "பூரட்டாதி", "உத்திரட்டாதி", "ரேவதி"];

export const TITHIS = ["பிரதமை", "துவிதியை", "திருதியை", "சதுர்த்தி", "பஞ்சமி", "சஷ்டி", "சப்தமி", "அஷ்டமி", "நவமி", "தசமி", "ஏகாதசி", "துவாதசி", "திரயோதசி", "சதுர்தசி", "பூர்ணிமை/அமாவாசை"];
export const YOGAS = ["விஷ்கம்பம்", "பிரீதி", "ஆயுஷ்மான்", "சௌபாக்யம்", "சோபனம்", "அதிகண்டம்", "சுகர்மா", "திருதி", "சூலம்", "கண்டம்", "விருத்தி", "துருவம்", "வியாகாதம்", "ஹர்ஷணம்", "வஜ்ரம்", "சித்தி", "வியதீபாதம்", "வரீயான்", "பரிகம்", "சிவம்", "சித்தம்", "சாத்யம்", "சுபம்", "சுக்லம்", "பிரம்மம்", "இந்திரம்", "வைதிருதி"];
export const KARANAS = ["பவம்", "பாலவம்", "கௌலவம்", "தைதுலம்", "கரம்", "வணிஜம்", "விஷ்டி", "சகுனி", "சதுஷ்பாதம்", "நாகம்", "கிம்ஸ்துக்னம்"];
export const VAARAS = ["ஞாயிறு", "திங்கள்", "செவ்வாய்", "புதன்", "வியாழன்", "வெள்ளி", "சனி"];

export const SIGN_NAMES_EN = RASHIS_EN;
export const SIGN_NAMES_TA = RASHIS_TA;

export const TRANSLATIONS: Record<string, Record<string, string>> = {
  en: {
    title: "CosmicWisdom Horoscope",
    subtitle: "Lord Murugan's Blessings • Thirukanitha Vedic Calculations",
    name: "Full Name",
    dob: "Date of Birth",
    tob: "Time of Birth",
    place: "Birth Place",
    calculate: "Generate Horoscope",
    result_title: "Horoscope Result",
    planet_positions: "Planetary Positions",
    rasi_chart: "Rasi Chart (D1)",
    navamsa_chart: "Navamsa Chart (D9)",
    back: "Modify Details",
    input_summary: "Profile Information",
  },
  ta: {
    title: "CosmicWisdom - திருக்கணித ஜோதிடம்",
    subtitle: "முருகன் அருள் ஜோதிடம் • துல்லியமான கணிப்பு",
    name: "பெயர்",
    dob: "பிறந்த தேதி",
    tob: "பிறந்த நேரம்",
    place: "பிறந்த ஊர்",
    calculate: "ஜாதகம் கணி",
    result_title: "ஜாதக பலன்கள்",
    planet_positions: "கிரக நிலைகள்",
    rasi_chart: "ராசி கட்டம் (D1)",
    navamsa_chart: "நவாம்சம் (D9)",
    back: "திருத்து",
    input_summary: "பிறப்பு விவரங்கள்",
  }
};
