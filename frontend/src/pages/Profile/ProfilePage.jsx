import React from 'react';

const ProfilePage = ({ user }) => {
  if (!user) return null;
  return (
    <div className="bg-white rounded-2xl border border-slate-300 p-6 sm:p-8">
      <h2 className="text-2xl font-bold text-slate-900 mb-6 pb-4 border-b border-slate-300">My Profile Details</h2>
      <div className="flex items-center gap-6 mb-8">
        <div className="w-20 h-20 rounded-full bg-[#0052cc] flex items-center justify-center text-white text-3xl font-bold uppercase shadow-sm">
          {user.fullName ? user.fullName.charAt(0) : ''}
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
            {user.dob ? new Date(user.dob).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }) : ''}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Location</span>
          <span className="text-base font-medium text-slate-800">{user.district}, {user.state}</span>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
