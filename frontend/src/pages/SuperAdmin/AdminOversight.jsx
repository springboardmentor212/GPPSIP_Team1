import React, { useState, useEffect } from 'react';
import { getAdminApplications } from '../../services/admin.service';
import StatusBadge from '../../components/ui/StatusBadge';
import Modal from '../../components/modals/Modal';
import { FaSearch, FaEye, FaClipboardList } from 'react-icons/fa';

const AdminOversight = () => {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  
  const [selectedApp, setSelectedApp] = useState(null);
  const [isDetailsOpen, setDetailsOpen] = useState(false);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await getAdminApplications();
      if (res.success && Array.isArray(res.applications)) {
        setApps(res.applications);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const filteredApps = apps.filter((app) => {
    const matchesStatus = statusFilter === 'All' || app.status === statusFilter;
    const matchesSearch = 
      (app.applicationId || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (app.applicant?.fullName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (app.scheme?.title || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6 text-left">
      <div>
        <h2 className="text-2xl font-black text-slate-800 tracking-tight">Platform Applications Oversight</h2>
        <p className="text-xs font-semibold text-slate-500 mt-1">Audit, check details and track approvals of citizen submissions across the platform.</p>
      </div>

      {/* Filters */}
      <div className="bg-white border border-slate-300 rounded-3xl p-5 flex flex-col md:flex-row gap-4 items-center justify-between shadow-sm">
        <div className="relative flex items-center bg-slate-50 border border-slate-250 rounded-xl p-1.5 pl-4 w-full md:max-w-md">
          <FaSearch className="text-slate-400 mr-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by ID, Citizen name, or Scheme..."
            className="bg-transparent text-slate-800 placeholder-slate-400 focus:outline-none w-full text-xs py-1.5 font-bold"
          />
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto shrink-0 self-end sm:self-center">
          <span className="text-xs font-black text-slate-400 uppercase tracking-wider">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3.5 py-2 border border-[#cbd5e1] bg-white text-slate-800 rounded-xl text-xs font-bold outline-none focus:border-[#0052cc]"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white border border-slate-300 rounded-3xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="py-16 text-center">
            <div className="w-10 h-10 border-4 border-[#0052cc] border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-xs font-bold text-slate-400 mt-4">Loading application logs...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-450 uppercase font-black tracking-wider">
                  <th className="px-6 py-4">Application ID</th>
                  <th className="px-6 py-4">Citizen</th>
                  <th className="px-6 py-4">Scheme</th>
                  <th className="px-6 py-4">Department</th>
                  <th className="px-6 py-4">Submitted Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold text-slate-650">
                {filteredApps.map((a) => (
                  <tr key={a._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-mono text-slate-800 font-extrabold">{a.applicationId}</td>
                    <td className="px-6 py-4">
                      <div className="text-slate-850 font-extrabold">{a.applicant?.fullName || 'N/A'}</div>
                      <div className="text-[10px] text-slate-450 font-bold">{a.applicant?.email || ''}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-800 font-extrabold">{a.scheme?.title || 'Unknown Scheme'}</td>
                    <td className="px-6 py-4 text-slate-500">{a.scheme?.category || 'General'}</td>
                    <td className="px-6 py-4 text-slate-500">
                      {new Date(a.submittedAt || a.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={a.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => {
                          setSelectedApp(a);
                          setDetailsOpen(true);
                        }}
                        className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition cursor-pointer border-none"
                        title="View Full Application Details"
                      >
                        <FaEye className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredApps.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-slate-400 font-bold">
                      No applications found matching search/filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Details Modal */}
      <Modal isOpen={isDetailsOpen} onClose={() => setDetailsOpen(false)} title="Application Details Details">
        {selectedApp && (
          <div className="space-y-6 text-left text-xs font-semibold text-slate-500">
            {/* Scheme Info */}
            <div className="border-b border-slate-200 pb-4">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Scheme Details</h4>
              <p className="text-sm font-extrabold text-slate-800">{selectedApp.scheme?.title || 'N/A'}</p>
              <p className="text-slate-550 font-bold mt-1">Department: {selectedApp.scheme?.category || 'N/A'}</p>
            </div>

            {/* Applicant Profile */}
            <div className="border-b border-slate-200 pb-4">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Citizen Profile</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="block text-[10px] text-slate-400 font-black uppercase">Full Name</span>
                  <span className="text-slate-800 font-extrabold">{selectedApp.applicant?.fullName || 'N/A'}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400 font-black uppercase">Email Address</span>
                  <span className="text-slate-800 font-extrabold font-mono">{selectedApp.applicant?.email || 'N/A'}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400 font-black uppercase">State Location</span>
                  <span className="text-slate-800 font-extrabold">{selectedApp.applicant?.state || 'N/A'}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400 font-black uppercase">District</span>
                  <span className="text-slate-800 font-extrabold">{selectedApp.applicant?.district || 'N/A'}</span>
                </div>
              </div>
            </div>

            {/* Verification Status */}
            <div>
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Review Status</h4>
              <div className="flex items-center gap-3">
                <StatusBadge status={selectedApp.status} />
                <span className="text-slate-400 text-[10px] font-bold">
                  Submitted: {new Date(selectedApp.submittedAt || selectedApp.createdAt).toLocaleString('en-GB')}
                </span>
              </div>
              {selectedApp.status !== 'Pending' && selectedApp.reviewedAt && (
                <div className="mt-4 p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Review Audit Log</p>
                  <p className="text-slate-800">
                    <span className="font-bold text-slate-650">Reviewed On:</span> {new Date(selectedApp.reviewedAt).toLocaleString('en-GB')}
                  </p>
                  {selectedApp.status === 'Rejected' && selectedApp.rejectionReason && (
                    <p className="text-rose-700 bg-rose-50 border border-rose-100 p-2.5 rounded-lg mt-2 font-bold">
                      <span className="font-black text-rose-800 uppercase block text-[9px] mb-0.5">Rejection Reason</span>
                      "{selectedApp.rejectionReason}"
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminOversight;
