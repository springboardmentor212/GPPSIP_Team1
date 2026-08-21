import React, { useState } from 'react';
import { FaSlidersH, FaFileExport, FaSpinner } from 'react-icons/fa';
import { exportReport } from '../../services/report.service';

const CustomExportStudio = ({ onExportData }) => {
    const [dateRange, setDateRange] = useState('30d');
    const [department, setDepartment] = useState('all');
    const [category, setCategory] = useState('privacy');
    const [format, setFormat] = useState('PDF');
    const [isExporting, setIsExporting] = useState(false);

    const handleExport = async () => {
        setIsExporting(true);
        try {
            const reportData = { dateRange, department, category, format };
            const res = await exportReport(reportData);
            if (res.success) {
                if (onExportData) onExportData(res);
                else {
                    // Display success (parent handles toast if onExportData passed)
                    console.log('Report generated:', res);
                }
            }
        } catch (error) {
            console.error('Export failed:', error);
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm select-none text-left space-y-6">

            {/* Title Header */}
            <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#0052cc] flex items-center justify-center shrink-0">
                    <FaSlidersH className="w-4 h-4" />
                </div>
                <div>
                    <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                        Custom Export Studio
                    </h2>
                    <p className="text-xs text-slate-400 font-medium">
                        Filter dataset parameters and choose your preferred export file format.
                    </p>
                </div>
            </div>

            {/* Filter Options Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">

                {/* Date Range Dropdown */}
                <div className="space-y-1.5">
                    <label className="text-xs font-extrabold text-slate-600 uppercase tracking-wider block">
                        Date Range
                    </label>
                    <select
                        value={dateRange}
                        onChange={(e) => setDateRange(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
                    >
                        <option value="30d">Last 30 Days</option>
                        <option value="90d">Last 90 Days</option>
                        <option value="year">Last Year</option>
                        <option value="custom">Custom Date Range</option>
                    </select>
                </div>

                {/* Department Dropdown */}
                <div className="space-y-1.5">
                    <label className="text-xs font-extrabold text-slate-600 uppercase tracking-wider block">
                        Department
                    </label>
                    <select
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
                    >
                        <option value="all">All Departments</option>
                        <option value="urban">Urban Dev.</option>
                        <option value="welfare">Welfare Admin</option>
                        <option value="it">Min. of IT</option>
                        <option value="health">Healthcare Ministry</option>
                    </select>
                </div>

                {/* Category Dropdown */}
                <div className="space-y-1.5">
                    <label className="text-xs font-extrabold text-slate-600 uppercase tracking-wider block">
                        Category
                    </label>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
                    >
                        <option value="privacy">Privacy & Security</option>
                        <option value="adherence">Policy Adherence</option>
                        <option value="financial">Financial Allocation</option>
                        <option value="citizen">Citizen Services</option>
                    </select>
                </div>

                {/* Format Selector Pills */}
                <div className="space-y-1.5">
                    <label className="text-xs font-extrabold text-slate-600 uppercase tracking-wider block">
                        Format
                    </label>
                    <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
                        {['PDF', 'XLS', 'CSV'].map((fmt) => (
                            <button
                                key={fmt}
                                type="button"
                                onClick={() => setFormat(fmt)}
                                className={`flex-1 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${format === fmt
                                        ? 'bg-[#0052cc] text-white shadow-sm'
                                        : 'text-slate-600 hover:text-slate-900'
                                    }`}
                            >
                                {fmt}
                            </button>
                        ))}
                    </div>
                </div>

            </div>

            {/* Export Action Button */}
            <div className="flex justify-end pt-2">
                <button
                    onClick={handleExport}
                    disabled={isExporting}
                    className={`px-6 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2.5 shadow-md shadow-blue-500/20 transition-all cursor-pointer ${isExporting ? 'bg-[#0041a8] text-white opacity-75' : 'bg-[#0052cc] hover:bg-[#0041a8] text-white active:scale-[0.98]'}`}
                >
                    {isExporting ? <FaSpinner className="w-3.5 h-3.5 animate-spin" /> : <FaFileExport className="w-3.5 h-3.5" />}
                    <span>{isExporting ? 'Exporting...' : 'Export Selected Data'}</span>
                </button>
            </div>

        </div>
    );
};

export default CustomExportStudio;
