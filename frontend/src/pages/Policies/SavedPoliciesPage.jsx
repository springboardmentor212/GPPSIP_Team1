import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import FilterButton from '../../components/common/FilterButton';
import ExportButton from '../../components/common/ExportButton';
import SavedPolicyGrid from './SavedPolicyGrid';
import BookmarkActivity from './BookmarkActivity';
import Footer from '../../components/layout/Footer';
import { getSavedPolicies, removeSavedPolicy } from '../../services/savedPolicy.service';
import { getSavedSchemes, removeSavedScheme } from '../../services/savedScheme.service';
import { useToast } from '../../hooks/useToast';
import { FaBalanceScale } from 'react-icons/fa';

const SavedPoliciesPage = ({ setActiveTab, setSelectedPolicy, setSelectedScheme }) => {
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [savedList, setSavedList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [policiesData, schemesData] = await Promise.all([
          getSavedPolicies().catch(() => ({ success: false, policies: [] })),
          getSavedSchemes().catch(() => ({ success: false, schemes: [] }))
        ]);

        let combined = [];
        
        if (policiesData.success) {
          const policies = policiesData.policies.map(p => ({
            id: p._id,
            type: 'policy',
            title: p.title,
            category: p.category,
            description: p.description,
            lastViewed: new Date().toLocaleDateString(),
            bookmarkStatus: "Active",
            ministry: p.department || p.category,
            publishedDate: new Date(p.createdAt).toLocaleDateString(),
            lastReview: new Date(p.updatedAt).toLocaleDateString(),
            status: p.status,
            objectives: [], 
            eligibility: {
              applicableEntities: "All citizens",
              exceptions: "None"
            },
            documents: [],
            relatedList: []
          }));
          combined = [...combined, ...policies];
        }

        if (schemesData.success) {
          const schemes = (schemesData.schemes || []).map(s => ({
            id: s._id,
            type: 'scheme',
            title: s.title || s.name,
            category: s.category,
            description: s.description,
            lastViewed: new Date().toLocaleDateString(),
            bookmarkStatus: "Active",
            ministry: s.ministry || s.category,
            publishedDate: new Date(s.createdAt || Date.now()).toLocaleDateString(),
            lastReview: new Date(s.updatedAt || Date.now()).toLocaleDateString(),
            status: s.status,
            objectives: [], 
            eligibility: s.eligibility || {},
            documents: [],
            relatedList: []
          }));
          combined = [...combined, ...schemes];
        }

        setSavedList(combined);
      } catch (error) {
        console.error("Failed to fetch saved items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const [activities, setActivities] = useState([]);

  const [categoryFilter, setCategoryFilter] = useState("All");

  const handleQuickOpen = (item) => {
    if (item.type === 'scheme') {
      navigate(`/scheme/${item.id}`);
    } else {
      setSelectedPolicy(item);
      setActiveTab('policy-details');
    }
  };

  const handleRemove = async (item) => {
    try {
      if (item.type === 'scheme') {
        await removeSavedScheme(item.id);
      } else {
        await removeSavedPolicy(item.id);
      }
      setSavedList(prev => prev.filter(p => p.id !== item.id));
    } catch (error) {
      console.error("Failed to remove saved item:", error);
      addToast("Failed to remove item. Please try again.", 'error');
    }
  };

  const handleClearHistory = () => {
    setActivities([]);
  };

  const handleCompare = (activity) => {
    addToast(`Comparing original policy draft with update for: "${activity.message.split(":")[1].split("has")[0].trim()}"`, 'info');
  };

  const handleToggleFilter = () => {
    const categories = ["All", "Education", "Healthcare", "Agriculture", "Employment", "Finance", "Women & Child Welfare", "Housing", "Environment", "Digital Governance", "Infrastructure"];
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
          <button
            onClick={() => setActiveTab('compare')}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-extrabold flex items-center gap-2 shadow-sm transition-colors cursor-pointer border-none"
          >
            <FaBalanceScale className="text-[#0052cc]" /> Compare
          </button>
          <FilterButton onClick={handleToggleFilter} />
          <ExportButton onClick={() => addToast(`Exporting ${filteredList.length} bookmarked policies...`, 'info')} />
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
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#0052cc]"></div>
            <p className="mt-4 text-slate-500 font-medium">Loading saved policies...</p>
          </div>
        ) : (
          <SavedPolicyGrid
            savedList={filteredList}
            onQuickOpen={handleQuickOpen}
            onRemove={handleRemove}
            onBrowse={() => setActiveTab('search')}
          />
        )}
      </div>

      {/* Recent Activity Section (Hidden for now as requested) */}
      {/* 
      <BookmarkActivity
        activities={activities}
        onClearHistory={handleClearHistory}
        onCompare={handleCompare}
      /> 
      */}

      {/* Footer Branding Links */}
      <Footer />

    </div>
  );
};

export default SavedPoliciesPage;
