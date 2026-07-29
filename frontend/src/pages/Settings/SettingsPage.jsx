import React from 'react';

const SettingsPage = ({ dbStatus }) => {
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
            <span className={`text-xs font-medium ${dbStatus === 'connected' ? 'text-emerald-500' : dbStatus === 'checking' ? 'text-slate-400' : 'text-rose-500'}`}>
              {dbStatus === 'connected' ? 'Connected: Live Database Active' : dbStatus === 'checking' ? 'Checking connection...' : 'Disconnected: Backend API Pending'}
            </span>
          </div>
          <span className={`px-2 py-0.5 rounded border text-[10px] font-bold uppercase ${
            dbStatus === 'connected' 
              ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
              : dbStatus === 'checking' 
                ? 'bg-slate-50 text-slate-500 border-slate-200'
                : 'bg-rose-50 text-rose-600 border-rose-100'
          }`}>
            {dbStatus === 'connected' ? 'Connected' : dbStatus === 'checking' ? 'Checking' : 'Disconnected'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
