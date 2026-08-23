import React, { useState, useEffect } from 'react';
import useAuth from '../../hooks/useAuth';
import { Navigate } from 'react-router';
import {
  FaCheckCircle,
  FaBookmark,
  FaClipboardList,
  FaBell,
  FaSearch,
  FaArrowRight,
  FaCloudUploadAlt,
  FaQuestionCircle
} from 'react-icons/fa';

// Import Layout Components
import DashboardLayout from '../../components/layout/DashboardLayout';
import Footer from '../../components/layout/Footer';

// Import Dashboard Subcomponents
import WelcomeBanner from '../../components/dashboard/WelcomeBanner';
import StatsCard from '../../components/cards/StatsCard';
import RecommendationCard from '../../components/cards/RecommendationCard';
import QuickActionCard from '../../components/dashboard/QuickActionCard';
import ApplicationTrend from '../../components/dashboard/ApplicationTrend';
import SchemeCategoryCard from '../../components/dashboard/SchemeCategoryCard';
import DeadlineCard from '../../components/cards/DeadlineCard';
import NotificationList from '../../components/dashboard/NotificationList';

// Import Standalone Pages
import PolicySearchPage from '../Policies/PolicySearchPage';
import PolicyDetailsPage from '../Policies/PolicyDetailsPage';
import SavedPoliciesPage from '../Policies/SavedPoliciesPage';
import GovernmentSchemesPage from '../Schemes/GovernmentSchemesPage';
import EligibilityPage from '../Eligibility/EligibilityPage';
import NotificationsPage from '../Notifications/NotificationsPage';
import ApplicationsPage from '../Applications/ApplicationsPage';
import ProfilePage from '../Profile/ProfilePage';
import SettingsPage from '../Settings/SettingsPage';
import AIAssistantPage from '../AIAssistant/AIAssistantPage';
import ReportsPage from '../Reports/ReportsPage';
import FeedbackPage from '../Feedback/FeedbackPage';
import ComparisonPage from '../Policies/ComparisonPage';
import { useLocation } from 'react-router';

// Import Super Admin pages
import UserManagement from '../SuperAdmin/UserManagement';
import AdminOversight from '../SuperAdmin/AdminOversight';
import AuditLogs from '../SuperAdmin/AuditLogs';

// Import Services
import { getPolicies } from '../../services/policy.service';
import { getSchemes } from '../../services/scheme.service';
import {
  getMyApplications,
  getPendingApplications
} from '../../services/application.service';
import { getAdminStats } from '../../services/admin.service';
import { savePolicy, removeSavedPolicy, getSavedPolicies } from '../../services/savedPolicy.service';
import { getRecommendations } from '../../services/recommendation.service';
import { getSavedSchemes, saveScheme, removeSavedScheme } from '../../services/savedScheme.service';
import { useToast } from '../../hooks/useToast';

// Import UI components
import Modal from '../../components/modals/Modal';
import StatusBadge from '../../components/ui/StatusBadge';

