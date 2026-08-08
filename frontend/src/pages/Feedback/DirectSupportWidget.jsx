import React from 'react';
import { FaCommentDots, FaEnvelope, FaHeadset } from 'react-icons/fa';

const DirectSupportWidget = ({ onLiveChat, onEmailSupport }) => {
    return (
        <div className="space-y-4 text-left select-none">
            <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
                Direct Support Channels
            </h3>

            <div className="bg-gradient-to-br from-[#0052cc] via-[#2563eb] to-[#1d4ed8] text-white rounded-2xl p-6 shadow-md relative overflow-hidden flex flex-col justify-between space-y-6">
                {/* Background Decorative Headset SVG */}
                <div className="absolute right-3 bottom-3 w-36 h-36 bg-white/10 rounded-full flex items-center justify-center pointer-events-none transform translate-x-4 translate-y-4">
                    <FaHeadset className="w-20 h-20 text-white/20" />
                </div>

                <div className="space-y-2 relative z-10 max-w-xs">
                    <h4 className="text-xl font-black tracking-tight leading-tight">
                        Need immediate help?
                    </h4>
                    <p className="text-xs text-blue-100 font-medium leading-relaxed">
                        Our support representatives are available 24/7 for urgent policy-related inquiries.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 relative z-10">
                    <button
                        onClick={onLiveChat}
                        className="px-5 py-2.5 bg-white text-[#0052cc] hover:bg-blue-50 rounded-xl text-xs font-black flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                    >
                        <FaCommentDots className="w-3.5 h-3.5" />
                        <span>Live Chat</span>
                    </button>

                    <button
                        onClick={onEmailSupport}
                        className="px-5 py-2.5 bg-white/15 hover:bg-white/25 border border-white/30 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                        <FaEnvelope className="w-3.5 h-3.5" />
                        <span>Email Support</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DirectSupportWidget;
