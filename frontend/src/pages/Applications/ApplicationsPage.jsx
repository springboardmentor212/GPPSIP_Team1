import React from 'react';
import { FaClipboardList } from 'react-icons/fa';

const ApplicationsPage = () => {
  return (
    <div className="bg-white rounded-2xl border border-slate-300 p-6 sm:p-8 min-h-[480px]">
      <h2 className="text-2xl font-bold text-slate-900 mb-6 pb-4 border-b border-slate-300 flex items-center gap-2.5">
        <FaClipboardList className="text-[#0052cc]" /> Applications Portal
      </h2>
      <div className="mb-4 p-3 bg-amber-50 text-amber-850 border border-amber-200 rounded-xl text-xs font-semibold flex items-center justify-between">
        <span>⚠️ Local Mock Mode Active: Applications are simulated. Full backend API connection is pending.</span>
        <span className="px-2 py-0.5 bg-amber-105 rounded text-[10px] font-black uppercase text-amber-800">Pending Backend</span>
      </div>
      <div className="space-y-4">
        <div className="p-4 border border-slate-300 rounded-2xl flex justify-between items-center bg-slate-50/50">
          <div>
            <h4 className="font-bold text-slate-800 text-sm">Post-Matric Scholarship Scheme</h4>
            <span className="text-[10px] text-slate-400 font-bold block mt-1">Ref ID: PM-98218 • Submitted: 12 July 2026</span>
          </div>
          <span className="px-2.5 py-1 bg-amber-50 text-amber-600 border border-amber-105 rounded-lg text-xs font-bold">Under Review</span>
        </div>
        <div className="p-4 border border-slate-300 rounded-2xl flex justify-between items-center bg-slate-50/50">
          <div>
            <h4 className="font-bold text-slate-800 text-sm">PM Kisan Subsidies</h4>
            <span className="text-[10px] text-slate-400 font-bold block mt-1">Ref ID: PM-12891 • Approved: 25 June 2026</span>
          </div>
          <span className="px-2.5 py-1 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-lg text-xs font-bold">Approved</span>
        </div>
      </div>
    </div>
  );
};

export default ApplicationsPage;
