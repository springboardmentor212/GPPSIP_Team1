import React from 'react';
import { Link } from 'react-router';

const Login = () => {
  return (
    <div className="min-h-screen bg-[#070b13] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900/40 border border-slate-800 rounded-2xl p-8 backdrop-blur-sm text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Sign In to PolicyGPT</h2>
        <p className="text-sm text-slate-400 mb-6">Access AI-powered scheme recommendations</p>
        
        {/* Placeholder form to avoid blank pages */}
        <div className="space-y-4 text-left mb-6">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Email Address</label>
            <input type="email" placeholder="name@domain.com" disabled className="w-full px-4 py-3 rounded-lg bg-[#05080e] border border-slate-800 text-slate-300 text-sm focus:outline-none cursor-not-allowed opacity-60" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Password</label>
            <input type="password" placeholder="••••••••" disabled className="w-full px-4 py-3 rounded-lg bg-[#05080e] border border-slate-800 text-slate-300 text-sm focus:outline-none cursor-not-allowed opacity-60" />
          </div>
        </div>

        <button disabled className="w-full py-3 rounded-lg bg-blue-600/30 text-blue-400 border border-blue-500/20 text-sm font-semibold cursor-not-allowed mb-4">
          Auth Implementation Pending
        </button>

        <p className="text-sm text-slate-400">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-500 hover:text-blue-400 font-medium">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
