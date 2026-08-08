import React, { useState } from 'react';
import { FaTimes, FaPlus, FaCheckCircle } from 'react-icons/fa';

const CreateTicketModal = ({ isOpen, onClose, onSubmitTicket }) => {
    const [subject, setSubject] = useState('');
    const [category, setCategory] = useState('IT & COMM');
    const [priority, setPriority] = useState('NORMAL');
    const [description, setDescription] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSuccess(true);
        setTimeout(() => {
            onSubmitTicket({
                title: subject,
                categoryTag: category,
                priority,
                description
            });
            setIsSuccess(false);
            onClose();
        }, 1000);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs select-none">
            <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md p-6 shadow-xl text-left space-y-5 animate-in fade-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#0052cc] flex items-center justify-center">
                            <FaPlus className="w-3.5 h-3.5" />
                        </div>
                        <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
                            Create Support Ticket
                        </h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                        <FaTimes className="w-4 h-4" />
                    </button>
                </div>

                {isSuccess ? (
                    <div className="py-8 text-center space-y-3">
                        <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                            <FaCheckCircle className="w-6 h-6" />
                        </div>
                        <h4 className="text-sm font-extrabold text-slate-900">Ticket Submitted!</h4>
                        <p className="text-xs text-slate-500 font-medium">Your support ticket has been created and assigned to the relevant department.</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                        {/* Subject */}
                        <div className="space-y-1">
                            <label className="font-extrabold text-slate-700">Ticket Subject / Title</label>
                            <input
                                type="text"
                                required
                                placeholder="e.g. Compliance Verification Error"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                            />
                        </div>

                        {/* Category & Priority Grid */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                                <label className="font-extrabold text-slate-700">Category</label>
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
                                >
                                    <option value="IT & COMM">IT & Comm</option>
                                    <option value="EDUCATION">Education</option>
                                    <option value="AGRI">Agriculture</option>
                                    <option value="HEALTH">Healthcare</option>
                                </select>
                            </div>

                            <div className="space-y-1">
                                <label className="font-extrabold text-slate-700">Priority Level</label>
                                <select
                                    value={priority}
                                    onChange={(e) => setPriority(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
                                >
                                    <option value="NORMAL">Normal</option>
                                    <option value="HIGH">High</option>
                                    <option value="CRITICAL">Critical</option>
                                </select>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-1">
                            <label className="font-extrabold text-slate-700">Detailed Description</label>
                            <textarea
                                rows={3}
                                required
                                placeholder="Describe the issue or inquiry in detail..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
                            />
                        </div>

                        {/* Footer Actions */}
                        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-5 py-2 bg-[#0052cc] hover:bg-[#0041a8] text-white rounded-xl font-extrabold shadow-sm transition-colors cursor-pointer"
                            >
                                Submit Ticket
                            </button>
                        </div>
                    </form>
                )}

            </div>
        </div>
    );
};

export default CreateTicketModal;
