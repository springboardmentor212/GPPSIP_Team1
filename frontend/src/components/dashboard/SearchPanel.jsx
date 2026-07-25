import React from 'react';
import { FaSearch } from 'react-icons/fa';
import FilterSection from './FilterSection';

const SearchPanel = ({
  searchQuery,
  onSearchQueryChange,
  onSearchSubmit,
  filters,
  onFilterChange,
  sortBy,
  onSortChange
}) => {
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearchSubmit();
  };

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-300 shadow-sm w-full space-y-5 mb-8">
      
      {/* Search Input and Button Row */}
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 w-full">
        
        {/* Search Input Box */}
        <div className="relative flex-grow flex items-center">
          <div className="absolute left-4 text-slate-400 pointer-events-none">
            <FaSearch className="w-3.5 h-3.5" />
          </div>
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            placeholder="Enter policy keywords or document ID..." 
            className="w-full pl-11 pr-4 py-3 bg-slate-50/50 border border-slate-300 rounded-xl text-xs sm:text-sm placeholder-slate-400 text-slate-700 font-bold focus:outline-none focus:bg-white focus:border-[#0052cc] focus:ring-2 focus:ring-blue-500/10 transition-all"
          />
        </div>

        {/* Blue Search Button */}
        <button
          type="submit"
          className="h-11 px-6 bg-[#0052cc] hover:bg-[#0047b3] text-white font-extrabold rounded-xl text-xs sm:text-sm transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-sm shrink-0 whitespace-nowrap"
        >
          <FaSearch className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          <span>Search Policy</span>
        </button>

      </form>

      {/* Embedded Filters & Sorters */}
      <FilterSection 
        filters={filters}
        onFilterChange={onFilterChange}
        sortBy={sortBy}
        onSortChange={onSortChange}
      />

    </div>
  );
};

export default SearchPanel;
