
import React, { useState } from 'react';
import { UNIVERSITY_NAME } from '../constants';

interface PresentationProps {
  onBack: () => void;
}

const Presentation: React.FC<PresentationProps> = ({ onBack }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const slides = [
    // --- SLIDE 1: MISSION ---
    {
      type: "HERO",
      title: "Statutory Evolution",
      subtitle: "THE DIGITAL SECRETARIAT MISSION",
      tagline: "Transitioning Gondwana University to a Zero-Transit, 100% Transparent Governance Model.",
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1600",
      points: ["Sovereign Infrastructure", "Institutional Memory", "Zero Paper Waste"]
    },
    // --- SLIDE 2: WHY DIGITAL? ---
    {
      type: "EXPLAINER",
      title: "Why NotePro?",
      subtitle: "SOLVING ADMINISTRATIVE LATENCY",
      content: "Traditional paper-based file movement suffers from physical transit delays and tracking gaps. NotePro eliminates these bottlenecks while maintaining the legal sanctity of the process.",
      image: "https://images.unsplash.com/photo-1497215842964-222b430dc094?auto=format&fit=crop&q=80&w=1200",
      stats: [
        { label: "Transit Time", val: "Instant", icon: "⚡" },
        { label: "Traceability", val: "100%", icon: "🔍" },
        { label: "Data Safety", val: "Secure", icon: "🛡️" }
      ]
    },
    // --- SLIDE 3: TECH STACK (NEW) ---
    {
      type: "SPLIT",
      title: "Advanced Tech Stack",
      subtitle: "ENGINEERED FOR EXCELLENCE",
      content: "NotePro is built using a world-class technology stack, ensuring high performance, security, and institutional scalability without the need for expensive external servers.",
      points: [
        "React 19 & TypeScript: Modern UI & Type-Safe Code",
        "Tailwind CSS: High-Performance Visual Architecture",
        "IndexedDB: Local-First Encrypted Data Storage",
        "Google Gemini AI: Statutory Drafting Intelligence"
      ],
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1200"
    },
    // --- SLIDE 4: THE ARCHITECTURE ---
    {
      type: "EXPLAINER",
      title: "Built For Sovereignty",
      subtitle: "SECURE LOCAL ARCHITECTURE",
      content: "Engineered by Dr. Krishna Karoo, NotePro uses 'Local-First' encryption. Your data stays within the university's ecosystem, protected by industrial-grade security protocols.",
      image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1200",
      stats: [
        { label: "Encryption", val: "AES-256", icon: "🔐" },
        { label: "Storage", val: "IndexedDB", icon: "💾" },
        { label: "Access", val: "Bi-Level", icon: "👤" }
      ]
    },
    // --- SLIDE 5: DEPLOYMENT PHASES (NEW) ---
    {
      type: "SPLIT",
      title: "Deployment Roadmap",
      subtitle: "PHASE-WISE INSTITUTIONAL ROLLOUT",
      content: "A systematic 3-phase strategy ensures a smooth transition from traditional files to the NotePro Digital Secretariat across the entire university.",
      points: [
        "Phase I: Pilot (PGTD CS & Digital Cell)",
        "Phase II: Integration (Registrar, Finance & Exams)",
        "Phase III: Saturation (All Depts & Affiliated Units)"
      ],
      image: "https://images.unsplash.com/photo-1504384308090-c89e1227a15f?auto=format&fit=crop&q=80&w=1200"
    },
    // --- SLIDE 6: FISCAL IMPACT ---
    {
      type: "HERO",
      title: "Sustainability Goals",
      subtitle: "ECONOMIC & ENVIRONMENTAL IMPACT",
      tagline: "Reducing the University's carbon footprint and recurring administrative costs by over 90% per annum.",
      image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80&w=1600",
      points: ["90% Paper Reduction", "Zero Toner Waste", "Digital Archiving"]
    },
    // --- SLIDE 7: LEADERSHIP ---
    {
      type: "CREDITS",
      title: "Statutory Leadership",
      subtitle: "VISION & EXECUTION",
      tagline: "NotePro is the result of visionary governance meeting high-end technical engineering.",
      image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80&w=1600",
      leaders: [
        { 
          role: "Digital Architect", 
          name: "Dr. Krishna Karoo", 
          title: "Assistant Professor, PG Dept. of CS",
          desc: "Lead Engineer and Architect of the NotePro Digital Governance Core."
        }
      ]
    }
  ];

  const nextSlide = () => {
    if (activeIndex < slides.length - 1) {
      setActiveIndex(prev => prev + 1);
    } else {
      onBack();
    }
  };

  const prevSlide = () => {
    if (activeIndex > 0) {
      setActiveIndex(prev => prev - 1);
    }
  };

  const currentSlide = slides[activeIndex];

  return (
    <div className="fixed inset-0 bg-slate-950 text-white flex flex-col font-sans overflow-hidden z-[1000] selection:bg-blue-500 selection:text-white">
      
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none z-0">
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(37,99,235,0.05)_0%,transparent_100%)]"></div>
         <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
      </div>

      {/* Slide Progression Indicator */}
      <div className="fixed top-0 left-0 w-full h-1.5 bg-white/5 z-[200]">
        <div 
          className="h-full bg-blue-500 transition-all duration-1000 ease-out shadow-[0_0_20px_rgba(59,130,246,0.5)]"
          style={{ width: `${((activeIndex + 1) / slides.length) * 100}%` }}
        ></div>
      </div>

      {/* Exit Button - Top Right */}
      <button 
        onClick={onBack}
        className="fixed top-6 right-6 z-[200] w-10 h-10 bg-white/5 border border-white/10 rounded-full flex items-center justify-center hover:bg-rose-600 hover:border-rose-500 transition-all active:scale-90 group shadow-2xl"
        title="Exit Presentation"
      >
        <svg className="w-5 h-5 text-white/40 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
      </button>

      {/* Content Area */}
      <main className="flex-1 relative z-10 w-full h-full">
        <div 
          key={activeIndex} 
          className="w-full h-full animate-in fade-in zoom-in-95 duration-700 flex items-center justify-center"
        >
          {currentSlide.type === "HERO" && (
            <div className="w-full h-full relative flex items-center justify-center text-center px-12">
              <div className="absolute inset-0">
                <img src={currentSlide.image} className="w-full h-full object-cover opacity-40 grayscale" alt="Visual" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-950"></div>
              </div>
              <div className="relative z-10 max-w-6xl space-y-12">
                <div className="inline-flex items-center gap-4 px-6 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full w-fit mx-auto backdrop-blur-md">
                  <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.5em]">{currentSlide.subtitle}</span>
                </div>
                <h2 className="text-6xl lg:text-9xl font-black uppercase tracking-tighter leading-none text-white drop-shadow-2xl">
                  {currentSlide.title}
                </h2>
                <p className="text-xl lg:text-3xl text-slate-400 font-medium italic max-w-4xl mx-auto leading-relaxed">
                  {currentSlide.tagline}
                </p>
                <div className="flex justify-center gap-10 pt-10">
                  {currentSlide.points?.map((p, i) => (
                    <div key={i} className="flex flex-col items-center gap-4">
                      <div className="h-0.5 w-12 bg-blue-500 rounded-full"></div>
                      <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/50">{p}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {currentSlide.type === "EXPLAINER" && (
            <div className="w-full h-full grid grid-cols-1 lg:grid-cols-2">
              <div className="flex flex-col justify-center px-12 lg:px-24 xl:px-40 space-y-12 z-10 bg-slate-950/40 backdrop-blur-sm">
                <div className="space-y-6">
                  <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.5em]">{currentSlide.subtitle}</span>
                  <h2 className="text-5xl lg:text-7xl font-black uppercase tracking-tighter leading-none text-white">{currentSlide.title}</h2>
                </div>
                <p className="text-lg lg:text-2xl text-slate-300 leading-relaxed font-medium italic border-l-4 border-blue-500/30 pl-10 py-2">{currentSlide.content}</p>
                <div className="grid grid-cols-3 gap-6">
                   {currentSlide.stats?.map((stat, i) => (
                      <div key={i} className="p-6 bg-white/5 border border-white/10 rounded-2xl text-center space-y-3">
                         <div className="text-3xl">{stat.icon}</div>
                         <h4 className="text-xl font-black text-white leading-none">{stat.val}</h4>
                         <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">{stat.label}</p>
                      </div>
                   ))}
                </div>
              </div>
              <div className="relative h-full overflow-hidden bg-slate-900 hidden lg:block">
                <img src={currentSlide.image} className="w-full h-full object-cover opacity-60" alt="Visual" />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-transparent to-transparent"></div>
              </div>
            </div>
          )}

          {currentSlide.type === "SPLIT" && (
            <div className="w-full h-full grid grid-cols-1 lg:grid-cols-2">
              <div className="relative h-full overflow-hidden bg-slate-900 hidden lg:block">
                <img src={currentSlide.image} className="w-full h-full object-cover opacity-60" alt="Visual" />
                <div className="absolute inset-0 bg-gradient-to-l from-slate-950 via-transparent to-transparent"></div>
              </div>
              <div className="flex flex-col justify-center px-12 lg:px-24 xl:px-40 space-y-12 z-10 bg-slate-950/40 backdrop-blur-sm">
                <div className="space-y-6">
                  <span className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.5em]">{currentSlide.subtitle}</span>
                  <h2 className="text-5xl lg:text-7xl font-black uppercase tracking-tighter leading-none text-white">{currentSlide.title}</h2>
                </div>
                <p className="text-lg lg:text-2xl text-slate-300 leading-relaxed font-medium italic border-l-4 border-emerald-500/30 pl-10 py-2">{currentSlide.content}</p>
                <div className="space-y-4">
                  {currentSlide.points?.map((p, i) => (
                    <div key={i} className="flex items-center gap-5">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                      </div>
                      <span className="text-sm lg:text-lg font-bold text-slate-400 uppercase tracking-widest">{p}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {currentSlide.type === "CREDITS" && (
            <div className="w-full h-full relative flex items-center justify-center text-center px-12">
              <div className="absolute inset-0">
                <img src={currentSlide.image} className="w-full h-full object-cover opacity-30 grayscale" alt="Conclusion" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-950"></div>
              </div>
              <div className="relative z-10 space-y-16 max-w-6xl">
                <div className="space-y-4">
                  <h2 className="text-4xl lg:text-7xl font-black uppercase tracking-tighter leading-none text-white">{currentSlide.title}</h2>
                  <p className="text-[10px] lg:text-xs font-black text-blue-500 uppercase tracking-[0.5em]">{currentSlide.subtitle}</p>
                  <p className="text-lg lg:text-2xl text-slate-400 font-medium italic leading-relaxed max-w-2xl mx-auto">{currentSlide.tagline}</p>
                </div>
                
                <div className="flex flex-col lg:flex-row gap-8 items-stretch justify-center pt-8">
                  {currentSlide.leaders?.map((leader, i) => (
                    <div key={i} className="flex-1 p-10 bg-white/5 border border-white/10 rounded-[2.5rem] backdrop-blur-xl text-left space-y-4 hover:border-blue-500/40 hover:bg-white/10 transition-all duration-500 group">
                      <p className="text-[8px] font-black text-blue-500 uppercase tracking-[0.4em] mb-4">{leader.role}</p>
                      <h4 className="text-2xl lg:text-4xl font-black text-white uppercase tracking-tight group-hover:text-blue-400 transition-colors">{leader.name}</h4>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em]">{leader.title}</p>
                      <div className="h-[1px] w-12 bg-white/10 group-hover:w-full transition-all duration-700"></div>
                      <p className="text-xs font-medium text-slate-500 leading-relaxed italic">{leader.desc}</p>
                    </div>
                  ))}
                </div>

                <div className="pt-10 flex flex-col items-center gap-4">
                   <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-slate-950 font-black text-2xl shadow-2xl">G</div>
                   <p className="text-[8px] font-black text-white/30 uppercase tracking-[0.8em]">Gondwana University • Digital Governance Initiative</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Navigation Controls - Minimized Bottom Right */}
      <div className="fixed bottom-8 right-8 z-[150] flex items-center gap-4 bg-slate-950/80 backdrop-blur-3xl border border-white/10 p-2 rounded-2xl shadow-2xl">
        <button 
          onClick={prevSlide}
          disabled={activeIndex === 0}
          className={`w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white hover:text-slate-950 transition-all active:scale-90 ${activeIndex === 0 ? 'opacity-10 cursor-not-allowed' : 'opacity-100'}`}
          title="Previous"
        >
          <svg className="w-5 h-5 -rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
        </button>

        <div className="px-1 text-center select-none">
          <span className="text-[9px] font-black tabular-nums tracking-widest text-slate-500">{activeIndex + 1} / {slides.length}</span>
        </div>

        <button 
          onClick={nextSlide}
          className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center hover:bg-white hover:text-slate-950 transition-all active:scale-90 shadow-xl group"
          title={activeIndex >= slides.length - 1 ? "Finish" : "Next"}
        >
          <svg className={`w-6 h-6 group-hover:translate-x-0.5 transition-transform ${activeIndex >= slides.length - 1 ? '-rotate-45' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>

    </div>
  );
};

export default Presentation;
