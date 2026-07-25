import React from 'react';
import { Link } from 'react-router';
import { 
  FaThLarge, 
  FaSearch, 
  FaBook, 
  FaUserCheck, 
  FaClipboardList, 
  FaBookmark, 
  FaBell, 
  FaRobot, 
  FaUser, 
  FaCog, 
  FaSignOutAlt 
} from 'react-icons/fa';

const Sidebar = ({ activeTab = 'dashboard', setActiveTab, handleLogout, user }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: FaThLarge },
    { id: 'search', label: 'Policy Search', icon: FaSearch },
    { id: 'schemes', label: 'Government Schemes', icon: FaBook },
    { id: 'eligibility', label: 'Eligibility Checker', icon: FaUserCheck },
    { id: 'applications', label: 'Applications', icon: FaClipboardList },
    { id: 'saved', label: 'Saved Policies', icon: FaBookmark },
    { id: 'notifications', label: 'Notifications', icon: FaBell },
    { id: 'ai', label: 'AI Assistant', icon: FaRobot },
  ];

  return (
    <aside className="w-72 bg-white border-r border-slate-300 flex flex-col shrink-0 h-screen sticky top-0">
      
      {/* Government Logo & Header Section */}
      <div className="p-6 border-b border-slate-300 flex items-center gap-3">
        {/* Ashoka Chakra-inspired Government Emblem SVG */}
        <div className="w-10 h-10 bg-gradient-to-tr from-[#0a369d] to-[#0052cc] rounded-lg flex items-center justify-center text-white shadow-md shadow-blue-500/10 shrink-0">
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="9" />
            <circle cx="12" cy="12" r="3" />
            <path d="M12 3v18M3 12h18M5.636 5.636l12.728 12.728M5.636 18.364L18.364 5.636" />
          </svg>
        </div>
        <div className="overflow-hidden">
          <h1 className="text-lg font-extrabold text-slate-800 tracking-tight leading-none">PolicyGPT</h1>
          <span className="text-[9px] font-extrabold text-[#0052cc] tracking-wider uppercase mt-1 inline-block">Intelligence Platform</span>
        </div>
      </div>

      {/* Main Navigation menu */}
      <div className="flex-grow p-4 space-y-1.5 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3.5 pl-6 pr-4 py-3 rounded-xl text-sm font-bold transition-all duration-200 group relative border-none cursor-pointer ${
                isActive
                  ? 'bg-blue-50/70 text-[#0052cc]'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50/50'
              }`}
            >
              {/* Left Indicator vertical bar */}
              {isActive && (
                <div className="absolute left-0 top-3.5 bottom-3.5 w-1 bg-[#0052cc] rounded-r-full"></div>
              )}
              <Icon className={`w-4.5 h-4.5 shrink-0 transition-transform duration-200 ${
                isActive ? 'text-[#0052cc]' : 'text-slate-400 group-hover:text-slate-600'
              }`} />
              <span className="tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Profile & Settings section */}
      <div className="p-4 border-t border-slate-300 space-y-1">
        {/* Profile */}
        <button
          onClick={() => setActiveTab('profile')}
          className={`w-full flex items-center gap-3.5 pl-6 pr-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 group relative border-none cursor-pointer ${
            activeTab === 'profile'
              ? 'bg-blue-50/70 text-[#0052cc]'
              : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50/50'
          }`}
        >
          {activeTab === 'profile' && (
            <div className="absolute left-0 top-3 bottom-3 w-1 bg-[#0052cc] rounded-r-full"></div>
          )}
          <FaUser className={`w-4 h-4 shrink-0 transition-transform duration-200 ${
            activeTab === 'profile' ? 'text-[#0052cc]' : 'text-slate-400 group-hover:text-slate-600'
          }`} />
          <span className="tracking-tight">Profile</span>
        </button>

        {/* Settings */}
        <button
          onClick={() => setActiveTab('settings')}
          className={`w-full flex items-center gap-3.5 pl-6 pr-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 group relative border-none cursor-pointer ${
            activeTab === 'settings'
              ? 'bg-blue-50/70 text-[#0052cc]'
              : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50/50'
          }`}
        >
          {activeTab === 'settings' && (
            <div className="absolute left-0 top-3 bottom-3 w-1 bg-[#0052cc] rounded-r-full"></div>
          )}
          <FaCog className={`w-4 h-4 shrink-0 transition-transform duration-200 ${
            activeTab === 'settings' ? 'text-[#0052cc]' : 'text-slate-400 group-hover:text-slate-600'
          }`} />
          <span className="tracking-tight">Settings</span>
        </button>

        {/* Divider */}
        <div className="h-px bg-slate-300 my-2"></div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3.5 pl-6 pr-4 py-2.5 rounded-xl text-sm font-bold text-rose-600 hover:bg-rose-50 border-none transition-all duration-200 group cursor-pointer"
        >
          <FaSignOutAlt className="w-4 h-4 text-rose-500 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5" />
          <span className="tracking-tight">Logout</span>
        </button>
      </div>

    </aside>
  );
};

export default Sidebar;
