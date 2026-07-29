import React from 'react';

const QuickActionCard = ({ title, icon: Icon, onClick, color = 'blue' }) => {
  const getColorClasses = () => {
    switch (color) {
      case 'blue': return 'text-[#0052cc] bg-blue-50/50 border-blue-100 group-hover:bg-blue-50';
      case 'green': return 'text-emerald-600 bg-emerald-50/50 border-emerald-100 group-hover:bg-emerald-50';
      case 'purple': return 'text-purple-600 bg-purple-50/50 border-purple-100 group-hover:bg-purple-50';
      case 'orange': return 'text-rose-600 bg-rose-50/50 border-rose-100 group-hover:bg-rose-50'; // Using rose to match support color in mockup
      default: return 'text-slate-600 bg-slate-50 border-slate-100';
    }
  };

  return (
    <button
      onClick={onClick}
      className="bg-white rounded-2xl p-4 border border-slate-300 shadow-sm hover:shadow-md hover:border-[#0052cc] transition-all duration-300 group text-center flex flex-col items-center justify-center gap-3 w-full cursor-pointer min-h-[110px]"
    >
      {/* Icon Circle */}
      <div className={`w-11 h-11 rounded-full flex items-center justify-center border transition-all duration-300 ${getColorClasses()}`}>
        <Icon className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
      </div>

      <span className="text-xs font-bold text-slate-700 leading-tight tracking-tight group-hover:text-[#0052cc] transition-colors">
        {title}
      </span>
    </button>
  );
};

export default QuickActionCard;

