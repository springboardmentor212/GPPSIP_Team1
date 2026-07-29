import React from 'react';

const CategoryTabs = ({ activeTab, onTabChange }) => {
  const categories = [
    "All Schemes",
    "Education & Research",
    "Small Business (MSME)",
    "Sustainable Energy",
    "Infrastructure",
    "Healthcare",
    "Technology"
  ];

  return (
    <div className="w-full overflow-x-auto no-scrollbar pt-2 select-none">
      <div className="flex items-center gap-3 pb-2 shrink-0">
        {categories.map((cat) => {
          const isActive = activeTab === cat;
          return (
            <button
              key={cat}
              onClick={() => onTabChange(cat)}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-200 shrink-0 whitespace-nowrap cursor-pointer border ${
                isActive
                  ? 'bg-[#0052cc] text-white border-[#0052cc] shadow-sm shadow-blue-500/10'
                  : 'bg-white text-slate-600 border-slate-300 hover:border-slate-450 hover:text-slate-800'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryTabs;
