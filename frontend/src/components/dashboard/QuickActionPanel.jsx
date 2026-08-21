import React from 'react';
import { 
  FaDownload, 
  FaBookmark, 
  FaRegBookmark, 
  FaExchangeAlt, 
  FaShareAlt, 
} from 'react-icons/fa';
import policyPreviewImg from '../../assets/policy_preview.png';
import { useToast } from '../../hooks/useToast';

const QuickActionPanel = ({ 
  policyId = "POL-2024-DPSF-001",
  isBookmarked = false, 
  onBookmarkToggle, 
  onDownloadPDF, 
  onCompare, 
  onShare, 
  onPrint 
}) => {
  const { addToast } = useToast();
  const tags = ["#PrivacyRights", "#DataIntegrity", "#DM&Security", "#CyberLaw", "#Compliance"];

  return (
    <div className="space-y-6">
      
      {/* Quick Actions Card */}
      <div className="bg-white rounded-2xl border border-slate-300 p-6 shadow-sm space-y-5">
        <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider select-none">
          Quick Actions
        </h3>

        {/* Buttons Stack */}
        <div className="space-y-3">
          {/* Download PDF Button */}
          <button 
            onClick={onDownloadPDF || (() => addToast("Downloading PDF...", 'info'))}
            className="w-full h-11 bg-[#0052cc] hover:bg-[#0047b3] text-white font-bold rounded-xl text-xs sm:text-sm transition-colors shadow-sm cursor-pointer flex items-center justify-center gap-2"
          >
            <FaDownload className="w-3.5 h-3.5" />
            <span>Download PDF</span>
          </button>

          {/* Bookmark Button */}
          <button 
            onClick={onBookmarkToggle || (() => addToast("Toggling bookmark...", 'info'))}
            className={`w-full h-11 border rounded-xl font-bold text-xs sm:text-sm transition-colors cursor-pointer flex items-center justify-center gap-2 ${
              isBookmarked 
                ? 'border-blue-200 bg-blue-50 text-[#0052cc] hover:bg-blue-100' 
                : 'border-slate-300 text-slate-700 hover:border-slate-300 hover:bg-slate-50 bg-white'
            }`}
          >
            {isBookmarked ? <FaBookmark className="w-3.5 h-3.5 text-[#0052cc]" /> : <FaRegBookmark className="w-3.5 h-3.5 text-slate-400" />}
            <span>{isBookmarked ? "Bookmarked" : "Bookmark Policy"}</span>
          </button>
        </div>

        {/* Small actions list with dividers */}
        <div className="pt-2 divide-y divide-slate-100 text-xs sm:text-sm font-bold text-slate-600">
          <button 
            onClick={onCompare || (() => addToast("Comparing versions...", 'info'))}
            className="w-full py-3.5 flex items-center gap-3 hover:text-[#0052cc] transition-colors bg-transparent border-none cursor-pointer text-left"
          >
            <FaExchangeAlt className="w-3.5 h-3.5 text-slate-400" />
            <span>Compare Versions</span>
          </button>
          
          <button 
            onClick={onShare || (() => addToast("Sharing policy...", 'info'))}
            className="w-full py-3.5 flex items-center gap-3 hover:text-[#0052cc] transition-colors bg-transparent border-none cursor-pointer text-left"
          >
            <FaShareAlt className="w-3.5 h-3.5 text-slate-400" />
            <span>Share with Team</span>
          </button>
          
          <button 
            onClick={onPrint || (() => addToast("Printing summary...", 'info'))}
            className="w-full py-3.5 flex items-center gap-3 hover:text-[#0052cc] transition-colors bg-transparent border-none cursor-pointer text-left"
          >
            <FaPrint className="w-3.5 h-3.5 text-slate-400" />
            <span>Print Summary</span>
          </button>
        </div>
      </div>

      {/* Image Preview Card */}
      <div className="bg-white rounded-2xl border border-slate-300 p-4 shadow-sm space-y-3">
        <div className="aspect-video w-full rounded-xl overflow-hidden bg-slate-50 border border-slate-100 flex items-center justify-center relative">
          <img 
            src={policyPreviewImg} 
            alt="Policy Visual Preview" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="text-[10px] font-bold text-slate-400 font-mono tracking-wider select-none text-center">
          Ref: {policyId}
        </div>
      </div>

      {/* Tags & Keywords Card */}
      <div className="bg-white rounded-2xl border border-slate-300 p-6 shadow-sm space-y-4">
        <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider select-none">
          Tags & Keywords
        </h3>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span 
              key={tag}
              className="px-2.5 py-1 bg-blue-50 text-[#0052cc] hover:bg-blue-100 transition-colors border border-blue-100 rounded-lg text-[10px] font-black tracking-wide cursor-default"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

    </div>
  );
};

export default QuickActionPanel;
