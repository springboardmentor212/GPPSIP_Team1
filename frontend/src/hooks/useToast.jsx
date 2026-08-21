import React, { createContext, useContext, useState, useCallback } from 'react';
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaTimes } from 'react-icons/fa';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = 'info', duration = 3500) => {
        const id = Date.now().toString();
        setToasts(prev => [...prev, { id, message, type }]);

        if (duration > 0) {
            setTimeout(() => {
                removeToast(id);
            }, duration);
        }
    }, []);

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ addToast, removeToast }}>
            {children}
            <div className="fixed top-6 right-6 z-[100] flex flex-col gap-2 select-none">
                {toasts.map(toast => (
                    <div
                        key={toast.id}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border text-sm font-bold min-w-[280px] max-w-sm animate-in fade-in slide-in-from-top-5 duration-300 ${
                            toast.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' :
                            toast.type === 'error' ? 'bg-rose-50 border-rose-200 text-rose-800' :
                            'bg-blue-50 border-blue-200 text-blue-800'
                        }`}
                    >
                        <div className="shrink-0">
                            {toast.type === 'success' && <FaCheckCircle className="w-5 h-5 text-emerald-500" />}
                            {toast.type === 'error' && <FaExclamationCircle className="w-5 h-5 text-rose-500" />}
                            {toast.type === 'info' && <FaInfoCircle className="w-5 h-5 text-blue-500" />}
                        </div>
                        <div className="flex-grow">
                            {toast.message}
                        </div>
                        <button
                            onClick={() => removeToast(toast.id)}
                            className="shrink-0 text-slate-400 hover:text-slate-600 transition-colors bg-transparent border-none cursor-pointer"
                        >
                            <FaTimes className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};
