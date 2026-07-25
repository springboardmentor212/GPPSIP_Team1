import React from 'react';
import { FaListUl } from 'react-icons/fa';

const PolicyObjectives = ({ objectives }) => {
  const defaultObjectives = [
    "Ensure individuals have full control over their personal data and clear visibility into its usage.",
    "Mandate robust technical and organizational security measures for organizations handling sensitive information.",
    "Standardize cross-border data transfer protocols to align with international privacy standards."
  ];

  const displayObjectives = objectives || defaultObjectives;

  return (
    <div className="bg-white rounded-2xl border border-slate-300 p-6 sm:p-8 shadow-sm space-y-5">
      {/* Title */}
      <div className="flex items-center gap-2.5 text-slate-800">
        <FaListUl className="w-4 h-4 text-[#0052cc]" />
        <h2 className="text-lg font-black tracking-tight">Policy Objectives</h2>
      </div>

      {/* Numbered List */}
      <ul className="space-y-4">
        {displayObjectives.map((objective, index) => (
          <li key={index} className="flex items-start gap-4">
            {/* Circle badge for index */}
            <div className="w-6 h-6 rounded-full bg-blue-50 text-[#0052cc] border border-blue-150 flex items-center justify-center text-xs font-black shrink-0 select-none">
              {index + 1}
            </div>
            {/* Text description */}
            <span className="text-xs sm:text-sm text-slate-550 leading-relaxed font-medium pt-0.5">
              {objective}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PolicyObjectives;
