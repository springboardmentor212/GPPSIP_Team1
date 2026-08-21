import React, { useState, useEffect } from 'react';
import {
    FaBuilding,
    FaFileAlt,
    FaCheckCircle,
    FaThumbsUp,
    FaUsers,
    FaClock,
    FaArrowUp,
    FaArrowDown,
    FaSpinner
} from 'react-icons/fa';
import { getKPIs } from '../../services/analytics.service';

const AnalyticsMetricsGrid = ({ timeRange = '30d' }) => {
    const [kpis, setKpis] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchKPIs = async () => {
            setIsLoading(true);
            try {
                const res = await getKPIs(timeRange);
                if (res.success && res.kpis) {
                    setKpis(res.kpis);
                }
            } catch (err) {
                console.error("Failed to fetch KPIs:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchKPIs();
    }, [timeRange]);

    if (isLoading || !kpis) {
        return (
            <div className="flex justify-center items-center h-24">
                <FaSpinner className="animate-spin text-[#0052cc] w-6 h-6" />
            </div>
        );
    }

    const metrics = [
        {
            label: 'Total Schemes', value: kpis.totalSchemes,
            delta: '+2', deltaUp: true,
            icon: FaBuilding, iconBg: 'bg-blue-50 text-[#0052cc]'
        },
        {
            label: 'Active Policies', value: kpis.totalPolicies,
            delta: '+3%', deltaUp: true,
            icon: FaFileAlt, iconBg: 'bg-indigo-50 text-indigo-600'
        },
        {
            label: 'Total Applications', value: kpis.totalApplications,
            delta: '+12%', deltaUp: true,
            icon: FaCheckCircle, iconBg: 'bg-emerald-50 text-emerald-600'
        },
        {
            label: 'Approval Rate', value: `${kpis.approvalRate}%`,
            delta: '+1.2%', deltaUp: kpis.approvalRate >= 50,
            icon: FaThumbsUp, iconBg: 'bg-cyan-50 text-cyan-600'
        },
        {
            label: 'Citizen Reach', value: kpis.citizenReach,
            delta: '+8%', deltaUp: true,
            icon: FaUsers, iconBg: 'bg-purple-50 text-purple-600'
        },
        {
            label: 'Avg. Process Time', value: `${kpis.avgProcessingTime}d`,
            delta: '-1d', deltaUp: true,
            icon: FaClock, iconBg: 'bg-amber-50 text-amber-600'
        }
    ];

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 select-none text-left">
            {metrics.map((m) => {
                const IconComp = m.icon;
                return (
                    <div
                        key={m.label}
                        className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col justify-between space-y-3"
                    >
                        <div className="flex items-center justify-between">
                            <div className={`w-8 h-8 rounded-xl ${m.iconBg} flex items-center justify-center shrink-0`}>
                                <IconComp className="w-4 h-4" />
                            </div>
                            <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-extrabold ${m.deltaUp
                                    ? 'bg-emerald-50 border border-emerald-200 text-emerald-600'
                                    : 'bg-rose-50 border border-rose-200 text-rose-600'
                                }`}>
                                {m.deltaUp ? <FaArrowUp className="w-2 h-2" /> : <FaArrowDown className="w-2 h-2" />}
                                {m.delta}
                            </span>
                        </div>
                        <div className="space-y-0.5">
                            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">{m.label}</span>
                            <span className="text-xl font-black text-slate-900 tracking-tight">{m.value}</span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default AnalyticsMetricsGrid;
