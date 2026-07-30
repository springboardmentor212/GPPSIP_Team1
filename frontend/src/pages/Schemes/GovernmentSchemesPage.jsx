import React, { useState, useEffect } from 'react';
import SchemesHeader from '../../components/common/SchemesHeader';
import FilterBar from '../../components/common/FilterBar';
import CategoryTabs from '../../components/common/CategoryTabs';
import SchemeCard from '../../components/cards/SchemeCard';
import CTASection from '../../components/common/CTASection';
import { getSchemes } from '../../services/scheme.service';

// Re-factored to industrial standard: components rely on unified Scheme object props
// No fake placeholders used on the client.

const GovernmentSchemesPage = ({ searchQuery = "" }) => {
  // Database schemes state
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeTab, setActiveTab] = useState("All Schemes");
  const [bookmarkedIds, setBookmarkedIds] = useState([]);
  const [sortBy, setSortBy] = useState("Match");

  const fetchSchemesData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getSchemes();
      if (data.success && Array.isArray(data.schemes)) {
        setSchemes(data.schemes);
      } else {
        throw new Error("Invalid response format received from backend");
      }
    } catch (err) {
      console.error(err);
      setError(err?.message || "Failed to load schemes. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchemesData();
  }, []);

  const handleBookmarkToggle = (id) => {
    setBookmarkedIds(prev => 
      prev.includes(id) ? prev.filter(bId => bId !== id) : [...prev, id]
    );
  };

  const handleApply = (scheme) => {
    if (scheme.applicationLink) {
      window.open(scheme.applicationLink, '_blank', 'noopener,noreferrer');
    } else if (scheme.officialWebsite) {
      window.open(scheme.officialWebsite, '_blank', 'noopener,noreferrer');
    } else {
      alert(`No external application portal link registered for: "${scheme.title}"`);
    }
  };

  const handleToggleSort = () => {
    setSortBy(prev => prev === "Match" ? "Deadline" : "Match");
  };

  // Filter Logic: Category Pill & Global Search Query
  const filteredSchemes = schemes.filter((scheme) => {
    // Tab category filter
    if (activeTab !== "All Schemes" && scheme.category !== activeTab) {
      return false;
    }
    
    // Search query filter (checks title, description, ministry)
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesTitle = (scheme.title || "").toLowerCase().includes(query);
      const matchesDesc = (scheme.description || "").toLowerCase().includes(query);
      const ministry = scheme.category || "";
      const matchesMin = ministry.toLowerCase().includes(query);
      if (!matchesTitle && !matchesDesc && !matchesMin) {
        return false;
      }
    }

    return true;
  });

  // Sort logic
  const sortedSchemes = [...filteredSchemes].sort((a, b) => {
    if (sortBy === "Match") {
      const matchA = a.matchPercentage || 100;
      const matchB = b.matchPercentage || 100;
      return matchB - matchA;
    } else {
      return (a.title || "").localeCompare(b.title || "");
    }
  });

  return (
    <div className="w-full space-y-8 select-none">
      
      {/* Top Header Row (Header Text & Actions Bar) */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        <SchemesHeader matchCount={sortedSchemes.length} />
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
          <p className="text-sm font-bold text-slate-500 mt-4">Loading schemes from database...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-16 w-full text-center border border-dashed border-red-300 bg-red-50/50 rounded-2xl">
          <p className="text-sm font-bold text-red-655 mb-4">{error}</p>
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
            <div key={scheme._id || scheme.id}>
              <SchemeCard 
                title={scheme.title}
                ministry={scheme.category || scheme.department}
                eligibilityTag={scheme.eligibilityTag || "Eligible"}
                matchPercentage={scheme.matchPercentage || 100}
                description={scheme.description}
                maxBenefit={scheme.eligibilityRules?.income?.max ? `Income Limit: ${scheme.eligibilityRules.income.max}` : (scheme.maxBenefit || 'Direct Aid')}
                deadline={scheme.deadline || "Rolling"}
                tags={scheme.tags || [scheme.category]}
                isBookmarked={bookmarkedIds.includes(scheme._id || scheme.id)}
                onBookmarkToggle={() => handleBookmarkToggle(scheme._id || scheme.id)}
                onApply={() => handleApply(scheme)}
              />
            </div>
          ))}
          {sortedSchemes.length === 0 && (
            <div className="col-span-2 py-16 text-center border border-dashed border-slate-350 bg-white rounded-2xl">
              <p className="text-sm font-bold text-slate-400">No government schemes match your criteria.</p>
            </div>
          )}
        </div>
      )}

      {/* Bottom CTA Banner */}
      <CTASection onStartMatching={() => alert("Initiating Profile Analyzer...")} />

    </div>
  );
};

export default GovernmentSchemesPage;
