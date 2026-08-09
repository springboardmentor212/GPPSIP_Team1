import React from 'react';

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
// Engagement data (0-100 normalised)
const engData = [42, 55, 38, 78, 65, 30, 20];

const CitizenEngagementChart = () => {
    const max = Math.max(...engData);
    const width = 280;
    const height = 80;

    const points = engData.map((v, i) => {
        const x = (i / (engData.length - 1)) * width;
        const y = height - (v / max) * (height - 10);
        return `${x},${y}`;
    });

    const polyline = points.join(' ');
    const areaPath = `M0,${height} L${points.join(' L')} L${width},${height} Z`;

    return (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm select-none text-left space-y-4">
            <div className="space-y-1">
                <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">Citizen Engagement Analytics</h3>
                <p className="text-[10px] text-slate-400 font-medium">Peak activity visualisation for your scheme launches.</p>
            </div>

            <div className="w-full overflow-hidden">
                <svg viewBox={`0 0 ${width} ${height + 20}`} preserveAspectRatio="none" className="w-full h-24">
                    <defs>
                        <linearGradient id="engGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#0052cc" stopOpacity="0.15" />
                            <stop offset="100%" stopColor="#0052cc" stopOpacity="0" />
                        </linearGradient>
                    </defs>
                    {/* Fill area */}
                    <path d={areaPath} fill="url(#engGrad)" />
                    {/* Line */}
                    <polyline points={polyline} fill="none" stroke="#0052cc" strokeWidth="2" strokeLinejoin="round" />
                    {/* Data points */}
                    {engData.map((v, i) => {
                        const x = (i / (engData.length - 1)) * width;
                        const y = height - (v / max) * (height - 10);
                        return <circle key={i} cx={x} cy={y} r="3" fill="#0052cc" />;
                    })}
                    {/* X Axis labels */}
                    {days.map((d, i) => {
                        const x = (i / (days.length - 1)) * width;
                        return (
                            <text key={d} x={x} y={height + 16} fontSize="8" textAnchor="middle" fill="#94a3b8" fontWeight="600">
                                {d}
                            </text>
                        );
                    })}
                </svg>
            </div>
        </div>
    );
};

export default CitizenEngagementChart;
