import React from 'react';

const Table = ({ headers = [], children, className = '' }) => {
  return (
    <div className={`w-full overflow-x-auto rounded-2xl border border-slate-300 bg-white ${className}`}>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-300 bg-slate-50/50">
            {headers.map((h, i) => (
              <th key={i} className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-wider select-none">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {children}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
