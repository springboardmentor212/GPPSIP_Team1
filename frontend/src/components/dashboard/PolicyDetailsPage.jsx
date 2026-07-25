import React, { useState } from 'react';
import PolicyHeader from './PolicyHeader';
import PolicyOverview from './PolicyOverview';
import PolicyObjectives from './PolicyObjectives';
import EligibilityCard from './EligibilityCard';
import DocumentGrid from './DocumentGrid';
import QuickActionPanel from './QuickActionPanel';
import RelatedPolicies from './RelatedPolicies';
import Footer from './Footer';

const PolicyDetailsPage = ({ policy, onBack }) => {
  // Setup local bookmark state linked to the policy ID
  const [isBookmarked, setIsBookmarked] = useState(false);

  const handleBookmarkToggle = () => {
    setIsBookmarked(!isBookmarked);
  };

  const handleDownloadPDF = () => {
    alert(`Downloading official PDF for: ${policy?.title || "Comprehensive Data Privacy & Security Framework (DPSF) 2024"}`);
  };

  return (
    <div className="relative w-full min-h-screen bg-slate-50/30 flex flex-col justify-between">
      
      {/* Main Page Layout Wrapper */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 flex-grow">
        
        {/* Policy Header (includes Breadcrumb, main card info and AI Insights) */}
        <PolicyHeader policy={policy} onBack={onBack} />

        {/* 2-Column Grid for Details & Quick Action Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Left Column - Main Details (2/3 width) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Overview */}
            <PolicyOverview description={policy?.description} />

            {/* Objectives */}
            <PolicyObjectives objectives={policy?.objectives} />

            {/* Eligibility & Scope */}
            <EligibilityCard eligibility={policy?.eligibility} />

            {/* Required Documents */}
            <DocumentGrid documents={policy?.documents} />
          </div>

          {/* Right Column - Quick Actions (1/3 width) */}
          <div className="lg:col-span-1">
            <QuickActionPanel 
              policyId={policy?.policyId || "POL-2024-DPSF-001"}
              isBookmarked={isBookmarked}
              onBookmarkToggle={handleBookmarkToggle}
              onDownloadPDF={handleDownloadPDF}
            />
          </div>

        </div>

        {/* Related Policies Section */}
        <div className="pt-4 border-t border-slate-300">
          <RelatedPolicies relatedList={policy?.relatedList} />
        </div>

      </div>

      {/* Footer */}
      <Footer />

    </div>
  );
};

export default PolicyDetailsPage;
