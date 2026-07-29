import React from 'react';

const FormCard = ({ title, subtitle, children }) => {
  return (
    <div className="bg-white rounded-3xl border border-slate-300 p-6 sm:p-10 shadow-sm w-full space-y-6 text-left">
      {/* Card Header */}
      <div className="space-y-1.5 border-b border-slate-100 pb-5">
        <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight leading-none">
          {title}
        </h2>
        <p className="text-xs sm:text-sm text-slate-450 font-light leading-relaxed max-w-xl">
          {subtitle}
        </p>
      </div>

      {/* Card Body */}
      <div>
        {children}
      </div>
    </div>
  );
};

export default FormCard;
