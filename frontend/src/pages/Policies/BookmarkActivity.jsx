import React from 'react';
import { FaHistory } from 'react-icons/fa';
import BookmarkActivityItem from './BookmarkActivityItem';

const BookmarkActivity = ({ activities = [], onClearHistory, onCompare }) => {
  return (
    <div className="bg-white rounded-3xl border border-slate-300 p-6 sm:p-8 shadow-sm w-full space-y-6 text-left select-none">
      {/* Header section */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 shrink-0">
        <h4 className="text-sm font-extrabold text-slate-800 flex items-center gap-2 leading-none">
          <FaHistory className="text-[#0052cc] w-4 h-4" />
          <span>Recent Bookmark Activity</span>
        </h4>
        
        {activities.length > 0 && (
          <button 
            onClick={onClearHistory}
            className="text-[10px] font-extrabold text-slate-400 hover:text-slate-650 cursor-pointer"
          >
            Clear History
          </button>
        )}
      </div>

      {/* Activity Timeline List */}
      <div className="space-y-4">
        {activities.length > 0 ? (
          activities.map((act) => (
            <BookmarkActivityItem 
              key={act.id}
              type={act.type}
              message={act.message}
              time={act.time}
              onCompare={() => onCompare(act)}
            />
          ))
        ) : (
          <div className="text-center py-6">
            <p className="text-xs text-slate-400 font-bold">No recent bookmark activity</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookmarkActivity;
