import React from 'react';
import { FaCheck, FaSlidersH } from 'react-icons/fa';

const NotificationHeader = ({ onMarkAllRead, onOpenSettings }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 select-none pb-1">
      {/* Title & Breadcrumbs */}
      <div className="space-y-1">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
          <span>Dashboard</span>
          <span>/</span>
          <span className="text-slate-600 font-bold">Notifications</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Notification Center
        </h1>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Notification Settings Button */}
        <button
          onClick={onOpenSettings}
          className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 border border-slate-300 hover:border-slate-400 rounded-xl text-xs font-bold text-[#0052cc] transition-all shadow-sm cursor-pointer"
        >
          <span>Notification Settings</span>
        </button>

        {/* Mark All as Read Button */}
        <button
          onClick={onMarkAllRead}
          className="flex items-center gap-2 px-4.5 py-2 bg-[#0052cc] hover:bg-[#0041a8] text-white border-none rounded-xl text-xs font-bold transition-all shadow-sm shadow-blue-500/10 cursor-pointer"
        >
          <FaCheck className="w-3 h-3 text-white" />
          <span>Mark All as Read</span>
        </button>
      </div>
    </div>
  );
};

export default NotificationHeader;
