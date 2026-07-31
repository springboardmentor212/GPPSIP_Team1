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
import AssistantPanel from '../../components/dashboard/AssistantPanel';
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
import { useLocation } from 'react-router';

// Import Services
import { getPolicies } from '../../services/policy.service';
import { getSchemes } from '../../services/scheme.service';

const Dashboard = () => {
  const { user, handleLogout } = useAuth();
  const location = useLocation();
  
  // Parse initial tab from URL query params (e.g. ?tab=schemes)
  const initialTab = new URLSearchParams(location.search).get('tab') || 'dashboard';
  
  const [activeTab, setActiveTab] = useState(initialTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [savedSchemes, setSavedSchemes] = useState([false, false]); // Toggle bookmarks
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [dbStatus, setDbStatus] = useState('checking');
  const [stats, setStats] = useState({ policies: 0, schemes: 0, recommendations: [] });

  // Sync activeTab if URL query param changes
  useEffect(() => {
    const tabFromUrl = new URLSearchParams(location.search).get('tab');
    if (tabFromUrl) {
      setActiveTab((prev) => (prev !== tabFromUrl ? tabFromUrl : prev));
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
        const [polRes, schRes] = await Promise.all([getPolicies(), getSchemes()]);
        setStats({
          policies: polRes.policies?.length || 0,
          schemes: schRes.schemes?.length || 0,
          recommendations: schRes.schemes?.slice(0, 2) || []
        });
      } catch (err) {
        console.error("Failed to load dashboard stats:", err);
      }
    };
    fetchStats();
  }, []);

  // Protect route
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Handle bookmark toggle
  const toggleSaved = (index) => {
    setSavedSchemes((prev) => {
      const next = [...prev];
      next[index] = !next[index];
      return next;
    });
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
              onCheckEligibility={() => setActiveTab('eligibility')} 
              onSearchPolicies={() => setActiveTab('search')} 
            />

            {/* Statistics Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
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
                title="Applications" 
                value="0" 
                growth="Awaiting processing" 
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
            </div>

            {/* Core Multi-Column Content Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* LEFT & CENTER COLUMN (2/3 width) */}
              <div className="lg:col-span-2 space-y-8">
                
                {/* Recommended Schemes */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-black text-slate-800 tracking-tight">Latest Schemes</h3>
                    <button 
                      onClick={() => setActiveTab('schemes')}
                      className="text-xs font-bold text-[#0052cc] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>View All Schemes</span>
                      <FaArrowRight className="w-2.5 h-2.5" />
                    </button>
                  </div>
                  
                  <div className="flex flex-col gap-5">
                    {stats.recommendations.map((scheme, idx) => (
                      <RecommendationCard 
                        key={scheme._id || idx}
                        title={scheme.title}
                        ministry={scheme.category}
                        matchPercentage="New"
                        eligibilityTag="Check Eligibility"
                        description={scheme.description}
                        isSaved={savedSchemes[idx]}
                        onSave={() => toggleSaved(idx)}
                        onApply={() => setActiveTab('schemes')}
                      />
                    ))}
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

                {/* Recent Notifications logs */}
                <NotificationList />

              </div>

              {/* RIGHT COLUMN (1/3 width) */}
              <div className="space-y-8">
                {/* AI Assistant Floating Widget */}
                <div className="space-y-3">
                  <h3 className="text-lg font-black text-slate-800 tracking-tight">AI Assistant Panel</h3>
                  <AssistantPanel />
                </div>

                {/* Quick Actions Grid */}
                <div className="space-y-3">
                  <h3 className="text-lg font-black text-slate-800 tracking-tight">Quick Actions</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <QuickActionCard 
                      title="Find Policies" 
                      icon={FaSearch} 
                      onClick={() => setActiveTab('search')} 
                      color="blue"
                    />
                    <QuickActionCard 
                      title="Check Status" 
                      icon={FaClipboardList} 
                      onClick={() => setActiveTab('applications')} 
                      color="green"
                    />
                    <QuickActionCard 
                      title="Upload Docs" 
                      icon={FaCloudUploadAlt} 
                      onClick={() => setActiveTab('settings')} 
                      color="purple"
                    />
                    <QuickActionCard 
                      title="Get Support" 
                      icon={FaQuestionCircle} 
                      onClick={() => setActiveTab('ai')} 
                      color="orange"
                    />
                  </div>
                </div>

                {/* Upcoming Deadlines Calendar Card */}
                <DeadlineCard />
              </div>

            </div>

            {/* Footer Seal */}
            <Footer />
          </div>
        );

      case 'search':
        return (
          <PolicySearchPage onReadMore={(policy) => {
            setSelectedPolicy(policy);
            setActiveTab('policy-details');
          }} />
        );

      case 'policy-details':
        return (
          <PolicyDetailsPage 
            policy={selectedPolicy} 
            onBack={() => setActiveTab('search')} 
          />
        );

      case 'schemes':
        return (
          <GovernmentSchemesPage searchQuery={searchQuery} />
        );

      case 'eligibility':
        return (
          <EligibilityPage />
        );

      case 'applications':
        return (
          <ApplicationsPage />
        );

      case 'saved':
        return (
          <SavedPoliciesPage 
            setActiveTab={setActiveTab} 
            setSelectedPolicy={setSelectedPolicy} 
          />
        );

      case 'notifications':
        return (
          <NotificationsPage />
        );

      case 'ai':
        return (
          <AIAssistantPage />
        );

      case 'profile':
        return (
          <ProfilePage user={user} />
        );

      case 'settings':
        return (
          <SettingsPage dbStatus={dbStatus} />
        );

      default:
        return null;
    }
  };

  return (
    <DashboardLayout 
      user={user} 
      activeTab={activeTab} 
      setActiveTab={setActiveTab} 
      handleLogout={handleLogout} 
      setSearchQuery={setSearchQuery}
    >
      {renderTabContent()}
    </DashboardLayout>
  );
};

export default Dashboard;

