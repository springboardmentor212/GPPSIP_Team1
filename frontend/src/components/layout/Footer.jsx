import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full border-t border-slate-300 bg-white py-6 mt-12 shrink-0 select-none">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-bold text-slate-400">
        {/* Branding text */}
        <div>
          &copy; {new Date().getFullYear()} PolicyGPT, A Secure Intelligence Initiative.
        </div>
        {/* Government / Policy links */}
        <div className="flex items-center gap-6">
          <a href="#terms" className="hover:text-[#0052cc] transition-colors">Terms of Service</a>
          <a href="#privacy" className="hover:text-[#0052cc] transition-colors">Privacy Framework</a>
          <a href="#compliance" className="hover:text-[#0052cc] transition-colors">Institutional Compliance</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
