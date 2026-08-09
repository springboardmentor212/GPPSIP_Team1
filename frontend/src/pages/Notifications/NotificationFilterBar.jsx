import React from 'react';
import { FaSearch, FaChevronDown, FaFilter } from 'react-icons/fa';

const NotificationFilterBar = ({
    searchQuery,
    onSearchChange,
    categoryFilter,
    onCategoryChange,
    statusFilter,
    onStatusChange,
    priorityFilter,
    onPriorityChange
}) => {
    return (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-50/80 p-1.5 rounded-2xl">
            {/* Search Input Box */}
            <div className="relative flex-grow max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <FaSearch className="w-3.5 h-3.5" />
                </div>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Search in inbox..."
                    className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0052cc]/20 focus:border-[#0052cc] transition-all shadow-sm"
                />
            </div>

            {/* Filter Dropdown Pill Buttons */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
                {/* Category Dropdown */}
                <div className="relative shrink-0">
                    <select
                        value={categoryFilter}
                        onChange={(e) => onCategoryChange(e.target.value)}
                        className="appearance-none bg-white border border-slate-200 hover:border-slate-300 rounded-xl px-3.5 py-2 pr-8 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0052cc]/20 cursor-pointer shadow-sm"
                    >
                        <option value="all">Category</option>
                        <option value="Policies">Policies</option>
                        <option value="Schemes">Schemes</option>
                        <option value="Applications">Applications</option>
                        <option value="System">System</option>
                    </select>
                    <FaChevronDown className="w-2.5 h-2.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                {/* Status Dropdown */}
                <div className="relative shrink-0">
                    <select
                        value={statusFilter}
                        onChange={(e) => onStatusChange(e.target.value)}
                        className="appearance-none bg-white border border-slate-200 hover:border-slate-300 rounded-xl px-3.5 py-2 pr-8 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0052cc]/20 cursor-pointer shadow-sm"
                    >
                        <option value="all">Status</option>
                        <option value="unread">Unread</option>
                        <option value="read">Read</option>
                        <option value="active">Active</option>
                    </select>
                    <FaChevronDown className="w-2.5 h-2.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                {/* Priority Dropdown */}
                <div className="relative shrink-0">
                    <select
                        value={priorityFilter}
                        onChange={(e) => onPriorityChange(e.target.value)}
                        className="appearance-none bg-white border border-slate-200 hover:border-slate-300 rounded-xl px-3.5 py-2 pr-8 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0052cc]/20 cursor-pointer shadow-sm"
                    >
                        <option value="all">Priority</option>
                        <option value="HIGH">High Priority</option>
                        <option value="NORMAL">Normal Priority</option>
                        <option value="LOW">Low Priority</option>
                    </select>
                    <FaChevronDown className="w-2.5 h-2.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
            </div>
        </div>
    );
};

export default NotificationFilterBar;
