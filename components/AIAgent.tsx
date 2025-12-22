
import React, { useState, useRef, useEffect } from 'react';
import { getAIAssistantResponse, ChatMessage } from '../services/geminiService';

const AIAgent: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [pendingImage, setPendingImage] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'ai', text: "Greetings. I am your Digital Concierge for the NotePro system, developed by Dr. Krishna Karoo. I can help you draft statutory notes, explain university protocols, or guide you through the 'Green Sheet' workflow. How may I assist your duties today?" }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPendingImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSend = async () => {
    if ((!query.trim() && !pendingImage) || isLoading) return;

    const userMsg = query.trim();
    const currentImage = pendingImage;
    
    setMessages(prev => [...prev, { role: 'user', text: userMsg || "[Sent an image]", image: currentImage || undefined }]);
    setQuery('');
    setPendingImage(null);
    setIsLoading(true);

    try {
      const response = await getAIAssistantResponse(userMsg, messages, currentImage || undefined);
      setMessages(prev => [...prev, { role: 'ai', text: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', text: "Service Disrupted: Unable to reach the statutory AI node. Please ensure your session is secure and try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="no-print fixed bottom-8 right-8 z-[200] flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-[350px] sm:w-[450px] h-[600px] bg-slate-900/98 backdrop-blur-3xl rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.6)] border border-white/10 overflow-hidden flex flex-col animate-in slide-in-from-bottom-10 duration-500 ring-1 ring-amber-500/20">
          <div className="p-8 bg-gradient-to-br from-slate-950 to-slate-900 border-b border-white/5 flex items-center justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="flex items-center gap-5 relative z-10">
              <div className="relative">
                <div className="w-14 h-14 bg-amber-500 rounded-2xl flex items-center justify-center text-slate-950 font-black shadow-2xl rotate-3 overflow-hidden border-2 border-amber-400/30">
                   <img 
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150" 
                    className="w-full h-full object-cover grayscale brightness-110" 
                    alt="Dr. Krishna Karoo Avatar"
                   />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-slate-900 rounded-full animate-pulse"></div>
              </div>
              <div>
                <h4 className="text-[12px] font-black text-white uppercase tracking-wider">NotePro Assistant</h4>
                <p className="text-[8px] font-black text-amber-500 uppercase tracking-[0.4em] opacity-90">Sovereign AI Node</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/30 hover:text-white transition-all hover:rotate-90">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar bg-slate-900/50">
            {messages.map((m, i) => (
              <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                {m.image && (
                  <div className="mb-2 max-w-[80%] rounded-2xl overflow-hidden border border-white/10 shadow-lg">
                    <img src={m.image} className="w-full h-auto object-cover" alt="Attached" />
                  </div>
                )}
                <div className={`max-w-[88%] p-5 rounded-3xl text-[11.5px] font-medium leading-[1.6] shadow-sm ${
                  m.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-tr-none shadow-blue-900/20' 
                  : 'bg-white/5 text-blue-50/90 rounded-tl-none border border-white/5'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white/5 p-4 rounded-3xl rounded-tl-none border border-white/5 flex flex-col gap-2">
                  <p className="text-[8px] font-black text-amber-500 uppercase tracking-widest animate-pulse">Processing your query...</p>
                  <div className="flex gap-1.5 ml-1">
                    <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce delay-100"></div>
                    <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-8 bg-slate-950/80 border-t border-white/5 relative">
            {pendingImage && (
              <div className="absolute bottom-full left-8 mb-4 animate-in slide-in-from-bottom-4 duration-300">
                <div className="relative w-24 h-24 rounded-2xl overflow-hidden border-4 border-blue-600 shadow-2xl">
                  <img src={pendingImage} className="w-full h-full object-cover" alt="Preview" />
                  <button 
                    onClick={() => setPendingImage(null)}
                    className="absolute top-1 right-1 w-6 h-6 bg-rose-600 text-white rounded-full flex items-center justify-center shadow-lg"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
              </div>
            )}
            
            <div className="relative flex items-center gap-3">
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="w-12 h-12 bg-white/5 text-slate-400 rounded-2xl flex items-center justify-center hover:bg-white/10 hover:text-white transition-all border border-white/10 shrink-0"
                title="Attach Document Photo"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              </button>
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileSelect} />
              
              <div className="relative flex-1 group">
                <input 
                  type="text" 
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask me anything..."
                  className="w-full pl-6 pr-14 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-amber-500/50 focus:bg-white/10 transition-all text-white text-[11px] font-bold placeholder:text-slate-600"
                />
                <button 
                  onClick={handleSend}
                  disabled={isLoading || (!query.trim() && !pendingImage)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-amber-500 text-slate-950 rounded-xl flex items-center justify-center hover:bg-white transition-all active:scale-90 disabled:opacity-30 shadow-xl"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg>
                </button>
              </div>
            </div>
            
            <div className="mt-6 flex flex-col items-center gap-1.5">
              <p className="text-[7px] text-center font-black text-slate-600 uppercase tracking-[0.4em]">
                Integrated Multimodal Assistant
              </p>
              <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest leading-none">
                Developed at PG Teaching Dept. of Computer Science
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`relative w-20 h-20 rounded-[2rem] flex items-center justify-center transition-all duration-700 group shadow-[0_30px_70px_-15px_rgba(245,158,11,0.5)] ${isOpen ? 'bg-white scale-90 rotate-90 rounded-full' : 'bg-amber-500 hover:scale-110 hover:-translate-y-2'}`}
      >
        <div className={`absolute inset-0 rounded-[2rem] bg-amber-500 animate-ping opacity-20 duration-[3000ms] ${isOpen ? 'hidden' : 'block'}`}></div>
        {isOpen ? (
          <svg className="w-10 h-10 text-slate-950" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
        ) : (
          <div className="flex flex-col items-center">
             <div className="w-10 h-10 rounded-xl overflow-hidden mb-0.5 border-2 border-slate-950/20 shadow-lg">
                <img 
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150" 
                  className="w-full h-full object-cover grayscale brightness-125" 
                />
             </div>
             <span className="text-slate-950 font-black text-[9px] tracking-tighter uppercase leading-none">HELP</span>
          </div>
        )}
      </button>
    </div>
  );
};

export default AIAgent;
