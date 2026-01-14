import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowUpRight, Layers } from 'lucide-react';
import { projects } from '@/app/data/projects'; // Upewnij się, że ścieżka jest poprawna

// --- 1. GENEROWANIE ŚCIEŻEK (Tak jak w blogu) ---
export function generateStaticParams() {
  return projects
    .filter((p) => p.hasCaseStudy) // Generujemy podstrony TYLKO dla projektów z Case Study
    .map((p) => ({
      slug: p.slug,
    }));
}

// --- 2. SEO / METADATA (Tak jak w blogu) ---
type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  
  if (!project) return { title: 'Projekt nie znaleziony' };

  return {
    title: `${project.title} | Portfolio Avenly`,
    description: project.description,
  };
}

// --- 3. KOMPONENT GŁÓWNY (Server Component - jak Blog) ---
export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  
  // Szukamy projektu
  const project = projects.find((p) => p.slug === slug);

  // Jeśli brak projektu lub nie ma on Case Study -> 404
  if (!project || !project.hasCaseStudy) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-blue-500/30">
        
        {/* --- NAV BACK --- */}
        <div className="container mx-auto px-6 pt-32 mb-12">
            <Link 
                href="/realizacje" 
                className="inline-flex items-center gap-2 text-slate-500 hover:text-white transition-colors group text-sm font-medium"
            >
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                Wróć do wszystkich realizacji
            </Link>
        </div>

        {/* --- HERO SEKCYJNE --- */}
        <section className="container mx-auto px-6 mb-24">
            <div className="grid lg:grid-cols-2 gap-16 items-end">
                <div>
                    <div className="flex items-center gap-4 text-blue-500 font-mono text-sm tracking-widest uppercase mb-6">
                        <span>{project.client}</span>
                        <span className="w-1 h-1 bg-blue-500 rounded-full"/>
                        <span>{project.year}</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight leading-[1.1]">
                        {project.title}
                    </h1>
                    <p className="text-xl text-slate-400 leading-relaxed max-w-xl">
                        {project.description}
                    </p>

                    {/* Link Live jeśli istnieje */}
                    {project.externalLink && (
                        <div className="mt-8">
                            <a 
                                href={project.externalLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-white border-b border-blue-500 pb-1 hover:text-blue-400 transition-colors"
                            >
                                Zobacz stronę online <ArrowUpRight size={16} />
                            </a>
                        </div>
                    )}
                </div>
                
                {/* STATYSTYKI */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {project.stats?.map((stat, i) => (
                        <div key={i} className="p-6 rounded-2xl bg-white/[0.03] border border-white/5 backdrop-blur-sm">
                            <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                            <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        {/* --- GŁÓWNE ZDJĘCIE --- */}
        <div className="w-full h-[50vh] md:h-[80vh] relative overflow-hidden mb-24 bg-[#111]">
            {project.mainImage ? (
                <Image 
                    src={project.mainImage}
                    alt={project.title}
                    fill
                    className="object-cover"
                    priority
                />
            ) : (
                <div className="w-full h-full bg-gradient-to-br from-slate-900 to-blue-900/20" />
            )}
        </div>

        <div className="container mx-auto px-6">
            
            {/* --- CHALLENGE & SOLUTION --- */}
            <div className="grid lg:grid-cols-2 gap-20 mb-32 border-b border-white/10 pb-20">
                <div>
                    <h3 className="text-2xl font-bold mb-6 flex items-center gap-3 text-white">
                        <span className="w-8 h-8 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center text-sm font-mono font-bold">01</span>
                        Wyzwanie
                    </h3>
                    <p className="text-slate-400 text-lg leading-relaxed">
                        {project.challenge}
                    </p>
                </div>
                <div>
                    <h3 className="text-2xl font-bold mb-6 flex items-center gap-3 text-white">
                        <span className="w-8 h-8 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center text-sm font-mono font-bold">02</span>
                        Rozwiązanie
                    </h3>
                    <p className="text-slate-400 text-lg leading-relaxed">
                        {project.solution}
                    </p>
                </div>
            </div>

            {/* --- TECH STACK --- */}
            <div className="mb-32">
                <h3 className="text-2xl font-bold mb-8 text-white">Technologie</h3>
                <div className="flex flex-wrap gap-4">
                    {project.techStack?.map((tech, i) => (
                        <div key={i} className="px-5 py-3 rounded-xl border border-white/10 bg-white/5 text-slate-300 flex items-center gap-2 hover:bg-white/10 transition-colors cursor-default">
                            <Layers size={16} className="text-blue-500" />
                            {tech}
                        </div>
                    ))}
                </div>
            </div>

            {/* --- GALERIA --- */}
            {project.gallery && project.gallery.length > 0 && (
                <div className="mb-32 space-y-8">
                    <h3 className="text-2xl font-bold mb-8 text-white">Galeria projektu</h3>
                    <div className="grid md:grid-cols-2 gap-8">
                        {project.gallery.map((img, i) => (
                            <div key={i} className="relative aspect-video rounded-2xl overflow-hidden border border-white/5 bg-[#111] group">
                                <Image 
                                    src={img} 
                                    alt={`Galeria ${i}`} 
                                    fill 
                                    className="object-cover group-hover:scale-105 transition-transform duration-700" 
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* --- CTA BOTTOM --- */}
            <div className="pt-10 pb-20 flex flex-col items-center text-center">
                <span className="text-blue-500 mb-4 text-sm font-mono tracking-widest uppercase">Następny krok</span>
                <h2 className="text-4xl md:text-6xl font-bold mb-8 text-white">Podoba Ci się ten efekt?</h2>
                <Link 
                    href="/kontakt" 
                    className="px-10 py-5 bg-white text-black hover:bg-slate-200 rounded-full font-bold transition-all text-lg flex items-center gap-2"
                >
                    Rozpocznij swój projekt
                    <ArrowUpRight className="w-5 h-5" />
                </Link>
            </div>

        </div>
    </main>
  );
}