import React, { useState } from 'react';
import PolicyHeader from './PolicyHeader';
import PolicyOverview from './PolicyOverview';
import PolicyObjectives from './PolicyObjectives';
import EligibilityCard from './EligibilityCard';
import DocumentGrid from '../../components/common/DocumentGrid';
import QuickActionPanel from '../../components/dashboard/QuickActionPanel';
import RelatedPolicies from './RelatedPolicies';
import Footer from '../../components/layout/Footer';

const PolicyDetailsPage = ({ policy, onBack }) => {
  // Map backend fields to frontend UI expectation
  const mappedPolicy = React.useMemo(() => {
    if (!policy) return null;
    return {
      ...policy,
      publishedDate: policy.createdAt 
        ? new Date(policy.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) 
        : policy.publishedDate
    };
  }, [policy]);

  // Setup local bookmark state linked to the policy ID
  const [isBookmarked, setIsBookmarked] = useState(false);

  const handleBookmarkToggle = () => {
    setIsBookmarked(!isBookmarked);
  };

  const handleDownloadPDF = () => {
    alert(`Downloading official PDF for: ${mappedPolicy?.title || "Comprehensive Data Privacy & Security Framework (DPSF) 2024"}`);
  };

  return (
    <div className="relative w-full min-h-screen bg-slate-50/30 flex flex-col justify-between">
      
      {/* Main Page Layout Wrapper */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 flex-grow">
        
        {/* Policy Header (includes Breadcrumb, main card info and AI Insights) */}
        <PolicyHeader policy={mappedPolicy} onBack={onBack} />

        {/* 2-Column Grid for Details & Quick Action Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Left Column - Main Details (2/3 width) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Overview */}
            <PolicyOverview description={mappedPolicy?.description} />

            {/* Objectives */}
            <PolicyObjectives objectives={mappedPolicy?.objectives} />

            {/* Eligibility & Scope */}
            <EligibilityCard eligibility={mappedPolicy?.eligibility} />

            {/* Required Documents */}
            <DocumentGrid documents={mappedPolicy?.documents} />
          </div>

          {/* Right Column - Quick Actions & Approval (1/3 width) */}
          <div className="lg:col-span-1 space-y-6">
            <QuickActionPanel 
              policyId={mappedPolicy?._id ? `POL-${mappedPolicy._id.substring(18).toUpperCase()}` : (mappedPolicy?.policyId || "POL-2024-DPSF-001")}
              isBookmarked={isBookmarked}
              onBookmarkToggle={handleBookmarkToggle}
              onDownloadPDF={handleDownloadPDF}
            />

            {/* Approval Workflow Panel (Visible to Admins/Managers) */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col space-y-4">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-2">Manager Review</h3>
              
              <div className="flex flex-col space-y-2">
                <label className="text-xs font-semibold text-slate-500">Review Comments</label>
                <textarea 
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#0052cc] focus:border-transparent transition-all outline-none resize-none"
                  rows="3"
                  placeholder="Enter comments before approving or rejecting..."
                ></textarea>
              </div>

              <div className="flex flex-col gap-3 pt-2">
                <button className="w-full py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-bold rounded-xl transition-colors shadow-sm">
                  Approve Policy
                </button>
                <button className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-xl transition-colors shadow-sm">
                  Reject Policy
                </button>
                <button className="w-full py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 text-sm font-bold rounded-xl transition-colors">
                  Submit for Review
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Related Policies Section */}
        <div className="pt-4 border-t border-slate-300">
          <RelatedPolicies relatedList={mappedPolicy?.relatedList} />
        </div>

      </div>

      {/* Footer */}
      <Footer />

    </div>
  );
};

export default PolicyDetailsPage;
