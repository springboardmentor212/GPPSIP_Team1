import React from 'react';
import {
    FaArrowUp,
    FaRegClock,
    FaCloudDownloadAlt,
    FaBolt
} from 'react-icons/fa';

const ReportsMetricsGrid = () => {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 select-none">

            {/* 1. Generated Today */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4.5 shadow-sm text-left flex flex-col justify-between space-y-3">
                <div className="flex items-center justify-between text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                    <span>Generated Today</span>
                </div>
                <div className="flex items-baseline justify-between gap-2">
                    <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">24</span>
                    <span className="inline-flex items-center gap-0.5 px-2 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-full text-[11px] font-bold">
                        <FaArrowUp className="w-2.5 h-2.5" />
                        <span>+12%</span>
                    </span>
                </div>
            </div>

            {/* 2. Scheduled */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4.5 shadow-sm text-left flex flex-col justify-between space-y-3">
                <div className="flex items-center justify-between text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                    <span>Scheduled</span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">156</span>
                    <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center">
                        <FaRegClock className="w-4 h-4 text-slate-600" />
                    </div>
                </div>
            </div>

            {/* 3. Downloads */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4.5 shadow-sm text-left flex flex-col justify-between space-y-3">
                <div className="flex items-center justify-between text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                    <span>Downloads</span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">1,482</span>
                    <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#0052cc] flex items-center justify-center">
                        <FaCloudDownloadAlt className="w-4.5 h-4.5" />
                    </div>
                </div>
            </div>

            {/* 4. Cloud Storage */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4.5 shadow-sm text-left flex flex-col justify-between space-y-3">
                <div className="flex items-center justify-between text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                    <span>Cloud Storage</span>
                </div>
                <div className="space-y-1.5">
                    <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">4.2 GB</span>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-[#0052cc] h-full w-[42%] rounded-full" />
                    </div>
                </div>
            </div>

            {/* 5. Avg Gen Time */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4.5 shadow-sm text-left flex flex-col justify-between space-y-3 col-span-2 sm:col-span-1">
                <div className="flex items-center justify-between text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                    <span>Avg Gen Time</span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">12.4s</span>
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                        <FaBolt className="w-4 h-4" />
                    </div>
                </div>
            </div>

        </div>
    );
};

export default ReportsMetricsGrid;
