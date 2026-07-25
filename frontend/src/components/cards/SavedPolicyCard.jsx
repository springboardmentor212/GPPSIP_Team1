import React from 'react';
import { FaBookmark, FaRegClock, FaTrashAlt } from 'react-icons/fa';

const SavedPolicyCard = ({ 
  title, 
  category, 
  description, 
  lastViewed, 
  onQuickOpen, 
  onRemove 
}) => {

  // Dynamic colors for category tags to keep it premium
  const getCategoryStyles = (cat) => {
    const c = cat.toLowerCase();
    if (c.includes('health')) {
      return 'bg-emerald-50 text-emerald-600 border-emerald-100';
    }
    if (c.includes('urban') || c.includes('planning')) {
      return 'bg-blue-50 text-[#0052cc] border-blue-150';
    }
    if (c.includes('climate') || c.includes('action') || c.includes('emission')) {
      return 'bg-teal-50 text-teal-600 border-teal-150';
    }
    if (c.includes('digital') || c.includes('sovereignty') || c.includes('tech')) {
      return 'bg-indigo-50 text-indigo-600 border-indigo-150';
    }
    return 'bg-slate-50 text-slate-600 border-slate-350';
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-300 p-5 shadow-sm hover:shadow-md hover:border-slate-400 transition-all duration-300 flex flex-col justify-between h-full group text-left">
      
      {/* Top section: Category & Bookmark Icon */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between gap-4">
          {/* Category Chip */}
          <span className={`px-2.5 py-0.5 border rounded-md text-[9px] font-black uppercase tracking-wider ${getCategoryStyles(category)}`}>
            {category}
          </span>
          {/* Bookmarked Ribbon Icon */}
          <FaBookmark className="w-4.5 h-4.5 text-[#0052cc] shrink-0" />
        </div>

        {/* Title & Description */}
        <div className="space-y-1.5">
          <h3 className="text-base font-extrabold text-slate-800 leading-snug tracking-tight group-hover:text-[#0052cc] transition-colors line-clamp-2">
            {title}
          </h3>
          <p className="text-xs text-slate-450 font-light leading-relaxed line-clamp-3">
            {description}
          </p>
        </div>
      </div>

      {/* Spacing & Content: Last Viewed Info */}
      <div className="my-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-slate-400">
        <FaRegClock className="w-3.5 h-3.5" />
        <span className="text-[10px] font-bold uppercase tracking-wider">
          Last Viewed: <strong className="text-slate-550 font-black">{lastViewed}</strong>
        </span>
      </div>

      {/* Actions Footer: Quick Open & Remove */}
      <div className="grid grid-cols-2 gap-2.5 pt-3 border-t border-slate-100 shrink-0 mt-auto">
        <button
          onClick={onQuickOpen}
          className="w-full h-9 bg-[#0052cc] hover:bg-[#0047b3] text-white font-extrabold rounded-xl text-xs transition-colors shadow-sm cursor-pointer select-none flex items-center justify-center border-none"
        >
          Quick Open
        </button>
        <button
          onClick={onRemove}
          className="w-full h-9 bg-white hover:bg-slate-50 text-slate-500 hover:text-slate-850 font-extrabold rounded-xl text-xs border border-slate-350 transition-colors cursor-pointer select-none flex items-center justify-center gap-1.5"
        >
          <FaTrashAlt className="w-3 h-3 text-slate-400" />
          <span>Remove</span>
        </button>
      </div>

    </div>
  );
};

export default SavedPolicyCard;
