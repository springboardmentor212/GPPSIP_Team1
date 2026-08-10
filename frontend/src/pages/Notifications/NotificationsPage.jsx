import React, { useState, useMemo, useEffect } from 'react';
import NotificationHeader from './NotificationHeader';
import NotificationFilterBar from './NotificationFilterBar';
import NotificationTabs from './NotificationTabs';
import NotificationInboxCard from './NotificationInboxCard';
import NotificationDetailPanel from './NotificationDetailPanel';
import SummaryHealthWidget from './SummaryHealthWidget';
import RecentActivityTimeline from './RecentActivityTimeline';
import Footer from '../../components/layout/Footer';
import { FaChevronDown } from 'react-icons/fa';
import useAuth from '../../hooks/useAuth';
import { getMyApplications } from '../../services/application.service';

const NotificationsPage = () => {
  // Mock notifications dataset reflecting design mockup
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "New Education Policy Framework 2024",
      subtitle: "The Ministry of Education has released the finalized framework for...",
      timestamp: "10m ago",
      unread: true,
      priority: "HIGH",
      source: "Ministry of Education",
      iconType: "at",
      category: "Policy Update",
      receivedTime: "Mar 18, 2024 - 10:45 AM",
      fullTitle: "Comprehensive Data Privacy & Security Framework (DPSF) 2024",
      tags: ["Digital Infrastructure", "Active"],
      description: "This policy introduces strict 72-hour breach notification rules and mandates local data residency for financial records. It replaces the fragmented regulations of the previous decade with a modern, high-accountability framework.",
      aiInsight: "This framework significantly aligns with GDPR Article 33, requiring immediate escalation of security protocols for your current tech audit applications.",
      department: "Min. of IT & Comm.",
      publishedDate: "Jan 12, 2024",
      isSaved: false
    },
    {
      id: 2,
      title: "Eligibility Status Updated",
      subtitle: "Your application for the Rural Tech Grant (RTG-202) has been moved to...",
      timestamp: "2h ago",
      unread: false,
      priority: "NORMAL",
      source: "Dept. of Science & Tech",
      iconType: "check",
      category: "Application Alert",
      receivedTime: "Mar 18, 2024 - 08:30 AM",
      fullTitle: "Rural Tech Grant (RTG-202) Application Progress",
      tags: ["Applications", "Active"],
      description: "Your application for the Rural Tech Grant (RTG-202) has successfully passed stage 2 technical review and is now scheduled for final committee evaluation.",
      aiInsight: "Documentation compliance score is evaluated at 94%. Ensure financial co-funding proof is updated.",
      department: "Dept. of Science & Tech",
      publishedDate: "Feb 14, 2024",
      isSaved: false
    },
    {
      id: 3,
      title: "Major Update: Healthcare Subsidy Scheme",
      subtitle: "Benefit caps have been increased by 15% for urban families effective from...",
      timestamp: "5h ago",
      unread: false,
      priority: "NORMAL",
      source: "Ministry of Health",
      iconType: "landmark",
      category: "Scheme Update",
      receivedTime: "Mar 18, 2024 - 05:15 AM",
      fullTitle: "Urban Healthcare Subsidy Subsidy Expansion Guidelines",
      tags: ["Schemes", "Active"],
      description: "Benefit caps have been increased by 15% for urban families effective immediately. Revised caps apply to all existing active claims.",
      aiInsight: "This scheme adjustment allows up to ₹45,000 additional annual claim benefits for registered members.",
      department: "Ministry of Health",
      publishedDate: "Mar 01, 2024",
      isSaved: false
    },
    {
      id: 4,
      title: "Weekly System Report Ready",
      subtitle: "Your automated policy compliance report for Week 12 is now available for...",
      timestamp: "Yesterday",
      unread: false,
      priority: "LOW",
      source: "System Admin",
      iconType: "cog",
      category: "System Alert",
      receivedTime: "Mar 17, 2024 - 06:00 PM",
      fullTitle: "Weekly Policy Audit & System Health Report (Week 12)",
      tags: ["System", "Active"],
      description: "Your automated policy compliance report for Week 12 is now generated. Zero critical compliance breaches detected.",
      aiInsight: "All 18 monitored legal frameworks remain in full compliance status.",
      department: "System Admin",
      publishedDate: "Mar 17, 2024",
      isSaved: false
    }
  ]);

  // Selected Notification state
  const [selectedId, setSelectedId] = useState(1);
  const { user } = useAuth();
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && user.role === 'Citizen') {
      setLoading(true);
      getMyApplications()
        .then(res => {
          if (res.success && Array.isArray(res.applications)) {
            setApps(res.applications);
          }
        })
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [user]);

  useEffect(() => {
    if (user && user.role === 'Citizen' && apps.length > 0) {
      const mapped = apps.filter(a => a.status === 'Approved' || a.status === 'Rejected').map((app, idx) => {
        const isApproved = app.status === 'Approved';
        return {
          id: app._id || idx,
          title: isApproved ? "Eligibility Status Approved" : "Eligibility Status Rejected",
          subtitle: isApproved
            ? `Your application for ${app.scheme?.title || 'the scheme'} has been successfully approved.`
            : `Your application for ${app.scheme?.title || 'the scheme'} was rejected.`,
          timestamp: app.reviewedAt ? new Date(app.reviewedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : 'Just now',
          unread: false,
          priority: isApproved ? "HIGH" : "NORMAL",
          source: app.scheme?.department || app.scheme?.category || "Gov. Department",
          iconType: isApproved ? "check" : "cog",
          category: "Application Alert",
          receivedTime: app.reviewedAt ? new Date(app.reviewedAt).toLocaleString('en-GB') : '',
          fullTitle: isApproved
            ? `Application Approved: ${app.scheme?.title}`
            : `Application Rejected: ${app.scheme?.title}`,
          tags: ["Applications", app.status],
          description: isApproved
            ? `We are pleased to inform you that your application (ID: ${app.applicationId}) for the scheme "${app.scheme?.title}" has been reviewed and approved.`
            : `We regret to inform you that your application (ID: ${app.applicationId}) for the scheme "${app.scheme?.title}" has been rejected. Reason: ${app.rejectionReason || 'No details provided.'}`,
          aiInsight: isApproved
            ? "Your application is fully approved. You are eligible to receive maximum benefit Aid."
            : "We recommend reviewing the rejection reason, updating your documentation, and contacting support if needed.",
          department: app.scheme?.category || app.scheme?.department || "Department",
          publishedDate: app.reviewedAt ? new Date(app.reviewedAt).toLocaleDateString('en-GB') : '',
          isSaved: false
        };
      });
      setNotifications(mapped);
      if (mapped.length > 0) {
        setSelectedId(mapped[0].id);
      } else {
        setNotifications([]);
      }
    } else if (user && user.role === 'Citizen') {
      setNotifications([]);
    }
  }, [apps, user]);

  // Filter States
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  const unreadCount = useMemo(() => {
    return notifications.filter(n => n.unread).length;
  }, [notifications]);

  // Handle Mark All Read
  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  // Handle Save / Toggle Bookmark
  const handleToggleSave = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isSaved: !n.isSaved } : n));
  };

  // Handle Dismiss
  const handleDismiss = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    if (selectedId === id) {
      const remaining = notifications.filter(n => n.id !== id);
      if (remaining.length > 0) {
        setSelectedId(remaining[0].id);
      }
    }
  };

  // Filtered Notifications List
  const filteredNotifications = useMemo(() => {
    return notifications.filter((item) => {
      // Tab Filter
      if (activeTab === "unread" && !item.unread) return false;
      if (activeTab === "policies" && !item.category.toLowerCase().includes("policy")) return false;
      if (activeTab === "schemes" && !item.category.toLowerCase().includes("scheme")) return false;
      if (activeTab === "applications" && !item.category.toLowerCase().includes("application")) return false;
      if (activeTab === "system" && !item.category.toLowerCase().includes("system")) return false;

      // Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(query);
        const matchesSub = item.subtitle.toLowerCase().includes(query);
        const matchesSource = item.source.toLowerCase().includes(query);
        if (!matchesTitle && !matchesSub && !matchesSource) return false;
      }

      // Dropdown Filters
      if (categoryFilter !== "all" && !item.category.toLowerCase().includes(categoryFilter.toLowerCase())) return false;
      if (statusFilter === "unread" && !item.unread) return false;
      if (statusFilter === "read" && item.unread) return false;
      if (priorityFilter !== "all" && item.priority.toUpperCase() !== priorityFilter.toUpperCase()) return false;

      return true;
    });
  }, [notifications, activeTab, searchQuery, categoryFilter, statusFilter, priorityFilter]);

  const selectedNotification = useMemo(() => {
    return notifications.find(n => n.id === selectedId) || notifications[0];
  }, [notifications, selectedId]);

  return (
    <div className="w-full space-y-6 select-none pb-8">
      {/* 1. Header Row (Breadcrumb, Title, Notification Settings, Mark All as Read) */}
      <NotificationHeader
        onMarkAllRead={handleMarkAllRead}
        onOpenSettings={() => alert("Notification settings configured.")}
      />

      {/* 2. Search & Dropdown Filters Bar */}
      <NotificationFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        categoryFilter={categoryFilter}
        onCategoryChange={setCategoryFilter}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        priorityFilter={priorityFilter}
        onPriorityChange={setPriorityFilter}
      />

      {/* 3. Category Tabs Row */}
      <NotificationTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        unreadCount={12}
      />

      {/* 4. Core 2-Column Responsive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* LEFT COLUMN: Notification List (5 Cols on large screen) */}
        <div className="lg:col-span-5 space-y-3">
          {filteredNotifications.map((item) => (
            <NotificationInboxCard
              key={item.id}
              notification={item}
              isSelected={selectedId === item.id}
              onSelect={() => {
                setSelectedId(item.id);
                // Mark read on select
                if (item.unread) {
                  setNotifications(prev => prev.map(n => n.id === item.id ? { ...n, unread: false } : n));
                }
              }}
            />
          ))}

          {filteredNotifications.length === 0 && (
            <div className="p-8 text-center bg-white border border-slate-200 rounded-2xl">
              <p className="text-xs font-bold text-slate-400">No notifications match your current filter.</p>
            </div>
          )}

          {/* Centered Load More Notifications Link */}
          <div className="pt-3 text-center">
            <button
              onClick={() => alert("Loading historical notifications...")}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0052cc] hover:underline cursor-pointer"
            >
              <span>Load More Notifications</span>
              <FaChevronDown className="w-2.5 h-2.5" />
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: Selected Notification Detail & Widgets (7 Cols on large screen) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Detailed Notification Card */}
          <NotificationDetailPanel
            notification={selectedNotification}
            onOpenPolicy={() => alert(`Opening full policy for: ${selectedNotification?.fullTitle || selectedNotification?.title}`)}
            onSave={() => handleToggleSave(selectedNotification?.id)}
            onDismiss={() => handleDismiss(selectedNotification?.id)}
          />

          {/* Summary & Health Widget */}
          <SummaryHealthWidget
            unread="12"
            highPriority="03"
            policyChanges="08"
            applications="05"
          />

          {/* Recent Activity Timeline Widget */}
          <RecentActivityTimeline
            onViewFullHistory={() => alert("Opening activity timeline history...")}
          />
        </div>

      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default NotificationsPage;
