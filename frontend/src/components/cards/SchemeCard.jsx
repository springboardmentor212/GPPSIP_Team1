import React from 'react';
import { FaBookmark, FaRegBookmark, FaBuilding, FaCalendarAlt, FaCheckCircle, FaLaptopCode, FaLeaf, FaShieldAlt, FaMicroscope } from 'react-icons/fa';

const SchemeCard = ({ 
  title, 
  ministry, 
  eligibilityTag, 
  matchPercentage, 
  description, 
  maxBenefit, 
  deadline, 
  tags = [], 
  isBookmarked = false, 
  onBookmarkToggle, 
  onApply 
}) => {

  // Dynamic icon selector based on title or category
  const getIcon = () => {
    const titleLower = title.toLowerCase();
    if (titleLower.includes('msme') || titleLower.includes('credit')) {
      return (
        <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0052cc] border border-blue-150 flex items-center justify-center shrink-0">
          <FaLaptopCode className="w-5 h-5" />
        </div>
      );
    }
    if (titleLower.includes('green') || titleLower.includes('tech') || titleLower.includes('subsidy')) {
      if (titleLower.includes('bio-manufacturing')) {
        return (
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 border border-purple-150 flex items-center justify-center shrink-0">
            <FaMicroscope className="w-5 h-5" />
          </div>
        );
      }
      return (
        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-150 flex items-center justify-center shrink-0">
          <FaLeaf className="w-5 h-5" />
        </div>
      );
    }
    if (titleLower.includes('cyber') || titleLower.includes('talent')) {
      return (
        <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-150 flex items-center justify-center shrink-0">
          <FaShieldAlt className="w-5 h-5" />
        </div>
      );
    }
    return (
      <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0052cc] border border-blue-150 flex items-center justify-center shrink-0">
        <FaBuilding className="w-5 h-5" />
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-300 p-6 shadow-sm hover:shadow-md hover:border-slate-400 transition-all duration-300 flex flex-col justify-between h-full group text-left">
      
      {/* Top Header Layout: Icon, Title, Ministry, Match badges */}
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          {/* Icon */}
          {getIcon()}

          {/* Badges */}
          <div className="flex flex-wrap items-center gap-1.5 justify-end">
            {eligibilityTag && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase bg-emerald-50 text-emerald-600 border border-emerald-100 tracking-wider">
                <FaCheckCircle className="w-2.5 h-2.5" />
                {eligibilityTag}
              </span>
            )}
            {matchPercentage && (
              <span className="px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase bg-blue-50 text-blue-600 border border-blue-150 tracking-wider">
                {matchPercentage}% Match
              </span>
            )}
          </div>
        </div>

        {/* Title & Ministry */}
        <div className="space-y-1">
          <h3 className="text-base font-extrabold text-slate-800 leading-snug tracking-tight group-hover:text-[#0052cc] transition-colors line-clamp-1">
            {title}
          </h3>
          <span className="text-[10px] font-extrabold text-[#0052cc] uppercase tracking-wider block leading-none">
            {ministry}
          </span>
        </div>

        {/* Short Description */}
        <p className="text-xs text-slate-450 font-light leading-relaxed line-clamp-2">
          {description}
        </p>
      </div>

      {/* Spacing & Content: Benefits and Deadlines Side by Side */}
      <div className="grid grid-cols-2 gap-3.5 my-5">
        {/* Benefit Block */}
        <div className="bg-slate-50 border border-slate-300 rounded-xl p-3 flex flex-col justify-center">
          <span className="block text-[8px] font-black text-slate-400 uppercase tracking-wider mb-0.5">Max Benefit</span>
          <span className="text-xs sm:text-sm font-extrabold text-slate-800 truncate">
            {maxBenefit}
          </span>
        </div>

        {/* Deadline Block */}
        <div className="bg-slate-50 border border-slate-300 rounded-xl p-3 flex flex-col justify-center">
          <span className="block text-[8px] font-black text-slate-400 uppercase tracking-wider mb-0.5">Deadline</span>
          <span className="text-xs sm:text-sm font-extrabold text-slate-800 truncate flex items-center gap-1">
            <FaCalendarAlt className="text-slate-400 shrink-0 w-3 h-3" />
            {deadline}
          </span>
        </div>
      </div>

      {/* Footer Row: Tags, Bookmark, Apply Now */}
      <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-100 shrink-0 mt-auto">
        {/* Tags */}
        <div className="flex items-center gap-1.5 flex-wrap flex-grow overflow-hidden max-h-7">
          {tags.map((tag) => (
            <span 
              key={tag}
              className="px-2 py-0.5 bg-slate-50 border border-slate-300 text-slate-500 rounded-md text-[9px] font-bold uppercase tracking-wide select-none"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Bookmark & Apply */}
        <div className="flex items-center gap-2 shrink-0">
          <button 
            onClick={onBookmarkToggle}
            className={`w-9 h-9 border rounded-xl flex items-center justify-center transition-colors cursor-pointer ${
              isBookmarked 
                ? 'border-blue-200 bg-blue-50 text-[#0052cc] hover:bg-blue-100' 
                : 'border-slate-300 text-slate-400 hover:border-slate-350 hover:text-slate-600 bg-white'
            }`}
          >
            {isBookmarked ? <FaBookmark className="w-3.5 h-3.5" /> : <FaRegBookmark className="w-3.5 h-3.5" />}
          </button>

          <button 
            onClick={onApply}
            className="px-4 h-9 bg-[#0052cc] hover:bg-[#0047b3] text-white font-extrabold rounded-xl text-xs transition-colors shadow-sm cursor-pointer"
          >
            Apply Now
          </button>
        </div>
      </div>

    </div>
  );
};

export default SchemeCard;
