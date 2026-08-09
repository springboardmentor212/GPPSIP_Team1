import React, { useState } from 'react';
import { FaTimes, FaRegCalendarAlt, FaCheck } from 'react-icons/fa';

const ScheduleReportModal = ({ isOpen, onClose, onSaveSchedule }) => {
    const [reportTitle, setReportTitle] = useState('');
    const [frequency, setFrequency] = useState('Weekly');
    const [time, setTime] = useState('09:00 AM');
    const [department, setDepartment] = useState('Urban Dev.');
    const [isSuccess, setIsSuccess] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSuccess(true);
        setTimeout(() => {
            onSaveSchedule({ reportTitle, frequency, time, department });
            setIsSuccess(false);
            onClose();
        }, 1000);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs select-none">
            <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md p-6 shadow-xl text-left space-y-5 animate-in fade-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#0052cc] flex items-center justify-center">
                            <FaRegCalendarAlt className="w-4 h-4" />
                        </div>
                        <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
                            Schedule Automated Report
                        </h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                        <FaTimes className="w-4 h-4" />
                    </button>
                </div>

                {isSuccess ? (
                    <div className="py-8 text-center space-y-3">
                        <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                            <FaCheck className="w-6 h-6" />
                        </div>
                        <h4 className="text-sm font-extrabold text-slate-900">Schedule Saved!</h4>
                        <p className="text-xs text-slate-500 font-medium">Your automated report schedule has been added successfully.</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                        {/* Title */}
                        <div className="space-y-1">
                            <label className="font-extrabold text-slate-700">Report Title</label>
                            <input
                                type="text"
                                required
                                placeholder="e.g. Weekly Security Audit"
                                value={reportTitle}
                                onChange={(e) => setReportTitle(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                            />
                        </div>

                        {/* Department */}
                        <div className="space-y-1">
                            <label className="font-extrabold text-slate-700">Department Scope</label>
                            <select
                                value={department}
                                onChange={(e) => setDepartment(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
                            >
                                <option value="Urban Dev.">Urban Development</option>
                                <option value="Welfare Admin">Welfare Administration</option>
                                <option value="Min. of IT">Ministry of IT</option>
                                <option value="Ministry of Health">Ministry of Health</option>
                            </select>
                        </div>

                        {/* Frequency & Time */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                                <label className="font-extrabold text-slate-700">Frequency</label>
                                <select
                                    value={frequency}
                                    onChange={(e) => setFrequency(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
                                >
                                    <option value="Daily">Daily</option>
                                    <option value="Weekly">Weekly</option>
                                    <option value="Monthly">Monthly</option>
                                    <option value="Yearly">Yearly</option>
                                </select>
                            </div>

                            <div className="space-y-1">
                                <label className="font-extrabold text-slate-700">Execution Time</label>
                                <input
                                    type="text"
                                    value={time}
                                    onChange={(e) => setTime(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                />
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-5 py-2 bg-[#0052cc] hover:bg-[#0041a8] text-white rounded-xl font-extrabold shadow-sm transition-colors cursor-pointer"
                            >
                                Save Schedule
                            </button>
                        </div>
                    </form>
                )}

            </div>
        </div>
    );
};

export default ScheduleReportModal;
