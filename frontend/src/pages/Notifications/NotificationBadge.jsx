import React from 'react';

const NotificationBadge = ({ category, type }) => {
  const getColors = () => {
    switch (type) {
      case 'policy':
        return 'bg-blue-50 text-blue-600 border-blue-150';
      case 'application':
        return 'bg-purple-50 text-purple-600 border-purple-150';
      case 'eligibility':
        return 'bg-slate-50 text-slate-550 border-slate-300';
      case 'scheme':
        return 'bg-emerald-50 text-emerald-600 border-emerald-150';
      default:
        return 'bg-slate-50 text-slate-500 border-slate-300';
    }
  };

  return (
    <span className={`px-2.5 py-0.5 border rounded-md text-[9px] font-black uppercase tracking-wider select-none shrink-0 ${getColors()}`}>
      {category}
    </span>
  );
};

export default NotificationBadge;
