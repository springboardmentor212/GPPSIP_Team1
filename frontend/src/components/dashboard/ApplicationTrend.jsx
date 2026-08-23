import React, { useState, useEffect } from 'react';
import { FaChartBar, FaSpinner } from 'react-icons/fa';
import { getTrends } from '../../services/analytics.service';

const ApplicationTrend = () => {
  const [trendData, setTrendData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrends = async () => {
      try {
        const res = await getTrends('6m');
        if (res.success && Array.isArray(res.trends)) {
          // Backend returns monthly trend data [{month, policies, schemes, applications}]
          const maxVal = Math.max(...res.trends.map(t => (t.policies || 0) + (t.schemes || 0) + (t.applications || 0)), 1);
          const formatted = res.trends.map(t => {
            const total = (t.policies || 0) + (t.schemes || 0) + (t.applications || 0);
            return {
              label: t.month,
              value: total,
              height: `${Math.max((total / maxVal) * 100, 5)}%`
            };
          });
          setTrendData(formatted);
        }
      } catch (err) {
        console.error('Failed to fetch application trends:', err);
        // Fallback: show empty state, not fake data
        setTrendData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchTrends();
  }, []);

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-300 shadow-sm flex flex-col justify-between h-[360px] w-full">
      
      {/* Header section */}
      <div className="flex items-center justify-between border-b border-slate-300 pb-4 shrink-0">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-50 text-[#0052cc] rounded-lg">
            <FaChartBar className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-extrabold text-slate-800 leading-none">Platform Activity</h4>
            <span className="text-[10px] text-slate-400 font-bold mt-1 inline-block uppercase tracking-wider">Last 6 Months</span>
          </div>
        </div>
        <span className="text-xs font-bold text-slate-500 bg-slate-50 border border-slate-300 px-2.5 py-1 rounded-lg">
          Live Data
        </span>
      </div>

      {/* Chart Body */}
      <div className="flex-grow flex items-end justify-between gap-1.5 sm:gap-3 pt-8 pb-4 px-1.5 relative min-h-[180px]">
        {/* Horizontal Background grid lines */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-12 pt-8">
          <div className="w-full border-t border-slate-200"></div>
          <div className="w-full border-t border-slate-200"></div>
          <div className="w-full border-t border-slate-200"></div>
          <div className="w-full border-t border-slate-200"></div>
        </div>

        {loading ? (
          <div className="w-full flex items-center justify-center">
            <FaSpinner className="animate-spin text-[#0052cc] w-5 h-5" />
          </div>
        ) : trendData.length === 0 ? (
          <div className="w-full flex items-center justify-center">
            <p className="text-xs text-slate-400 font-bold">No activity data available yet.</p>
          </div>
        ) : (
          /* Vertical Bars */
          trendData.map((data, idx) => (
            <div key={idx} className="flex-grow flex flex-col items-center gap-2 group h-full justify-end relative z-10">
              {/* Value popover visible on hover */}
              <span className="text-[10px] font-black text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity duration-200 absolute -top-5">
                {data.value}
              </span>
              
              {/* Actual Bar */}
              <div 
                className="w-5 sm:w-7 md:w-8 bg-gradient-to-t from-[#0a369d] to-[#0052cc] hover:from-[#0052cc] hover:to-blue-400 rounded-t-lg transition-all duration-500 cursor-pointer shadow-sm relative overflow-hidden"
                style={{ height: data.height }}
              >
                {/* Highlight Overlay effect */}
                <div className="absolute inset-0 bg-white/10 w-full h-1/2"></div>
              </div>

              {/* Label */}
              <span className="text-[10px] font-bold text-slate-400 group-hover:text-slate-700 transition-colors uppercase shrink-0">
                {data.label}
              </span>
            </div>
          ))
        )}
      </div>

    </div>
  );
};

export default ApplicationTrend;
