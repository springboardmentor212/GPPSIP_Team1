import React from 'react';
import { FaCertificate } from 'react-icons/fa';

const FilterSection = ({ 
  filters, 
  onFilterChange, 
  sortBy, 
  onSortChange 
}) => {
  
  const handleSelectChange = (key, value) => {
    onFilterChange(key, value);
  };

  const categories = ['All Categories', 'Infrastructure', 'Healthcare', 'Technology', 'Finance', 'Education'];
  const states = ['All States', 'New Delhi', 'California', 'Texas', 'Federal'];
  const depts = ['All Depts', 'Ministry of Power', 'Dept of Health', 'Ministry of IT', 'Dept of Commerce', 'Ministry of Education'];
  const ministries = ['All Ministries', 'Ministry of Power', 'Dept of Health', 'Ministry of IT', 'Dept of Commerce', 'Ministry of Education'];
  const statuses = ['All Statuses', 'Active', 'Inactive', 'Pending'];
  const sortOptions = ['Newest First', 'Oldest First'];

  return (
    <div className="space-y-4 pt-4 border-t border-slate-300 shrink-0 w-full select-none">
      
      {/* Dropdown Filters Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 w-full">
        
        {/* Category */}
        <div>
          <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Category</label>
          <select 
            value={filters.category}
            onChange={(e) => handleSelectChange('category', e.target.value)}
            className="w-full mt-1.5 px-3 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 bg-white hover:border-[#0052cc] focus:outline-none focus:border-[#0052cc] transition-colors cursor-pointer"
          >
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* State */}
        <div>
          <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">State</label>
          <select 
            value={filters.state}
            onChange={(e) => handleSelectChange('state', e.target.value)}
            className="w-full mt-1.5 px-3 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 bg-white hover:border-[#0052cc] focus:outline-none focus:border-[#0052cc] transition-colors cursor-pointer"
          >
            {states.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* Department */}
        <div>
          <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Department</label>
          <select 
            value={filters.department}
            onChange={(e) => handleSelectChange('department', e.target.value)}
            className="w-full mt-1.5 px-3 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 bg-white hover:border-[#0052cc] focus:outline-none focus:border-[#0052cc] transition-colors cursor-pointer"
          >
            {depts.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        {/* Ministry */}
        <div>
          <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Ministry</label>
          <select 
            value={filters.ministry}
            onChange={(e) => handleSelectChange('ministry', e.target.value)}
            className="w-full mt-1.5 px-3 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 bg-white hover:border-[#0052cc] focus:outline-none focus:border-[#0052cc] transition-colors cursor-pointer"
          >
            {ministries.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        {/* Status */}
        <div>
          <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Status</label>
          <select 
            value={filters.status}
            onChange={(e) => handleSelectChange('status', e.target.value)}
            className="w-full mt-1.5 px-3 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 bg-white hover:border-[#0052cc] focus:outline-none focus:border-[#0052cc] transition-colors cursor-pointer"
          >
            {statuses.map((st) => (
              <option key={st} value={st}>{st}</option>
            ))}
          </select>
        </div>

        {/* Publication Date */}
        <div>
          <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Publication Date</label>
          <input 
            type="date"
            value={filters.date}
            onChange={(e) => handleSelectChange('date', e.target.value)}
            className="w-full mt-1.5 px-3 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-600 bg-white hover:border-[#0052cc] focus:outline-none focus:border-[#0052cc] transition-colors cursor-pointer"
          />
        </div>

      </div>

      {/* Badges and Sorting Sub-row */}
      <div className="flex items-center justify-between gap-3 pt-2 w-full text-xs font-bold text-slate-500">
        
        {/* Official Sources Pill */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50/70 border border-blue-100 text-[#0052cc] rounded-lg text-[9px] font-extrabold tracking-wider uppercase cursor-pointer hover:bg-blue-50 transition-colors shadow-sm select-none">
          <FaCertificate className="w-2.5 h-2.5" />
          <span>Official Sources</span>
        </div>

        {/* Sort Trigger */}
        <div className="flex items-center gap-1.5 justify-end select-none">
          <span className="text-slate-450 font-normal">Sort by:</span>
          <select 
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="text-xs font-extrabold text-[#0052cc] bg-transparent border-none cursor-pointer focus:outline-none hover:underline p-0 m-0"
          >
            {sortOptions.map((opt) => (
              <option key={opt} value={opt} className="text-slate-700 bg-white font-medium">{opt}</option>
            ))}
          </select>
        </div>

      </div>

    </div>
  );
};

export default FilterSection;
