import React from 'react';

const SummaryHealthWidget = ({ unread = "12", highPriority = "03", policyChanges = "08", applications = "05" }) => {
    return (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4 text-left">
            <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-800 tracking-tight">
                    Summary & Health
                </h3>
                <span className="text-[10px] font-semibold text-slate-400">
                    Last 24h
                </span>
            </div>

            {/* 2x2 Metric Cards Grid */}
            <div className="grid grid-cols-2 gap-3">
                {/* Unread Alerts */}
                <div className="bg-blue-50/60 border border-blue-100 rounded-xl p-3.5 space-y-1">
                    <div className="text-xl font-black text-[#0052cc] leading-none">
                        {unread}
                    </div>
                    <div className="text-[10px] font-bold text-slate-600">
                        Unread Alerts
                    </div>
                </div>

                {/* High Priority */}
                <div className="bg-red-50/60 border border-red-100 rounded-xl p-3.5 space-y-1">
                    <div className="text-xl font-black text-red-600 leading-none">
                        {highPriority}
                    </div>
                    <div className="text-[10px] font-bold text-slate-600">
                        High Priority
                    </div>
                </div>

                {/* Policy Changes */}
                <div className="bg-blue-50/60 border border-blue-100 rounded-xl p-3.5 space-y-1">
                    <div className="text-xl font-black text-[#0052cc] leading-none">
                        {policyChanges}
                    </div>
                    <div className="text-[10px] font-bold text-slate-600">
                        Policy Changes
                    </div>
                </div>

                {/* Applications */}
                <div className="bg-blue-50/60 border border-blue-100 rounded-xl p-3.5 space-y-1">
                    <div className="text-xl font-black text-[#0052cc] leading-none">
                        {applications}
                    </div>
                    <div className="text-[10px] font-bold text-slate-600">
                        Applications
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SummaryHealthWidget;
