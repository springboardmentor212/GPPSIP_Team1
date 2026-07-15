import React, { useState } from 'react';
import useAuth from '../features/auth/hooks/useAuth';
import { Link } from 'react-router';

const Dashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f0f4f9]">
        <p className="text-xl text-slate-700 mb-4">Please log in to view your dashboard.</p>
        <Link to="/login" className="px-6 py-2 bg-[#0052cc] text-white font-bold rounded-lg hover:bg-[#0047b3] transition">
          Sign In
        </Link>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 border-b border-slate-100 pb-4">My Details</h2>
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <div className="text-4xl font-black text-[#0052cc] mb-2">0</div>
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wide">Saved Schemes</h3>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <div className="text-4xl font-black text-[#0052cc] mb-2">0</div>
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wide">Active Applications</h3>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <div className="text-4xl font-black text-[#0052cc] mb-2">0</div>
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wide">AI Consultations</h3>
              </div>
            </div>
          </div>
        );
      case 'schemes':
        return (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8 min-h-[400px] flex items-center justify-center">
            <p className="text-slate-500 text-lg">Your saved schemes will appear here.</p>
          </div>
        );
      case 'ai':
        return (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8 min-h-[400px] flex items-center justify-center">
            <p className="text-slate-500 text-lg">Your recent AI consultations will appear here.</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f4f9] font-sans flex flex-col md:flex-row">
      
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 md:min-h-screen">
        <div className="h-20 flex items-center px-6 border-b border-slate-100">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="flex items-end gap-[3px] h-6 shrink-0">
              <div className="w-[10px] h-[14px] bg-[#0052cc] rounded-[2px]" />
              <div className="w-[10px] h-[22px] bg-[#0a369d] rounded-[2px]" />
            </div>
            <span className="text-lg font-bold text-slate-800 tracking-tight ml-1">
              PolicyGPT
            </span>
          </Link>
        </div>
        
        <div className="p-4 flex flex-col gap-2 flex-grow">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-colors cursor-pointer ${activeTab === 'overview' ? 'bg-blue-50 text-[#0052cc]' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
          >
            Overview
          </button>
          <button 
            onClick={() => setActiveTab('schemes')}
            className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-colors cursor-pointer ${activeTab === 'schemes' ? 'bg-blue-50 text-[#0052cc]' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
          >
            Saved Schemes
          </button>
          <button 
            onClick={() => setActiveTab('ai')}
            className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-colors cursor-pointer ${activeTab === 'ai' ? 'bg-blue-50 text-[#0052cc]' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
          >
            AI Consultations
          </button>
        </div>
        
        <div className="p-4 border-t border-slate-100">
          <Link to="/" className="w-full block text-center px-4 py-3 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-colors">
            Back to Home
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-4 sm:p-8 overflow-y-auto">
        <header className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Welcome back, {user.fullName.split(' ')[0]}!
          </h1>
          <p className="text-slate-500 mt-2">Manage your profile, schemes, and eligibility checks.</p>
        </header>

        {renderContent()}
      </main>

    </div>
  );
};

export default Dashboard;
