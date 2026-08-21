import React, { useState, useEffect } from 'react';
import useAuth from '../../hooks/useAuth';
import { getAdminSettings, updateAdminSettings } from '../../services/admin.service';
import { useToast } from '../../hooks/useToast';

const SettingsPage = ({ dbStatus }) => {
  const { user } = useAuth();
  const isSuperAdmin = user && user.role === 'Super Admin';
  const { addToast } = useToast();

  const [platformSettings, setPlatformSettings] = useState({
    platformName: 'PolicyGPT',
    maintenanceMode: false,
    maxLoginAttempts: 5,
    jwtExpiryDays: 7,
    allowPublicRegistrations: true
  });
  const [loadingSettings, setLoadingSettings] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);

  useEffect(() => {
    if (isSuperAdmin) {
      setLoadingSettings(true);
      getAdminSettings()
        .then((res) => {
          if (res.success && res.settings) {
            setPlatformSettings(res.settings);
          }
        })
        .catch((err) => console.error(err))
        .finally(() => setLoadingSettings(false));
    }
  }, [isSuperAdmin]);

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      const res = await updateAdminSettings(platformSettings);
      if (res.success) {
        addToast(res.message || 'Platform settings updated successfully.', 'success');
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to update platform settings.', 'error');
    } finally {
      setSavingSettings(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
      {/* Left side - Account settings (all roles) */}
      <div className={`bg-white rounded-2xl border border-slate-300 p-6 sm:p-8 min-h-[440px] shadow-sm ${isSuperAdmin ? 'lg:col-span-6' : 'lg:col-span-12'}`}>
        <h2 className="text-xl font-black text-slate-800 mb-6 pb-4 border-b border-slate-200">Account Settings</h2>
        <div className="space-y-6 max-w-md font-semibold text-slate-650 text-xs">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="text-sm font-bold text-slate-700">Email Notifications</h4>
              <span className="text-xs text-slate-400 font-light block mt-0.5">Receive alerts when new schemes match your profile</span>
            </div>
            <input type="checkbox" defaultChecked className="rounded border-slate-350 text-[#0052cc] focus:ring-blue-500/10 cursor-pointer" />
          </div>
          <div className="flex justify-between items-center">
            <div>
              <h4 className="text-sm font-bold text-slate-700">Language</h4>
              <span className="text-xs text-slate-400 font-light block mt-0.5">Select your preferred system language</span>
            </div>
            <select className="px-3.5 py-1.5 border border-slate-300 rounded-lg text-xs bg-white font-bold text-slate-850 cursor-pointer">
              <option>English</option>
              <option>Marathi (मराठी)</option>
              <option>Hindi (हिंदी)</option>
            </select>
          </div>
          <div className="pt-5 border-t border-slate-200 flex justify-between items-center">
            <div>
              <h4 className="text-sm font-bold text-slate-700">Database Connection</h4>
              <span className={`text-xs font-semibold block mt-0.5 ${dbStatus === 'connected' ? 'text-emerald-600' : dbStatus === 'checking' ? 'text-slate-400' : 'text-rose-600'}`}>
                {dbStatus === 'connected' ? 'Connected: Live Database Active' : dbStatus === 'checking' ? 'Checking connection...' : 'Disconnected: Backend API Pending'}
              </span>
            </div>
            <span className={`px-2 py-0.5 rounded border text-[10px] font-black uppercase ${
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

      {/* Right side - Platform administrative settings (Super Admin only) */}
      {isSuperAdmin && (
        <div className="bg-white rounded-2xl border border-slate-300 p-6 sm:p-8 min-h-[440px] shadow-sm lg:col-span-6">
          <h2 className="text-xl font-black text-slate-800 mb-6 pb-4 border-b border-slate-200">System Platform Settings</h2>
          
          {loadingSettings ? (
            <div className="py-16 text-center">
              <div className="w-8 h-8 border-4 border-[#0052cc] border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-xs font-bold text-slate-400 mt-4">Loading system settings...</p>
            </div>
          ) : (
            <form onSubmit={handleSaveSettings} className="space-y-4 text-xs font-semibold text-slate-500">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Platform Name</label>
                <input
                  type="text"
                  value={platformSettings.platformName}
                  onChange={(e) => setPlatformSettings({ ...platformSettings, platformName: e.target.value })}
                  placeholder="PolicyGPT"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-800 text-xs focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Max Login Attempts</label>
                  <input
                    type="number"
                    value={platformSettings.maxLoginAttempts}
                    onChange={(e) => setPlatformSettings({ ...platformSettings, maxLoginAttempts: parseInt(e.target.value) || 5 })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-800 text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">JWT Expiration (Days)</label>
                  <input
                    type="number"
                    value={platformSettings.jwtExpiryDays}
                    onChange={(e) => setPlatformSettings({ ...platformSettings, jwtExpiryDays: parseInt(e.target.value) || 7 })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-800 text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <div>
                  <h4 className="text-xs font-bold text-slate-700">Maintenance Mode</h4>
                  <span className="text-[10px] text-slate-450 block font-light mt-0.5">Restrict client access to read-only state</span>
                </div>
                <input
                  type="checkbox"
                  checked={platformSettings.maintenanceMode}
                  onChange={(e) => setPlatformSettings({ ...platformSettings, maintenanceMode: e.target.checked })}
                  className="rounded border-slate-350 text-[#0052cc] focus:ring-blue-500/10 cursor-pointer"
                />
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-xs font-bold text-slate-700">Allow Public Registrations</h4>
                  <span className="text-[10px] text-slate-450 block font-light mt-0.5">Enable citizens to create new accounts</span>
                </div>
                <input
                  type="checkbox"
                  checked={platformSettings.allowPublicRegistrations}
                  onChange={(e) => setPlatformSettings({ ...platformSettings, allowPublicRegistrations: e.target.checked })}
                  className="rounded border-slate-350 text-[#0052cc] focus:ring-blue-500/10 cursor-pointer"
                />
              </div>

              <button
                type="submit"
                disabled={savingSettings}
                className="w-full py-2.5 bg-[#0052cc] hover:bg-[#0047b3] text-white font-bold rounded-lg text-xs shadow-sm mt-4 border-none cursor-pointer disabled:opacity-75"
              >
                {savingSettings ? 'Saving Settings...' : 'Save Platform Settings'}
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
};
export default SettingsPage;
