import React, { useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';

const AnalyticsCharts = () => {
    const [timeRange, setTimeRange] = useState("12m");

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 select-none">

            {/* Policy Growth Line Chart (8 Cols) */}
            <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm text-left flex flex-col justify-between">
                {/* Header */}
                <div className="flex items-center justify-between pb-2">
                    <div className="space-y-0.5">
                        <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">
                            Policy Growth
                        </h3>
                        <p className="text-[11px] font-medium text-slate-400">
                            Policy submissions over the last 12 months
                        </p>
                    </div>

                    <div className="relative">
                        <select
                            value={timeRange}
                            onChange={(e) => setTimeRange(e.target.value)}
                            className="appearance-none bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl px-3 py-1.5 pr-7 text-[11px] font-bold text-slate-700 focus:outline-none cursor-pointer"
                        >
                            <option value="12m">Last 12 Months</option>
                            <option value="6m">Last 6 Months</option>
                            <option value="30d">Last 30 Days</option>
                        </select>
                        <FaChevronDown className="w-2.5 h-2.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                </div>

                {/* Curved Line Graph SVG */}
                <div className="py-6 flex-grow flex flex-col justify-end">
                    <div className="w-full h-44 relative">
                        <svg viewBox="0 0 500 150" className="w-full h-full overflow-visible">
                            {/* Background horizontal grid lines */}
                            <line x1="0" y1="30" x2="500" y2="30" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4" />
                            <line x1="0" y1="75" x2="500" y2="75" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4" />
                            <line x1="0" y1="120" x2="500" y2="120" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4" />

                            {/* Gradient Fill under path */}
                            <defs>
                                <linearGradient id="growthGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#0052cc" stopOpacity="0.25" />
                                    <stop offset="100%" stopColor="#0052cc" stopOpacity="0.0" />
                                </linearGradient>
                            </defs>

                            <path
                                d="M 0,110 C 70,110 120,60 180,75 C 240,90 280,30 350,50 C 400,65 440,20 500,35 L 500,150 L 0,150 Z"
                                fill="url(#growthGradient)"
                            />

                            {/* Smooth Main Line */}
                            <path
                                d="M 0,110 C 70,110 120,60 180,75 C 240,90 280,30 350,50 C 400,65 440,20 500,35"
                                fill="none"
                                stroke="#0052cc"
                                strokeWidth="3.5"
                                strokeLinecap="round"
                            />

                            {/* Highlight Dot on Peak */}
                            <circle cx="440" cy="20" r="5" fill="#0052cc" stroke="#ffffff" strokeWidth="2" />
                        </svg>
                    </div>

                    {/* Month X-Axis Labels */}
                    <div className="flex justify-between text-[11px] font-semibold text-slate-400 pt-3 border-t border-slate-100">
                        <span>Jan</span>
                        <span>Mar</span>
                        <span>May</span>
                        <span>Jul</span>
                        <span>Sep</span>
                        <span>Nov</span>
                    </div>
                </div>
            </div>

            {/* Policy Categories Donut Chart (4 Cols) */}
            <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm text-left flex flex-col justify-between">
                <h3 className="text-sm font-extrabold text-slate-900 tracking-tight pb-2">
                    Policy Categories
                </h3>

                {/* Center Donut Chart */}
                <div className="py-2 flex items-center justify-center relative">
                    <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 100 100">
                        {/* Background Circle */}
                        <circle cx="50" cy="50" r="38" stroke="#f1f5f9" strokeWidth="14" fill="transparent" />

                        {/* Segment 1: Finance (42%) */}
                        <circle
                            cx="50"
                            cy="50"
                            r="38"
                            stroke="#0052cc"
                            strokeWidth="14"
                            strokeDasharray="238.7"
                            strokeDashoffset="138.4"
                            fill="transparent"
                        />
                        {/* Segment 2: Healthcare (28%) */}
                        <circle
                            cx="50"
                            cy="50"
                            r="38"
                            stroke="#2563eb"
                            strokeWidth="14"
                            strokeDasharray="238.7"
                            strokeDashoffset="171.8"
                            transform="rotate(151.2 50 50)"
                            fill="transparent"
                        />
                        {/* Segment 3: Education (18%) */}
                        <circle
                            cx="50"
                            cy="50"
                            r="38"
                            stroke="#60a5fa"
                            strokeWidth="14"
                            strokeDasharray="238.7"
                            strokeDashoffset="195.7"
                            transform="rotate(252 50 50)"
                            fill="transparent"
                        />
                    </svg>

                    {/* Donut Center Label */}
                    <div className="absolute flex flex-col items-center justify-center text-center">
                        <span className="text-xl font-black text-slate-900 leading-none">14</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Categories</span>
                    </div>
                </div>

                {/* Legend */}
                <div className="space-y-2 pt-2 border-t border-slate-100 text-xs font-semibold">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#0052cc]" />
                            <span className="text-slate-600">Finance</span>
                        </div>
                        <span className="font-bold text-slate-800">42%</span>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#2563eb]" />
                            <span className="text-slate-600">Healthcare</span>
                        </div>
                        <span className="font-bold text-slate-800">28%</span>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#60a5fa]" />
                            <span className="text-slate-600">Education</span>
                        </div>
                        <span className="font-bold text-slate-800">18%</span>
                    </div>
                </div>

            </div>

        </div>
    );
};

export default AnalyticsCharts;
