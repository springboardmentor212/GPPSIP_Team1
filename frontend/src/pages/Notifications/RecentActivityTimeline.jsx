import React from 'react';
import { FaFileAlt, FaCheckCircle, FaFileContract } from 'react-icons/fa';

const RecentActivityTimeline = ({ onViewFullHistory }) => {
    const activities = [
        {
            id: 1,
            title: "Education Policy Published",
            subtitle: "Federal Council released new guidelines.",
            time: "20 minutes ago",
            icon: FaFileAlt,
            color: "bg-blue-100 text-blue-600 border-blue-200"
        },
        {
            id: 2,
            title: "Agriculture Subsidy Updated",
            subtitle: "Version 2.4 now effective immediately.",
            time: "4 hours ago",
            icon: FaCheckCircle,
            color: "bg-emerald-100 text-emerald-600 border-emerald-200"
        },
        {
            id: 3,
            title: "Grant Review Completed",
            subtitle: "Application #RTG-202 moved to final stage.",
            time: "Yesterday",
            icon: FaFileContract,
            color: "bg-blue-100 text-blue-600 border-blue-200"
        }
    ];

    return (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4 text-left">
            <h3 className="text-xs font-bold text-slate-800 tracking-tight">
                Recent Activity Timeline
            </h3>

            {/* Timeline items */}
            <div className="space-y-3.5 relative pl-1">
                {activities.map((item, idx) => {
                    const IconComp = item.icon;
                    return (
                        <div key={item.id} className="flex items-start gap-3 relative">
                            {/* Connector line between nodes except last item */}
                            {idx < activities.length - 1 && (
                                <div className="absolute left-3.5 top-6 bottom-0 w-0.5 bg-slate-200 -ml-[1px]" />
                            )}

                            {/* Circular node icon */}
                            <div className={`w-7 h-7 rounded-full border ${item.color} flex items-center justify-center shrink-0 z-10 text-xs`}>
                                <IconComp className="w-3.5 h-3.5" />
                            </div>

                            {/* Text content */}
                            <div className="space-y-0.5 pt-0.5">
                                <div className="text-xs font-bold text-slate-800 leading-tight">
                                    {item.title}
                                </div>
                                <div className="text-[11px] text-slate-500 font-normal leading-snug">
                                    {item.subtitle}
                                </div>
                                <div className="text-[10px] text-slate-400 font-medium pt-0.5">
                                    {item.time}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Bottom link */}
            <div className="pt-2 border-t border-slate-100 text-center">
                <button
                    onClick={onViewFullHistory}
                    className="text-[11px] font-bold text-[#0052cc] hover:underline cursor-pointer"
                >
                    View Full History
                </button>
            </div>
        </div>
    );
};

export default RecentActivityTimeline;
