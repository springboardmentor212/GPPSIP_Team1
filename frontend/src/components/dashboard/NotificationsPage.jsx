import React, { useState } from 'react';
import NotificationHeader from './NotificationHeader';
import NotificationTabs from './NotificationTabs';
import NotificationTimeline from './NotificationTimeline';
import LoadMoreButton from './LoadMoreButton';
import Footer from './Footer';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 301,
      type: "policy",
      category: "Policy Update",
      title: "Updated: Data Privacy Act Section 48",
      description: "Changes in compliance requirements for AI data processing were ratified this morning. Review the updated documentation for impact assessment.",
      timestamp: "2 hours ago",
      actionText: "View Document",
      readStatus: false,
      section: "Today"
    },
    {
      id: 302,
      type: "application",
      category: "Application Alert",
      title: "Application Approved: SME Grant #2293",
      description: "Your application for the Small Enterprise Technology grant has been successfully vetted and approved for disbursement.",
      timestamp: "5 hours ago",
      actionText: "Track Funding",
      readStatus: false,
      section: "Today"
    },
    {
      id: 303,
      type: "eligibility",
      category: "Eligibility Alert",
      title: "New Eligibility Criteria for Rural Housing",
      description: "The income threshold for rural housing schemes has been adjusted to ₹12L per annum. Check if your profile still qualifies.",
      timestamp: "8 hours ago",
      actionText: "Run Checker",
      readStatus: false,
      section: "Today"
    },
    {
      id: 304,
      type: "scheme",
      category: "Scheme Update",
      title: "Scheme Extension: Green Tech Subsidy",
      description: "The deadline for Phase 2 applications has been extended until March 31st due to high volume of requests.",
      timestamp: "Yesterday, 2:15 PM",
      actionText: "Apply Now",
      readStatus: true,
      section: "Yesterday"
    },
    {
      id: 305,
      type: "policy",
      category: "Policy Update",
      title: "Supreme Court Ruling on IP Rights",
      description: "A significant verdict on intellectual property in generative models was passed. Impact scores for tech policies updated.",
      timestamp: "Yesterday, 9:00 AM",
      actionText: "Read Summary",
      readStatus: true,
      section: "Yesterday"
    }
  ]);

  const [activeTab, setActiveTab] = useState("all");
  const [loadMoreLoading, setLoadMoreLoading] = useState(false);

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, readStatus: true })));
    alert("All notifications marked as read.");
  };

  const handleFilterToggle = () => {
    const tabs = ["all", "policy", "scheme", "application", "eligibility"];
    const nextIdx = (tabs.indexOf(activeTab) + 1) % tabs.length;
    setActiveTab(tabs[nextIdx]);
  };

  const handleAction = (item) => {
    alert(`Initiating action: "${item.actionText}" for "${item.title}"`);
    // Mark single notification as read on action click
    setNotifications(prev => prev.map(n => n.id === item.id ? { ...n, readStatus: true } : n));
  };

  const handleLoadMore = () => {
    setLoadMoreLoading(true);
    setTimeout(() => {
      setNotifications(prev => [
        ...prev,
        {
          id: 306 + prev.length,
          type: "scheme",
          category: "Scheme Update",
          title: "Startup India Infrastructure Support v2.0",
          description: "New co-working space incubation sub-grants open for tech startups in Tier-2/Tier-3 cities.",
          timestamp: "3 days ago",
          actionText: "Apply Now",
          readStatus: true,
          section: "Yesterday"
        }
      ]);
      setLoadMoreLoading(false);
    }, 600);
  };

  // Filter notification items
  const filteredNotifications = notifications.filter(item => {
    if (activeTab === "all") return true;
    return item.type === activeTab;
  });

  // Group notifications by section (Today, Yesterday)
  const groupedNotifications = filteredNotifications.reduce((acc, item) => {
    const sec = item.section || "Previous Alerts";
    if (!acc[sec]) {
      acc[sec] = [];
    }
    acc[sec].push(item);
    return acc;
  }, {});

  return (
    <div className="w-full space-y-8 select-none">
      
      {/* Page Header (Title, Subtitle, Actions) */}
      <NotificationHeader 
        onMarkAllRead={handleMarkAllRead} 
        onFilterToggle={handleFilterToggle} 
      />

      {/* Horizontal Tabs Filter Row */}
      <NotificationTabs 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
      />

      {/* Timeline of Notification Cards */}
      <NotificationTimeline 
        groupedNotifications={groupedNotifications} 
        onAction={handleAction} 
      />

      {/* Centered Load Previous Notifications Button */}
      <LoadMoreButton 
        onClick={handleLoadMore} 
        loading={loadMoreLoading} 
      />

      {/* Footer compliance block */}
      <Footer />

    </div>
  );
};

export default NotificationsPage;
