import React from 'react';

const depts = [
    { name: 'Education', count: 342, color: '#0052cc' },
    { name: 'Healthcare', count: 283, color: '#2563eb' },
    { name: 'Agriculture', count: 198, color: '#3b82f6' },
    { name: 'Housing & Urban', count: 134, color: '#60a5fa' }
];

const max = Math.max(...depts.map((d) => d.count));

const PublishedPoliciesWidget = () => {
    return (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm select-none text-left space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">Policies Published by Department</h3>

            <div className="space-y-3">
                {depts.map((dept) => {
                    const pct = Math.round((dept.count / max) * 100);
                    return (
                        <div key={dept.name} className="space-y-1">
                            <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                                <span>{dept.name}</span>
                                <span className="font-extrabold text-slate-900">{dept.count}</span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-2">
                                <div
                                    className="h-2 rounded-full transition-all duration-500"
                                    style={{ width: `${pct}%`, background: dept.color }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default PublishedPoliciesWidget;
