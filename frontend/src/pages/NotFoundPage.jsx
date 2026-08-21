import React from 'react';
import { useNavigate } from 'react-router';
import { FaExclamationTriangle, FaArrowLeft, FaHome } from 'react-icons/fa';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-400/20 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-lg">
        <div className="bg-white/80 backdrop-blur-xl border border-white/50 shadow-2xl rounded-3xl p-8 sm:p-12 text-center">
          <div className="w-24 h-24 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner border border-rose-100">
            <FaExclamationTriangle className="w-12 h-12 text-rose-500" />
          </div>
          
          <h1 className="text-6xl sm:text-7xl font-black text-slate-800 tracking-tighter mb-4">
            404
          </h1>
          
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-700 tracking-tight mb-3">
            Page Not Found
          </h2>
          
          <p className="text-sm text-slate-500 font-medium leading-relaxed mb-8 max-w-sm mx-auto">
            The page you are looking for doesn't exist, has been moved, or you don't have authorization to view it.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="w-full sm:w-auto px-6 py-3 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm"
            >
              <FaArrowLeft className="w-3.5 h-3.5" />
              Go Back
            </button>
            <button
              onClick={() => navigate('/')}
              className="w-full sm:w-auto px-6 py-3 bg-[#0052cc] hover:bg-[#0047b3] text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md border-none"
            >
              <FaHome className="w-4 h-4" />
              Return Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
