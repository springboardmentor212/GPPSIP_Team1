import React, { useState, useEffect } from 'react';
import useAuth from '../../hooks/useAuth';
import { getCirculars } from '../../services/circular.service';
import { FaFileAlt, FaSpinner, FaBullhorn, FaCalendarAlt, FaDownload } from 'react-icons/fa';

const CircularsPage = () => {
    const { user } = useAuth();
    const [circulars, setCirculars] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCirculars = async () => {
            try {
                const res = await getCirculars();
                if (res.success && res.circulars) {
                    setCirculars(res.circulars);
                }
            } catch (err) {
                console.error("Failed to fetch circulars:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchCirculars();
    }, []);

    const getCategoryColor = (cat) => {
        switch (cat) {
            case 'Urgent': return 'text-rose-600 bg-rose-50 border-rose-200';
            case 'Policy Update': return 'text-[#0052cc] bg-blue-50 border-blue-200';
            case 'Tender': return 'text-amber-600 bg-amber-50 border-amber-200';
            case 'Recruitment': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
            default: return 'text-slate-600 bg-slate-100 border-slate-300';
        }
    };

    return (
        <div className="w-full space-y-6 text-left select-none pb-8">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                <div>
                    <div className="text-[10px] sm:text-xs text-slate-450 font-bold uppercase tracking-wider">
                        Dashboard &gt; <span className="text-slate-600 font-extrabold">Notices & Circulars</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight leading-none mt-2">
                        Official Circulars
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500 font-light max-w-xl leading-relaxed mt-2">
                        Stay updated with the latest government notices, urgent announcements, and policy updates.
                    </p>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <FaSpinner className="animate-spin text-[#0052cc] w-8 h-8" />
                </div>
            ) : circulars.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-300 p-12 text-center shadow-sm">
                    <FaBullhorn className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                    <h3 className="text-lg font-black text-slate-800">No Active Circulars</h3>
                    <p className="text-sm text-slate-500 mt-2">There are currently no active official notices or circulars to display.</p>
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-slate-300 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200">
                                    <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-wider">Title & Description</th>
                                    <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-wider">Category</th>
                                    <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-wider text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {circulars.map((circular) => (
                                    <tr key={circular._id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-start gap-3">
                                                <div className="p-2 bg-blue-50 text-[#0052cc] rounded-lg mt-0.5">
                                                    <FaFileAlt className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <div className="text-sm font-bold text-slate-800 mb-1">{circular.title}</div>
                                                    <div className="text-xs text-slate-500 max-w-md truncate">{circular.content}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 text-[10px] font-bold rounded-lg border uppercase tracking-wider ${getCategoryColor(circular.category)}`}>
                                                {circular.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
                                                <FaCalendarAlt className="text-slate-400" />
                                                {new Date(circular.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {circular.documentUrl ? (
                                                <a href={`http://localhost:3000${circular.documentUrl}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 text-slate-700 hover:text-[#0052cc] hover:border-[#0052cc] rounded-lg text-xs font-bold transition-colors">
                                                    <FaDownload /> View
                                                </a>
                                            ) : (
                                                <button className="px-3 py-1.5 bg-slate-100 text-slate-400 rounded-lg text-xs font-bold cursor-not-allowed">
                                                    No PDF
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CircularsPage;
