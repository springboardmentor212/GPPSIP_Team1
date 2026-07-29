import React, { useState, useEffect, useMemo } from 'react';
import { 
  FaClipboardCheck, 
  FaSearch, 
  FaEye, 
  FaShieldAlt,
  FaRedo,
  FaPlus,
  FaFileAlt
} from 'react-icons/fa';

// Import Reusable Components
import StatsCard from '../../components/cards/StatsCard';
import Table from '../../components/tables/Table';
import StatusBadge from '../../components/ui/StatusBadge';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Footer from '../../components/layout/Footer';
import PolicyFormModal from '../../components/modals/PolicyFormModal';
import SchemeFormModal from '../../components/modals/SchemeFormModal';
import Pagination from '../../components/common/Pagination';

// Import Services
import { getPolicies } from '../../services/policy.service';
import { getSchemes } from '../../services/scheme.service';
import { submitForApproval, approvePolicy, rejectPolicy } from '../../services/approval.service';
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
  
  // Modal states
  const [isPolicyModalOpen, setPolicyModalOpen] = useState(false);
  const [isSchemeModalOpen, setSchemeModalOpen] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Access check
  const isAuthorized = user && (user.role === 'Gov. Official' || user.role === 'Admin');

  // Fetch pending items
  const fetchPendingItems = async () => {
    if (!isAuthorized) return;
    
    setLoading(true);
    setError(null);
    try {
      // Fetch both policies and schemes
      const [policiesRes, schemesRes] = await Promise.all([
        getPolicies(),
        getSchemes().catch(() => ({ success: true, schemes: [] })) // fallback if not available yet
      ]);
      
      let allItems = [];
      
      if (policiesRes.success && Array.isArray(policiesRes.policies)) {
        const mappedPolicies = policiesRes.policies
          .map(p => ({
            id: p._id,
            displayId: `POL-${(p._id || '').slice(-6).toUpperCase() || 'UNKNOWN'}`,
            title: p.title || 'Untitled Policy',
            department: p.department || 'Unknown Department',
            date: p.createdAt || new Date().toISOString(),
            type: 'Policy',
            status: p.status || 'Pending'
          }));
        allItems = [...allItems, ...mappedPolicies];
      }
      
      if (schemesRes.success && Array.isArray(schemesRes.schemes)) {
        const mappedSchemes = schemesRes.schemes
          .map(s => ({
            id: s._id,
            displayId: `SCH-${(s._id || '').slice(-6).toUpperCase() || 'UNKNOWN'}`,
            title: s.title || 'Untitled Scheme',
            department: s.ministry || s.department || 'Unknown Department',
            date: s.createdAt || new Date().toISOString(),
            type: 'Scheme',
            status: s.status || 'Pending'
          }));
        allItems = [...allItems, ...mappedSchemes];
      }
      
      // Sort by newest
      allItems.sort((a, b) => new Date(b.date) - new Date(a.date));
      setItems(allItems);
      
    } catch (err) {
      setError(err.message || "Failed to fetch approval queue.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingItems();
  }, [isAuthorized]);

  // Helper stats
  const stats = useMemo(() => {
    const total = items.length;
    const policiesCount = items.filter(i => i.type === 'Policy').length;
    const schemesCount = items.filter(i => i.type === 'Scheme').length;
    return { total, policiesCount, schemesCount };
  }, [items]);

  // Search & filter logic combined
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch = 
        item.displayId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.department?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesType = typeFilter === 'All' || item.type === typeFilter;
      const matchesStatus = statusFilter === 'All' || item.status === statusFilter;

      // Restrict Gov Officials to only see items they "created" (simulated by department matching or just seeing all for now)
      // Since backend doesn't have createdBy linked to user, we'll let them see all authorized items.
      
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [items, searchQuery, typeFilter, statusFilter]);

  // Paginated chunk
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredItems.slice(start, start + itemsPerPage);
  }, [filteredItems, currentPage]);

  const totalPages = Math.max(Math.ceil(filteredItems.length / itemsPerPage), 1);

  // Handlers for Policy Approval Actions
  const handleAction = async (action, type, id) => {
    if (type !== 'Policy') {
      alert('Approval workflow is currently supported for Policies only in this milestone.');
      return;
    }
    
    try {
      let res;
      if (action === 'submit') {
        res = await submitForApproval(id);
      } else if (action === 'approve') {
        res = await approvePolicy(id);
      } else if (action === 'reject') {
        const reason = prompt('Please enter a rejection reason:');
        if (!reason) return;
        res = await rejectPolicy(id, reason);
      }
      
      if (res && res.success) {
        fetchPendingItems();
      }
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Action failed');
    }
  };

  if (!isAuthorized) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-slate-50 text-center px-4">
        <FaShieldAlt className="w-16 h-16 text-rose-500 mb-4" />
        <h2 className="text-2xl font-black text-slate-800 mb-2">Restricted Access</h2>
        <p className="text-sm font-semibold text-slate-500 max-w-md">
          This portal contains sensitive compliance workflows and is restricted to Government Officials and Administrators.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-8 flex flex-col justify-between min-h-full bg-slate-50">
        <div className="flex-grow space-y-8 px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Header Block */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2.5 select-none">
                <FaClipboardCheck className="text-[#0052cc]" /> Approvals Dashboard
              </h2>
              <p className="text-xs text-slate-500 font-semibold select-none mt-1">
                Review, verify, and manage government policies and schemes.
              </p>
            </div>
            <div className="flex gap-3">
              {user?.role === 'Gov. Official' && (
                <>
                  <button
                    onClick={() => setPolicyModalOpen(true)}
                    className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-extrabold flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
                  >
                    <FaFileAlt className="text-slate-400" /> New Policy
                  </button>
                  <button
                    onClick={() => setSchemeModalOpen(true)}
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
                onClick={fetchPendingItems}
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
                      placeholder="Search by ID, title or department..."
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
                    <option value="Under Review">Under Review</option>
                    <option value="Active">Active / Approved</option>
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
                    <option value="Scheme">Schemes</option>
                  </select>

                </div>
              </div>

              {/* Empty State */}
              {filteredItems.length === 0 && (
                <div className="bg-white rounded-2xl border border-slate-300 p-12 text-center flex flex-col items-center">
                  <FaClipboardCheck className="text-slate-300 w-16 h-16 mb-4" />
                  <h3 className="text-sm font-bold text-slate-700 mb-1 select-none">Queue is Empty</h3>
                  <p className="text-xs text-slate-400 font-semibold mb-6 max-w-xs leading-relaxed select-none">
                    There are no pending items requiring your approval at this moment. You are all caught up!
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
                                {item.type === 'Policy' && item.status === 'Draft' && user?.role === 'Gov. Official' && (
                                  <button
                                    onClick={() => handleAction('submit', item.type, item.id)}
                                    className="px-2 py-1 bg-blue-50 hover:bg-blue-100 text-[#0052cc] rounded text-xs font-bold transition-colors cursor-pointer border-none"
                                  >
                                    Submit
                                  </button>
                                )}
                                {item.type === 'Policy' && item.status === 'Pending' && user?.role === 'Admin' && (
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
                                <button
                                  onClick={() => navigate(item.type === 'Policy' ? `/policy/${item.id}` : `/dashboard?tab=schemes`)}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0052cc] hover:bg-[#0047b3] text-white rounded-lg text-xs font-bold transition-colors cursor-pointer border-none ml-1"
                                >
                                  <FaEye className="w-3 h-3" /> View
                                </button>
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

      <PolicyFormModal 
        isOpen={isPolicyModalOpen} 
        onClose={() => setPolicyModalOpen(false)} 
        onSuccess={fetchPendingItems} 
      />
      <SchemeFormModal 
        isOpen={isSchemeModalOpen} 
        onClose={() => setSchemeModalOpen(false)} 
        onSuccess={fetchPendingItems} 
      />
    </>
  );
};

export default ApprovalsDashboard;
