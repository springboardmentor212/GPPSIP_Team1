import React, { useState, useEffect } from 'react';
import { getTrends } from '../../services/analytics.service';
import { FaSpinner } from 'react-icons/fa';

const PerformanceTrendChart = ({ timeRange = '12m' }) => {
    const [trends, setTrends] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchTrends = async () => {
            setIsLoading(true);
            try {
                const res = await getTrends(timeRange);
                if (res.success && res.trends) {
                    setTrends(res.trends);
                }
            } catch (err) {
                console.error("Failed to fetch trends:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchTrends();
    }, [timeRange]);

    if (isLoading) {
        return (
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm h-56 flex justify-center items-center">
                <FaSpinner className="animate-spin text-[#0052cc] w-6 h-6" />
            </div>
        );
    }

    // Determine max value for scaling
    let maxVal = 10;
    trends.forEach(t => {
        if (t.policies > maxVal) maxVal = t.policies;
        if (t.schemes > maxVal) maxVal = t.schemes;
    });

    // Ensure we have 12 items to pad if backend returned fewer, though backend now returns exactly 12.
    const displayTrends = trends.slice(-12);

    return (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm select-none text-left space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">Policy & Scheme Growth Trend</h3>
                <div className="flex items-center gap-4 text-[10px] font-bold text-slate-500">
                    <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-sm bg-[#0052cc]" />
                        Policies
                    </span>
                    <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-sm bg-emerald-400" />
                        Schemes
                    </span>
                </div>
            </div>

            {/* Chart Area */}
            <div className="flex items-end gap-1.5 h-40">
                {displayTrends.map((t, i) => {
                    const polH = Math.round((t.policies / maxVal) * 100);
                    const schH = Math.round((t.schemes / maxVal) * 100);
                    return (
                        <div key={i} className="flex-1 flex flex-col items-center justify-end gap-0.5">
                            <div className="w-full flex items-end gap-0.5 justify-center">
                                {/* Schemes bar */}
                                <div
                                    className="rounded-t-sm bg-emerald-400 w-full"
                                    style={{ height: `${schH}%`, minHeight: schH > 0 ? 4 : 0 }}
                                />
                                {/* Policies bar */}
                                <div
                                    className="rounded-t-sm bg-[#0052cc] w-full"
                                    style={{ height: `${polH}%`, minHeight: polH > 0 ? 4 : 0 }}
                                />
                            </div>
                            <span className="text-[8px] font-bold text-slate-400 mt-1">{t.month}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default PerformanceTrendChart;
