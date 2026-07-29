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

          {/* Right Column - Quick Actions (1/3 width) */}
          <div className="lg:col-span-1 space-y-4">
            <QuickActionPanel 
              policyId={mappedPolicy?._id ? `POL-${mappedPolicy._id.substring(18).toUpperCase()}` : (mappedPolicy?.policyId || "POL-2024-DPSF-001")}
              isBookmarked={isBookmarked}
              onBookmarkToggle={handleBookmarkToggle}
              onDownloadPDF={handleDownloadPDF}
            />
            {mappedPolicy?._id && (
              <button 
                onClick={async () => {
                  try {
                    const response = await fetch(`http://localhost:3000/api/policies/${mappedPolicy._id}/submit`, {
                      method: 'PATCH',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ comments: 'Approved via UI' })
                    });
                    if (response.ok) {
                      alert('Policy successfully submitted for approval to backend!');
                    } else {
                      alert('Failed to submit policy to backend.');
                    }
                  } catch (e) {
                    alert('Error hitting backend approval endpoint.');
                  }
                }}
                className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow-lg transition-colors"
              >
                Submit for Approval
              </button>
            )}
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
