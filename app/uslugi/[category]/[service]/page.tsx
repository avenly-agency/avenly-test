import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { services } from '@/app/data/services';
import { Button } from '@/components/ui/button'; // Upewnij się, że masz ten komponent lub użyj zwykłego <button>

// 1. GENEROWANIE ŚCIEŻEK STATYCZNYCH (Dla wydajności i SEO)
export function generateStaticParams() {
  const params: { category: string; service: string }[] = [];

  services.forEach((cat) => {
    cat.cards.forEach((card) => {
      // Wyciągamy ostatnią część URL-a z href
      // np. z "/uslugi/development/strony-internetowe" wyciągamy "strony-internetowe"
      const serviceSlug = card.href.split('/').pop();
      
      if (serviceSlug) {
        params.push({
          category: cat.slug,
          service: serviceSlug,
        });
      }
    });
  });

  return params;
}

// 2. METADANE SEO
export async function generateMetadata({ params }: { params: { category: string; service: string } }) {
  const category = services.find((s) => s.slug === params.category);
  if (!category) return { title: 'Nie znaleziono' };

  // Szukamy karty, której href kończy się na naszym service slug
  const card = category.cards.find((c) => c.href.endsWith(`/${params.service}`));
  if (!card) return { title: 'Nie znaleziono usługi' };

  return {
    title: `${card.title} | ${category.label} - Avenly`,
    description: card.desc,
  };
}

// 3. GŁÓWNY KOMPONENT PODSTRONY USŁUGI
export default function SubServicePage({ params }: { params: { category: string; service: string } }) {
  // Znajdź kategorię
  const category = services.find((s) => s.slug === params.category);
  if (!category) notFound();

  // Znajdź konkretną usługę (kartę)
  const card = category.cards.find((c) => c.href.endsWith(`/${params.service}`));
  if (!card) notFound();

  const Icon = card.icon;

  return (
    <main className="min-h-screen bg-[#050505] text-white pt-32 pb-20 relative overflow-hidden">
        
        {/* TŁO DEKORACYJNE */}
        <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-blue-900/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[40vw] h-[40vw] bg-indigo-900/5 blur-[100px] rounded-full pointer-events-none" />

        <div className="container mx-auto px-6 relative z-10">
            
            {/* NAWIGACJA POWROTNA */}
            <div className="mb-12">
                <Link 
                    href={`/uslugi/${params.category}`} 
                    className="inline-flex items-center gap-2 text-slate-500 hover:text-white transition-colors text-sm font-medium group"
                >
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    Wróć do {category.label}
                </Link>
            </div>

            {/* NAGŁÓWEK */}
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

            {/* SEKCJA Z DETALAMI (Przykładowa treść, bo w services.ts mamy tylko krótkie opisy) */}
            <div className="grid md:grid-cols-12 gap-12">
                
                {/* LEWA KOLUMNA - OPIS */}
                <div className="md:col-span-8 space-y-8">
                    <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 backdrop-blur-sm">
                        <h2 className="text-2xl font-bold mb-4 text-white">O tej usłudze</h2>
                        <p className="text-slate-400 leading-relaxed mb-6">
                            To jest dedykowana podstrona dla usługi <strong>{card.title}</strong>. 
                            Tutaj możesz rozwinąć opis, dodać proces realizacji, technologie czy case study.
                            W tym momencie dane pobierane są dynamicznie z pliku konfiguracyjnego.
                        </p>
                        <p className="text-slate-400 leading-relaxed">
                            Jako część kategorii {category.label}, skupiamy się tutaj na dostarczeniu najwyższej jakości rozwiązań, 
                            które bezpośrednio przekładają się na wyniki Twojego biznesu.
                        </p>
                    </div>

                    {/* PRZYKŁADOWA LISTA KORZYŚCI */}
                    <div className="grid md:grid-cols-2 gap-4">
                        {[
                            'Indywidualne podejście', 
                            'Wsparcie techniczne', 
                            'Skalowalność rozwiązań', 
                            'Nowoczesne technologie'
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/5">
                                <CheckCircle2 className="text-blue-500" size={20} />
                                <span className="text-slate-300 font-medium">{item}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* PRAWA KOLUMNA - CTA (Sticky) */}
                <div className="md:col-span-4">
                    <div className="sticky top-32 p-6 rounded-3xl bg-gradient-to-br from-blue-900/20 to-black border border-blue-500/20">
                        <h3 className="text-xl font-bold text-white mb-2">Zainteresowany?</h3>
                        <p className="text-slate-400 text-sm mb-6">
                            Skonsultuj z nami swój projekt. Wycena jest darmowa i niezobowiązująca.
                        </p>
                        <Link href="/kontakt" className="block w-full">
                            <button className="w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-blue-50 transition-all active:scale-95 shadow-lg shadow-white/10">
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