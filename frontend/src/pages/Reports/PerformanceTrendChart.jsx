import React from 'react';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Static bar data: [current, previous]
const barData = [
    [65, 50], [70, 60], [60, 72], [80, 55], [75, 68], [90, 80],
    [85, 70], [78, 65], [88, 74], [92, 85], [80, 70], [95, 82]
];

const PerformanceTrendChart = () => {
    const maxVal = 100;
    return (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm select-none text-left space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">Department Performance Trend</h3>
                <div className="flex items-center gap-4 text-[10px] font-bold text-slate-500">
                    <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-sm bg-[#0052cc]" />
                        Current
                    </span>
                    <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-sm bg-blue-200" />
                        Previous
                    </span>
                </div>
            </div>

            {/* Chart Area */}
            <div className="flex items-end gap-1.5 h-40">
                {barData.map(([cur, prev], i) => {
                    const curH = Math.round((cur / maxVal) * 100);
                    const prevH = Math.round((prev / maxVal) * 100);
                    return (
                        <div key={i} className="flex-1 flex flex-col items-center justify-end gap-0.5">
                            <div className="w-full flex items-end gap-0.5 justify-center">
                                {/* Previous bar */}
                                <div
                                    className="rounded-t-sm bg-blue-200 w-full"
                                    style={{ height: `${prevH}%`, minHeight: 4 }}
                                />
                                {/* Current bar */}
                                <div
                                    className="rounded-t-sm bg-[#0052cc] w-full"
                                    style={{ height: `${curH}%`, minHeight: 4 }}
                                />
                            </div>
                            <span className="text-[8px] font-bold text-slate-400 mt-1">{months[i]}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default PerformanceTrendChart;
