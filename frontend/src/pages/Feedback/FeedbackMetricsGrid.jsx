import React from 'react';
import {
    FaComments,
    FaTicketAlt,
    FaCheckCircle,
    FaHistory,
    FaArrowUp,
    FaArrowDown
} from 'react-icons/fa';

const FeedbackMetricsGrid = () => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 select-none text-left">

            {/* 1. Total Feedback */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4.5 shadow-sm flex flex-col justify-between space-y-3">
                <div className="flex items-center justify-between">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#0052cc] flex items-center justify-center">
                        <FaComments className="w-4.5 h-4.5" />
                    </div>
                    <span className="inline-flex items-center gap-0.5 px-2 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-full text-[11px] font-extrabold">
                        <FaArrowUp className="w-2.5 h-2.5" />
                        <span>12%</span>
                    </span>
                </div>
                <div className="space-y-0.5">
                    <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block">Total Feedback</span>
                    <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">2,842</span>
                </div>
            </div>

            {/* 2. Open Tickets */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4.5 shadow-sm flex flex-col justify-between space-y-3">
                <div className="flex items-center justify-between">
                    <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                        <FaTicketAlt className="w-4.5 h-4.5" />
                    </div>
                    <span className="inline-flex items-center gap-0.5 px-2 py-0.5 bg-rose-50 border border-rose-200 text-rose-600 rounded-full text-[11px] font-extrabold">
                        <FaArrowDown className="w-2.5 h-2.5" />
                        <span>5%</span>
                    </span>
                </div>
                <div className="space-y-0.5">
                    <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block">Open Tickets</span>
                    <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">42</span>
                </div>
            </div>

            {/* 3. Resolved Issues */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4.5 shadow-sm flex flex-col justify-between space-y-3">
                <div className="flex items-center justify-between">
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                        <FaCheckCircle className="w-4.5 h-4.5" />
                    </div>
                    <span className="inline-flex items-center gap-0.5 px-2 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-full text-[11px] font-extrabold">
                        <FaArrowUp className="w-2.5 h-2.5" />
                        <span>18%</span>
                    </span>
                </div>
                <div className="space-y-0.5">
                    <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block">Resolved Issues</span>
                    <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">1,950</span>
                </div>
            </div>

            {/* 4. Avg. Response Time */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4.5 shadow-sm flex flex-col justify-between space-y-3">
                <div className="flex items-center justify-between">
                    <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                        <FaHistory className="w-4.5 h-4.5" />
                    </div>
                    <span className="inline-flex items-center gap-0.5 px-2 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-full text-[11px] font-extrabold">
                        <FaArrowDown className="w-2.5 h-2.5" />
                        <span>4m</span>
                    </span>
                </div>
                <div className="space-y-0.5">
                    <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block">Avg. Response</span>
                    <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">1h 45m</span>
                </div>
            </div>

        </div>
    );
};

export default FeedbackMetricsGrid;
