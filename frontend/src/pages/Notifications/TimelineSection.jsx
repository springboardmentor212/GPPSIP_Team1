import React from 'react';
import { FaCalendarDay, FaHistory } from 'react-icons/fa';

const TimelineSection = ({ title, children }) => {
  const getIcon = () => {
    if (title.toLowerCase() === 'today') {
      return (
        <div className="w-8 h-8 rounded-full bg-blue-50 text-[#0052cc] border border-blue-150 flex items-center justify-center shrink-0 shadow-sm relative z-10">
          <FaCalendarDay className="w-3.5 h-3.5" />
        </div>
      );
    }
    return (
      <div className="w-8 h-8 rounded-full bg-slate-50 text-slate-500 border border-slate-300 flex items-center justify-center shrink-0 shadow-sm relative z-10">
        <FaHistory className="w-3.5 h-3.5" />
      </div>
    );
  };

  return (
    <div className="flex gap-4 sm:gap-6 relative w-full text-left">
      {/* Left Timeline Indicator Column */}
      <div className="flex flex-col items-center shrink-0 w-8 select-none relative">
        {/* Timeline Icon */}
        {getIcon()}
        {/* Vertical Connecting Line */}
        <div className="absolute top-8 bottom-0 w-0.5 bg-slate-200"></div>
      </div>

      {/* Right Content Column */}
      <div className="flex-grow pb-8 space-y-4">
        {/* Section title */}
        <h3 className="text-sm font-extrabold text-slate-800 tracking-wider uppercase mb-3">
          {title}
        </h3>
        
        {/* Cards container */}
        <div className="space-y-4">
          {children}
        </div>
      </div>
    </div>
  );
};

export default TimelineSection;
