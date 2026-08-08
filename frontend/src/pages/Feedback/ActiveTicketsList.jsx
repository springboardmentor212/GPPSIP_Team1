import React from 'react';
import { FaChevronDown } from 'react-icons/fa';

const ActiveTicketsList = ({ tickets, selectedTicketId, onSelectTicket, onLoadMore }) => {
    return (
        <div className="space-y-4 text-left select-none">

            {/* Subheader */}
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                <h3 className="text-base font-black text-slate-900 tracking-tight">Active Support Tickets</h3>
                <span>Showing 1-{tickets.length} of 42 tickets</span>
            </div>

            {/* Ticket List Stack */}
            <div className="space-y-3">
                {tickets.map((ticket) => {
                    const isSelected = selectedTicketId === ticket.id;
                    return (
                        <div
                            key={ticket.id}
                            onClick={() => onSelectTicket(ticket.id)}
                            className={`bg-white border rounded-2xl p-4 sm:p-5 shadow-sm transition-all cursor-pointer relative overflow-hidden group ${isSelected
                                    ? 'border-[#0052cc] ring-2 ring-blue-500/10 bg-blue-50/20'
                                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                                }`}
                        >
                            {/* Left Accent Bar for Selected Ticket */}
                            {isSelected && (
                                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#0052cc]" />
                            )}

                            {/* Top Row: Ticket ID, Status Badge, Timestamp */}
                            <div className="flex items-center justify-between gap-2 text-xs">
                                <div className="flex items-center gap-2">
                                    <span className="font-extrabold text-slate-900">{ticket.ticketId}</span>
                                    {ticket.status === 'IN PROGRESS' && (
                                        <span className="px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-md text-[10px] font-black">
                                            IN PROGRESS
                                        </span>
                                    )}
                                    {ticket.status === 'OPEN' && (
                                        <span className="px-2 py-0.5 bg-blue-50 text-[#0052cc] border border-blue-200 rounded-md text-[10px] font-black">
                                            OPEN
                                        </span>
                                    )}
                                    {ticket.status === 'RESOLVED' && (
                                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md text-[10px] font-black">
                                            RESOLVED
                                        </span>
                                    )}
                                </div>
                                <span className="text-[11px] font-semibold text-slate-400">{ticket.timestamp}</span>
                            </div>

                            {/* Title & Excerpt Description */}
                            <div className="py-2.5 space-y-1">
                                <h4 className="text-sm font-extrabold text-slate-900 group-hover:text-[#0052cc] transition-colors leading-tight">
                                    {ticket.title}
                                </h4>
                                <p className="text-xs text-slate-500 font-medium line-clamp-2 leading-relaxed">
                                    {ticket.description}
                                </p>
                            </div>

                            {/* Footer Meta: User Avatar, Priority & Category Tags */}
                            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 text-[10px] font-black flex items-center justify-center">
                                        {ticket.author.split(' ').map(n => n[0]).join('')}
                                    </div>
                                    <span className="font-bold text-slate-800">{ticket.author}</span>
                                </div>

                                <div className="flex items-center gap-2 text-[10px] font-black uppercase">
                                    {ticket.priority === 'HIGH' && (
                                        <span className="text-rose-600 font-extrabold flex items-center gap-1">
                                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                                            HIGH
                                        </span>
                                    )}
                                    {ticket.priority === 'NORMAL' && (
                                        <span className="text-blue-600 font-extrabold flex items-center gap-1">
                                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                            NORMAL
                                        </span>
                                    )}
                                    <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md border border-slate-200">
                                        {ticket.categoryTag}
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Load More Button */}
            <div className="pt-2 text-center">
                <button
                    onClick={onLoadMore}
                    className="w-full py-3 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs hover:bg-slate-50 transition-colors cursor-pointer"
                >
                    <span>Load More Tickets</span>
                    <FaChevronDown className="w-3 h-3 text-slate-400" />
                </button>
            </div>

        </div>
    );
};

export default ActiveTicketsList;
