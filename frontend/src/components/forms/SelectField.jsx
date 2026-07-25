import React from 'react';

const SelectField = ({ 
  label, 
  name, 
  value, 
  onChange, 
  options = [], 
  error, 
  disabled = false,
  placeholder = 'Select Option'
}) => {
  return (
    <div className="w-full flex flex-col text-left">
      <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5 block">
        {label}
      </label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm font-bold text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition-colors cursor-pointer ${
          disabled ? 'bg-slate-50 cursor-not-allowed text-slate-400 opacity-60' : 'hover:border-slate-455'
        } ${
          error 
            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10' 
            : 'border-slate-300 focus:border-[#0052cc]'
        }`}
      >
        <option value="" className="text-slate-400 font-medium">{placeholder}</option>
        {options.map((opt) => {
          const val = typeof opt === 'string' ? opt : opt.value;
          const lbl = typeof opt === 'string' ? opt : opt.label;
          return (
            <option key={val} value={val} className="text-slate-750 font-medium">
              {lbl}
            </option>
          );
        })}
      </select>
      {error && (
        <span className="text-[10px] text-red-550 font-bold mt-1 pl-1">
          {error}
        </span>
      )}
    </div>
  );
};

export default SelectField;
