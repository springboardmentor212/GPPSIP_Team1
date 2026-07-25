import React, { useState } from 'react';
import useAuth from '../features/auth/hooks/useAuth';
import { Navigate, Link } from 'react-router';
import { 
  FaCheckCircle, 
  FaBookmark, 
  FaClipboardList, 
  FaBell, 
  FaSearch, 
  FaFolderOpen, 
  FaRobot, 
  FaArrowRight, 
  FaUserCheck, 
  FaLock, 
  FaCalendarAlt, 
  FaGlobe,
  FaCloudUploadAlt,
  FaQuestionCircle
} from 'react-icons/fa';

// Import Dashboard Subcomponents
import DashboardLayout from '../components/dashboard/DashboardLayout';
import WelcomeBanner from '../components/dashboard/WelcomeBanner';
import StatsCard from '../components/dashboard/StatsCard';
import RecommendationCard from '../components/dashboard/RecommendationCard';
import AssistantPanel from '../components/dashboard/AssistantPanel';
import QuickActionCard from '../components/dashboard/QuickActionCard';
import ApplicationTrend from '../components/dashboard/ApplicationTrend';
import SchemeCategoryCard from '../components/dashboard/SchemeCategoryCard';
import DeadlineCard from '../components/dashboard/DeadlineCard';
import NotificationList from '../components/dashboard/NotificationList';
import Footer from '../components/dashboard/Footer';
import PolicySearchPage from '../components/dashboard/PolicySearchPage';
import PolicyDetailsPage from '../components/dashboard/PolicyDetailsPage';
import GovernmentSchemesPage from '../components/dashboard/GovernmentSchemesPage';
import EligibilityPage from '../components/dashboard/EligibilityPage';
import SavedPoliciesPage from '../components/dashboard/SavedPoliciesPage';
import NotificationsPage from '../components/dashboard/NotificationsPage';

