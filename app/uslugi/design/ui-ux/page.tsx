'use client';

import Link from 'next/link';
import { 
  ArrowLeft, 
  ArrowRight, 
  Target, 
  Smartphone, 
  Layers, 
  CheckCircle2,
  MonitorSmartphone,
  Eye,
  MousePointerClick
} from 'lucide-react';
import { Reveal } from '@/components/Reveal';
import { motion } from 'framer-motion';
import { AvenlyAICta } from '@/components/AvenlyAICta';

export default function UiUxPage() {
  return (
    <div className="relative min-h-screen bg-[#050505] text-white selection:bg-blue-500/30 overflow-hidden pt-24 lg:pt-28 pb-24">
      
      {/* --- TŁO KINOWE --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-blue-600/10 blur-[150px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-purple-900/10 blur-[150px] rounded-full" />
      </div>

      <main className="relative z-10 container mx-auto px-6">
        
        {/* --- BREADCRUMBS --- */}
        <nav aria-label="Breadcrumb" className="mb-8">
          <Link 
            href="/uslugi/design" 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/5 bg-white/[0.02] text-slate-400 hover:text-white hover:bg-white/10 transition-all text-sm font-medium group backdrop-blur-md w-fit"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            Wróć do: Design
          </Link>
        </nav>

        {/* --- HERO SECTION --- */}
        <section className="grid lg:grid-cols-2 gap-16 items-center mb-32">
          <div>
            <Reveal delay={0.1}>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest mb-6">
                <MonitorSmartphone size={14} /> Projektowanie UI/UX
              </div>
            </Reveal>
            
            <Reveal delay={0.2}>
              <h1 className="text-5xl md:text-6xl lg:text-[3.5rem] xl:text-6xl font-bold tracking-tight text-white mb-8 leading-[1.2]">
                Zyskaj interfejs, który <br className="hidden xl:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 block mt-2 lg:inline lg:mt-0">
                  niezawodnie sprzedaje.
                </span>
              </h1>
            </Reveal>

            <Reveal delay={0.3}>
              <p className="text-base md:text-lg text-slate-400 leading-relaxed max-w-xl mb-10 pr-4">
                Twoi klienci odwiedzają stronę, ale porzucają koszyk? Otrzymujesz sprawdzoną architekturę (UX) i nowoczesny wygląd (UI), dzięki którym odwiedzający płynnie stają się kupującymi. Zbuduj autorytet i przestań tracić zyski.
              </p>
            </Reveal>

            <Reveal delay={0.4}>
              <div className="flex flex-wrap gap-4">
                <Link href="/kontakt">
                  <button className="px-8 py-4 bg-white text-black font-bold rounded-xl hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_-5px_rgba(255,255,255,0.3)] flex items-center gap-2 group cursor-pointer">
                    Odbierz darmową strategię i wycenę <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </Link>
              </div>
            </Reveal>
          </div>

          {/* PRAWA STRONA - GLASSMORPHISM WIZUALIZACJA */}
          <Reveal delay={0.3}>
            <div className="relative w-full aspect-square md:aspect-[4/3] lg:aspect-square flex items-center justify-center group/main">
              
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-[3rem] blur-3xl opacity-50 group-hover/main:opacity-70 group-hover/main:scale-105 transition-all duration-700" />
              
              <div className="relative w-[80%] h-[80%] rounded-[2.5rem] bg-white/[0.02] border border-white/10 backdrop-blur-xl shadow-2xl p-8 flex flex-col justify-between overflow-hidden group hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(59,130,246,0.3)] transition-all duration-500 cursor-default">
                
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 blur-[80px] rounded-full group-hover:bg-blue-400/40 group-hover:scale-110 transition-all duration-700" />
                
                <div className="w-full flex justify-between items-center mb-8 border-b border-white/10 pb-4 relative z-10">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-400 hover:scale-125 transition-all duration-300 cursor-pointer" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80 hover:bg-yellow-400 hover:scale-125 transition-all duration-300 cursor-pointer" />
                    <div className="w-3 h-3 rounded-full bg-green-500/80 hover:bg-green-400 hover:scale-125 transition-all duration-300 cursor-pointer" />
                  </div>
                  <div className="h-2 w-24 bg-white/10 rounded-full group-hover:bg-white/20 transition-colors duration-500" />
                </div>

                <div className="flex-1 flex flex-col gap-5 relative z-10">
                  <div className="h-10 w-3/4 bg-gradient-to-r from-blue-500/20 to-transparent rounded-lg border border-blue-500/10 group-hover:w-[90%] group-hover:from-blue-500/30 transition-all duration-500" />
                  
                  <div className="h-4 w-full bg-white/5 rounded-md group-hover:bg-white/10 transition-colors duration-500 delay-100" />
                  <div className="h-4 w-5/6 bg-white/5 rounded-md group-hover:w-[95%] group-hover:bg-white/10 transition-all duration-500 delay-150" />
                  
                  <div className="mt-auto h-12 w-1/2 bg-blue-500/20 rounded-xl border border-blue-500/30 flex items-center justify-center group-hover:w-2/3 group-hover:bg-blue-500/40 group-hover:shadow-[0_0_20px_-5px_rgba(59,130,246,0.5)] transition-all duration-500 delay-200">
                    <MousePointerClick size={20} className="text-blue-400 group-hover:animate-none group-hover:scale-110 group-hover:text-white transition-all duration-300" />
                  </div>
                </div>

              </div>
            </div>
          </Reveal>
        </section>

        {/* --- NOWY BENTO GRID (Szklany, bez gigantycznych ikon w tle) --- */}
        <section className="mb-32">
          <Reveal>
            <div className="mb-16 text-center max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-bold mb-6">Co zyskujesz dzięki UX?</h2>
              <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">
                Pozbywasz się błędów, które do tej pory przepalały Twój budżet marketingowy. Otrzymujesz produkt cyfrowy zoptymalizowany pod maksymalizację Twojej sprzedaży.
              </p>
            </div>
          </Reveal>

          {/* Wrapper rozciągnięty do max-w-7xl dla większego "oddechu" */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 max-w-7xl mx-auto">
            
            {/* KARTA 1 - Szeroka */}
            <div className="md:col-span-12 h-full">
              <Reveal delay={0.1}>
                <div className="h-full p-8 md:p-12 rounded-[2.5rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-blue-500/30 transition-all duration-500 group relative overflow-hidden flex flex-col md:flex-row items-center gap-8 md:gap-16 hover:-translate-y-2">
                  
                  {/* Ikona główna */}
                  <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 shrink-0 relative z-10 border border-blue-500/20 shadow-[0_0_20px_-5px_rgba(59,130,246,0.3)] group-hover:scale-110 transition-transform duration-500">
                    <Target size={32} />
                  </div>
                  
                  <div className="relative z-10 flex-1 text-center md:text-left">
                    <h3 className="text-3xl font-bold mb-4 text-white group-hover:text-blue-400 transition-colors">
                      Maksymalizacja Twoich Konwersji
                    </h3>
                    <p className="text-slate-400 text-lg leading-relaxed max-w-3xl mx-auto md:mx-0">
                      Zyskujesz stronę, na której każdy element pracuje na Twój zysk. Poprowadzimy Twojego klienta za rękę – prosto do finalizacji zakupu lub wypełnienia formularza kontaktowego.
                    </p>
                  </div>
                </div>
              </Reveal>
            </div>

            {/* KARTA 2 - Kwadratowa */}
            <div className="md:col-span-6 h-full">
              <Reveal delay={0.2}>
                <div className="h-full p-8 md:p-10 rounded-[2.5rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-blue-500/30 transition-all duration-500 group flex flex-col justify-between min-h-[320px] hover:-translate-y-2 relative overflow-hidden">
                  
                  <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 mb-8 relative z-10 border border-blue-500/20 shadow-[0_0_20px_-5px_rgba(59,130,246,0.3)] group-hover:scale-110 transition-transform duration-500">
                    <Smartphone size={28} />
                  </div>
                  
                  <div className="relative z-10">
                    <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-blue-400 transition-colors">Przewaga na Mobile</h3>
                    <p className="text-slate-400 leading-relaxed">
                      Przejmujesz klientów kupujących na smartfonach. Otrzymujesz interfejs równie wygodny, szybki i wciągający co dedykowana aplikacja natywna.
                    </p>
                  </div>
                </div>
              </Reveal>
            </div>

            {/* KARTA 3 - Kwadratowa */}
            <div className="md:col-span-6 h-full">
              <Reveal delay={0.3}>
                <div className="h-full p-8 md:p-10 rounded-[2.5rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-blue-500/30 transition-all duration-500 group flex flex-col justify-between min-h-[320px] hover:-translate-y-2 relative overflow-hidden">
                  
                  <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 mb-8 relative z-10 border border-blue-500/20 shadow-[0_0_20px_-5px_rgba(59,130,246,0.3)] group-hover:scale-110 transition-transform duration-500">
                    <Layers size={28} />
                  </div>
                  
                  <div className="relative z-10">
                    <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-blue-400 transition-colors">Spójność i Autorytet</h3>
                    <p className="text-slate-400 leading-relaxed">
                      Otrzymujesz pełny system wizualny. Twoja marka od pierwszych sekund budzi bezwzględne zaufanie i sprawia wrażenie lidera w swojej branży.
                    </p>
                  </div>
                </div>
              </Reveal>
            </div>

            {/* KARTA 4 - Szeroka (Wyśrodkowana) */}
            <div className="md:col-span-12 h-full">
              <Reveal delay={0.4}>
                <div className="h-full p-8 md:p-12 rounded-[2.5rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-blue-500/30 transition-all duration-500 relative overflow-hidden flex flex-col items-center text-center hover:-translate-y-2 group">
                  
                  <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 mb-6 relative z-10 border border-blue-500/20 shadow-[0_0_20px_-5px_rgba(59,130,246,0.3)] group-hover:scale-110 transition-transform duration-500">
                    <Eye size={32} />
                  </div>
                  
                  <h3 className="text-3xl font-bold mb-4 relative z-10 text-white group-hover:text-blue-400 transition-colors">Psychologia, która sprzedaje</h3>
                  <p className="text-slate-400 text-lg max-w-3xl relative z-10 leading-relaxed">
                    Twoja strona zyskuje status "Premium" w oczach odbiorcy. Odpowiednio kierujemy wzrokiem Twojego klienta, budując w nim natychmiastowe poczucie bezpieczeństwa i chęć podjęcia współpracy z Twoją firmą.
                  </p>
                </div>
              </Reveal>
            </div>
            
          </div>
        </section>

        {/* --- CO ZAWIERA OFERTA (Zakres Prac) --- */}
        <section className="mb-32">
          <Reveal>
            <div className="flex flex-col items-center text-center mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest mb-6">
                <CheckCircle2 size={14} /> Zakres prac
              </div>
              <h3 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Co dokładnie otrzymujesz <br className="hidden md:block"/> w pakiecie?
              </h3>
            </div>
          </Reveal>
          
          <div className="grid lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {[
              { title: "Audyt i Analiza UX", desc: "Zaczynamy od namierzenia błędów obecnego interfejsu, które powodują ucieczkę klientów, oraz analizujemy przewagi konkurencji." },
              { title: "Makiety Wireframes", desc: "Tworzymy surowy szkic struktury i ułożenia elementów (Low-Fi), aby upewnić się, że nawigacja na stronie jest logiczna i intuicyjna." },
              { title: "Design High-Fidelity", desc: "Nakładamy kinowy wygląd, dobieramy paletę kolorów, fonty i autorskie ikony. Projektujemy finalny interfejs piksel po pikselu." },
              { title: "Interaktywny Prototyp", desc: "Otrzymujesz klikalną wersję projektu. Możesz sprawdzić jak zachowają się przyciski i animacje, jeszcze przed napisaniem linijki kodu." }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="p-8 md:p-10 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-blue-500/30 transition-all duration-500 relative overflow-hidden flex flex-col items-start gap-6 group"
              >
                {/* Luksusowy numerek w tle boxa */}
                <div className="absolute -bottom-6 right-0 text-[140px] md:text-[180px] font-black text-blue-500/5 group-hover:text-blue-500/10 transition-colors duration-500 pointer-events-none select-none leading-none z-0">
                  0{i + 1}
                </div>

                <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 shrink-0 group-hover:scale-110 group-hover:bg-blue-500/20 transition-all z-10 shadow-[0_0_20px_-5px_rgba(59,130,246,0.3)] border border-blue-500/20">
                  <CheckCircle2 size={20} />
                </div>

                <div className="relative z-10 flex-1">
                  <h4 className="text-xl md:text-2xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-slate-400 leading-relaxed text-base md:text-lg">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* --- WEZWANIE DO DZIAŁANIA --- */}
        <section className="border-t border-white/10 pt-20">
          <AvenlyAICta />
        </section>

      </main>
    </div>
  );
}