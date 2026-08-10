import React, { useState, useEffect } from 'react';
import { getAdminAuditLogs } from '../../services/admin.service';
import { FaSearch, FaHistory, FaUserShield, FaUserGraduate } from 'react-icons/fa';

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await getAdminAuditLogs();
      if (res.success && Array.isArray(res.logs)) {
        setLogs(res.logs);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter((log) => {
    const query = searchQuery.toLowerCase();
    return (
      (log.action || '').toLowerCase().includes(query) ||
      (log.details || '').toLowerCase().includes(query) ||
      (log.performedBy?.fullName || '').toLowerCase().includes(query) ||
      (log.performedBy?.email || '').toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-6 text-left">
      <div>
        <h2 className="text-2xl font-black text-slate-800 tracking-tight">System Audit & Action Logs</h2>
        <p className="text-xs font-semibold text-slate-500 mt-1">Track platform security, updates, and configuration changes performed by administrators.</p>
      </div>

      {/* Search Filter */}
      <div className="bg-white border border-slate-300 rounded-3xl p-5 flex flex-col md:flex-row gap-4 items-center justify-between shadow-sm">
        <div className="relative flex items-center bg-slate-50 border border-slate-250 rounded-xl p-1.5 pl-4 w-full md:max-w-md">
          <FaSearch className="text-slate-400 mr-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search logs by action, keyword, or email..."
            className="bg-transparent text-slate-800 placeholder-slate-400 focus:outline-none w-full text-xs py-1.5 font-bold"
          />
        </div>
      </div>

      {/* Audit Logs list */}
      <div className="bg-white border border-slate-300 rounded-3xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="py-16 text-center">
            <div className="w-10 h-10 border-4 border-[#0052cc] border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-xs font-bold text-slate-400 mt-4">Loading audit logs...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-450 uppercase font-black tracking-wider">
                  <th className="px-6 py-4">Action</th>
                  <th className="px-6 py-4">Description / Details</th>
                  <th className="px-6 py-4">Performed By</th>
                  <th className="px-6 py-4">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold text-slate-650">
                {filteredLogs.map((l) => (
                  <tr key={l._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        l.action.includes('USER') 
                          ? 'bg-blue-50 text-blue-600 border-blue-100' 
                          : l.action.includes('SETTINGS')
                          ? 'bg-purple-50 text-purple-600 border-purple-100'
                          : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                      }`}>
                        <FaHistory className="w-2.5 h-2.5" />
                        {l.action}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-700 max-w-md">{l.details}</td>
                    <td className="px-6 py-4">
                      <div className="font-extrabold text-slate-800">{l.performedBy?.fullName || 'System'}</div>
                      <div className="text-[10px] text-slate-450 font-mono font-bold">{l.performedBy?.email || ''}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-400 font-bold">
                      {new Date(l.timestamp || l.createdAt).toLocaleString('en-GB')}
                    </td>
                  </tr>
                ))}
                {filteredLogs.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-slate-400 font-bold">
                      No administrative logs recorded yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuditLogs;
