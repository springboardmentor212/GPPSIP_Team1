import React from 'react';
import { FaLayerGroup, FaArrowRight } from 'react-icons/fa';

const ReportTemplatesWidget = ({ onSelectTemplate }) => {
    const templates = [
        {
            id: 'executive_summary_pro',
            title: 'Executive Summary Pro',
            bgGradient: 'from-[#0f172a] via-[#1e293b] to-[#0a369d]',
            subtitle: 'High-level policy metrics'
        },
        {
            id: 'deep_data_matrix',
            title: 'Deep Data Matrix',
            bgGradient: 'from-[#0284c7] via-[#0369a1] to-[#0f172a]',
            subtitle: 'Cross-sector telemetry'
        },
        {
            id: 'legislative_visualizer',
            title: 'Legislative Visualizer',
            bgGradient: 'from-[#1e1b4b] via-[#312e81] to-[#4338ca]',
            subtitle: 'AI statutory map'
        }
    ];

    return (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm select-none text-left space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h3 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                    <span>Report Templates</span>
                </h3>
                <span className="text-[10px] font-extrabold text-[#0052cc] uppercase bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                    Ready to Use
                </span>
            </div>

            {/* Templates Stack */}
            <div className="space-y-3">
                {templates.map((tpl) => (
                    <div
                        key={tpl.id}
                        onClick={() => onSelectTemplate(tpl)}
                        className={`relative rounded-xl overflow-hidden p-4 bg-gradient-to-r ${tpl.bgGradient} text-white shadow-sm hover:shadow-md transition-all cursor-pointer group flex items-center justify-between border border-white/10`}
                    >
                        {/* Background Decorative Mesh Shapes */}
                        <div className="absolute right-0 bottom-0 w-24 h-24 bg-white/10 rounded-full blur-xl pointer-events-none group-hover:scale-150 transition-transform duration-500" />

                        <div className="relative z-10 space-y-0.5">
                            <div className="text-sm font-black tracking-tight text-white group-hover:text-blue-100 transition-colors">
                                {tpl.title}
                            </div>
                            <div className="text-[11px] font-medium text-slate-300">
                                {tpl.subtitle}
                            </div>
                        </div>

                        <div className="relative z-10 w-7 h-7 rounded-lg bg-white/15 group-hover:bg-white text-white group-hover:text-[#0052cc] flex items-center justify-center transition-all shrink-0">
                            <FaArrowRight className="w-3 h-3" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ReportTemplatesWidget;
