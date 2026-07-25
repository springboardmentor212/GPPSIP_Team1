import React from 'react';
import { FaBookmark, FaRegBookmark, FaRegImage, FaCheck } from 'react-icons/fa';

const RecommendationCard = ({ 
  title, 
  ministry, 
  matchPercentage, 
  description, 
  eligibilityTag, 
  isSaved = false, 
  onSave, 
  onApply,
  imageUrl
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-300 shadow-sm overflow-hidden hover:shadow-md hover:border-[#0052cc] transition-all duration-300 flex flex-col sm:flex-row gap-5 p-5 group w-full">
      
      {/* Left side: Image/Thumbnail */}
      <div className="w-full sm:w-32 h-32 sm:h-32 rounded-xl bg-slate-50 border border-slate-300 flex items-center justify-center shrink-0 overflow-hidden relative">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-slate-300 group-hover:text-[#0052cc]/30 transition-colors duration-300">
            <FaRegImage className="w-8 h-8" />
          </div>
        )}
      </div>

      {/* Right side: Content */}
      <div className="flex-grow flex flex-col justify-between gap-3">
        <div className="space-y-1.5">
          {/* Header Badge Row */}
          <div className="flex flex-wrap gap-2 items-center">
            {ministry && (
              <span className="px-2.5 py-0.5 bg-blue-50/70 text-[#0052cc] text-[9px] font-extrabold uppercase rounded-full border border-blue-100 tracking-wider">
                {ministry}
              </span>
            )}
            <span className="inline-flex items-center gap-1 text-[9px] font-extrabold text-emerald-600 uppercase tracking-wider bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
              <FaCheck className="w-2 h-2" /> {eligibilityTag || 'Eligible'}
            </span>
            <span className="inline-flex items-center text-[9px] font-extrabold text-blue-600 uppercase tracking-wider bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full">
              {matchPercentage}% Match
            </span>
          </div>

          <h4 className="text-base font-extrabold text-slate-800 leading-snug group-hover:text-[#0052cc] transition-colors tracking-tight">
            {title}
          </h4>

          <p className="text-xs text-slate-500 font-light leading-relaxed line-clamp-2">
            {description}
          </p>
        </div>

        {/* Action Buttons Row */}
        <div className="flex items-center gap-3 pt-1">
          <button 
            onClick={onApply}
            className="px-5 py-2 bg-[#0052cc] hover:bg-[#0047b3] text-white font-extrabold rounded-xl text-xs transition-colors shadow-sm cursor-pointer flex items-center justify-center h-9"
          >
            Apply Now
          </button>

          <button 
            onClick={onSave}
            className={`px-4 py-2 border rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer h-9 text-xs font-bold ${
              isSaved 
                ? 'border-blue-200 bg-blue-50 text-[#0052cc] hover:bg-blue-100' 
                : 'border-slate-300 text-slate-600 hover:border-slate-350 hover:text-slate-800 bg-white'
            }`}
          >
            {isSaved ? <FaBookmark className="w-3 h-3 text-[#0052cc]" /> : <FaRegBookmark className="w-3 h-3" />}
            <span>Save</span>
          </button>
        </div>
      </div>

    </div>
  );
};

export default RecommendationCard;
