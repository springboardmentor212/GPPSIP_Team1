import React from 'react';
import {
    FaFileAlt,
    FaChartPie,
    FaUsers,
    FaBuilding,
    FaComments,
    FaChartLine
} from 'react-icons/fa';

const QuickReportGrid = ({ onGenerateReport }) => {
    const quickReports = [
        {
            id: 'compliance',
            title: 'Policy Compliance',
            desc: 'Detailed breakdown of organizational adherence to federal privacy codes.',
            icon: FaFileAlt,
            iconBg: 'bg-blue-50 text-[#0052cc]'
        },
        {
            id: 'scheme_efficacy',
            title: 'Scheme Efficacy',
            desc: 'Tracking fund allocation and delivery success rates for social programs.',
            icon: FaChartPie,
            iconBg: 'bg-sky-50 text-sky-600'
        },
        {
            id: 'user_behavior',
            title: 'User Behavior',
            desc: 'Analysis of platform engagement across departments and regions.',
            icon: FaUsers,
            iconBg: 'bg-purple-50 text-purple-600'
        },
        {
            id: 'departmental_audit',
            title: 'Departmental Audit',
            desc: 'Inter-departmental comparison of data handling and response times.',
            icon: FaBuilding,
            iconBg: 'bg-indigo-50 text-indigo-600'
        },
        {
            id: 'citizen_feedback',
            title: 'Citizen Feedback',
            desc: 'Aggregated sentiment analysis from public policy consultation portals.',
            icon: FaComments,
            iconBg: 'bg-cyan-50 text-cyan-600'
        },
        {
            id: 'trend_forecasting',
            title: 'Trend Forecasting',
            desc: 'AI-driven projections for legislative impacts in the coming quarter.',
            icon: FaChartLine,
            iconBg: 'bg-[#0052cc]/10 text-[#0052cc]'
        }
    ];

    return (
        <div className="space-y-4 select-none">
            <div className="flex items-center justify-between text-left">
                <h2 className="text-base sm:text-lg font-black text-slate-800 tracking-tight">
                    Quick Report Generation
                </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {quickReports.map((report) => {
                    const IconComp = report.icon;
                    return (
                        <div
                            key={report.id}
                            className="bg-white border border-slate-200 hover:border-slate-300 rounded-2xl p-5 shadow-sm text-left flex flex-col justify-between space-y-4 group transition-all hover:shadow-md"
                        >
                            <div className="space-y-3">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${report.iconBg} transition-transform group-hover:scale-105`}>
                                    <IconComp className="w-5 h-5" />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">
                                        {report.title}
                                    </h3>
                                    <p className="text-xs text-slate-500 font-medium leading-relaxed">
                                        {report.desc}
                                    </p>
                                </div>
                            </div>

                            <div className="pt-2 border-t border-slate-100">
                                <button
                                    onClick={() => onGenerateReport(report)}
                                    className="w-full py-2 bg-blue-50/80 hover:bg-[#0052cc] text-[#0052cc] hover:text-white rounded-xl text-xs font-extrabold transition-all cursor-pointer text-center"
                                >
                                    Generate
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default QuickReportGrid;
