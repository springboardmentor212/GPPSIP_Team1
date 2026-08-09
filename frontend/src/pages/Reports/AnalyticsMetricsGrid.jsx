import React from 'react';
import {
    FaBuilding,
    FaFileAlt,
    FaCheckCircle,
    FaThumbsUp,
    FaUsers,
    FaClock,
    FaArrowUp,
    FaArrowDown
} from 'react-icons/fa';

const metrics = [
    {
        label: 'Total Departments', value: '24',
        delta: '+2', deltaUp: true,
        icon: FaBuilding, iconBg: 'bg-blue-50 text-[#0052cc]'
    },
    {
        label: 'Active Policies', value: '1,482',
        delta: '+3%', deltaUp: true,
        icon: FaFileAlt, iconBg: 'bg-indigo-50 text-indigo-600'
    },
    {
        label: 'Published Index', value: '84',
        delta: '-2%', deltaUp: false,
        icon: FaCheckCircle, iconBg: 'bg-emerald-50 text-emerald-600'
    },
    {
        label: 'Approval Rate', value: '92.4%',
        delta: '+1.2%', deltaUp: true,
        icon: FaThumbsUp, iconBg: 'bg-cyan-50 text-cyan-600'
    },
    {
        label: 'Citizen Reach', value: '12.4M',
        delta: '+8%', deltaUp: true,
        icon: FaUsers, iconBg: 'bg-purple-50 text-purple-600'
    },
    {
        label: 'Avg. Process Time', value: '14d',
        delta: '+1d', deltaUp: false,
        icon: FaClock, iconBg: 'bg-amber-50 text-amber-600'
    }
];

const AnalyticsMetricsGrid = () => {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 select-none text-left">
            {metrics.map((m) => {
                const IconComp = m.icon;
                return (
                    <div
                        key={m.label}
                        className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col justify-between space-y-3"
                    >
                        <div className="flex items-center justify-between">
                            <div className={`w-8 h-8 rounded-xl ${m.iconBg} flex items-center justify-center shrink-0`}>
                                <IconComp className="w-4 h-4" />
                            </div>
                            <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-extrabold ${m.deltaUp
                                    ? 'bg-emerald-50 border border-emerald-200 text-emerald-600'
                                    : 'bg-rose-50 border border-rose-200 text-rose-600'
                                }`}>
                                {m.deltaUp ? <FaArrowUp className="w-2 h-2" /> : <FaArrowDown className="w-2 h-2" />}
                                {m.delta}
                            </span>
                        </div>
                        <div className="space-y-0.5">
                            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">{m.label}</span>
                            <span className="text-xl font-black text-slate-900 tracking-tight">{m.value}</span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default AnalyticsMetricsGrid;
