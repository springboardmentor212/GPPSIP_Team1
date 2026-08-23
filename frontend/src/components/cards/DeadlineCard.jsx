import React, { useState, useEffect } from 'react';
import { FaCalendarAlt, FaSpinner } from 'react-icons/fa';
import { getSchemes } from '../../services/scheme.service';

const DeadlineCard = () => {
  const [deadlines, setDeadlines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDeadlines = async () => {
      try {
        const res = await getSchemes();
        if (res.success && Array.isArray(res.schemes)) {
          // Show the most recently updated active schemes as "upcoming deadlines"
          const activeSchemes = res.schemes
            .filter(s => s.status === 'Active')
            .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
            .slice(0, 4);

          const mapped = activeSchemes.map((scheme, idx) => {
            const date = new Date(scheme.updatedAt || scheme.createdAt);
            // Set deadline as 30 days from last update
            const deadline = new Date(date);
            deadline.setDate(deadline.getDate() + 30);
            
            const now = new Date();
            const daysLeft = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));
            const isCritical = daysLeft <= 7;

            return {
              id: scheme._id,
              schemeName: scheme.title.length > 28 ? scheme.title.substring(0, 28) + '...' : scheme.title,
              day: String(deadline.getDate()).padStart(2, '0'),
              month: deadline.toLocaleString('en-US', { month: 'short' }).toUpperCase(),
              status: daysLeft <= 0 ? 'Expired' : daysLeft <= 7 ? `Ends in ${daysLeft} days` : `${daysLeft} days left`,
              isCritical,
              color: isCritical ? 'text-rose-600 bg-rose-50/50 border-rose-100' : 'text-blue-600 bg-blue-50/50 border-blue-100'
            };
          });

          setDeadlines(mapped);
        }
      } catch (err) {
        console.error('Failed to fetch deadlines:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDeadlines();
  }, []);

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-300 shadow-sm flex flex-col justify-between h-[360px] w-full">
      
      {/* Header section */}
      <div className="flex items-center justify-between border-b border-slate-300 pb-4 shrink-0">
        <h4 className="text-sm font-extrabold text-slate-800 leading-none">Upcoming Deadlines</h4>
        <FaCalendarAlt className="w-4 h-4 text-slate-400" />
      </div>

      {/* Deadlines List */}
      <div className="flex-grow py-4 space-y-4 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <FaSpinner className="animate-spin text-[#0052cc] w-5 h-5" />
          </div>
        ) : deadlines.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <FaCalendarAlt className="w-8 h-8 text-slate-200 mb-2" />
            <p className="text-xs text-slate-400 font-bold">No upcoming deadlines</p>
          </div>
        ) : (
          deadlines.map((item) => (
            <div key={item.id} className="flex items-center gap-3.5 p-1 rounded-xl hover:bg-slate-50 transition-colors">
              {/* Calendar Date Block */}
              <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-300 flex flex-col items-center justify-center shrink-0">
                <span className={`text-sm font-black leading-none ${item.isCritical ? 'text-rose-600' : 'text-blue-600'}`}>
                  {item.day}
                </span>
                <span className="text-[7.5px] font-black text-slate-400 uppercase tracking-wider mt-0.5 leading-none">
                  {item.month}
                </span>
              </div>

              {/* Scheme Details */}
              <div className="flex flex-col flex-grow min-w-0">
                <h5 className="text-xs font-bold text-slate-700 leading-snug">
                  {item.schemeName}
                </h5>
                <span className={`text-[10px] font-bold mt-0.5 leading-none ${item.isCritical ? 'text-rose-600 font-extrabold' : 'text-slate-400 font-medium'}`}>
                  {item.status}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* See Full Calendar CTA */}
      <button className="w-full py-2.5 bg-blue-50/70 hover:bg-blue-100 text-[#0052cc] border border-blue-100 rounded-xl text-xs font-extrabold transition-all shrink-0 cursor-pointer">
        See Full Calendar
      </button>

    </div>
  );
};

export default DeadlineCard;
