import React from 'react';
import { FaSyncAlt, FaShareAlt } from 'react-icons/fa';

const BookmarkActivityItem = ({ 
  type, 
  message, 
  time, 
  onCompare 
}) => {
  const getIcon = () => {
    switch (type) {
      case 'update':
        return (
          <div className="w-9 h-9 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-500 shrink-0">
            <FaSyncAlt className="w-3.5 h-3.5" />
          </div>
        );
      default:
        return (
          <div className="w-9 h-9 rounded-full bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-500 shrink-0">
            <FaShareAlt className="w-3.5 h-3.5" />
          </div>
        );
    }
  };

  return (
    <div className="p-4 border border-slate-300 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/30 text-left">
      <div className="flex items-start gap-4">
        {/* Circle Status Icon */}
        {getIcon()}

        {/* Message and Timestamp */}
        <div className="space-y-1">
          <p className="text-xs sm:text-sm font-bold text-slate-700 leading-tight">
            {message}
          </p>
          <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">
            {time}
          </span>
        </div>
      </div>

      {/* Optional Compare Action Button */}
      {type === 'update' && onCompare && (
        <button
          onClick={onCompare}
          className="px-4 py-1.5 bg-white hover:bg-slate-50 border border-slate-350 hover:border-slate-450 text-[#0052cc] font-extrabold rounded-lg text-xs transition-all shadow-sm cursor-pointer shrink-0 self-start sm:self-auto select-none"
        >
          Compare
        </button>
      )}
    </div>
  );
};

export default BookmarkActivityItem;
