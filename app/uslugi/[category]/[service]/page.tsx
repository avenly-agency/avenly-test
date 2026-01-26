import { notFound } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  ArrowRight, 
  Star,
  CheckCircle2,
  Cpu, 
  Code2,
  Palette,
  Layout,
  MousePointerClick
} from 'lucide-react';

// IMPORTUJEMY IKONY MAREK
import { 
  FaWordpress, FaReact, FaPhp, FaPython, FaFigma, FaStripe
} from "react-icons/fa";
import { 
  SiNextdotjs, SiTailwindcss, SiVercel, SiMysql, SiWoocommerce, SiRedis, 
  SiAdobeillustrator, SiAdobephotoshop, SiCoreldraw, SiStorybook, 
  SiOpenai, SiZapier, SiAirtable, SiPandas, SiScikitlearn, SiTableau, 
  SiGoogleanalytics, SiGoogleads, SiCanva, SiGooglesearchconsole,
  SiSemrush
} from "react-icons/si";
import { TbBrandFramer } from "react-icons/tb";

import { services } from '../../../data/services'; 
import { AvenlyAICta } from '@/components/AvenlyAICta'; 
import { ProcessAccordion } from '@/components/ProcessAccordion';
// 👇 Upewnij się, że ścieżka pasuje do Twojego folderu
import { Reveal } from '@/components/Reveal';

// --- MAPA IKON ---
const techIconMap: Record<string, any> = {
  "Next.js": SiNextdotjs,
  "Next.js 14": SiNextdotjs,
  "React": FaReact,
  "Tailwind CSS": SiTailwindcss,
  "Vercel": SiVercel,
  "WordPress": FaWordpress,
  "PHP 8.2": FaPhp,
  "MySQL": SiMysql,
  "WooCommerce": SiWoocommerce,
  "Redis": SiRedis,
  "Redis Cache": SiRedis,
  "Stripe API": FaStripe,
  "Integracja z Przelewy24 / Stripe": FaStripe,
  "TypeScript": Code2,
  "Sanity.io / Strapi": Code2,
  "Framer Motion": TbBrandFramer,
  "Impreza Theme": FaWordpress,
  "Yoast SEO": FaWordpress,
  "Figma": FaFigma,
  "Adobe XD": FaFigma,
  "Miro": Code2, 
  "Useberry": Code2,
  "Adobe Illustrator": SiAdobeillustrator,
  "Adobe Photoshop": SiAdobephotoshop,
  "Photoshop": SiAdobephotoshop,
  "CorelDRAW": SiCoreldraw,
  "Storybook": SiStorybook,
  "Zeroheight": Code2,
  "CSS Variables": Code2,
  "OpenAI API": SiOpenai,
  "OpenAI API (GPT-4)": SiOpenai,
  "LangChain": Code2,
  "Pinecone": Code2,
  "Python": FaPython,
  "Make.com": Code2,
  "Make.com (Integromat)": Code2,
  "Zapier": SiZapier,
  "Airtable": SiAirtable,
  "Pandas": SiPandas,
  "Scikit-learn": SiScikitlearn,
  "Tableau": SiTableau,
  "Google Search Console": SiGooglesearchconsole,
  "Ahrefs": Code2,
  "Semrush": SiSemrush,
  "Screaming Frog": Code2,
  "GA4": SiGoogleanalytics,
  "Google Analytics 4": SiGoogleanalytics,
  "Meta Ads": Code2,
  "Meta Ads Manager": Code2,
  "Google Ads": SiGoogleads,
  "Canva": SiCanva,
};

export function generateStaticParams() {
  const params: { category: string; service: string }[] = [];
  services.forEach((cat) => {
    cat.cards.forEach((card) => {
      const serviceSlug = card.href.split('/').pop();
      if (serviceSlug) {
        params.push({ category: cat.slug, service: serviceSlug });
      }
    });
  });
  return params;
}

export async function generateMetadata({ params }: { params: Promise<{ category: string; service: string }> }) {
  const { category: categorySlug, service: serviceSlug } = await params;
  const categoryData = services.find((s) => s.slug === categorySlug);
  if (!categoryData) return { title: 'Nie znaleziono' };
  const card = categoryData.cards.find((c) => c.href.endsWith(`/${serviceSlug}`));
  if (!card) return { title: 'Nie znaleziono usługi' };
  return { title: `${card.title} | ${categoryData.label}`, description: card.desc };
}

