import React from 'react';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';

const topDepts = [
    { name: 'Education', score: '9.8', trend: '+7.4%', up: true },
    { name: 'Healthcare', score: '8.4', trend: '+6%', up: true },
    { name: 'Agriculture', score: '7.0', trend: '+4%', up: true },
    { name: 'Finance', score: '8.1', trend: '0%', up: true }
];

const TopPerformingDepartments = () => {
    return (
        <div className="space-y-4 select-none text-left">
            <div className="flex items-center gap-2">
                <span className="text-xs text-amber-500 font-extrabold">🏆</span>
                <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">Top Performing Departments</h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {topDepts.map((dept, i) => (
                    <div
                        key={dept.name}
                        className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col items-center gap-2 text-center"
                    >
                        {/* Rank badge */}
                        {i === 0 && (
                            <span className="text-[10px] px-2 py-0.5 bg-amber-100 border border-amber-200 text-amber-700 rounded-full font-black uppercase tracking-wide">Top</span>
                        )}
                        {i > 0 && (
                            <span className="text-[10px] px-2 py-0.5 bg-blue-50 border border-blue-200 text-blue-700 rounded-full font-black uppercase tracking-wide">#{i + 1}</span>
                        )}

                        {/* Score */}
                        <div className="space-y-0.5">
                            <span className="text-2xl font-black text-slate-900">{dept.score}</span>
                            <div className={`inline-flex items-center gap-0.5 text-[10px] font-extrabold ${dept.up ? 'text-emerald-600' : 'text-rose-500'}`}>
                                {dept.up ? <FaArrowUp className="w-2 h-2" /> : <FaArrowDown className="w-2 h-2" />}
                                {dept.trend}
                            </div>
                        </div>

                        {/* Department Name */}
                        <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">{dept.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TopPerformingDepartments;
