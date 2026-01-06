import type { Metadata } from 'next';
import BlogList from '../../components/blog/BlogList';

// --- SEO METADATA (Server Side) ---
export const metadata: Metadata = {
  title: 'Blog | Wiedza o Technologii i Biznesie - Avenly',
  description: 'Artykuły o programowaniu, designie, AI i marketingu. Dzielimy się wiedzą, jak skalować biznes w cyfrowym świecie.',
  openGraph: {
    title: 'Blog Avenly - Technologia i Biznes',
    description: 'Praktyczna wiedza prosto z software house\'u.',
    url: 'https://avenly.pl/blog',
    siteName: 'Avenly',
    locale: 'pl_PL',
    type: 'website',
  },
};

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-[#050505] pt-32 pb-20 overflow-hidden relative selection:bg-blue-500/30">
      {/* TŁO AMBIENT */}
      <div className="absolute top-0 left-0 w-full h-[800px] pointer-events-none z-0">
         <div className="absolute top-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-blue-900/10 blur-[120px] rounded-full mix-blend-screen opacity-50"></div>
         <div className="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-indigo-900/10 blur-[100px] rounded-full mix-blend-screen opacity-30"></div>
         <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03]"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        
        {/* HEADER */}
        <div className="max-w-4xl mx-auto text-center mb-16 md:mb-24">
            <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight mb-6 leading-tight">
                Wiedza, która buduje <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">
                    przewagę.
                </span>
            </h1>
            <p className="text-slate-400 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
                Dzielimy się tym, czego nauczyliśmy się przy wdrażaniu projektów. 
                Zero teorii, 100% praktyki ze świata IT i marketingu.
            </p>
        </div>

        {/* LISTA ARTYKUŁÓW (CLIENT COMPONENT) */}
        {/* W przyszłości przekażemy tu dane z Sanity jako props: <BlogList initialPosts={sanityData} /> */}
        <BlogList />

      </div>
    </main>
  );
}