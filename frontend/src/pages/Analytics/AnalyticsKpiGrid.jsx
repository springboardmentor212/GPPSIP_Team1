import React from 'react';
import {
    FaFileAlt,
    FaLandmark,
    FaUserFriends,
    FaClipboardCheck,
    FaSearch,
    FaSmile,
    FaArrowUp,
    FaArrowDown
} from 'react-icons/fa';

const AnalyticsKpiGrid = () => {
    const kpis = [
        {
            id: 1,
            title: "Total Policies",
            value: "1,482",
            change: "+8%",
            isPositive: true,
            icon: FaFileAlt,
            accentColor: "border-b-blue-600 text-blue-600 bg-blue-50"
        },
        {
            id: 2,
            title: "Total Schemes",
            value: "435",
            change: "+12%",
            isPositive: true,
            icon: FaLandmark,
            accentColor: "border-b-blue-600 text-blue-600 bg-blue-50"
        },
        {
            id: 3,
            title: "Active Users",
            value: "8.2k",
            change: "+24%",
            isPositive: true,
            icon: FaUserFriends,
            accentColor: "border-b-purple-600 text-purple-600 bg-purple-50"
        },
        {
            id: 4,
            title: "Applications",
            value: "12,401",
            change: "-3%",
            isPositive: false,
            icon: FaClipboardCheck,
            accentColor: "border-b-blue-600 text-blue-600 bg-blue-50"
        },
        {
            id: 5,
            title: "Monthly Searches",
            value: "156k",
            change: "+16%",
            isPositive: true,
            icon: FaSearch,
            accentColor: "border-b-blue-600 text-blue-600 bg-blue-50"
        },
        {
            id: 6,
            title: "Citizen Satisfaction",
            value: "94.8%",
            change: "+2.1%",
            isPositive: true,
            icon: FaSmile,
            accentColor: "border-b-emerald-500 text-emerald-600 bg-emerald-50"
        }
    ];

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 select-none">
            {kpis.map((kpi) => {
                const IconComp = kpi.icon;
                return (
                    <div
                        key={kpi.id}
                        className={`bg-white border border-slate-200 rounded-2xl p-4 shadow-sm text-left flex flex-col justify-between border-b-4 ${kpi.accentColor.split(' ')[0]}`}
                    >
                        {/* Header line: Icon + Change badge */}
                        <div className="flex items-center justify-between">
                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs ${kpi.accentColor.split(' ').slice(1).join(' ')}`}>
                                <IconComp className="w-4 h-4" />
                            </div>

                            <div className={`flex items-center gap-0.5 text-[10px] font-extrabold ${kpi.isPositive ? 'text-emerald-600' : 'text-rose-500'
                                }`}>
                                {kpi.isPositive ? <FaArrowUp className="w-2.5 h-2.5" /> : <FaArrowDown className="w-2.5 h-2.5" />}
                                <span>{kpi.change}</span>
                            </div>
                        </div>

                        {/* Value & Label */}
                        <div className="pt-3 space-y-0.5">
                            <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                                {kpi.value}
                            </div>
                            <div className="text-[11px] font-semibold text-slate-400">
                                {kpi.title}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default AnalyticsKpiGrid;
