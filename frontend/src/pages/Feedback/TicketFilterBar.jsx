import React from 'react';
import { FaSearch } from 'react-icons/fa';

const TicketFilterBar = ({
    searchQuery,
    onSearchChange,
    category,
    onCategoryChange,
    priority,
    onPriorityChange,
    status,
    onStatusChange
}) => {
    return (
        <div className="bg-white border border-slate-200 rounded-2xl p-3 sm:p-4 shadow-sm select-none text-left flex flex-col md:flex-row items-center justify-between gap-3">

            {/* Search Input Box */}
            <div className="relative w-full md:w-96">
                <FaSearch className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Search by Ticket ID or Keyword..."
                    className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-[#0052cc] rounded-xl pl-9 pr-4 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-slate-400"
                />
            </div>

            {/* Dropdown Filters */}
            <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
                {/* Category Dropdown */}
                <select
                    value={category}
                    onChange={(e) => onCategoryChange(e.target.value)}
                    className="bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
                >
                    <option value="all">Category: All</option>
                    <option value="it">IT & Comm</option>
                    <option value="education">Education</option>
                    <option value="agri">Agriculture</option>
                    <option value="health">Healthcare</option>
                </select>

                {/* Priority Dropdown */}
                <select
                    value={priority}
                    onChange={(e) => onPriorityChange(e.target.value)}
                    className="bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
                >
                    <option value="all">Priority: All</option>
                    <option value="critical">Critical</option>
                    <option value="high">High</option>
                    <option value="normal">Normal</option>
                    <option value="low">Low</option>
                </select>

                {/* Status Dropdown */}
                <select
                    value={status}
                    onChange={(e) => onStatusChange(e.target.value)}
                    className="bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
                >
                    <option value="all">Status: All</option>
                    <option value="in_progress">In Progress</option>
                    <option value="open">Open</option>
                    <option value="resolved">Resolved</option>
                </select>
            </div>

        </div>
    );
};

export default TicketFilterBar;
