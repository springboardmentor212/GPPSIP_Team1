import React, { useState, useEffect } from 'react';
import { FaChartPie, FaSpinner } from 'react-icons/fa';
import { getSchemes } from '../../services/scheme.service';

const CATEGORY_COLORS = [
  { color: 'bg-amber-500', stroke: '#f59e0b' },
  { color: 'bg-blue-600', stroke: '#2563eb' },
  { color: 'bg-emerald-500', stroke: '#10b981' },
  { color: 'bg-purple-500', stroke: '#a855f7' },
  { color: 'bg-rose-500', stroke: '#f43f5e' },
  { color: 'bg-cyan-500', stroke: '#06b6d4' },
  { color: 'bg-orange-500', stroke: '#f97316' },
  { color: 'bg-indigo-500', stroke: '#6366f1' },
];

const SchemeCategoryCard = () => {
  const [categories, setCategories] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getSchemes();
        if (res.success && Array.isArray(res.schemes)) {
          const schemes = res.schemes;
          // Group by category
          const catMap = {};
          schemes.forEach(s => {
            const cat = s.category || 'Other';
            catMap[cat] = (catMap[cat] || 0) + 1;
          });

          const totalCount = schemes.length;
          const sorted = Object.entries(catMap)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 6) // Show top 6 categories
            .map(([label, count], idx) => ({
              label,
              count,
              percent: totalCount > 0 ? Math.round((count / totalCount) * 100) : 0,
              ...CATEGORY_COLORS[idx % CATEGORY_COLORS.length]
            }));

          setCategories(sorted);
          setTotal(totalCount);
        }
      } catch (err) {
        console.error('Failed to fetch scheme categories:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const circumference = 263.76; // 2 * Math.PI * 42

  // Build cumulative offsets for donut segments
  let cumulativePercent = 0;
  const segments = categories.map(cat => {
    const segment = {
      ...cat,
      dashArray: `${circumference * (cat.percent / 100)} ${circumference}`,
      dashOffset: `-${circumference * cumulativePercent}`
    };
    cumulativePercent += cat.percent / 100;
    return segment;
  });

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
            <span className="text-[10px] text-slate-400 font-bold mt-1 inline-block uppercase tracking-wider">Live Distribution</span>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex-grow flex items-center justify-center">
          <FaSpinner className="animate-spin text-[#0052cc] w-6 h-6" />
        </div>
      ) : categories.length === 0 ? (
        <div className="flex-grow flex items-center justify-center">
          <p className="text-xs text-slate-400 font-bold">No schemes in database yet.</p>
        </div>
      ) : (
        <>
          {/* SVG Doughnut Ring Visual */}
          <div className="flex-grow flex items-center justify-center p-4 relative min-h-[160px]">
            <svg className="w-28 h-28 sm:w-32 sm:h-32 transform -rotate-90" viewBox="0 0 100 100">
              {/* Base circle background */}
              <circle cx="50" cy="50" r="42" stroke="#f1f5f9" strokeWidth="8" fill="transparent" />
              {/* Dynamic segments */}
              {segments.map((seg, idx) => (
                <circle
                  key={idx}
                  cx="50" cy="50" r="42"
                  stroke={seg.stroke}
                  strokeWidth="9"
                  strokeDasharray={seg.dashArray}
                  strokeDashoffset={seg.dashOffset}
                  strokeLinecap="round"
                  fill="transparent"
                />
              ))}
            </svg>

            {/* Total Badge in the center */}
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight leading-none">{total}</span>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Total</span>
            </div>
          </div>

          {/* Legend list */}
          <div className={`grid grid-cols-${Math.min(categories.length, 3)} gap-1 border-t border-slate-300 pt-4 shrink-0`}>
            {categories.slice(0, 3).map((cat, idx) => (
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
        </>
      )}

    </div>
  );
};

export default SchemeCategoryCard;
