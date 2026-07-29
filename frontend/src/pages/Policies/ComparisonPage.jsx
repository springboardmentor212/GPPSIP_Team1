import React, { useState, useEffect } from 'react';
import { ArrowLeft, Check, X, ShieldAlert } from 'lucide-react';
import Footer from '../../components/layout/Footer';

const ComparisonPage = ({ onBack, preSelectedItems = [] }) => {
  const [itemsToCompare, setItemsToCompare] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock fetching items for comparison to fit industrial frontend design
  useEffect(() => {
    // Simulate loading state before rendering the comparison table
    setTimeout(() => {
      setItemsToCompare([
        {
          _id: "POL-001",
          title: "National Health Protection Scheme",
          department: "Health & Family Welfare",
          category: "Healthcare",
          status: "Active",
          benefits: "Up to ₹5 Lakhs",
          eligibility: "BPL families"
        },
        {
          _id: "POL-002",
          title: "PM State Health Scheme",
          department: "Health & Family Welfare",
          category: "Healthcare",
          status: "Draft",
          benefits: "Up to ₹2.5 Lakhs",
          eligibility: "All citizens below ₹2L Income"
        }
      ]);
      setLoading(false);
    }, 600);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
        
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <button 
            onClick={onBack}
            className="p-2 bg-white border border-slate-200 rounded-full hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Compare Policies</h1>
            <p className="text-sm text-slate-500">Side-by-side analysis of policy specifications and benefits</p>
          </div>
        </div>

        {loading ? (
           <div className="flex flex-col items-center justify-center py-24 bg-white border border-slate-200 rounded-2xl shadow-sm">
             <div className="w-10 h-10 border-4 border-[#0052cc] border-t-transparent rounded-full animate-spin"></div>
             <p className="mt-4 text-sm font-semibold text-slate-600">Generating Comparison Matrix...</p>
           </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 uppercase tracking-wider font-bold">
                    <th className="p-4 w-48">Feature</th>
                    {itemsToCompare.map((item, idx) => (
                      <th key={idx} className="p-4 border-l border-slate-200 min-w-[250px]">
                        {item.title}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-700">
                  <tr className="hover:bg-slate-50">
                    <td className="p-4 font-semibold text-slate-900 bg-slate-50/50">Department</td>
                    {itemsToCompare.map((item, idx) => (
                      <td key={idx} className="p-4 border-l border-slate-200">{item.department}</td>
                    ))}
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="p-4 font-semibold text-slate-900 bg-slate-50/50">Category</td>
                    {itemsToCompare.map((item, idx) => (
                      <td key={idx} className="p-4 border-l border-slate-200">
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-bold">
                          {item.category}
                        </span>
                      </td>
                    ))}
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="p-4 font-semibold text-slate-900 bg-slate-50/50">Status</td>
                    {itemsToCompare.map((item, idx) => (
                      <td key={idx} className="p-4 border-l border-slate-200">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          item.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                    ))}
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="p-4 font-semibold text-slate-900 bg-slate-50/50">Core Eligibility</td>
                    {itemsToCompare.map((item, idx) => (
                      <td key={idx} className="p-4 border-l border-slate-200 text-slate-600">{item.eligibility}</td>
                    ))}
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="p-4 font-semibold text-slate-900 bg-slate-50/50">Financial Benefit</td>
                    {itemsToCompare.map((item, idx) => (
                      <td key={idx} className="p-4 border-l border-slate-200 text-emerald-600 font-semibold">{item.benefits}</td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
            {/* Quick Actions Footer inside card */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
               <button className="px-6 py-2 bg-[#0052cc] hover:bg-[#0047b3] text-white font-bold text-sm rounded-xl transition-colors">
                 Export Comparison PDF
               </button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default ComparisonPage;
