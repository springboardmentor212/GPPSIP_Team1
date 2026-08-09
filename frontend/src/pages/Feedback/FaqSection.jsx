import React from 'react';
import { FaQuestionCircle, FaShieldAlt, FaIdBadge, FaArrowRight } from 'react-icons/fa';

const FaqSection = ({ onReadFaq }) => {
    const faqs = [
        {
            id: 'faq1',
            title: 'How do I apply for new schemes?',
            desc: 'Step-by-step guide on using the Eligibility Checker and submitting your first application via PolicyGPT.',
            icon: FaQuestionCircle,
            iconBg: 'bg-blue-50 text-[#0052cc]'
        },
        {
            id: 'faq2',
            title: 'Understanding DPSF 2024',
            desc: 'Everything you need to know about the new Data Privacy & Security Framework and how it affects your data.',
            icon: FaShieldAlt,
            iconBg: 'bg-emerald-50 text-emerald-600'
        },
        {
            id: 'faq3',
            title: 'Check My Eligibility Status',
            desc: 'Common questions regarding document verification, waiting times, and appeals process for rejected schemes.',
            icon: FaIdBadge,
            iconBg: 'bg-purple-50 text-purple-600'
        }
    ];

    return (
        <div className="space-y-4 text-left select-none">
            <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                Frequently Asked Questions
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {faqs.map((faq) => {
                    const IconComp = faq.icon;
                    return (
                        <div
                            key={faq.id}
                            className="bg-white border border-slate-200 hover:border-slate-300 rounded-2xl p-5 shadow-sm flex flex-col justify-between space-y-4 transition-all group hover:shadow-md"
                        >
                            <div className="space-y-3">
                                <div className={`w-10 h-10 rounded-xl ${faq.iconBg} flex items-center justify-center`}>
                                    <IconComp className="w-5 h-5" />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-sm font-extrabold text-slate-900 tracking-tight group-hover:text-[#0052cc] transition-colors">
                                        {faq.title}
                                    </h3>
                                    <p className="text-xs text-slate-500 font-medium leading-relaxed">
                                        {faq.desc}
                                    </p>
                                </div>
                            </div>

                            <div className="pt-2 border-t border-slate-100">
                                <button
                                    onClick={() => onReadFaq(faq)}
                                    className="text-xs font-black text-[#0052cc] hover:underline flex items-center gap-1.5 cursor-pointer uppercase tracking-wider"
                                >
                                    <span>Read Article</span>
                                    <FaArrowRight className="w-2.5 h-2.5" />
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default FaqSection;
