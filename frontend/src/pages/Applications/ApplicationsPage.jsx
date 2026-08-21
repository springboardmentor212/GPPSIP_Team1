import React, { useState, useEffect, useMemo } from 'react';
import { 
  FaClipboardCheck, 
  FaSearch, 
  FaEye, 
  FaShieldAlt,
  FaRedo,
  FaPlus,
  FaFileAlt,
  FaTimes,
  FaCheck,
  FaBan
} from 'react-icons/fa';

// Import Reusable Components
import StatsCard from '../../components/cards/StatsCard';
import StatusBadge from '../../components/ui/StatusBadge';
import Footer from '../../components/layout/Footer';
import PolicyFormModal from '../../components/modals/PolicyFormModal';
import SchemeFormModal from '../../components/modals/SchemeFormModal';
import Pagination from '../../components/common/Pagination';
import Modal from '../../components/modals/Modal';

// Import Services
import { getPolicies, archivePolicy } from '../../services/policy.service';
import { getSchemes, archiveScheme } from '../../services/scheme.service';
import { submitForApproval, approvePolicy, rejectPolicy } from '../../services/approval.service';
import { 
  getMyApplications, 
  getPendingApplications, 
  approveApplication, 
  rejectApplication 
} from '../../services/application.service';
import useAuth from '../../hooks/useAuth';
import { useNavigate } from 'react-router';

const ApprovalsDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Database state
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Search & Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  
  // Modal states for Official Forms
  const [isPolicyModalOpen, setPolicyModalOpen] = useState(false);
  const [isSchemeModalOpen, setSchemeModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Modal states for Application Details & Rejection Comments
  const [selectedAppForDetails, setSelectedAppForDetails] = useState(null);
  const [isDetailsModalOpen, setDetailsModalOpen] = useState(false);
  
  const [isRejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectingItemId, setRejectingItemId] = useState(null);
  const [rejectionReasonText, setRejectionReasonText] = useState('');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const isCitizen = user && user.role === 'Citizen';
  const isOfficial = user && (user.role === 'Gov. Official' || user.role === 'Super Admin');

  // Fetch items based on role
  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      if (isCitizen) {
        // Fetch citizen's personal applications
        const res = await getMyApplications();
        if (res.success && Array.isArray(res.applications)) {
          setItems(res.applications);
        } else {
          throw new Error("Invalid response format received from backend");
        }
      } else if (isOfficial) {
        // Fetch policies and citizen scheme applications for approvals queue
        const [policiesRes, applicationsRes] = await Promise.all([
          getPolicies(),
          getPendingApplications('All').catch(() => ({ success: true, applications: [] }))
        ]);
        
        let allItems = [];
        
        if (policiesRes.success && Array.isArray(policiesRes.policies)) {
          const mappedPolicies = policiesRes.policies
            .map(p => ({
              id: p._id,
              displayId: `POL-${(p._id || '').slice(-6).toUpperCase() || 'UNKNOWN'}`,
              title: p.title || 'Untitled Policy',
              applicant: p.creator?.fullName || 'Gov. Official',
              department: p.department || 'Unknown Department',
              date: p.createdAt || new Date().toISOString(),
              type: 'Policy',
              status: p.status || 'Pending',
              raw: p
            }));
          allItems = [...allItems, ...mappedPolicies];
        }
        
        if (applicationsRes.success && Array.isArray(applicationsRes.applications)) {
          const mappedApps = applicationsRes.applications
            .map(a => ({
              id: a._id,
              displayId: a.applicationId || `APP-${(a._id || '').slice(-6).toUpperCase()}`,
              title: a.scheme?.title || 'Untitled Scheme',
              applicant: a.applicant?.fullName || 'Citizen',
              department: a.scheme?.category || a.scheme?.department || 'Unknown Department',
              date: a.submittedAt || a.createdAt || new Date().toISOString(),
              type: 'Scheme Application',
              status: a.status || 'Pending',
              raw: a
            }));
          allItems = [...allItems, ...mappedApps];
        }
        
        // Sort by newest
        allItems.sort((a, b) => new Date(b.date) - new Date(a.date));
        setItems(allItems);
      }
    } catch (err) {
      setError(err.message || "Failed to sync connection with data services.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user, isCitizen, isOfficial]);

  // Helper stats (only for officials dashboard)
  const stats = useMemo(() => {
    if (!isOfficial) return { total: 0, policiesCount: 0, schemesCount: 0 };
    const policiesCount = items.filter(i => i.type === 'Policy' && i.status === 'Pending').length;
    const schemesCount = items.filter(i => i.type === 'Scheme Application' && i.status === 'Pending').length;
    const total = policiesCount + schemesCount;
    return { total, policiesCount, schemesCount };
  }, [items, isOfficial]);

  // Search & filter logic combined
  const filteredItems = useMemo(() => {
    if (isCitizen) {
      return items.filter((app) => {
        const query = searchQuery.toLowerCase();
        const matchesSearch = 
          app.applicationId?.toLowerCase().includes(query) ||
          app.scheme?.title?.toLowerCase().includes(query) ||
          (app.scheme?.category || app.scheme?.department || '').toLowerCase().includes(query);
        
        const matchesStatus = statusFilter === 'All' || app.status === statusFilter;
        return matchesSearch && matchesStatus;
      });
    }

    // Official filters
    return items.filter((item) => {
      const matchesSearch = 
        item.displayId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.department?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.applicant?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesType = typeFilter === 'All' || item.type === typeFilter;
      
      // Status mapping for table filter
      let matchesStatus = false;
      if (statusFilter === 'All') {
        matchesStatus = true;
      } else if (statusFilter === 'Pending') {
        matchesStatus = item.status === 'Pending';
      } else if (statusFilter === 'Draft') {
        matchesStatus = item.status === 'Draft';
      } else if (statusFilter === 'Approved') {
        matchesStatus = item.status === 'Approved' || item.status === 'Active';
      } else if (statusFilter === 'Rejected') {
        matchesStatus = item.status === 'Rejected';
      }

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [items, isCitizen, searchQuery, typeFilter, statusFilter]);

  // Paginated chunk
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredItems.slice(start, start + itemsPerPage);
  }, [filteredItems, currentPage]);

  const totalPages = Math.max(Math.ceil(filteredItems.length / itemsPerPage), 1);

  // Handlers for Actions
  const handleAction = async (action, type, id) => {
    try {
      let res;
      if (action === 'submit') {
        if (type !== 'Policy') return alert('Only policies supported for submit');
        res = await submitForApproval(id);
      } else if (action === 'approve') {
        if (type === 'Policy') {
          const confirmApprove = window.confirm("Are you sure you want to approve this policy?");
          if (!confirmApprove) return;
          res = await approvePolicy(id);
        } else if (type === 'Scheme Application') {
          const confirmApprove = window.confirm("Are you sure you want to approve this scheme application?");
          if (!confirmApprove) return;
          res = await approveApplication(id);
        }
      } else if (action === 'reject') {
        if (type === 'Policy') {
          const reason = prompt('Please enter a rejection reason:');
          if (!reason) return;
          res = await rejectPolicy(id, reason);
        } else if (type === 'Scheme Application') {
          // Open rejection modal
          setRejectingItemId(id);
          setRejectionReasonText('');
          setRejectModalOpen(true);
          return;
        }
      } else if (action === 'archive') {
        if (!window.confirm(`Are you sure you want to archive this ${type}?`)) return;
        res = type === 'Policy' ? await archivePolicy(id) : await archiveScheme(id);
      }
      
      if (res && res.success) {
        fetchDashboardData();
      }
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Action failed');
    }
  };

  const handleConfirmReject = async () => {
    if (!rejectionReasonText.trim()) {
      alert("Rejection reason is required.");
      return;
    }
    try {
      const res = await rejectApplication(rejectingItemId, rejectionReasonText);
      if (res.success) {
        setRejectModalOpen(false);
        fetchDashboardData();
      }
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Action failed');
    }
  };

  // Render Citizen Dashboard View
  const renderCitizenDashboard = () => {
    return (
      <div className="space-y-8 flex flex-col justify-between min-h-full bg-slate-50">
        <div className="flex-grow space-y-8 px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2.5 select-none">
                <FaClipboardCheck className="text-[#0052cc]" /> My Applications
              </h2>
              <p className="text-xs text-slate-500 font-semibold select-none mt-1">
                Track status and details of your government scheme applications.
              </p>
            </div>
          </div>

          {/* Loading */}
          {loading && (
            <div className="bg-white rounded-2xl border border-slate-300 p-12 flex flex-col items-center justify-center min-h-[300px]">
              <div className="w-10 h-10 border-4 border-[#0052cc] border-t-transparent rounded-full animate-spin"></div>
              <span className="text-xs font-bold text-slate-400 mt-4 select-none">Retrieving your applications...</span>
            </div>
          )}

          {/* Error */}
          {error && !loading && (
            <div className="bg-rose-50/50 rounded-2xl border border-rose-200 p-8 flex flex-col items-center text-center max-w-lg mx-auto">
              <h3 className="text-sm font-bold text-rose-800 uppercase tracking-wider mb-2 select-none">Sync Connection Failure</h3>
              <p className="text-xs font-medium text-rose-600 mb-6 max-w-sm leading-relaxed select-none">{error}</p>
              <button
                onClick={fetchDashboardData}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-extrabold flex items-center gap-2 shadow-sm transition-colors cursor-pointer border-none"
              >
                <FaRedo className="w-3 h-3" /> Retry
              </button>
            </div>
          )}

          {/* Table list */}
          {!loading && !error && (
            <>
              {/* Filter Panel */}
              <div className="bg-white rounded-2xl border border-slate-300 p-4 flex flex-col sm:flex-row gap-4 items-center justify-between select-none">
                <div className="relative w-full sm:max-w-xs">
                  <span className="absolute left-3.5 top-3 text-slate-400">
                    <FaSearch className="w-3.5 h-3.5" />
                  </span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                    placeholder="Search by ID or Scheme..."
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 bg-white rounded-xl text-xs placeholder-slate-400 text-slate-700 font-bold focus:outline-none focus:border-[#0052cc] focus:ring-2 focus:ring-blue-500/10 transition-all"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                  className="px-3.5 py-2 border border-slate-300 bg-white rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:border-[#0052cc] focus:ring-2 focus:ring-blue-500/10 transition-all cursor-pointer w-full sm:w-44"
                >
                  <option value="All">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              {filteredItems.length === 0 && (
                <div className="bg-white rounded-2xl border border-slate-300 p-12 text-center flex flex-col items-center">
                  <FaClipboardCheck className="text-slate-300 w-16 h-16 mb-4" />
                  <h3 className="text-sm font-bold text-slate-700 mb-1 select-none">No Applications Found</h3>
                  <p className="text-xs text-slate-400 font-semibold mb-6 max-w-xs leading-relaxed select-none">
                    You have not submitted any scheme applications yet. Go to Government Schemes to apply.
                  </p>
                </div>
              )}

              {filteredItems.length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-300 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-extrabold text-[10px]">
                          <th className="p-4">Application ID</th>
                          <th className="p-4">Scheme Name</th>
                          <th className="p-4">Department</th>
                          <th className="p-4">Submitted Date</th>
                          <th className="p-4">Status</th>
                          <th className="p-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {paginatedItems.map((app) => (
                          <tr key={app._id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="p-4 text-xs font-black text-slate-800 font-mono whitespace-nowrap">
                              {app.applicationId}
                            </td>
                            <td className="p-4 text-xs font-bold text-slate-800 max-w-xs truncate">
                              {app.scheme?.title || 'Unknown Scheme'}
                            </td>
                            <td className="p-4 text-xs font-bold text-slate-500">
                              {app.scheme?.category || app.scheme?.department || 'Federal'}
                            </td>
                            <td className="p-4 text-xs font-bold text-slate-500 whitespace-nowrap">
                              {app.submittedAt ? new Date(app.submittedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'}
                            </td>
                            <td className="p-4 whitespace-nowrap">
                              <StatusBadge status={app.status} />
                            </td>
                            <td className="p-4 text-right">
                              <button
                                onClick={() => {
                                  setSelectedAppForDetails(app);
                                  setDetailsModalOpen(true);
                                }}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0052cc] hover:bg-[#0047b3] text-white rounded-lg text-xs font-bold transition-colors cursor-pointer border-none"
                              >
                                <FaEye className="w-3 h-3" /> View Details
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="p-4 border-t border-slate-200">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      totalResults={filteredItems.length}
                      resultsPerPage={itemsPerPage}
                      onPageChange={setCurrentPage}
                    />
                  </div>
                </div>
              )}
            </>
          )}
        </div>
        <Footer />
      </div>
    );
  };

  // Render Gov. Official View
  const renderOfficialDashboard = () => {
    return (
      <div className="space-y-8 flex flex-col justify-between min-h-full bg-slate-50">
        <div className="flex-grow space-y-8 px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Header Block */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2.5 select-none">
                <FaClipboardCheck className="text-[#0052cc]" /> Approvals Dashboard
              </h2>
              <p className="text-xs text-slate-500 font-semibold select-none mt-1">
                Review, verify, and manage government policies and scheme applications.
              </p>
            </div>
            <div className="flex gap-3">
              {user?.role === 'Gov. Official' && (
                <>
                  <button
                    onClick={() => { setEditingItem(null); setPolicyModalOpen(true); }}
                    className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-extrabold flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
                  >
                    <FaFileAlt className="text-slate-400" /> New Policy
                  </button>
                  <button
                    onClick={() => { setEditingItem(null); setSchemeModalOpen(true); }}
                    className="px-4 py-2 bg-[#0052cc] hover:bg-[#0047b3] text-white rounded-xl text-xs font-extrabold flex items-center gap-2 shadow-sm transition-colors cursor-pointer border-none"
                  >
                    <FaPlus /> New Scheme
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Loading Spinner */}
          {loading && (
            <div className="bg-white rounded-2xl border border-slate-300 p-12 flex flex-col items-center justify-center min-h-[300px]">
              <div className="w-10 h-10 border-4 border-[#0052cc] border-t-transparent rounded-full animate-spin"></div>
              <span className="text-xs font-bold text-slate-400 mt-4 select-none">Retrieving approval queue...</span>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="bg-rose-50/50 rounded-2xl border border-rose-200 p-8 flex flex-col items-center text-center max-w-lg mx-auto">
              <h3 className="text-sm font-bold text-rose-800 uppercase tracking-wider mb-2 select-none">Sync Connection Failure</h3>
              <p className="text-xs font-medium text-rose-600 mb-6 max-w-sm leading-relaxed select-none">{error}</p>
              <button
                onClick={fetchDashboardData}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-extrabold flex items-center gap-2 shadow-sm transition-colors cursor-pointer border-none"
              >
                <FaRedo className="w-3 h-3" /> Retry Synchronization
              </button>
            </div>
          )}

          {/* Core Dashboard UI */}
          {!loading && !error && (
            <>
              {/* Stats Cards Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <StatsCard 
                  title="Total Pending Queue" 
                  value={stats.total} 
                  growth="Action Required" 
                  growthType="neutral" 
                  icon={FaClipboardCheck} 
                  color="orange" 
                />
                <StatsCard 
                  title="Policies for Review" 
                  value={stats.policiesCount} 
                  growth="Awaiting Verification" 
                  growthType="blue" 
                  icon={FaClipboardCheck} 
                  color="blue" 
                />
                <StatsCard 
                  title="Schemes for Review" 
                  value={stats.schemesCount} 
                  growth="Awaiting Verification" 
                  growthType="purple" 
                  icon={FaClipboardCheck} 
                  color="purple" 
                />
              </div>

              {/* Filter controls panel */}
              <div className="bg-white rounded-2xl border border-slate-300 p-4 sm:p-5 flex flex-col gap-4 select-none">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                  
                  {/* Search query box */}
                  <div className="relative">
                    <span className="absolute left-3.5 top-3 text-slate-400">
                      <FaSearch className="w-3.5 h-3.5" />
                    </span>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                      placeholder="Search by ID, title, applicant or department..."
                      className="w-full pl-10 pr-4 py-2 border border-slate-300 bg-white rounded-xl text-xs placeholder-slate-400 text-slate-700 font-bold focus:outline-none focus:border-[#0052cc] focus:ring-2 focus:ring-blue-500/10 transition-all"
                    />
                  </div>

                  {/* Status Filter */}
                  <select
                    value={statusFilter}
                    onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                    className="px-3.5 py-2 border border-slate-300 bg-white rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:border-[#0052cc] focus:ring-2 focus:ring-blue-500/10 transition-all cursor-pointer w-full"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Pending">Pending</option>
                    <option value="Draft">Draft</option>
                    <option value="Approved">Approved / Active</option>
                    <option value="Rejected">Rejected</option>
                  </select>

                  {/* Type Filter */}
                  <select
                    value={typeFilter}
                    onChange={(e) => { setTypeFilter(e.target.value); setCurrentPage(1); }}
                    className="px-3.5 py-2 border border-slate-300 bg-white rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:border-[#0052cc] focus:ring-2 focus:ring-blue-500/10 transition-all cursor-pointer w-full"
                  >
                    <option value="All">All Item Types</option>
                    <option value="Policy">Policies</option>
                    <option value="Scheme Application">Scheme Applications</option>
                  </select>

                </div>
              </div>

              {/* Empty State */}
              {filteredItems.length === 0 && (
                <div className="bg-white rounded-2xl border border-slate-300 p-12 text-center flex flex-col items-center">
                  <FaClipboardCheck className="text-slate-300 w-16 h-16 mb-4" />
                  <h3 className="text-sm font-bold text-slate-700 mb-1 select-none">Queue is Empty</h3>
                  <p className="text-xs text-slate-400 font-semibold mb-6 max-w-xs leading-relaxed select-none">
                    There are no pending items matching your criteria at this moment.
                  </p>
                </div>
              )}

              {/* Applications List Table */}
              {filteredItems.length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-300 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-extrabold text-[10px]">
                          <th className="p-4">Item ID</th>
                          <th className="p-4">Type</th>
                          <th className="p-4">Title</th>
                          <th className="p-4">Applicant</th>
                          <th className="p-4">Department</th>
                          <th className="p-4">Submitted Date</th>
                          <th className="p-4">Status</th>
                          <th className="p-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {paginatedItems.map((item) => (
                          <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="p-4 text-xs font-black text-slate-800 font-mono whitespace-nowrap">
                              {item.displayId}
                            </td>
                            <td className="p-4">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${item.type === 'Policy' ? 'bg-blue-50 text-[#0052cc]' : 'bg-purple-50 text-purple-700'}`}>
                                {item.type}
                              </span>
                            </td>
                            <td className="p-4 text-xs font-bold text-slate-800 max-w-xs truncate">
                              {item.title}
                            </td>
                            <td className="p-4 text-xs font-bold text-slate-650">
                              {item.applicant}
                            </td>
                            <td className="p-4 text-xs font-bold text-slate-500">
                              {item.department || 'Federal'}
                            </td>
                            <td className="p-4 text-xs font-bold text-slate-500 whitespace-nowrap">
                              {item.date ? new Date(item.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'}
                            </td>
                            <td className="p-4 whitespace-nowrap">
                              <StatusBadge status={item.status} />
                            </td>
                            <td className="p-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                {/* Policy Draft Action */}
                                {item.type === 'Policy' && item.status === 'Draft' && user?.role === 'Gov. Official' && (
                                  <button
                                    onClick={() => handleAction('submit', item.type, item.id)}
                                    className="px-2 py-1 bg-blue-50 hover:bg-blue-100 text-[#0052cc] rounded text-xs font-bold transition-colors cursor-pointer border-none"
                                  >
                                    Submit
                                  </button>
                                )}
                                
                                {/* Policy Approval Action */}
                                {item.type === 'Policy' && item.status === 'Pending' && user?.role === 'Super Admin' && (
                                  <>
                                    <button
                                      onClick={() => handleAction('approve', item.type, item.id)}
                                      className="px-2 py-1 bg-green-50 hover:bg-green-100 text-green-700 rounded text-xs font-bold transition-colors cursor-pointer border-none"
                                    >
                                      Approve
                                    </button>
                                    <button
                                      onClick={() => handleAction('reject', item.type, item.id)}
                                      className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded text-xs font-bold transition-colors cursor-pointer border-none"
                                    >
                                      Reject
                                    </button>
                                  </>
                                )}

                                {/* Scheme Application Approval Action */}
                                {item.type === 'Scheme Application' && item.status === 'Pending' && (
                                  <>
                                    <button
                                      onClick={() => handleAction('approve', item.type, item.id)}
                                      className="px-2 py-1 bg-green-50 hover:bg-green-100 text-green-700 rounded text-xs font-bold transition-colors cursor-pointer border-none"
                                    >
                                      Approve
                                    </button>
                                    <button
                                      onClick={() => handleAction('reject', item.type, item.id)}
                                      className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded text-xs font-bold transition-colors cursor-pointer border-none"
                                    >
                                      Reject
                                    </button>
                                  </>
                                )}

                                {/* Policy Edit */}
                                {item.type === 'Policy' && (user.role === 'Super Admin' || item.raw.creator?._id === user.id || item.raw.creator === user.id) && (
                                  <button
                                    onClick={() => {
                                      setEditingItem(item.raw);
                                      setPolicyModalOpen(true);
                                    }}
                                    className="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded text-xs font-bold transition-colors cursor-pointer border-none"
                                  >
                                    Edit
                                  </button>
                                )}

                                {/* Archive Action */}
                                {item.type === 'Policy' && item.status !== 'Archived' && (user.role === 'Super Admin' || item.raw.creator?._id === user.id || item.raw.creator === user.id) && (
                                  <button
                                    onClick={() => handleAction('archive', item.type, item.id)}
                                    className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded text-xs font-bold transition-colors cursor-pointer border-none"
                                  >
                                    Archive
                                  </button>
                                )}

                                {/* View Action */}
                                {item.type === 'Policy' ? (
                                  <button
                                    onClick={() => navigate(`/policy/${item.id}`)}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0052cc] hover:bg-[#0047b3] text-white rounded-lg text-xs font-bold transition-colors cursor-pointer border-none ml-1"
                                  >
                                    <FaEye className="w-3 h-3" /> View
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => {
                                      setSelectedAppForDetails(item.raw);
                                      setDetailsModalOpen(true);
                                    }}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0052cc] hover:bg-[#0047b3] text-white rounded-lg text-xs font-bold transition-colors cursor-pointer border-none ml-1"
                                  >
                                    <FaEye className="w-3 h-3" /> View
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="p-4 border-t border-slate-200">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      totalResults={filteredItems.length}
                      resultsPerPage={itemsPerPage}
                      onPageChange={setCurrentPage}
                    />
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <Footer />
      </div>
    );
  };

  if (!isCitizen && !isOfficial) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-slate-50 text-center px-4">
        <FaShieldAlt className="w-16 h-16 text-rose-500 mb-4" />
        <h2 className="text-2xl font-black text-slate-800 mb-2">Restricted Access</h2>
        <p className="text-sm font-semibold text-slate-500 max-w-md">
          This portal contains sensitive compliance workflows and requires authentic authorization.
        </p>
      </div>
    );
  }

  return (
    <>
      {isCitizen ? renderCitizenDashboard() : renderOfficialDashboard()}

      {/* Rejection Modal for Scheme Applications */}
      <Modal
        isOpen={isRejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        title="Reject Application"
        actions={
          <>
            <button
              onClick={() => setRejectModalOpen(false)}
              className="px-4 py-2 border border-slate-350 hover:bg-slate-50 rounded-xl text-xs font-extrabold cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmReject}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-extrabold cursor-pointer border-none"
            >
              Confirm Rejection
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <label className="block text-xs font-extrabold text-slate-500 uppercase tracking-wider">
            Rejection Reason
          </label>
          <textarea
            value={rejectionReasonText}
            onChange={(e) => setRejectionReasonText(e.target.value)}
            placeholder="Provide comments describing why this application is being rejected..."
            rows={4}
            className="w-full p-3.5 border border-slate-300 rounded-xl text-xs font-bold focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/10"
          />
        </div>
      </Modal>

      {/* Modal for Application Details */}
      <Modal
        isOpen={isDetailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        title="Application details"
      >
        {selectedAppForDetails && (
          <div className="space-y-6 text-left">
            {/* Scheme Info */}
            <div className="border-b border-slate-200 pb-4">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-2">Scheme Information</h4>
              <p className="text-sm font-extrabold text-slate-800">{selectedAppForDetails.scheme?.title || 'N/A'}</p>
              <p className="text-xs font-semibold text-slate-500 mt-1">
                <span className="font-bold text-slate-650">Department/Ministry:</span> {selectedAppForDetails.scheme?.category || selectedAppForDetails.scheme?.department || 'N/A'}
              </p>
              <p className="text-xs font-light text-slate-600 mt-2 leading-relaxed">
                {selectedAppForDetails.scheme?.description || 'N/A'}
              </p>
            </div>

            {/* Applicant Info */}
            <div className="border-b border-slate-200 pb-4">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-2">Applicant Information</h4>
              <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-slate-500">
                <div>
                  <span className="block font-bold text-slate-650">Full Name</span>
                  <span className="text-slate-800 font-extrabold">{selectedAppForDetails.applicant?.fullName || 'N/A'}</span>
                </div>
                <div>
                  <span className="block font-bold text-slate-650">Email</span>
                  <span className="text-slate-800 font-extrabold">{selectedAppForDetails.applicant?.email || 'N/A'}</span>
                </div>
                <div>
                  <span className="block font-bold text-slate-650">Mobile</span>
                  <span className="text-slate-800 font-extrabold">{selectedAppForDetails.applicant?.mobile || 'N/A'}</span>
                </div>
                <div>
                  <span className="block font-bold text-slate-650">DOB</span>
                  <span className="text-slate-800 font-extrabold">
                    {selectedAppForDetails.applicant?.dob ? new Date(selectedAppForDetails.applicant.dob).toLocaleDateString('en-GB') : 'N/A'}
                  </span>
                </div>
                <div>
                  <span className="block font-bold text-slate-650">State</span>
                  <span className="text-slate-800 font-extrabold">{selectedAppForDetails.applicant?.state || 'N/A'}</span>
                </div>
                <div>
                  <span className="block font-bold text-slate-650">District</span>
                  <span className="text-slate-800 font-extrabold">{selectedAppForDetails.applicant?.district || 'N/A'}</span>
                </div>
              </div>
            </div>

            {/* Application Status */}
            <div>
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-2">Application Status</h4>
              <div className="flex items-center gap-3">
                <StatusBadge status={selectedAppForDetails.status} />
                <span className="text-[10px] font-bold text-slate-400">
                  Submitted: {new Date(selectedAppForDetails.submittedAt || selectedAppForDetails.createdAt).toLocaleString('en-GB')}
                </span>
              </div>
              {selectedAppForDetails.status === 'Rejected' && (
                <div className="mt-4 p-3.5 bg-rose-50 border border-rose-200 rounded-xl">
                  <h5 className="text-[10px] font-black text-rose-600 uppercase tracking-wider mb-1">Rejection Reason</h5>
                  <p className="text-xs font-bold text-rose-700 leading-relaxed">{selectedAppForDetails.rejectionReason || 'No details provided.'}</p>
                </div>
              )}
              {selectedAppForDetails.status === 'Approved' && selectedAppForDetails.reviewedAt && (
                <p className="text-[10px] font-bold text-slate-400 mt-2">
                  Approved on: {new Date(selectedAppForDetails.reviewedAt).toLocaleString('en-GB')}
                </p>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Official Form Modals */}
      <PolicyFormModal 
        isOpen={isPolicyModalOpen} 
        onClose={() => { setPolicyModalOpen(false); setEditingItem(null); }} 
        onSuccess={fetchDashboardData} 
        initialData={editingItem}
      />
      <SchemeFormModal 
        isOpen={isSchemeModalOpen} 
        onClose={() => { setSchemeModalOpen(false); setEditingItem(null); }} 
        onSuccess={fetchDashboardData} 
        initialData={editingItem}
      />
    </>
  );
};

export default ApprovalsDashboard;
