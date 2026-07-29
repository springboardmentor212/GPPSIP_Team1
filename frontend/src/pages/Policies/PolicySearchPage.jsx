import React, { useState, useEffect } from 'react';
import PolicySearchHeader from '../../components/common/PolicySearchHeader';
import SearchPanel from '../../components/common/SearchPanel';
import PolicyCard from '../../components/cards/PolicyCard';
import EmptyPolicyCard from '../../components/cards/EmptyPolicyCard';
import Pagination from '../../components/common/Pagination';
import { searchAll } from '../../services/search.service';

const PolicySearchPage = ({ onReadMore }) => {
  // State for database policies
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // States for search and filter
  const [searchQuery, setSearchQuery] = useState('');
  const [appliedSearchQuery, setAppliedSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    category: 'All Categories',
    state: 'All States',
    department: 'All Depts',
    ministry: 'All Ministries',
    status: 'Active',
    date: ''
  });
  const [sortBy, setSortBy] = useState('Newest First');
  const [currentPage, setCurrentPage] = useState(1);
  const [bookmarkedIds, setBookmarkedIds] = useState([]);
  
  // Feedback Messages / Toast Alerts
  const [toastMessage, setToastMessage] = useState('');

  const fetchPoliciesData = async () => {
    setLoading(true);
    setError(null);
    try {
      const queryParams = {};
      if (appliedSearchQuery) queryParams.q = appliedSearchQuery;
      if (filters.category !== 'All Categories') queryParams.category = filters.category;
      if (filters.department !== 'All Depts') queryParams.department = filters.department;
      if (filters.state !== 'All States') queryParams.state = filters.state;
      if (filters.ministry !== 'All Ministries') queryParams.ministry = filters.ministry;
      if (filters.status !== 'All Statuses') queryParams.status = filters.status;

      const data = await searchAll(queryParams);
      if (data.success && Array.isArray(data.policies)) {
        setPolicies(data.policies);
      } else {
        throw new Error("Invalid response format received from backend");
      }
    } catch (err) {
      console.error(err);
      setError(err?.message || "Failed to search policies. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch when search/filters change
  useEffect(() => {
    fetchPoliciesData();
  }, [appliedSearchQuery, filters.category, filters.department, filters.status, filters.state, filters.ministry]);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 3000);
  };

  // Handlers
  const handleSearchSubmit = () => {
    setAppliedSearchQuery(searchQuery);
    setCurrentPage(1);
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value
    }));
    setCurrentPage(1);
  };

  const handleBookmarkToggle = (policyId) => {
    setBookmarkedIds((prev) => {
      const isBookmarked = prev.includes(policyId);
      if (isBookmarked) {
        triggerToast(`Removed policy ${policyId} from bookmarks`);
        return prev.filter(id => id !== policyId);
      } else {
        triggerToast(`Saved policy ${policyId} to bookmarks`);
        return [...prev, policyId];
      }
    });
  };

  const handleShare = (policyId, title) => {
    navigator.clipboard.writeText(`http://localhost:5173/policy/${policyId}`);
    triggerToast(`Copied share link for "${title}" to clipboard!`);
  };

  const handleRequestDigitization = () => {
    triggerToast("Your request for policy digitization has been successfully registered!");
  };

  const handleReadMore = (policy) => {
    if (onReadMore) {
      onReadMore(policy);
    } else {
      triggerToast(`Opening details for "${policy.title}"`);
    }
  };

  // Filter & Sort Logic (Server handles Search, Category, Department, Status, State, Ministry)
  const filteredPolicies = policies.filter((policy) => {
    // 3. Date filter (Client-side fallback)
    const policyDateStr = policy.createdAt ? new Date(policy.createdAt).toISOString().split('T')[0] : '';
    if (filters.date && policyDateStr !== filters.date) {
      return false;
    }
    return true;
  });

  // Sort list
  const sortedPolicies = [...filteredPolicies].sort((a, b) => {
    const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
    const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
    if (sortBy === 'Newest First') {
      return dateB - dateA;
    } else {
      return dateA - dateB;
    }
  });

  // Pagination bounds
  const resultsPerPage = 12;
  const totalResults = sortedPolicies.length;
  const totalPages = Math.max(Math.ceil(totalResults / resultsPerPage), 1);

  const paginatedPolicies = sortedPolicies.slice(
    (currentPage - 1) * resultsPerPage,
    currentPage * resultsPerPage
  );

  return (
    <div className="relative w-full pb-8 select-none">
      
      {/* Toast Alert popup */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-slate-900 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg z-50 animate-bounce duration-300">
          {toastMessage}
        </div>
      )}

      {/* Header */}
      <PolicySearchHeader />

      {/* Search and Filters Panel */}
      <SearchPanel 
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        onSearchSubmit={handleSearchSubmit}
        filters={filters}
        onFilterChange={handleFilterChange}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      {/* Policies Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 w-full bg-white border border-slate-300 rounded-2xl">
          <div className="w-12 h-12 border-4 border-[#0052cc] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-bold text-slate-500 mt-4">Loading policies from database...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-16 w-full text-center border border-dashed border-red-300 bg-red-50/50 rounded-2xl">
          <p className="text-sm font-bold text-red-650 mb-4">{error}</p>
          <button 
            onClick={fetchPoliciesData}
            className="px-5 py-2.5 bg-[#0052cc] hover:bg-[#0047b3] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
          >
            Retry Connection
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {paginatedPolicies.map((policy) => (
            <div key={policy._id || policy.id}>
              <PolicyCard 
                category={policy.category}
                policyId={policy._id ? `POL-${policy._id.substring(18).toUpperCase()}` : (policy.policyId || "POL-2024")}
                title={policy.title}
                department={policy.department}
                location={policy.location || "Federal"}
                publishedDate={policy.createdAt ? new Date(policy.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : "N/A"}
                description={policy.description}
                isBookmarked={bookmarkedIds.includes(policy._id || policy.policyId)}
                onBookmarkToggle={() => handleBookmarkToggle(policy._id || policy.policyId)}
                onReadMore={() => handleReadMore(policy)}
                onShare={() => handleShare(policy._id || policy.policyId, policy.title)}
              />
            </div>
          ))}
          
          {/* Dotted border digitization card (Always appended at the end of results) */}
          <div>
            <EmptyPolicyCard onRequestDigitization={handleRequestDigitization} />
          </div>
        </div>
      )}

      {/* Bottom Pagination controls */}
      {!loading && !error && (
        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          totalResults={totalResults}
          resultsPerPage={resultsPerPage}
          onPageChange={setCurrentPage}
        />
      )}

    </div>
  );
};

export default PolicySearchPage;

