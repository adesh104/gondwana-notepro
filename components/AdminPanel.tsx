
import React, { useState, useEffect, useRef } from 'react';
import { Staff, UserRole, NoteSheet, NoteStatus, UniversitySettings } from '../types';
import { dbService, STORES } from '../services/dbService';

interface AdminPanelProps {
  staffList: Staff[];
  notes: NoteSheet[];
  departments: string[];
  universityLogo?: string;
  onUpdateLogo: (logo: string) => void;
  onAddStaff: (staff: Staff) => void;
  onUpdateStaff: (staff: Staff) => void;
  onDeleteStaff: (staffId: string) => void;
  onAddDepartment: (dept: string) => void;
  onDeleteDepartment: (dept: string) => void;
  onClose: () => void;
  currentUserId: string;
  dbStatus?: string;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ 
  staffList, 
  notes,
  departments,
  universityLogo,
  onUpdateLogo,
  onAddStaff, 
  onUpdateStaff, 
  onDeleteStaff, 
  onAddDepartment,
  onDeleteDepartment,
  onClose,
  currentUserId,
  dbStatus
}) => {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'STAFF' | 'DEPARTMENTS' | 'BRANDING' | 'DATABASE'>('OVERVIEW');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    message: string;
    onConfirm: () => void;
  }>({ isOpen: false, message: '', onConfirm: () => {} });

  const [name, setName] = useState('');
  const [staffId, setStaffId] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [photo, setPhoto] = useState<string | undefined>(undefined);
  const [designation, setDesignation] = useState('');
  const [department, setDepartment] = useState(departments[0] || '');
  const [role, setRole] = useState<UserRole>(UserRole.STAFF);
  const [editingStaffId, setEditingStaffId] = useState<string | null>(null);

  const [newDept, setNewDept] = useState('');

  useEffect(() => {
    if (!editingStaffId && departments.length > 0 && !department) {
      setDepartment(departments[0]);
    }
  }, [departments, editingStaffId, department]);

  const showSuccess = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const showError = (msg: string) => {
    setErrorMessage(msg);
    setTimeout(() => setErrorMessage(null), 5000);
  };

  const resetStaffForm = () => {
    setName('');
    setStaffId('');
    setPassword('');
    setEmail('');
    setPhone('');
    setPhoto(undefined);
    setDesignation('');
    setDepartment(departments[0] || '');
    setRole(UserRole.STAFF);
    setEditingStaffId(null);
  };

  const startEdit = (staff: Staff) => {
    setName(staff.name);
    setStaffId(staff.id);
    setPassword(staff.password || '');
    setEmail(staff.email || '');
    setPhone(staff.phone || '');
    setPhoto(staff.photo);
    setDesignation(staff.designation);
    setDepartment(staff.department);
    setRole(staff.role);
    setEditingStaffId(staff.id);
    setActiveTab('STAFF');
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdateLogo(reader.result as string);
        showSuccess('University Identity updated successfully.');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleStaffSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !designation || !staffId || !password) {
      showError("Validation Error: All official credential fields are required.");
      return;
    }

    const staffData: Staff = {
      id: staffId.toUpperCase().trim(),
      name: name.trim(),
      designation: designation.trim(),
      department: department || (departments[0] || 'Administration'),
      role,
      password: password.trim(),
      email: email.trim(),
      phone: phone.trim(),
      photo: photo
    };

    if (editingStaffId) {
      requestConfirm(
        `Are you sure you want to save modifications to the profile of ${staffData.name}?`,
        () => {
          onUpdateStaff(staffData);
          showSuccess('Profile update confirmed and saved to university registry.');
          resetStaffForm();
        }
      );
    } else {
      if (staffList.some(s => s.id.toUpperCase() === staffData.id)) {
        showError("Duplicate Record: This Staff ID is already assigned.");
        return;
      }
      onAddStaff(staffData);
      showSuccess('New administrative account provisioned.');
      resetStaffForm();
    }
  };

  const handleDeptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanDept = newDept.trim();
    if (!cleanDept) return;
    if (departments.includes(cleanDept)) {
      showError("Conflict: This department unit is already registered.");
      return;
    }
    onAddDepartment(cleanDept);
    setNewDept('');
    showSuccess('New unit established successfully.');
  };

  const requestConfirm = (message: string, action: () => void) => {
    setConfirmDialog({
      isOpen: true,
      message,
      onConfirm: () => {
        action();
        setConfirmDialog(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  const exportDatabase = () => {
    const data = {
      version: "1.4.0",
      exportDate: new Date().toISOString(),
      university: "Gondwana University, Gadchiroli",
      engine: "Supabase/IndexedDB Store",
      staff: staffList,
      notes: notes,
      departments: departments,
      logo: universityLogo
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `GU_BACKUP_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showSuccess('Master Backup exported successfully.');
  };

  // Fix: Adding the missing handleImportDatabase function to restore system data from JSON backup
  const handleImportDatabase = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (json.staff && json.notes && json.departments) {
          requestConfirm("RESTORE PROTOCOL: This will overwrite the current registry with the backup package. Proceed?", async () => {
            // Sequential restoration to database
            for (const s of json.staff) await dbService.put(STORES.STAFF, s);
            for (const n of json.notes) await dbService.put(STORES.NOTES, n);
            await dbService.saveAllDepartments(json.departments);
            if (json.logo) onUpdateLogo(json.logo);
            
            showSuccess('Institutional registry synchronization complete. Rebooting node...');
            setTimeout(() => window.location.reload(), 2000);
          });
        } else {
          showError("Validation Error: Invalid or unauthorized registry package.");
        }
      } catch (err) {
        showError("Critical Error: Restoration package is corrupt or unreadable.");
      }
    };
    reader.readAsText(file);
    // Reset input to allow re-upload of same file if needed
    e.target.value = '';
  };

  const noteStats = {
    pending: notes.filter(n => n.status === NoteStatus.PENDING).length,
    approved: notes.filter(n => n.status === NoteStatus.APPROVED).length,
    rejected: notes.filter(n => n.status === NoteStatus.REJECTED).length,
    returned: notes.filter(n => n.status === NoteStatus.RETURNED).length,
    total: notes.length
  };

  return (
    <div className="bg-white rounded-[3.5rem] shadow-[0_30px_100px_-20px_rgba(0,0,0,0.15)] border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-500 max-w-7xl mx-auto flex flex-col min-h-[85vh] relative">
      
      {confirmDialog.isOpen && (
        <div className="absolute inset-0 z-[100] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-6">
          <div className="bg-white rounded-[2.5rem] p-10 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-300">
            <h4 className="text-slate-900 font-black text-xs mb-4 uppercase tracking-[0.2em]">Institutional Confirmation</h4>
            <p className="text-slate-500 text-[11px] font-bold mb-8 leading-relaxed uppercase tracking-wider">{confirmDialog.message}</p>
            <div className="flex gap-4">
              <button 
                onClick={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
                className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black text-[9px] uppercase tracking-widest hover:bg-slate-200 transition-all"
              >
                Abort
              </button>
              <button 
                onClick={confirmDialog.onConfirm}
                className="flex-1 py-4 bg-blue-900 text-white rounded-2xl font-black text-[9px] uppercase tracking-widest hover:bg-blue-800 shadow-lg transition-all"
              >
                Confirm Action
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADMIN HEADER */}
      <div className="bg-slate-950 p-6 lg:px-12 flex flex-col md:flex-row justify-between items-center gap-4 border-b border-white/5">
        <div className="flex items-center gap-6">
          <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-blue-500/20 rotate-3">
             <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
          </div>
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-black text-white tracking-tighter uppercase leading-none mb-1">Command Core</h2>
            <div className="flex items-center justify-center md:justify-start gap-2">
               <span className="h-[2px] w-5 bg-blue-500 rounded-full"></span>
               <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.4em] opacity-80">Gondwana Statutory Control</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={exportDatabase}
            className="px-6 py-3.5 bg-white/5 text-white border border-white/10 rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-blue-600 hover:border-blue-500 transition-all flex items-center gap-3 shadow-xl"
          >
             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
             Registry Export
          </button>
          <button onClick={onClose} className="w-12 h-12 flex items-center justify-center bg-white/5 border border-white/10 rounded-2xl hover:bg-rose-600 hover:border-rose-500 transition-all text-white group shadow-xl">
            <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
      </div>

      {/* TAB NAVIGATION */}
      <div className="flex bg-slate-50 border-b border-slate-200 p-2 gap-2 overflow-x-auto no-scrollbar">
         {[
           { id: 'OVERVIEW', label: 'Matrix', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z', color: 'blue' },
           { id: 'STAFF', label: 'Personnel', icon: 'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2m16-10a4 4 0 11-8 0 4 4 0 018 0z', color: 'indigo' },
           { id: 'DEPARTMENTS', label: 'Units', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4', color: 'slate' },
           { id: 'BRANDING', label: 'Identity', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z', color: 'amber' },
           { id: 'DATABASE', label: 'Deploy', icon: 'M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4', color: 'purple' }
         ].map(tab => (
           <button 
             key={tab.id}
             onClick={() => setActiveTab(tab.id as any)}
             className={`flex-1 flex items-center justify-center gap-3 py-4 px-6 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all relative overflow-hidden shrink-0 ${
               activeTab === tab.id 
               ? 'bg-white text-slate-950 shadow-xl ring-1 ring-slate-200' 
               : 'text-slate-400 hover:bg-white/60 hover:text-slate-600'
             }`}
           >
             <svg className={`w-4 h-4 ${activeTab === tab.id ? `text-${tab.color}-600` : 'text-slate-300'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={tab.icon} />
             </svg>
             <span className="hidden sm:inline">{tab.label}</span>
             {activeTab === tab.id && <div className={`absolute bottom-0 left-0 right-0 h-1 bg-${tab.color}-600 animate-in slide-in-from-left duration-300`}></div>}
           </button>
         ))}
      </div>
      
      {/* MESSAGES */}
      <div className="relative">
        {successMessage && (
          <div className="absolute top-0 left-0 right-0 bg-emerald-600 p-2 text-center animate-in slide-in-from-top-2 duration-500 shadow-2xl z-20">
            <p className="text-white text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-3">
               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" /></svg>
               {successMessage}
            </p>
          </div>
        )}
        {errorMessage && (
          <div className="absolute top-0 left-0 right-0 bg-rose-600 p-2 text-center animate-in slide-in-from-top-2 duration-500 shadow-2xl z-20">
            <p className="text-white text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-3">
               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
               {errorMessage}
            </p>
          </div>
        )}
      </div>

      {/* TAB CONTENT */}
      <div className="flex-1 overflow-y-auto p-8 lg:p-12 custom-scrollbar bg-slate-50/20">
        
        {activeTab === 'OVERVIEW' && (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
             <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-100 pb-8">
                <div>
                   <h3 className="text-4xl font-black text-slate-900 uppercase tracking-tighter leading-none mb-3">Global Matrix</h3>
                   <div className="flex items-center gap-3">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></span>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em]">Statutory Throughput Monitoring</p>
                   </div>
                </div>
                <div className="bg-white px-8 py-5 rounded-[2rem] border border-slate-200 shadow-sm flex items-center gap-6">
                   <div className="text-right">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Registry Count</p>
                      <p className="text-4xl font-black text-slate-950 tracking-tighter leading-none">{noteStats.total}</p>
                   </div>
                   <div className="w-[1px] h-10 bg-slate-100"></div>
                   <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                   </div>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {/* SANCTIONED REGISTRY - APPROVED */}
                <div className="group relative bg-emerald-50 rounded-[3rem] p-10 border border-emerald-100 overflow-hidden shadow-sm transition-all hover:shadow-2xl hover:-translate-y-2">
                   <div className="absolute -top-6 -right-6 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-colors"></div>
                   <div className="relative z-10 space-y-8">
                      <div className="flex justify-between items-start">
                         <div className="w-14 h-14 bg-emerald-600 rounded-[1.25rem] flex items-center justify-center text-white shadow-xl shadow-emerald-600/20">
                            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                         </div>
                         <div className="text-right">
                            <p className="text-[8px] font-black text-emerald-600 uppercase tracking-widest mb-1">Impact Factor</p>
                            <span className="text-xs font-black text-emerald-700 bg-white px-3 py-1 rounded-full border border-emerald-100 shadow-sm">Registry+</span>
                         </div>
                      </div>
                      <div>
                         <h4 className="text-5xl font-black text-emerald-950 tracking-tighter leading-none mb-2">{noteStats.approved}</h4>
                         <p className="text-[11px] font-black text-emerald-600 uppercase tracking-[0.4em]">Sanctioned Archive</p>
                      </div>
                      <div className="space-y-4 pt-6 border-t border-emerald-200/50">
                         <div className="flex justify-between text-[8px] font-black text-emerald-700/60 uppercase tracking-widest">
                            <span>Statutory Seals Applied</span>
                            <span>{noteStats.approved}</span>
                         </div>
                         <div className="h-1 w-full bg-emerald-200/30 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500 rounded-full w-full"></div>
                         </div>
                      </div>
                   </div>
                </div>

                {/* STATUTORY QUEUE - PENDING */}
                <div className="group relative bg-blue-50 rounded-[3rem] p-10 border border-blue-100 overflow-hidden shadow-sm transition-all hover:shadow-2xl hover:-translate-y-2">
                   <div className="absolute -top-6 -right-6 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-colors"></div>
                   <div className="relative z-10 space-y-8">
                      <div className="flex justify-between items-start">
                         <div className="w-14 h-14 bg-blue-600 rounded-[1.25rem] flex items-center justify-center text-white shadow-xl shadow-blue-600/20 animate-pulse">
                            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                         </div>
                         <div className="text-right">
                            <p className="text-[8px] font-black text-blue-600 uppercase tracking-widest mb-1">Queue Load</p>
                            <span className="text-xs font-black text-blue-700 bg-white px-3 py-1 rounded-full border border-blue-100 shadow-sm">Live Dispatch</span>
                         </div>
                      </div>
                      <div>
                         <h4 className="text-5xl font-black text-blue-950 tracking-tighter leading-none mb-2">{noteStats.pending}</h4>
                         <p className="text-[11px] font-black text-blue-600 uppercase tracking-[0.4em]">Active Dispatches</p>
                      </div>
                      <div className="space-y-4 pt-6 border-t border-blue-200/50">
                         <div className="flex justify-between text-[8px] font-black text-blue-700/60 uppercase tracking-widest">
                            <span>Nodes Processing</span>
                            <span>{noteStats.pending}</span>
                         </div>
                         <div className="h-1 w-full bg-blue-200/30 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 rounded-full transition-all duration-1000" style={{ width: `${(noteStats.pending/Math.max(noteStats.total, 1))*100}%` }}></div>
                         </div>
                      </div>
                   </div>
                </div>

                {/* INTERNAL RECURSION - RETURNED */}
                <div className="group relative bg-amber-50 rounded-[3rem] p-10 border border-amber-100 overflow-hidden shadow-sm transition-all hover:shadow-2xl hover:-translate-y-2">
                   <div className="absolute -top-6 -right-6 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-colors"></div>
                   <div className="relative z-10 space-y-8">
                      <div className="flex justify-between items-start">
                         <div className="w-14 h-14 bg-amber-500 rounded-[1.25rem] flex items-center justify-center text-white shadow-xl shadow-amber-500/20">
                            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                         </div>
                         <div className="text-right">
                            <p className="text-[8px] font-black text-amber-600 uppercase tracking-widest mb-1">Iterative State</p>
                            <span className="text-xs font-black text-amber-700 bg-white px-3 py-1 rounded-full border border-amber-100 shadow-sm">Recursion</span>
                         </div>
                      </div>
                      <div>
                         <h4 className="text-5xl font-black text-amber-950 tracking-tighter leading-none mb-2">{noteStats.returned}</h4>
                         <p className="text-[11px] font-black text-amber-600 uppercase tracking-[0.4em]">Internal Revision</p>
                      </div>
                      <div className="space-y-4 pt-6 border-t border-amber-200/50">
                         <div className="flex justify-between text-[8px] font-black text-amber-700/60 uppercase tracking-widest">
                            <span>Statutory Backlog</span>
                            <span>{noteStats.returned}</span>
                         </div>
                         <div className="h-1 w-full bg-amber-200/30 rounded-full overflow-hidden">
                            <div className="h-full bg-amber-500 rounded-full transition-all duration-1000" style={{ width: `${(noteStats.returned/Math.max(noteStats.total, 1))*100}%` }}></div>
                         </div>
                      </div>
                   </div>
                </div>

                {/* ADMINISTRATIVE REFUSALS - REJECTED */}
                <div className="group relative bg-rose-50 rounded-[3rem] p-10 border border-rose-100 overflow-hidden shadow-sm transition-all hover:shadow-2xl hover:-translate-y-2">
                   <div className="absolute -top-6 -right-6 w-32 h-32 bg-rose-500/10 rounded-full blur-2xl group-hover:bg-rose-500/20 transition-colors"></div>
                   <div className="relative z-10 space-y-8">
                      <div className="flex justify-between items-start">
                         <div className="w-14 h-14 bg-rose-600 rounded-[1.25rem] flex items-center justify-center text-white shadow-xl shadow-rose-600/20">
                            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                         </div>
                         <div className="text-right">
                            <p className="text-[8px] font-black text-rose-600 uppercase tracking-widest mb-1">Terminal State</p>
                            <span className="text-xs font-black text-rose-700 bg-white px-3 py-1 rounded-full border border-rose-100 shadow-sm">Locked</span>
                         </div>
                      </div>
                      <div>
                         <h4 className="text-5xl font-black text-rose-950 tracking-tighter leading-none mb-2">{noteStats.rejected}</h4>
                         <p className="text-[11px] font-black text-rose-600 uppercase tracking-[0.4em]">Administrative Refusal</p>
                      </div>
                      <div className="space-y-4 pt-6 border-t border-rose-200/50">
                         <div className="flex justify-between text-[8px] font-black text-rose-700/60 uppercase tracking-widest">
                            <span>Compliance Terminal</span>
                            <span>{noteStats.rejected}</span>
                         </div>
                         <div className="h-1 w-full bg-rose-200/30 rounded-full overflow-hidden">
                            <div className="h-full bg-rose-600 rounded-full transition-all duration-1000" style={{ width: `${(noteStats.rejected/Math.max(noteStats.total, 1))*100}%` }}></div>
                         </div>
                      </div>
                   </div>
                </div>
             </div>

             <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* REFINED ANALYTICS CHART */}
                <div className="bg-white border border-slate-200 rounded-[3.5rem] p-12 shadow-sm">
                   <h4 className="text-sm font-black text-slate-900 uppercase tracking-[0.4em] mb-10 flex items-center gap-6">
                      Unit Operational Density
                      <span className="h-[2px] flex-1 bg-slate-50"></span>
                   </h4>
                   <div className="space-y-8">
                      {departments.slice(0, 6).map(dept => {
                        const count = notes.filter(n => n.creator.department === dept).length;
                        const percentage = noteStats.total > 0 ? (count / noteStats.total) * 100 : 0;
                        return (
                          <div key={dept} className="group cursor-default">
                             <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest mb-3">
                                <span className="text-slate-600 group-hover:text-blue-600 transition-colors">{dept}</span>
                                <span className="text-blue-900 bg-blue-50 px-3 py-1 rounded-lg border border-blue-100">{count} Records</span>
                             </div>
                             <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                                <div className="h-full bg-blue-600 rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(37,99,235,0.2)]" style={{ width: `${percentage}%` }}></div>
                             </div>
                          </div>
                        );
                      })}
                   </div>
                   <div className="mt-12 pt-8 border-t border-slate-50 text-center">
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">Based on total registry history from institutional inception.</p>
                   </div>
                </div>

                {/* INFRASTRUCTURE MONITOR */}
                <div className="bg-slate-950 rounded-[3.5rem] p-12 flex flex-col justify-between shadow-2xl relative overflow-hidden group">
                   <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-blue-600/5 rounded-full blur-3xl group-hover:bg-blue-600/10 transition-all duration-1000"></div>
                   <div className="space-y-10 relative z-10">
                      <h4 className="text-sm font-black text-white uppercase tracking-[0.4em] mb-10">Statutory Core Status</h4>
                      <div className="space-y-6">
                         <div className="p-6 bg-white/5 border border-white/10 rounded-[2rem] flex items-center justify-between">
                            <div className="flex items-center gap-5">
                               <div className="w-10 h-10 bg-emerald-500/10 text-emerald-500 rounded-xl flex items-center justify-center">
                                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                               </div>
                               <div>
                                  <p className="text-[10px] font-black text-white uppercase tracking-widest">Protocol Integrity</p>
                                  <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">SHA-256 Statutory Signing Active</p>
                               </div>
                            </div>
                            <span className="text-[8px] font-black text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/20">Operational</span>
                         </div>
                         <div className="p-6 bg-white/5 border border-white/10 rounded-[2rem] flex items-center justify-between">
                            <div className="flex items-center gap-5">
                               <div className="w-10 h-10 bg-blue-500/10 text-blue-500 rounded-xl flex items-center justify-center">
                                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                               </div>
                               <div>
                                  <p className="text-[10px] font-black text-white uppercase tracking-widest">Database Node</p>
                                  <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">IndexedDB / Supabase Synchronized</p>
                               </div>
                            </div>
                            <span className="text-[8px] font-black text-blue-400 uppercase tracking-widest bg-blue-500/10 px-3 py-1 rounded-lg border border-blue-500/20">Synced</span>
                         </div>
                      </div>
                   </div>
                   <div className="pt-12 relative z-10">
                      <div className="p-8 bg-blue-600 rounded-[2.5rem] shadow-2xl shadow-blue-600/20 text-center space-y-4">
                         <p className="text-[10px] font-black text-white uppercase tracking-[0.5em] opacity-80">Registry Security Phase</p>
                         <h5 className="text-white text-xl font-black uppercase tracking-tight">Level III Deployment</h5>
                         <div className="h-[2px] w-12 bg-white/30 mx-auto rounded-full"></div>
                         <p className="text-[8px] font-bold text-white/50 uppercase tracking-widest leading-relaxed">System engineered for perpetual statutory transparency at Gondwana University.</p>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        )}

        {activeTab === 'STAFF' && (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-10 animate-in fade-in duration-700">
            <div className={`p-10 rounded-[3rem] border-2 transition-all duration-500 ${editingStaffId ? 'bg-blue-50/40 border-blue-200' : 'bg-white border-slate-100 shadow-sm'}`}>
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-6">
                   <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white ${editingStaffId ? 'bg-blue-600' : 'bg-slate-950'} shadow-xl`}>
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                   </div>
                   <div>
                      <h3 className="text-xl font-black text-slate-900 tracking-tighter uppercase leading-none">
                        {editingStaffId ? 'Modify Official' : 'Provision Official'}
                      </h3>
                      <p className="text-[9px] font-black text-blue-600 uppercase tracking-[0.4em] mt-1.5">Personnel Master Record</p>
                   </div>
                </div>
                {editingStaffId && (
                  <button onClick={resetStaffForm} className="text-[9px] font-black text-rose-600 bg-rose-50 px-4 py-2 rounded-xl border border-rose-100 uppercase tracking-widest transition-all hover:bg-rose-100">Cancel Edit</button>
                )}
              </div>

              <form onSubmit={handleStaffSubmit} className="space-y-6">
                <div className="flex flex-col items-center gap-5 mb-8">
                  <div 
                    onClick={() => photoInputRef.current?.click()}
                    className="w-32 h-32 rounded-[2.5rem] bg-slate-100 border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden cursor-pointer hover:border-blue-500 transition-all group relative shadow-inner"
                  >
                    {photo ? (
                      <img src={photo} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center space-y-2">
                         <svg className="w-10 h-10 text-slate-300 group-hover:text-blue-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                         <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest">Upload Photo</p>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                       <p className="text-[8px] font-black text-white uppercase tracking-widest">Modify Image</p>
                    </div>
                  </div>
                  <input type="file" ref={photoInputRef} className="hidden" accept="image/*" onChange={handlePhotoChange} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Statutory Name</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-blue-500 transition-all font-bold text-sm" placeholder="Dr. S. R. Patil" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Staff ID / Login</label>
                    <input type="text" value={staffId} onChange={(e) => setStaffId(e.target.value)} disabled={!!editingStaffId} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-blue-500 transition-all font-bold text-sm disabled:opacity-50" placeholder="GU_ADMIN_01" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Secure Passphrase</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-blue-500 transition-all font-bold text-sm" placeholder="••••••••" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Official Designation</label>
                    <input type="text" value={designation} onChange={(e) => setDesignation(e.target.value)} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-blue-500 transition-all font-bold text-sm" placeholder="Assistant Registrar" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Department Unit</label>
                    <select value={department} onChange={(e) => setDepartment(e.target.value)} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-blue-500 transition-all font-bold text-sm appearance-none">
                      {departments.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Access Authority</label>
                    <select value={role} onChange={(e) => setRole(e.target.value as UserRole)} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-blue-500 transition-all font-bold text-sm appearance-none">
                      <option value={UserRole.STAFF}>Registry Staff</option>
                      <option value={UserRole.ADMIN}>Statutory Admin</option>
                    </select>
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full py-5 bg-blue-900 text-white rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.3em] shadow-2xl shadow-blue-900/20 hover:bg-blue-800 transition-all active:scale-[0.98] mt-6"
                >
                  {editingStaffId ? 'Confirm Modifications 👁‍🗨' : 'Provision Official Account 👁‍🗨'}
                </button>
              </form>
            </div>

            <div className="space-y-8">
              <h3 className="text-xl font-black text-slate-900 tracking-tighter uppercase flex items-center gap-4">
                 Sovereign Directory
                 <span className="h-[2px] flex-1 bg-slate-100"></span>
              </h3>
              <div className="grid grid-cols-1 gap-4">
                {staffList.map((staff) => (
                  <div key={staff.id} className="p-6 bg-white border border-slate-100 rounded-3xl hover:border-blue-500 transition-all shadow-sm group">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                        {staff.photo ? <img src={staff.photo} alt={staff.name} className="w-full h-full object-cover" /> : <span className="text-slate-300 font-black text-xl">{staff.name.charAt(0)}</span>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                           <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight truncate">{staff.name}</h4>
                           <span className={`text-[7px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest ${staff.role === UserRole.ADMIN ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-500'}`}>{staff.role}</span>
                        </div>
                        <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">{staff.designation}</p>
                        <p className="text-[8px] font-black text-blue-500 uppercase tracking-[0.2em]">{staff.department}</p>
                      </div>
                      <div className="flex flex-col gap-2">
                         <button onClick={() => startEdit(staff)} className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                         </button>
                         {staff.id !== currentUserId && (
                           <button onClick={() => requestConfirm(`Are you sure you want to permanently revoke access for ${staff.name}?`, () => onDeleteStaff(staff.id))} className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:bg-rose-600 hover:text-white transition-all shadow-sm">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                           </button>
                         )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'DEPARTMENTS' && (
          <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in duration-700">
             <div className="bg-white p-12 rounded-[3.5rem] border-2 border-slate-100 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 p-12 opacity-5"><svg className="w-40 h-40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg></div>
                <div className="relative z-10">
                   <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter mb-4">Establish Unit</h3>
                   <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.6em] mb-10">Institutional Department Registry</p>
                   
                   <form onSubmit={handleDeptSubmit} className="flex flex-col md:flex-row gap-6">
                      <input 
                        type="text" 
                        value={newDept}
                        onChange={(e) => setNewDept(e.target.value)}
                        placeholder="DEPARTMENT OF..."
                        className="flex-1 px-8 py-5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-blue-500 font-bold uppercase text-xs"
                      />
                      <button type="submit" className="px-10 py-5 bg-slate-950 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl hover:bg-blue-600 active:scale-95 transition-all">Add Unit</button>
                   </form>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {departments.map(dept => (
                  <div key={dept} className="p-6 bg-white border border-slate-100 rounded-3xl flex justify-between items-center group hover:border-blue-200 transition-all">
                    <div>
                       <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest mb-1">Administrative Unit</p>
                       <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">{dept}</h4>
                    </div>
                    <button onClick={() => requestConfirm(`Delete ${dept} from the registry?`, () => onDeleteDepartment(dept))} className="p-3 bg-slate-50 text-slate-300 rounded-xl hover:bg-rose-600 hover:text-white transition-all opacity-0 group-hover:opacity-100">
                       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
                ))}
             </div>
          </div>
        )}

        {activeTab === 'BRANDING' && (
          <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in duration-700">
             <div className="bg-white p-16 rounded-[4rem] border-2 border-slate-100 shadow-sm text-center">
                <h3 className="text-4xl font-black text-slate-950 uppercase tracking-tighter mb-4">University Identity</h3>
                <p className="text-[11px] font-black text-blue-600 uppercase tracking-[0.6em] mb-16">Statutory Branding Sovereignty</p>
                
                <div className="flex flex-col items-center gap-12">
                   <div className="relative group">
                      <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-[3rem] blur opacity-10 group-hover:opacity-30 transition-opacity"></div>
                      <div className="relative w-56 h-56 bg-white rounded-[3rem] border-2 border-slate-100 shadow-2xl flex items-center justify-center p-8 overflow-hidden group-hover:scale-105 transition-transform">
                         {universityLogo ? (
                           <img src={universityLogo} alt="University Logo" className="w-full h-full object-contain" />
                         ) : (
                           <div className="w-full h-full bg-slate-950 rounded-2xl flex items-center justify-center text-white font-black text-7xl">G</div>
                         )}
                         <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity backdrop-blur-[2px]">
                            <button onClick={() => logoInputRef.current?.click()} className="px-6 py-3 bg-white text-slate-950 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-2xl">Modify Identity</button>
                         </div>
                      </div>
                   </div>
                   <input type="file" ref={logoInputRef} className="hidden" accept="image/*" onChange={handleLogoChange} />
                   
                   <div className="space-y-4 max-w-lg">
                      <p className="text-xl font-black text-slate-900 uppercase tracking-tight">Gondwana University, Gadchiroli</p>
                      <p className="text-xs font-bold text-slate-400 uppercase leading-relaxed tracking-widest">The official logo appears on all digitized green-sheets, verification dispatches, and statutory reports generated by NotePro.</p>
                   </div>
                </div>
             </div>
          </div>
        )}

        {activeTab === 'DATABASE' && (
          <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in duration-700">
             <div className="bg-slate-950 p-16 rounded-[4rem] text-center space-y-12 shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(37,99,235,0.05)_0%,transparent_100%)]"></div>
                <div className="relative z-10 space-y-6">
                   <h3 className="text-5xl font-black text-white uppercase tracking-tighter">Statutory Archive</h3>
                   <p className="text-[11px] font-black text-blue-500 uppercase tracking-[0.5em]">Local Deployment Management</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                   <div className="p-10 bg-white/5 border border-white/10 rounded-[3rem] text-left group hover:bg-white/10 transition-all cursor-pointer" onClick={exportDatabase}>
                      <div className="w-12 h-12 bg-blue-600/20 text-blue-500 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                         <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                      </div>
                      <h4 className="text-white text-xl font-black uppercase tracking-tight mb-3">Backup Core</h4>
                      <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest leading-relaxed">Export the entire university registry including staff profiles, dispatches, and institutional memory.</p>
                   </div>
                   <div className="p-10 bg-white/5 border border-white/10 rounded-[3rem] text-left group hover:bg-white/10 transition-all cursor-pointer relative">
                      <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="application/json" onChange={handleImportDatabase} />
                      <div className="w-12 h-12 bg-indigo-600/20 text-indigo-500 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                         <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4-4m4-4v12" /></svg>
                      </div>
                      <h4 className="text-white text-xl font-black uppercase tracking-tight mb-3">Restore Node</h4>
                      <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest leading-relaxed">Synchronize institutional records from a verified deployment package. This overwrites all local state.</p>
                   </div>
                </div>

                <div className="pt-10 border-t border-white/5 relative z-10">
                   <p className="text-[10px] font-black text-rose-500 uppercase tracking-[0.4em] mb-8">Danger Protocol</p>
                   <button 
                     onClick={() => requestConfirm("TERMINAL ALERT: This will permanently delete all records and refresh the deployment state. This cannot be undone.", () => {
                       indexedDB.deleteDatabase('GondwanaNoteFlowDB');
                       window.location.reload();
                     })}
                     className="px-12 py-5 border-2 border-rose-950 text-rose-500 rounded-3xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-rose-950 hover:text-white transition-all active:scale-95"
                   >
                      Factory Registry Purge
                   </button>
                </div>
             </div>
          </div>
        )}

      </div>

      {/* ADMIN FOOTER */}
      <div className="p-6 bg-white border-t border-slate-100 text-center relative">
         <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-100 to-transparent"></div>
         <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.5em] mb-2">Master Governance Dashboard</p>
         <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">Developed by Dr. Krishna Karoo • Gondwana NotePro v2.5.0 Deployment Node • Secured Environment</p>
      </div>
    </div>
  );
};

export default AdminPanel;
