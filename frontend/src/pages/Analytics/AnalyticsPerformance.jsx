import React from 'react';
import { FaFileAlt, FaCheckCircle, FaUserCheck, FaRobot } from 'react-icons/fa';

const AnalyticsPerformance = ({ onDeepAnalysis }) => {
    const departments = [
        { name: "Min. of IT & Communications", percentage: 88, color: "bg-blue-600" },
        { name: "Finance Ministry", percentage: 74, color: "bg-blue-600" },
        { name: "Health Department", percentage: 92, color: "bg-emerald-500" },
        { name: "Urban Development", percentage: 61, color: "bg-purple-600" }
    ];

    const recentActivities = [
        {
            id: 1,
            title: "New Policy Uploaded",
            desc: "Digital Infrastructure 2024",
            time: "14:20 PM",
            icon: FaFileAlt,
            iconBg: "bg-blue-100 text-blue-600"
        },
        {
            id: 2,
            title: "Policy Approved",
            desc: "Fintech Regulation Act",
            time: "11:45 AM",
            icon: FaCheckCircle,
            iconBg: "bg-emerald-100 text-emerald-600"
        },
        {
            id: 3,
            title: "User Registration",
            desc: "50+ New Analysts onboarded",
            time: "09:42 AM",
            icon: FaUserCheck,
            iconBg: "bg-purple-100 text-purple-600"
        }
    ];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 select-none">

            {/* Department Performance (4 Cols) */}
            <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm text-left flex flex-col justify-between space-y-4">
                <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">
                    Department Performance
                </h3>

                <div className="space-y-4 flex-grow flex flex-col justify-center">
                    {departments.map((dept, idx) => (
                        <div key={idx} className="space-y-1.5">
                            <div className="flex justify-between text-xs font-bold">
                                <span className="text-slate-700 truncate">{dept.name}</span>
                                <span className="text-slate-800 shrink-0">{dept.percentage}%</span>
                            </div>
                            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                <div
                                    className={`h-full ${dept.color} rounded-full transition-all duration-500`}
                                    style={{ width: `${dept.percentage}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Recent Activity (4 Cols) */}
            <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm text-left flex flex-col justify-between space-y-4">
                <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">
                    Recent Activity
                </h3>

                <div className="space-y-3 flex-grow flex flex-col justify-center">
                    {recentActivities.map((act) => {
                        const IconComponent = act.icon;
                        return (
                            <div key={act.id} className="flex items-start gap-3">
                                <div className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs shrink-0 ${act.iconBg}`}>
                                    <IconComponent className="w-3.5 h-3.5" />
                                </div>
                                <div className="min-w-0 flex-grow">
                                    <div className="text-xs font-bold text-slate-900 leading-tight">
                                        {act.title}
                                    </div>
                                    <div className="text-[11px] font-semibold text-slate-500 truncate">
                                        {act.desc}
                                    </div>
                                    <div className="text-[10px] text-slate-400 font-medium pt-0.5">
                                        {act.time}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* AI Insights Callout Box (4 Cols) */}
            <div className="lg:col-span-4 bg-gradient-to-br from-[#0052cc] to-[#1d4ed8] text-white border border-blue-600 rounded-2xl p-5 shadow-md text-left flex flex-col justify-between space-y-4 relative overflow-hidden">
                {/* Background SVG glow */}
                <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />

                <div className="space-y-3 relative z-10">
                    <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-blue-200">
                        <FaRobot className="w-4 h-4 text-blue-200" />
                        <span>AI Insights</span>
                    </div>

                    <div className="space-y-2 text-xs text-blue-50 font-normal leading-relaxed">
                        <div className="flex items-start gap-2">
                            <span className="text-emerald-300 font-bold">•</span>
                            <p>Education policies increased by 18% this quarter.</p>
                        </div>
                        <div className="flex items-start gap-2">
                            <span className="text-amber-300 font-bold">•</span>
                            <p>System latency detected in IT Section 3 during peak hours.</p>
                        </div>
                        <div className="flex items-start gap-2">
                            <span className="text-blue-200 font-bold">•</span>
                            <p>Fintech Regulation Act remains high priority.</p>
                        </div>
                    </div>
                </div>

                <div className="pt-2 relative z-10">
                    <button
                        onClick={onDeepAnalysis}
                        className="w-full py-2 bg-white/15 hover:bg-white/25 border border-white/30 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                    >
                        Deep Analysis
                    </button>
                </div>
            </div>

        </div>
    );
};

export default AnalyticsPerformance;
