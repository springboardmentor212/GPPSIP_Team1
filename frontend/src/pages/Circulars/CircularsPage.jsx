import React, { useEffect, useState } from 'react';
import { FaBullhorn } from 'react-icons/fa';

const CircularsPage = () => {
  const [circulars, setCirculars] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/circulars')
      .then(res => res.json())
      .then(data => {
        if (data.success) setCirculars(data.circulars);
      })
      .catch(console.error);
  }, []);

  return (
    <div className="bg-white rounded-2xl border border-slate-300 p-6 sm:p-8 min-h-[480px]">
      <h2 className="text-2xl font-bold text-slate-900 mb-6 pb-4 border-b border-slate-300 flex items-center gap-2.5">
        <FaBullhorn className="text-[#0052cc]" /> Circulars & Notices
      </h2>
      <div className="space-y-4">
        {circulars.map(c => (
          <div key={c._id} className="p-4 border rounded-lg bg-gray-50">
            <h3 className="font-bold text-lg">{c.title}</h3>
            <p className="text-sm text-gray-600 mt-2">{c.content}</p>
          </div>
        ))}
        {circulars.length === 0 && <p className="text-gray-500">No circulars available.</p>}
      </div>
    </div>
  );
};

export default CircularsPage;
