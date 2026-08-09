import React from 'react';
import { FaCheckCircle, FaComment, FaCog } from 'react-icons/fa';

const SupportActivityFeed = () => {
    const activities = [
        {
            id: 1,
            title: 'Ticket #TKT-4812 Resolved',
            desc: "Marcus Wright's query on Agri-Subsidies has been closed by Officer Chen.",
            time: '14 minutes ago',
            icon: FaCheckCircle,
            iconBg: 'bg-emerald-100 text-emerald-600'
        },
        {
            id: 2,
            title: 'New Comment on #TKT-4092',
            desc: 'Johnathan Doe uploaded a screenshot of the verification error message.',
            time: '1 hour ago',
            icon: FaComment,
            iconBg: 'bg-blue-100 text-[#0052cc]'
        },
        {
            id: 3,
            title: 'System Audit Completed',
            desc: 'Weekly feedback summary generated and sent to Ministry of Digital Affairs.',
            time: '4 hours ago',
            icon: FaCog,
            iconBg: 'bg-purple-100 text-purple-600'
        }
    ];

    return (
        <div className="space-y-4 text-left select-none">
            <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
                Recent Support Activity
            </h3>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
                {activities.map((act) => {
                    const IconComp = act.icon;
                    return (
                        <div key={act.id} className="flex items-start gap-3.5">
                            <div className={`w-8 h-8 rounded-xl ${act.iconBg} flex items-center justify-center shrink-0`}>
                                <IconComp className="w-4 h-4" />
                            </div>
                            <div className="flex-grow min-w-0 space-y-0.5">
                                <div className="text-xs font-extrabold text-slate-900">
                                    {act.title}
                                </div>
                                <div className="text-xs text-slate-500 font-medium leading-relaxed">
                                    {act.desc}
                                </div>
                                <div className="text-[10px] font-bold text-slate-400 pt-0.5">
                                    {act.time}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default SupportActivityFeed;
