import React from 'react';
import { FaFilePdf, FaFileExcel, FaCloud } from 'react-icons/fa';

const RecentExportActivity = () => {
    const activities = [
        {
            id: 1,
            type: 'pdf',
            title: 'PDF Export Completed',
            desc: '"Q3 Housing Policy Compliance" was exported and sent to 4 stakeholders.',
            time: '2 mins ago',
            icon: FaFilePdf,
            color: 'bg-blue-500 text-white'
        },
        {
            id: 2,
            type: 'excel',
            title: 'Excel Dataset Generated',
            desc: 'Citizen Eligibility raw data exported for the Min. of Welfare audit.',
            time: '45 mins ago',
            icon: FaFileExcel,
            color: 'bg-emerald-500 text-white'
        },
        {
            id: 3,
            type: 'cloud',
            title: 'Cloud Backup Sync',
            desc: 'Automated archive of all October reports completed successfully.',
            time: '2 hours ago',
            icon: FaCloud,
            color: 'bg-slate-400 text-white'
        }
    ];

    return (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm select-none text-left space-y-4">
            <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
                Recent Export Activity
            </h3>

            <div className="space-y-4 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {activities.map((act) => {
                    const IconComp = act.icon;
                    return (
                        <div key={act.id} className="flex items-start gap-3.5 relative z-10">
                            <div className={`w-8 h-8 rounded-full ${act.color} flex items-center justify-center shrink-0 shadow-sm ring-4 ring-white`}>
                                <IconComp className="w-3.5 h-3.5" />
                            </div>
                            <div className="flex-grow min-w-0 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                                <div className="space-y-0.5">
                                    <div className="text-xs font-extrabold text-slate-900">
                                        {act.title}
                                    </div>
                                    <div className="text-xs text-slate-500 font-medium leading-relaxed">
                                        {act.desc}
                                    </div>
                                </div>
                                <div className="text-[10px] font-bold text-slate-400 shrink-0">
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

export default RecentExportActivity;
