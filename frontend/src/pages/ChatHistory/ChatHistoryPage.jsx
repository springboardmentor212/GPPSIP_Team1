import React, { useEffect, useState } from 'react';
import { FaHistory } from 'react-icons/fa';

const ChatHistoryPage = () => {
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/chat/sessions', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) setSessions(data.sessions);
      })
      .catch(console.error);
  }, []);

  return (
    <div className="bg-white rounded-2xl border border-slate-300 p-6 sm:p-8 min-h-[480px]">
      <h2 className="text-2xl font-bold text-slate-900 mb-6 pb-4 border-b border-slate-300 flex items-center gap-2.5">
        <FaHistory className="text-[#0052cc]" /> AI Chat History
      </h2>
      <div className="space-y-4">
        {sessions.map(s => (
          <div key={s._id} className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
            <h3 className="font-bold">{s.title}</h3>
            <p className="text-xs text-gray-500">{new Date(s.createdAt).toLocaleString()}</p>
          </div>
        ))}
        {sessions.length === 0 && <p className="text-gray-500">No chat history available.</p>}
      </div>
    </div>
  );
};

export default ChatHistoryPage;
