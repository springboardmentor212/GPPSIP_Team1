import React from 'react';
import { FaDownload, FaBolt, FaCalendarAlt } from 'react-icons/fa';

const AnalyticsBanner = ({ onExport }) => {
    return (
        <div className="space-y-4 select-none">
            {/* Breadcrumb & Title */}
            <div className="space-y-1 text-left">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
                    <span>Dashboard</span>
                    <span>/</span>
                    <span className="text-slate-600 font-bold">Analytics</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    Analytics Dashboard
                </h1>
            </div>

            {/* Grid: Banner (2/3) + System Status & Deadlines (1/3) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">

                {/* Banner Box (8 Cols) */}
                <div className="lg:col-span-8 bg-gradient-to-r from-blue-50/90 via-indigo-50/60 to-blue-50/40 border border-blue-100 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between text-left">

                    {/* Background Decorative Graph Lines */}
                    <div className="absolute right-4 bottom-0 w-64 h-32 opacity-15 pointer-events-none">
                        <svg viewBox="0 0 200 100" fill="none" stroke="#0052cc" strokeWidth="4">
                            <path d="M0,80 Q40,20 80,60 T160,10 T200,40" />
                        </svg>
                    </div>

                    {/* Top Tag */}
                    <div className="space-y-3">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-100/80 border border-blue-200 rounded-full text-[11px] font-bold text-[#0052cc]">
                            <FaBolt className="w-3 h-3 text-amber-500" />
                            <span>Real-time Oversight</span>
                        </div>

                        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight leading-snug">
                            Government Policy Analytics
                        </h2>

                        <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed max-w-xl">
                            Monitor policy performance, citizen engagement, and platform usage through real-time insights. Aggregated data from over 14 functional departments.
                        </p>
                    </div>

                    {/* Footer Metadata & Export Button */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-6 mt-4 border-t border-blue-100/60">
                        <div className="flex items-center gap-6 text-xs">
                            <div>
                                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                                    Current Month
                                </span>
                                <span className="font-bold text-slate-800">
                                    October 2023
                                </span>
                            </div>
                            <div>
                                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                                    Last Updated
                                </span>
                                <span className="font-bold text-slate-800">
                                    12 mins ago
                                </span>
                            </div>
                        </div>

                        <button
                            onClick={onExport}
                            className="px-4 py-2.5 bg-[#0052cc] hover:bg-[#0041a8] text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-sm shadow-blue-500/10 cursor-pointer shrink-0"
                        >
                            <FaDownload className="w-3 h-3" />
                            <span>Export Analytics</span>
                        </button>
                    </div>
                </div>

                {/* Right Stack (4 Cols): System Status + Upcoming Deadlines */}
                <div className="lg:col-span-4 flex flex-col justify-between gap-4 text-left">

                    {/* System Status Card */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-4.5 shadow-sm space-y-3 flex-1">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                                System Status
                            </span>
                        </div>

                        <div className="space-y-2.5 pt-1">
                            {/* API Latency */}
                            <div className="space-y-1">
                                <div className="flex justify-between text-[11px] font-bold">
                                    <span className="text-slate-500">API Latency</span>
                                    <span className="text-slate-800">42ms</span>
                                </div>
                                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                    <div className="bg-emerald-500 h-full w-[25%]" />
                                </div>
                            </div>

                            {/* Compute Usage */}
                            <div className="space-y-1">
                                <div className="flex justify-between text-[11px] font-bold">
                                    <span className="text-slate-500">Compute Usage</span>
                                    <span className="text-slate-800">68%</span>
                                </div>
                                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                    <div className="bg-blue-600 h-full w-[68%]" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Upcoming Deadlines Card */}
                    <div className="bg-blue-50/70 border border-blue-100 rounded-2xl p-4 flex items-center gap-3.5 shadow-sm">
                        <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                            <FaCalendarAlt className="w-5 h-5" />
                        </div>
                        <div className="space-y-0.5 min-w-0">
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                Upcoming Deadlines
                            </div>
                            <div className="text-xs font-extrabold text-slate-900 truncate">
                                GDPR Audit Report
                            </div>
                            <div className="text-[11px] font-semibold text-slate-500">
                                Due in 3 days
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
};

export default AnalyticsBanner;
