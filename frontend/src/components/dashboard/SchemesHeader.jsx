import React from 'react';
import { FaRobot } from 'react-icons/fa';

const SchemesHeader = ({ matchCount = 42 }) => {
  return (
    <div className="space-y-3.5 select-none text-left">
      {/* Title */}
      <h1 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight leading-none">
        Available Government Schemes
      </h1>

      {/* Description & AI Badge */}
      <div className="space-y-2">
        <p className="text-xs sm:text-sm text-slate-500 font-light max-w-xl leading-relaxed">
          Discover and apply for curated policies and schemes based on your profile.
        </p>
        
        {/* AI Matches Badge */}
        <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-blue-50/70 border border-blue-150 rounded-xl text-xs font-bold text-slate-700 shadow-sm">
          <FaRobot className="w-4 h-4 text-[#0052cc] shrink-0" />
          <span>
            Our AI-driven engine has found{" "}
            <strong className="text-[#0052cc] font-black">{matchCount} matches</strong> for your current criteria.
          </span>
        </div>
      </div>
    </div>
  );
};

export default SchemesHeader;
