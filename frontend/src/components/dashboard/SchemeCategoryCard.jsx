import React from 'react';
import { FaChartPie } from 'react-icons/fa';

const SchemeCategoryCard = () => {
  const categories = [
    { label: 'Agriculture', count: 10, percent: 42, color: 'bg-amber-500', strokeColor: '#f59e0b', offset: 0 },
    { label: 'Education', count: 8, percent: 33, color: 'bg-blue-600', strokeColor: '#2563eb', offset: 263.76 * 0.42 },
    { label: 'Health', count: 6, percent: 25, color: 'bg-emerald-500', strokeColor: '#10b981', offset: 263.76 * (0.42 + 0.33) }
  ];

  // Circle radius details:
  // r = 42
  // Circumference = 2 * pi * r = 263.76
  const circumference = 263.76;

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-300 shadow-sm flex flex-col justify-between h-[360px] w-full">
      
      {/* Header section */}
      <div className="flex items-center justify-between border-b border-slate-300 pb-4 shrink-0">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-50 text-[#0052cc] rounded-lg">
            <FaChartPie className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-extrabold text-slate-800 leading-none">Scheme Categories</h4>
            <span className="text-[10px] text-slate-400 font-bold mt-1 inline-block uppercase tracking-wider">Topic Distribution</span>
          </div>
        </div>
      </div>

      {/* SVG Doughnut Ring Visual */}
      <div className="flex-grow flex items-center justify-center p-4 relative min-h-[160px]">
        
        {/* SVG Circle Drawing */}
        <svg className="w-28 h-28 sm:w-32 sm:h-32 transform -rotate-95" viewBox="0 0 100 100">
          {/* Base circle background */}
          <circle 
            cx="50" 
            cy="50" 
            r="42" 
            stroke="#f1f5f9" 
            strokeWidth="8" 
            fill="transparent" 
          />

          {/* Segment 1: Agriculture (42%) */}
          <circle 
            cx="50" 
            cy="50" 
            r="42" 
            stroke="#f59e0b" 
            strokeWidth="9" 
            strokeDasharray={`${circumference * 0.42} ${circumference}`} 
            strokeDashoffset="0"
            strokeLinecap="round"
            fill="transparent" 
          />

          {/* Segment 2: Education (33%) */}
          <circle 
            cx="50" 
            cy="50" 
            r="42" 
            stroke="#2563eb" 
            strokeWidth="9" 
            strokeDasharray={`${circumference * 0.33} ${circumference}`} 
            strokeDashoffset={`-${circumference * 0.42}`}
            strokeLinecap="round"
            fill="transparent" 
          />

          {/* Segment 3: Health (25%) */}
          <circle 
            cx="50" 
            cy="50" 
            r="42" 
            stroke="#10b981" 
            strokeWidth="9" 
            strokeDasharray={`${circumference * 0.25} ${circumference}`} 
            strokeDashoffset={`-${circumference * (0.42 + 0.33)}`}
            strokeLinecap="round"
            fill="transparent" 
          />
        </svg>

        {/* Total Badge in the center */}
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight leading-none">24</span>
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Total</span>
        </div>

      </div>

      {/* Legend list */}
      <div className="grid grid-cols-3 gap-1 border-t border-slate-300 pt-4 shrink-0">
        {categories.map((cat, idx) => (
          <div key={idx} className="flex flex-col items-center text-center">
            <div className="flex items-center gap-1 justify-center w-full">
              <span className={`w-2 h-2 rounded-full ${cat.color} shrink-0`}></span>
              <span className="text-[9px] sm:text-[10px] font-bold text-slate-600 truncate max-w-[45px] sm:max-w-[70px]">{cat.label}</span>
            </div>
            <span className="text-[10px] sm:text-xs font-black text-slate-800 mt-1 leading-none">
              {cat.count} <span className="text-[8px] font-bold text-slate-400">({cat.percent}%)</span>
            </span>
          </div>
        ))}
      </div>

    </div>
  );
};

export default SchemeCategoryCard;
