import React, { useState, useEffect, useRef } from 'react';

const SearchableDropdown = ({
  name,
  value,
  onChange,
  options = [],
  placeholder = 'Select Option',
  disabled = false,
  error = '',
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef(null);
  const searchInputRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchQuery('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen((prev) => {
        const nextState = !prev;
        if (!nextState) {
          setSearchQuery('');
        }
        return nextState;
      });
    }
  };

  const handleSelect = (optionValue) => {
    // Mimic the event target behavior of native selects for easy integration
    onChange({
      target: {
        name,
        value: optionValue
      }
    });
    setIsOpen(false);
    setSearchQuery('');
  };

  // Filter options based on search query
  const filteredOptions = options.filter((option) => {
    const term = typeof option === 'string' ? option : option.label || '';
    return term.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Get display text for the trigger button
  const getDisplayText = () => {
    if (!value) return placeholder;
    const selectedOption = options.find((opt) => {
      const val = typeof opt === 'string' ? opt : opt.value;
      return val === value;
    });
    if (!selectedOption) return value;
    return typeof selectedOption === 'string' ? selectedOption : selectedOption.label;
  };

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={handleToggle}
        disabled={disabled}
        className={`w-full px-3 py-2 rounded-lg border text-left bg-white text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/10 shadow-sm transition-all flex items-center justify-between select-none ${
          disabled ? 'opacity-60 cursor-not-allowed bg-slate-50' : 'cursor-pointer'
        } ${
          error
            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10'
            : isOpen
            ? 'border-[#0052cc] ring-2 ring-blue-500/10'
            : 'border-slate-300 hover:border-slate-400'
        }`}
      >
        <span className={!value ? 'text-slate-400' : 'text-slate-800 font-medium'}>
          {getDisplayText()}
        </span>
        <svg
          className={`w-3 h-3 text-slate-500 transition-transform duration-200 shrink-0 ml-2 ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Options Panel */}
      {isOpen && (
        <div className="absolute z-50 left-0 right-0 mt-1 bg-white border border-slate-350 rounded-lg shadow-lg flex flex-col max-h-60 overflow-hidden">
          {/* Search Box */}
          <div className="p-2 border-b border-slate-200 bg-slate-50 sticky top-0 shrink-0 z-10">
            <div className="relative flex items-center">
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search ${placeholder.toLowerCase()}...`}
                className="w-full pl-7 pr-3 py-1.5 border border-slate-250 rounded-md text-[11px] bg-white text-slate-850 placeholder-slate-400 focus:outline-none focus:border-[#0052cc] focus:ring-1 focus:ring-[#0052cc]"
              />
              <div className="absolute left-2 text-slate-400 pointer-events-none">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Options List */}
          <div className="overflow-y-auto flex-grow max-h-48 py-1">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, idx) => {
                const optVal = typeof option === 'string' ? option : option.value;
                const optLabel = typeof option === 'string' ? option : option.label;
                const isSelected = optVal === value;

                return (
                  <button
                    key={`${optVal}-${idx}`}
                    type="button"
                    onClick={() => handleSelect(optVal)}
                    className={`w-full text-left px-3 py-2 text-xs transition-colors cursor-pointer select-none flex items-center justify-between ${
                      isSelected
                        ? 'bg-[#f0f5ff] text-[#0052cc] font-semibold'
                        : 'text-slate-700 hover:bg-[#f0f5ff] hover:text-[#0052cc]'
                    }`}
                  >
                    <span>{optLabel}</span>
                    {isSelected && (
                      <svg className="w-3.5 h-3.5 text-[#0052cc]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                );
              })
            ) : (
              <div className="px-3 py-4 text-xs text-slate-400 text-center select-none font-medium">
                No matches found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchableDropdown;
