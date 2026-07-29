import React from 'react';
import { FaFileAlt, FaCheckSquare, FaUserCheck, FaSyncAlt, FaRegClock } from 'react-icons/fa';
import NotificationBadge from '../../pages/Notifications/NotificationBadge';
import NotificationAction from '../../pages/Notifications/NotificationAction';

const NotificationCard = ({ 
  type, 
  title, 
  description, 
  timestamp, 
  category, 
  actionText, 
  onAction,
  readStatus = false
}) => {

  // Left colored indicator strip matching the type
  const getStripColor = () => {
    switch (type) {
      case 'policy':
        return 'bg-[#0052cc]';
      case 'application':
        return 'bg-purple-500';
      case 'eligibility':
        return 'bg-slate-400';
      case 'scheme':
        return 'bg-emerald-500';
      default:
        return 'bg-slate-300';
    }
  };

  // Notification circle icon matching the type
  const getIcon = () => {
    switch (type) {
      case 'policy':
        return (
          <div className="w-8 h-8 rounded-full bg-blue-50 text-[#0052cc] border border-blue-150 flex items-center justify-center shrink-0">
            <FaFileAlt className="w-3.5 h-3.5" />
          </div>
        );
      case 'application':
        return (
          <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-600 border border-purple-150 flex items-center justify-center shrink-0">
            <FaCheckSquare className="w-3.5 h-3.5" />
          </div>
        );
      case 'eligibility':
        return (
          <div className="w-8 h-8 rounded-full bg-slate-50 text-slate-550 border border-slate-300 flex items-center justify-center shrink-0">
            <FaUserCheck className="w-3.5 h-3.5" />
          </div>
        );
      case 'scheme':
        return (
          <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-150 flex items-center justify-center shrink-0">
            <FaSyncAlt className="w-3.5 h-3.5" />
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 rounded-full bg-slate-50 text-slate-400 border border-slate-300 flex items-center justify-center shrink-0">
            <FaFileAlt className="w-3.5 h-3.5" />
          </div>
        );
    }
  };

  return (
    <div className={`relative bg-white rounded-2xl border border-slate-300 pl-6 pr-5 py-4.5 shadow-sm hover:shadow-md hover:border-slate-400 transition-all duration-300 text-left overflow-hidden flex flex-col justify-between min-h-[110px] ${
      readStatus ? 'opacity-85' : ''
    }`}>
      {/* Left indicator strip */}
      <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${getStripColor()}`}></div>

      {/* Main card body */}
      <div className="space-y-3.5 flex-grow">
        {/* Header line: Icon, Title, and Category badge */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            {getIcon()}
            <h4 className="text-xs sm:text-sm font-extrabold text-slate-800 leading-snug tracking-tight">
              {title}
            </h4>
          </div>
          <NotificationBadge category={category} type={type} />
        </div>

        {/* Description */}
        <p className="text-xs text-slate-500 font-light leading-relaxed pl-11">
          {description}
        </p>
      </div>

      {/* Footer line: Clock timestamp & Action link */}
      <div className="flex items-center justify-between gap-4 pt-3 border-t border-slate-100 shrink-0 mt-3 pl-11">
        <div className="flex items-center gap-1.5 text-slate-400 select-none">
          <FaRegClock className="w-3.5 h-3.5" />
          <span className="text-[10px] font-bold uppercase tracking-wider">
            {timestamp}
          </span>
        </div>
        {actionText && (
          <NotificationAction text={actionText} onClick={onAction} />
        )}
      </div>

    </div>
  );
};

export default NotificationCard;
