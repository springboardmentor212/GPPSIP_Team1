import React from 'react';

const StatsCard = ({ title, value, growth, growthType, icon: Icon, color = 'blue' }) => {
  const getColorClasses = () => {
    switch (color) {
      case 'blue': return 'text-[#0052cc] bg-blue-50 border-blue-100';
      case 'green': return 'text-emerald-600 bg-emerald-50 border-emerald-100';
      case 'purple': return 'text-purple-600 bg-purple-50 border-purple-100';
      case 'orange': return 'text-amber-600 bg-amber-50 border-amber-100';
      case 'red': return 'text-rose-600 bg-rose-50 border-rose-100';
      default: return 'text-slate-600 bg-slate-50 border-slate-100';
    }
  };

  const getGrowthClass = () => {
    if (growthType === 'positive') return 'text-emerald-600 bg-emerald-50 border-emerald-100';
    if (growthType === 'neutral') return 'text-slate-500 bg-slate-50 border-slate-100';
    return 'text-amber-600 bg-amber-50 border-amber-100';
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-300 shadow-sm hover:shadow-md hover:border-slate-400 transition-all duration-300 group flex items-start justify-between gap-4">
      <div className="space-y-2">
        <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">{title}</h3>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-black text-slate-800 tracking-tight">{value}</span>
        </div>
        {growth && (
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${getGrowthClass()}`}>
            {growth}
          </span>
        )}
      </div>

      {/* Circular Icon container with subtle animation on hover */}
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center border shadow-sm group-hover:scale-105 transition-transform duration-300 ${getColorClasses()}`}>
        <Icon className="w-5 h-5" />
      </div>
    </div>
  );
};

export default StatsCard;
