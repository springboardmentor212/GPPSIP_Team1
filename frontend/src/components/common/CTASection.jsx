import React from 'react';
import { FaRobot, FaArrowRight } from 'react-icons/fa';

const CTASection = ({ onStartMatching }) => {
  return (
    <div className="relative rounded-3xl overflow-hidden shadow-lg border border-blue-500/10 bg-gradient-to-r from-[#0047b3] via-[#0a369d] to-[#082a7a] text-white p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 min-h-[120px] select-none text-left">
      
      {/* Background Decorative Blobs */}
      <div className="absolute top-0 right-0 w-60 h-60 bg-white/5 rounded-full blur-2xl pointer-events-none -mr-10 -mt-10"></div>
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-950/20 rounded-full blur-xl pointer-events-none -ml-5 -mb-5"></div>

      {/* Text Content */}
      <div className="relative z-10 space-y-1">
        <h3 className="text-lg sm:text-xl font-black tracking-tight leading-tight">
          Can't find the right scheme?
        </h3>
        <p className="text-xs sm:text-sm text-blue-100 font-light max-w-xl leading-relaxed">
          Our AI assistant can scan your business profile to find hidden opportunities.
        </p>
      </div>

      {/* Action Button */}
      <div className="relative z-10 shrink-0">
        <button 
          onClick={onStartMatching || (() => alert("Starting AI Matching Wizard..."))}
          className="px-6 py-3 bg-white hover:bg-blue-50 text-[#0a369d] font-black rounded-xl text-xs sm:text-sm shadow-md transition-all duration-200 flex items-center gap-2 cursor-pointer border-none scale-100 hover:scale-102 active:scale-98"
        >
          <FaRobot className="w-4 h-4 text-[#0a369d]" />
          <span>Start AI Matching</span>
          <FaArrowRight className="w-3 h-3 text-[#0a369d]" />
        </button>
      </div>

    </div>
  );
};

export default CTASection;
