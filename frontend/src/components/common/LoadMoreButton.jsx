import React from 'react';
import { FaChevronDown } from 'react-icons/fa';

const LoadMoreButton = ({ onClick, loading = false }) => {
  return (
    <div className="w-full flex justify-center pt-4 shrink-0 select-none">
      <button
        onClick={onClick}
        disabled={loading}
        className="flex items-center gap-2 px-6 py-2.5 bg-white hover:bg-slate-50 border border-slate-300 rounded-full text-xs font-bold text-slate-700 transition-colors shadow-sm cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
      >
        <span>{loading ? "Loading..." : "Load previous notifications"}</span>
        {!loading && <FaChevronDown className="w-3 h-3 text-slate-400" />}
      </button>
    </div>
  );
};

export default LoadMoreButton;
