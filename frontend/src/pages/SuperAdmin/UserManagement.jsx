import React, { useState, useEffect } from 'react';
import { getAdminUsers, toggleUserStatus, deleteUser } from '../../services/admin.service';
import StatsCard from '../../components/cards/StatsCard';
import StatusBadge from '../../components/ui/StatusBadge';
import Modal from '../../components/modals/Modal';
import { FaSearch, FaEye, FaBan, FaCheck, FaTrash, FaUserShield, FaUserGraduate } from 'react-icons/fa';
import { useToast } from '../../hooks/useToast';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const { addToast } = useToast();
  
  // Selected user for details
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDetailsOpen, setDetailsOpen] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await getAdminUsers(searchQuery, roleFilter);
      if (res.success && Array.isArray(res.users)) {
        setUsers(res.users);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [searchQuery, roleFilter]);

  const handleToggleStatus = async (id) => {
    try {
      const res = await toggleUserStatus(id);
      if (res.success) {
        addToast(res.message, 'success');
        fetchUsers();
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to update user status.', 'error');
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this user?')) return;
    try {
      const res = await deleteUser(id);
      if (res.success) {
        addToast(res.message, 'success');
        fetchUsers();
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to delete user.', 'error');
    }
  };

  return (
    <div className="space-y-6 text-left">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">User Directory & Management</h2>
          <p className="text-xs font-semibold text-slate-500 mt-1">Manage, search, activate or deactivate platform user profiles.</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-300 rounded-3xl p-5 flex flex-col md:flex-row gap-4 items-center justify-between shadow-sm">
        <div className="relative flex items-center bg-slate-50 border border-slate-250 rounded-xl p-1.5 pl-4 w-full md:max-w-md">
          <FaSearch className="text-slate-400 mr-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search users by name or email..."
            className="bg-transparent text-slate-800 placeholder-slate-400 focus:outline-none w-full text-xs py-1.5 font-bold"
          />
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto shrink-0 self-end sm:self-center">
          <span className="text-xs font-black text-slate-400 uppercase tracking-wider">Filter Role:</span>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3.5 py-2 border border-slate-300 bg-white text-slate-800 rounded-xl text-xs font-bold outline-none focus:border-[#0052cc]"
          >
            <option value="All">All Roles</option>
            <option value="Citizen">Citizen</option>
            <option value="Gov. Official">Government Official</option>
            <option value="Super Admin">Super Admin</option>
          </select>
        </div>
      </div>

      {/* Users List Table */}
      <div className="bg-white border border-slate-300 rounded-3xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="py-16 text-center">
            <div className="w-10 h-10 border-4 border-[#0052cc] border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-xs font-bold text-slate-400 mt-4">Loading directory database...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-450 uppercase font-black tracking-wider">
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">State/District</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold text-slate-650">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-extrabold text-slate-800">{u.fullName}</td>
                    <td className="px-6 py-4 font-mono text-slate-500">{u.email}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        u.role === 'Super Admin' 
                          ? 'bg-rose-50 text-rose-600 border-rose-100' 
                          : u.role === 'Gov. Official'
                          ? 'bg-amber-50 text-amber-600 border-amber-100'
                          : 'bg-blue-50 text-[#0052cc] border-blue-100'
                      }`}>
                        {u.role === 'Super Admin' ? <FaUserShield className="w-2.5 h-2.5" /> : <FaUserGraduate className="w-2.5 h-2.5" />}
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                        u.isActive !== false
                          ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                          : 'bg-rose-50 text-rose-600 border-rose-100'
                      }`}>
                        {u.isActive !== false ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500">{u.district}, {u.state}</td>
                    <td className="px-6 py-4 text-right space-x-2.5">
                      <button
                        onClick={() => {
                          setSelectedUser(u);
                          setDetailsOpen(true);
                        }}
                        className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition cursor-pointer border-none"
                        title="View Profile Details"
                      >
                        <FaEye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleToggleStatus(u._id)}
                        className={`p-2 rounded-lg transition cursor-pointer border-none ${
                          u.isActive !== false
                            ? 'bg-amber-50 hover:bg-amber-100 text-amber-600'
                            : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-600'
                        }`}
                        title={u.isActive !== false ? 'Deactivate User' : 'Activate User'}
                      >
                        {u.isActive !== false ? <FaBan className="w-3.5 h-3.5" /> : <FaCheck className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        onClick={() => handleDeleteUser(u._id)}
                        className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition cursor-pointer border-none"
                        title="Delete User Account"
                      >
                        <FaTrash className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-400 font-bold">
                      No user accounts match current search/filter tags.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* User Details Modal */}
      <Modal isOpen={isDetailsOpen} onClose={() => setDetailsOpen(false)} title="User Details Details">
        {selectedUser && (
          <div className="space-y-6 text-left text-xs font-semibold text-slate-500">
            <div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Account Full Name</span>
              <span className="text-sm font-extrabold text-slate-800 block mt-1">{selectedUser.fullName}</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Email Address</span>
                <span className="text-slate-800 font-extrabold font-mono mt-1 block">{selectedUser.email}</span>
              </div>
              <div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Mobile Number</span>
                <span className="text-slate-800 font-extrabold mt-1 block">{selectedUser.mobile}</span>
              </div>
              <div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Date of Birth</span>
                <span className="text-slate-800 font-extrabold mt-1 block">
                  {new Date(selectedUser.dob).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">State location</span>
                <span className="text-slate-800 font-extrabold mt-1 block">{selectedUser.state}</span>
              </div>
              <div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">District</span>
                <span className="text-slate-800 font-extrabold mt-1 block">{selectedUser.district}</span>
              </div>
              <div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Account Role</span>
                <span className="text-slate-800 font-extrabold mt-1 block">{selectedUser.role}</span>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default UserManagement;
