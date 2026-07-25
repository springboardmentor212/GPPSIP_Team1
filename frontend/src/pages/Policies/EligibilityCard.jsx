import React from 'react';
import { FaUserShield } from 'react-icons/fa';

const EligibilityCard = ({ eligibility }) => {
  const applicableEntities = eligibility?.applicableEntities || "All government agencies, private corporations, and non-profits processing data of 10,000+";
  const exceptions = eligibility?.exceptions || "Personal use, domestic activities, and law enforcement agencies under specific judicial authorizations.";

  return (
    <div className="bg-white rounded-2xl border border-slate-300 p-6 sm:p-8 shadow-sm space-y-5">
      {/* Title */}
      <div className="flex items-center gap-2.5 text-slate-800">
        <FaUserShield className="w-4.5 h-4.5 text-[#0052cc]" />
        <h2 className="text-lg font-black tracking-tight">Eligibility & Scope</h2>
      </div>

      {/* Two Columns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Applicable Entities Column */}
        <div className="bg-slate-50 border border-slate-300 rounded-xl p-5 space-y-2">
          <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">
            Applicable Entities
          </h3>
          <p className="text-xs sm:text-sm text-slate-550 leading-relaxed font-light">
            {applicableEntities}
          </p>
        </div>

        {/* Exceptions Column */}
        <div className="bg-slate-50 border border-slate-300 rounded-xl p-5 space-y-2">
          <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">
            Exceptions
          </h3>
          <p className="text-xs sm:text-sm text-slate-550 leading-relaxed font-light">
            {exceptions}
          </p>
        </div>
      </div>
    </div>
  );
};

export default EligibilityCard;
