import React, { useState } from 'react';
import { FaRobot, FaPaperPlane, FaTimes } from 'react-icons/fa';

const FloatingAIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'ai', text: "Hello! I am your Policy Assistant. Ask me anything about the Comprehensive Data Privacy & Security Framework (DPSF) 2024." }
  ]);
  const [inputText, setInputText] = useState("");

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMessage = { sender: 'user', text: inputText };
    setMessages(prev => [...prev, userMessage]);
    setInputText("");

    // Simulate AI response
    setTimeout(() => {
      let reply = "I can help clarify details of this framework. For example, compliance requirements, breach notifications, and scope exceptions.";
      if (inputText.toLowerCase().includes("breach") || inputText.toLowerCase().includes("notification")) {
        reply = "Under Section 7.2 of the DPSF 2024, entities must report any data breaches to the regulatory authority within 72 hours of discovery.";
      } else if (inputText.toLowerCase().includes("exception") || inputText.toLowerCase().includes("scope")) {
        reply = "Exceptions apply to personal or household use, domestic activities, and law enforcement agencies under specific judicial warrants.";
      } else if (inputText.toLowerCase().includes("download") || inputText.toLowerCase().includes("document")) {
        reply = "You can download the Privacy Notice Template and Cyber Security Audit Form directly from the Required Documents panel on the page.";
      }
      setMessages(prev => [...prev, { sender: 'ai', text: reply }]);
    }, 800);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Window Popup */}
      {isOpen && (
        <div className="w-80 sm:w-96 h-[450px] bg-white rounded-2xl border border-slate-200 shadow-2xl flex flex-col mb-4 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-255">
          {/* Chat Header */}
          <div className="bg-[#0052cc] text-white px-5 py-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <FaRobot className="w-4 h-4 text-white" />
              <span className="text-xs sm:text-sm font-bold uppercase tracking-wider">Policy Assistant</span>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white transition-colors cursor-pointer bg-transparent border-none"
            >
              <FaTimes className="w-4 h-4" />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-grow p-4 overflow-y-auto space-y-3.5 bg-slate-50/50">
            {messages.map((msg, i) => (
              <div 
                key={i} 
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed shadow-sm font-medium ${
                    msg.sender === 'user' 
                      ? 'bg-[#0052cc] text-white rounded-tr-none' 
                      : 'bg-white text-slate-700 rounded-tl-none border border-slate-100'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <form 
            onSubmit={handleSendMessage}
            className="p-3 border-t border-slate-200 bg-white flex items-center gap-2 shrink-0"
          >
            <input 
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask a question..."
              className="flex-grow px-3 py-2 text-xs sm:text-sm border border-slate-200 focus:border-[#0052cc] rounded-xl focus:outline-none font-medium"
            />
            <button 
              type="submit"
              className="w-9 h-9 bg-[#0052cc] hover:bg-[#0047b3] text-white flex items-center justify-center rounded-xl shrink-0 transition-colors cursor-pointer border-none"
            >
              <FaPaperPlane className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}

      {/* Floating Pill Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="h-11 px-5 bg-[#0052cc] hover:bg-[#0047b3] text-white flex items-center gap-2 rounded-full shadow-lg shadow-blue-500/25 hover:shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer border-none"
      >
        <FaRobot className="w-4 h-4" />
        <span className="text-xs font-black tracking-wide uppercase select-none">
          Ask Policy Assistant
        </span>
      </button>
    </div>
  );
};

export default FloatingAIAssistant;
