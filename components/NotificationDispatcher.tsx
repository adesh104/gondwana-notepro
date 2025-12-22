
import React, { useEffect, useState } from 'react';

interface NotificationDispatcherProps {
  onComplete: () => void;
  recipientName: string;
  action: string;
}

const NotificationDispatcher: React.FC<NotificationDispatcherProps> = ({ onComplete, recipientName, action }) => {
  const [emailProgress, setEmailProgress] = useState(0);
  const [smsProgress, setSmsProgress] = useState(0);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setEmailProgress(p => (p < 100 ? p + 2 : 100));
      setSmsProgress(p => (p < 100 ? p + 3 : 100));
    }, 30);

    const stepTimer = setInterval(() => {
      setStep(s => s + 1);
    }, 800);

    const closeTimer = setTimeout(() => {
      onComplete();
    }, 3500);

    return () => {
      clearInterval(timer);
      clearInterval(stepTimer);
      clearTimeout(closeTimer);
    };
  }, [onComplete]);

  const steps = [
    "Establishing Secure Handshake...",
    "Encrypting Statutory Content...",
    "Connecting to SMS Gateway...",
    "SMTP Protocol Synchronized...",
    "Dispatched Successfully."
  ];

  return (
    <div className="fixed inset-0 z-[1000] bg-slate-950/95 backdrop-blur-3xl flex items-center justify-center p-6 animate-in fade-in duration-500">
      <div className="max-w-md w-full space-y-12">
        <div className="text-center space-y-4">
          <div className="relative inline-block">
             <div className="w-24 h-24 bg-blue-600 rounded-[2rem] flex items-center justify-center text-white shadow-[0_0_50px_rgba(37,99,235,0.4)] animate-pulse">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
             </div>
             <div className="absolute -top-2 -right-2 w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center text-slate-950 font-black text-xs shadow-xl border-4 border-slate-950">!</div>
          </div>
          <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Notification Engine</h2>
          <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.5em]">Statutory Dispatch in Progress</p>
        </div>

        <div className="space-y-8">
          <div className="space-y-3">
             <div className="flex justify-between items-end">
                <span className="text-[9px] font-black text-white uppercase tracking-widest">Email Gateway</span>
                <span className="text-[9px] font-black text-blue-400 tabular-nums">{emailProgress}%</span>
             </div>
             <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)] transition-all duration-300 ease-out" style={{ width: `${emailProgress}%` }}></div>
             </div>
          </div>

          <div className="space-y-3">
             <div className="flex justify-between items-end">
                <span className="text-[9px] font-black text-white uppercase tracking-widest">SMS Protocol</span>
                <span className="text-[9px] font-black text-amber-500 tabular-nums">{smsProgress}%</span>
             </div>
             <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.5)] transition-all duration-300 ease-out" style={{ width: `${smsProgress}%` }}></div>
             </div>
          </div>
        </div>

        <div className="p-8 bg-white/5 rounded-[2.5rem] border border-white/10 text-center">
           <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Current Task</p>
           <p className="text-sm font-bold text-white italic animate-in fade-in slide-in-from-bottom-2">
             {steps[Math.min(step, steps.length - 1)]}
           </p>
           <p className="mt-4 text-[8px] font-black text-blue-400 uppercase tracking-widest">
             Recipient: {recipientName}
           </p>
        </div>

        <div className="flex justify-center gap-10 opacity-20">
           <div className="flex flex-col items-center gap-2">
              <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
              <span className="text-[7px] font-black uppercase tracking-widest">SMTP</span>
           </div>
           <div className="flex flex-col items-center gap-2">
              <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
              <span className="text-[7px] font-black uppercase tracking-widest">SMPP</span>
           </div>
           <div className="flex flex-col items-center gap-2">
              <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
              <span className="text-[7px] font-black uppercase tracking-widest">AES-256</span>
           </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationDispatcher;
