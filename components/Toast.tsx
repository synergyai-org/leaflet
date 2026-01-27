
import React from 'react';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
}

const Toast: React.FC<ToastProps> = ({ message, type }) => {
  return (
    <div className={`fixed bottom-10 left-1/2 -translate-x-1/2 z-[500] px-8 py-4 rounded-full shadow-2xl backdrop-blur-md border transition-all animate-bounce ${
      type === 'success' 
        ? 'bg-[#B0925A]/20 border-[#B0925A]/40 text-[#B0925A]' 
        : 'bg-red-500/20 border-red-500/40 text-red-400'
    }`}>
      <div className="flex items-center gap-3">
        <div className={`w-2 h-2 rounded-full ${type === 'success' ? 'bg-[#B0925A]' : 'bg-red-500'}`}></div>
        <p className="text-xs font-bold tracking-[2px] uppercase">{message}</p>
      </div>
    </div>
  );
};

export default Toast;
