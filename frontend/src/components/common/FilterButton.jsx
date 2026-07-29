import React from 'react';
import { FaSlidersH } from 'react-icons/fa';

const FilterButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick || (() => alert("Opening saved list filters..."))}
      className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 transition-colors shadow-sm cursor-pointer select-none"
    >
      <FaSlidersH className="w-3.5 h-3.5 text-slate-400" />
      <span>Filter</span>
    </button>
  );
};

export default FilterButton;
