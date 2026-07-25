import React from 'react';
import { FaCalendarAlt } from 'react-icons/fa';

const DeadlineCard = () => {
  const deadlines = [
    {
      id: 1,
      schemeName: "Scholarship Renewal",
      day: "24",
      month: "OCT",
      status: "Ends in 5 days",
      isCritical: true,
      color: "text-rose-600 bg-rose-50/50 border-rose-100"
    },
    {
      id: 2,
      schemeName: "PM-Kisan Verification",
      day: "02",
      month: "NOV",
      status: "Submission Required",
      isCritical: false,
      color: "text-blue-600 bg-blue-50/50 border-blue-100"
    }
  ];

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-300 shadow-sm flex flex-col justify-between h-[360px] w-full">
      
      {/* Header section */}
      <div className="flex items-center justify-between border-b border-slate-300 pb-4 shrink-0">
        <h4 className="text-sm font-extrabold text-slate-800 leading-none">Upcoming Deadlines</h4>
        <FaCalendarAlt className="w-4 h-4 text-slate-400" />
      </div>

      {/* Deadlines List */}
      <div className="flex-grow py-4 space-y-4 overflow-y-auto">
        {deadlines.map((item) => (
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
        ))}
      </div>

      {/* See Full Calendar CTA */}
      <button className="w-full py-2.5 bg-blue-50/70 hover:bg-blue-100 text-[#0052cc] border border-blue-100 rounded-xl text-xs font-extrabold transition-all shrink-0 cursor-pointer">
        See Full Calendar
      </button>

    </div>
  );
};

export default DeadlineCard;
