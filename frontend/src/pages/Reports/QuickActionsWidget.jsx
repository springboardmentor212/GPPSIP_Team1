import React from 'react';
import { FaFileExport, FaBuilding, FaEye } from 'react-icons/fa';

const actions = [
    { label: 'Generate Full Report', icon: FaFileExport, onClick: 'fullReport' },
    { label: 'Compare Departments', icon: FaBuilding, onClick: 'compare' },
    { label: 'View Archive Policies', icon: FaEye, onClick: 'archive' }
];

const QuickActionsWidget = ({ onAction }) => {
    return (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm select-none text-left space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">Quick Actions</h3>

            <div className="space-y-2">
                {actions.map((act) => {
                    const IconComp = act.icon;
                    return (
                        <button
                            key={act.label}
                            onClick={() => onAction && onAction(act.onClick)}
                            className="w-full flex items-center justify-between gap-3 bg-slate-50 hover:bg-blue-50/60 border border-slate-200 hover:border-blue-300 rounded-xl px-4 py-2.5 text-xs font-extrabold text-slate-700 hover:text-[#0052cc] transition-all cursor-pointer group"
                        >
                            <div className="flex items-center gap-2.5">
                                <IconComp className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#0052cc] transition-colors" />
                                <span>{act.label}</span>
                            </div>
                            <span className="text-slate-300 group-hover:text-[#0052cc] transition-colors">→</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default QuickActionsWidget;
