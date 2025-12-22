
import React from 'react';

interface UserManualProps {
  onBack: () => void;
}

const UserManual: React.FC<UserManualProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-[#020617] text-white flex flex-col font-sans">
      {/* Immersive Header */}
      <header className="sticky top-0 z-[100] bg-[#0c2340]/80 backdrop-blur-xl border-b border-white/10 px-8 py-6 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center text-[#0c2340] font-black text-xl shadow-xl rotate-3">G</div>
          <div>
            <h1 className="text-lg font-black uppercase tracking-tight">Institutional Workspace Protocol</h1>
            <p className="text-[10px] font-black text-amber-500 uppercase tracking-[0.3em]">Operational Manual v1.5 • Statutory Grade</p>
          </div>
        </div>
        <button 
          onClick={onBack}
          className="px-6 py-2.5 bg-white/5 border border-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-2 group"
        >
          <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Exit Manual
        </button>
      </header>

      {/* Manual Content */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-20">
        <div className="space-y-32">
          
          {/* Section 01: Core Architecture */}
          <section className="relative group">
            <div className="absolute -left-12 top-0 text-[100px] font-black text-white/5 leading-none select-none">01</div>
            <div className="relative pt-12">
               <h2 className="text-shine text-3xl font-black uppercase tracking-tighter mb-8">Statutory Authentication</h2>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-6">
                    <p className="text-blue-100/70 text-base leading-relaxed font-medium">
                      Access to the NotePro ecosystem is strictly governed by institutional credentials. Each statutory officer is assigned a unique <span className="text-white font-black">Staff Identifier</span> linked to their designated office.
                    </p>
                    <ul className="space-y-4">
                       <li className="flex gap-4">
                          <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 shrink-0">1</div>
                          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide leading-relaxed">Officials must use the 'Staff' tab to enter their secure passphrase and ID.</p>
                       </li>
                       <li className="flex gap-4">
                          <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 shrink-0">2</div>
                          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide leading-relaxed">The 'Public' tab allows external stakeholders to verify documents using the statutory Reference Number.</p>
                       </li>
                    </ul>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-10 flex items-center justify-center">
                     <div className="w-full max-w-xs space-y-4">
                        <div className="h-2 w-1/3 bg-blue-500/20 rounded-full"></div>
                        <div className="h-12 w-full bg-white/5 rounded-2xl border border-white/10"></div>
                        <div className="h-12 w-full bg-white/5 rounded-2xl border border-white/10"></div>
                        <div className="h-12 w-full bg-blue-600 rounded-2xl flex items-center justify-center text-[10px] font-black uppercase tracking-widest">Verify Identity</div>
                     </div>
                  </div>
               </div>
            </div>
          </section>

          {/* Section 02: The Digital Green Sheet */}
          <section className="relative group">
            <div className="absolute -left-12 top-0 text-[100px] font-black text-white/5 leading-none select-none">02</div>
            <div className="relative pt-12">
               <h2 className="text-shine text-3xl font-black uppercase tracking-tighter mb-8">Drafting The Green Sheet</h2>
               <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-[3rem] p-12 lg:p-16">
                  <div className="flex flex-col lg:flex-row gap-16">
                     <div className="flex-1 space-y-8">
                        <div>
                           <h4 className="text-emerald-400 text-xs font-black uppercase tracking-[0.3em] mb-4">Statutory Drafting</h4>
                           <p className="text-emerald-100/60 leading-relaxed font-medium">The 'Green Sheet' is the cornerstone of university administration. When initiating a note:</p>
                        </div>
                        <div className="space-y-4">
                           <div className="p-6 bg-emerald-500/10 rounded-2xl border border-emerald-500/10">
                              <h5 className="text-white text-xs font-black uppercase mb-2">Subject Precision</h5>
                              <p className="text-[10px] text-emerald-100/40 uppercase font-bold tracking-widest">The subject should be in block capitals, clearly identifying the department and core request.</p>
                           </div>
                           <div className="p-6 bg-indigo-500/10 rounded-2xl border border-indigo-500/10">
                              <h5 className="text-indigo-400 text-xs font-black uppercase mb-2">AI-Assisted Refinement</h5>
                              <p className="text-[10px] text-indigo-100/40 uppercase font-bold tracking-widest">Utilize the "Refine with AI" tool to transform rough notes into statutory grade administrative prose.</p>
                           </div>
                        </div>
                     </div>
                     <div className="flex-1 flex items-center justify-center">
                        <div className="relative w-full max-w-sm aspect-[4/5] bg-[#e8f5e9] rounded-[2rem] shadow-2xl p-10">
                           <div className="absolute top-0 left-12 bottom-0 w-[1.5px] bg-rose-500/10"></div>
                           <div className="space-y-4 pt-10">
                              <div className="h-2 w-3/4 bg-slate-900/10 rounded-full"></div>
                              <div className="h-2 w-full bg-slate-900/5 rounded-full"></div>
                              <div className="h-2 w-full bg-slate-900/5 rounded-full"></div>
                              <div className="h-2 w-2/3 bg-slate-900/5 rounded-full"></div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          </section>

          {/* Section 03: Workflow Sovereignty */}
          <section className="relative group">
            <div className="absolute -left-12 top-0 text-[100px] font-black text-white/5 leading-none select-none">03</div>
            <div className="relative pt-12">
               <h2 className="text-shine text-3xl font-black uppercase tracking-tighter mb-8">Statutory Workflow Actions</h2>
               <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {[
                    { label: 'Forward', color: 'blue', desc: 'Routes the file to the next statutory level for perusal.' },
                    { label: 'Return', color: 'amber', desc: 'Dispatches the file back to the initiator for corrections.' },
                    { label: 'Approve', color: 'emerald', desc: 'Finalizes the proposal and applies the Digital Seal.' },
                    { label: 'Reject', color: 'rose', desc: 'Terminates the proposal and archives the dispatch.' }
                  ].map((action, idx) => (
                    <div key={idx} className="p-8 bg-white/5 border border-white/10 rounded-3xl hover:border-white/20 transition-all">
                       <div className={`w-10 h-10 rounded-xl mb-6 flex items-center justify-center bg-${action.color}-500/20 text-${action.color}-400`}>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                       </div>
                       <h4 className="text-white text-sm font-black uppercase tracking-widest mb-2">{action.label}</h4>
                       <p className="text-[10px] font-bold text-slate-500 uppercase leading-relaxed tracking-widest">{action.desc}</p>
                    </div>
                  ))}
               </div>
            </div>
          </section>

          {/* Section 04: Administrative Sovereignty */}
          <section className="relative group">
            <div className="absolute -left-12 top-0 text-[100px] font-black text-white/5 leading-none select-none">04</div>
            <div className="relative pt-12">
               <h2 className="text-shine text-3xl font-black uppercase tracking-tighter mb-8">Administrative Registry</h2>
               <div className="p-12 bg-[#0c2340] rounded-[3rem] border border-white/10 flex flex-col lg:flex-row gap-12 items-center">
                  <div className="flex-1 space-y-6">
                     <h4 className="text-amber-500 text-xs font-black uppercase tracking-[0.3em]">Institutional Control</h4>
                     <p className="text-blue-100/70 leading-relaxed font-medium">Administrators have sovereign control over the university registry:</p>
                     <ul className="space-y-4">
                        <li className="flex items-center gap-4 group/li">
                           <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                           <span className="text-[11px] font-black text-white uppercase tracking-widest group-hover/li:translate-x-2 transition-transform">Enroll Statutory Personnel with ID/Photo</span>
                        </li>
                        <li className="flex items-center gap-4 group/li">
                           <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                           <span className="text-[11px] font-black text-white uppercase tracking-widest group-hover/li:translate-x-2 transition-transform">Define Institutional Department Units</span>
                        </li>
                        <li className="flex items-center gap-4 group/li">
                           <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                           <span className="text-[11px] font-black text-white uppercase tracking-widest group-hover/li:translate-x-2 transition-transform">Update Official University Seal (Logo)</span>
                        </li>
                     </ul>
                  </div>
                  <div className="w-64 h-64 bg-white/5 rounded-[2.5rem] border border-white/10 flex items-center justify-center group-hover:rotate-12 transition-transform duration-1000">
                     <svg className="w-24 h-24 text-amber-500/20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
                  </div>
               </div>
            </div>
          </section>

        </div>
      </main>

      {/* Footer Acknowledgement */}
      <footer className="py-20 border-t border-white/5 bg-black/40">
        <div className="max-w-5xl mx-auto px-6 text-center space-y-4">
          <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.5em]">End of Manual</p>
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-relaxed">
            Statutory Compliance Issued by <span className="text-shine font-black">Dr. Krishna Karoo</span><br/>
            Computer Science Department • Gondwana University, Gadchiroli
          </div>
          <button 
            onClick={onBack}
            className="mt-12 px-12 py-5 bg-white text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-amber-500 transition-all shadow-2xl active:scale-95"
          >
            Acknowledge & Exit
          </button>
        </div>
      </footer>
    </div>
  );
};

export default UserManual;
