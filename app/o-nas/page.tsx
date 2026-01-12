'use client';

import { useRef, useEffect, useState } from 'react';
import { 
  ArrowRight, Zap, Users, Clock, TrendingUp, 
  Code2, Globe, Sparkles, Layout, Plus, Minus, MessageSquare 
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// --- DANE ---
const STATS = [
  { value: '100%', label: 'Zaangażowania', desc: 'Ownership projektu', icon: Users },
  { value: '98/100', label: 'Performance', desc: 'Google PageSpeed', icon: Zap },
  { value: '< 24h', label: 'Szybki Kontakt', desc: 'Czas reakcji', icon: Clock },
  { value: 'ROI', label: 'Zwrot z inwestycji', desc: 'Cel nr 1', icon: TrendingUp },
];

const CAPABILITIES = [
    {
        title: "Strategia & Audyt",
        desc: "Nie strzelamy na oślep. Analizujemy konkurencję, definiujemy persony i tworzymy plan, który ma matematyczne szanse na sukces.",
        icon: Globe
    },
    {
        title: "UI/UX Design",
        desc: "Projektujemy interfejsy, które nie tylko wyglądają jak milion dolarów, ale przede wszystkim prowadzą użytkownika za rękę do zakupu.",
        icon: Layout
    },
    {
        title: "Development (Next.js)",
        desc: "Sercem naszych projektów jest kod. Czysty, skalowalny i szybki. Używamy stacku technologicznego z Doliny Krzemowej.",
        icon: Code2
    },
    {
        title: "AI & Automatyzacja",
        desc: "Wdrażamy inteligentne rozwiązania, które oszczędzają Twój czas i obsługują klientów, gdy Ty śpisz.",
        icon: Sparkles
    }
];

const FAQS = [
    {
        question: "Czy przepisujecie prawa autorskie do kodu?",
        answer: "Tak. W momencie opłacenia faktury końcowej, 100% praw majątkowych do kodu i designu przechodzi na Ciebie. Nie stosujemy licencji ani ukrytych opłat typu vendor lock-in."
    },
    {
        question: "Jak wygląda wsparcie po wdrożeniu?",
        answer: "Nie znikamy. Oferujemy opcjonalne pakiety utrzymaniowe (SLA), w ramach których dbamy o aktualizacje, bezpieczeństwo i rozwój projektu. Masz gwarancję reakcji w <24h."
    },
    {
        question: "Jaki jest typowy czas realizacji projektu?",
        answer: "Dla stron korporacyjnych to zazwyczaj 3-5 tygodni. Dla aplikacji webowych i rozbudowanych sklepów e-commerce: 6-12 tygodni. Pracujemy w sprintaach, więc efekty widzisz na bieżąco."
    },
    {
        question: "Czy pracujecie na gotowych szablonach?",
        answer: "Nie. Każdy projekt w Avenly to 'custom code'. Projektujemy i kodujemy od zera, aby zapewnić maksymalną wydajność i unikalny charakter marki, którego nie podrobi konkurencja."
    }
];

export default function AboutPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const statsContainerRef = useRef<HTMLDivElement>(null);
  
  // Stan dla FAQ (Akordeon)
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const toggleFaq = (index: number) => {
      setOpenFaq(openFaq === index ? null : index);
  };

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted) return;
    window.scrollTo(0, 0);

    let ctx = gsap.context(() => {
        let mm = gsap.matchMedia();

        // 1. HERO ANIMATION (ZOOM)
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "+=150%", 
            pin: true,    
            scrub: 1,     
            invalidateOnRefresh: true,
            anticipatePin: 1,
          }
        });

        mm.add("(min-width: 769px)", () => {
           tl.to(textRef.current, {
             scale: 50,
             transformOrigin: "42% 45%", 
             ease: "power2.inOut",
           });
        });

        mm.add("(max-width: 768px)", () => {
            tl.to(textRef.current, {
              scale: 80, 
              transformOrigin: "50% 50%", 
              ease: "power2.inOut",
            });
         });

        tl.to(textRef.current, { opacity: 0, duration: 0.1, ease: "none" }, ">-0.1")
        .to(bgRef.current, { scale: 1.2, ease: "none" }, "<");

    }, containerRef);

    return () => ctx.revert();
  }, [mounted]);

  // --- LOGIKA SPOTLIGHT (Dla neonowych borderów) ---
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!statsContainerRef.current) return;

    const cards = statsContainerRef.current.getElementsByClassName("stat-card");
    
    for (const card of cards) {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      (card as HTMLElement).style.setProperty("--mouse-x", `${x}px`);
      (card as HTMLElement).style.setProperty("--mouse-y", `${y}px`);
    }
  };

  if (!mounted) return null;

  return (
    <main className="bg-[#050505] min-h-screen selection:bg-blue-500/30 selection:text-white overflow-x-hidden font-sans">
      
      {/* =======================================================
          SEKCJA HERO (ZOOM)
         ======================================================= */}
      <div ref={containerRef} className="relative h-screen w-full overflow-hidden">
        <div className="absolute inset-0 w-full h-[100dvh] flex items-center justify-center overflow-hidden">
            <div ref={bgRef} className="absolute inset-0 w-full h-[120%] bg-[#020202] will-change-transform overflow-hidden brightness-125 md:brightness-100">
                <div className="absolute inset-0 bg-black" />
                <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] opacity-70 mix-blend-screen animate-spin-very-slow">
                      <div className="w-full h-full bg-[conic-gradient(from_0deg_at_50%_50%,#000000_0%,#2563eb_25%,#000000_50%,#1d4ed8_75%,#000000_100%)] md:bg-[conic-gradient(from_0deg_at_50%_50%,#000000_0%,#1e3a8a_25%,#000000_50%,#172554_75%,#000000_100%)] blur-[80px]" />
                </div>
                <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] opacity-60 mix-blend-hard-light animate-spin-reverse-slow">
                      <div className="w-full h-full bg-[conic-gradient(from_180deg_at_50%_50%,#000000_0%,#60a5fa_30%,#000000_50%,#3b82f6_70%,#000000_100%)] md:bg-[conic-gradient(from_180deg_at_50%_50%,#000000_0%,#2563eb_30%,#000000_50%,#3b82f6_70%,#000000_100%)] blur-[90px]" />
                </div>
            </div>
            <div 
                ref={textRef}
                className="absolute inset-0 bg-[#050505] z-10 flex items-center justify-center mix-blend-multiply pointer-events-none will-change-transform"
            >
                <h1 className="text-[25vw] md:text-[22vw] font-black text-white tracking-tighter leading-none select-none text-center whitespace-nowrap drop-shadow-[0_0_30px_rgba(255,255,255,0.15)]">AVENLY</h1>
            </div>
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 text-slate-500 text-sm font-medium animate-bounce flex flex-col items-center gap-2 pointer-events-none">
                <span className="text-[10px] uppercase tracking-[0.2em]">Scrolluj w dół</span>
                <div className="w-[1px] h-8 bg-gradient-to-b from-blue-500 to-transparent"></div>
            </div>
        </div>
      </div>

      {/* =======================================================
          SEKCJA CONTENT
         ======================================================= */}
      <article className="relative z-30 bg-[#050505] pt-24 pb-24 border-t border-white/10 shadow-[0_-50px_100px_rgba(0,0,0,0.8)]">
          <div className="container mx-auto px-6">
              
              {/* 1. O NAS (INTRO) */}
              <section className="max-w-4xl mb-24">
                  <header className="flex items-center gap-3 mb-6">
                      <div className="h-[1px] w-12 bg-blue-500"></div>
                      <span className="text-blue-500 font-bold uppercase tracking-widest text-sm">O nas</span>
                  </header>
                  <h2 className="text-4xl md:text-6xl font-bold text-white leading-[1.1] mb-8 tracking-tight">
                      Nie jesteśmy kolejną korporacją. <br className="hidden md:block" />
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">Jesteśmy Twoim partnerem.</span>
                  </h2>
                  <p className="text-lg md:text-xl text-slate-400 leading-relaxed max-w-2xl text-balance">
                      Tworzymy oprogramowanie, które realnie wspiera biznes. Łączymy inżynierską precyzję z designem, który sprzedaje.
                  </p>
                  <div className="mt-10">
                    <a href="/kontakt" aria-label="Rozpocznij współpracę" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black rounded-full font-bold hover:bg-blue-600 hover:text-white transition-all duration-300 group shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)] hover:shadow-blue-600/50">
                        Rozpocznijmy współpracę <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </a>
                  </div>
              </section>

              {/* 2. STATYSTYKI (SPOTLIGHT EFFECT - PANCERNY BORDER) */}
              <section 
                ref={statsContainerRef}
                onMouseMove={handleMouseMove}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 border-t border-white/10 pt-20 group/grid"
                aria-label="Statystyki agencji"
              >
                  {STATS.map((stat, index) => (
                      <div 
                        key={index} 
                        // TŁO KONTENERA = KOLOR BORDERA (bg-white/10 to domyślny border)
                        // p-[1px] tworzy idealną przestrzeń na border
                        className="stat-card group relative rounded-[2rem] bg-white/10 p-[1px] overflow-hidden transition-all duration-300 hover:bg-white/20"
                      >
                          {/* GLOW LAYER (Dynamiczny border podążający za myszką) */}
                          <div 
                            className="absolute inset-0 opacity-0 group-hover/grid:opacity-100 transition-opacity duration-300"
                            style={{
                                background: `radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(59, 130, 246, 1), transparent 40%)`
                            }}
                          />

                          {/* CONTENT LAYER (Czarne tło, zaokrąglone o 1px mniej) */}
                          <div className="relative h-full rounded-[calc(2rem-1px)] bg-[#0c0c0c] p-8 z-10">
                              {/* Delikatny glow wewnątrz (dla głębi) */}
                              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-[2rem]" />
                              
                              <div className="relative mb-8 inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/5 border border-white/5 text-blue-500 group-hover:text-white group-hover:bg-blue-600 group-hover:border-blue-500 transition-all duration-300 shadow-[0_0_0_1px_rgba(255,255,255,0.02)] group-hover:shadow-[0_0_30px_rgba(37,99,235,0.4)]">
                                  <stat.icon size={26} />
                              </div>

                              <div className="relative z-10">
                                  <span className="block text-4xl md:text-5xl font-black text-white mb-3 tracking-tighter group-hover:scale-105 origin-left transition-transform duration-300">{stat.value}</span>
                                  <span className="block text-sm font-bold text-blue-400 uppercase tracking-widest mb-2">{stat.label}</span>
                                  <span className="block text-sm text-slate-500 font-medium leading-relaxed group-hover:text-slate-400 transition-colors">{stat.desc}</span>
                              </div>
                          </div>
                      </div>
                  ))}
              </section>

              {/* 3. KOMPETENCJE (CSS HOVER) */}
              <section className="mt-32 pt-20 border-t border-white/10" aria-label="Nasze kompetencje">
                  <header className="mb-12">
                      <h3 className="text-3xl font-bold text-white">Kompetencje</h3>
                      <p className="text-slate-400 mt-2">Fundamenty, na których budujemy Twój sukces.</p>
                  </header>

                  <ul className="flex flex-col">
                      {CAPABILITIES.map((cap, i) => (
                          <li 
                            key={i} 
                            className="group flex flex-col md:flex-row md:items-center justify-between py-10 border-b border-white/5 transition-all duration-300 hover:border-blue-500/30 hover:bg-white/[0.02] hover:pl-4 cursor-default"
                          >
                              <div className="flex items-center gap-6 md:w-1/3 mb-4 md:mb-0">
                                  <span className="text-blue-500/50 font-mono text-xl transition-colors group-hover:text-blue-500">0{i + 1}</span>
                                  <h4 className="text-2xl md:text-4xl font-bold text-white transition-colors group-hover:text-blue-100">
                                      {cap.title}
                                  </h4>
                              </div>
                              <div className="md:w-1/2 flex items-start gap-6">
                                  <p className="text-slate-300 text-lg leading-relaxed max-w-lg">{cap.desc}</p>
                                  <div className="hidden md:flex w-10 h-10 rounded-full border border-white/20 items-center justify-center text-white bg-blue-500/10 ml-auto shrink-0 transition-all group-hover:bg-blue-500 group-hover:border-blue-500 group-hover:scale-110">
                                      <cap.icon size={18} />
                                  </div>
                              </div>
                          </li>
                      ))}
                  </ul>
              </section>

              {/* 4. FAQ + AI PROMPT (NOWOŚĆ) */}
              <section className="mt-32 pt-20 border-t border-white/10" aria-labelledby="faq-heading">
                  <header className="mb-16 text-center max-w-2xl mx-auto">
                      <h3 id="faq-heading" className="text-3xl font-bold text-white mb-4">Częste pytania</h3>
                      <p className="text-slate-400">Rozwiewamy wątpliwości zanim zapytasz.</p>
                  </header>

                  <div className="max-w-3xl mx-auto space-y-4">
                      {FAQS.map((faq, i) => (
                          <div 
                            key={i} 
                            className="group border border-white/5 bg-white/[0.02] rounded-2xl overflow-hidden transition-all duration-300 hover:border-blue-500/30 hover:bg-white/[0.04]"
                          >
                              <button 
                                onClick={() => toggleFaq(i)}
                                aria-expanded={openFaq === i}
                                aria-controls={`faq-answer-${i}`}
                                className="w-full flex items-center justify-between p-6 text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/50 rounded-2xl"
                              >
                                  <span className="text-lg font-medium text-white group-hover:text-blue-100 transition-colors pr-4">
                                      {faq.question}
                                  </span>
                                  <div className={`relative flex items-center justify-center w-8 h-8 rounded-full border border-white/10 transition-all duration-300 shrink-0 ${openFaq === i ? 'bg-blue-500 border-blue-500 rotate-180' : 'group-hover:bg-white/10'}`}>
                                      {openFaq === i ? <Minus size={16} className="text-white" /> : <Plus size={16} className="text-white" />}
                                  </div>
                              </button>
                              
                              <div 
                                id={`faq-answer-${i}`}
                                className={`overflow-hidden transition-all duration-500 ease-in-out ${openFaq === i ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                              >
                                  <div className="p-6 pt-0 text-slate-400 leading-relaxed text-sm md:text-base border-t border-white/5 mt-2">
                                      {faq.answer}
                                  </div>
                              </div>
                          </div>
                      ))}

                      {/* SPECIAL AI CARD */}
                      <div className="relative mt-8 group">
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
                          <div className="relative border border-blue-500/30 bg-gradient-to-r from-blue-900/20 to-indigo-900/20 rounded-2xl p-1 overflow-hidden">
                              <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-[#0a0a0a]/80 backdrop-blur-xl rounded-xl p-6">
                                  <div className="flex items-center gap-4">
                                      <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20 text-blue-400 animate-pulse-slow">
                                          <Sparkles size={24} />
                                      </div>
                                      <div className="text-left">
                                          <h4 className="text-white font-bold text-lg">Inne pytanie?</h4>
                                          <p className="text-slate-400 text-sm">Zapytaj naszego Avenly AI lub napisz bezpośrednio.</p>
                                      </div>
                                  </div>
                                  <a 
                                    href="/kontakt"
                                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors shadow-lg shadow-blue-900/20 whitespace-nowrap"
                                  >
                                      <MessageSquare size={18} />
                                      Rozpocznij czat
                                  </a>
                              </div>
                          </div>
                      </div>
                  </div>
              </section>

          </div>
      </article>
    </main>
  );
}