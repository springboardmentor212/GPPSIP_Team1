import React, { useState } from 'react';
import Sidebar from './Sidebar';
import TopNavbar from './TopNavbar';
import FloatingAIAssistant from '../dashboard/FloatingAIAssistant';

const DashboardLayout = ({ 
  children, 
  activeTab, 
  setActiveTab, 
  handleLogout, 
  user,
  setSearchQuery
}) => {
  return (
    <div className="min-h-screen w-full bg-[#f8fafc] font-sans flex flex-col md:flex-row overflow-hidden relative">
      
      {/* Sidebar - Fixed Left */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        handleLogout={handleLogout} 
        user={user} 
      />

      {/* Main Content Area Container */}
      <div className="flex-grow flex flex-col h-screen overflow-hidden">
        
        {/* Top Navbar */}
        <TopNavbar 
          user={user} 
          activeTab={activeTab} 
          setSearchQuery={setSearchQuery} 
        />

        {/* Scrollable Core Viewport */}
        <div className="flex-grow overflow-y-auto bg-slate-50/50">
          <main className="max-w-7xl mx-auto p-6 sm:p-8 flex flex-col justify-between min-h-full">
            <div className="flex-grow">
              {children}
            </div>
          </main>
        </div>

      </div>

      {/* Global Floating AI Assistant Widget */}
      <FloatingAIAssistant />

    </div>
  );
};

export default DashboardLayout;
