
import React from 'react';
import { SIGN_NAMES_EN, SIGN_NAMES_TA } from '../constants';
import { Language } from '../types';

interface SouthIndianChartProps {
  title: string;
  data: string[][];
  language: Language;
}

const SouthIndianChart: React.FC<SouthIndianChartProps> = ({ title, data, language }) => {
  // Mapping signs to grid cells (South Indian style starts Meena top left inner-ish)
  // Grid: 4x4
  // Outer cells are 12 signs clockwise:
  // [11, 0, 1, 2]
  // [10,  ,  , 3]
  // [9,   ,  , 4]
  // [8, 7, 6, 5]
  
  const signOrder = [11, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const gridPositions = [
    { row: 0, col: 0, idx: 11 }, { row: 0, col: 1, idx: 0 }, { row: 0, col: 2, idx: 1 }, { row: 0, col: 3, idx: 2 },
    { row: 1, col: 3, idx: 3 }, { row: 2, col: 3, idx: 4 }, { row: 3, col: 3, idx: 5 }, { row: 3, col: 2, idx: 6 },
    { row: 3, col: 1, idx: 7 }, { row: 3, col: 0, idx: 8 }, { row: 2, col: 0, idx: 9 }, { row: 1, col: 0, idx: 10 },
  ];

  return (
    <div className="flex flex-col items-center">
      <h3 className="text-lg font-black mb-3 text-red-900 uppercase tracking-widest border-b-2 border-amber-300 pb-1">{title}</h3>
      <div className="grid grid-cols-4 grid-rows-4 w-full max-w-[400px] aspect-square border-[3px] border-red-800 bg-[#fffdf5] shadow-xl shadow-amber-900/10">
        {Array.from({ length: 16 }).map((_, i) => {
          const row = Math.floor(i / 4);
          const col = i % 4;
          
          // Check if this cell is a sign or the center
          const pos = gridPositions.find(p => p.row === row && p.col === col);
          
          if (pos !== undefined) {
            const signIdx = pos.idx;
            const planets = data[signIdx] || [];
            const signLabel = language === Language.TAMIL ? SIGN_NAMES_TA[signIdx] : SIGN_NAMES_EN[signIdx];
            
            return (
              <div key={i} className="border border-red-800/30 p-1 flex flex-col relative overflow-hidden bg-amber-50/20 hover:bg-amber-100/30 transition-colors">
                <span className="text-[10px] text-red-900/60 font-bold uppercase tracking-wide">{signLabel}</span>
                <div className="flex flex-wrap gap-1 mt-1 justify-center content-center flex-1">
                  {planets.map((p, pi) => (
                    <span key={pi} className="text-xs font-bold text-red-900 bg-amber-100 px-1 rounded border border-amber-200">
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            );
          }

          // Center area
          if (row === 1 && col === 1) {
             return (
               <div key={i} className="col-span-2 row-span-2 flex items-center justify-center p-4 bg-amber-50/50 relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
                    <span className="text-6xl text-red-900">🕉</span>
                  </div>
                  <div className="text-center relative z-10">
                    <div className="text-red-900 font-bold text-sm tracking-[0.2em] opacity-80 border-t border-b border-red-900/20 py-1">THIRUKANITHA</div>
                  </div>
               </div>
             );
          }
          
          // These cells are swallowed by the col-span/row-span center
          if ((row === 1 || row === 2) && (col === 1 || col === 2)) return null;

          return <div key={i} className="border border-red-800/30"></div>;
        })}
      </div>
    </div>
  );
};

export default SouthIndianChart;