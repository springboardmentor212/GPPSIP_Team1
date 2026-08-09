import React from 'react';
import {
    FaAt,
    FaCheckSquare,
    FaLandmark,
    FaCog,
    FaFileAlt
} from 'react-icons/fa';

const NotificationInboxCard = ({
    notification,
    isSelected,
    onSelect
}) => {
    const {
        id,
        title,
        subtitle,
        timestamp,
        priority = "NORMAL",
        source = "System",
        unread = false,
        iconType = "policy"
    } = notification;

    // Icon selector according to design
    const renderIcon = () => {
        switch (iconType) {
            case 'policy':
            case 'at':
                return (
                    <div className="w-8 h-8 rounded-lg bg-blue-100 text-[#0052cc] flex items-center justify-center shrink-0">
                        <FaAt className="w-4 h-4" />
                    </div>
                );
            case 'eligibility':
            case 'check':
                return (
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center shrink-0">
                        <FaCheckSquare className="w-3.5 h-3.5" />
                    </div>
                );
            case 'scheme':
            case 'landmark':
                return (
                    <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center shrink-0">
                        <FaLandmark className="w-3.5 h-3.5" />
                    </div>
                );
            case 'system':
            case 'cog':
                return (
                    <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 border border-slate-200 flex items-center justify-center shrink-0">
                        <FaCog className="w-3.5 h-3.5" />
                    </div>
                );
            default:
                return (
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                        <FaFileAlt className="w-3.5 h-3.5" />
                    </div>
                );
        }
    };

    // Priority badge styling
    const renderPriorityBadge = () => {
        switch (priority.toUpperCase()) {
            case 'HIGH':
            case 'HIGH PRIORITY':
                return (
                    <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-red-100 text-red-700">
                        HIGH PRIORITY
                    </span>
                );
            case 'LOW':
                return (
                    <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-slate-100 text-slate-500">
                        LOW
                    </span>
                );
            case 'NORMAL':
            default:
                return (
                    <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-slate-100 text-slate-600">
                        NORMAL
                    </span>
                );
        }
    };

    return (
        <div
            onClick={onSelect}
            className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer text-left relative bg-white ${isSelected
                    ? 'border-[#0052cc] ring-2 ring-[#0052cc]/20 shadow-md'
                    : 'border-slate-200 hover:border-slate-300 hover:shadow-sm'
                }`}
        >
            <div className="flex items-start gap-3">
                {/* Type Icon */}
                {renderIcon()}

                {/* Text Details */}
                <div className="flex-grow min-w-0 space-y-1">
                    {/* Header Row: Title + Timestamp + Unread Dot */}
                    <div className="flex items-start justify-between gap-2">
                        <h3 className="text-xs font-extrabold text-slate-900 tracking-tight leading-snug truncate">
                            {title}
                        </h3>
                        <div className="flex items-center gap-1.5 shrink-0 pt-0.5">
                            <span className="text-[10px] font-semibold text-slate-400">
                                {timestamp}
                            </span>
                            {unread && (
                                <span className="w-2 h-2 rounded-full bg-[#0052cc] inline-block" />
                            )}
                        </div>
                    </div>

                    {/* Subtitle / Excerpt */}
                    <p className="text-[11px] text-slate-500 font-normal leading-relaxed line-clamp-2">
                        {subtitle}
                    </p>

                    {/* Pill Badges Row */}
                    <div className="flex items-center gap-2 pt-1 flex-wrap">
                        {renderPriorityBadge()}
                        <span className="px-2 py-0.5 rounded text-[9px] font-bold text-slate-500 bg-slate-100/80">
                            {source}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotificationInboxCard;
