import React, { useState } from 'react';
import { FaBell, FaInfoCircle, FaCheckCircle } from 'react-icons/fa';

const NotificationList = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Application Approved",
      text: "Your application for 'Atal Pension Yojana' has been successfully processed.",
      time: "2 hours ago",
      type: "success"
    },
    {
      id: 2,
      title: "New Scheme Alert",
      text: "A new solar subsidy scheme has been launched for small-scale farmers in your region.",
      time: "Yesterday, 4:30 PM",
      type: "info"
    }
  ]);

  const handleMarkAllRead = () => {
    setNotifications([]);
  };

  const getIcon = (type) => {
    switch (type) {
      case 'success': 
        return (
          <div className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-500">
            <FaCheckCircle className="w-4 h-4" />
          </div>
        );
      default: 
        return (
          <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-500">
            <FaInfoCircle className="w-4 h-4" />
          </div>
        );
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-300 shadow-sm flex flex-col justify-between w-full h-auto">
      
      {/* Header section */}
      <div className="flex items-center justify-between border-b border-slate-300 pb-4 shrink-0 mb-4">
        <h4 className="text-sm font-extrabold text-slate-800 leading-none">Recent Notifications</h4>
        {notifications.length > 0 && (
          <button 
            onClick={handleMarkAllRead}
            className="text-[10px] font-extrabold text-slate-400 hover:text-slate-650 cursor-pointer"
          >
            Mark all as read
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="flex-grow space-y-4">
        {notifications.length > 0 ? (
          notifications.map((item, idx) => (
            <div key={item.id}>
              <div className="flex items-start gap-4">
                <div className="shrink-0">
                  {getIcon(item.type)}
                </div>
                <div className="flex-grow">
                  <h5 className="text-xs sm:text-sm font-bold text-slate-700 leading-tight">
                    {item.title}
                  </h5>
                  <p className="text-[11px] sm:text-xs text-slate-500 font-light leading-relaxed mt-1">
                    {item.text}
                  </p>
                  <span className="text-[9px] sm:text-[10px] text-slate-400 font-medium block mt-1.5">
                    {item.time}
                  </span>
                </div>
              </div>
              {idx < notifications.length - 1 && <div className="border-t border-slate-300 my-4"></div>}
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center text-center py-8">
            <FaBell className="w-8 h-8 text-slate-200 mb-2" />
            <p className="text-xs text-slate-400 font-bold">No new notifications</p>
          </div>
        )}
      </div>

    </div>
  );
};

export default NotificationList;
