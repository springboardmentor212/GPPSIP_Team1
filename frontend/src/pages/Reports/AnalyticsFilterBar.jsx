import React from 'react';
import { FaFilter, FaColumns } from 'react-icons/fa';

const AnalyticsFilterBar = ({
    department, onDepartmentChange,
    status, onStatusChange,
    period, onPeriodChange,
    category, onCategoryChange,
    onCompare
}) => {
    return (
        <div className="bg-white border border-slate-200 rounded-2xl p-3 sm:p-4 shadow-sm select-none text-left flex flex-col md:flex-row items-center justify-between gap-3">
            {/* Filter Dropdowns */}
            <div className="flex flex-wrap items-center gap-2.5">
                <select
                    value={department}
                    onChange={(e) => onDepartmentChange(e.target.value)}
                    className="bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
                >
                    <option value="all">All Departments</option>
                    <option value="education">Education</option>
                    <option value="healthcare">Healthcare</option>
                    <option value="agriculture">Agriculture</option>
                    <option value="housing">Housing & Urban</option>
                    <option value="finance">Finance</option>
                </select>

                <select
                    value={status}
                    onChange={(e) => onStatusChange(e.target.value)}
                    className="bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
                >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="published">Published</option>
                </select>

                <select
                    value={period}
                    onChange={(e) => onPeriodChange(e.target.value)}
                    className="bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
                >
                    <option value="30d">Last 30 Days</option>
                    <option value="7d">Last 7 Days</option>
                    <option value="90d">Last 90 Days</option>
                    <option value="1y">Last Year</option>
                </select>

                <select
                    value={category}
                    onChange={(e) => onCategoryChange(e.target.value)}
                    className="bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
                >
                    <option value="all">All Categories</option>
                    <option value="welfare">Welfare</option>
                    <option value="health">Health</option>
                    <option value="education">Education</option>
                </select>
            </div>

            {/* Compare Button */}
            <button
                onClick={onCompare}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all shadow-sm cursor-pointer shrink-0"
            >
                <FaColumns className="w-3.5 h-3.5" />
                <span>Compare Department</span>
            </button>
        </div>
    );
};

export default AnalyticsFilterBar;
