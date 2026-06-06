import type { Metadata } from 'next';
import BlogList from '../../components/blog/BlogList';
import { BlogHero } from '../../components/blog/BlogHero';
import { BlogHeroBackground } from '../../components/blog/BlogHeroBackground';
import { blogPosts } from '../data/posts'; // Import danych z pliku

export const metadata: Metadata = {
  title: 'Blog - Wiedza o Web Development, AI i Marketingu',
  description:
    'Praktyczne poradniki, analizy i case studies dla właścicieli firm. Web Development · AI · UI/UX · SEO · Marketing. Wiedza, która realnie zwiększa Twoją sprzedaż online.',
  alternates: { canonical: '/blog' },
  keywords: [
    'blog agencja interaktywna',
    'blog web development',
    'blog AI dla biznesu',
    'poradniki SEO',
    'blog chatbot AI',
    'blog UI UX',
    'blog marketing online',
  ],
  openGraph: {
    title: 'Blog Avenly - Wiedza Która Napędza Rozwój',
    description:
      'Web Development · AI · Marketing · SEO. Praktyczne poradniki i analizy dla firm, które chcą wyprzedzić konkurencję.',
    url: '/blog',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog Avenly',
    description: 'Wiedza, która napędza rozwój Twojego biznesu.',
  },
};

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-[#050505] relative overflow-hidden">

      {/* --- TŁO I EFEKTY DEKORACYJNE (Sekcja Hero) --- */}
      {/* Subtelny gradient od góry */}
      <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-blue-950/25 via-[#050505] to-[#050505] -z-10" />

      {/* Niebieska kula światła (lewa strona) */}
      <div className="absolute top-[-200px] left-[-150px] w-[600px] h-[600px] bg-blue-600/15 rounded-full blur-[130px] -z-10 opacity-50 mix-blend-screen pointer-events-none" />

      {/* Indygo kula światła (prawa strona) */}
      <div className="absolute top-[-250px] right-[-100px] w-[650px] h-[650px] bg-indigo-600/12 rounded-full blur-[130px] -z-10 opacity-40 mix-blend-screen pointer-events-none" />

      {/* Subtelna siatka kropek (głębia jak w reszcie strony) */}
      <div
        className="absolute top-0 left-0 w-full h-[700px] -z-10 opacity-60 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(59,130,246,0.06) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(ellipse 80% 55% at 50% 0%, black, transparent)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 55% at 50% 0%, black, transparent)',
        }}
      />

      {/* Shader Contour w hero (wszystkie urządzenia; mobile DPR 1.0 + 30fps + IO pauza). Bloby/grid = baza pod spodem. */}
      <BlogHeroBackground />

      {/* --- GŁÓWNY KONTENER --- */}
      <div className="container mx-auto px-6 pt-32 pb-20 relative z-10">

          {/* NAGŁÓWEK STRONY (animowane wejście - stagger) */}
          <BlogHero />
          
          {/* KOMPONENT LISTY POSTÓW (Interaktywny) */}
          {/* Przekazujemy mu dane zaimportowane z pliku posts.ts */}
          <BlogList allPosts={blogPosts} />
      </div>
    </main>
  );
}