import React, { useState } from 'react';
import PolicySearchHeader from './PolicySearchHeader';
import SearchPanel from './SearchPanel';
import PolicyCard from './PolicyCard';
import EmptyPolicyCard from './EmptyPolicyCard';
import Pagination from './Pagination';

const PolicySearchPage = ({ onReadMore }) => {
  // Mock Data from Figma Mockup
  const initialPolicies = [
    {
      id: 6,
      policyId: "POL-2024-DPSF-001",
      category: "Digital Infrastructure",
      title: "Comprehensive Data Privacy & Security Framework (DPSF) 2024",
      department: "Min. of IT & Communications",
      location: "Federal",
      publishedDate: "Jan 12, 2024",
      lastReview: "March 05, 2024",
      rawDate: "2024-01-12",
      description: "The Comprehensive Data Privacy & Security Framework (DPSF) 2024 establishes a unified standard for how digital personal data is collected, stored, and processed within the jurisdiction. It replaces the fragmented regulations of the previous decade with a modern, high-accountability framework designed to protect citizen rights while fostering innovation in the digital economy.",
      status: "Active",
      ministry: "Min. of IT & Communications",
      aiInsight: "This policy introduces strict 72-hour breach notification rules and mandates local data residency for financial records.",
      objectives: [
        "Ensure individuals have full control over their personal data and clear visibility into its usage.",
        "Mandate robust technical and organizational security measures for organizations handling sensitive information.",
        "Standardize cross-border data transfer protocols to align with international privacy standards."
      ],
      eligibility: {
        applicableEntities: "All government agencies, private corporations, and non-profits processing data of 10,000+",
        exceptions: "Personal use, domestic activities, and law enforcement agencies under specific judicial authorizations."
      },
      documents: [
        { id: 1, name: "Privacy Notice Template" },
        { id: 2, name: "Cyber Security Audit Form" },
        { id: 3, name: "Historical Compliance Records" },
        { id: 4, name: "Organizational Proof of ID" }
      ],
      relatedList: [
        {
          id: 101,
          category: "Infrastructure",
          title: "Cloud Storage Regulations 2023",
          description: "Guidelines for data localization and cloud interoperability standards.",
          date: "Dec 2023"
        },
        {
          id: 102,
          category: "E-Commerce",
          title: "Digital Payment Safety Act",
          description: "Standard protocols for secure transaction processing and...",
          date: "Feb 2024"
        },
        {
          id: 103,
          category: "Summary/Total",
          title: "AI Ethical Standards 2024",
          description: "Framework for responsible AI development and algorithmic...",
          date: "May 2024"
        }
      ]
    },
    {
      id: 1,
      policyId: "POL-2023-894",
      category: "Infrastructure",
      title: "Green Energy Transition & Smart Grid Act",
      department: "Ministry of Power",
      location: "New Delhi",
      publishedDate: "Oct 12, 2023",
      rawDate: "2023-10-12",
      description: "This policy outlines the strategic shift towards renewable energy sources and the modernization of electrical grid infrastructures for unified national power distribution.",
      status: "Active",
      ministry: "Ministry of Power"
    },
    {
      id: 2,
      policyId: "POL-2023-721",
      category: "Healthcare",
      title: "Universal Healthcare Digital Records Initiative",
      department: "Dept of Health",
      location: "California",
      publishedDate: "Sept 28, 2023",
      rawDate: "2023-09-28",
      description: "Mandatory implementation of unified digital health records for all citizens to ensure secure, real-time interoperability and remote access between healthcare providers.",
      status: "Active",
      ministry: "Dept of Health"
    },
    {
      id: 3,
      policyId: "POL-2023-112",
      category: "Technology",
      title: "AI Ethics & Governance Framework 2.0",
      department: "Ministry of IT",
      location: "Federal",
      publishedDate: "Nov 09, 2023",
      rawDate: "2023-11-09",
      description: "A comprehensive guideline for the development and deployment of Artificial Intelligence systems ensuring public transparency, safety, and strict alignment with national privacy ethics.",
      status: "Active",
      ministry: "Ministry of IT"
    },
    {
      id: 4,
      policyId: "POL-2023-455",
      category: "Finance",
      title: "SME Digital Transformation Grant Scheme",
      department: "Dept of Commerce",
      location: "Texas",
      publishedDate: "Aug 15, 2023",
      rawDate: "2023-08-15",
      description: "Financial incentives and subsidized technological resources for small to medium enterprises to integrate digital invoicing, cloud accounting, and e-commerce capabilities.",
      status: "Active",
      ministry: "Dept of Commerce"
    },
    {
      id: 5,
      policyId: "POL-2023-301",
      category: "Education",
      title: "National STEM Curriculum Standard Refactoring",
      department: "Ministry of Education",
      location: "Federal",
      publishedDate: "Oct 01, 2023",
      rawDate: "2023-10-01",
      description: "Updating the national primary and secondary education standards to include advanced computer science, data sciences, robotics, and design thinking methodologies.",
      status: "Active",
      ministry: "Ministry of Education"
    }
  ];

  // States
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
      triggerToast(`Opening details for "${policy.title}" (Simulation Mode)`);
    }
  };

  // Filter & Sort Logic
  const filteredPolicies = initialPolicies.filter((policy) => {
    // 1. Search Query filter (matches Title, Policy ID, Description)
    if (appliedSearchQuery) {
      const query = appliedSearchQuery.toLowerCase();
      const matchesTitle = policy.title.toLowerCase().includes(query);
      const matchesId = policy.policyId.toLowerCase().includes(query);
      const matchesDesc = policy.description.toLowerCase().includes(query);
      if (!matchesTitle && !matchesId && !matchesDesc) {
        return false;
      }
    }
    // 2. Category filter
    if (filters.category !== 'All Categories' && policy.category.toLowerCase() !== filters.category.toLowerCase()) {
      return false;
    }
    // 3. State filter
    if (filters.state !== 'All States' && policy.location.toLowerCase() !== filters.state.toLowerCase()) {
      return false;
    }
    // 4. Department filter
    if (filters.department !== 'All Depts' && policy.department.toLowerCase() !== filters.department.toLowerCase()) {
      return false;
    }
    // 5. Ministry filter
    if (filters.ministry !== 'All Ministries' && policy.ministry.toLowerCase() !== filters.ministry.toLowerCase()) {
      return false;
    }
    // 6. Status filter
    if (filters.status !== 'All Statuses' && policy.status.toLowerCase() !== filters.status.toLowerCase()) {
      return false;
    }
    // 7. Date filter
    if (filters.date && policy.rawDate !== filters.date) {
      return false;
    }
    return true;
  });

  // Sort list
  const sortedPolicies = [...filteredPolicies].sort((a, b) => {
    const dateA = new Date(a.rawDate);
    const dateB = new Date(b.rawDate);
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        {paginatedPolicies.map((policy) => (
          <div key={policy.id}>
            <PolicyCard 
              category={policy.category}
              policyId={policy.policyId}
              title={policy.title}
              department={policy.department}
              location={policy.location}
              publishedDate={policy.publishedDate}
              description={policy.description}
              isBookmarked={bookmarkedIds.includes(policy.policyId)}
              onBookmarkToggle={() => handleBookmarkToggle(policy.policyId)}
              onReadMore={() => handleReadMore(policy)}
              onShare={() => handleShare(policy.policyId, policy.title)}
            />
          </div>
        ))}
        
        {/* Dotted border digitization card (Always appended at the end of results) */}
        <div>
          <EmptyPolicyCard onRequestDigitization={handleRequestDigitization} />
        </div>
      </div>

      {/* Bottom Pagination controls */}
      <Pagination 
        currentPage={currentPage}
        totalPages={totalPages}
        totalResults={totalResults}
        resultsPerPage={resultsPerPage}
        onPageChange={setCurrentPage}
      />

    </div>
  );
};

export default PolicySearchPage;
