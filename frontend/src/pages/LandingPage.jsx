import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import useAuth from '../hooks/useAuth';
import { getSchemes } from '../services/scheme.service';
import Modal from '../components/modals/Modal';
import { useToast } from '../hooks/useToast';

const LandingPage = () => {
  const { user, handleLogout } = useAuth();
  const { addToast } = useToast();
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

  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedScheme, setSelectedScheme] = useState(null);
  
  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [contactSubmitted, setContactSubmitted] = useState(false);

  useEffect(() => {
    setLoading(true);
    getSchemes()
      .then((res) => {
        if (res.success && Array.isArray(res.schemes)) {
          setSchemes(res.schemes);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleTagClick = (tag) => {
    setSearchQuery(tag);
    setTimeout(() => {
      const element = document.getElementById('schemes');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const element = document.getElementById('schemes');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      addToast("Name, Email, and Message are required.", 'error');
      return;
    }
    setContactSubmitted(true);
    setContactForm({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => setContactSubmitted(false), 5000);
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

        {/* Schemes Section */}
        <section id="schemes" className="py-12 border-b border-slate-200/80 scroll-mt-24">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-3xl font-black text-slate-800 tracking-tight">Government Schemes</h2>
            <p className="text-xs sm:text-sm text-slate-500 font-semibold mt-2">
              Browse government active catalog directory and search schemes by tags.
            </p>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 bg-white border border-slate-200 rounded-3xl shadow-sm">
              <div className="w-10 h-10 border-4 border-[#0052cc] border-t-transparent rounded-full animate-spin"></div>
              <p className="text-xs font-bold text-slate-400 mt-4">Loading schemes from database...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {schemes
                .filter((s) => {
                  if (!searchQuery.trim()) return true;
                  const query = searchQuery.toLowerCase();
                  return (
                    s.title?.toLowerCase().includes(query) ||
                    s.description?.toLowerCase().includes(query) ||
                    s.category?.toLowerCase().includes(query)
                  );
                })
                .map((scheme) => (
                  <div key={scheme._id} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between text-left">
                    <div className="space-y-3">
                      <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase bg-blue-50 text-blue-600 border border-blue-100 tracking-wider">
                        {scheme.category || 'General'}
                      </span>
                      <h3 className="text-base font-extrabold text-slate-800 line-clamp-1">{scheme.title}</h3>
                      <p className="text-xs text-slate-500 font-light line-clamp-3 leading-relaxed">
                        {scheme.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between gap-3 pt-5 mt-6 border-t border-slate-100">
                      <button
                        onClick={() => setSelectedScheme(scheme)}
                        className="text-xs font-bold text-[#0052cc] hover:underline cursor-pointer border-none bg-transparent"
                      >
                        View Details
                      </button>
                      <Link
                        to={user ? "/dashboard?tab=schemes" : "/login"}
                        className="px-4 py-2 bg-[#0052cc] hover:bg-[#0047b3] text-white font-bold rounded-xl text-xs shadow-sm transition-colors text-center cursor-pointer decoration-none"
                      >
                        Apply Now
                      </Link>
                    </div>
                  </div>
                ))}
              {schemes.filter((s) => {
                if (!searchQuery.trim()) return true;
                const query = searchQuery.toLowerCase();
                return (
                  s.title?.toLowerCase().includes(query) ||
                  s.description?.toLowerCase().includes(query) ||
                  s.category?.toLowerCase().includes(query)
                );
              }).length === 0 && (
                <div className="col-span-full py-16 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-300">
                  <p className="text-xs font-bold text-slate-400">No active schemes found matching "{searchQuery}".</p>
                </div>
              )}
            </div>
          )}
        </section>

        {/* Eligibility Section */}
        <section id="eligibility" className="py-12 border-b border-slate-200/80 scroll-mt-24">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-3 text-left max-w-2xl">
              <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase bg-indigo-100 text-indigo-700 border border-indigo-100 tracking-wider">
                AI Eligibility Check
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">Am I Eligible for Government Schemes?</h3>
              <p className="text-xs sm:text-sm font-semibold text-slate-500 leading-relaxed">
                Analyze your age, income, state, education, and profession profile to see exactly which schemes you can apply for, calculated instantly with our AI assistant.
              </p>
            </div>
            <Link
              to={user ? "/dashboard?tab=eligibility" : "/login"}
              className="px-6 py-3 bg-[#0052cc] hover:bg-[#0047b3] text-white font-bold rounded-xl text-xs sm:text-sm shadow-md transition-colors text-center shrink-0 cursor-pointer decoration-none"
            >
              Verify Eligibility Now
            </Link>
          </div>
        </section>

        {/* About Us Section */}
        <section id="about" className="py-12 border-b border-slate-200/80 scroll-mt-24 text-left">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">About PolicyGPT</h2>
              <p className="text-xs sm:text-sm font-semibold text-slate-650 leading-relaxed">
                PolicyGPT represents the next generation of government service accessibility. By implementing advanced semantic search engines, state-of-the-art natural language processing, and automated eligibility validations, we connect citizens directly to Central and State benefits they are entitled to.
              </p>
              <p className="text-xs sm:text-sm font-semibold text-slate-650 leading-relaxed">
                Our mission is simple: to minimize administrative friction, eliminate confusion, and help every citizen discover right government schemes effortlessly.
              </p>
            </div>
            <div className="lg:col-span-5 bg-slate-50 border border-slate-200 p-6 rounded-3xl space-y-4">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">Our Core Pillars</h4>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-[#0052cc] flex items-center justify-center text-xs font-black shrink-0">1</div>
                  <div>
                    <h5 className="text-xs font-extrabold text-slate-800">Accessibility</h5>
                    <p className="text-[10px] text-slate-505 font-light mt-0.5">Simple, language-friendly interactions for all citizens.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-xs font-black shrink-0">2</div>
                  <div>
                    <h5 className="text-xs font-extrabold text-slate-800">Reliability</h5>
                    <p className="text-[10px] text-slate-505 font-light mt-0.5">Real-time status updates sync directly with official records.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-black shrink-0">3</div>
                  <div>
                    <h5 className="text-xs font-extrabold text-slate-800">Efficiency</h5>
                    <p className="text-[10px] text-slate-505 font-light mt-0.5">AI matching saves hours spent on manual lookups.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-12 scroll-mt-24 text-left">
          <div className="max-w-3xl mx-auto bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
            <div className="text-center max-w-xl mx-auto mb-8">
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">Get in Touch</h2>
              <p className="text-xs text-slate-500 font-semibold mt-1">Have any questions or need technical support? Send us a message.</p>
            </div>

            {contactSubmitted ? (
              <div className="p-6 bg-emerald-50 border border-emerald-100 rounded-2xl text-center animate-in fade-in zoom-in-95 duration-200">
                <span className="text-emerald-700 font-extrabold text-xs block">Thank you for reaching out!</span>
                <span className="text-emerald-600 text-[11px] font-medium block mt-1">Our support team will respond to your query shortly.</span>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1.5">Your Name</label>
                    <input
                      type="text"
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      placeholder="Enter full name"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-800 text-xs focus:outline-none focus:border-[#0052cc] focus:ring-2 focus:ring-blue-500/10"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1.5">Email Address</label>
                    <input
                      type="email"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      placeholder="name@example.com"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-800 text-xs focus:outline-none focus:border-[#0052cc] focus:ring-2 focus:ring-blue-500/10"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1.5">Subject</label>
                  <input
                    type="text"
                    value={contactForm.subject}
                    onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                    placeholder="Enter subject topic"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-800 text-xs focus:outline-none focus:border-[#0052cc] focus:ring-2 focus:ring-blue-500/10"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1.5">Your Message</label>
                  <textarea
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    placeholder="Write detailed inquiry message here..."
                    rows={4}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-800 text-xs focus:outline-none focus:border-[#0052cc] focus:ring-2 focus:ring-blue-500/10"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#0052cc] hover:bg-[#0047b3] text-white font-bold rounded-lg text-xs shadow-sm cursor-pointer border-none"
                >
                  Send Message
                </button>
              </form>
            )}
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
            &copy; 2026 PolicyGPT. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Details Modal */}
      <Modal
        isOpen={!!selectedScheme}
        onClose={() => setSelectedScheme(null)}
        title="Scheme Details"
      >
        {selectedScheme && (
          <div className="space-y-6 text-left">
            <div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-blue-50 text-blue-600 uppercase tracking-widest border border-blue-150">
                {selectedScheme.category || 'General'}
              </span>
              <h3 className="text-xl font-extrabold text-slate-800 mt-2">{selectedScheme.title}</h3>
              <p className="text-xs text-slate-400 font-bold mt-1">Department: {selectedScheme.department || 'Federal Government'}</p>
            </div>
            
            <div className="border-t border-slate-250 pt-4 space-y-2">
              <h4 className="text-xs font-black text-slate-450 uppercase tracking-wider">Description</h4>
              <p className="text-sm font-semibold text-slate-600 leading-relaxed">{selectedScheme.description}</p>
            </div>

            <div className="border-t border-slate-250 pt-4 space-y-3">
              <h4 className="text-xs font-black text-slate-450 uppercase tracking-wider">Eligibility Requirements</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-bold text-slate-650">
                <div>
                  <span className="block text-slate-400 text-[10px] font-black uppercase">Age Limit</span>
                  {selectedScheme.eligibilityRules?.age ? `${selectedScheme.eligibilityRules.age.min || 0} - ${selectedScheme.eligibilityRules.age.max || 'No limit'} years` : 'Any age'}
                </div>
                <div>
                  <span className="block text-slate-400 text-[10px] font-black uppercase">Annual Income Limit</span>
                  {selectedScheme.eligibilityRules?.income?.max ? `Under ₹${selectedScheme.eligibilityRules.income.max}` : 'No income limit'}
                </div>
                <div>
                  <span className="block text-slate-400 text-[10px] font-black uppercase">Education</span>
                  {selectedScheme.eligibilityRules?.education || 'No specific education required'}
                </div>
                <div>
                  <span className="block text-slate-400 text-[10px] font-black uppercase">Occupation</span>
                  {selectedScheme.eligibilityRules?.occupation || 'Any occupation'}
                </div>
              </div>
            </div>

            <div className="border-t border-slate-250 pt-4 flex justify-end gap-3">
              <button
                onClick={() => setSelectedScheme(null)}
                className="px-4 py-2 border border-slate-350 hover:bg-slate-50 rounded-xl text-xs font-extrabold cursor-pointer"
              >
                Close
              </button>
              <Link
                to={user ? "/dashboard?tab=schemes" : "/login"}
                className="px-4 py-2 bg-[#0052cc] hover:bg-[#0047b3] text-white font-extrabold rounded-xl text-xs shadow-sm transition-colors text-center cursor-pointer decoration-none"
              >
                Apply for Scheme
              </Link>
            </div>
          </div>
        )}
      </Modal>

    </div>
  );
};

export default LandingPage;
