import React from 'react';
import { FaPlus } from 'react-icons/fa';

const EmptySavedPolicyCard = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="w-full h-full min-h-[220px] bg-slate-50/20 hover:bg-slate-50/50 border-2 border-dashed border-slate-300 hover:border-blue-400 rounded-2xl flex flex-col items-center justify-center p-6 text-center transition-all duration-300 cursor-pointer shadow-sm group select-none text-slate-500 hover:text-[#0052cc]"
    >
      {/* Plus Icon Container */}
      <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-150 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform duration-300">
        <FaPlus className="w-4 h-4 text-[#0052cc]" />
      </div>

      {/* Text Info */}
      <h4 className="text-sm font-extrabold text-slate-700 group-hover:text-[#0052cc] transition-colors mb-1">
        Browse Policy Search
      </h4>
      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
        Find more policies to save
      </p>
    </button>
  );
};

export default EmptySavedPolicyCard;
