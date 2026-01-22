// app/uslugi/[slug]/page.tsx

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { services } from '../../data/services';

// 1. GENEROWANIE ŚCIEŻEK
export function generateStaticParams() {
  return services.map((service) => ({
    slug: service.slug,
  }));
}

// 2. SEO
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const service = services.find((s) => s.slug === params.slug);
  if (!service) return { title: 'Usługa nie znaleziona' };

  return {
    title: `${service.label} | Avenly Services`,
    description: service.description,
  };
}

// 3. KOMPONENT
export default function ServicePage({ params }: { params: { slug: string } }) {
  const service = services.find((s) => s.slug === params.slug);

  if (!service) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#050505] text-white pt-32 pb-20">
      <div className="container mx-auto px-6">
        
        {/* NAV BACK */}
        <div className="mb-12">
            <Link 
                href="/#oferta" 
                className="inline-flex items-center gap-2 text-slate-500 hover:text-white transition-colors text-sm font-medium"
            >
                <ArrowLeft size={16} />
                Wróć do oferty
            </Link>
        </div>

        {/* HEADER */}
        <div className="max-w-4xl mb-20">
            <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-blue-500/10 text-blue-400 mb-6 border border-blue-500/20">
                <service.icon size={32} />
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
                {service.label}
            </h1>
            <p className="text-xl text-slate-400 leading-relaxed max-w-2xl">
                {service.longDescription || service.description}
            </p>
        </div>

        {/* SZCZEGÓŁOWE KARTY (TE Z GŁÓWNEJ) */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {service.cards.map((card, i) => (
                <div key={i} className="p-8 rounded-3xl bg-[#0a0a0a] border border-white/5 hover:border-blue-500/30 transition-all duration-300 group">
                    <div className="flex justify-between items-start mb-6">
                        <div className="w-12 h-12 rounded-xl bg-blue-900/10 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                            <card.icon size={24} />
                        </div>
                        <Link href={card.href} className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors">
                            <ArrowUpRight className="w-5 h-5 text-slate-400 group-hover:text-white" />
                        </Link>
                    </div>
                    <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-blue-200 transition-colors">
                        {card.title}
                    </h3>
                    <p className="text-slate-400 leading-relaxed">
                        {card.desc}
                    </p>
                </div>
            ))}
        </div>

      </div>
    </main>
  );
}