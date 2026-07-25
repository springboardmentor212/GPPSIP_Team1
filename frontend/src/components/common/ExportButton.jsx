import React from 'react';
import { FaFileExport } from 'react-icons/fa';

const ExportButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick || (() => alert("Exporting saved policies list..."))}
      className="flex items-center gap-2 px-4 py-2.5 bg-[#0052cc] hover:bg-[#0047b3] text-white border-none rounded-xl text-xs font-bold transition-all shadow-sm shadow-blue-500/10 cursor-pointer select-none"
    >
      <FaFileExport className="w-3.5 h-3.5 text-white" />
      <span>Export List</span>
    </button>
  );
};

export default ExportButton;
