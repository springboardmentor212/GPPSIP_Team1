import React from 'react';

const segments = [
    { label: 'Welfare', percent: 42, color: '#0052cc' },
    { label: 'Health', percent: 22, color: '#3b82f6' },
    { label: 'Education', percent: 18, color: '#93c5fd' },
    { label: 'Other', percent: 18, color: '#dbeafe' }
];

// Build conic-gradient string
const buildGradient = () => {
    let result = [];
    let cumulative = 0;
    segments.forEach((seg) => {
        result.push(`${seg.color} ${cumulative}% ${cumulative + seg.percent}%`);
        cumulative += seg.percent;
    });
    return `conic-gradient(${result.join(', ')})`;
};

const CategoryDistributionChart = () => {
    return (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm select-none text-left space-y-4">
            {/* Header */}
            <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">Policy Category Distribution</h3>

            {/* Donut Chart & Legend */}
            <div className="flex flex-col sm:flex-row items-center gap-6">
                {/* Donut Ring */}
                <div className="relative shrink-0">
                    <div
                        className="w-32 h-32 rounded-full"
                        style={{ background: buildGradient() }}
                    />
                    {/* Center hole */}
                    <div className="absolute inset-[18%] rounded-full bg-white flex flex-col items-center justify-center">
                        <span className="text-xl font-black text-slate-900 leading-none">1,482</span>
                        <span className="text-[9px] font-bold text-slate-400 text-center">Active Policies</span>
                    </div>
                </div>

                {/* Legend */}
                <div className="space-y-2 text-xs w-full">
                    {segments.map((seg) => (
                        <div key={seg.label} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: seg.color }} />
                                <span className="font-semibold text-slate-600">{seg.label}</span>
                            </div>
                            <span className="font-extrabold text-slate-800">{seg.percent}%</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CategoryDistributionChart;
