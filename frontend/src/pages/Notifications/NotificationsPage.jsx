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
import { getNotifications, markAllAsRead, markAsRead, deleteNotification } from '../../services/notification.service';
import { useToast } from '../../hooks/useToast';

const NotificationsPage = () => {
  const { addToast } = useToast();
  const [notifications, setNotifications] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const res = await getNotifications();
        if (res.success && Array.isArray(res.notifications)) {
          const formatted = res.notifications.map(n => ({
            id: n._id,
            title: n.title,
            subtitle: n.subtitle || n.description?.substring(0, 50) + '...',
            timestamp: new Date(n.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
            unread: n.unread,
            priority: n.priority,
            source: n.source || "System",
            iconType: n.iconType || "bell",
            category: n.category,
            receivedTime: new Date(n.createdAt).toLocaleString('en-GB'),
            fullTitle: n.title,
            tags: n.tags || [],
            description: n.description,
            aiInsight: n.aiInsight || "",
            department: n.department || "General",
            publishedDate: new Date(n.createdAt).toLocaleDateString('en-GB'),
            isSaved: n.isSaved || false
          }));
          setNotifications(formatted);
          if (formatted.length > 0) {
            setSelectedId(formatted[0].id);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchNotifications();
    }
  }, [user]);

  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  const unreadCount = useMemo(() => {
    return notifications.filter(
      n => n.unread
    ).length;
  }, [notifications]);

  const handleMarkAllRead = async () => {
    try {
      await markAllAsRead();
      setNotifications(prev =>
        prev.map(n => ({
          ...n,
          unread: false
        }))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleSave = (id) => {
    setNotifications(prev =>
      prev.map(n =>
        n.id === id
          ? {
              ...n,
              isSaved: !n.isSaved
            }
          : n
      )
    );
  };

  const handleDismiss = async (id) => {
    try {
      await deleteNotification(id);
      setNotifications(prev =>
        prev.filter(n => n.id !== id)
      );

      if (selectedId === id) {
        const remaining = notifications.filter(n => n.id !== id);
        if (remaining.length > 0) {
          setSelectedId(remaining[0].id);
        } else {
          setSelectedId(null);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredNotifications = useMemo(() => {
    return notifications.filter(item => {

      if (
        activeTab === "unread" &&
        !item.unread
      ) {
        return false;
      }

      if (
        activeTab === "policies" &&
        !item.category
          .toLowerCase()
          .includes("policy")
      ) {
        return false;
      }

      if (
        activeTab === "schemes" &&
        !item.category
          .toLowerCase()
          .includes("scheme")
      ) {
        return false;
      }

      if (
        activeTab === "applications" &&
        !item.category
          .toLowerCase()
          .includes("application")
      ) {
        return false;
      }

      if (
        activeTab === "system" &&
        !item.category
          .toLowerCase()
          .includes("system")
      ) {
        return false;
      }

      if (searchQuery.trim()) {
        const query =
          searchQuery.toLowerCase();

        const matchesTitle =
          item.title
            .toLowerCase()
            .includes(query);

        const matchesSub =
          item.subtitle
            .toLowerCase()
            .includes(query);

        const matchesSource =
          item.source
            .toLowerCase()
            .includes(query);

        if (
          !matchesTitle &&
          !matchesSub &&
          !matchesSource
        ) {
          return false;
        }
      }

      if (
        categoryFilter !== "all" &&
        !item.category
          .toLowerCase()
          .includes(
            categoryFilter.toLowerCase()
          )
      ) {
        return false;
      }

      if (
        statusFilter === "unread" &&
        !item.unread
      ) {
        return false;
      }

      if (
        statusFilter === "read" &&
        item.unread
      ) {
        return false;
      }

      if (
        priorityFilter !== "all" &&
        item.priority.toUpperCase() !==
          priorityFilter.toUpperCase()
      ) {
        return false;
      }

      return true;
    });
  }, [
    notifications,
    activeTab,
    searchQuery,
    categoryFilter,
    statusFilter,
    priorityFilter
  ]);

  const selectedNotification = useMemo(() => {
    return (
      notifications.find(
        n => n.id === selectedId
      ) || notifications[0]
    );
  }, [
    notifications,
    selectedId
  ]);

  return (
    <div className="w-full space-y-6 select-none pb-8">

      <NotificationHeader
        onMarkAllRead={handleMarkAllRead}
        onOpenSettings={() =>
          addToast(
            "Notification settings configured.", 'info'
          )
        }
      />

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

      <NotificationTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        unreadCount={unreadCount}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        <div className="lg:col-span-5 space-y-3">

          {filteredNotifications.map(
            item => (
              <NotificationInboxCard
                key={item.id}
                notification={item}
                isSelected={
                  selectedId === item.id
                }
                onSelect={async () => {
                  setSelectedId(item.id);

                  if (item.unread) {
                    try {
                      await markAsRead(item.id);
                      setNotifications(prev =>
                        prev.map(n => n.id === item.id ? { ...n, unread: false } : n)
                      );
                    } catch (err) {
                      console.error(err);
                    }
                  }
                }}
              />
            )
          )}

          {filteredNotifications.length === 0 && (
            <div className="p-8 text-center bg-white border border-slate-200 rounded-2xl">
              <p className="text-xs font-bold text-slate-400">
                No notifications match your current filter.
              </p>
            </div>
          )}

          <div className="pt-3 text-center">
            <button
              onClick={() =>
                addToast(
                  "Loading historical notifications...", 'info'
                )
              }
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0052cc] hover:underline cursor-pointer"
            >
              <span>
                Load More Notifications
              </span>

              <FaChevronDown className="w-2.5 h-2.5" />
            </button>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-6">

          <NotificationDetailPanel
            notification={
              selectedNotification
            }
            onOpenPolicy={() =>
              addToast(
                `Opening full policy for: ${
                  selectedNotification?.fullTitle ||
                  selectedNotification?.title
                }`, 'info'
              )
            }
            onSave={() =>
              handleToggleSave(
                selectedNotification?.id
              )
            }
            onDismiss={() =>
              handleDismiss(
                selectedNotification?.id
              )
            }
          />

          <SummaryHealthWidget
            unread={unreadCount}
            highPriority="03"
            policyChanges="08"
            applications="05"
          />

          <RecentActivityTimeline
            onViewFullHistory={() =>
              addToast(
                "Opening activity timeline history...", 'info'
              )
            }
          />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default NotificationsPage;