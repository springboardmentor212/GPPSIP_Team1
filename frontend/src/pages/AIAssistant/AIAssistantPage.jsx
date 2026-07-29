import React from 'react';
import { FaRobot } from 'react-icons/fa';
import AssistantPanel from '../../components/dashboard/AssistantPanel';

const AIAssistantPage = () => {
  return (
    <div className="bg-white rounded-2xl border border-slate-300 p-6 sm:p-8 min-h-[480px]">
      <h2 className="text-2xl font-bold text-slate-900 mb-6 pb-4 border-b border-slate-300 flex items-center gap-2.5">
        <FaRobot className="text-[#0052cc]" /> AI Assistant Hub
      </h2>
      <div className="max-w-3xl mx-auto mt-4">
        <AssistantPanel />
      </div>
    </div>
  );
};

export default AIAssistantPage;
