import React from 'react';
import { FaCheck, FaFilter } from 'react-icons/fa';

const NotificationHeader = ({ onMarkAllRead, onFilterToggle }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 text-left select-none">
      
      {/* Title & Subtitle */}
      <div className="space-y-1.5">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight leading-none">
          Notifications
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-light max-w-xl leading-relaxed">
          Stay updated with the latest policy shifts and application milestones.
        </p>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-3 shrink-0 self-start md:self-auto">
        {/* Mark All Read Button */}
        <button
          onClick={onMarkAllRead}
          className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 transition-colors shadow-sm cursor-pointer"
        >
          <FaCheck className="w-3 h-3 text-slate-400" />
          <span>Mark All Read</span>
        </button>

        {/* Filter Toggle Button */}
        <button
          onClick={onFilterToggle}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#0052cc] hover:bg-[#0047b3] text-white border-none rounded-xl text-xs font-bold transition-all shadow-sm shadow-blue-500/10 cursor-pointer"
        >
          <FaFilter className="w-3 h-3 text-white" />
          <span>Filter</span>
        </button>
      </div>

    </div>
  );
};

export default NotificationHeader;
