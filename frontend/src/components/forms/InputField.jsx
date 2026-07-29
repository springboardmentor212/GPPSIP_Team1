import React from 'react';

const InputField = ({ 
  label, 
  name, 
  type = 'text', 
  value, 
  onChange, 
  placeholder, 
  error, 
  disabled = false 
}) => {
  return (
    <div className="w-full flex flex-col text-left">
      <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5 block">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm font-bold text-slate-700 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition-all ${
          disabled ? 'bg-slate-50 cursor-not-allowed text-slate-400 opacity-60' : 'hover:border-slate-455'
        } ${
          error 
            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10' 
            : 'border-slate-300 focus:border-[#0052cc]'
        }`}
      />
      {error && (
        <span className="text-[10px] text-red-550 font-bold mt-1 pl-1">
          {error}
        </span>
      )}
    </div>
  );
};

export default InputField;
