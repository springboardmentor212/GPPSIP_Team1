import React from 'react';

const Pagination = ({ 
  currentPage = 1, 
  totalPages = 3, 
  totalResults = 158, 
  resultsPerPage = 12, 
  onPageChange 
}) => {
  const start = Math.min((currentPage - 1) * resultsPerPage + 1, totalResults);
  const end = Math.min(currentPage * resultsPerPage, totalResults);

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-300 mt-8 shrink-0 w-full select-none text-slate-500 font-medium text-xs sm:text-sm">
      
      {/* Results Status */}
      <span>
        Showing <strong className="font-extrabold text-slate-700">{start}</strong>-{end} of <strong className="font-extrabold text-slate-700">{totalResults}</strong> results
      </span>

      {/* Page Navigation Controls */}
      <div className="flex items-center gap-1">
        
        {/* Previous Button */}
        <button
          onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-bold bg-white text-slate-600 hover:bg-slate-50 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white transition-all duration-200"
        >
          Previous
        </button>

        {/* Page Numbers */}
        {pages.map((p) => {
          const isActive = p === currentPage;
          return (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer border ${
                isActive
                  ? 'bg-[#0052cc] text-white border-[#0052cc] shadow-sm shadow-blue-500/10'
                  : 'bg-white hover:bg-slate-50 text-slate-600 border-slate-300'
              }`}
            >
              {p}
            </button>
          );
        })}

        {/* Next Button */}
        <button
          onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-bold bg-white text-slate-600 hover:bg-slate-50 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white transition-all duration-200"
        >
          Next
        </button>

      </div>

    </div>
  );
};

export default Pagination;
