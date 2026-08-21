import React from 'react';
import { FaArrowRight } from 'react-icons/fa';
import { useToast } from '../../hooks/useToast';

const RelatedPolicies = ({ relatedList }) => {
  const { addToast } = useToast();
  const defaultRelated = [
    {
      id: 101,
      category: "Infrastructure",
      title: "Cloud Storage Regulations 2023",
      description: "Guidelines for data localization and cloud interoperability standards.",
      date: "Dec 2023"
    },
    {
      id: 102,
      category: "E-Commerce",
      title: "Digital Payment Safety Act",
      description: "Standard protocols for secure transaction processing and...",
      date: "Feb 2024"
    },
    {
      id: 103,
      category: "Summary/Total",
      title: "AI Ethical Standards 2024",
      description: "Framework for responsible AI development and algorithmic...",
      date: "May 2024"
    }
  ];

  const displayList = relatedList || defaultRelated;

  const getCategoryColor = (cat) => {
    const uppercaseCat = cat?.toUpperCase() || 'GENERAL';
    switch (uppercaseCat) {
      case 'INFRASTRUCTURE':
        return 'text-blue-600 bg-blue-50 border-blue-100';
      case 'E-COMMERCE':
        return 'text-[#0052cc] bg-blue-50 border-blue-100';
      case 'SUMMARY/TOTAL':
        return 'text-slate-600 bg-slate-50 border-slate-100';
      default:
        return 'text-indigo-600 bg-indigo-50 border-indigo-100';
    }
  };

  return (
    <div className="space-y-4">
      {/* Header Row */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-black text-slate-800 tracking-tight">
          Related Policies
        </h3>
        <button
          onClick={() => addToast("Redirecting to Research repository...", 'info')}
          className="text-xs font-bold text-[#0052cc] hover:underline flex items-center gap-1 cursor-pointer bg-transparent border-none"
        >
          <span>View All Research</span>
          <FaArrowRight className="w-2.5 h-2.5" />
        </button>
      </div>

      {/* Grid of Related Policies */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {displayList.map((item) => (
          <div
            key={item.id}
            onClick={() => addToast(`Opening policy: ${item.title}`, 'info')}
            className="bg-white rounded-2xl border border-slate-300 p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 hover:border-blue-200 transition-all duration-350 cursor-pointer flex flex-col justify-between group h-full"
          >
            {/* Category Tag */}
            <div className="mb-3">
              <span className={`px-2 py-0.5 border rounded-lg text-[9px] font-black uppercase tracking-wider ${getCategoryColor(item.category)}`}>
                {item.category}
              </span>
            </div>

            {/* Title & Description */}
            <div className="space-y-2 flex-grow mb-4">
              <h4 className="text-xs sm:text-sm font-extrabold text-slate-800 leading-snug group-hover:text-[#0052cc] transition-colors line-clamp-1">
                {item.title}
              </h4>
              <p className="text-[11px] sm:text-xs text-slate-450 leading-relaxed font-light line-clamp-2">
                {item.description}
              </p>
            </div>

            {/* Bottom Row */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-50 shrink-0">
              <span className="text-[10px] font-extrabold text-slate-400">
                {item.date}
              </span>
              <div className="w-7 h-7 rounded-lg bg-slate-50 text-slate-400 group-hover:bg-blue-50 group-hover:text-[#0052cc] flex items-center justify-center shrink-0 transition-colors">
                <FaArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelatedPolicies;
