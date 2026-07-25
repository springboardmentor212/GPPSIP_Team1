import React from 'react';
import { FaSlidersH, FaSortAmountDown } from 'react-icons/fa';

const FilterBar = ({ onToggleFilters, onToggleSort, sortBy = "Match" }) => {
  return (
    <div className="flex items-center gap-3 shrink-0 select-none">
      {/* Filters Button */}
      <button 
        onClick={onToggleFilters || (() => alert("Opening filter options..."))}
        className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 transition-colors shadow-sm cursor-pointer"
      >
        <FaSlidersH className="w-3.5 h-3.5 text-slate-400" />
        <span>Filters</span>
      </button>

      {/* Sort By Match Button */}
      <button 
        onClick={onToggleSort || (() => alert("Opening sort options..."))}
        className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 transition-colors shadow-sm cursor-pointer"
      >
        <FaSortAmountDown className="w-3.5 h-3.5 text-slate-400" />
        <span>Sort by {sortBy}</span>
      </button>
    </div>
  );
};

export default FilterBar;
