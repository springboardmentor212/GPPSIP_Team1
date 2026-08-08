import React from 'react';
import {
    FaAt,
    FaLightbulb,
    FaExternalLinkAlt,
    FaBookmark,
    FaRegTrashAlt,
    FaFileAlt,
    FaCheckCircle
} from 'react-icons/fa';

const NotificationDetailPanel = ({ notification, onOpenPolicy, onSave, onDismiss }) => {
    if (!notification) {
        return (
            <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center text-slate-400 font-medium">
                Select a notification to view details.
            </div>
        );
    }

    const {
        category = "Policy Update",
        receivedTime = "Mar 18, 2024 - 10:45 AM",
        title = "Comprehensive Data Privacy & Security Framework (DPSF) 2024",
        tags = ["Digital Infrastructure", "Active"],
        description = "This policy introduces strict 72-hour breach notification rules and mandates local data residency for financial records. It replaces the fragmented regulations of the previous decade with a modern, high-accountability framework.",
        aiInsight = "This framework significantly aligns with GDPR Article 33, requiring immediate escalation of security protocols for your current tech audit applications.",
        department = "Min. of IT & Comm.",
        publishedDate = "Jan 12, 2024",
        isSaved = false
    } = notification;

    return (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm space-y-5 text-left">
            {/* Top Header Row */}
            <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-sm shadow-blue-500/20">
                    <FaAt className="w-4 h-4" />
                </div>
                <div className="space-y-0.5">
                    <div className="text-xs font-bold text-slate-800 tracking-tight">
                        {category}
                    </div>
                    <div className="text-[11px] font-medium text-slate-400">
                        Received: {receivedTime}
                    </div>
                </div>
            </div>

            {/* Main Title & Badges */}
            <div className="space-y-2.5">
                <h2 className="text-lg font-bold text-slate-900 tracking-tight leading-snug">
                    {title}
                </h2>
                <div className="flex items-center gap-2 flex-wrap">
                    {tags.map((tag, idx) => {
                        const isActiveTag = tag.toLowerCase() === 'active';
                        return (
                            <span
                                key={idx}
                                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-tight ${isActiveTag
                                        ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                                        : 'bg-blue-50 text-blue-600 border border-blue-150'
                                    }`}
                            >
                                {tag}
                            </span>
                        );
                    })}
                </div>
            </div>

            {/* Narrative Description */}
            <p className="text-xs text-slate-600 leading-relaxed font-normal">
                {description}
            </p>

            {/* AI Insight Box */}
            <div className="bg-blue-50/70 border border-blue-100 rounded-xl p-3.5 space-y-1.5 relative overflow-hidden">
                <div className="flex items-center gap-2 text-blue-700 text-xs font-bold">
                    <FaLightbulb className="w-3.5 h-3.5 text-blue-600" />
                    <span>AI Insight</span>
                </div>
                <p className="text-[11px] text-slate-700 leading-relaxed font-normal pl-5">
                    {aiInsight}
                </p>
            </div>

            {/* Metadata Row */}
            <div className="grid grid-cols-2 gap-4 py-2 border-t border-b border-slate-100 text-[11px]">
                <div>
                    <div className="font-semibold text-slate-400 uppercase text-[9px] tracking-wider">
                        DEPARTMENT
                    </div>
                    <div className="font-bold text-slate-800 mt-0.5">
                        {department}
                    </div>
                </div>
                <div>
                    <div className="font-semibold text-slate-400 uppercase text-[9px] tracking-wider">
                        PUBLISHED DATE
                    </div>
                    <div className="font-bold text-slate-800 mt-0.5">
                        {publishedDate}
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5 pt-1">
                <button
                    onClick={onOpenPolicy}
                    className="w-full py-2.5 bg-[#0052cc] hover:bg-[#0041a8] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm shadow-blue-500/10 cursor-pointer"
                >
                    <FaFileAlt className="w-3 h-3" />
                    <span>Open Full Policy</span>
                </button>

                <div className="grid grid-cols-2 gap-2.5">
                    <button
                        onClick={onSave}
                        className={`py-2 px-3 border rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${isSaved
                                ? 'bg-blue-50 text-blue-700 border-blue-200'
                                : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                            }`}
                    >
                        <FaBookmark className={`w-3 h-3 ${isSaved ? 'text-blue-600' : 'text-slate-400'}`} />
                        <span>{isSaved ? 'Saved' : 'Save'}</span>
                    </button>
                    <button
                        onClick={onDismiss}
                        className="py-2 px-3 bg-white hover:bg-red-50 text-red-600 border border-slate-200 hover:border-red-200 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                        <FaRegTrashAlt className="w-3 h-3 text-red-500" />
                        <span>Dismiss</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NotificationDetailPanel;
