import React from 'react';
import { FaInfoCircle } from 'react-icons/fa';

const PolicyOverview = ({ description }) => {
  const defaultDescription = "The Comprehensive Data Privacy & Security Framework (DPSF) 2024 establishes a unified standard for how digital personal data is collected, stored, and processed within the jurisdiction. It replaces the fragmented regulations of the previous decade with a modern, high-accountability framework designed to protect citizen rights while fostering innovation in the digital economy.";

  return (
    <div className="bg-white rounded-2xl border border-slate-300 p-6 sm:p-8 shadow-sm space-y-4">
      {/* Title */}
      <div className="flex items-center gap-2.5 text-slate-800">
        <FaInfoCircle className="w-4 h-4 text-[#0052cc]" />
        <h2 className="text-lg font-black tracking-tight">Overview</h2>
      </div>

      {/* Description Content */}
      <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-light">
        {description || defaultDescription}
      </p>
    </div>
  );
};

export default PolicyOverview;
