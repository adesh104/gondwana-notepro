
import React, { useState } from 'react';
import { UNIVERSITY_NAME } from '../constants';

interface LandingPageProps {
  onEnterPortal: () => void;
  onShowManual: () => void;
  onShowPresentation: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onEnterPortal, onShowManual, onShowPresentation }) => {
  const [restrictedMsg, setRestrictedMsg] = useState<string | null>(null);

  const triggerError = (e: React.MouseEvent) => {
    e.preventDefault();
    setRestrictedMsg("RESTRICTED ACCESS: This statutory section requires Phase II Administrative Clearance.");
    setTimeout(() => setRestrictedMsg(null), 4000);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col selection:bg-amber-100 selection:text-amber-900 font-sans relative">
      
      {/* Global Restricted Access Alert */}
      {restrictedMsg && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[200] w-full max-w-lg px-6 animate-in slide-in-from-top-4 duration-300">
           <div className="bg-[#0c2340] border-l-4 border-amber-500 p-5 rounded-2xl shadow-2xl shadow-black/40 flex items-start gap-4 backdrop-blur-md">
              <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-500 shrink-0">
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              </div>
              <div>
                 <p className="text-amber-500 text-[9px] font-black uppercase tracking-[0.3em] mb-1">Security Alert</p>
                 <p className="text-white text-[11px] font-bold leading-relaxed">{restrictedMsg}</p>
              </div>
              <button onClick={() => setRestrictedMsg(null)} className="ml-auto text-white/30 hover:text-white transition-colors">
                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
           </div>
        </div>
      )}

      {/* Statutory Header Ticker */}
      <div className="bg-[#0c2340] text-amber-400 py-2.5 px-6 overflow-hidden hidden md:block border-b border-amber-500/20">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-8">
            <span className="text-[9px] font-black uppercase tracking-[0.3em] flex items-center">
              <span className="w-2 h-2 bg-amber-500 rounded-full mr-3 animate-pulse shadow-[0_0_10px_rgba(245,158,11,0.8)]"></span>
              Statutory Portal Active
            </span>
            <div className="h-4 w-[1px] bg-amber-500/20"></div>
            <p className="text-[9px] font-bold uppercase tracking-widest text-white/80">
              Gondwana University Digital Secretariat: Processing Phase III Academic Dispatches. Designed by Dr. Krishna Karoo.
            </p>
          </div>
          <div className="flex gap-6">
             <a href="#" onClick={triggerError} className="text-[9px] font-black uppercase tracking-widest hover:text-white transition-colors">Official Gazette</a>
             <a href="#" onClick={triggerError} className="text-[9px] font-black uppercase tracking-widest hover:text-white transition-colors">Governance Standards</a>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <header className="sticky top-0 z-[100] bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
          <div className="flex items-center space-x-5">
            <div className="relative group">
               <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 to-blue-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
               <div className="relative w-14 h-14 bg-[#0c2340] rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-xl">G</div>
            </div>
            <div className="flex flex-col">
              <span className="font-black text-lg lg:text-xl tracking-tighter text-slate-900 uppercase leading-none">Gondwana NotePro</span>
              <span className="text-[9px] uppercase tracking-[0.4em] font-black text-blue-800 mt-1.5 flex items-center gap-2">
                <span className="w-1 h-1 bg-amber-500 rounded-full"></span>
                Institutional Secretariat
              </span>
            </div>
          </div>
          
          <div className="hidden xl:flex items-center gap-10">
            <nav className="flex gap-8 text-[9px] font-black uppercase tracking-widest text-slate-500">
              <div className="relative group/nav">
                <button onClick={triggerError} className="hover:text-blue-900 transition-colors py-2 flex items-center gap-1">Academics <svg className="w-2 h-2" fill="currentColor" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg></button>
              </div>
              <a href="#" onClick={triggerError} className="hover:text-blue-900 transition-colors py-2">Examinations</a>
              <a href="#" onClick={triggerError} className="hover:text-blue-900 transition-colors py-2">Research</a>
              <a href="#" onClick={triggerError} className="hover:text-blue-900 transition-colors py-2">IQAC</a>
              <a href="#" onClick={triggerError} className="hover:text-blue-900 transition-colors py-2">Affiliated Units</a>
              <a href="#" onClick={triggerError} className="hover:text-blue-900 transition-colors py-2">Archives</a>
            </nav>
            <div className="h-8 w-[1px] bg-slate-200 mx-2"></div>
            <button 
              onClick={onEnterPortal}
              className="px-8 py-3.5 bg-[#0c2340] text-amber-400 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-blue-900 hover:text-white transition-all shadow-2xl hover:shadow-blue-900/20 active:scale-95 border border-amber-500/30"
            >
              Portal Login
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Cinematic Hero Section */}
        <section className="relative min-h-[90vh] flex items-center overflow-hidden">
          {/* Immersive Background */}
          <div className="absolute inset-0 z-0 bg-slate-900">
             <img 
               src="https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&q=80&w=2000" 
               className="w-full h-full object-cover"
               alt="Gondwana University Campus"
             />
             <div className="absolute inset-0 bg-gradient-to-r from-[#0c2340] via-[#0c2340]/95 to-blue-900/40"></div>
          </div>

          <div className="max-w-7xl mx-auto px-6 relative z-10 w-full py-20">
            <div className="flex flex-col lg:flex-row items-center gap-20">
              
              <div className="flex-1 space-y-10">
                <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-amber-500/10 backdrop-blur-xl border border-amber-500/20 rounded-full">
                   <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                   <p className="text-[10px] font-black text-amber-400 uppercase tracking-[0.4em]">Integrated E-Workflow System</p>
                </div>
                
                <h1 className="text-6xl lg:text-[7.5rem] font-black text-white tracking-tighter leading-[0.85] uppercase">
                  Gondwana <br/>
                  <span className="text-shine italic">NotePro.</span>
                </h1>
                
                <p className="text-xl text-blue-100/70 max-w-xl leading-relaxed font-medium border-l-4 border-amber-500/30 pl-8">
                  The elite digital nerve-center for statutory decision-making at Gondwana University. Engineered by <span className="text-white font-bold underline underline-offset-4 decoration-amber-500">Dr. Krishna Karoo</span> for total transparency and administrative precision.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-5 pt-8">
                  <button 
                    onClick={onEnterPortal}
                    className="px-12 py-6 bg-amber-50 text-[#0c2340] rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-[0_20px_50px_-10px_rgba(245,158,11,0.4)] hover:bg-white hover:text-blue-900 hover:-translate-y-1 transition-all active:scale-95 flex items-center gap-3"
                  >
                    Launch Workspace
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                  </button>
                  <button 
                    onClick={onShowPresentation} 
                    className="group px-12 py-6 bg-amber-500 text-[#0c2340] border border-amber-600 rounded-2xl font-black text-xs uppercase tracking-[0.3em] hover:bg-white hover:text-blue-900 hover:-translate-y-1 transition-all flex items-center gap-3 shadow-2xl"
                  >
                    Statutory Report
                    <div className="w-8 h-8 bg-[#0c2340] rounded-lg flex items-center justify-center text-amber-500 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                       <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg>
                    </div>
                  </button>
                </div>
              </div>

              {/* Realistic Note Sheet Photo-Visual */}
              <div className="flex-1 w-full max-w-lg hidden lg:block">
                 <div className="relative group">
                    <div className="absolute -inset-10 bg-amber-500/10 rounded-full blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                    
                    <div className="relative transform group-hover:-translate-y-8 group-hover:rotate-2 transition-all duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)]">
                       <div className="absolute top-4 left-4 right-4 bottom-[-16px] bg-white/50 backdrop-blur-sm rounded-[2rem] border border-white/20 -z-10 transform -rotate-2"></div>
                       
                       <div className="bg-[#e8f5e9] rounded-[2.5rem] shadow-2xl overflow-hidden border border-emerald-100/50 flex flex-col aspect-[3.5/4.5] relative">
                          <div className="absolute inset-0 opacity-40 pointer-events-none mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')]"></div>
                          <div className="absolute top-0 left-16 bottom-0 w-[2px] bg-rose-500/20"></div>

                          <div className="p-10 pb-6 border-b border-emerald-900/5 bg-[#f1f8f1] text-center space-y-4">
                             <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white font-black text-xl mx-auto shadow-lg">G</div>
                             <div className="space-y-1">
                                <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest leading-none">GONDWANA UNIVERSITY</p>
                                <p className="text-[7px] font-bold text-slate-500 uppercase tracking-[0.2em]">Administrative Note-Sheet</p>
                             </div>
                          </div>

                          <div className="p-12 space-y-6 flex-1">
                             <div className="flex items-center gap-4">
                                <div className="h-3 w-1/4 bg-emerald-900/10 rounded-full"></div>
                                <div className="h-3 w-1/2 bg-emerald-900/5 rounded-full"></div>
                             </div>
                             <div className="space-y-4 pt-4">
                                <div className="h-2 w-full bg-emerald-900/05 rounded-full border-b border-emerald-900/10 pb-4"></div>
                                <div className="h-2 w-full bg-emerald-900/05 rounded-full border-b border-emerald-900/10 pb-4"></div>
                                <div className="h-2 w-5/6 bg-emerald-900/05 rounded-full border-b border-emerald-900/10 pb-4"></div>
                                <div className="h-2 w-full bg-emerald-900/05 rounded-full border-b border-emerald-900/10 pb-4"></div>
                             </div>
                             
                             <div className="absolute bottom-12 right-12 scale-110">
                                <div className="official-stamp stamp-approved -rotate-12 border-[3px] py-1 px-4 text-xs font-black shadow-sm">
                                   APPROVED
                                </div>
                             </div>
                          </div>

                          <div className="absolute top-12 right-0 bg-blue-900 text-white text-[9px] font-black px-5 py-2 rounded-l-2xl shadow-xl flex items-center gap-3">
                             <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-ping"></span>
                             GU/DIGITAL/DISPATCH-2025
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Grid with Detailed Report Style */}
        <section className="py-32 bg-white relative">
           <div className="max-w-7xl mx-auto px-6">
              <div className="text-center mb-24">
                 <p className="text-amber-600 text-[11px] font-black uppercase tracking-[0.6em] mb-4">Detailed System Audit</p>
                 <h3 className="text-5xl lg:text-6xl font-black text-slate-900 tracking-tighter uppercase mb-8">Imperial Infrastructure</h3>
                 <div className="h-2.5 w-40 bg-amber-500 mx-auto rounded-full"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                 {[
                   { 
                     title: 'Sovereign Personnel Portal', 
                     img: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800', 
                     desc: 'Highly secure authentication gateway for all academic heads, deans, and statutory officers of the university.' 
                   },
                   { 
                     title: 'Encrypted Statutory Registry', 
                     img: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&q=80&w=800', 
                     desc: 'Permanent digital repository of all approved note-sheets, governed by advanced browser-level AES encryption.' 
                   },
                   { 
                     title: 'Intelligent Dispatch Engine', 
                     img: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=800', 
                     desc: 'A real-time routing layer that tracks the movement of statutory files across various institutional nodes with zero latency.' 
                   }
                 ].map((card, i) => (
                   <div key={i} onClick={triggerError} className="group relative overflow-hidden rounded-[3.5rem] bg-[#0c2340] aspect-[3/4] cursor-pointer shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] hover:shadow-2xl transition-all duration-700">
                      <img src={card.img} className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-110 group-hover:opacity-30 transition-all duration-[2000ms]" alt={card.title} />
                      <div className="absolute inset-0 bg-gradient-to-t from-blue-950 via-blue-950/40 to-transparent"></div>
                      <div className="absolute inset-0 p-12 flex flex-col justify-end">
                         <div className="w-12 h-1.5 bg-amber-500 rounded-full mb-6 group-hover:w-20 transition-all duration-700"></div>
                         <h4 className="text-3xl font-black text-white uppercase tracking-tighter mb-4 group-hover:text-amber-400 transition-colors leading-tight">{card.title}</h4>
                         <p className="text-[12px] font-bold text-blue-200/60 uppercase tracking-widest leading-relaxed opacity-0 group-hover:opacity-100 translate-y-6 group-hover:translate-y-0 transition-all duration-700 delay-100">{card.desc}</p>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </section>

        {/* Detailed Point-Wise Report Section */}
        <section className="py-32 bg-slate-50 border-y border-slate-200">
           <div className="max-w-5xl mx-auto px-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                 <div className="space-y-10">
                    <h3 className="text-4xl font-black uppercase tracking-tighter text-slate-900 leading-none">Administrative <br/><span className="text-amber-600">Impact Report</span></h3>
                    <div className="space-y-8">
                       {[
                         { label: "Efficiency Gain", val: "70%", desc: "Reduction in file transit time across university sections." },
                         { label: "Cost Reduction", val: "90%", desc: "Decrease in recurring stationery and courier expenditures." },
                         { label: "Data Integrity", val: "100%", desc: "Immutable audit trail for every statutory remark." }
                       ].map((stat, i) => (
                         <div key={i} className="flex gap-6 items-start">
                            <div className="text-4xl font-black text-slate-900 tabular-nums">{stat.val}</div>
                            <div className="space-y-1 pt-1">
                               <p className="text-[11px] font-black uppercase tracking-widest text-slate-950">{stat.label}</p>
                               <p className="text-[12px] text-slate-500 font-medium leading-relaxed">{stat.desc}</p>
                            </div>
                         </div>
                       ))}
                    </div>
                 </div>
                 <div className="bg-white p-12 rounded-[3.5rem] shadow-2xl border border-slate-100 relative">
                    <div className="absolute top-10 right-10 w-24 h-24 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center shadow-inner">
                       <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <div className="space-y-6 pt-10">
                       <p className="text-[11px] font-black text-amber-600 uppercase tracking-[0.5em]">System Developer Profile</p>
                       <h4 className="text-2xl font-black text-slate-950 uppercase tracking-tight">Dr. Krishna Karoo</h4>
                       <p className="text-sm font-bold text-slate-500 uppercase tracking-widest leading-loose">
                         Assistant Professor<br/>
                         Post Graduate Teaching Dept. of Computer Science<br/>
                         Gondwana University, Gadchiroli
                       </p>
                       <div className="h-[1px] w-20 bg-slate-200"></div>
                       <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest italic">
                         "NotePro represents a paradigm shift in how we approach statutory transparency and institutional memory."
                       </p>
                    </div>
                 </div>
              </div>
           </div>
        </section>
      </main>

      {/* Enhanced Footer with Dr. Karoo's Signature Branding */}
      <footer className="bg-slate-950 text-white pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-6">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-20 mb-32">
              <div className="space-y-8">
                 <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center text-[#0c2340] font-black text-2xl shadow-2xl">G</div>
                    <span className="font-black text-lg uppercase tracking-widest">Gondwana <br/><span className="text-amber-500">NotePro</span></span>
                 </div>
                 <p className="text-[11px] font-bold text-slate-500 uppercase leading-loose tracking-widest">
                   The Statutory University of Gadchiroli District, fostering excellence in higher education and digital governance since 2011. Designed & Developed by Dr. Krishna Karoo.
                 </p>
              </div>

              <div>
                 <h5 className="text-[11px] font-black text-amber-500 uppercase tracking-[0.4em] mb-10">Governance Node</h5>
                 <ul className="space-y-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                    <li><a href="#" onClick={triggerError} className="hover:text-white transition-all hover:translate-x-1 block">Statutes & Ordinance</a></li>
                    <li><a href="#" onClick={triggerError} className="hover:text-white transition-all hover:translate-x-1 block">Official Gazettes</a></li>
                    <li><a href="#" onClick={triggerError} className="hover:text-white transition-all hover:translate-x-1 block">RTI Dashboard</a></li>
                    <li><a href="#" onClick={triggerError} className="hover:text-white transition-all hover:translate-x-1 block">Digital Audit</a></li>
                 </ul>
              </div>

              <div>
                 <h5 className="text-[11px] font-black text-amber-500 uppercase tracking-[0.4em] mb-10">Academic Units</h5>
                 <ul className="space-y-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                    <li><a href="#" onClick={triggerError} className="hover:text-white transition-all hover:translate-x-1 block">Board of Studies</a></li>
                    <li><a href="#" onClick={triggerError} className="hover:text-white transition-all hover:translate-x-1 block">Examinations Cell</a></li>
                    <li><a href="#" onClick={triggerError} className="hover:text-white transition-all hover:translate-x-1 block">Ph.D. Registry</a></li>
                    <li><a href="#" onClick={triggerError} className="hover:text-white transition-all hover:translate-x-1 block">Research Grant</a></li>
                 </ul>
              </div>

              <div>
                 <h5 className="text-[11px] font-black text-amber-500 uppercase tracking-[0.4em] mb-10">Support Cell</h5>
                 <ul className="space-y-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                    <li><a href="#" onClick={triggerError} className="hover:text-white transition-all hover:translate-x-1 block">Technical Helpdesk</a></li>
                    <li><a href="#" onClick={triggerError} className="hover:text-white transition-all hover:translate-x-1 block">Privacy Charter</a></li>
                    <li><button onClick={onShowManual} className="hover:text-white transition-all hover:translate-x-1 block text-left">User Operational Manual</button></li>
                    <li><a href="#" onClick={triggerError} className="hover:text-white transition-all hover:translate-x-1 block">ICT Governance Policy</a></li>
                 </ul>
              </div>
           </div>

           <div className="pt-20 border-t border-white/5 flex flex-col items-center gap-10">
              <div className="text-center space-y-4">
                <p className="text-[10px] font-black uppercase tracking-[0.6em] text-slate-600">
                  © 2025 Gondwana University, Gadchiroli
                </p>
                <p className="text-[12px] font-bold text-slate-500 uppercase tracking-[0.3em] max-w-4xl leading-loose">
                  Architected & Engineered by <span className="text-shine font-black text-base ml-2">Dr. Krishna Karoo</span><br/>
                  Assistant Professor, Post Graduate Teaching Department of Computer Science, Gondwana University, Gadchiroli
                </p>
              </div>
              <div className="flex gap-8 opacity-20">
                 <div className="px-6 py-2.5 border-2 border-white rounded-xl text-[11px] font-black tracking-widest uppercase">NAAC A+ Accredited</div>
                 <div className="px-6 py-2.5 border-2 border-white rounded-xl text-[11px] font-black tracking-widest uppercase">Digital India Initiative</div>
              </div>
           </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