const Dashboard = () => {
  const { user, isInitializing, handleLogout } = useAuth();
  const { addToast } = useToast();
  const location = useLocation();

  // Parse initial tab from URL query params (e.g. ?tab=schemes)
  const initialTab =
    new URLSearchParams(location.search).get('tab') || 'dashboard';

  const [activeTab, setActiveTab] = useState(initialTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [savedSchemes, setSavedSchemes] = useState([false, false]);
  const [selectedAppForDetails, setSelectedAppForDetails] = useState(null);
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [isDetailsModalOpen, setDetailsModalOpen] = useState(false);
  const [dashboardSubTab, setDashboardSubTab] = useState('Recent');
  const [dbStatus, setDbStatus] = useState('checking');

  const [stats, setStats] = useState({
    policies: 0,
    schemes: 0,
    recommendations: [],
    applications: 0,

    citizen: {
      total: 0,
      pending: 0,
      approved: 0,
      rejected: 0,
      list: []
    },

    admin: {
      totalUsers: 0,
      totalOfficials: 0,
      totalPolicies: 0,
      totalSchemes: 0,
      totalApplications: 0,
      pendingApplications: 0,
      approvedApplications: 0,
      rejectedApplications: 0
    }
  });

  // Sync activeTab if URL query param changes
  useEffect(() => {
    const tabFromUrl = new URLSearchParams(location.search).get('tab');

    if (tabFromUrl) {
      setActiveTab((prev) =>
        prev !== tabFromUrl ? tabFromUrl : prev
      );
    }
  }, [location.search]);

  // Verify health check on load to report live connection status
  useEffect(() => {
    const verifyDatabaseConnection = async () => {
      try {
        const response = await fetch('http://localhost:3000/health');
        const data = await response.json();

        if (data.success) {
          setDbStatus('connected');
        } else {
          setDbStatus('disconnected');
        }
      } catch (err) {
        setDbStatus('disconnected');
      }
    };

    verifyDatabaseConnection();

    // Fetch live dashboard stats
    const fetchStats = async () => {
      try {
        const [polRes, schRes] = await Promise.all([
          getPolicies().catch(() => ({
            success: true,
            policies: []
          })),

          getSchemes().catch(() => ({
            success: true,
            schemes: []
          }))
        ]);

        let appCount = 0;

        let citizenStats = {
          total: 0,
          pending: 0,
          approved: 0,
          rejected: 0,
          list: []
        };

        let adminStats = {
          totalUsers: 0,
          totalOfficials: 0,
          totalPolicies: 0,
          totalSchemes: 0,
          totalApplications: 0,
          pendingApplications: 0,
          approvedApplications: 0,
          rejectedApplications: 0
        };

        let savedState = [false, false];
        let recommendations = [];

        if (user) {
          if (user.role === 'Citizen') {
            const appRes = await getMyApplications().catch(() => ({
              success: true,
              applications: []
            }));

            const apps = appRes.applications || [];

            citizenStats.total = apps.length;

            citizenStats.pending = apps.filter(
              (a) => a.status === 'Pending'
            ).length;

            citizenStats.approved = apps.filter(
              (a) => a.status === 'Approved'
            ).length;

            citizenStats.rejected = apps.filter(
              (a) => a.status === 'Rejected'
            ).length;

            citizenStats.list = apps;

            appCount = apps.length;
            
            // Load Recommendations for Citizen
            try {
              const recRes = await getRecommendations();
              if (recRes.success) {
                recommendations = recRes.schemes.slice(0, 2);
              }
            } catch (e) {
              console.error("Failed to load recommendations:", e);
            }
          } else if (
            user.role === 'Gov. Official'
          ) {
            const appRes = await getPendingApplications(
              'Pending'
            ).catch(() => ({
              success: true,
              applications: []
            }));

            appCount = appRes.applications?.length || 0;
            // Provide fallback recommendations for officials based on schemes
            recommendations = schRes.schemes?.slice(0, 2) || [];
          } else if (user.role === 'Super Admin') {
            const adminRes = await getAdminStats().catch(() => ({
              success: true,
              stats: {}
            }));

            if (adminRes.success && adminRes.stats) {
              adminStats = adminRes.stats;
            }
            recommendations = schRes.schemes?.slice(0, 2) || [];
          }
          
          // Fetch accurate bookmark status for recommendations (which are Schemes now)
          try {
            const savedRes = await getSavedSchemes();
            if (savedRes.success && Array.isArray(savedRes.savedSchemes)) {
              const savedIds = new Set(savedRes.savedSchemes.map(s => s.scheme._id || s.scheme));
              savedState = recommendations.map(p => savedIds.has(p._id));
            }
          } catch (e) {
            console.error('Failed to load bookmark statuses:', e);
          }
        }

        setSavedSchemes(savedState);
        setStats({
          policies: polRes.policies?.length || 0,
          schemes: schRes.schemes?.length || 0,
          applications: appCount,
          recommendations,
          citizen: citizenStats,
          admin: adminStats
        });
      } catch (err) {
        console.error(
          'Failed to load dashboard stats:',
          err
        );
      }
    };

    fetchStats();
  }, []);

  // Protect route
  if (isInitializing) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f0f4f9] space-y-4">
        <div className="w-12 h-12 border-4 border-[#0052cc] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-bold text-slate-500">Connecting to server, please wait...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const handleToggleSave = async (idx, id) => {
    try {
      if (!user) {
        addToast("Please log in to save schemes", "error");
        return;
      }
      const isCurrentlySaved = savedSchemes[idx];
      if (isCurrentlySaved) {
        await removeSavedScheme(id);
      } else {
        await saveScheme(id);
      }
      
      const newSaved = [...savedSchemes];
      newSaved[idx] = !isCurrentlySaved;
      setSavedSchemes(newSaved);
      
      addToast(isCurrentlySaved ? "Removed from saved" : "Saved successfully", "success");
    } catch (err) {
      addToast("Failed to update saved status", "error");
    }
  };

  const renderApplicationTracker = () => {
    let listToShow = [];

    if (dashboardSubTab === 'Recent') {
      listToShow = stats.citizen.list.slice(0, 3);
    } else if (dashboardSubTab === 'Pending') {
      listToShow = stats.citizen.list.filter(
        (a) => a.status === 'Pending'
      );
    } else if (dashboardSubTab === 'Approved') {
      listToShow = stats.citizen.list.filter(
        (a) => a.status === 'Approved'
      );
    } else if (dashboardSubTab === 'Rejected') {
      listToShow = stats.citizen.list.filter(
        (a) => a.status === 'Rejected'
      );
    }

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-black text-slate-800 tracking-tight">
            Application Status Tracker
          </h3>

          <button
            onClick={() => setActiveTab('applications')}
            className="text-xs font-bold text-[#0052cc] hover:underline flex items-center gap-1 cursor-pointer border-none bg-transparent"
          >
            <span>Manage All Applications</span>
            <FaArrowRight className="w-2.5 h-2.5" />
          </button>
        </div>

        <div className="bg-white rounded-3xl border border-slate-300 p-6 shadow-sm space-y-6">

          {/* Sub-tabs */}
          <div className="flex items-center gap-2 border-b border-slate-200 pb-3 flex-wrap">
            {['Recent', 'Pending', 'Approved', 'Rejected'].map(
              (subTab) => (
                <button
                  key={subTab}
                  onClick={() => setDashboardSubTab(subTab)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border-none ${
                    dashboardSubTab === subTab
                      ? 'bg-[#0052cc]/10 text-[#0052cc]'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-850 bg-transparent'
                  }`}
                >
                  {subTab} (
                    {subTab === 'Recent'
                      ? stats.citizen.list.slice(0, 3).length
                      : subTab === 'Pending'
                      ? stats.citizen.pending
                      : subTab === 'Approved'
                      ? stats.citizen.approved
                      : stats.citizen.rejected}
                  )
                </button>
              )
            )}
          </div>

          {/* List items */}
          <div className="space-y-4">
            {listToShow.map((app) => (
              <div
                key={app._id}
                onClick={() => {
                  setSelectedAppForDetails(app);
                  setDetailsModalOpen(true);
                }}
                className="border border-slate-200 hover:border-slate-350 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all cursor-pointer bg-slate-50/50 hover:bg-slate-50"
              >
                <div className="space-y-1.5 text-left">
                  <h4 className="text-sm font-extrabold text-slate-800 line-clamp-1">
                    {app.scheme?.title || 'Unknown Scheme'}
                  </h4>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-slate-400 text-[10px] font-bold">
                    <span>
                      ID:{' '}
                      <span className="font-mono text-slate-705">
                        {app.applicationId}
                      </span>
                    </span>

                    <span>
                      Submitted:{' '}
                      <span className="text-slate-500">
                        {new Date(
                          app.submittedAt || app.createdAt
                        ).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </span>
                    </span>

                    {app.status === 'Approved' &&
                      app.reviewedAt && (
                        <span>
                          Approved:{' '}
                          <span className="text-emerald-600">
                            {new Date(
                              app.reviewedAt
                            ).toLocaleDateString('en-GB', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </span>
                        </span>
                      )}
                  </div>

                  {app.status === 'Rejected' &&
                    app.rejectionReason && (
                      <div className="mt-2 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-100 rounded-xl px-3 py-1.5 max-w-xl">
                        <span className="font-bold text-rose-800">
                          Reason:
                        </span>{' '}
                        "{app.rejectionReason}"
                      </div>
                    )}
                </div>

                <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                  <StatusBadge status={app.status} />

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedAppForDetails(app);
                      setDetailsModalOpen(true);
                    }}
                    className="px-3.5 py-1.5 bg-[#0052cc]/10 hover:bg-[#0052cc]/20 text-[#0052cc] rounded-xl text-xs font-bold transition-all cursor-pointer border-none"
                  >
                    View
                  </button>
                </div>
              </div>
            ))}

            {listToShow.length === 0 && (
              <div className="text-center py-10 flex flex-col items-center justify-center">
                <FaClipboardList className="text-slate-350 w-12 h-12 mb-3" />

                <p className="text-xs text-slate-450 font-bold">
                  {dashboardSubTab === 'Recent'
                    ? 'No applications submitted yet.'
                    : dashboardSubTab === 'Pending'
                    ? 'No pending applications.'
                    : dashboardSubTab === 'Approved'
                    ? 'No approved applications.'
                    : 'No rejected applications.'}
                </p>

                {dashboardSubTab === 'Recent' && (
                  <button
                    onClick={() => setActiveTab('schemes')}
                    className="mt-4 px-4 py-2 bg-[#0052cc] hover:bg-[#0047b3] text-white text-xs font-bold rounded-xl cursor-pointer border-none shadow-sm"
                  >
                    Explore Government Schemes
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Render tab content dynamically
  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-8">

            {/* Welcome Banner */}
            <WelcomeBanner
              user={user}
              onCheckEligibility={() =>
                setActiveTab('eligibility')
              }
              onSearchPolicies={() =>
                setActiveTab('search')
              }
            />

            {/* Statistics Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

              {user?.role === 'Citizen' ? (
                <>
                  <StatsCard
                    title="Total Applications"
                    value={stats.citizen?.total || 0}
                    growth="All submissions"
                    growthType="neutral"
                    icon={FaClipboardList}
                    color="blue"
                  />

                  <StatsCard
                    title="Pending Review"
                    value={stats.citizen?.pending || 0}
                    growth="Awaiting decision"
                    growthType="neutral"
                    icon={FaClipboardList}
                    color="orange"
                  />

                  <StatsCard
                    title="Approved Schemes"
                    value={stats.citizen?.approved || 0}
                    growth="Ready to benefit"
                    growthType="positive"
                    icon={FaCheckCircle}
                    color="green"
                  />

                  <StatsCard
                    title="Rejected Schemes"
                    value={stats.citizen?.rejected || 0}
                    growth="Needs attention"
                    growthType="negative"
                    icon={FaClipboardList}
                    color="red"
                  />
                </>
              ) : user?.role === 'Super Admin' ? (
                <>
                  <StatsCard
                    title="Total Users"
                    value={stats.admin?.totalUsers || 0}
                    growth="Citizen directory"
                    growthType="neutral"
                    icon={FaCheckCircle}
                    color="blue"
                  />

                  <StatsCard
                    title="Gov. Officials"
                    value={stats.admin?.totalOfficials || 0}
                    growth="Approved review staff"
                    growthType="neutral"
                    icon={FaCheckCircle}
                    color="purple"
                  />

                  <StatsCard
                    title="Total Schemes"
                    value={stats.admin?.totalSchemes || 0}
                    growth="Active catalog"
                    growthType="positive"
                    icon={FaCheckCircle}
                    color="green"
                  />

                  <StatsCard
                    title="Total Applications"
                    value={stats.admin?.totalApplications || 0}
                    growth="Submissions tracking"
                    growthType="neutral"
                    icon={FaClipboardList}
                    color="orange"
                  />
                </>
              ) : (
                <>
                  <StatsCard
                    title="Total Schemes"
                    value={stats.schemes}
                    growth="Active directory"
                    growthType="positive"
                    icon={FaCheckCircle}
                    color="blue"
                  />

                  <StatsCard
                    title="Total Policies"
                    value={stats.policies}
                    growth="Active directory"
                    growthType="neutral"
                    icon={FaBookmark}
                    color="purple"
                  />

                  <StatsCard
                    title="Pending Approvals"
                    value={stats.applications || 0}
                    growth="Action Required"
                    growthType="neutral"
                    icon={FaClipboardList}
                    color="orange"
                  />

                  <StatsCard
                    title="Notifications"
                    value="0"
                    growth="All caught up"
                    growthType="positive"
                    icon={FaBell}
                    color="green"
                  />
                </>
              )}
            </div>

            {/* Core Multi-Column Content Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

              {/* LEFT & CENTER COLUMN */}
              <div className="lg:col-span-2 space-y-8">



                {/* Super Admin System Overview */}
                {user?.role === 'Super Admin' ? (
                  <div className="bg-white border border-slate-350 rounded-3xl p-6 space-y-4 text-left shadow-sm">

                    <h3 className="text-base font-extrabold text-slate-800 tracking-tight">
                      System Status Overview
                    </h3>

                    <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                      Detailed status tracking for all applications submitted by citizens.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">

                      <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl">
                        <span className="text-[10px] font-black text-slate-400 uppercase block">
                          Pending Review
                        </span>

                        <span className="text-3xl font-black text-amber-600 block mt-2">
                          {stats.admin?.pendingApplications || 0}
                        </span>
                      </div>

                      <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl">
                        <span className="text-[10px] font-black text-slate-400 uppercase block">
                          Approved Schemes
                        </span>

                        <span className="text-3xl font-black text-emerald-600 block mt-2">
                          {stats.admin?.approvedApplications || 0}
                        </span>
                      </div>

                      <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl">
                        <span className="text-[10px] font-black text-slate-400 uppercase block">
                          Rejected Submissions
                        </span>

                        <span className="text-3xl font-black text-rose-600 block mt-2">
                          {stats.admin?.rejectedApplications || 0}
                        </span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between font-semibold">
                      <div>
                        <h4 className="text-xs font-bold text-slate-800">
                          Total System-Wide Policies
                        </h4>

                        <span className="text-[10px] text-slate-400 font-light mt-0.5 block">
                          Approved frameworks active in search indexes
                        </span>
                      </div>

                      <span className="text-lg font-black text-[#0052cc]">
                        {stats.admin?.totalPolicies || 0}
                      </span>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Citizen Dashboard Application Status Tracker */}
                    {user?.role === 'Citizen' &&
                      renderApplicationTracker()}

                    {/* Recommended Schemes */}
                    <div className="space-y-4">

                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-black text-slate-800 tracking-tight">
                          Latest Schemes
                        </h3>

                        <button
                          onClick={() =>
                            setActiveTab('schemes')
                          }
                          className="text-xs font-bold text-[#0052cc] hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <span>View All Schemes</span>
                          <FaArrowRight className="w-2.5 h-2.5" />
                        </button>
                      </div>

                      <div className="flex flex-col gap-5">

                        {stats.recommendations.map(
                          (scheme, idx) => (
                            <RecommendationCard
                              key={
                                scheme._id || idx
                              }
                              title={scheme.title}
                              ministry={scheme.department || scheme.category}
                              matchPercentage={scheme.matchPercentage || "90"}
                              eligibilityTag={scheme.eligibilityTag || "Eligible"}
                              description={
                                scheme.description
                              }
                              isSaved={
                                savedSchemes[idx]
                              }
                              onSave={() =>
                                handleToggleSave(idx, scheme._id)
                              }
                              onApply={() =>
                                setActiveTab('schemes')
                              }
                            />
                          )
                        )}

                        {stats.recommendations.length === 0 && (
                          <div className="p-4 bg-white rounded-xl border border-slate-200 text-sm text-slate-500 font-medium">
                            No schemes available yet.
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Performance Analytics / Chart section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <ApplicationTrend />
                      <SchemeCategoryCard />
                    </div>
                  </>
                )}

                {/* Recent Notifications */}
                <NotificationList
                  applications={
                    stats.citizen?.list || []
                  }
                />
              </div>

              {/* RIGHT COLUMN */}
              <div className="space-y-8">

                {/* Quick Actions Grid */}
                <div className="space-y-3">
                  <h3 className="text-lg font-black text-slate-800 tracking-tight">
                    Quick Actions
                  </h3>

                  <div className="grid grid-cols-2 gap-4">

                    <QuickActionCard
                      title="Find Policies"
                      icon={FaSearch}
                      onClick={() =>
                        setActiveTab('search')
                      }
                      color="blue"
                    />

                    <QuickActionCard
                      title="Check Status"
                      icon={FaClipboardList}
                      onClick={() =>
                        setActiveTab('applications')
                      }
                      color="green"
                    />

                    <QuickActionCard
                      title="Upload Docs"
                      icon={FaCloudUploadAlt}
                      onClick={() =>
                        setActiveTab('settings')
                      }
                      color="purple"
                    />

                    <QuickActionCard
                      title="Get Support"
                      icon={FaQuestionCircle}
                      onClick={() =>
                        setActiveTab('ai')
                      }
                      color="orange"
                    />
                  </div>
                </div>

                {/* Upcoming Deadlines */}
                <DeadlineCard />
              </div>
            </div>

            {/* Footer */}
            <Footer />
          </div>
        );

      case 'search':
        return (
          <PolicySearchPage
            onReadMore={(policy) => {
              setSelectedPolicy(policy);
              setActiveTab('policy-details');
            }}
          />
        );

      case 'policy-details':
        return (
          <PolicyDetailsPage
            policy={selectedPolicy}
            onBack={() =>
              setActiveTab('search')
            }
          />
        );

      case 'schemes':
        return (
          <GovernmentSchemesPage
            searchQuery={searchQuery}
          />
        );

      case 'eligibility':
        return <EligibilityPage />;

      case 'applications':
        return <ApplicationsPage />;

      // Super Admin panel pages
      case 'admin-users':
      case 'admin-officials':
        return <UserManagement />;

      case 'admin-policies':
        return (
          <PolicySearchPage
            onReadMore={(policy) => {
              setSelectedPolicy(policy);
              setActiveTab('policy-details');
            }}
          />
        );

      case 'admin-schemes':
        return (
          <GovernmentSchemesPage
            searchQuery={searchQuery}
          />
        );

      case 'admin-applications':
        return <AdminOversight />;

      case 'admin-audit-logs':
        return <AuditLogs />;

      case 'saved':
        return (
          <SavedPoliciesPage
            setActiveTab={setActiveTab}
            setSelectedPolicy={setSelectedPolicy}
          />
        );

      case 'notifications':
        return <NotificationsPage />;

      case 'reports':
      case 'analytics':
        return <ReportsPage />;

      case 'feedback':
      case 'support':
        return <FeedbackPage user={user} />;

      case 'ai':
        return <AIAssistantPage />;

      case 'profile':
        return <ProfilePage user={user} />;

      case 'settings':
        return (
          <SettingsPage
            dbStatus={dbStatus}
          />
        );

      case 'compare':
        return (
          <ComparisonPage
            onBack={() => setActiveTab('dashboard')}
          />
        );

      default:
        return null;
    }
  };

  return (
    <>
      <DashboardLayout
        user={user}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        handleLogout={handleLogout}
        setSearchQuery={setSearchQuery}
      >
        {renderTabContent()}
      </DashboardLayout>

      {/* Modal for Application Details */}
      <Modal
        isOpen={isDetailsModalOpen}
        onClose={() =>
          setDetailsModalOpen(false)
        }
        title="Application details"
      >
        {selectedAppForDetails && (
          <div className="space-y-6 text-left">

            {/* Scheme Info */}
            <div className="border-b border-slate-200 pb-4">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-2">
                Scheme Information
              </h4>

              <p className="text-sm font-extrabold text-slate-800">
                {selectedAppForDetails.scheme?.title ||
                  'N/A'}
              </p>

              <p className="text-xs font-semibold text-slate-500 mt-1">
                <span className="font-bold text-slate-650">
                  Department/Ministry:
                </span>{' '}
                {selectedAppForDetails.scheme?.category ||
                  selectedAppForDetails.scheme?.department ||
                  'N/A'}
              </p>

              <p className="text-xs font-light text-slate-600 mt-2 leading-relaxed">
                {selectedAppForDetails.scheme?.description ||
                  'N/A'}
              </p>
            </div>

            {/* Applicant Info */}
            <div className="border-b border-slate-200 pb-4">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-2">
                Applicant Information
              </h4>

              <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-slate-500">

                <div>
                  <span className="block font-bold text-slate-650">
                    Full Name
                  </span>

                  <span className="text-slate-800 font-extrabold">
                    {selectedAppForDetails.applicant?.fullName ||
                      user.fullName ||
                      'N/A'}
                  </span>
                </div>

                <div>
                  <span className="block font-bold text-slate-650">
                    Email
                  </span>

                  <span className="text-slate-800 font-extrabold">
                    {selectedAppForDetails.applicant?.email ||
                      user.email ||
                      'N/A'}
                  </span>
                </div>

                <div>
                  <span className="block font-bold text-slate-650">
                    Mobile
                  </span>

                  <span className="text-slate-800 font-extrabold">
                    {selectedAppForDetails.applicant?.mobile ||
                      user.mobile ||
                      'N/A'}
                  </span>
                </div>

                <div>
                  <span className="block font-bold text-slate-650">
                    DOB
                  </span>

                  <span className="text-slate-800 font-extrabold">
                    {selectedAppForDetails.applicant?.dob
                      ? new Date(
                          selectedAppForDetails.applicant.dob
                        ).toLocaleDateString('en-GB')
                      : user.dob
                      ? new Date(
                          user.dob
                        ).toLocaleDateString('en-GB')
                      : 'N/A'}
                  </span>
                </div>

                <div>
                  <span className="block font-bold text-slate-650">
                    State
                  </span>

                  <span className="text-slate-800 font-extrabold">
                    {selectedAppForDetails.applicant?.state ||
                      user.state ||
                      'N/A'}
                  </span>
                </div>

                <div>
                  <span className="block font-bold text-slate-650">
                    District
                  </span>

                  <span className="text-slate-800 font-extrabold">
                    {selectedAppForDetails.applicant?.district ||
                      user.district ||
                      'N/A'}
                  </span>
                </div>

              </div>
            </div>

            {/* Application Status */}
            <div>
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-2">
                Application Status
              </h4>

              <div className="flex items-center gap-3">
                <StatusBadge
                  status={
                    selectedAppForDetails.status
                  }
                />

                <span className="text-[10px] font-bold text-slate-400">
                  Submitted:{' '}
                  {new Date(
                    selectedAppForDetails.submittedAt ||
                      selectedAppForDetails.createdAt
                  ).toLocaleString('en-GB')}
                </span>
              </div>

              {selectedAppForDetails.status ===
                'Rejected' && (
                <div className="mt-4 p-3.5 bg-rose-50 border border-rose-200 rounded-xl">
                  <h5 className="text-[10px] font-black text-rose-600 uppercase tracking-wider mb-1">
                    Rejection Reason
                  </h5>

                  <p className="text-xs font-bold text-rose-700 leading-relaxed">
                    {selectedAppForDetails.rejectionReason ||
                      'No details provided.'}
                  </p>
                </div>
              )}

              {selectedAppForDetails.status ===
                'Approved' &&
                selectedAppForDetails.reviewedAt && (
                  <p className="text-[10px] font-bold text-slate-400 mt-2">
                    Approved on:{' '}
                    {new Date(
                      selectedAppForDetails.reviewedAt
                    ).toLocaleString('en-GB')}
                  </p>
                )}
            </div>

          </div>
        )}
      </Modal>
    </>
  );
};

export default Dashboard;