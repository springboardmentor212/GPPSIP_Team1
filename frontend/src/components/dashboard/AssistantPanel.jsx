import React, { useState, useRef, useEffect } from 'react';
import { FaPaperPlane, FaRobot, FaUser } from 'react-icons/fa';

const AssistantPanel = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'assistant',
      text: 'Hello! I am your AI Policy Assistant. How can I help you discover government benefits today?',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputVal, setInputVal] = useState('');
  const messagesEndRef = useRef(null);

  const suggestionChips = [
    "PM Kisan status",
    "Scholarship eligibility",
    "Women welfare schemes"
  ];

  const handleSend = (textToSend) => {
    const val = textToSend || inputVal;
    if (!val.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: val,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal('');

    // Simulate AI response after 1 second
    setTimeout(() => {
      let aiText = "Thank you for asking. Based on your profile location (Maharashtra) and role, you qualify for several state-specific policies. Let me fetch details...";
      if (val.toLowerCase().includes('kisan')) {
        aiText = "Under PM Kisan Samman Nidhi, eligible landholding farmer families receive ₹6,000 per year. Since you are registered in Maharashtra, you are also eligible for the Namo Shetkari Mahasanman Nidhi Yojana providing an additional ₹6,000 yearly.";
      } else if (val.toLowerCase().includes('scholarship')) {
        aiText = "For education, the Government of Maharashtra offers Post-Matric Scholarships for OBC/SC/ST students. Ensure you have your Caste Certificate and Income Statement ready to apply.";
      } else if (val.toLowerCase().includes('women') || val.toLowerCase().includes('welfare')) {
        aiText = "Several initiatives like the Mahila Samman Saving Certificate and Maharashtra State's Majhi Ladki Bahin Yojana offer high interest savings and monthly assistance to eligible females.";
      }

      const aiMsg = {
        id: Date.now() + 1,
        sender: 'assistant',
        text: aiText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, aiMsg]);
    }, 1000);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="bg-white rounded-2xl border-2 border-blue-100 shadow-md overflow-hidden flex flex-col h-[520px]">
      
      {/* Header section with avatar and status */}
      <div className="p-4 bg-gradient-to-r from-blue-50/50 to-indigo-50/20 border-b border-blue-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#0052cc] flex items-center justify-center relative shadow-inner">
            <FaRobot className="w-5 h-5" />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white"></span>
          </div>
          <div>
            <h4 className="text-sm font-extrabold text-slate-800 leading-none">Policy Assistant</h4>
            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wide leading-none mt-1 inline-block">Online</span>
          </div>
        </div>
      </div>

      {/* Messages Scrolling Container */}
      <div className="flex-grow p-4 overflow-y-auto space-y-3.5 bg-slate-50/40">
        {messages.map((msg) => {
          const isAi = msg.sender === 'assistant';
          return (
            <div key={msg.id} className={`flex items-end gap-2.5 ${!isAi ? 'flex-row-reverse' : ''}`}>
              
              {/* Message Bubble */}
              <div className={`max-w-[80%] rounded-2xl p-3 shadow-sm text-xs sm:text-[13px] leading-relaxed ${
                isAi 
                  ? 'bg-white border border-slate-200 text-slate-800 rounded-bl-none' 
                  : 'bg-[#0052cc] text-white rounded-br-none font-medium'
              }`}>
                <p>{msg.text}</p>
                <span className={`block text-[9px] mt-1.5 text-right ${isAi ? 'text-slate-400 font-light' : 'text-blue-200'}`}>
                  {msg.time}
                </span>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggestion Chips */}
      <div className="p-3 bg-slate-50/80 border-t border-slate-100 flex flex-wrap gap-1.5">
        {suggestionChips.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(chip)}
            className="px-2.5 py-1 bg-white border border-slate-200 hover:border-blue-300 hover:text-[#0052cc] text-slate-600 rounded-full text-[10px] font-bold shadow-xs transition-colors shrink-0 cursor-pointer"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Input area */}
      <div className="p-3 border-t border-slate-100 bg-white">
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(); }} 
          className="flex items-center gap-2 relative bg-slate-50 border border-slate-250 rounded-xl p-1 focus-within:ring-2 focus-within:ring-blue-500/10 focus-within:bg-white focus-within:border-[#0052cc] transition-all"
        >
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Type your message..."
            className="flex-grow pl-3 pr-2 py-2 text-xs focus:outline-none bg-transparent text-slate-800"
          />
          <button
            type="submit"
            className="w-8 h-8 rounded-lg bg-[#0052cc] hover:bg-[#0047b3] text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
          >
            <FaPaperPlane className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>

    </div>
  );
};

export default AssistantPanel;
