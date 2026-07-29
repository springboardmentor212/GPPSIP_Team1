import React, { useState } from 'react';
import { Link } from 'react-router';
import useAuth from '../hooks/useAuth';

const LandingPage = () => {
  const { user, handleLogout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const popularTags = [
    'PM Kisan',
    'Ayushman Bharat',
    'Startup India',
    'Scholarships',
    'Women Welfare'
  ];

  const stats = [
    { value: '1200+', label: 'Government Schemes' },
    { value: '35+', label: 'States & UTs' },
    { value: '50+', label: 'Ministries' },
    { value: '1M+', label: 'Citizens Assisted' }
  ];

  const handleTagClick = (tag) => {
    setSearchQuery(tag);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    alert(`Searching for: "${searchQuery}" (Search logic is pending backend implementation)`);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans flex flex-col justify-between">
      
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 w-full bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo Section */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="flex items-end gap-[3px] h-7">
              {/* Custom stepped blocks representing the logo */}
              <div className="w-[11px] h-[16px] bg-[#0052cc] rounded-[2px]" />
              <div className="w-[11px] h-[26px] bg-[#0a369d] rounded-[2px]" />
            </div>
            <span className="text-xl font-bold text-slate-800 tracking-tight ml-1">
              PolicyGPT
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-sm font-semibold text-[#0052cc] transition-colors">Home</Link>
            <a href="#schemes" className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">Schemes</a>
            <a href="#eligibility" className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">Eligibility</a>
            <a href="#about" className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">About Us</a>
            <a href="#contact" className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">Contact</a>
          </nav>

          {/* Action Button */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <Link to="/dashboard" className="text-sm font-bold text-[#0052cc] hover:underline">
                  Dashboard ({user.fullName.split(' ')[0]})
                </Link>
                <button onClick={handleLogout} className="inline-flex items-center justify-center px-6 py-2.5 rounded-lg text-sm font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 shadow-sm transition-colors duration-200">
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="inline-flex items-center justify-center px-6 py-2.5 rounded-lg text-sm font-bold bg-[#0052cc] hover:bg-[#0047b3] text-white shadow-sm transition-colors duration-200">
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-slate-600 hover:text-slate-900 focus:outline-none p-2"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-100 bg-white px-6 py-4 flex flex-col gap-3.5 shadow-sm">
            <Link to="/" onClick={() => setMobileMenuOpen(false)} className="text-base font-semibold text-[#0052cc]">
              Home
            </Link>
            <a href="#schemes" onClick={() => setMobileMenuOpen(false)} className="text-base font-semibold text-slate-600 hover:text-slate-900">
              Schemes
            </a>
            <a href="#eligibility" onClick={() => setMobileMenuOpen(false)} className="text-base font-semibold text-slate-600 hover:text-slate-900">
              Eligibility
            </a>
            <a href="#about" onClick={() => setMobileMenuOpen(false)} className="text-base font-semibold text-slate-600 hover:text-slate-900">
              About Us
            </a>
            <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="text-base font-semibold text-slate-600 hover:text-slate-900">
              Contact
            </a>
            {user ? (
              <>
                <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="w-full flex items-center justify-center py-2.5 rounded-lg text-base font-bold text-[#0052cc] border border-[#0052cc]">
                  Dashboard
                </Link>
                <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="w-full flex items-center justify-center py-2.5 rounded-lg text-base font-bold bg-slate-100 hover:bg-slate-200 text-slate-800">
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="w-full flex items-center justify-center py-2.5 rounded-lg text-base font-bold bg-[#0052cc] hover:bg-[#0047b3] text-white">
                Sign In
              </Link>
            )}
          </div>
        )}
      </header>

      {/* Main Container */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex flex-col justify-center">

        {/* Hero Section Container with Rounded Collage Banner */}
        <section className="relative rounded-3xl overflow-hidden shadow-lg border border-slate-100 bg-[#0a369d] mb-6 flex flex-col justify-center min-h-[480px]">
          
          {/* Background Collage: Using the single uploaded collage image */}
          <div 
            className="absolute inset-0 bg-cover bg-center z-0"
            style={{ backgroundImage: `url('/collage.jpg')` }}
          />

          {/* Correct overlays: mix-blend-color replaces hue/sat to blue, and dark blue opacity dims to keep text readable */}
          <div className="absolute inset-0 bg-[#0047b3]/75 mix-blend-color pointer-events-none z-10" />
          <div className="absolute inset-0 bg-[#0a2f7c]/70 pointer-events-none z-10" />


          {/* Banner Contents */}
          <div className="relative z-20 px-6 py-14 sm:py-16 text-center max-w-4xl mx-auto flex flex-col justify-center items-center">
            {/* Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-4 leading-tight">
              Discover Government Policies with AI
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-white/95 max-w-2xl mx-auto mb-8 leading-relaxed font-light">
              Search central and state government schemes, check your eligibility instantly, receive personalized recommendations, and stay updated with the latest government policy announcements.
            </p>

            {/* Search Input Bar */}
            <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto w-full mb-6">
              <div className="relative flex items-center bg-white border border-slate-200/40 rounded-full shadow-md p-1.5 pl-5 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all duration-300">
                {/* Search Icon */}
                <div className="text-slate-400 mr-2.5 pointer-events-none flex items-center">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                
                {/* Text input */}
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search policies, schemes, ministries, benefits..."
                  className="bg-transparent text-slate-800 placeholder-slate-400 focus:outline-none w-full text-sm sm:text-base py-2 font-medium"
                />

                {/* Blue Search Button */}
                <button type="submit" className="bg-[#0052cc] hover:bg-[#0047b3] text-white font-bold px-6 py-2.5 rounded-lg transition-colors cursor-pointer text-sm shrink-0 shadow-sm">
                  Search
                </button>
              </div>
            </form>

            {/* Popular Pill Badges */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              <span className="text-xs font-semibold text-white/85 tracking-wide mr-1">Popular:</span>
              {popularTags.map((tag) => (
                <button 
                  key={tag}
                  type="button"
                  onClick={() => handleTagClick(tag)}
                  className={`inline-flex items-center px-4 py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm border border-white/10 transition-colors cursor-pointer ${
                    searchQuery === tag 
                      ? 'bg-white text-[#0052cc]' 
                      : 'bg-[#002f87]/50 hover:bg-[#002f87]/70 text-white'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Statistics Section in a Single Clean Line */}
        <section className="border-y border-slate-200/80 py-5 my-3.5 w-full">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-y-4 md:gap-y-0 w-full">
            {stats.map((stat, index) => (
              <div key={index} className="text-center flex flex-col justify-center items-center px-4 md:border-r md:border-slate-200/80 last:border-r-0">
                {/* Statistic Value */}
                <div className="text-2xl sm:text-3xl font-extrabold text-[#0052cc] mb-0.5 tracking-tight">
                  {stat.value}
                </div>
                {/* Statistic Label */}
                <span className="text-xs sm:text-sm font-semibold text-slate-500 tracking-tight">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </section>

      </main>

      {/* Footer Section */}
      <footer className="w-full border-t border-slate-200/80 bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-end gap-[3px] h-6">
            <div className="w-[10px] h-[14px] bg-[#0052cc] rounded-[2px]" />
            <div className="w-[10px] h-[22px] bg-[#0a369d] rounded-[2px]" />
            <span className="text-base font-bold text-slate-800 tracking-tight ml-0.5">PolicyGPT</span>
          </Link>

          {/* Copyright Text */}
          <div className="text-xs text-slate-500 font-light">
            &copy; 2024 PolicyGPT. All rights reserved.
          </div>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;
