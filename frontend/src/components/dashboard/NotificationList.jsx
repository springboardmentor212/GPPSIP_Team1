import React, { useState, useEffect } from 'react';
import { FaBell, FaInfoCircle, FaCheckCircle, FaSpinner } from 'react-icons/fa';
import useAuth from '../../hooks/useAuth';
import { getNotifications, markAllAsRead } from '../../services/notification.service';

const NotificationList = ({ applications = [] }) => {
  const { user } = useAuth();
  const [apiNotifications, setApiNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await getNotifications();
        if (res.success && Array.isArray(res.notifications)) {
          const mapped = res.notifications.slice(0, 5).map(n => ({
            id: n._id,
            title: n.title || 'Notification',
            text: n.message || n.body || '',
            time: new Date(n.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
            type: n.category === 'success' || n.category === 'approval' ? 'success' : 'info'
          }));
          setApiNotifications(mapped);
        }
      } catch (err) {
        // API may fail if not logged in or backend down — fall back to application-based notifications
        console.error('Notifications API unavailable:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  // Build citizen notifications from their application statuses
  const getCitizenAppNotifications = () => {
    const filteredApps = applications.filter(a => a.status === 'Approved' || a.status === 'Rejected');
    return filteredApps.map((app, idx) => {
      const isApproved = app.status === 'Approved';
      return {
        id: app._id || idx,
        title: isApproved ? "Application Approved" : "Application Rejected",
        text: isApproved 
          ? `Your application for '${app.scheme?.title || 'Scheme'}' has been successfully processed.` 
          : `Your application for '${app.scheme?.title || 'Scheme'}' has been rejected. Reason: ${app.rejectionReason || 'No details provided.'}`,
        time: app.reviewedAt 
          ? new Date(app.reviewedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) 
          : new Date(app.updatedAt || app.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
        type: isApproved ? "success" : "info"
      };
    });
  };

  // Merge API notifications with citizen app notifications, deduplicate
  const isCitizen = user && user.role === 'Citizen';
  const appNotifications = isCitizen ? getCitizenAppNotifications() : [];
  const notifications = [...apiNotifications, ...appNotifications].slice(0, 5);

  const handleMarkAllRead = async () => {
    try {
      await markAllAsRead();
    } catch (err) {
      console.error('Failed to mark notifications as read:', err);
    }
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
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <FaSpinner className="animate-spin text-[#0052cc] w-5 h-5" />
          </div>
        ) : notifications.length > 0 ? (
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
