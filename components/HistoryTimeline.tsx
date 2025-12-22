
import React from 'react';
import { WorkflowEntry, WorkflowAction } from '../types';

interface HistoryTimelineProps {
  history: WorkflowEntry[];
}

const HistoryTimeline: React.FC<HistoryTimelineProps> = ({ history }) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 lg:p-8">
      <h3 className="text-base lg:text-lg font-black text-slate-900 mb-8 flex items-center tracking-tight">
        <div className="w-8 h-8 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center mr-3">
           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        </div>
        Decision Timeline & Remarks
      </h3>
      <div className="flow-root">
        <ul className="-mb-8">
          {history.map((entry, idx) => (
            <li key={entry.id}>
              <div className="relative pb-8">
                {idx !== history.length - 1 ? (
                  <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-slate-100" aria-hidden="true"></span>
                ) : null}
                <div className="relative flex items-start space-x-4">
                  <div className="relative">
                    <span className={`h-8 w-8 rounded-xl flex items-center justify-center ring-6 ring-white shadow-sm transition-transform hover:scale-110 ${
                      entry.action === WorkflowAction.FORWARD ? 'bg-emerald-500' : 
                      entry.action === WorkflowAction.RETURN ? 'bg-amber-500' : 
                      entry.action === WorkflowAction.REJECT ? 'bg-rose-500' : 
                      entry.action === WorkflowAction.APPROVE ? 'bg-indigo-600' : 'bg-slate-500'
                    }`}>
                      {entry.action === WorkflowAction.FORWARD && <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>}
                      {entry.action === WorkflowAction.RETURN && <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7" /></svg>}
                      {entry.action === WorkflowAction.INITIATE && <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>}
                      {entry.action === WorkflowAction.APPROVE && <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>}
                      {entry.action === WorkflowAction.REJECT && <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6" /></svg>}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1.5 mb-1.5">
                      <div className="text-[12px]">
                        <span className="font-black text-slate-900">{entry.from.name}</span>
                        <span className="text-slate-400 font-bold mx-1.5">→</span>
                        <span className="font-black text-slate-900">{entry.to.name}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        {entry.notificationsSent && (
                          <div className="flex items-center gap-1.5">
                            {entry.notificationsSent.email && <div title="Email Sent" className="w-4 h-4 rounded bg-blue-100 text-blue-600 flex items-center justify-center"><svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg></div>}
                            {entry.notificationsSent.sms && <div title="SMS Sent" className="w-4 h-4 rounded bg-amber-100 text-amber-600 flex items-center justify-center"><svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg></div>}
                          </div>
                        )}
                        <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest tabular-nums">
                          {new Date(entry.timestamp).toLocaleString('en-IN', {hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short'})}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 mb-3">
                       <span className={`text-[7px] px-1.5 py-0.5 rounded font-black uppercase tracking-widest ${
                        entry.action === WorkflowAction.FORWARD ? 'bg-emerald-50 text-emerald-600' : 
                        entry.action === WorkflowAction.RETURN ? 'bg-amber-50 text-amber-600' : 
                        entry.action === WorkflowAction.REJECT ? 'bg-rose-50 text-rose-600' :
                        entry.action === WorkflowAction.APPROVE ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-50 text-slate-600'
                       }`}>{entry.action}</span>
                       <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">{entry.from.designation}</span>
                    </div>
                    {entry.remark && (
                      <div className="text-[12px] text-slate-700 bg-slate-50/80 p-4 rounded-xl border border-slate-100 leading-relaxed font-medium italic relative">
                         <div className="absolute top-3 left-[-6px] w-1.5 h-1.5 bg-slate-50 border-l border-t border-slate-100 rotate-[-45deg]"></div>
                        "{entry.remark}"
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default HistoryTimeline;
