import React, { useState } from 'react';
import PolicyHeader from './PolicyHeader';
import PolicyOverview from './PolicyOverview';
import PolicyObjectives from './PolicyObjectives';
import EligibilityCard from './EligibilityCard';
import DocumentGrid from '../../components/common/DocumentGrid';
import QuickActionPanel from '../../components/dashboard/QuickActionPanel';
import RelatedPolicies from './RelatedPolicies';
import Footer from '../../components/layout/Footer';
import { savePolicy, removeSavedPolicy, checkSavedPolicy } from '../../services/savedPolicy.service';

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

  React.useEffect(() => {
    if (mappedPolicy?._id) {
      checkSavedPolicy(mappedPolicy._id).then(res => {
        if (res.success) setIsBookmarked(res.isSaved);
      }).catch(err => console.error("Failed to check saved status:", err));
    }
  }, [mappedPolicy?._id]);

  const handleBookmarkToggle = async () => {
    if (!mappedPolicy?._id) return;
    try {
      if (isBookmarked) {
        await removeSavedPolicy(mappedPolicy._id);
        setIsBookmarked(false);
      } else {
        await savePolicy(mappedPolicy._id);
        setIsBookmarked(true);
      }
    } catch (error) {
      console.error("Failed to toggle bookmark:", error);
      alert("Failed to update bookmark status.");
    }
  };

  const handleDownloadPDF = () => {
    if (mappedPolicy?.documents?.length > 0) {
      alert(`Downloading official document for: ${mappedPolicy.title}`);
    } else {
      alert("No official PDF available for this policy.");
    }
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
              policyId={mappedPolicy?._id ? `POL-${(mappedPolicy._id || '').slice(-6).toUpperCase()}` : "UNKNOWN"}
              isBookmarked={isBookmarked}
              onBookmarkToggle={handleBookmarkToggle}
              onDownloadPDF={handleDownloadPDF}
            />
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
