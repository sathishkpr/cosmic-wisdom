
import React, { useState, useRef, useEffect } from 'react';
import { FormInputs, ChartStyle, Language, PlaceSearchResult } from '../types';
import { TRANSLATIONS } from '../constants';

interface HoroscopeFormProps {
  onSubmit: (data: FormInputs) => void;
  isLoading: boolean;
}

interface FormErrors {
  name?: string;
  dob?: string;
  tob?: string;
  place?: string;
}

const HoroscopeForm: React.FC<HoroscopeFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<FormInputs>({
    name: '',
    dob: '',
    tob: '12:00',
    ampm: 'AM',
    place: '',
    latitude: '13.08',
    longitude: '80.27',
    chartType: ChartStyle.TAMIL_SOUTH,
    language: Language.TAMIL
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [placeQuery, setPlaceQuery] = useState('');
  const [searchResults, setSearchResults] = useState<PlaceSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showManualCoords, setShowManualCoords] = useState(false);
  const searchTimeoutRef = useRef<number | null>(null);

  const t = TRANSLATIONS[formData.language];

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) window.clearTimeout(searchTimeoutRef.current);
    };
  }, []);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    const today = new Date().toISOString().split('T')[0];

    if (!formData.name || formData.name.trim().length < 2) {
      newErrors.name = formData.language === Language.TAMIL 
        ? "பெயர் தேவை / Name is required" 
        : "Name is required / பெயர் தேவை";
    }

    if (!formData.dob) {
      newErrors.dob = formData.language === Language.TAMIL
        ? "தேதி தேவை / Date is required"
        : "Date is required / தேதி தேவை";
    } else if (formData.dob > today) {
      newErrors.dob = formData.language === Language.TAMIL
        ? "தவறான தேதி / Invalid date"
        : "Invalid date / தவறான தேதி";
    }

    if (!formData.place || !formData.latitude || !formData.longitude) {
      newErrors.place = formData.language === Language.TAMIL
        ? "ஊரைத் தேர்ந்தெடுக்கவும் / Select place"
        : "Select place / ஊரைத் தேர்ந்தெடுக்கவும்";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSearch = (val: string) => {
    setPlaceQuery(val);
    setErrors(prev => ({ ...prev, place: undefined }));
    
    if (searchTimeoutRef.current) {
      window.clearTimeout(searchTimeoutRef.current);
    }

    if (val.trim().length < 3) {
      setSearchResults([]);
      return;
    }

    // Debounce to respect Nominatim usage policy and prevent UI lag
    searchTimeoutRef.current = window.setTimeout(async () => {
      setIsSearching(true);
      try {
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(val)}&limit=8&addressdetails=1`;
        
        const resp = await fetch(url, {
          method: 'GET',
          mode: 'cors',
          headers: {
            'Accept': 'application/json',
          }
        });
        
        if (!resp.ok) {
          throw new Error(`Service Error: ${resp.status}`);
        }
        
        const data = await resp.json();
        setSearchResults(data);
        
        if (data.length === 0) {
           setErrors(prev => ({ 
             ...prev, 
             place: formData.language === Language.TAMIL ? "ஊர் கிடைக்கவில்லை / Place not found" : "Place not found / ஊர் கிடைக்கவில்லை" 
           }));
        }
      } catch (e: any) {
        console.error("City search error:", e);
        const errorMsg = e.message.includes('fetch') 
          ? (formData.language === Language.TAMIL ? "சேவை பிழை (Service Blocked). கைகளால் உள்ளிடவும் (Try manual entry)." : "Service Blocked. Please try manual coordinate entry.")
          : (formData.language === Language.TAMIL ? "தேடல் பிழை / Search error" : "Search service error");
        
        setErrors(prev => ({ ...prev, place: errorMsg }));
        setShowManualCoords(true);
      } finally {
        setIsSearching(false);
      }
    }, 1000); 
  };

  const selectPlace = (p: PlaceSearchResult) => {
    setFormData(prev => ({
      ...prev,
      place: p.display_name,
      latitude: p.lat,
      longitude: p.lon
    }));
    const shortName = p.display_name.split(',')[0];
    setPlaceQuery(shortName);
    setSearchResults([]);
    setErrors(prev => ({ ...prev, place: undefined }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-[#fffdf5] rounded-3xl shadow-[0_20px_50px_rgba(120,53,15,0.15)] border-2 border-amber-100 relative">
      <div className="bg-gradient-to-br from-red-950 via-red-900 to-amber-950 p-10 text-white text-center relative overflow-hidden rounded-t-[1.3rem]">
        <div className="relative z-10">
          <div className="text-4xl mb-4 text-amber-400 drop-shadow-sm">🔱</div>
          <h1 className="text-3xl font-bold tracking-tight tamil-font text-amber-50">{t.title}</h1>
          <p className="mt-2 text-amber-200/80 font-medium text-sm uppercase tracking-widest">{t.subtitle}</p>
        </div>
        <div className="absolute top-0 right-0 p-4 text-8xl opacity-10 pointer-events-none mix-blend-overlay">🦚</div>
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-50"></div>
      </div>

      <form onSubmit={handleSubmit} className="p-10 space-y-8 bg-[#fffdf5] rounded-b-3xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-6">
            <div className="group">
              <label className="block text-[10px] font-black text-red-900 uppercase tracking-widest mb-2 opacity-70">👤 {t.name}</label>
              <input 
                type="text" 
                value={formData.name} 
                onChange={e => {
                  setFormData({...formData, name: e.target.value});
                  if (errors.name) setErrors({...errors, name: undefined});
                }} 
                placeholder="Ex: Arul Selvam"
                className={`w-full px-5 py-3.5 border-b-2 bg-amber-50/50 ${errors.name ? 'border-red-400' : 'border-amber-200 group-focus-within:border-red-600'} outline-none transition-all placeholder-amber-900/20 text-amber-950`}
              />
              {errors.name && <p className="mt-2 text-[10px] font-bold text-red-600 uppercase tracking-tighter">{errors.name}</p>}
            </div>
            
            <div className="group">
              <label className="block text-[10px] font-black text-red-900 uppercase tracking-widest mb-2 opacity-70">📅 {t.dob}</label>
              <input 
                type="date" 
                value={formData.dob} 
                onChange={e => {
                  setFormData({...formData, dob: e.target.value});
                  if (errors.dob) setErrors({...errors, dob: undefined});
                }} 
                className={`w-full px-5 py-3.5 border-b-2 bg-amber-50/50 ${errors.dob ? 'border-red-400' : 'border-amber-200 group-focus-within:border-red-600'} outline-none transition-all text-amber-950`}
              />
              {errors.dob && <p className="mt-2 text-[10px] font-bold text-red-600 uppercase tracking-tighter">{errors.dob}</p>}
            </div>

            <div className="flex gap-6">
              <div className="flex-1 group">
                <label className="block text-[10px] font-black text-red-900 uppercase tracking-widest mb-2 opacity-70">⏰ {t.tob}</label>
                <input 
                  type="time" 
                  value={formData.tob} 
                  onChange={e => {
                    setFormData({...formData, tob: e.target.value});
                  }} 
                  className="w-full px-5 py-3.5 border-b-2 bg-amber-50/50 border-amber-200 focus:border-red-600 outline-none transition-all text-amber-950"
                />
              </div>
              <div className="w-28 group">
                <label className="block text-[10px] font-black text-red-900 uppercase tracking-widest mb-2 opacity-70">MERIDIEM</label>
                <select value={formData.ampm} onChange={e => setFormData({...formData, ampm: e.target.value})} className="w-full px-4 py-3.5 border-b-2 bg-amber-50/50 border-amber-200 focus:border-red-600 outline-none appearance-none cursor-pointer text-sm text-amber-950">
                  <option>AM</option><option>PM</option>
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="relative group">
              <label className="block text-[10px] font-black text-red-900 uppercase tracking-widest mb-2 opacity-70">📍 {t.place}</label>
              <input 
                type="text" 
                value={placeQuery} 
                onChange={e => handleSearch(e.target.value)}
                placeholder="Search city..."
                className={`w-full px-5 py-3.5 border-b-2 bg-amber-50/50 ${errors.place ? 'border-red-400' : 'border-amber-200 focus:border-red-600'} outline-none transition-all text-amber-950 placeholder-amber-900/20`}
              />
              {isSearching && <div className="absolute right-4 top-10 animate-spin text-amber-600 text-xs">⏳</div>}
              {searchResults.length > 0 && (
                <div className="absolute z-20 w-full mt-1 bg-white border border-amber-100 rounded-xl shadow-2xl max-h-60 overflow-y-auto">
                  {searchResults.map((p, i) => (
                    <button key={i} type="button" onClick={() => selectPlace(p)} className="w-full text-left px-4 py-3 hover:bg-amber-50 text-xs border-b border-amber-50 last:border-none text-amber-900">
                      {p.display_name}
                    </button>
                  ))}
                </div>
              )}
              {errors.place && <p className="mt-2 text-[10px] font-bold text-red-600 uppercase tracking-tighter">{errors.place}</p>}
              
              <button 
                type="button" 
                onClick={() => setShowManualCoords(!showManualCoords)}
                className="mt-4 text-[9px] font-black text-amber-900/40 uppercase tracking-widest hover:text-red-800 transition-colors"
              >
                {showManualCoords ? "✕ Hide Manual Coordinates" : "⚙ Use Manual Coordinates"}
              </button>

              {showManualCoords && (
                <div className="grid grid-cols-2 gap-4 mt-4 animate-in fade-in slide-in-from-top-2">
                  <div>
                    <label className="block text-[9px] font-bold text-amber-800/60 mb-1">LATITUDE</label>
                    <input 
                      type="text" 
                      value={formData.latitude} 
                      onChange={e => setFormData({...formData, latitude: e.target.value})}
                      className="w-full px-4 py-2 text-xs border border-amber-200 rounded-lg outline-none focus:border-red-600 bg-amber-50/50 text-amber-950"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-amber-800/60 mb-1">LONGITUDE</label>
                    <input 
                      type="text" 
                      value={formData.longitude} 
                      onChange={e => setFormData({...formData, longitude: e.target.value})}
                      className="w-full px-4 py-2 text-xs border border-amber-200 rounded-lg outline-none focus:border-red-600 bg-amber-50/50 text-amber-950"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="group">
                <label className="block text-[10px] font-black text-red-900 uppercase tracking-widest mb-2 opacity-70">CHART STYLE</label>
                <select 
                  value={formData.chartType} 
                  onChange={e => setFormData({...formData, chartType: e.target.value as ChartStyle})}
                  className="w-full px-4 py-3.5 border-b-2 bg-amber-50/50 border-amber-200 focus:border-red-600 outline-none appearance-none cursor-pointer text-sm text-amber-950"
                >
                  <option value={ChartStyle.TAMIL_SOUTH}>South Indian (Tamil)</option>
                </select>
              </div>
              <div className="group">
                <label className="block text-[10px] font-black text-red-900 uppercase tracking-widest mb-2 opacity-70">LANGUAGE</label>
                <select 
                  value={formData.language} 
                  onChange={e => setFormData({...formData, language: e.target.value as Language})}
                  className="w-full px-4 py-3.5 border-b-2 bg-amber-50/50 border-amber-200 focus:border-red-600 outline-none appearance-none cursor-pointer text-sm text-amber-950"
                >
                  <option value={Language.TAMIL}>தமிழ்</option>
                  <option value={Language.ENGLISH}>English</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <button 
          type="submit" 
          disabled={isLoading}
          className="w-full py-5 bg-gradient-to-r from-red-900 to-amber-900 text-amber-50 rounded-2xl font-black uppercase tracking-[0.3em] shadow-2xl shadow-red-900/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-4 border border-red-800"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-red-200/30 border-t-amber-400 rounded-full animate-spin"></div>
              <span>Syncing with Cosmos...</span>
            </>
          ) : (
            <>
              <span className="text-xl">🕉</span>
              <span>{t.calculate}</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default HoroscopeForm;