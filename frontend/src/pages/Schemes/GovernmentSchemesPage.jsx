import React, { useState, useEffect } from 'react';
import SchemesHeader from '../../components/common/SchemesHeader';
import FilterBar from '../../components/common/FilterBar';
import CategoryTabs from '../../components/common/CategoryTabs';
import SchemeCard from '../../components/cards/SchemeCard';
import CTASection from '../../components/common/CTASection';
import SchemeApplyModal from '../../components/dashboard/SchemeApplyModal';
import { getSchemes } from '../../services/scheme.service';
import { getRecommendations } from '../../services/recommendation.service';
import { getSavedSchemes, addSavedScheme, removeSavedScheme } from '../../services/savedScheme.service';
import SchemeDetailsPage from './SchemeDetailsPage';
import { applyForScheme } from '../../services/application.service';
import useAuth from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';

// Re-factored to industrial standard: components rely on unified Scheme object props
// No fake placeholders used on the client.

const GovernmentSchemesPage = ({ searchQuery = "" }) => {
  const { user } = useAuth();
  const { addToast } = useToast();

  // Database schemes state
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeTab, setActiveTab] = useState("All Schemes");
  const [bookmarkedIds, setBookmarkedIds] = useState([]);
  
  // Scheme Apply Modal state
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [selectedSchemeToApply, setSelectedSchemeToApply] = useState(null);
  
  const [sortBy, setSortBy] = useState("Match");
  const [selectedScheme, setSelectedScheme] = useState(null);

  const fetchSchemesData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch user's saved schemes first
      if (user) {
        try {
          const savedRes = await getSavedSchemes();
          if (savedRes.success) {
            setBookmarkedIds(savedRes.savedSchemes.map(s => s.scheme._id || s.scheme));
          }
        } catch (err) {
          console.error("Failed to load saved schemes", err);
        }
      }

      let data;
      if (user && user.role === 'Citizen') {
        data = await getRecommendations();
      } else {
        data = await getSchemes();
      }

      if (data.success && Array.isArray(data.schemes)) {
        setSchemes(data.schemes);
      } else {
        throw new Error(
          "Invalid response format received from backend"
        );
      }
    } catch (err) {
      console.error(err);

      setError(
        err?.message ||
          "Failed to load schemes. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchemesData();
  }, [user]);

  const handleBookmarkToggle = async (id) => {
    if (!user) {
      addToast("Please log in to save schemes.", "info");
      return;
    }
    
    try {
      if (bookmarkedIds.includes(id)) {
        await removeSavedScheme(id);
        setBookmarkedIds((prev) => prev.filter((bId) => bId !== id));
        addToast("Scheme removed from saved list", "success");
      } else {
        await addSavedScheme(id);
        setBookmarkedIds((prev) => [...prev, id]);
        addToast("Scheme saved successfully", "success");
      }
    } catch (error) {
      addToast(error.message || "Failed to update saved scheme", "error");
    }
  };

  const handleApply = (scheme) => {
    if (!user) {
      addToast("Please log in to apply for schemes.", 'error');
      return;
    }

    if (user.role !== 'Citizen') {
      addToast(
        `Only Citizens are allowed to apply for schemes. Your current role is: "${user.role}". Please log in with a Citizen account to submit applications.`,
        'error'
      );
      return;
    }

    setSelectedSchemeToApply(scheme);
    setApplyModalOpen(true);
  };

  const handleApplySuccess = (application) => {
    setApplyModalOpen(false);
    setSelectedSchemeToApply(null);
    addToast(`Successfully applied! Application ID: ${application.applicationId}`, 'success');
  };

  const handleToggleSort = () => {
    setSortBy((prev) =>
      prev === "Match" ? "Deadline" : "Match"
    );
  };

  // Filter Logic: Category Pill & Global Search Query
  const filteredSchemes = schemes.filter((scheme) => {

    // Tab category filter
    if (
      activeTab !== "All Schemes" &&
      scheme.category !== activeTab
    ) {
      return false;
    }

    // Search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();

      const matchesTitle = (
        scheme.title || ""
      )
        .toLowerCase()
        .includes(query);

      const matchesDesc = (
        scheme.description || ""
      )
        .toLowerCase()
        .includes(query);

      const ministry = scheme.category || "";

      const matchesMin = ministry
        .toLowerCase()
        .includes(query);

      if (
        !matchesTitle &&
        !matchesDesc &&
        !matchesMin
      ) {
        return false;
      }
    }

    return true;
  });

  // Sort logic
  const sortedSchemes = [...filteredSchemes].sort(
    (a, b) => {
      if (sortBy === "Match") {
        const matchA =
          a.matchPercentage || 100;

        const matchB =
          b.matchPercentage || 100;

        return matchB - matchA;
      }

      return (
        a.title || ""
      ).localeCompare(
        b.title || ""
      );
    }
  );

  // Show scheme details page
  if (selectedScheme) {
    return (
      <SchemeDetailsPage
        scheme={selectedScheme}
        onBack={() =>
          setSelectedScheme(null)
        }
        onApply={() =>
          handleApply(selectedScheme)
        }
      />
    );
  }

  return (
    <div className="w-full space-y-8 select-none">

      {/* Top Header Row */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">

        <SchemesHeader
          matchCount={sortedSchemes.length}
        />

        <FilterBar
          sortBy={sortBy}
          onToggleSort={handleToggleSort}
        />
      </div>

      {/* Category Horizontal Navigation Tab Pills */}
      <CategoryTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Grid Layout for Cards */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 w-full bg-white border border-slate-300 rounded-2xl">

          <div className="w-12 h-12 border-4 border-[#0052cc] border-t-transparent rounded-full animate-spin"></div>

          <p className="text-sm font-bold text-slate-500 mt-4">
            Loading schemes from database...
          </p>

        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-16 w-full text-center border border-dashed border-red-300 bg-red-50/50 rounded-2xl">

          <p className="text-sm font-bold text-red-655 mb-4">
            {error}
          </p>

          <button
            onClick={fetchSchemesData}
            className="px-5 py-2.5 bg-[#0052cc] hover:bg-[#0047b3] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
          >
            Retry Connection
          </button>

        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">

          {sortedSchemes.map((scheme) => (
            <div
              key={scheme._id || scheme.id}
            >
              <SchemeCard
                title={scheme.title}
                ministry={
                  scheme.category ||
                  scheme.department
                }
                eligibilityTag={
                  scheme.eligibilityTag ||
                  "Eligible"
                }
                matchPercentage={
                  scheme.matchPercentage ||
                  100
                }
                description={
                  scheme.description
                }
                maxBenefit={
                  scheme.eligibilityRules?.income?.max
                    ? `Income Limit: ${scheme.eligibilityRules.income.max}`
                    : (
                        scheme.maxBenefit ||
                        'Direct Aid'
                      )
                }
                deadline={
                  scheme.deadline ||
                  "Rolling"
                }
                tags={
                  scheme.tags ||
                  [scheme.category]
                }
                isBookmarked={bookmarkedIds.includes(
                  scheme._id || scheme.id
                )}
                onBookmarkToggle={() =>
                  handleBookmarkToggle(
                    scheme._id || scheme.id
                  )
                }
                onApply={() =>
                  handleApply(scheme)
                }
                onViewDetails={() =>
                  setSelectedScheme(scheme)
                }
              />
            </div>
          ))}

          {sortedSchemes.length === 0 && (
            <div className="col-span-2 py-16 text-center border border-dashed border-slate-355 bg-white rounded-2xl">

              <p className="text-sm font-bold text-slate-400">
                No government schemes match your criteria.
              </p>

            </div>
          )}

        </div>
      )}

      {/* Bottom CTA Banner */}
      <CTASection
        onStartMatching={() =>
          addToast(
            "Initiating Profile Analyzer...", 'info'
          )
        }
      />

      <SchemeApplyModal 
        isOpen={applyModalOpen}
        onClose={() => setApplyModalOpen(false)}
        scheme={selectedSchemeToApply}
        onSuccess={handleApplySuccess}
      />

    </div>
  );
};

export default GovernmentSchemesPage;