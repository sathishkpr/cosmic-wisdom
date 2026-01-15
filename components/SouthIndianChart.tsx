
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
      <h3 className="text-lg font-bold mb-3 text-slate-700">{title}</h3>
      <div className="grid grid-cols-4 grid-rows-4 w-full max-w-[400px] aspect-square border-2 border-slate-400 bg-white">
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
              <div key={i} className="border border-slate-300 p-1 flex flex-col relative overflow-hidden bg-slate-50/30">
                <span className="text-[10px] text-slate-400 font-bold uppercase">{signLabel}</span>
                <div className="flex flex-wrap gap-1 mt-1 justify-center content-center flex-1">
                  {planets.map((p, pi) => (
                    <span key={pi} className="text-xs font-bold text-indigo-700 bg-indigo-50 px-1 rounded border border-indigo-100">
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
               <div key={i} className="col-span-2 row-span-2 flex items-center justify-center p-4 bg-slate-100/50">
                  <div className="text-center">
                    <div className="text-indigo-600 font-bold text-sm tracking-wider opacity-30">THIRUKANITHA</div>
                  </div>
               </div>
             );
          }
          
          // These cells are swallowed by the col-span/row-span center
          if ((row === 1 || row === 2) && (col === 1 || col === 2)) return null;

          return <div key={i} className="border border-slate-300"></div>;
        })}
      </div>
    </div>
  );
};

export default SouthIndianChart;
