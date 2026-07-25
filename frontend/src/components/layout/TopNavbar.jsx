import React from 'react';
import { FaBell, FaSearch, FaRegEnvelope } from 'react-icons/fa';

const TopNavbar = ({ user, activeTab = 'dashboard', setSearchQuery }) => {
  return (
    <header className="h-20 bg-white border-b border-slate-300 sticky top-0 z-40 px-6 sm:px-8 flex items-center justify-between gap-4 shrink-0">
      
      {/* Left-Aligned Search Bar */}
      <div className="max-w-lg w-full relative flex items-center select-none">
        <div className="absolute left-3.5 text-slate-400 pointer-events-none">
          <FaSearch className="w-3.5 h-3.5" />
        </div>
        <input 
          type="text" 
          placeholder="Global search for policies, rules, or insights..." 
          onChange={(e) => setSearchQuery?.(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-slate-50/50 border border-slate-300 rounded-xl text-xs placeholder-slate-400 text-slate-700 font-bold focus:outline-none focus:bg-white focus:border-[#0052cc] focus:ring-2 focus:ring-blue-500/10 transition-all"
        />
      </div>

      {/* Action Indicators & User badge */}
      <div className="flex items-center gap-4">
        
        {/* Message Icon Button */}
        <button className="relative w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-50 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer border-none bg-transparent">
          <FaRegEnvelope className="w-4 h-4" />
        </button>

        {/* Notifications Icon Button */}
        <button className="relative w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-50 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer border-none bg-transparent">
          <FaBell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
        </button>

        <div className="h-6 w-px bg-slate-300"></div>

        {/* User Card */}
        <div className="flex items-center gap-3 select-none">
          <div className="flex flex-col text-right hidden sm:flex">
            <span className="text-xs font-black text-slate-800 leading-tight">
              {user?.fullName || "Admin User"}
            </span>
            <span className="text-[8px] font-black text-[#0052cc] uppercase tracking-wider leading-none mt-0.5">
              {user?.role === 'admin' ? 'SYSTEM ADMINISTRATOR' : (user?.role || 'SYSTEM ADMINISTRATOR')}
            </span>
          </div>
          
          <div className="w-8 h-8 rounded-full bg-blue-600 border border-blue-700 flex items-center justify-center text-white text-xs font-black shadow-sm shrink-0">
            {user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'A'}
          </div>
        </div>
      </div>

    </header>
  );
};

export default TopNavbar;
