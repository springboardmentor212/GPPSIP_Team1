import React from 'react';
import { FaCheckCircle, FaLaptopCode, FaLeaf, FaShieldAlt, FaMicroscope, FaBuilding, FaCalendarAlt, FaFileDownload } from 'react-icons/fa';
import Footer from '../../components/layout/Footer';

const SchemeDetailsPage = ({ scheme, onBack }) => {
  if (!scheme) return null;

  // Dynamic icon selector based on title or category (copied from SchemeCard)
  const getIcon = () => {
    const titleLower = scheme.title.toLowerCase();
    if (titleLower.includes('msme') || titleLower.includes('credit')) {
      return (
        <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#0052cc] border border-blue-150 flex items-center justify-center shrink-0 shadow-sm">
          <FaLaptopCode className="w-7 h-7" />
        </div>
      );
    }
    if (titleLower.includes('green') || titleLower.includes('tech') || titleLower.includes('subsidy')) {
      if (titleLower.includes('bio-manufacturing')) {
        return (
          <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 border border-purple-150 flex items-center justify-center shrink-0 shadow-sm">
            <FaMicroscope className="w-7 h-7" />
          </div>
        );
      }
      return (
        <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-150 flex items-center justify-center shrink-0 shadow-sm">
          <FaLeaf className="w-7 h-7" />
        </div>
      );
    }
    if (titleLower.includes('cyber') || titleLower.includes('talent')) {
      return (
        <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-150 flex items-center justify-center shrink-0 shadow-sm">
          <FaShieldAlt className="w-7 h-7" />
        </div>
      );
    }
    return (
      <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#0052cc] border border-blue-150 flex items-center justify-center shrink-0 shadow-sm">
        <FaBuilding className="w-7 h-7" />
      </div>
    );
  };

  const formattedDate = scheme.date 
    ? new Date(scheme.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
    : 'Ongoing';

  return (
    <div className="relative w-full min-h-screen bg-slate-50/30 flex flex-col justify-between">
      
      {/* Main Page Layout Wrapper */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 flex-grow">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center text-xs font-bold text-slate-500 gap-2 mb-2">
          <button onClick={onBack} className="hover:text-[#0052cc] transition-colors border-none bg-transparent cursor-pointer">
            Dashboard
          </button>
          <span>/</span>
          <span className="text-slate-800">Schemes</span>
          <span>/</span>
          <span className="text-[#0052cc] max-w-xs truncate">{scheme.displayId || scheme.id}</span>
        </nav>

        {/* Scheme Header Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-50 to-purple-50 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/3"></div>
          
          <div className="flex items-start gap-6 relative z-10">
            {getIcon()}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-purple-50 text-purple-700 uppercase tracking-widest border border-purple-100">
                  Government Scheme
                </span>
                {scheme.matchPercentage && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-blue-50 text-blue-600 uppercase tracking-widest border border-blue-150">
                    {scheme.matchPercentage}% Match
                  </span>
                )}
                {scheme.eligibilityTag && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-50 text-emerald-600 border border-emerald-100 tracking-wider">
                    <FaCheckCircle className="w-3 h-3" />
                    {scheme.eligibilityTag}
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight max-w-3xl">
                {scheme.title}
              </h1>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-semibold text-slate-500">
                <span className="flex items-center gap-2">
                  <FaBuilding className="text-slate-400" /> {scheme.department || scheme.ministry || 'Federal Government'}
                </span>
                <span className="flex items-center gap-2">
                  <FaCalendarAlt className="text-slate-400" /> {scheme.status === 'Draft' ? 'Draft' : formattedDate}
                </span>
                <span className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${scheme.status === 'Active' ? 'bg-emerald-500' : scheme.status === 'Draft' ? 'bg-amber-400' : 'bg-slate-400'}`}></div>
                  {scheme.status || 'Active'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 2-Column Grid for Details & Quick Action Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Left Column - Main Details (2/3 width) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Overview Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8 space-y-4">
              <h2 className="text-lg font-black text-slate-800 tracking-tight flex items-center gap-2">
                <span className="w-1.5 h-6 bg-[#0052cc] rounded-full inline-block"></span>
                Scheme Overview
              </h2>
              <div className="prose prose-sm prose-slate max-w-none">
                <p className="text-sm font-semibold text-slate-600 leading-relaxed">
                  {scheme.description || 'Detailed description of the scheme is not available.'}
                </p>
              </div>
            </div>

            {/* Benefits & Scope */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8 space-y-6">
              <h2 className="text-lg font-black text-slate-800 tracking-tight flex items-center gap-2">
                <span className="w-1.5 h-6 bg-purple-600 rounded-full inline-block"></span>
                Key Benefits
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-emerald-100 bg-emerald-50/50">
                  <h4 className="text-[10px] font-black text-emerald-600 uppercase tracking-wider mb-1">Maximum Financial Benefit</h4>
                  <p className="text-lg font-black text-emerald-700">{scheme.maxBenefit || 'Variable'}</p>
                </div>
                <div className="p-4 rounded-xl border border-rose-100 bg-rose-50/50">
                  <h4 className="text-[10px] font-black text-rose-600 uppercase tracking-wider mb-1">Application Deadline</h4>
                  <p className="text-lg font-black text-rose-700">{scheme.deadline || 'Rolling Basis'}</p>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column - Quick Actions (1/3 width) */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Action Panel */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-6 space-y-4">
                <h3 className="text-sm font-black text-slate-800 tracking-tight">Quick Actions</h3>
                <div className="space-y-3">
                  <button className="w-full flex items-center justify-center gap-2 bg-[#0052cc] hover:bg-[#0047b3] text-white py-3 px-4 rounded-xl text-sm font-bold transition-all shadow-md shadow-blue-500/20 border-none cursor-pointer">
                    Apply for Scheme
                  </button>
                  <button className="w-full flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 py-3 px-4 rounded-xl text-sm font-bold transition-all border border-slate-200 cursor-pointer">
                    <FaFileDownload /> Download Guidelines
                  </button>
                </div>
              </div>
              <div className="bg-slate-50 p-4 border-t border-slate-200 text-center">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Scheme ID: {scheme.displayId || scheme.id}</p>
              </div>
            </div>
            
          </div>
        </div>

      </div>

      <Footer />
    </div>
  );
};

export default SchemeDetailsPage;
