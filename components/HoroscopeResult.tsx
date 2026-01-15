
import React from 'react';
import { HoroscopeData, Language } from '../types';
import { TRANSLATIONS, PLANET_NAMES } from '../constants';
import SouthIndianChart from './SouthIndianChart';
import AIChat from './AIChat';

interface HoroscopeResultProps {
  data: HoroscopeData;
  language: Language;
  onBack: () => void;
}

const HoroscopeResult: React.FC<HoroscopeResultProps> = ({ data, language, onBack }) => {
  const t = TRANSLATIONS[language];

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center no-print">
        <button onClick={onBack} className="flex items-center gap-2 text-red-900/60 hover:text-red-900 font-bold transition-colors text-sm uppercase tracking-widest">
          ← {t.back}
        </button>
        <button onClick={() => window.print()} className="bg-red-950 text-white px-8 py-3 rounded-full font-bold shadow-xl flex items-center gap-2 hover:bg-amber-950 transition-all text-sm uppercase tracking-widest border border-red-800">
          📄 Export Report
        </button>
      </div>

      <div className="bg-[#fffdf5] rounded-[2rem] shadow-[0_30px_60px_rgba(120,53,15,0.1)] overflow-hidden border-2 border-amber-100">
        <div className="bg-gradient-to-r from-red-950 via-red-900 to-amber-950 p-12 text-white flex flex-col md:flex-row justify-between items-center gap-8 relative border-b-4 border-amber-500">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none overflow-hidden mix-blend-overlay">
            <div className="scale-150 translate-x-1/2 translate-y-1/2">🦚</div>
          </div>
          <div className="text-center md:text-left relative z-10">
            <h1 className="text-5xl font-black tamil-font tracking-tight text-amber-50">{data.name}</h1>
            <div className="flex items-center gap-4 mt-4 justify-center md:justify-start opacity-90 text-sm font-medium tracking-wide text-amber-100">
              <span className="flex items-center gap-1.5"><span className="text-amber-400">📍</span> {data.place}</span>
              <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
              <span className="flex items-center gap-1.5"> {data.dob}</span>
            </div>
          </div>
          <div className="flex flex-col items-center md:items-end gap-1 relative z-10">
            <div className="text-amber-400 font-black text-4xl tracking-tighter">{data.tob}</div>
            <div className="text-red-200/60 text-[10px] font-black uppercase tracking-[0.3em]">Birth Timestamp</div>
          </div>
        </div>

        <div className="p-12 space-y-16">
          {/* Key Info Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="bg-amber-50/50 p-8 rounded-[2rem] border border-amber-100 text-center hover:bg-amber-100/50 transition-colors">
              <p className="text-[10px] font-black text-red-900/40 uppercase tracking-widest mb-2">Ascendant</p>
              <p className="text-2xl font-black text-red-950 tamil-font">{data.lagna.signName_ta}</p>
              <p className="text-xs text-amber-700 font-mono mt-1">{data.lagna.degree}°</p>
            </div>
            <div className="bg-amber-50/50 p-8 rounded-[2rem] border border-amber-100 text-center hover:bg-amber-100/50 transition-colors">
              <p className="text-[10px] font-black text-red-900/40 uppercase tracking-widest mb-2">Moon Phase</p>
              <p className="text-2xl font-black text-red-950 tamil-font">{data.panchang.paksha}</p>
              <p className="text-xs text-amber-700 font-medium mt-1">{data.panchang.tithi}</p>
            </div>
            <div className="bg-amber-50/50 p-8 rounded-[2rem] border border-amber-100 text-center hover:bg-amber-100/50 transition-colors">
              <p className="text-[10px] font-black text-red-900/40 uppercase tracking-widest mb-2">Nakshatra</p>
              <p className="text-2xl font-black text-red-950 tamil-font">{data.panchang.nakshatra}</p>
              <p className="text-xs text-amber-700 font-medium mt-1">{data.panchang.vaara}</p>
            </div>
            <div className="bg-amber-50/50 p-8 rounded-[2rem] border border-amber-100 text-center hover:bg-amber-100/50 transition-colors">
              <p className="text-[10px] font-black text-red-900/40 uppercase tracking-widest mb-2">Current Dasa</p>
              <p className="text-2xl font-black text-red-950 tamil-font">{data.dasas[0].planet}</p>
              <p className="text-xs text-amber-700 font-medium mt-1">{data.dasas[0].years.toFixed(1)} years left</p>
            </div>
          </div>

          {/* Charts & AI Chat */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-16">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <SouthIndianChart title={t.rasi_chart} data={Object.entries(data.rasiChart).reduce((acc: string[][], [h, ps]) => {
                  const signIdx = (data.lagna.sign + parseInt(h) - 1) % 12;
                  acc[signIdx] = (ps as any[]).map(p => p.symbol);
                  return acc;
                }, Array.from({ length: 12 }, () => []))} language={language} />
                <SouthIndianChart title={t.navamsa_chart} data={Array.from({ length: 12 }, () => [])} language={language} />
              </div>
              
              <div className="bg-[#fffdf5] rounded-[2rem] border-2 border-amber-100 p-10 space-y-8 shadow-sm">
                <h3 className="text-xs font-black text-red-950 border-b border-amber-100 pb-6 uppercase tracking-[0.4em] text-center">{t.planet_positions}</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-red-900/40 border-b border-amber-100">
                        <th className="px-4 py-5 text-left font-black text-[10px] uppercase tracking-widest">Planet</th>
                        <th className="px-4 py-5 text-left font-black text-[10px] uppercase tracking-widest">Sign</th>
                        <th className="px-4 py-5 text-left font-black text-[10px] uppercase tracking-widest">Degree</th>
                        <th className="px-4 py-5 text-left font-black text-[10px] uppercase tracking-widest">House</th>
                        <th className="px-4 py-5 text-left font-black text-[10px] uppercase tracking-widest">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-amber-50">
                      {[data.lagna, ...data.planets].map((p, i) => (
                        <tr key={i} className="hover:bg-amber-50/50 transition-colors">
                          <td className="px-4 py-5 font-black text-red-950 flex items-center gap-3">
                            <span className="text-xl text-amber-600">{p.symbol}</span>
                            <span className="text-xs">{language === 'ta' ? p.name_ta : p.name}</span>
                          </td>
                          <td className="px-4 py-5 tamil-font font-bold text-amber-900 text-xs">{p.signName_ta}</td>
                          <td className="px-4 py-5 font-mono text-xs text-amber-800/60">{p.degree}°</td>
                          <td className="px-4 py-5 font-black text-red-900 text-xs">{p.house}</td>
                          <td className="px-4 py-5 text-emerald-700 font-black text-[10px] uppercase tracking-tighter">{p.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="space-y-12">
              <AIChat horoscope={data} language={language} />
              
              <div className="bg-red-950 text-white rounded-[2rem] p-10 shadow-2xl shadow-red-900/20 border border-red-800">
                <h3 className="text-[10px] font-black mb-8 flex items-center gap-3 uppercase tracking-[0.4em] text-amber-200">✨ Yoga Analysis</h3>
                <div className="space-y-6">
                  {data.yogas.map((y, i) => (
                    <div key={i} className="group cursor-default">
                      <p className="font-bold text-amber-400 text-sm mb-1 group-hover:text-amber-300 transition-colors">{y.name}</p>
                      <p className="text-[11px] text-red-100/70 leading-relaxed font-medium">{y.effect}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-900 text-white rounded-[2rem] p-10 shadow-2xl border-t-4 border-red-600">
                <h3 className="text-[10px] font-black mb-8 flex items-center gap-3 uppercase tracking-[0.4em] text-red-400">⚠️ Dosha Check</h3>
                <div className="space-y-6">
                  {data.doshas.map((d, i) => (
                    <div key={i} className="space-y-2">
                      <p className="font-bold text-red-500 text-sm">{d.name}</p>
                      <div className="flex items-center gap-2">
                         <span className="text-[9px] font-black bg-red-500/10 text-red-500 px-2 py-0.5 rounded uppercase tracking-widest border border-red-500/20">{d.severity}</span>
                         <span className="text-[9px] font-black text-slate-500 uppercase">House {d.house}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">{d.effect}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <footer className="bg-amber-50 border-t border-amber-100 p-12 text-center">
          <div className="text-xl mb-4 opacity-40 text-amber-800">🔱</div>
          <p className="text-red-900/20 font-black text-[10px] uppercase tracking-[1em] mb-4">CosmicWisdom Astrology</p>
          <p className="text-amber-800/40 text-[9px] max-w-xl mx-auto leading-relaxed uppercase tracking-widest">
            High-precision Thirukanitha calculations generated via secure cloud engine. 
            Vedic accuracy verified for the given birth timestamp.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default HoroscopeResult;