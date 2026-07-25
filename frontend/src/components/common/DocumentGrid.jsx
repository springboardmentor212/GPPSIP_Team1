import React from 'react';
import { FaFileInvoice, FaDownload } from 'react-icons/fa';

const DocumentGrid = ({ documents }) => {
  const defaultDocuments = [
    { id: 1, name: "Privacy Notice Template" },
    { id: 2, name: "Cyber Security Audit Form" },
    { id: 3, name: "Historical Compliance Records" },
    { id: 4, name: "Organizational Proof of ID" }
  ];

  const displayDocs = documents || defaultDocuments;

  const handleDownload = (docName) => {
    alert(`Downloading: ${docName}`);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-300 p-6 sm:p-8 shadow-sm space-y-5">
      {/* Title */}
      <div className="flex items-center gap-2.5 text-slate-800">
        <FaFileInvoice className="w-4 h-4 text-[#0052cc]" />
        <h2 className="text-lg font-black tracking-tight">Required Documents</h2>
      </div>

      {/* Grid of Documents */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {displayDocs.map((doc) => (
          <div 
            key={doc.id}
            onClick={() => handleDownload(doc.name)}
            className="flex items-center justify-between border border-slate-300 hover:border-blue-300 rounded-xl p-4 cursor-pointer hover:bg-slate-50/50 hover:shadow-sm transition-all duration-200 group"
          >
            <div className="flex items-center gap-3.5 overflow-hidden">
              {/* File Icon */}
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0052cc] flex items-center justify-center shrink-0">
                <FaFileInvoice className="w-3.5 h-3.5" />
              </div>
              {/* Document Name */}
              <span className="text-xs sm:text-sm font-bold text-slate-700 truncate group-hover:text-[#0052cc] transition-colors">
                {doc.name}
              </span>
            </div>

            {/* Download Icon */}
            <div className="w-8 h-8 rounded-lg bg-slate-50 text-slate-400 group-hover:bg-blue-50 group-hover:text-[#0052cc] flex items-center justify-center shrink-0 transition-colors">
              <FaDownload className="w-3 h-3 group-hover:scale-110 transition-transform" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DocumentGrid;
