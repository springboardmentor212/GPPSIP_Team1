import React from 'react';
import { FaBookmark, FaRegBookmark, FaExternalLinkAlt, FaBuilding, FaCalendarAlt } from 'react-icons/fa';

const PolicyCard = ({ 
  category, 
  policyId, 
  title, 
  department, 
  location, 
  publishedDate, 
  description, 
  isBookmarked = false, 
  onBookmarkToggle, 
  onReadMore, 
  onShare 
}) => {
  
  // Dynamic color helper for category badges
  const getCategoryStyles = (cat) => {
    const uppercaseCat = cat?.toUpperCase() || 'GENERAL';
    switch (uppercaseCat) {
      case 'INFRASTRUCTURE':
        return 'text-blue-600 bg-blue-50 border-blue-100';
      case 'HEALTHCARE':
        return 'text-indigo-600 bg-indigo-50 border-indigo-100';
      case 'TECHNOLOGY':
        return 'text-emerald-600 bg-emerald-50 border-emerald-100';
      case 'FINANCE':
        return 'text-amber-600 bg-amber-50 border-amber-100';
      case 'EDUCATION':
        return 'text-rose-600 bg-rose-50 border-rose-100';
      default:
        return 'text-slate-600 bg-slate-50 border-slate-100';
    }
  };

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-300 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-full group">
      
      {/* Top Badge & ID Row */}
      <div className="flex items-center justify-between gap-2 mb-4 shrink-0">
        <span className={`px-2.5 py-0.5 rounded-lg text-[9px] font-extrabold tracking-wider border uppercase ${getCategoryStyles(category)}`}>
          {category}
        </span>
        <span className="text-[10px] font-bold text-slate-450 tracking-wide font-mono uppercase shrink-0">
          ID: {policyId}
        </span>
      </div>

      {/* Title */}
      <div className="mb-3">
        <h4 className="text-sm sm:text-base font-extrabold text-slate-800 leading-snug group-hover:text-[#0052cc] transition-colors line-clamp-2 min-h-[44px] tracking-tight">
          {title}
        </h4>
      </div>

      {/* Meta Location & Date Section */}
      <div className="space-y-2 shrink-0 mb-4">
        <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500">
          <FaBuilding className="w-3.5 h-3.5 text-slate-350 shrink-0" />
          <span className="truncate">{department} • {location}</span>
        </div>
        <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500">
          <FaCalendarAlt className="w-3.5 h-3.5 text-slate-350 shrink-0" />
          <span>{publishedDate}</span>
        </div>
      </div>

      {/* Description */}
      <p className="text-xs text-slate-450 font-light leading-relaxed line-clamp-3 mb-6 flex-grow">
        {description}
      </p>

      {/* Action Footer Row */}
      <div className="flex items-center gap-2 pt-4 border-t border-slate-300 shrink-0">
        <button 
          onClick={onReadMore}
          className="flex-grow h-9 bg-[#0052cc] hover:bg-[#0047b3] text-white font-extrabold rounded-xl text-xs transition-colors shadow-sm cursor-pointer flex items-center justify-center"
        >
          Read More
        </button>

        <button 
          onClick={onBookmarkToggle}
          className={`w-9 h-9 border rounded-xl flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
            isBookmarked 
              ? 'border-blue-200 bg-blue-50 text-[#0052cc] hover:bg-blue-100' 
              : 'border-slate-300 text-slate-400 hover:border-slate-350 hover:text-slate-600 bg-white'
          }`}
          title={isBookmarked ? "Bookmarked" : "Bookmark Policy"}
        >
          {isBookmarked ? <FaBookmark className="w-3.5 h-3.5" /> : <FaRegBookmark className="w-3.5 h-3.5" />}
        </button>

        <button 
          onClick={onShare}
          className="w-9 h-9 border border-slate-300 text-slate-400 hover:border-slate-350 hover:text-slate-605 bg-white rounded-xl flex items-center justify-center transition-colors cursor-pointer shrink-0"
          title="Share/Link"
        >
          <FaExternalLinkAlt className="w-3 h-3" />
        </button>
      </div>

    </div>
  );
};

export default PolicyCard;
