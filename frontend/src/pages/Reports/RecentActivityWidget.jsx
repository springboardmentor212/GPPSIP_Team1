import React from 'react';
import { FaFileAlt, FaClipboardCheck, FaBell, FaChartLine } from 'react-icons/fa';

const activities = [
    { icon: FaFileAlt, iconBg: 'bg-blue-100 text-[#0052cc]', label: 'New Policy Report', desc: 'Education Q2 policy report generated', time: '2m ago' },
    { icon: FaClipboardCheck, iconBg: 'bg-emerald-100 text-emerald-600', label: 'Audit Completed', desc: 'Healthcare facility audit marked complete', time: '1h ago' },
    { icon: FaBell, iconBg: 'bg-amber-100 text-amber-600', label: 'Scheme Notifier', desc: 'Agriculture scheme renewal alert sent', time: '3h ago' },
    { icon: FaChartLine, iconBg: 'bg-purple-100 text-purple-600', label: 'Data Analysis', desc: 'Citizen engagement weekly analysis run', time: '5h ago' },
];

const RecentActivityWidget = () => {
    return (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm select-none text-left space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">Recent Activity</h3>

            <div className="space-y-3">
                {activities.map((act, i) => {
                    const IconComp = act.icon;
                    return (
                        <div key={i} className="flex items-start gap-3">
                            <div className={`w-8 h-8 rounded-xl ${act.iconBg} flex items-center justify-center shrink-0`}>
                                <IconComp className="w-3.5 h-3.5" />
                            </div>
                            <div className="min-w-0 space-y-0.5 flex-grow">
                                <div className="text-xs font-extrabold text-slate-900">{act.label}</div>
                                <div className="text-[10px] font-medium text-slate-500 leading-relaxed">{act.desc}</div>
                            </div>
                            <span className="text-[10px] font-bold text-slate-400 shrink-0">{act.time}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default RecentActivityWidget;