export default async function SubServicePage({ params }: { params: Promise<{ category: string; service: string }> }) {
  const { category: categorySlug, service: serviceSlug } = await params;

  const category = services.find((s) => s.slug === categorySlug);
  if (!category) notFound();

  const card = category.cards.find((c) => c.href.endsWith(`/${serviceSlug}`));
  if (!card) notFound();

  const Icon = card.icon;
  const fullDescription = card.fullDescription || card.desc;
  const featuresList = card.features || ['Wydajność', 'Bezpieczeństwo', 'Wsparcie', 'Design'];
  const techStack = (card as any).techStack || [];

  // --- LOGIKA KATEGORII ---
  const isDesign = categorySlug === 'design';
  const isAI = categorySlug === 'automatyzacja-ai' || categorySlug === 'ai' || categorySlug === 'konsultacje-ai' || categorySlug === 'chatbot';
  const isMarketing = categorySlug === 'marketing';
  
  // DYNAMICZNE TYTUŁY SEKCYJNE
  let techSectionTitle = "Stack Technologiczny";
  let techSectionDesc = "Technologie, które gwarantują wydajność i bezpieczeństwo.";

  if (isDesign) {
    techSectionTitle = "Narzędzia Projektowe";
    techSectionDesc = "Pracujemy na standardach branżowych, które ułatwiają wdrożenie i współpracę.";
  } else if (isAI) {
    techSectionTitle = "Stack AI & Automation";
    techSectionDesc = "Najnowocześniejsze modele LLM i platformy integracyjne, na których budujemy Twoje rozwiązania.";
  } else if (isMarketing) {
    techSectionTitle = "Narzędzia Analityczne";
    techSectionDesc = "Dane to podstawa. Używamy najlepszych narzędzi do śledzenia i optymalizacji wyników.";
  }

  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-blue-500/30 overflow-x-hidden">
        
        {/* TŁO */}
        <div className="fixed inset-0 z-0 pointer-events-none bg-[#050505]">
            <div className="absolute top-[-20%] left-0 w-[70vw] h-[600px] bg-blue-900/10 blur-[120px] rounded-full mix-blend-screen opacity-40" />
            <div className="absolute top-[20%] right-[-10%] w-[50vw] h-[50vw] bg-indigo-900/10 blur-[120px] rounded-full opacity-30" />
        </div>

        <div className="relative z-10 pt-32 pb-24">
            
            {/* --- BREADCRUMBS --- */}
            <div className="container mx-auto px-6 mb-12">
                <Link 
                    href={`/uslugi/${categorySlug}`} 
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/5 bg-white/[0.02] text-slate-400 hover:text-white hover:bg-white/10 hover:border-white/10 transition-all text-sm font-medium backdrop-blur-sm group"
                >
                    <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
                    Wróć do: <span className="text-blue-400 ml-1">{category.label}</span>
                </Link>
            </div>

            {/* --- HERO SECTION --- */}
            <div className="container mx-auto px-6 mb-32">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    {/* LEWA STRONA (TEXT) */}
                    <div className="order-2 lg:order-1">
                        <Reveal delay={0.1}>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider mb-6">
                                <Star size={12} fill="currentColor" />
                                {isDesign ? "Design Studio" : (isAI ? "AI Consulting" : "Usługa Premium")}
                            </div>
                        </Reveal>
                        
                        <Reveal delay={0.2}>
                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6 leading-[1.1]">
                                {card.title}
                            </h1>
                        </Reveal>

                        <Reveal delay={0.3}>
                            <p className="text-lg md:text-xl text-slate-400 leading-relaxed max-w-xl mb-10 border-l-2 border-white/10 pl-6">
                                {card.desc}
                            </p>
                        </Reveal>

                        <Reveal delay={0.4}>
                            <div className="flex flex-col sm:flex-row items-start gap-4">
                                <Link href="/kontakt" className="w-full sm:w-auto">
                                    <button className="w-full sm:w-auto px-10 py-5 bg-white text-black font-bold rounded-xl hover:bg-slate-200 transition-all cursor-pointer flex items-center justify-center gap-2">
                                        Darmowa Wycena <ArrowRight size={18} />
                                    </button>
                                </Link>
                                
                                <Link href="#szczegoly" className="w-full sm:w-auto">
                                    <button className="group w-full sm:w-auto px-10 py-5 bg-white/5 border border-white/10 text-white font-medium rounded-xl hover:border-blue-500 hover:bg-blue-500/10 hover:text-blue-200 transition-all duration-300 flex items-center justify-center text-base cursor-pointer">
                                        Dowiedz się więcej
                                    </button>
                                </Link>
                            </div>
                        </Reveal>
                    </div>

                    {/* PRAWA STRONA (IMG) - UKRYTA NA MOBILE */}
                    <div className="order-1 lg:order-2 hidden lg:flex justify-center lg:justify-end relative">
                        <Reveal delay={0.3}>
                            {/* POPRAWKA: lg:ml-auto oraz lg:max-w-[500px] na wrapperze wypycha całość do prawej */}
                            <div className="relative w-full lg:max-w-[500px] lg:ml-auto">
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-blue-500/20 blur-[100px] rounded-full pointer-events-none" />
                                <div className="relative w-full aspect-square rounded-[3rem] bg-gradient-to-br from-white/[0.05] to-transparent border border-white/10 backdrop-blur-md flex items-center justify-center p-12 shadow-2xl">
                                    <div className="w-full h-full rounded-[2rem] bg-[#0a0a0a] border border-white/5 flex items-center justify-center relative overflow-hidden group">
                                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
                                        <Icon size={120} className="text-blue-500 relative z-10 drop-shadow-[0_0_50px_rgba(59,130,246,0.5)]" />
                                    </div>
                                </div>
                            </div>
                        </Reveal>
                    </div>
                </div>
            </div>

            {/* --- GŁÓWNA TREŚĆ --- */}
            <div id="szczegoly" className="container mx-auto px-6">
                <div className="space-y-32">
                    
                    {/* 1. SEKCJA: O ROZWIĄZANIU */}
                    <section>
                        <Reveal>
                            <div className="flex flex-col items-center text-center mb-10">
                                <h2 className="text-sm font-bold uppercase tracking-widest text-blue-400 mb-3">O Rozwiązaniu</h2>
                                <h3 className="text-3xl font-bold text-white">Dlaczego to jest ważne?</h3>
                            </div>
                            <div className="max-w-4xl mx-auto prose prose-invert prose-lg text-slate-300/90 leading-relaxed text-center">
                                {fullDescription.split('\n').map((paragraph, i) => (
                                    <p key={i} className="text-lg md:text-xl font-light mb-6 last:mb-0">
                                        {paragraph}
                                    </p>
                                ))}
                            </div>
                        </Reveal>
                    </section>

                    {/* UNIKALNA SEKCJA DLA DESIGNU */}
                    {isDesign && (
                        <section className="max-w-full">
                            <Reveal>
                                <div className="grid md:grid-cols-3 gap-6">
                                    <div className="p-8 rounded-3xl bg-[#0a0a0a] border border-white/10 hover:border-blue-500/30 transition-colors">
                                        <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-white mb-6">
                                            <Palette size={24} />
                                        </div>
                                        <h4 className="text-xl font-bold text-white mb-2">Psychologia Koloru</h4>
                                        <p className="text-slate-400 text-sm">Dobieramy palety barw, które nie tylko ładnie wyglądają, ale budują zaufanie i kierują uwagą użytkownika.</p>
                                    </div>
                                    <div className="p-8 rounded-3xl bg-[#0a0a0a] border border-white/10 hover:border-blue-500/30 transition-colors">
                                        <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-white mb-6">
                                            <Layout size={24} />
                                        </div>
                                        <h4 className="text-xl font-bold text-white mb-2">Spójność UI</h4>
                                        <p className="text-slate-400 text-sm">Tworzymy systemy designu, dzięki którym każdy ekran aplikacji wygląda profesjonalnie.</p>
                                    </div>
                                    <div className="p-8 rounded-3xl bg-[#0a0a0a] border border-white/10 hover:border-blue-500/30 transition-colors">
                                        <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-white mb-6">
                                            <MousePointerClick size={24} />
                                        </div>
                                        <h4 className="text-xl font-bold text-white mb-2">Konwersja UX</h4>
                                        <p className="text-slate-400 text-sm">Projektujemy interfejsy tak, aby maksymalnie uprościć ścieżkę klienta od wejścia do zakupu.</p>
                                    </div>
                                </div>
                            </Reveal>
                        </section>
                    )}

                    {/* 2. SEKCJA: KORZYŚCI */}
                    <section>
                        <Reveal>
                            <div className="flex flex-col items-center text-center mb-16">
                                <h2 className="text-sm font-bold uppercase tracking-widest text-blue-400 mb-3">Korzyści</h2>
                                <h3 className="text-3xl font-bold text-white">Co otrzymujesz w pakiecie?</h3>
                            </div>
                        </Reveal>
                        
                        <Reveal delay={0.2}>
                            <div className="grid md:grid-cols-2 gap-x-12 gap-y-6 max-w-full">
                                {featuresList.map((item, i) => (
                                    <div 
                                        key={i} 
                                        className="group flex items-center gap-5 p-4 rounded-xl transition-all duration-300 hover:bg-white/[0.02]"
                                    >
                                        <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20 group-hover:bg-blue-500 group-hover:text-white group-hover:shadow-[0_0_15px_rgba(59,130,246,0.5)] transition-all duration-300 shrink-0">
                                            <CheckCircle2 size={20} />
                                        </div>
                                        <div className="flex-1 pb-4 border-b border-white/5 group-hover:border-blue-500/30 transition-colors pt-2">
                                            <h3 className="text-xl font-bold text-white group-hover:text-blue-200 transition-colors">
                                                {item}
                                            </h3>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Reveal>
                    </section>

                    {/* 3. SEKCJA: TECH STACK (DYNAMICZNA) */}
                    {techStack.length > 0 && (
                        <section className="relative rounded-3xl bg-gradient-to-b from-white/[0.03] to-transparent border border-white/5 p-8 md:p-16 overflow-hidden">
                            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-blue-600/5 blur-[100px] rounded-full pointer-events-none" />
                            <Reveal>
                                <div className="text-center mb-12 relative z-10">
                                    <h2 className="text-3xl font-bold text-white mb-4">{techSectionTitle}</h2>
                                    <p className="text-slate-400">{techSectionDesc}</p>
                                </div>
                            </Reveal>
                            
                            <Reveal delay={0.2}>
                                {/* GRID-COLS-2 DLA MOBILE */}
                                <div className="grid grid-cols-2 md:flex md:flex-wrap justify-center gap-3 md:gap-4 relative z-10">
                                    {techStack.map((tech: string, i: number) => {
                                        const TechIcon = techIconMap[tech] || Code2;
                                        return (
                                            <div 
                                                key={i} 
                                                className="
                                                    group flex items-center justify-center md:justify-start gap-3 px-4 py-3 md:px-6 md:py-4 
                                                    rounded-2xl border border-white/10 bg-[#0a0a0a] 
                                                    hover:border-blue-500/50 hover:bg-blue-900/20 hover:shadow-[0_0_25px_-5px_rgba(37,99,235,0.3)]
                                                    transition-all duration-300 cursor-default select-none
                                                "
                                            >
                                                <TechIcon className="w-5 h-5 md:w-6 md:h-6 text-slate-400 group-hover:text-blue-400 transition-colors" />
                                                <span className="text-slate-300 text-sm md:text-base font-mono group-hover:text-white tracking-tight">
                                                    {tech}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </Reveal>
                        </section>
                    )}

                    {/* 4. SEKCJA: PROCES (DYNAMICZNY) */}
                    <section>
                        <Reveal>
                            <div className="flex flex-col items-center text-center mb-16">
                                <h2 className="text-sm font-bold uppercase tracking-widest text-blue-400 mb-3">Jak działamy</h2>
                                <h3 className="text-3xl font-bold text-white">Proces realizacji</h3>
                            </div>
                        </Reveal>

                        <Reveal delay={0.2}>
                            <ProcessAccordion category={categorySlug} />
                        </Reveal>
                    </section>

                    {/* 5. SEKCJA: AVENLY AI */}
                    <section className="container mx-auto">
                        <Reveal>
                            <AvenlyAICta />
                        </Reveal>
                    </section>

                </div>
            </div>

            {/* --- FINAL CTA --- */}
            <div className="container mx-auto px-6 mt-32">
                <Reveal>
                    <div className="relative rounded-[2rem] md:rounded-[3rem] overflow-hidden bg-gradient-to-b from-[#111] to-black border border-white/10 text-center py-12 px-5 md:py-24 md:px-6">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none opacity-50" />
                        
                        <div className="relative z-10 max-w-2xl mx-auto">
                            <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight text-white leading-tight">
                                Zrealizujmy Twój projekt
                            </h2>
                            <p className="text-slate-400 text-base md:text-lg mb-10">
                                Masz pomysł? My mamy technologię. Skontaktuj się z nami, a przygotujemy darmową strategię i wycenę.
                            </p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <Link href="/kontakt" className="w-full sm:w-auto">
                                    <button className="w-full sm:w-auto px-6 py-4 md:px-10 md:py-5 bg-white text-black font-bold rounded-2xl hover:bg-blue-50 transition-all hover:scale-[1.02] active:scale-95 shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] cursor-pointer text-lg flex items-center justify-center gap-2 group">
                                        Rozpocznij współpracę <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </Link>
                                <Link href="/realizacje" className="w-full sm:w-auto">
                                    <button className="w-full sm:w-auto px-6 py-4 md:px-10 md:py-5 bg-white/5 border border-white/10 text-white font-medium rounded-2xl hover:bg-white/10 transition-all cursor-pointer text-lg">
                                        Zobacz Realizacje
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </Reveal>
            </div>

        </div>
    </main>
  );
}