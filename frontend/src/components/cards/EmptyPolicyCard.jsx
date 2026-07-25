import React from 'react';
import { FaPlus } from 'react-icons/fa';

const EmptyPolicyCard = ({ onRequestDigitization }) => {
  return (
    <div 
      onClick={onRequestDigitization}
      className="bg-blue-50/10 hover:bg-white rounded-2xl p-6 border-2 border-dashed border-slate-200 hover:border-[#0052cc] transition-all duration-300 flex flex-col items-center justify-center text-center h-full group min-h-[320px] cursor-pointer shadow-sm"
    >
      {/* Plus Icon inside a circular background */}
      <div className="w-10 h-10 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-400 group-hover:border-[#0052cc] group-hover:text-[#0052cc] group-hover:rotate-90 transition-all duration-300 shadow-sm mb-4">
        <FaPlus className="w-3.5 h-3.5" />
      </div>

      {/* Message Text */}
      <p className="text-xs text-slate-400 font-light leading-relaxed max-w-[180px] mb-2">
        Cannot find what you're looking for?
      </p>

      {/* Blue CTA Action Link */}
      <span className="text-xs font-extrabold text-[#0052cc] hover:underline tracking-tight">
        Request Policy Digitization
      </span>
    </div>
  );
};

export default EmptyPolicyCard;
