import React from 'react';
import { FaPlus, FaCommentAlt } from 'react-icons/fa';

const FeedbackHeader = ({ onCreateTicket, onSubmitFeedback, isCitizen }) => {
    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 select-none border-b border-slate-200/80 pb-5">
            {/* Title & Breadcrumbs */}
            <div className="space-y-1 text-left">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
                    <span className="hover:text-slate-600 transition-colors cursor-pointer">Dashboard</span>
                    <span>/</span>
                    <span className="text-[#0052cc] font-bold">Feedback & Support</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    Citizen Feedback & Support Center
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 font-medium">
                    {isCitizen
                        ? 'Submit feedback, report policy issues, and track the status of your requests.'
                        : 'Manage citizen feedback, reported issues, support requests and FAQs from a centralized workspace.'}
                </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 shrink-0">
                {!isCitizen && (
                    <button
                        onClick={onCreateTicket}
                        className="px-4 py-2.5 bg-white border border-slate-300 hover:border-slate-400 hover:bg-slate-50/80 text-slate-700 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all shadow-sm cursor-pointer"
                    >
                        <FaPlus className="w-3 h-3 text-[#0052cc]" />
                        <span>Create Ticket</span>
                    </button>
                )}

                <button
                    onClick={onSubmitFeedback}
                    className="px-4.5 py-2.5 bg-[#0052cc] hover:bg-[#0041a8] text-white rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all shadow-md shadow-blue-500/20 active:scale-[0.98] cursor-pointer"
                >
                    <FaCommentAlt className="w-3.5 h-3.5" />
                    <span>{isCitizen ? 'Submit Feedback' : 'Submit Feedback'}</span>
                </button>
            </div>
        </div>
    );
};

export default FeedbackHeader;
