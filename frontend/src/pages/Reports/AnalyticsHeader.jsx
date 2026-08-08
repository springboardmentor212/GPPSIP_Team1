import React from 'react';
import { FaDownload, FaBuilding } from 'react-icons/fa';

const AnalyticsHeader = ({ onExport, onGenerateReport }) => {
    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 select-none border-b border-slate-200/80 pb-5">
            {/* Breadcrumb + Title */}
            <div className="space-y-1 text-left">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
                    <span className="hover:text-slate-600 cursor-pointer transition-colors">Dashboard</span>
                    <span>/</span>
                    <span className="text-[#0052cc] font-bold">Department Analytics</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    Department Performance Analytics
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 font-medium">
                    Analyze policy activity, citizen engagement, department performance and operational insights across government departments.
                </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 shrink-0">
                <button
                    onClick={onExport}
                    className="px-4 py-2.5 bg-white border border-slate-300 hover:border-slate-400 text-slate-700 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all shadow-sm cursor-pointer"
                >
                    <FaDownload className="w-3 h-3 text-slate-500" />
                    <span>Export Analytics</span>
                </button>

                <button
                    onClick={onGenerateReport}
                    className="px-4 py-2.5 bg-[#0052cc] hover:bg-[#0041a8] text-white rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all shadow-md shadow-blue-500/20 cursor-pointer"
                >
                    <FaBuilding className="w-3.5 h-3.5" />
                    <span>Generate Department Report</span>
                </button>
            </div>
        </div>
    );
};

export default AnalyticsHeader;
