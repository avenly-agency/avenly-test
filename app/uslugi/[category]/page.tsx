import { notFound } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowUpRight, 
  ArrowRight, 
  Zap, 
  ShieldCheck, 
  Trophy 
} from 'lucide-react';
// Ścieżka relatywna do danych
import { services } from '../../data/services';

// 1. GENEROWANIE ŚCIEŻEK
export function generateStaticParams() {
  return services.map((service) => ({
    category: service.slug,
  }));
}

// 2. METADANE SEO
export async function generateMetadata({ params }: { params: Promise<{ category: string }> }) {
  const { category: categorySlug } = await params;
  const service = services.find((s) => s.slug === categorySlug);
  
  if (!service) return { title: 'Usługa nie znaleziona' };

  return {
    title: `${service.label} - Profesjonalne Usługi | Avenly`,
    description: service.description,
  };
}

// 3. GŁÓWNY KOMPONENT STRONY
export default async function ServiceCategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category: categorySlug } = await params;
  const service = services.find((s) => s.slug === categorySlug);

  if (!service) notFound();

  const MainIcon = service.icon;

  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-blue-500/30 overflow-x-hidden">
      
      {/* TŁO DEKORACYJNE (Statyczne, bez animate-pulse dla pewności) */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-blue-900/10 blur-[120px] rounded-full opacity-50" />
          <div className="absolute bottom-[10%] left-[-10%] w-[40vw] h-[40vw] bg-indigo-900/5 blur-[100px] rounded-full opacity-30" />
      </div>

      <div className="container mx-auto px-6 relative z-10 pt-32 pb-20">
        
        {/* --- BREADCRUMBS --- */}
        {/* USUNIĘTO: opacity-0 animate-in... */}
        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-12">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link href="/#uslugi" className="hover:text-white transition-colors">Usługi</Link>
            <span>/</span>
            <span className="text-blue-400 font-medium">{service.label}</span>
        </nav>

        {/* --- HERO SECTION --- */}
        {/* USUNIĘTO: opacity-0 animate-in... */}
        <header className="max-w-4xl mb-24">
            <div className="inline-flex items-center gap-3 p-2 pr-4 rounded-full bg-white/5 border border-white/10 w-fit mb-8 backdrop-blur-sm">
                <div className="p-2 rounded-full bg-blue-500/20 text-blue-400">
                    <MainIcon size={20} />
                </div>
                <span className="text-sm font-medium text-slate-300">Kategoria Główna</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight text-white leading-[1.1]">
                {service.label}
            </h1>
            <p className="text-xl md:text-2xl text-slate-400 leading-relaxed max-w-2xl border-l-2 border-blue-500/30 pl-6">
                {service.longDescription || service.description}
            </p>
        </header>

        {/* --- LISTA USŁUG (GRID) --- */}
        <section className="mb-32">
            <div className="flex items-end justify-between mb-12">
                <h2 className="text-3xl font-bold">Dostępne rozwiązania</h2>
                <div className="hidden md:block h-[1px] flex-1 bg-white/10 ml-8 relative top-[-10px]" />
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {service.cards.map((card, i) => (
                    <Link 
                        key={i} 
                        href={card.href}
                        // USUNIĘTO: opacity-0 i style animationDelay
                        className="group relative flex flex-col justify-between p-8 rounded-3xl bg-[#0a0a0a] border border-white/5 hover:border-blue-500/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] overflow-hidden"
                    >
                        {/* Hover Gradient (zostawiłem bo to czysty CSS) */}
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-8">
                                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-blue-400 group-hover:bg-blue-500 group-hover:text-white group-hover:scale-110 transition-all duration-300 shadow-lg">
                                    <card.icon size={26} />
                                </div>
                                <div className="p-2 rounded-full border border-white/5 text-slate-500 group-hover:text-white group-hover:border-white/20 transition-colors">
                                    <ArrowUpRight size={20} />
                                </div>
                            </div>
                            
                            <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-blue-200 transition-colors">
                                {card.title}
                            </h3>
                            <p className="text-slate-400 leading-relaxed text-sm">
                                {card.desc}
                            </p>
                        </div>

                        <div className="relative z-10 mt-8 pt-6 border-t border-white/5 flex items-center text-sm font-medium text-blue-400 opacity-0 transform translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                            Dowiedz się więcej <ArrowRight size={16} className="ml-2" />
                        </div>
                    </Link>
                ))}
            </div>
        </section>

        {/* --- WARTOŚCI DODANE --- */}
        {/* USUNIĘTO: opacity-0 */}
        <section className="grid md:grid-cols-3 gap-8 mb-32 border-y border-white/5 py-16 bg-white/[0.01]">
            <div className="flex flex-col gap-4 px-4">
                <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-400 mb-2">
                    <Zap size={20} />
                </div>
                <h4 className="text-xl font-bold">Maksymalna wydajność</h4>
                <p className="text-slate-400 text-sm leading-relaxed">
                    Optymalizacja pod kątem szybkości i stabilności.
                </p>
            </div>
            <div className="flex flex-col gap-4 px-4 md:border-l border-white/5">
                <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 mb-2">
                    <ShieldCheck size={20} />
                </div>
                <h4 className="text-xl font-bold">Bezpieczeństwo</h4>
                <p className="text-slate-400 text-sm leading-relaxed">
                    Najnowsze standardy bezpieczeństwa i best-practices.
                </p>
            </div>
            <div className="flex flex-col gap-4 px-4 md:border-l border-white/5">
                <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400 mb-2">
                    <Trophy size={20} />
                </div>
                <h4 className="text-xl font-bold">Jakość Premium</h4>
                <p className="text-slate-400 text-sm leading-relaxed">
                    Kod i design, który jest skalowalny i łatwy w utrzymaniu.
                </p>
            </div>
        </section>

        {/* --- CTA --- */}
        {/* USUNIĘTO: opacity-0 */}
        <section className="relative rounded-[2.5rem] overflow-hidden bg-gradient-to-b from-[#111] to-black border border-white/10 text-center py-20 px-6">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-500/20 blur-[120px] rounded-full pointer-events-none" />
            
            <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
                <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">
                    Gotowy na zmianę?
                </h2>
                <p className="text-slate-400 text-lg mb-10">
                    Rozpocznij projekt w kategorii <span className="text-white font-bold">{service.label}</span>.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                    <Link href="/kontakt" className="w-full sm:w-auto">
                        <button className="w-full sm:w-auto px-8 py-4 bg-white text-black font-bold rounded-xl hover:bg-slate-200 transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_-5px_rgba(255,255,255,0.4)] cursor-pointer">
                            Rozpocznij współpracę
                        </button>
                    </Link>
                </div>
            </div>
        </section>

      </div>
    </main>
  );
}