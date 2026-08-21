import React, { useState, useEffect } from 'react';
import { FaRobot, FaPlus, FaRegTrashAlt, FaSearch, FaHistory, FaDownload, FaBookmark, FaRegBookmark } from 'react-icons/fa';
import AssistantPanel from '../../components/dashboard/AssistantPanel';
import { getSessions, deleteSession, getSession } from '../../services/assistant.service';
import { useToast } from '../../hooks/useToast';

const AIAssistantPage = () => {
  const { addToast } = useToast();
  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const loadSessions = async () => {
    try {
      setIsLoading(true);
      const res = await getSessions();
      if (res.success && Array.isArray(res.sessions)) {
        setSessions(res.sessions);
      }
    } catch (err) {
      console.error("Failed to load sessions:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSessions();
  }, []);

  const handleNewChat = () => {
    setActiveSessionId(null);
  };

  const handleDeleteSession = async (e, id) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this chat history?")) {
      try {
        await deleteSession(id);
        if (activeSessionId === id) {
          setActiveSessionId(null);
        }
        loadSessions();
      } catch (err) {
        console.error("Failed to delete session", err);
      }
    }
  };

  const filteredSessions = sessions.filter(s => 
    s.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white rounded-2xl border border-slate-300 overflow-hidden flex flex-col md:flex-row h-[750px] shadow-sm">
      
      {/* Sidebar - History */}
      <div className="w-full md:w-72 border-r border-slate-300 bg-slate-50 flex flex-col shrink-0">
        
        {/* Sidebar Header */}
        <div className="p-4 border-b border-slate-200">
          <button 
            onClick={handleNewChat}
            className="w-full py-2.5 px-4 bg-white border border-slate-300 hover:border-[#0052cc] hover:text-[#0052cc] text-slate-700 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
          >
            <FaPlus className="w-3 h-3" /> New Chat
          </button>
        </div>

        {/* Search */}
        <div className="p-3">
          <div className="relative">
            <FaSearch className="absolute left-3 top-2.5 text-slate-400 w-3 h-3" />
            <input 
              type="text" 
              placeholder="Search history..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-[#0052cc] focus:ring-1 focus:ring-[#0052cc]/20 transition-all text-slate-700"
            />
          </div>
        </div>

        {/* Sessions List */}
        <div className="flex-grow overflow-y-auto p-2 space-y-1">
          <div className="px-2 py-1 flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 mt-1">
            <FaHistory className="w-3 h-3" /> Recent Chats
          </div>
          
          {isLoading ? (
            <div className="text-center p-4 text-xs text-slate-400">Loading history...</div>
          ) : filteredSessions.length === 0 ? (
            <div className="text-center p-4 text-xs text-slate-400">No chat history found.</div>
          ) : (
            filteredSessions.map(session => (
              <div 
                key={session._id}
                onClick={() => setActiveSessionId(session._id)}
                className={`group flex items-center justify-between p-3 rounded-xl cursor-pointer transition-colors ${
                  activeSessionId === session._id 
                    ? 'bg-blue-50 border border-blue-200 text-[#0052cc]' 
                    : 'bg-transparent border border-transparent hover:bg-white hover:border-slate-200 text-slate-700'
                }`}
              >
                <div className="flex flex-col truncate pr-2">
                  <span className="text-xs font-bold truncate">{session.title}</span>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {new Date(session.updatedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                  </span>
                </div>
                <button 
                  onClick={(e) => handleDeleteSession(e, session._id)}
                  className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 p-1.5 rounded-md hover:bg-red-50 transition-all cursor-pointer border-none bg-transparent"
                  title="Delete chat"
                >
                  <FaRegTrashAlt className="w-3 h-3" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-grow flex flex-col bg-slate-50/50">
        
        {/* Top Header */}
        <div className="h-14 border-b border-slate-200 bg-white flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-2 text-slate-800">
            <FaRobot className="text-[#0052cc] w-4 h-4" />
            <h2 className="text-sm font-bold">Policy Assistant Hub</h2>
          </div>
          {activeSessionId && (
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold text-slate-500 hover:text-[#0052cc] hover:bg-blue-50 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-blue-100">
                <FaRegBookmark className="w-3 h-3" /> Bookmark
              </button>
              <button 
                onClick={() => addToast("Chat exported successfully!", 'success')}
                className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold text-slate-500 hover:text-[#0052cc] hover:bg-blue-50 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-blue-100"
              >
                <FaDownload className="w-3 h-3" /> Export
              </button>
            </div>
          )}
        </div>

        {/* Chat Panel */}
        <div className="flex-grow p-4 sm:p-6 overflow-hidden flex flex-col">
          <AssistantPanel 
            key={activeSessionId || 'new'} 
            propSessionId={activeSessionId}
            onSessionCreated={(id) => {
              setActiveSessionId(id);
              loadSessions();
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default AIAssistantPage;
