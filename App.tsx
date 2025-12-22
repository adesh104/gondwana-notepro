
import React, { useState, useEffect, useRef, useMemo } from 'react';
import Layout from './components/Layout';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import AdminPanel from './components/AdminPanel';
import HistoryTimeline from './components/HistoryTimeline';
import UserManual from './components/UserManual';
import Presentation from './components/Presentation';
import AIAgent from './components/AIAgent';
import NotificationDispatcher from './components/NotificationDispatcher';
import { MOCK_STAFF, UNIVERSITY_NAME, INITIAL_DEPARTMENTS } from './constants';
import { NoteSheet, NoteStatus, Staff, WorkflowAction, UserRole, Attachment, UniversitySettings } from './types';
import { refineNoteContent, suggestRemark } from './services/geminiService';
import { dbService, STORES } from './services/dbService';

const App: React.FC = () => {
  const [appState, setAppState] = useState<'LANDING' | 'LOGIN' | 'PORTAL' | 'PUBLIC_VIEW' | 'USER_MANUAL' | 'PRESENTATION'>('LANDING');
  const [currentUser, setCurrentUser] = useState<Staff | null>(null);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [showMobileList, setShowMobileList] = useState(false);
  const [isPrintMode, setIsPrintMode] = useState(false);
  
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [notes, setNotes] = useState<NoteSheet[]>([]);
  const [departments, setDepartments] = useState<string[]>([]);
  const [universityLogo, setUniversityLogo] = useState<string | undefined>(undefined);
  const [isDbLoaded, setIsDbLoaded] = useState(false);
  const [dbStatus, setDbStatus] = useState<'CONNECTING' | 'SECURE' | 'ERROR'>('CONNECTING');
  
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [selectedRecipient, setSelectedRecipient] = useState<string>('');
  const [remark, setRemark] = useState('');
  const [aiWorking, setAiWorking] = useState(false);
  const [suggestingRemark, setSuggestingRemark] = useState(false);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [showPrintHelp, setShowPrintHelp] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  // Simplified Statutory Filtering
  const [registrySearchTerm, setRegistrySearchTerm] = useState('');
  const [registryFilter, setRegistryFilter] = useState<'IN_TRAY' | 'OUT_TRAY' | 'ALL_HITS'>('IN_TRAY');

  const [isDispatching, setIsDispatching] = useState<{ active: boolean, recipient: string, action: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedNote = useMemo(() => {
    return notes.find(n => n.id === selectedNoteId) || null;
  }, [notes, selectedNoteId]);

  // Registry Engine: Directional Filtering Logic
  const filteredUserNotes = useMemo(() => {
    if (!currentUser) return [];
    
    // Global subset of notes relevant to this user
    let baseNotes = notes.filter(n => 
      n.currentHandler.id === currentUser.id || 
      n.creator.id === currentUser.id || 
      n.history.some(h => h.from.id === currentUser.id || h.to.id === currentUser.id)
    );

    // Apply Functional Filters
    if (registryFilter === 'IN_TRAY') {
      // Strictly files on user's desk (not Approved/Rejected)
      baseNotes = baseNotes.filter(n => 
        n.currentHandler.id === currentUser.id && 
        n.status !== NoteStatus.APPROVED && 
        n.status !== NoteStatus.REJECTED
      );
    } else if (registryFilter === 'OUT_TRAY') {
      // Files handled by user but currently elsewhere (not Approved/Rejected)
      baseNotes = baseNotes.filter(n => 
        n.currentHandler.id !== currentUser.id && 
        n.history.some(h => h.from.id === currentUser.id) &&
        n.status !== NoteStatus.APPROVED && 
        n.status !== NoteStatus.REJECTED
      );
    } 
    // ALL_HITS shows everything (including Approved/Rejected)

    // Apply Search Overlay
    if (registrySearchTerm.trim()) {
      const term = registrySearchTerm.toLowerCase();
      baseNotes = baseNotes.filter(n => 
        n.subject.toLowerCase().includes(term) || 
        n.referenceNo.toLowerCase().includes(term) ||
        n.creator.name.toLowerCase().includes(term) ||
        n.currentHandler.name.toLowerCase().includes(term)
      );
    }

    return baseNotes;
  }, [notes, currentUser, registryFilter, registrySearchTerm]);

  const stats = useMemo(() => {
    if (!currentUser) return { inTray: 0, outTray: 0, allHits: 0 };
    
    const inTray = notes.filter(n => 
      n.currentHandler.id === currentUser.id && 
      n.status !== NoteStatus.APPROVED && 
      n.status !== NoteStatus.REJECTED
    ).length;

    const outTray = notes.filter(n => 
      n.currentHandler.id !== currentUser.id && 
      n.history.some(h => h.from.id === currentUser.id) &&
      n.status !== NoteStatus.APPROVED && 
      n.status !== NoteStatus.REJECTED
    ).length;

    const allHits = notes.filter(n => 
      n.currentHandler.id === currentUser.id || 
      n.creator.id === currentUser.id || 
      n.history.some(h => h.from.id === currentUser.id || h.to.id === currentUser.id)
    ).length;

    return { inTray, outTray, allHits };
  }, [notes, currentUser]);

  useEffect(() => {
    const initData = async () => {
      try {
        await dbService.init();
        let loadedStaff = await dbService.getAll<Staff>(STORES.STAFF);
        let loadedNotes = await dbService.getAll<NoteSheet>(STORES.NOTES);
        let loadedDepts = await dbService.getAll<string>(STORES.DEPARTMENTS);
        let loadedSettings = await dbService.get<UniversitySettings>(STORES.SETTINGS, 'main');

        if (loadedStaff.length === 0) {
          for (const s of MOCK_STAFF) await dbService.put(STORES.STAFF, s);
          loadedStaff = MOCK_STAFF;
        }
        if (loadedDepts.length === 0) {
          await dbService.saveAllDepartments(INITIAL_DEPARTMENTS);
          loadedDepts = INITIAL_DEPARTMENTS;
        }

        setStaffList(loadedStaff);
        setNotes(loadedNotes.sort((a, b) => new Date(b.dateInitiated).getTime() - new Date(a.dateInitiated).getTime()));
        setDepartments(loadedDepts.sort());
        if (loadedSettings && loadedSettings.logo) setUniversityLogo(loadedSettings.logo);
        setIsDbLoaded(true);
        setDbStatus('SECURE');
      } catch (err) {
        setDbStatus('ERROR');
        setErrorMsg("Critical: Database connection failed.");
      }
    };
    initData();
  }, []);

  const handleLogin = (staff: Staff) => { setCurrentUser(staff); setAppState('PORTAL'); };
  const handleLogout = () => { setCurrentUser(null); setAppState('LANDING'); setSelectedNoteId(null); setShowAdminPanel(false); };
  const handlePublicDownload = (note: NoteSheet) => { setSelectedNoteId(note.id); setAppState('PUBLIC_VIEW'); };

  const handleAddStaff = async (newStaff: Staff) => { await dbService.put(STORES.STAFF, newStaff); setStaffList(prev => [...prev, newStaff]); };
  const handleUpdateStaff = async (updatedStaff: Staff) => { await dbService.put(STORES.STAFF, updatedStaff); setStaffList(prev => prev.map(s => s.id === updatedStaff.id ? updatedStaff : s)); };
  const handleDeleteStaff = async (staffId: string) => { await dbService.delete(STORES.STAFF, staffId); setStaffList(prev => prev.filter(s => s.id !== staffId)); };
  const handleAddDepartment = async (dept: string) => { if (!departments.includes(dept)) { const newDepts = [...departments, dept].sort(); await dbService.saveAllDepartments(newDepts); setDepartments(newDepts); } };
  const handleDeleteDepartment = async (dept: string) => { const newDepts = departments.filter(d => d !== dept); await dbService.saveAllDepartments(newDepts); setDepartments(newDepts); };
  const handleUpdateLogo = async (logo: string) => { await dbService.put(STORES.SETTINGS, { id: 'main', universityName: UNIVERSITY_NAME, logo }); setUniversityLogo(logo); };

  const handleCreateNew = () => { 
    setIsCreating(true); 
    setSelectedNoteId(null); 
    setShowAdminPanel(false); 
    setShowMobileList(false); 
    setSubject(''); 
    setContent(''); 
    setAttachments([]); 
    setSelectedRecipient(''); 
    setRemark(''); 
    setRegistrySearchTerm('');
    setRegistryFilter('IN_TRAY');
  };

  const handleAIAssist = async () => {
    if (!content || !subject) return;
    setAiWorking(true);
    try { const refined = await refineNoteContent(content, subject); setContent(refined); } 
    catch (e) { setErrorMsg("AI refinement failed."); setTimeout(() => setErrorMsg(null), 5000); } 
    finally { setAiWorking(false); }
  };

  const handleSuggestRemark = async (type: 'forward' | 'return') => {
    if (!selectedNote) return;
    setSuggestingRemark(true);
    try { const suggestion = await suggestRemark(selectedNote.content, type); setRemark(suggestion); } 
    catch (e) { setErrorMsg("Remark suggestion failed."); setTimeout(() => setErrorMsg(null), 5000); } 
    finally { setSuggestingRemark(false); }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach((file: File) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const newAttachment: Attachment = { id: Math.random().toString(36).substr(2, 9), name: file.name, type: file.type, size: file.size, data: event.target?.result as string };
        setAttachments(prev => [...prev, newAttachment]);
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const removePendingAttachment = (id: string) => { setAttachments(prev => prev.filter(a => a.id !== id)); };

  const getDeptCode = (dept: string): string => {
    const map: Record<string, string> = { 'Administration': 'ADM', 'Registrar Office': 'REG', 'Finance Section': 'FIN', 'Examination Section': 'EXM', 'Academic Section': 'ACAD' };
    if (map[dept]) return map[dept];
    return dept.replace(/^Department of\s+/i, '').substring(0, 3).toUpperCase();
  };

  const handleInitiate = async () => {
    if (!subject || !content || !selectedRecipient || !currentUser) return;
    const recipient = staffList.find(s => s.id === selectedRecipient);
    if (!recipient) return;
    const deptCode = getDeptCode(currentUser.department);
    const newNote: NoteSheet = {
      id: `NS-${Math.floor(Math.random() * 100000)}`,
      subject: subject.toUpperCase(),
      content,
      referenceNo: `GU/${deptCode}/${new Date().getFullYear()}/${Math.floor(Math.random() * 9000) + 1000}`,
      dateInitiated: new Date().toISOString(),
      status: NoteStatus.PENDING,
      creator: currentUser,
      currentHandler: recipient,
      attachments: [...attachments],
      history: [{ id: Math.random().toString(36).substr(2, 9), from: currentUser, to: recipient, timestamp: new Date().toISOString(), remark: remark || 'Note sheet initiated.', action: WorkflowAction.INITIATE, notificationsSent: { email: true, sms: true } }]
    };
    setIsDispatching({ active: true, recipient: recipient.name, action: 'Initiation' });
    await dbService.put(STORES.NOTES, newNote);
    setNotes(prev => [newNote, ...prev]);
    setIsCreating(false);
    setSelectedNoteId(newNote.id);
  };

  const handleWorkflowAction = async (action: WorkflowAction) => {
    if (!selectedNote || !currentUser) return;
    
    if (selectedNote.status === NoteStatus.APPROVED || selectedNote.status === NoteStatus.REJECTED) {
      setErrorMsg("Security Violation: Accessing archived statutory records for modification is restricted.");
      setTimeout(() => setErrorMsg(null), 5000);
      return;
    }

    let recipient: Staff | undefined;
    if (action === WorkflowAction.APPROVE || action === WorkflowAction.REJECT) recipient = selectedNote.creator;
    else {
      if (!selectedRecipient) { setErrorMsg("Please select a target official."); setTimeout(() => setErrorMsg(null), 5000); return; }
      recipient = staffList.find(s => s.id === selectedRecipient);
    }
    if (!recipient) return;
    const updatedNote: NoteSheet = {
      ...selectedNote,
      status: action === WorkflowAction.APPROVE ? NoteStatus.APPROVED : action === WorkflowAction.REJECT ? NoteStatus.REJECTED : action === WorkflowAction.RETURN ? NoteStatus.RETURNED : NoteStatus.PENDING,
      currentHandler: recipient,
      attachments: [...(selectedNote.attachments || []), ...attachments],
      history: [...selectedNote.history, { id: Math.random().toString(36).substr(2, 9), from: currentUser, to: recipient, timestamp: new Date().toISOString(), remark: remark || (action === WorkflowAction.APPROVE ? 'Approved.' : 'Forwarded.'), action, notificationsSent: { email: true, sms: true } }]
    };
    setIsDispatching({ active: true, recipient: recipient.name, action: action });
    await dbService.put(STORES.NOTES, updatedNote);
    setNotes(prev => prev.map(n => n.id === updatedNote.id ? updatedNote : n));
    setRemark(''); setSelectedRecipient(''); setAttachments([]);
    
    // Critical: Close file on workflow completion to reflect tray change
    setSelectedNoteId(null);
  };

  const triggerPrint = () => {
    // Automatically transition to a clean, full-screen view suitable for browsers native print
    setIsPrintMode(true);
    
    // Attempt to trigger the print dialog. In sandboxed iframes, this may be ignored,
    // hence the explicit instruction overlay provided in the UI below.
    setTimeout(() => { 
      try { 
        window.print(); 
      } catch (e) { 
        console.warn("Print dialog could not be initiated automatically due to sandbox restrictions.", e);
      } 
    }, 800);
  };

  const renderNoteSheet = (note: NoteSheet, isPublic: boolean = false) => (
    <div className={`printable-file bg-white rounded-[1.5rem] shadow-2xl border border-slate-200 overflow-hidden relative paper-texture mx-auto ${isPublic ? 'max-w-[95vw] lg:max-w-[1200px] xl:max-w-[1400px]' : 'max-w-5xl'} ${isPrintMode ? 'my-0 shadow-none border-none rounded-none w-full !max-w-full' : ''}`}>
      {!isPrintMode && (
        <div className="absolute top-0 left-0 w-8 h-full bg-slate-100 border-r border-slate-200 z-10 flex flex-col items-center justify-around py-20 opacity-30">
          {[...Array(12)].map((_, i) => <div key={i} className="w-3 h-3 bg-white border border-slate-300 rounded-full shadow-inner"></div>)}
        </div>
      )}

      <div className="letter-head p-4 lg:p-6 border-b-2 border-slate-900 text-center bg-white relative z-20">
         <div className="flex flex-col items-center">
            <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center overflow-hidden mb-1 shadow-md border border-slate-100">
               {universityLogo ? <img src={universityLogo} alt="GU Logo" className="w-full h-full object-contain p-1" /> : <div className="w-full h-full bg-slate-900 flex items-center justify-center text-white font-black text-xl rotate-3">G</div>}
            </div>
            <h1 className="text-xl lg:text-3xl font-black text-slate-900 tracking-tighter uppercase leading-none mb-0.5">{UNIVERSITY_NAME}</h1>
            <p className="text-[7px] font-bold text-slate-600 uppercase tracking-widest leading-none">(Statutory State University — Maharashtra Public Universities Act, 2016)</p>
            <div className="h-[1px] w-32 bg-slate-900 my-1.5"></div>
            <p className="text-[11px] font-black text-slate-950 uppercase tracking-[0.1em] italic mb-0.5 underline underline-offset-2 decoration-slate-400">{note.creator.department}</p>
            <p className="text-[7px] font-black text-slate-500 uppercase tracking-widest">M.I.D.C. Road, Complex, Gadchiroli - 442 605</p>
         </div>
      </div>

      <div className="official-header p-4 lg:px-14 py-4 border-b border-slate-200 bg-slate-50/60 relative z-20">
         <div className="flex justify-between items-start w-full mb-2">
            <div className="text-left">
              <span className="bg-slate-950 text-white text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-md">FILE NO: {note.referenceNo}</span>
            </div>
            <div className="text-right">
              <span className="text-slate-900 text-[9px] font-black uppercase tracking-widest border-b-2 border-slate-300 pb-0.5">DATED: {new Date(note.dateInitiated).toLocaleDateString('en-GB')}</span>
            </div>
         </div>
         <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-3 mt-4">
            <h2 className="text-xl lg:text-3xl font-black text-slate-950 tracking-tight leading-tight uppercase official-font underline underline-offset-4 decoration-slate-200">{note.subject}</h2>
            <div className={`px-5 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest border shadow-sm ${note.status === NoteStatus.APPROVED ? 'bg-emerald-50 text-emerald-800 border-emerald-600' : note.status === NoteStatus.REJECTED ? 'bg-rose-50 text-rose-800 border-rose-600' : 'bg-blue-50 text-blue-700 border-blue-600'}`}>{note.status}</div>
         </div>
      </div>

      <div className="green-sheet-container bg-white relative z-10">
        <div className={`green-sheet p-8 lg:p-20 text-xl lg:text-2xl text-slate-950 official-font whitespace-pre-wrap ${isPublic ? 'leading-[3rem]' : 'leading-[2.4rem]'} ${isPrintMode ? '!px-[1.2in] !py-[0.8in]' : ''}`}>
           <div className="statutory-watermark">
              {universityLogo ? <img src={universityLogo} className="w-full h-full object-contain" /> : <div className="text-[140px] font-black opacity-20 text-slate-900">GONDWANA</div>}
           </div>

           <div className="remark-para relative border-b border-slate-200/50 pb-4 mb-4 text-justify">
              <div className="absolute -left-16 top-0 text-[9px] font-black text-slate-300 uppercase tracking-[0.4em] rotate-[-90deg] origin-bottom-left whitespace-nowrap opacity-60">PARA 1</div>
              <span className="font-bold text-slate-900 border-b border-slate-900/10 mr-3">Note:</span>
              {note.content}
              <div className="flex justify-end mt-4">
                 <div className="signature-block text-right leading-none">
                    <div className="inline-block px-3 py-1 bg-slate-900 text-white rounded text-[7px] font-black uppercase tracking-widest mb-1.5 shadow-sm">INITIATED</div>
                    <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest mb-1">Digitally Authenticated</p>
                    <p className="text-xl font-black text-slate-950 uppercase tracking-tighter mb-1">{note.creator.name}</p>
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.1em]">{note.creator.designation}</p>
                 </div>
              </div>
           </div>

           <div className="space-y-4">
              {note.history.filter(h => h.action !== WorkflowAction.INITIATE).map((entry, idx) => (
                <div key={entry.id} className="remark-para relative border-b border-slate-200/50 pb-4 mb-4 text-justify">
                   <div className="absolute -left-16 top-0 text-[9px] font-black text-slate-300 uppercase tracking-[0.4em] rotate-[-90deg] origin-bottom-left whitespace-nowrap opacity-60">PARA {idx + 2}</div>
                   <div className="text-xl lg:text-2xl text-slate-900 italic border-l-4 border-slate-100 pl-8 py-1 mb-2 bg-slate-50/[0.3] leading-relaxed relative">
                      "{entry.remark || "Forwarded for perusal."}"
                   </div>
                   {(entry.action === WorkflowAction.APPROVE || entry.action === WorkflowAction.REJECT) && (
                     <div className="flex justify-center my-4">
                        <div className={`official-stamp ${entry.action === WorkflowAction.APPROVE ? 'stamp-approved scale-110' : 'stamp-rejected scale-110'}`}>
                           {entry.action === WorkflowAction.APPROVE ? 'APPROVED' : 'REJECTED'}
                        </div>
                     </div>
                   )}
                   <div className="flex justify-end mt-4">
                      <div className="signature-block text-right leading-none">
                         <div className={`inline-block px-3 py-1 rounded text-[7px] font-black uppercase tracking-widest mb-1.5 shadow-sm ${
                            entry.action === WorkflowAction.APPROVE ? 'bg-emerald-600 text-white' :
                            entry.action === WorkflowAction.REJECT ? 'bg-rose-600 text-white' :
                            entry.action === WorkflowAction.RETURN ? 'bg-amber-500 text-white' : 'bg-slate-950 text-white'
                         }`}>{entry.action}</div>
                         <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest mb-1">Digitally Signed By</p>
                         <p className="text-xl font-black text-slate-950 uppercase tracking-tighter mb-1">{entry.from.name}</p>
                         <p className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.1em]">{entry.from.designation}</p>
                      </div>
                   </div>
                </div>
              ))}
           </div>

           {note.attachments && note.attachments.length > 0 && (
             <div className="mt-12 pt-6 border-t-2 border-slate-950">
               <h4 className="text-[12px] font-black text-slate-950 uppercase tracking-[0.3em] mb-6">Statutory Enclosures</h4>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                 {note.attachments.map((file) => (
                   <a key={file.id} href={file.data} download={file.name} className="flex items-center gap-4 p-4 bg-white border border-slate-200 rounded-xl hover:border-blue-600 transition-all group no-print shadow-sm">
                     <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                     </div>
                     <div className="min-w-0">
                       <p className="text-[10px] font-black text-slate-900 truncate uppercase tracking-tight">{file.name}</p>
                       <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{(file.size / 1024).toFixed(1)} KB</p>
                     </div>
                   </a>
                 ))}
               </div>
             </div>
           )}

           <div className="mt-16 pt-6 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 opacity-40 select-none">
              <div className="text-[9px] font-black uppercase tracking-[0.5em]">Page 01 • GONDWANA UNIVERSITY • STATUTORY DIGITAL ARCHIVE</div>
              <div className="flex gap-6 items-center">
                 <div className="text-[9px] font-bold uppercase text-right leading-tight">Digital Auth:<br/><span className="text-[11px] font-black">{note.referenceNo}</span></div>
                 <div className="w-12 h-12 bg-slate-900 flex items-center justify-center text-white text-[6px] font-black text-center p-2 rounded-md">
                   VALID<br/>AUTHENTIC
                 </div>
              </div>
           </div>
        </div>
      </div>

      <div className="no-print p-8 bg-slate-950 flex flex-col md:flex-row justify-between items-center gap-6 relative z-30">
         <div className="flex items-center gap-6">
            <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-white border border-white/10 shadow-2xl backdrop-blur-md">
               {universityLogo ? <img src={universityLogo} className="w-full h-full object-contain p-2" /> : <svg className="w-7 h-7 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            </div>
            <div>
               <p className="text-[9px] font-black text-blue-500 uppercase tracking-[0.5em] mb-1">Archive Core Verification</p>
               <p className="text-sm font-black text-white uppercase tracking-widest">Registry State: <span className="text-blue-400 italic">IMMUTABLE ARCHIVE</span></p>
            </div>
         </div>
         <div className="flex gap-6 w-full md:w-auto">
            {isPublic && (
              <button onClick={() => setAppState('LOGIN')} className="flex-1 md:flex-initial px-10 py-5 bg-white/5 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-white/10 transition-all border border-white/10 active:scale-95">Close View</button>
            )}
            <button onClick={triggerPrint} className="flex-1 md:flex-initial px-12 py-5 bg-blue-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-blue-500 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 shadow-2xl">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
              Verify & Download
            </button>
         </div>
      </div>
      {isPrintMode && (
        <>
          <button onClick={() => setIsPrintMode(false)} className="no-print fixed top-8 right-8 z-[500] px-8 py-4 bg-slate-950 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl hover:bg-blue-600 transition-all active:scale-95">Exit Statutory Clean View</button>
          
          {/* SANDBOX PRINT ASSISTANT: Crucial for handling allow-modals restrictions */}
          <div className="no-print fixed bottom-8 left-1/2 -translate-x-1/2 z-[500] bg-white border border-slate-200 px-10 py-7 rounded-[2.5rem] shadow-[0_30px_70px_-15px_rgba(0,0,0,0.3)] flex flex-col items-center gap-2 max-w-lg text-center animate-in slide-in-from-bottom-10 duration-700">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-1 shadow-inner">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <p className="text-[11px] font-black text-slate-950 uppercase tracking-[0.2em]">Institutional Print Readiness</p>
            <p className="text-[9.5px] font-bold text-slate-500 uppercase tracking-widest leading-relaxed">If the print dialog did not open automatically (blocked by sandbox), please use the browser command: <br/><span className="text-blue-600 text-[11px] font-black">CTRL + P</span> (Windows) or <span className="text-blue-600 text-[11px] font-black">CMD + P</span> (Mac).</p>
          </div>
        </>
      )}
    </div>
  );

  const renderUserDashboard = () => (
    <div className="flex-1 animate-card space-y-10">
      <div className="bg-slate-950 rounded-[3.5rem] p-12 lg:p-16 text-white shadow-2xl relative overflow-hidden group">
         <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:opacity-20 transition-opacity"><svg className="w-80 h-80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg></div>
         <div className="relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10 mb-16">
               <div className="space-y-6">
                  <div className="flex items-center gap-6"><span className="w-16 h-[2px] bg-blue-500"></span><p className="text-[11px] font-black uppercase tracking-[0.6em] text-blue-500">Institutional Secretariat</p></div>
                  <h2 className="text-5xl lg:text-7xl font-black uppercase tracking-tighter leading-none">Greetings,<br/><span className="text-shine">{currentUser?.name.split(' ')[0]}</span></h2>
               </div>
               <button onClick={handleCreateNew} className="px-10 py-6 bg-blue-600 text-white rounded-[2rem] font-black text-[11px] uppercase tracking-[0.4em] hover:bg-blue-500 transition-all shadow-2xl flex items-center justify-center gap-3"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>New Proposal</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               <div onClick={() => setRegistryFilter('IN_TRAY')} className="p-10 bg-white/5 border border-white/10 rounded-[2.5rem] hover:bg-white/10 transition-all cursor-pointer group shadow-2xl shadow-blue-900/10"><h4 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.4em] mb-6">In-Tray (Awaiting)</h4><div className="flex items-end justify-between"><span className="text-6xl font-black tracking-tighter group-hover:scale-110 transition-transform">{stats.inTray}</span><svg className="w-12 h-12 text-white/10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div></div>
               <div onClick={() => setRegistryFilter('OUT_TRAY')} className="p-10 bg-white/5 border border-white/10 rounded-[2.5rem] hover:bg-white/10 transition-all cursor-pointer group shadow-2xl shadow-amber-900/10"><h4 className="text-[10px] font-black text-amber-400 uppercase tracking-[0.4em] mb-6">Out-Tray (Pending)</h4><div className="flex items-end justify-between"><span className="text-6xl font-black tracking-tighter group-hover:scale-110 transition-transform">{stats.outTray}</span><svg className="w-12 h-12 text-white/10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg></div></div>
               <div onClick={() => setRegistryFilter('ALL_HITS')} className="p-10 bg-white/5 border border-white/10 rounded-[2.5rem] hover:bg-white/10 transition-all cursor-pointer group shadow-2xl shadow-emerald-900/10"><h4 className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.4em] mb-6">All Hits (Registry)</h4><div className="flex items-end justify-between"><span className="text-6xl font-black tracking-tighter group-hover:scale-110 transition-transform">{stats.allHits}</span><svg className="w-12 h-12 text-white/10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div></div>
            </div>
         </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
         <div className="p-10 bg-white rounded-[3.5rem] border border-slate-200 shadow-sm"><h3 className="text-base font-black text-slate-900 uppercase tracking-[0.4em] mb-8 flex items-center gap-5">Recent Correspondence<span className="h-[2px] flex-1 bg-slate-100"></span></h3><div className="space-y-6">
               {filteredUserNotes.slice(0, 5).map(n => (
                  <div key={n.id} onClick={() => setSelectedNoteId(n.id)} className="p-6 bg-slate-50 border border-slate-100 rounded-[2rem] hover:bg-white hover:border-blue-500 hover:shadow-2xl transition-all cursor-pointer group"><div className="flex justify-between items-start"><div className="min-w-0 flex-1"><p className="text-[9px] font-black text-blue-600 uppercase tracking-[0.4em] mb-2">{n.referenceNo}</p><h4 className="text-sm lg:text-base font-black text-slate-900 uppercase leading-tight line-clamp-1 group-hover:text-blue-700">{n.subject}</h4></div><span className={`text-[9px] px-3 py-1 rounded-full font-black uppercase shadow-sm ml-4 ${n.status === NoteStatus.APPROVED ? 'bg-emerald-100 text-emerald-700' : n.status === NoteStatus.REJECTED ? 'bg-rose-100 text-rose-700' : 'bg-blue-100 text-blue-700'}`}>{n.status}</span></div></div>
               ))}
            </div></div>
         <div className="p-10 bg-white rounded-[3.5rem] border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center space-y-10"><div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-[2.5rem] flex items-center justify-center shadow-inner"><svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg></div><h4 className="text-xl font-black text-slate-900 uppercase tracking-[0.4em]">Administrative Standard</h4><p className="text-sm font-medium text-slate-500 max-w-sm mx-auto leading-relaxed uppercase tracking-widest">Digital transparency is institutional priority. Every para-wise annotation is preserved in the statutory archive.</p><button onClick={() => setAppState('USER_MANUAL')} className="text-sm font-black text-blue-600 uppercase tracking-[0.4em] border-b-4 border-blue-100 pb-2 hover:border-blue-600 transition-all">Review Protocol</button></div>
      </div>
    </div>
  );

  const getActiveContent = () => {
    if (appState === 'LANDING') return <LandingPage onEnterPortal={() => setAppState('LOGIN')} onShowManual={() => setAppState('USER_MANUAL')} onShowPresentation={() => setAppState('PRESENTATION')} />;
    if (appState === 'LOGIN') return <Login staffList={staffList} notes={notes} onLogin={handleLogin} onPublicDownload={handlePublicDownload} onBack={() => setAppState('LANDING')} />;
    if (appState === 'USER_MANUAL') return <UserManual onBack={() => setAppState('LANDING')} />;
    if (appState === 'PRESENTATION') return <Presentation onBack={() => setAppState('LANDING')} />;
    if (appState === 'PUBLIC_VIEW' && selectedNote) return (
      <div className="min-h-screen bg-[#010409] p-2 lg:p-8 xl:p-12 paper-texture overflow-y-auto custom-scrollbar flex flex-col items-center">
        <div className="w-full max-w-[1800px] space-y-8 animate-in fade-in zoom-in-95 duration-700">
          <div className="no-print flex flex-col md:flex-row justify-between items-center text-white p-6 lg:p-10 bg-white/5 rounded-[3rem] border border-white/10 backdrop-blur-3xl shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] gap-10">
            <div className="flex items-center gap-10">
              <div className="relative group">
                <div className="absolute -inset-2 bg-blue-600 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-1000"></div>
                <div className="relative w-24 h-24 bg-blue-600 rounded-2xl flex items-center justify-center text-slate-950 font-black overflow-hidden shadow-2xl border-2 border-white/20">
                  {universityLogo ? <img src={universityLogo} className="w-full h-full object-contain p-4" /> : 'G'}
                </div>
              </div>
              <div className="space-y-3">
                <h2 className="text-3xl lg:text-4xl font-black uppercase tracking-tighter text-shine">Statutory Verification Node</h2>
                <div className="flex flex-wrap items-center gap-6">
                  <span className="text-[11px] font-black text-blue-400 uppercase tracking-[0.5em]">Institutional Document Authority</span>
                  <div className="hidden sm:block h-5 w-[1px] bg-white/10"></div>
                  <span className="text-[11px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-3">
                    <span className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.5)]"></span>
                    Authenticity Validated
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-10">
              <div className="text-right hidden xl:block border-l border-white/10 pl-10">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-1.5">File Reference</p>
                <p className="text-lg font-black text-white uppercase tracking-widest">{selectedNote.referenceNo}</p>
              </div>
              <button onClick={() => setAppState('LOGIN')} className="px-14 py-6 bg-white text-slate-950 border border-white/10 rounded-2xl text-[12px] font-black uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all shadow-2xl active:scale-95">Close Verification</button>
            </div>
          </div>
          <div className="relative w-full flex justify-center pb-20">
            {renderNoteSheet(selectedNote, true)}
          </div>
        </div>
      </div>
    );
    if (!currentUser) return null;
    if (isPrintMode && selectedNote) return <div className="min-h-screen bg-white">{renderNoteSheet(selectedNote)}</div>;

    return (
      <Layout user={currentUser} onLogout={handleLogout}>
        <div className="flex flex-col lg:flex-row gap-10 relative">
          <input type="file" multiple ref={fileInputRef} onChange={handleFileChange} className="hidden" />
          {errorMsg && <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] bg-rose-600 text-white px-10 py-5 rounded-[2rem] shadow-2xl font-black text-[11px] uppercase tracking-[0.3em] animate-in slide-in-from-top-10 duration-500 flex items-center gap-4">{errorMsg}</div>}
          {isDispatching?.active && <NotificationDispatcher recipientName={isDispatching.recipient} action={isDispatching.action} onComplete={() => setIsDispatching(null)} />}
          
          <aside className={`no-print w-full lg:w-96 flex flex-col gap-6 lg:h-[calc(100vh-160px)] ${showMobileList ? 'flex' : 'hidden lg:flex'}`}>
            <div className="flex items-center justify-between px-2 shrink-0">
              <div><h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase leading-none">Registry</h2><p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.5em] mt-2 flex items-center gap-2"><span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>Statutory Store</p></div>
              <div className="flex gap-2">
                {currentUser.role === UserRole.ADMIN && <button onClick={() => { setShowAdminPanel(!showAdminPanel); setShowMobileList(false); }} className={`w-10 h-10 rounded-xl border transition-all flex items-center justify-center ${showAdminPanel ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-slate-200 text-slate-400'}`}><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg></button>}
                <button onClick={handleCreateNew} className="w-10 h-10 bg-blue-600 text-white rounded-xl shadow-lg flex items-center justify-center"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M12 4v16m8-8H4" /></svg></button>
              </div>
            </div>

            {/* Simplified Directional Tabs */}
            <div className="space-y-4 px-2">
              <div className="relative group">
                <input 
                  type="text" 
                  value={registrySearchTerm}
                  onChange={(e) => setRegistrySearchTerm(e.target.value)}
                  placeholder="SUBJECT / REF / NAME..."
                  className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest focus:border-blue-600 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all shadow-sm"
                />
                <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </div>
              
              <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
                {[
                  { id: 'IN_TRAY', label: `In-Tray (${stats.inTray})`, color: 'blue' },
                  { id: 'OUT_TRAY', label: `Out-Tray (${stats.outTray})`, color: 'amber' },
                  { id: 'ALL_HITS', label: `All Hits (${stats.allHits})`, color: 'slate' }
                ].map(f => (
                  <button 
                    key={f.id}
                    onClick={() => setRegistryFilter(f.id as any)}
                    className={`shrink-0 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${
                      registryFilter === f.id 
                      ? `bg-${f.color}-600 border-${f.color}-600 text-white shadow-xl scale-105` 
                      : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar pr-4 space-y-4">
              {filteredUserNotes.length === 0 ? (
                <div className="text-center py-20 px-8 border-2 border-dashed border-slate-200 rounded-[2.5rem] bg-slate-50/50">
                  <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.4em]">Zero Statutory Records in View</p>
                </div>
              ) : (
                filteredUserNotes.map((note) => {
                  const isAssignedToMe = note.currentHandler.id === currentUser.id;
                  const isTerminal = note.status === NoteStatus.APPROVED || note.status === NoteStatus.REJECTED;

                  return (
                    <button 
                      key={note.id} 
                      onClick={() => { setSelectedNoteId(note.id); setIsCreating(false); setShowAdminPanel(false); setShowMobileList(false); }} 
                      className={`w-full p-6 rounded-[2rem] text-left border-y border-r transition-all duration-500 group relative overflow-hidden ${
                        selectedNoteId === note.id ? 'bg-white border-slate-200 shadow-2xl -translate-y-1' : 'bg-white border-slate-100 hover:border-blue-400 hover:bg-slate-50'
                      }`}
                    >
                      {/* Personal Workflow Chromatic Border */}
                      <div className={`absolute left-0 top-0 bottom-0 w-3 transition-colors ${
                        isTerminal ? (note.status === NoteStatus.APPROVED ? 'bg-emerald-500' : 'bg-rose-500') : 
                        isAssignedToMe ? 'bg-blue-600 animate-pulse' : 'bg-amber-400 opacity-40'
                      }`}></div>

                      <div className="flex justify-between items-start mb-3 ml-1">
                        <div className="flex items-center gap-2">
                           <span className={`text-[8px] font-black px-2 py-0.5 rounded uppercase shadow-sm ${
                            isTerminal ? (note.status === NoteStatus.APPROVED ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700') : 
                            isAssignedToMe ? 'bg-blue-50 text-blue-700' : 'bg-amber-50 text-amber-700'
                           }`}>
                             {isTerminal ? note.status : (isAssignedToMe ? 'Action Required' : 'Forwarded')}
                           </span>
                           {isAssignedToMe && !isTerminal && (
                             <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-ping"></div>
                           )}
                        </div>
                        <span className="text-[8px] font-black text-slate-300 tabular-nums">{new Date(note.dateInitiated).toLocaleDateString('en-GB')}</span>
                      </div>
                      <h4 className="text-[11px] font-black text-slate-950 uppercase leading-snug line-clamp-2 mb-2 tracking-tight ml-1">{note.subject}</h4>
                      <p className="text-[8px] font-bold text-slate-400 uppercase truncate ml-1">
                        {isAssignedToMe ? `From: ${note.history[note.history.length-1]?.from.name || note.creator.name}` : `Sent To: ${note.currentHandler.name}`}
                      </p>
                    </button>
                  );
                })
              )}
            </div>
          </aside>

          <section className="flex-1 min-w-0 min-h-[calc(100vh-200px)] flex flex-col gap-10">
            <div className="lg:hidden no-print flex gap-4 mb-4"><button onClick={() => setShowMobileList(!showMobileList)} className="flex-1 py-5 bg-white border border-slate-200 rounded-2xl font-black text-[11px] uppercase shadow-sm flex items-center justify-center gap-3">Registry</button><button onClick={handleCreateNew} className="w-16 h-16 bg-blue-600 text-white rounded-2xl shadow-2xl flex items-center justify-center"><svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M12 4v16m8-8H4" /></svg></button></div>
            {showAdminPanel ? (
              <AdminPanel staffList={staffList} notes={notes} departments={departments} universityLogo={universityLogo} onUpdateLogo={handleUpdateLogo} onAddStaff={handleAddStaff} onUpdateStaff={handleUpdateStaff} onDeleteStaff={handleDeleteStaff} onAddDepartment={handleAddDepartment} onDeleteDepartment={handleDeleteDepartment} onClose={() => setShowAdminPanel(false)} currentUserId={currentUser.id} dbStatus={dbStatus} />
            ) : isCreating ? (
              <div className="bg-white rounded-[3.5rem] shadow-2xl border border-slate-200 overflow-hidden animate-in slide-in-from-bottom-10 duration-1000">
                 <div className="p-12 lg:p-16 border-b border-slate-100 bg-slate-50/50">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
                       <div className="flex items-center gap-6"><div className="w-16 h-16 bg-blue-600 text-white rounded-[1.5rem] flex items-center justify-center shadow-2xl rotate-3"><svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M12 4v16m8-8H4" /></svg></div><div><h2 className="text-4xl font-black text-slate-950 tracking-tighter uppercase leading-none">Draft Note</h2><p className="text-[11px] font-black text-blue-600 uppercase tracking-[0.6em] mt-2 flex items-center gap-2">New Correspondence</p></div></div>
                    </div>
                    <div className="space-y-10">
                      <div className="space-y-3"><label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] ml-4">Subject</label><input type="text" value={subject} onChange={(e) => setSubject(e.target.value.toUpperCase())} placeholder="SUBJECT IN BLOCK CAPITALS..." className="w-full px-10 py-6 bg-white border-2 border-slate-100 rounded-[2rem] outline-none focus:border-blue-600 transition-all font-black text-base uppercase shadow-sm" /></div>
                      <div className="space-y-4"><div className="flex justify-between items-end px-4"><label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Administrative Narrative</label><button onClick={handleAIAssist} disabled={aiWorking || !content || !subject} className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${aiWorking ? 'bg-slate-100 text-slate-400 animate-pulse' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-2xl'}`}>AI Refinement</button></div><textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Draft proposal details..." className="w-full px-10 py-10 bg-white border-2 border-slate-100 rounded-[3.5rem] outline-none focus:border-blue-600 transition-all font-medium text-lg leading-[2.8rem] min-h-[500px] official-font shadow-sm custom-scrollbar" /></div>
                      
                      <div className="space-y-6">
                        <div className="flex justify-between items-end px-4">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Supporting Documentation</label>
                          <button onClick={() => fileInputRef.current?.click()} className="px-6 py-3 bg-white border-2 border-blue-600 text-blue-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-50 transition-all flex items-center gap-2 shadow-sm">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
                            Add Document
                          </button>
                        </div>
                        {attachments.length > 0 ? (
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-2">
                            {attachments.map((file) => (
                              <div key={file.id} className="p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl flex items-center justify-between group hover:border-blue-200 transition-all">
                                <div className="flex items-center gap-4 min-w-0">
                                  <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                                  </div>
                                  <div className="min-w-0">
                                    <p className="text-[10px] font-black text-slate-900 truncate uppercase">{file.name}</p>
                                    <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{(file.size / 1024).toFixed(1)} KB</p>
                                  </div>
                                </div>
                                <button onClick={() => removePendingAttachment(file.id)} className="w-8 h-8 bg-rose-50 text-rose-600 rounded-lg flex items-center justify-center hover:bg-rose-600 hover:text-white transition-all">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="p-10 border-2 border-dashed border-slate-200 rounded-[2.5rem] bg-slate-50/50 text-center">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">No statutory attachments uploaded</p>
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                         <div className="space-y-3"><label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] ml-4">Forward To (Select Recipient)</label><select value={selectedRecipient} onChange={(e) => setSelectedRecipient(e.target.value)} className="w-full px-10 py-6 bg-white border-2 border-slate-100 rounded-[2rem] outline-none focus:border-blue-600 font-black text-[12px] uppercase appearance-none"><option value="">Select Official</option>{staffList.filter(s => s.id !== currentUser.id).map(staff => <option key={staff.id} value={staff.id}>{staff.name} — {staff.designation}</option>)}</select></div>
                         <div className="space-y-3"><label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] ml-4">Remark</label><input type="text" value={remark} onChange={(e) => setRemark(e.target.value)} placeholder="Registry annotation..." className="w-full px-10 py-6 bg-white border-2 border-slate-100 rounded-[2rem] outline-none focus:border-blue-600 font-bold text-sm shadow-sm" /></div>
                      </div>
                    </div>
                 </div>
                 <div className="p-12 bg-slate-950 flex flex-col sm:flex-row justify-between items-center gap-8"><button onClick={() => setIsCreating(false)} className="px-10 py-5 text-slate-500 hover:text-white font-black text-[11px] uppercase border border-transparent hover:border-white/10 rounded-2xl">Abort</button><button onClick={handleInitiate} disabled={!subject || !content || !selectedRecipient} className="w-full sm:w-auto px-16 py-6 bg-blue-600 text-white rounded-[2rem] font-black text-[12px] uppercase shadow-2xl hover:bg-blue-500 active:scale-95 disabled:opacity-30 transition-all flex items-center justify-center gap-5">Dispatch Proposal 👁‍🗨</button></div>
              </div>
            ) : selectedNote ? (
              <div className="flex flex-col gap-12 animate-in fade-in duration-1000">
                 {renderNoteSheet(selectedNote)}
                 <div className="no-print space-y-12 pb-20">
                    {selectedNote.currentHandler.id === currentUser.id && 
                     selectedNote.status !== NoteStatus.APPROVED && 
                     selectedNote.status !== NoteStatus.REJECTED ? (
                      <div className="bg-white rounded-[4rem] p-12 lg:p-16 border-2 border-slate-100 shadow-2xl relative overflow-hidden">
                         <div className="absolute top-0 left-0 w-4 h-full bg-blue-600"></div>
                         <div className="flex justify-between items-start mb-12"><div><h3 className="text-3xl font-black text-slate-950 tracking-tighter uppercase mb-2">Administrative Perusal</h3><p className="text-[11px] font-black text-blue-600 uppercase tracking-[0.6em] flex items-center gap-3">Statutory Action Required</p></div></div>
                         <div className="space-y-12">
                            <div className="space-y-4"><div className="flex justify-between items-end px-4"><label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em]">Official Decision Remark</label><div className="flex gap-6"><button onClick={() => handleSuggestRemark('forward')} disabled={suggestingRemark} className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em] hover:text-indigo-800 disabled:opacity-50">Draft Approval</button><button onClick={() => handleSuggestRemark('return')} disabled={suggestingRemark} className="text-[10px] font-black text-amber-600 uppercase tracking-[0.3em] hover:text-amber-800 disabled:opacity-50">Draft Return</button></div></div><textarea value={remark} onChange={(e) => setRemark(e.target.value)} placeholder="Record formal observation..." className="w-full px-10 py-8 bg-slate-50 border-2 border-slate-100 rounded-[2.5rem] outline-none focus:border-blue-600 focus:bg-white transition-all font-bold italic min-h-[200px] shadow-inner" /></div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                               <div className="space-y-4"><label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em] ml-4">Forward To Official</label><select value={selectedRecipient} onChange={(e) => setSelectedRecipient(e.target.value)} className="w-full px-10 py-6 bg-white border-2 border-slate-100 rounded-[2rem] outline-none focus:border-blue-600 font-black text-[12px] uppercase appearance-none"><option value="">Select Official</option>{staffList.filter(s => s.id !== currentUser.id).map(staff => <option key={staff.id} value={staff.id}>{staff.name} — {staff.designation}</option>)}</select></div>
                               <div className="space-y-4"><label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em] ml-4">Documentation</label><button onClick={() => fileInputRef.current?.click()} className="w-full px-10 py-6 bg-white border-2 border-dashed border-slate-300 rounded-[2rem] text-slate-400 font-black text-[11px] uppercase tracking-[0.2em] hover:border-blue-600 hover:bg-blue-50/50 transition-all text-left">Upload Supporting Files</button></div>
                            </div>
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-12 border-t border-slate-50"><button onClick={() => handleWorkflowAction(WorkflowAction.FORWARD)} className="py-6 bg-slate-950 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] hover:bg-slate-900 transition-all active:scale-95 shadow-2xl">Forward 👁‍🗨</button><button onClick={() => handleWorkflowAction(WorkflowAction.RETURN)} className="py-6 bg-amber-500 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] hover:bg-amber-600 transition-all active:scale-95 shadow-2xl">Return</button><button onClick={() => handleWorkflowAction(WorkflowAction.APPROVE)} className="py-6 bg-emerald-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] hover:bg-emerald-700 transition-all active:scale-95 shadow-2xl">Approve</button><button onClick={() => handleWorkflowAction(WorkflowAction.REJECT)} className="py-6 bg-rose-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] hover:bg-rose-700 transition-all active:scale-95 shadow-2xl">Reject</button></div>
                         </div>
                      </div>
                    ) : (
                      (selectedNote.status === NoteStatus.APPROVED || selectedNote.status === NoteStatus.REJECTED) ? (
                        <div className="bg-slate-950 rounded-[4rem] p-12 text-center border-2 border-white/5 shadow-2xl animate-in fade-in zoom-in-95 duration-700">
                          <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-8 text-amber-500 border border-amber-500/20">
                             <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                          </div>
                          <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-2">Statutory Registry Locked</h3>
                          <p className="text-[10px] font-black text-amber-500 uppercase tracking-[0.5em] mb-4">Permanent Document Status: {selectedNote.status}</p>
                          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest leading-relaxed max-w-lg mx-auto">This dispatch has attained its terminal phase. Any further forwarding, returning, or remark annotation is strictly prohibited by university governance protocols.</p>
                        </div>
                      ) : (
                        <div className="bg-white rounded-[4rem] p-12 text-center border-2 border-slate-100 shadow-xl animate-in fade-in zoom-in-95 duration-700">
                          <div className="w-20 h-20 bg-amber-50 rounded-3xl flex items-center justify-center mx-auto mb-8 text-amber-600 border border-amber-200">
                             <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg>
                          </div>
                          <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-2">Dispatch In-Transit</h3>
                          <p className="text-[10px] font-black text-amber-600 uppercase tracking-[0.5em] mb-4">Current Custodian: {selectedNote.currentHandler.name}</p>
                          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest leading-relaxed max-w-lg mx-auto">You have already processed this file. It is currently awaiting action at the office of {selectedNote.currentHandler.designation}.</p>
                        </div>
                      )
                    )}
                    <HistoryTimeline history={selectedNote.history} />
                 </div>
              </div>
            ) : renderUserDashboard()}
          </section>
        </div>
      </Layout>
    );
  };

  return (<>{getActiveContent()}<AIAgent /></>);
};

export default App;
