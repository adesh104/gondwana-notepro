
import React, { useState, useMemo } from 'react';
import { Staff, NoteSheet, NoteStatus } from '../types';

interface LoginProps {
  onLogin: (staff: Staff) => void;
  staffList: Staff[];
  notes: NoteSheet[];
  onPublicDownload: (note: NoteSheet) => void;
  onBack: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, staffList, notes, onPublicDownload, onBack }) => {
  const [activeTab, setActiveTab] = useState<'STAFF' | 'PUBLIC'>('STAFF');
  const [staffId, setStaffId] = useState('');
  const [password, setPassword] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Enhanced Public Logic: Find multiple matches for fuzzy search
  const searchResults = useMemo(() => {
    if (activeTab !== 'PUBLIC' || !searchQuery.trim() || searchQuery.length < 3) return [];
    
    const term = searchQuery.toLowerCase();
    return notes.filter(n => 
      (n.status === NoteStatus.APPROVED || n.status === NoteStatus.REJECTED) && 
      (n.referenceNo.toLowerCase().includes(term) || n.subject.toLowerCase().includes(term))
    );
  }, [notes, searchQuery, activeTab]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    setTimeout(() => {
      const staff = staffList.find(s => s.id.toLowerCase() === staffId.toLowerCase() && s.password === password);
      if (staff) {
        onLogin(staff);
      } else {
        setError('Authorization Denied: Invalid Credentials');
      }
      setIsSubmitting(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#0c2340] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2"></div>

      <div className="absolute top-4 left-0 right-0 px-6 flex justify-between items-center z-50">
        <button onClick={onBack} className="flex items-center gap-2 text-white/50 hover:text-white transition-all group py-1">
          <div className="w-6 h-6 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-all">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          </div>
          <span className="text-[7px] font-black uppercase tracking-[0.2em]">Return</span>
        </button>
        <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1 rounded-full border border-white/10">
           <span className="w-1 h-1 rounded-full bg-amber-500 animate-pulse"></span>
           <span className="text-[7px] font-black text-amber-500 uppercase tracking-widest">Secure Server</span>
        </div>
      </div>

      <div className="w-full max-w-[380px] relative z-10">
        <div className="text-center mb-6">
          <div className="inline-flex relative p-2 mb-2">
             <div className="relative w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center shadow-xl">
                <span className="text-[#0c2340] text-xl font-black">G</span>
             </div>
          </div>
          <h1 className="text-sm font-black text-white tracking-[0.2em] uppercase">
            Gondwana <span className="text-amber-500">NotePro</span>
          </h1>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/20 animate-in zoom-in-95 duration-500">
          <div className="flex p-1 bg-slate-50 border-b border-slate-100">
             <button onClick={() => { setActiveTab('STAFF'); setError(''); setSearchQuery(''); }} className={`flex-1 py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === 'STAFF' ? 'bg-white text-blue-900 shadow-sm ring-1 ring-slate-200' : 'text-slate-400 hover:text-slate-600'}`}>Staff Core</button>
             <button onClick={() => { setActiveTab('PUBLIC'); setError(''); setSearchQuery(''); }} className={`flex-1 py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === 'PUBLIC' ? 'bg-white text-blue-900 shadow-sm ring-1 ring-slate-200' : 'text-slate-400 hover:text-slate-600'}`}>Public Verify</button>
          </div>

          <div className="p-7">
            {activeTab === 'STAFF' ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1 block">Staff Identifier</label>
                  <input type="text" value={staffId} onChange={(e) => setStaffId(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-blue-500 transition-all text-slate-900 font-bold text-[12px] placeholder:text-slate-300" placeholder="ENTER ID" required />
                </div>
                <div className="space-y-1">
                  <label className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1 block">Security Pass</label>
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-blue-500 transition-all text-slate-900 font-bold text-[12px] placeholder:text-slate-300" placeholder="••••" required />
                </div>
                {error && <div className="p-3 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl text-[8px] font-black uppercase tracking-widest text-center">{error}</div>}
                <button type="submit" disabled={isSubmitting} className="w-full py-4 bg-[#0c2340] text-amber-500 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] shadow-xl hover:bg-blue-900 active:scale-[0.98] transition-all">{isSubmitting ? 'Verifying...' : 'Authenticate 👁‍🗨'}</button>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1 block">Search statutory registry</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-blue-500 transition-all text-slate-900 font-bold text-[12px] placeholder:text-slate-300"
                      placeholder="REF NO / SUBJECT..."
                    />
                    <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                  </div>
                </div>

                <div className="max-h-[220px] overflow-y-auto custom-scrollbar space-y-3 pr-1">
                  {searchQuery.length > 0 && searchQuery.length < 3 && (
                    <p className="text-center text-[8px] font-black text-slate-300 uppercase tracking-widest py-4">Enter min. 3 characters...</p>
                  )}
                  {searchQuery.length >= 3 && searchResults.length === 0 && (
                    <p className="text-center text-[8px] font-black text-rose-400 uppercase tracking-widest py-4">No verified records found</p>
                  )}
                  {searchResults.map(note => (
                    <div key={note.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl group hover:border-blue-500 transition-all">
                       <div className="flex justify-between items-start mb-2">
                          <span className={`text-[7px] font-black px-1.5 py-0.5 rounded uppercase ${note.status === NoteStatus.APPROVED ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>{note.status}</span>
                          <span className="text-[7px] font-black text-slate-300">{new Date(note.dateInitiated).toLocaleDateString()}</span>
                       </div>
                       <h4 className="text-slate-900 font-black text-[10px] uppercase leading-tight line-clamp-1 mb-3">{note.subject}</h4>
                       <button 
                         onClick={() => onPublicDownload(note)}
                         className="w-full bg-[#0c2340] text-white py-2 rounded-xl font-black text-[8px] uppercase tracking-widest hover:bg-blue-600 transition-all"
                       >
                         View Registry Item
                       </button>
                    </div>
                  ))}
                  {!searchQuery && (
                    <div className="text-center py-8 opacity-40">
                       <svg className="w-10 h-10 mx-auto text-slate-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                       <p className="text-[9px] font-black uppercase tracking-widest">Awaiting Enquiry</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          
          <div className="px-7 pb-6 text-center">
             <div className="h-[1px] w-full bg-slate-100 mb-3"></div>
             <p className="text-[7px] font-black text-slate-300 uppercase tracking-[0.3em] italic">Statutory Encryption Protocols Active</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
