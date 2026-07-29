import React from 'react';
import { FaArrowRight, FaSpinner } from 'react-icons/fa';

const NextButton = ({ onClick, loading = false, disabled = false, text = "Next" }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      className="px-6 h-11 bg-[#0052cc] hover:bg-[#0047b3] text-white font-extrabold rounded-full text-xs sm:text-sm transition-all duration-205 shadow-md shadow-blue-500/10 cursor-pointer flex items-center justify-center gap-2 select-none active:scale-98 disabled:opacity-60 disabled:cursor-not-allowed border-none ml-auto"
    >
      {loading ? (
        <FaSpinner className="w-4 h-4 animate-spin text-white" />
      ) : (
        <>
          <span>{text}</span>
          <FaArrowRight className="w-3.5 h-3.5" />
        </>
      )}
    </button>
  );
};

export default NextButton;
