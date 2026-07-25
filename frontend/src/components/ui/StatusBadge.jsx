import React from 'react';

const StatusBadge = ({ status }) => {
  const getClasses = () => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'pending':
        return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'under review':
      case 'under_review':
        return 'bg-purple-50 text-purple-600 border-purple-100';
      case 'rejected':
        return 'bg-rose-50 text-rose-600 border-rose-100';
      default:
        return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  const getLabel = () => {
    if (status?.toLowerCase() === 'under_review') return 'Under Review';
    return status || 'Unknown';
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border select-none ${getClasses()}`}>
      {getLabel()}
    </span>
  );
};

export default StatusBadge;
