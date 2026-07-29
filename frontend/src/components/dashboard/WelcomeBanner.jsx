import React from 'react';
import { FaCheckCircle, FaSearch } from 'react-icons/fa';

const WelcomeBanner = ({ user, onCheckEligibility, onSearchPolicies }) => {
  const firstName = user?.fullName ? user.fullName.split(' ')[0] : "Rajesh";

  return (
    <div className="relative rounded-3xl overflow-hidden shadow-lg border border-blue-500/10 bg-gradient-to-r from-[#0052cc] via-[#0047b3] to-[#0a369d] text-white p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 min-h-[220px]">
      
      {/* Background Decorative Blobs */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-2xl pointer-events-none -mr-20 -mt-20"></div>
      <div className="absolute bottom-0 left-0 w-60 h-60 bg-blue-950/20 rounded-full blur-xl pointer-events-none -ml-10 -mb-10"></div>

      {/* Main Text Content */}
      <div className="relative z-10 max-w-2xl">
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2 flex items-center gap-2">
          Good Morning, {firstName} 👋
        </h2>
        <p className="text-sm sm:text-base text-blue-100 font-medium mb-1">
          Welcome back to the PolicyGPT Intelligence Portal.
        </p>
        <p className="text-xs sm:text-sm text-blue-50/80 mb-6 font-light max-w-lg leading-relaxed">
          Based on your profile location (Maharashtra), age, and credentials, we have found new government schemes matching your eligibility tags.
        </p>
        
        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={onCheckEligibility}
            className="px-5 py-2.5 bg-white text-[#0052cc] hover:bg-blue-50 font-bold rounded-xl text-xs sm:text-sm shadow-md transition-colors flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <FaCheckCircle className="w-4 h-4 text-[#0052cc]" />
            Check Eligibility
          </button>
          
          <button 
            onClick={onSearchPolicies}
            className="px-5 py-2.5 bg-transparent border border-white/40 hover:bg-white/10 text-white font-bold rounded-xl text-xs sm:text-sm transition-colors flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <FaSearch className="w-3.5 h-3.5" />
            Search Policies
          </button>
        </div>
      </div>

      {/* Large Shield Illustration Container */}
      <div className="relative z-10 shrink-0 md:mr-4">
        {/* Glow effect */}
        <div className="absolute inset-0 bg-blue-400/20 rounded-full blur-xl scale-125"></div>
        {/* SVG Shield Emblem */}
        <svg 
          className="w-32 h-32 text-white/90 drop-shadow-xl animate-pulse" 
          viewBox="0 0 100 100" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="3.5"
          style={{ animationDuration: '4s' }}
        >
          {/* Outer Shield Border */}
          <path 
            d="M50 15 C65 15, 80 18, 80 18 C80 18, 85 45, 80 65 C72 82, 50 88, 50 88 C50 88, 28 82, 20 65 C15 45, 20 18, 20 18 C20 18, 35 15, 50 15 Z" 
            fill="url(#shieldGrad)"
          />
          {/* Inner details */}
          <path 
            d="M50 22 C61 22, 73 24.5, 73 24.5 C73 24.5, 77 47, 73 63 C66 77, 50 82, 50 82 C50 82, 34 77, 27 63 C23 47, 27 24.5, 27 24.5 C27 24.5, 39 22, 50 22 Z" 
            strokeLinejoin="round"
            strokeDasharray="2 2"
          />
          {/* Checkmark inside shield */}
          <path 
            d="M40 50 L47 57 L62 42" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="5" 
            className="text-white"
          />
          
          <defs>
            <linearGradient id="shieldGrad" x1="50" y1="15" x2="50" y2="88" gradientUnits="userSpaceOnUse">
              <stop stopColor="white" stopOpacity="0.12"/>
              <stop offset="1" stopColor="white" stopOpacity="0.03"/>
            </linearGradient>
          </defs>
        </svg>
      </div>

    </div>
  );
};

export default WelcomeBanner;
