import React, { useState } from 'react';
import SchemesHeader from './SchemesHeader';
import FilterBar from './FilterBar';
import CategoryTabs from './CategoryTabs';
import SchemeCard from './SchemeCard';
import CTASection from './CTASection';

const GovernmentSchemesPage = ({ searchQuery = "" }) => {
  const initialSchemes = [
    {
      id: 201,
      title: "MSME Digital Credit Facilitation",
      ministry: "Ministry of Finance",
      eligibilityTag: "Eligible",
      matchPercentage: null,
      description: "Providing low-interest credit and digital infrastructure support to emerging small and medium enterprises in...",
      maxBenefit: "$50,000 Grants",
      deadline: "Oct 24, 2024",
      category: "Small Business (MSME)",
      tags: ["IT", "FIN", "+3"]
    },
    {
      id: 202,
      title: "Green Tech Innovation Subsidy",
      ministry: "Ministry of Environment & Climate Change",
      eligibilityTag: null,
      matchPercentage: 98,
      description: "Funding for startups and research labs focused on decarbonization technologies and carbon capture...",
      maxBenefit: "Tax Relief (40%)",
      deadline: "Dec 15, 2024",
      category: "Sustainable Energy",
      tags: ["R&D", "SOLAR"]
    },
    {
      id: 203,
      title: "Cybersecurity Talent Pipeline",
      ministry: "Department of National Security",
      eligibilityTag: "Eligible",
      matchPercentage: null,
      description: "Scholarships and placement programs for graduate students specializing in defense-grade cybersecurity...",
      maxBenefit: "Full Tuition",
      deadline: "Aug 01, 2024",
      category: "Education & Research",
      tags: ["GRADUATE", "TECH"]
    },
    {
      id: 204,
      title: "Bio-Manufacturing Hub Grant",
      ministry: "Ministry of Science & Industry",
      eligibilityTag: null,
      matchPercentage: 76,
      description: "Capital investment for the establishment of high-throughput bio-manufacturing facilities in identified...",
      maxBenefit: "$1.2M CapEx",
      deadline: "Rolling",
      category: "Technology",
      tags: ["SCIENCE", "JOBS"]
    },
    {
      id: 205,
      title: "National Smart City Grid Expansion",
      ministry: "Ministry of Urban Development",
      eligibilityTag: "Eligible",
      matchPercentage: 90,
      description: "Funding support for municipality-level grid integration and local sustainable power infrastructure expansions.",
      maxBenefit: "$2.5M Budget",
      deadline: "Nov 30, 2024",
      category: "Infrastructure",
      tags: ["GRID", "POWER"]
    },
    {
      id: 206,
      title: "Rural Telemedicine Network Grant",
      ministry: "Ministry of Health & Family Welfare",
      eligibilityTag: "Eligible",
      matchPercentage: 85,
      description: "Subsidies for clinic infrastructure and high-speed satellite internet enablement in Tier-3 rural locations.",
      maxBenefit: "₹25 Lakhs Support",
      deadline: "Jan 10, 2025",
      category: "Healthcare",
      tags: ["MED", "RURAL"]
    }
  ];

  const [activeTab, setActiveTab] = useState("All Schemes");
  const [bookmarkedIds, setBookmarkedIds] = useState([]);
  const [sortBy, setSortBy] = useState("Match");

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
  const filteredSchemes = initialSchemes.filter((scheme) => {
    // Tab category filter
    if (activeTab !== "All Schemes" && scheme.category !== activeTab) {
      return false;
    }
    
    // Search query filter (checks title, description, ministry)
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesTitle = scheme.title.toLowerCase().includes(query);
      const matchesDesc = scheme.description.toLowerCase().includes(query);
      const matchesMin = scheme.ministry.toLowerCase().includes(query);
      if (!matchesTitle && !matchesDesc && !matchesMin) {
        return false;
      }
    }

    return true;
  });

  // Sort logic
  const sortedSchemes = [...filteredSchemes].sort((a, b) => {
    if (sortBy === "Match") {
      // Put highest match percentage first, then eligible items
      const matchA = a.matchPercentage || (a.eligibilityTag ? 85 : 0);
      const matchB = b.matchPercentage || (b.eligibilityTag ? 85 : 0);
      return matchB - matchA;
    } else {
      // Default chronological or alphabetic sort
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        {sortedSchemes.map((scheme) => (
          <div key={scheme.id}>
            <SchemeCard 
              title={scheme.title}
              ministry={scheme.ministry}
              eligibilityTag={scheme.eligibilityTag}
              matchPercentage={scheme.matchPercentage}
              description={scheme.description}
              maxBenefit={scheme.maxBenefit}
              deadline={scheme.deadline}
              tags={scheme.tags}
              isBookmarked={bookmarkedIds.includes(scheme.id)}
              onBookmarkToggle={() => handleBookmarkToggle(scheme.id)}
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

      {/* Bottom CTA Banner */}
      <CTASection onStartMatching={() => alert("Initiating Profile Analyzer...")} />

    </div>
  );
};

export default GovernmentSchemesPage;
