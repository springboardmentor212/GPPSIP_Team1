import React from 'react';

const NotificationAction = ({ text, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="text-xs font-black text-[#0052cc] hover:text-[#0047b3] hover:underline cursor-pointer select-none bg-transparent border-none shrink-0"
    >
      {text}
    </button>
  );
};

export default NotificationAction;
