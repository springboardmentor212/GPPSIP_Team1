import React, { useState, useEffect } from 'react';
import SchemesHeader from '../../components/common/SchemesHeader';
import FilterBar from '../../components/common/FilterBar';
import CategoryTabs from '../../components/common/CategoryTabs';
import SchemeCard from '../../components/cards/SchemeCard';
import CTASection from '../../components/common/CTASection';
import { searchAll } from '../../services/search.service';

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
      const data = await searchAll(searchQuery, activeTab, null, null);
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
  }, [searchQuery, activeTab]); // re-fetch when search or tab changes

  const handleBookmarkToggle = (id) => {
    setBookmarkedIds(prev => 
      prev.includes(id) ? prev.filter(bId => bId !== id) : [...prev, id]
    );
  };

  const handleApply = (title) => {
    alert(`Initiating Application wizard for: "${title}"`);
  };

  const handleToggleSort = () => {
    setSortBy(prev => prev === "Match" ? "Deadline" : "Match");
  };

  // Sort logic (Backend handles filtering now)
  const sortedSchemes = [...schemes].sort((a, b) => {
    if (sortBy === "Match") {
      return 0; // Backend sorting or relevance
    } else {
      return a.title.localeCompare(b.title);
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
                ministry={scheme.category}
                eligibilityTag="Eligible"
                matchPercentage={100}
                description={scheme.description}
                maxBenefit={scheme.eligibilityRules?.income?.max ? `Income Limit: ${scheme.eligibilityRules.income.max}` : 'Direct Aid'}
                deadline="Rolling"
                tags={[scheme.category]}
                isBookmarked={bookmarkedIds.includes(scheme._id || scheme.id)}
                onBookmarkToggle={() => handleBookmarkToggle(scheme._id || scheme.id)}
                onApply={() => handleApply(scheme.title)}
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
