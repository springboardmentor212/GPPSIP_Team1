import React from 'react';

const NotificationTabs = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'all', label: "All" },
    { id: 'policy', label: "Policy Updates" },
    { id: 'scheme', label: "Scheme Updates" },
    { id: 'application', label: "Application Alerts" },
    { id: 'eligibility', label: "Eligibility Alerts" }
  ];

  return (
    <div className="w-full overflow-x-auto no-scrollbar pt-2 select-none">
      <div className="flex items-center gap-3 pb-2 shrink-0">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all duration-200 shrink-0 whitespace-nowrap cursor-pointer border ${
                isActive
                  ? 'bg-[#0052cc] text-white border-[#0052cc] shadow-sm shadow-blue-500/10'
                  : 'bg-white text-slate-600 border-slate-300 hover:border-slate-450 hover:text-slate-800'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default NotificationTabs;
