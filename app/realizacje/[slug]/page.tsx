import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowUpRight, Layers } from 'lucide-react';
import { projects } from '@/app/data/projects'; 
import { StatsSpotlight } from '@/components/projects/StatsSpotlight'; 

// --- FUNKCJA POMOCNICZA ---
const ensureHttp = (url: string) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  return `https://${url}`;
};

export function generateStaticParams() {
  return projects
    .filter((p) => p.hasCaseStudy)
    .map((p) => ({ slug: p.slug }));
}

type Props = { params: Promise<{ slug: string }>; };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return { title: 'Projekt nie znaleziony' };
  return { title: `${project.title} | Portfolio Avenly`, description: project.description };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);

  if (!project || !project.hasCaseStudy) {
    notFound();
  }

  const safeExternalLink = project.externalLink ? ensureHttp(project.externalLink) : null;

  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-blue-500/30 relative overflow-hidden">
        
        {/* TŁO */}
        <div className="absolute top-0 left-0 w-full h-[800px] pointer-events-none z-0">
            <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[90%] h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/15 via-[#050505]/10 to-transparent blur-[100px]" />
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
        </div>

        {/* NAV */}
        <div className="container mx-auto px-6 pt-32 mb-12 relative z-10">
            <Link 
                href="/realizacje" 
                className="inline-flex items-center gap-2 text-slate-500 hover:text-white transition-colors group text-sm font-medium"
            >
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                Wróć do wszystkich realizacji
            </Link>
        </div>

        {/* HERO */}
        <section className="container mx-auto px-6 mb-24 relative z-10">
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

                    {safeExternalLink && (
                        <div className="mt-8">
                            <a 
                                href={safeExternalLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-white border-b border-blue-500 pb-1 hover:text-blue-400 transition-colors"
                            >
                                Zobacz stronę online <ArrowUpRight size={16} />
                            </a>
                        </div>
                    )}
                </div>
                
                {/* STATYSTYKI SPOTLIGHT */}
                <div>
                    <StatsSpotlight stats={project.stats || []} />
                </div>
            </div>
        </section>

        {/* --- NOWA SEKCJA: MAKIETA PRZEGLĄDARKI (Zamiast dużego zdjęcia) --- */}
        <section className="container mx-auto px-6 mb-32 relative z-10">
            <div className="relative group">
                {/* Dekoracyjny Glow pod makietą */}
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-3xl blur-2xl opacity-50 group-hover:opacity-70 transition-opacity duration-700" />
                
                {/* Kontener "Przeglądarki" */}
                <div className="relative rounded-2xl border border-white/10 bg-[#0a0a0a] overflow-hidden shadow-2xl">
                    {/* Pasek adresu (Header przeglądarki) */}
                    <div className="h-12 border-b border-white/5 bg-white/[0.02] flex items-center px-4 gap-2">
                        <div className="flex gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/30" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/30" />
                            <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/30" />
                        </div>
                        {/* Fake Address Bar */}
                        <div className="ml-4 px-4 py-1 rounded-full bg-white/5 border border-white/5 text-[10px] text-slate-500 font-mono hidden md:block">
                            avenly.pl/projekty/{project.slug}
                        </div>
                    </div>

                    {/* Zdjęcie projektu w środku */}
                    <div className="relative aspect-video w-full bg-[#111]">
                        {project.mainImage ? (
                            <Image 
                                src={project.mainImage} 
                                alt={project.title} 
                                fill 
                                className="object-cover"
                                priority
                            />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-slate-900 to-blue-900/20 flex items-center justify-center text-slate-600">
                                Brak zdjęcia
                            </div>
                        )}
                        {/* Cień wewnętrzny dla realizmu */}
                        <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.5)] pointer-events-none" />
                    </div>
                </div>
            </div>
        </section>

        <div className="container mx-auto px-6 relative z-10">
            <div className="grid lg:grid-cols-2 gap-20 mb-32 border-b border-white/10 pb-20">
                <div>
                    <h3 className="text-2xl font-bold mb-6 flex items-center gap-3 text-white">
                        <span className="w-8 h-8 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center text-sm font-mono font-bold">01</span>
                        Wyzwanie
                    </h3>
                    <p className="text-slate-400 text-lg leading-relaxed">{project.challenge}</p>
                </div>
                <div>
                    <h3 className="text-2xl font-bold mb-6 flex items-center gap-3 text-white">
                        <span className="w-8 h-8 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center text-sm font-mono font-bold">02</span>
                        Rozwiązanie
                    </h3>
                    <p className="text-slate-400 text-lg leading-relaxed">{project.solution}</p>
                </div>
            </div>

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

            {project.gallery && project.gallery.length > 0 && (
                <div className="mb-32 space-y-8">
                    <h3 className="text-2xl font-bold mb-8 text-white">Galeria projektu</h3>
                    <div className="grid md:grid-cols-2 gap-8">
                        {project.gallery.map((img, i) => (
                            <div key={i} className="relative aspect-video rounded-2xl overflow-hidden border border-white/5 bg-[#111] group">
                                <Image src={img} alt={`Galeria ${i}`} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                            </div>
                        ))}
                    </div>
                </div>
            )}

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