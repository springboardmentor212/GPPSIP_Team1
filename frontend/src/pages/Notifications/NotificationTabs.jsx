import React from 'react';

const NotificationTabs = ({ activeTab, onTabChange, unreadCount = 12 }) => {
  const tabs = [
    { id: 'all', label: 'All Notifications' },
    { id: 'unread', label: `Unread (${unreadCount})` },
    { id: 'policies', label: 'Policies' },
    { id: 'schemes', label: 'Schemes' },
    { id: 'applications', label: 'Applications' },
    { id: 'system', label: 'System' }
  ];

  return (
    <div className="w-full border-b border-slate-200 select-none overflow-x-auto no-scrollbar">
      <div className="flex items-center gap-6 pt-1">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`pb-3 text-xs font-bold transition-all relative whitespace-nowrap cursor-pointer ${isActive
                  ? 'text-[#0052cc]'
                  : 'text-slate-500 hover:text-slate-800'
                }`}
            >
              {tab.label}
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0052cc] rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default NotificationTabs;
