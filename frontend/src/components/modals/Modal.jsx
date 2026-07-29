import React from 'react';
import { FaTimes } from 'react-icons/fa';

const Modal = ({ isOpen, onClose, title, children, actions }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center select-none p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm cursor-pointer" 
        onClick={onClose}
      />
      {/* Dialog Container */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-lg p-6 sm:p-8 flex flex-col relative z-10 max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-6 shrink-0">
          <h3 className="text-lg font-black text-slate-800 tracking-tight">{title}</h3>
          <button 
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer bg-transparent border-none"
          >
            <FaTimes className="w-4 h-4" />
          </button>
        </div>

        {/* Content (Scrollable) */}
        <div className="flex-grow overflow-y-auto pr-1">
          {children}
        </div>

        {/* Actions Footer */}
        {actions && (
          <div className="pt-4 border-t border-slate-200 mt-6 flex justify-end gap-3 shrink-0">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