const Dashboard = () => {
  const { user, handleLogout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [savedSchemes, setSavedSchemes] = useState([false, false]); // Toggle bookmarks
  const [selectedPolicy, setSelectedPolicy] = useState(null);

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
                title="Eligible Schemes" 
                value="12" 
                growth="+3 new this week" 
                growthType="positive" 
                icon={FaCheckCircle} 
                color="blue" 
              />
              <StatsCard 
                title="Saved Policies" 
                value={savedSchemes.filter(Boolean).length + 3} 
                growth="Syncing" 
                growthType="neutral" 
                icon={FaBookmark} 
                color="purple" 
              />
              <StatsCard 
                title="Applications" 
                value="3" 
                growth="1 pending approval" 
                growthType="neutral" 
                icon={FaClipboardList} 
                color="orange" 
              />
              <StatsCard 
                title="Notifications" 
                value="8" 
                growth="2 unread" 
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
                    <h3 className="text-lg font-black text-slate-800 tracking-tight">Recommended Schemes</h3>
                    <button 
                      onClick={() => setActiveTab('schemes')}
                      className="text-xs font-bold text-[#0052cc] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>View All Schemes</span>
                      <FaArrowRight className="w-2.5 h-2.5" />
                    </button>
                  </div>
                  
                  <div className="flex flex-col gap-5">
                    <RecommendationCard 
                      title="PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)"
                      matchPercentage="88"
                      eligibilityTag="Eligible"
                      description="Direct benefit transfer scheme providing ₹6,000 per year in three equal installments."
                      isSaved={savedSchemes[0]}
                      onSave={() => toggleSaved(0)}
                      onApply={() => setActiveTab('applications')}
                    />
                    <RecommendationCard 
                      title="Post-Matric Scholarship Scheme"
                      ministry="Ministry of Education"
                      matchPercentage="88"
                      eligibilityTag="Eligible"
                      description="Financial assistance to students from underprivileged communities to pursue post-matric or post-secondary courses."
                      isSaved={savedSchemes[1]}
                      onSave={() => toggleSaved(1)}
                      onApply={() => setActiveTab('applications')}
                    />
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
          <div className="bg-white rounded-2xl border border-slate-300 p-6 sm:p-8 min-h-[480px]">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 pb-4 border-b border-slate-300 flex items-center gap-2.5">
              <FaClipboardList className="text-[#0052cc]" /> Applications Portal
            </h2>
            <div className="space-y-4">
              <div className="p-4 border border-slate-300 rounded-2xl flex justify-between items-center bg-slate-50/50">
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">Post-Matric Scholarship Scheme</h4>
                  <span className="text-[10px] text-slate-400 font-bold block mt-1">Ref ID: PM-98218 • Submitted: 12 July 2026</span>
                </div>
                <span className="px-2.5 py-1 bg-amber-50 text-amber-600 border border-amber-105 rounded-lg text-xs font-bold">Under Review</span>
              </div>
              <div className="p-4 border border-slate-300 rounded-2xl flex justify-between items-center bg-slate-50/50">
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">PM Kisan Subsidies</h4>
                  <span className="text-[10px] text-slate-400 font-bold block mt-1">Ref ID: PM-12891 • Approved: 25 June 2026</span>
                </div>
                <span className="px-2.5 py-1 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-lg text-xs font-bold">Approved</span>
              </div>
            </div>
          </div>
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
          <div className="bg-white rounded-2xl border border-slate-300 p-6 sm:p-8 min-h-[480px]">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 pb-4 border-b border-slate-300 flex items-center gap-2.5">
              <FaRobot className="text-[#0052cc]" /> AI Assistant Hub
            </h2>
            <div className="max-w-3xl mx-auto mt-4">
              <AssistantPanel />
            </div>
          </div>
        );

      case 'profile':
        return (
          <div className="bg-white rounded-2xl border border-slate-300 p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 pb-4 border-b border-slate-300">My Profile Details</h2>
            <div className="flex items-center gap-6 mb-8">
              <div className="w-20 h-20 rounded-full bg-[#0052cc] flex items-center justify-center text-white text-3xl font-bold uppercase shadow-sm">
                {user.fullName.charAt(0)}
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">{user.fullName}</h3>
                <span className="inline-block px-3 py-1 bg-blue-50 text-[#0052cc] text-xs font-bold uppercase tracking-wider rounded-full mt-2 border border-blue-100">
                  {user.role}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Email Address</span>
                <span className="text-base font-medium text-slate-800">{user.email}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Mobile Number</span>
                <span className="text-base font-medium text-slate-800">{user.mobile}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Date of Birth</span>
                <span className="text-base font-medium text-slate-800">
                  {new Date(user.dob).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' })}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Location</span>
                <span className="text-base font-medium text-slate-800">{user.district}, {user.state}</span>
              </div>
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="bg-white rounded-2xl border border-slate-300 p-6 sm:p-8 min-h-[480px]">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 pb-4 border-b border-slate-300 font-black">Account Settings</h2>
            <div className="space-y-6 max-w-md">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-sm font-bold text-slate-700">Email Notifications</h4>
                  <span className="text-xs text-slate-400">Receive alerts when new schemes match your profile</span>
                </div>
                <input type="checkbox" defaultChecked className="rounded border-slate-300 text-[#0052cc]" />
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-sm font-bold text-slate-700">Language</h4>
                  <span className="text-xs text-slate-400">Select your preferred system language</span>
                </div>
                <select className="px-3 py-1 border rounded-lg text-xs bg-white">
                  <option>English</option>
                  <option>Marathi (मराठी)</option>
                  <option>Hindi (हिंदी)</option>
                </select>
              </div>
              <div className="pt-4 border-t border-slate-300 flex justify-between items-center">
                <div>
                  <h4 className="text-sm font-bold text-slate-700">Database Connection</h4>
                  <span className="text-xs text-rose-500 font-medium">No connection: Local Mock Mode Active</span>
                </div>
                <span className="px-2 py-0.5 bg-rose-50 text-rose-600 rounded border border-rose-100 text-[10px] font-bold uppercase">Disconnected</span>
              </div>
            </div>
          </div>
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
