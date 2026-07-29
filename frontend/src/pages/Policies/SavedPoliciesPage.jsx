import React, { useState } from 'react';
import FilterButton from '../../components/common/FilterButton';
import ExportButton from '../../components/common/ExportButton';
import SavedPolicyGrid from './SavedPolicyGrid';
import BookmarkActivity from './BookmarkActivity';
import Footer from '../../components/layout/Footer';

const SavedPoliciesPage = ({ setActiveTab, setSelectedPolicy }) => {
  const [savedList, setSavedList] = useState([
    {
      id: 101,
      title: "Public Health Emergency Preparedness Act 2024",
      category: "Healthcare Policy",
      description: "Comprehensive framework for federal response to large-scale health crises, focusing on supply chains and infrastructure.",
      lastViewed: "Oct 12, 2023",
      bookmarkStatus: "Active",
      ministry: "Ministry of Health & Family Welfare",
      publishedDate: "05 Jan 2024",
      lastReview: "10 Oct 2023",
      status: "Active",
      objectives: [
        "Strengthen inter-state disease surveillance channels.",
        "Facilitate emergency medical supplies buffer creation.",
        "Authorize quick emergency fund disbursals to state ministries."
      ],
      eligibility: {
        applicableEntities: "All hospitals, local health departments, and critical supply manufacturers.",
        exceptions: "General practitioners and domestic care providers."
      },
      documents: [
        { name: "PHEPA Official Gazette.pdf", size: "3.4 MB" },
        { name: "Emergency Action Checklist.pdf", size: "1.2 MB" }
      ],
      relatedList: [
        { id: 102, title: "Smart City Infrastructure Subsidies (v2.1)", category: "Urban Planning" }
      ]
    },
    {
      id: 102,
      title: "Smart City Infrastructure Subsidies (v2.1)",
      category: "Urban Planning",
      description: "Revised guidelines for municipal grant applications regarding IoT-enabled traffic management and sustainable waste disposal.",
      lastViewed: "Oct 18, 2023",
      bookmarkStatus: "Active",
      ministry: "Ministry of Urban Development",
      publishedDate: "15 Feb 2024",
      lastReview: "18 Oct 2023",
      status: "Active",
      objectives: [
        "Enable IoT-integrated municipal traffic management control rooms.",
        "Upgrade decentralized urban composting and recycling centers.",
        "Provide direct grants for high-efficiency LED smart streetlights."
      ],
      eligibility: {
        applicableEntities: "Tier-1 and Tier-2 municipal bodies and local development authorities.",
        exceptions: "Private gated community developers."
      },
      documents: [
        { name: "Smart City Subsidy Rules.pdf", size: "2.1 MB" }
      ],
      relatedList: [
        { id: 103, title: "Zero-Emission Transport Incentive Scheme", category: "Climate Action" }
      ]
    },
    {
      id: 103,
      title: "Zero-Emission Transport Incentive Scheme",
      category: "Climate Action",
      description: "Tax rebate structures for commercial fleet operators transitioning to electric or hydrogen-powered heavy-duty vehicles.",
      lastViewed: "2 days ago",
      bookmarkStatus: "Active",
      ministry: "Ministry of Environment, Forest and Climate Change",
      publishedDate: "20 Mar 2024",
      lastReview: "18 Mar 2024",
      status: "Active",
      objectives: [
        "Incentivize bulk purchasing of electric heavy cargo vehicles.",
        "Offer 40% commercial tax rebate for hydrogen-cell fleet operators.",
        "Fund corridor charging networks on national highways."
      ],
      eligibility: {
        applicableEntities: "Registered commercial transport businesses and fleet operators.",
        exceptions: "Private personal passenger vehicle owners."
      },
      documents: [
        { name: "ZETIS Subsidy Guidelines.pdf", size: "4.8 MB" }
      ],
      relatedList: [
        { id: 102, title: "Smart City Infrastructure Subsidies (v2.1)", category: "Urban Planning" }
      ]
    },
    {
      id: 104,
      title: "Cross-Border Data Localization Act",
      category: "Digital Sovereignty",
      description: "Drafting requirements for local data residency for essential service providers and critical infrastructure entities.",
      lastViewed: "4 days ago",
      bookmarkStatus: "Active",
      ministry: "Ministry of Electronics & Information Technology",
      publishedDate: "05 Apr 2024",
      lastReview: "01 Apr 2024",
      status: "Active",
      objectives: [
        "Ensure payment transaction logs are stored exclusively in local servers.",
        "Impose localization mandates on healthcare and demographic providers.",
        "Establish audit checks by cyber-security emergency response teams."
      ],
      eligibility: {
        applicableEntities: "Multinational corporations, payment networks, and cloud providers operating in India.",
        exceptions: "Small software providers processing local client data under 5,000 records."
      },
      documents: [
        { name: "Data Localization Mandates.pdf", size: "2.8 MB" }
      ],
      relatedList: [
        { id: 105, title: "Universal Early Childhood Education Grants", category: "Social Welfare" }
      ]
    },
    {
      id: 105,
      title: "Universal Early Childhood Education Grants",
      category: "Social Welfare",
      description: "Eligibility criteria for non-profit education providers seeking federal funding to establish low-income preschools.",
      lastViewed: "1 week ago",
      bookmarkStatus: "Active",
      ministry: "Ministry of Education",
      publishedDate: "12 May 2024",
      lastReview: "10 May 2024",
      status: "Active",
      objectives: [
        "Establish preschool infrastructure grants for registered NGOs.",
        "Provide standardized early learning teacher salaries.",
        "Fund school feeding programs for preschool segments."
      ],
      eligibility: {
        applicableEntities: "Registered charity trusts, non-profit institutions, and NGO networks.",
        exceptions: "Private for-profit premium pre-schools."
      },
      documents: [
        { name: "UCEG Grant Application.pdf", size: "1.9 MB" }
      ],
      relatedList: [
        { id: 101, title: "Public Health Emergency Preparedness Act 2024", category: "Healthcare Policy" }
      ]
    }
  ]);

  const [activities, setActivities] = useState([
    {
      id: 1,
      type: "update",
      message: "New version available: Public Health Emergency Preparedness Act 2024 has been updated.",
      time: "2 hours ago"
    },
    {
      id: 2,
      type: "share",
      message: "You shared \"Smart City Infrastructure Subsidies\" with Internal Planning Team.",
      time: "Yesterday, 4:30 PM"
    }
  ]);

  const [categoryFilter, setCategoryFilter] = useState("All");

  const handleQuickOpen = (policy) => {
    setSelectedPolicy(policy);
    setActiveTab('details');
  };

  const handleRemove = (id) => {
    setSavedList(prev => prev.filter(p => p.id !== id));
  };

  const handleClearHistory = () => {
    setActivities([]);
  };

  const handleCompare = (activity) => {
    alert(`Comparing original policy draft with update for: "${activity.message.split(":")[1].split("has")[0].trim()}"`);
  };

  const handleToggleFilter = () => {
    const categories = ["All", "Healthcare Policy", "Urban Planning", "Climate Action", "Digital Sovereignty", "Social Welfare"];
    const nextIdx = (categories.indexOf(categoryFilter) + 1) % categories.length;
    setCategoryFilter(categories[nextIdx]);
  };

  // Filter grid items
  const filteredList = savedList.filter(item => {
    if (categoryFilter === "All") return true;
    return item.category === categoryFilter;
  });

  return (
    <div className="w-full space-y-8 select-none">
      

      {/* Page Header (Breadcrumbs, Title, Subtitle, Actions) */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 text-left">
        <div className="space-y-2">
          {/* Breadcrumb */}
          <div className="text-[10px] sm:text-xs text-slate-450 font-bold uppercase tracking-wider">
            Dashboard &gt; <span className="text-slate-600 font-extrabold">Saved Policies</span>
          </div>
          {/* Title */}
          <h1 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight leading-none">
            Saved Policies
          </h1>
          {/* Subtitle */}
          <p className="text-xs sm:text-sm text-slate-500 font-light max-w-xl leading-relaxed">
            Access your bookmarked legal frameworks and government schemes. Review updates or continue your analysis where you left off.
          </p>
        </div>

        {/* Top Action Buttons */}
        <div className="flex items-center gap-3 shrink-0 self-start md:self-auto">
          <FilterButton onClick={handleToggleFilter} />
          <ExportButton onClick={() => alert(`Exporting ${filteredList.length} bookmarked policies...`)} />
        </div>
      </div>

      {/* Grid of Saved Cards */}
      <div className="space-y-4">
        {categoryFilter !== "All" && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-450 font-bold">Active Filter:</span>
            <span className="px-2.5 py-0.5 bg-blue-50 text-[#0052cc] border border-blue-150 rounded-lg text-[10px] font-black uppercase">
              {categoryFilter}
            </span>
            <button 
              onClick={() => setCategoryFilter("All")}
              className="text-[10px] font-extrabold text-[#0052cc] hover:underline cursor-pointer"
            >
              Clear
            </button>
          </div>
        )}
        <SavedPolicyGrid 
          savedList={filteredList}
          onQuickOpen={handleQuickOpen}
          onRemove={handleRemove}
          onBrowse={() => setActiveTab('search')}
        />
      </div>

      {/* Recent Activity Section */}
      <BookmarkActivity 
        activities={activities}
        onClearHistory={handleClearHistory}
        onCompare={handleCompare}
      />

      {/* Footer Branding Links */}
      <Footer />

    </div>
  );
};

export default SavedPoliciesPage;
