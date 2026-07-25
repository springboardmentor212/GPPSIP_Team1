import React from 'react';
import { FaRobot, FaCalendarAlt, FaBuilding, FaChevronRight } from 'react-icons/fa';

const PolicyHeader = ({ policy, onBack }) => {
  // Default fallback data matching the Figma mockup if none provided
  const category = policy?.category || "Digital Infrastructure";
  const status = policy?.status || "Active";
  const title = policy?.title || "Comprehensive Data Privacy & Security Framework (DPSF) 2024";
  const department = policy?.department || "Min. of IT & Communications";
  const publishedDate = policy?.publishedDate || "Jan 12, 2024";
  const lastReview = policy?.lastReview || "March 05, 2024";
  const aiInsight = policy?.aiInsight || "This policy introduces strict 72-hour breach notification rules and mandates local data residency for financial records.";

  // Styles for Category badge
  const getCategoryBadgeStyles = (cat) => {
    const uppercaseCat = cat?.toUpperCase() || 'GENERAL';
    switch (uppercaseCat) {
      case 'DIGITAL INFRASTRUCTURE':
      case 'INFRASTRUCTURE':
        return 'text-[#0052cc] bg-blue-50 border-blue-150';
      case 'HEALTHCARE':
        return 'text-indigo-600 bg-indigo-50 border-indigo-150';
      case 'TECHNOLOGY':
        return 'text-emerald-600 bg-emerald-50 border-emerald-150';
      case 'FINANCE':
        return 'text-amber-600 bg-amber-50 border-amber-150';
      case 'EDUCATION':
        return 'text-rose-600 bg-rose-50 border-rose-150';
      default:
        return 'text-slate-650 bg-slate-50 border-slate-200';
    }
  };

  return (
    <div className="w-full space-y-5">
      {/* Breadcrumb Row */}
      <nav className="flex items-center gap-2 text-xs font-bold text-slate-400 select-none">
        <button onClick={onBack} className="hover:text-[#0052cc] transition-colors cursor-pointer bg-transparent border-none p-0 font-bold">
          Policies
        </button>
        <FaChevronRight className="w-2 h-2 text-slate-350" />
        <span className="cursor-default">Federal Regulations</span>
        <FaChevronRight className="w-2 h-2 text-slate-350" />
        <span className="text-slate-700 cursor-default truncate">{title}</span>
      </nav>

      {/* Main Header Layout: 2-column layout (Main Policy Card & AI Insights Panel) */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left Main Policy Card (2/3 width) */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-300 p-6 sm:p-8 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            {/* Badges */}
            <div className="flex items-center gap-2.5">
              <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-wider border uppercase ${getCategoryBadgeStyles(category)}`}>
                {category}
              </span>
              <span className="px-3 py-1 rounded-full text-[10px] font-black tracking-wider border uppercase text-emerald-600 bg-emerald-50 border-emerald-150">
                {status}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-800 tracking-tight leading-tight">
              {title}
            </h1>
          </div>

          {/* Meta Fields Spacing */}
          <div className="grid grid-cols-3 gap-4 pt-6 mt-6 border-t border-slate-300">
            <div>
              <span className="block text-[9px] font-black text-slate-400 uppercase tracking-wider mb-1">Department</span>
              <span className="text-xs sm:text-sm font-bold text-slate-700 flex items-center gap-1.5 truncate">
                <FaBuilding className="text-slate-400 shrink-0 w-3.5 h-3.5" />
                {department}
              </span>
            </div>
            <div>
              <span className="block text-[9px] font-black text-slate-400 uppercase tracking-wider mb-1">Published Date</span>
              <span className="text-xs sm:text-sm font-bold text-slate-700 flex items-center gap-1.5">
                <FaCalendarAlt className="text-slate-400 shrink-0 w-3.5 h-3.5" />
                {publishedDate}
              </span>
            </div>
            <div>
              <span className="block text-[9px] font-black text-slate-400 uppercase tracking-wider mb-1">Last Review</span>
              <span className="text-xs sm:text-sm font-bold text-slate-700 flex items-center gap-1.5">
                <FaCalendarAlt className="text-slate-400 shrink-0 w-3.5 h-3.5" />
                {lastReview}
              </span>
            </div>
          </div>
        </div>

        {/* Right AI Insights Card (1/3 width) */}
        <div className="bg-[#f0f4fc] border border-blue-100 rounded-2xl p-6 sm:p-7 shadow-sm flex flex-col justify-between">
          <div className="space-y-3">
            {/* Title & Icon */}
            <div className="flex items-center gap-2 text-[#0052cc]">
              <FaRobot className="w-4 h-4 text-[#0052cc]" />
              <h3 className="text-xs font-black tracking-wider uppercase">AI Insights</h3>
            </div>
            
            {/* Summary Text */}
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-semibold">
              {aiInsight}
            </p>
          </div>

          <div className="pt-4 text-[9px] text-[#0052cc]/85 font-black uppercase tracking-wider select-none">
            Powered by PolicyGPT-4
          </div>
        </div>

      </div>
    </div>
  );
};

export default PolicyHeader;
