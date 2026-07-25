import React, { useState, useEffect } from 'react';
import SchemesHeader from '../../components/common/SchemesHeader';
import FilterBar from '../../components/common/FilterBar';
import CategoryTabs from '../../components/common/CategoryTabs';
import SchemeCard from '../../components/cards/SchemeCard';
import CTASection from '../../components/common/CTASection';
import { getSchemes } from '../../services/scheme.service';

// Dynamic helper mapping backend category enum to official Indian ministries
const getMinistryForCategory = (category) => {
  switch (category) {
    case 'Scholarships':
    case 'Student Schemes':
      return 'Ministry of Education';
    case 'Farmer Welfare':
      return 'Ministry of Agriculture & Farmers Welfare';
    case 'Healthcare':
      return 'Ministry of Health & Family Welfare';
    case 'Housing':
      return 'Ministry of Housing & Urban Affairs';
    case 'Business Support':
      return 'Ministry of Commerce & Industry';
    case 'Women Empowerment':
      return 'Ministry of Women & Child Development';
    case 'Senior Citizen Welfare':
    case 'Social Security':
      return 'Ministry of Social Justice & Empowerment';
    case 'Employment Programs':
      return 'Ministry of Labour & Employment';
    default:
      return 'Ministry of Social Justice & Empowerment';
  }
};

// Dynamic helper mapping backend category enum to benefits
const getBenefitForCategory = (category) => {
  switch (category) {
    case 'Scholarships':
      return '₹50,000 Grants';
    case 'Farmer Welfare':
      return '₹6,000/year Support';
    case 'Healthcare':
      return '₹5 Lakhs Cover';
    case 'Housing':
      return '₹2.5 Lakhs Subsidy';
    case 'Business Support':
      return 'Up to ₹10 Lakhs Loan';
    case 'Women Empowerment':
      return '₹1.2 Lakhs Direct Benefit';
    case 'Senior Citizen Welfare':
      return '₹1,500/month Pension';
    case 'Student Schemes':
      return 'Laptop & Fee Waiver';
    case 'Employment Programs':
      return '₹3,000/month stipend';
    case 'Social Security':
      return 'Life Insurance Cover';
    default:
      return 'Direct Financial Aid';
  }
};

// Dynamic helper mapping backend category enum to tag arrays
const getTagsForCategory = (category) => {
  switch (category) {
    case 'Scholarships':
    case 'Student Schemes':
      return ['STUDENT', 'EDU'];
    case 'Farmer Welfare':
      return ['AGRI', 'RURAL'];
    case 'Healthcare':
      return ['MED', 'HEALTH'];
    case 'Housing':
      return ['HOME', 'URBAN'];
    case 'Business Support':
      return ['MSME', 'FIN'];
    case 'Women Empowerment':
      return ['WOMEN', 'SOCIAL'];
    case 'Senior Citizen Welfare':
      return ['PENSION', 'SENIOR'];
    case 'Employment Programs':
      return ['JOBS', 'SKILLS'];
    case 'Social Security':
      return ['SAFETY', 'SECURE'];
    default:
      return ['GOVT', 'SCHEME'];
  }
};

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

  const handleApply = (title) => {
    alert(`Initiating Application wizard for: "${title}"`);
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
      const ministry = getMinistryForCategory(scheme.category);
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
      // Deterministic pseudo-match percentage for realism based on title character length
      const matchA = (a.title.length % 15) + 80;
      const matchB = (b.title.length % 15) + 80;
      return matchB - matchA;
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
                ministry={getMinistryForCategory(scheme.category)}
                eligibilityTag="Eligible"
                matchPercentage={(scheme.title.length % 15) + 80}
                description={scheme.description}
                maxBenefit={getBenefitForCategory(scheme.category)}
                deadline="Rolling"
                tags={getTagsForCategory(scheme.category)}
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
