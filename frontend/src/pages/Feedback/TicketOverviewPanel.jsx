import React, { useState } from 'react';
import { FaEllipsisH, FaPaperPlane, FaCheckCircle, FaBuilding } from 'react-icons/fa';

const TicketOverviewPanel = ({ ticket, onSendResponse, onResolveTicket, userRole }) => {
    const [responseText, setResponseText] = useState('');
    const isCitizen = userRole === 'Citizen';

    if (!ticket) {
        return (
            <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center text-slate-400 font-bold text-xs select-none">
                Select a ticket from the list to view details and respond.
            </div>
        );
    }

    const handleSend = () => {
        if (!responseText.trim()) return;
        onSendResponse(ticket.id, responseText);
        setResponseText('');
    };

    return (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm select-none text-left space-y-6">

            {/* Header Row */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider">
                    Ticket Overview
                </span>
                <button className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer">
                    <FaEllipsisH className="w-3.5 h-3.5" />
                </button>
            </div>

            {/* Main Ticket Title */}
            <div className="space-y-4">
                <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-snug">
                    {ticket.fullTitle || ticket.title}
                </h3>

                {/* Metadata Grid: Assigned Department & Priority Level */}
                <div className="grid grid-cols-2 gap-4 p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs">
                    <div className="space-y-0.5">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
                            Assigned Department
                        </span>
                        <span className="font-extrabold text-slate-800 flex items-center gap-1.5">
                            <FaBuilding className="w-3 h-3 text-[#0052cc]" />
                            {ticket.assignedDepartment || 'Min. of IT & Comm'}
                        </span>
                    </div>

                    <div className="space-y-0.5">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
                            Priority Level
                        </span>
                        <span className="font-extrabold text-rose-600 flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping shrink-0" />
                            {ticket.priorityLevel || 'Critical'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Description Section */}
            <div className="space-y-2">
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider block">
                    Description
                </span>
                <p className="text-xs text-slate-600 font-medium leading-relaxed bg-slate-50/50 p-3.5 rounded-xl border border-slate-100">
                    {ticket.fullDescription || ticket.description}
                </p>
            </div>

            {/* Activity Timeline */}
            <div className="space-y-3">
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider block">
                    Activity Timeline
                </span>

                <div className="space-y-3 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 text-xs">
                    {/* Item 1 */}
                    <div className="flex items-start gap-3 relative z-10">
                        <div className="w-4 h-4 rounded-full bg-[#0052cc] text-white flex items-center justify-center shrink-0 ring-4 ring-white mt-0.5">
                            <span className="w-1.5 h-1.5 bg-white rounded-full" />
                        </div>
                        <div className="space-y-0.5 min-w-0">
                            <div className="font-extrabold text-slate-900">Ticket Assigned</div>
                            <div className="text-[11px] font-medium text-slate-400">
                                Today, 10:45 AM • To: Compliance Team
                            </div>
                        </div>
                    </div>

                    {/* Item 2 */}
                    <div className="flex items-start gap-3 relative z-10">
                        <div className="w-4 h-4 rounded-full bg-slate-300 text-white flex items-center justify-center shrink-0 ring-4 ring-white mt-0.5">
                            <span className="w-1.5 h-1.5 bg-slate-500 rounded-full" />
                        </div>
                        <div className="space-y-0.5 min-w-0">
                            <div className="font-extrabold text-slate-900">Ticket Created</div>
                            <div className="text-[11px] font-medium text-slate-400">
                                Today, 10:21 AM • By: {ticket.author}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Response Textarea Form — Officials Only */}
            {!isCitizen ? (
                <div className="space-y-3 pt-2">
                    <textarea
                        rows={3}
                        value={responseText}
                        onChange={(e) => setResponseText(e.target.value)}
                        placeholder="Type officer response or official resolution note..."
                        className="w-full bg-slate-50 border border-slate-200 focus:border-[#0052cc] rounded-xl p-3 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none transition-all placeholder:text-slate-400"
                    />
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleSend}
                            className="flex-1 py-2.5 bg-[#0052cc] hover:bg-[#0041a8] text-white rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                        >
                            <FaPaperPlane className="w-3 h-3" />
                            <span>Send Response</span>
                        </button>
                        <button
                            onClick={() => onResolveTicket(ticket.id)}
                            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                        >
                            <FaCheckCircle className="w-3.5 h-3.5" />
                            <span>Resolve Ticket</span>
                        </button>
                    </div>
                </div>
            ) : (
                <div className="pt-2 text-center text-slate-400 text-[10px] font-bold uppercase tracking-wider italic">
                    Read-only mode: Awaiting official response
                </div>
            )}

        </div>
    );
};

export default TicketOverviewPanel;
