import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
// Pamiętaj o ścieżce relatywnej, którą ustaliliśmy wcześniej
import { services } from '../../../data/services'; 

// 1. GENEROWANIE ŚCIEŻEK (Tu bez zmian, bo to działa w czasie budowania)
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

// 2. METADANE SEO (Naprawione pod Next.js 15)
export async function generateMetadata({ params }: { params: Promise<{ category: string; service: string }> }) {
  // AWAITOWANIE PARAMSÓW
  const { category: categorySlug, service: serviceSlug } = await params;

  const categoryData = services.find((s) => s.slug === categorySlug);
  if (!categoryData) return { title: 'Nie znaleziono' };

  const card = categoryData.cards.find((c) => c.href.endsWith(`/${serviceSlug}`));
  if (!card) return { title: 'Nie znaleziono usługi' };

  return {
    title: `${card.title} | ${categoryData.label}`,
    description: card.desc,
  };
}

// 3. GŁÓWNY KOMPONENT (Naprawiony pod Next.js 15)
export default async function SubServicePage({ params }: { params: Promise<{ category: string; service: string }> }) {
  // AWAITOWANIE PARAMSÓW - TO JEST KLUCZOWA ZMIANA
  const { category: categorySlug, service: serviceSlug } = await params;

  // Dalej używamy już rozpakowanych zmiennych
  const category = services.find((s) => s.slug === categorySlug);
  if (!category) notFound();

  const card = category.cards.find((c) => c.href.endsWith(`/${serviceSlug}`));
  if (!card) notFound();

  const Icon = card.icon;

  return (
    <main className="min-h-screen bg-[#050505] text-white pt-32 pb-20 relative overflow-hidden">
        
        <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-blue-900/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[40vw] h-[40vw] bg-indigo-900/5 blur-[100px] rounded-full pointer-events-none" />

        <div className="container mx-auto px-6 relative z-10">
            
            <div className="mb-12">
                <Link 
                    href={`/uslugi/${categorySlug}`} 
                    className="inline-flex items-center gap-2 text-slate-500 hover:text-white transition-colors text-sm font-medium group"
                >
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    Wróć do {category.label}
                </Link>
            </div>

            <div className="max-w-4xl mb-16">
                <div className="inline-flex items-center justify-center p-4 rounded-2xl bg-blue-500/10 text-blue-400 mb-8 border border-blue-500/20 shadow-[0_0_30px_-10px_rgba(59,130,246,0.3)]">
                    <Icon size={40} />
                </div>
                <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight text-white leading-tight">
                    {card.title}
                </h1>
                <p className="text-xl md:text-2xl text-slate-400 leading-relaxed max-w-2xl">
                    {card.desc}
                </p>
            </div>

            <div className="grid md:grid-cols-12 gap-12">
                <div className="md:col-span-8 space-y-8">
                    <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 backdrop-blur-sm">
                        <h2 className="text-2xl font-bold mb-4 text-white">Szczegóły usługi</h2>
                        <p className="text-slate-400 leading-relaxed mb-6">
                            Pełny opis usługi <strong>{card.title}</strong>. 
                            Tutaj znajdzie się szczegółowa specyfikacja, proces działania i korzyści biznesowe.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        {['Indywidualne podejście', 'Wsparcie techniczne', 'Skalowalność', 'Nowoczesne technologie'].map((item, i) => (
                            <div key={i} className="flex items-center gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/5">
                                <CheckCircle2 className="text-blue-500" size={20} />
                                <span className="text-slate-300 font-medium">{item}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="md:col-span-4">
                    <div className="sticky top-32 p-6 rounded-3xl bg-gradient-to-br from-blue-900/20 to-black border border-blue-500/20">
                        <h3 className="text-xl font-bold text-white mb-2">Zainteresowany?</h3>
                        <p className="text-slate-400 text-sm mb-6">
                            Skonsultuj z nami swój projekt. Wycena jest darmowa.
                        </p>
                        <Link href="/kontakt" className="block w-full">
                            <button className="w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-blue-50 transition-all active:scale-95 shadow-lg shadow-white/10 cursor-pointer">
                                Darmowa Wycena
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    </main>
  );
}