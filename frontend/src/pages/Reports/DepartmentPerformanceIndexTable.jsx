import React from 'react';
import { FaArrowUp, FaArrowDown, FaUsers } from 'react-icons/fa';

const tableData = [
    { rank: 1, name: 'Education', policies: 342, schemes: 15, approval: 98.2, approvalUp: true, reach: '4.5M' },
    { rank: 2, name: 'Health Care', policies: 283, schemes: 24, approval: 94.7, approvalUp: true, reach: '2.1M' },
    { rank: 3, name: 'Agriculture', policies: 198, schemes: 8, approval: 89.3, approvalUp: false, reach: '1.5M' },
    { rank: 4, name: 'Housing & Urban', policies: 134, schemes: 6, approval: 84.5, approvalUp: false, reach: '0.9M' }
];

const DepartmentPerformanceIndexTable = ({ onViewAll }) => {
    return (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm select-none text-left overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-100">
                <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">Departmental Performance Index</h3>
                <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-slate-400 bg-slate-50 border border-slate-200 px-2 py-1 rounded-lg">Live Data</span>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-xs">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-100">
                            <th className="px-4 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-wider">Rank</th>
                            <th className="px-4 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-wider">Department Name</th>
                            <th className="px-4 py-3 text-center text-[10px] font-black text-slate-400 uppercase tracking-wider">Policies</th>
                            <th className="px-4 py-3 text-center text-[10px] font-black text-slate-400 uppercase tracking-wider">Schemes</th>
                            <th className="px-4 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-wider">Approval Rate</th>
                            <th className="px-4 py-3 text-center text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1">
                                <FaUsers className="w-3 h-3" />Reach
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {tableData.map((row) => {
                            const approvalPct = row.approval;
                            return (
                                <tr key={row.rank} className="hover:bg-slate-50/50 transition-colors cursor-pointer">
                                    <td className="px-4 py-3.5">
                                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black text-white ${row.rank === 1 ? 'bg-amber-400' : 'bg-slate-300'
                                            }`}>
                                            {row.rank}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3.5 font-extrabold text-slate-800">{row.name}</td>
                                    <td className="px-4 py-3.5 text-center font-bold text-slate-700">{row.policies}</td>
                                    <td className="px-4 py-3.5 text-center font-bold text-slate-700">{row.schemes}</td>
                                    <td className="px-4 py-3.5">
                                        <div className="flex items-center gap-2">
                                            <div className="flex-grow bg-slate-100 rounded-full h-1.5 w-24">
                                                <div
                                                    className={`h-1.5 rounded-full ${row.approvalUp ? 'bg-emerald-500' : 'bg-rose-400'}`}
                                                    style={{ width: `${approvalPct}%` }}
                                                />
                                            </div>
                                            <span className={`font-extrabold ${row.approvalUp ? 'text-emerald-600' : 'text-rose-500'} flex items-center gap-0.5`}>
                                                {row.approvalUp ? <FaArrowUp className="w-2.5 h-2.5" /> : <FaArrowDown className="w-2.5 h-2.5" />}
                                                {approvalPct}%
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3.5 text-center font-extrabold text-slate-800">{row.reach}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-100 text-center">
                <button
                    onClick={onViewAll}
                    className="text-xs font-extrabold text-[#0052cc] hover:underline cursor-pointer"
                >
                    View All Departments (24) →
                </button>
            </div>
        </div>
    );
};

export default DepartmentPerformanceIndexTable;
