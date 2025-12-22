
import React, { useState, useEffect } from 'react';
import { UNIVERSITY_NAME } from '../constants';
import { Staff } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  user: Staff;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, user, onLogout }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#f1f5f9]">
      <header className="bg-slate-950 text-white shadow-2xl sticky top-0 z-[60] border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-24 flex items-center justify-between">
          <div className="flex items-center space-x-5">
            <div className="relative group cursor-pointer">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
              <div className="relative w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-slate-950 font-black text-2xl rotate-3 shadow-lg group-hover:rotate-0 transition-transform">
                G
              </div>
            </div>
            <div>
              <h1 className="text-lg lg:text-xl font-black tracking-tighter leading-none uppercase flex items-center gap-2">
                Gondwana NotePro
                <span className="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded border border-blue-500/20 font-black tracking-widest">v2.5</span>
              </h1>
              <p className="text-[9px] text-blue-500 uppercase tracking-[0.4em] font-black mt-1 opacity-80">Digital Statutory Workspace</p>
            </div>
          </div>

          {/* MAXIMISED CLOCK INTERFACE */}
          <div className="hidden md:flex items-center px-10 border-x border-white/5 mx-6 gap-5">
             <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.6)]"></div>
             <div className="flex flex-col justify-center">
                <span className="text-3xl lg:text-4xl font-black text-white tracking-tighter uppercase tabular-nums leading-none">
                  {time.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </span>
                <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em] mt-1.5 leading-none">
                  {time.toLocaleDateString('en-IN', { weekday: 'long', day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()}
                </span>
             </div>
          </div>

          <div className="flex items-center space-x-4 lg:space-x-8">
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:flex flex-col">
                <p className="text-sm font-black tracking-tight text-white">{user.name}</p>
                <p className="text-[9px] text-blue-400 font-bold uppercase tracking-widest leading-none mt-1">{user.designation}</p>
              </div>
              <div className="w-11 h-11 rounded-xl overflow-hidden border-2 border-blue-600/30 bg-slate-900 flex items-center justify-center shadow-2xl relative group cursor-help">
                {user.photo ? (
                  <img src={user.photo} alt={user.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                ) : (
                  <span className="text-blue-500 font-black text-sm uppercase">{user.name.charAt(0)}</span>
                )}
                <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-xl"></div>
              </div>
            </div>
            <button 
              onClick={onLogout}
              className="p-3 bg-white/5 border border-white/10 rounded-xl text-slate-400 hover:text-white hover:bg-rose-600 hover:border-rose-500 transition-all active:scale-95 group shadow-lg"
              title="Terminate Secure Session"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
        {children}
      </main>

      <footer className="bg-white border-t border-slate-200 py-12 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/20 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center gap-8">
          <div className="text-center max-w-4xl space-y-4">
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.6em]">Statutory Administrative Ecosystem</p>
             <p className="text-[11px] font-bold text-slate-600 uppercase tracking-[0.1em] leading-relaxed px-6">
                Designed & Engineered by <span className="text-shine font-black text-base ml-1">Dr. Krishna Karoo</span><br/>
                <span className="text-[9px] text-slate-400">Assistant Professor, PG Teaching Department of Computer Science</span><br/>
                <span className="text-slate-900 font-black tracking-widest mt-1 block">GONDWANA UNIVERSITY, GADCHIROLI — 2025</span>
             </p>
          </div>
          <div className="flex flex-wrap justify-center gap-10 opacity-60">
             <span className="text-[9px] font-black uppercase tracking-[0.3em] hover:text-blue-600 transition-colors cursor-pointer border-b border-transparent hover:border-blue-600 pb-1">Governance Charter</span>
             <span className="text-[9px] font-black uppercase tracking-[0.3em] hover:text-blue-600 transition-colors cursor-pointer border-b border-transparent hover:border-blue-600 pb-1">ICT Compliance</span>
             <span className="text-[9px] font-black uppercase tracking-[0.3em] hover:text-blue-600 transition-colors cursor-pointer border-b border-transparent hover:border-blue-600 pb-1">Digital Sovereign</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
