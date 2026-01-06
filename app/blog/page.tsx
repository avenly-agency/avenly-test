import type { Metadata } from 'next';
import BlogList from '../../components/blog/BlogList';
import { blogPosts } from '../data/posts'; // Import danych z pliku

export const metadata: Metadata = {
  title: 'Blog | Wiedza o Technologii i Biznesie - Avenly',
  description: 'Najnowsze trendy w technologii, designie i marketingu. Praktyczne poradniki i analizy.',
};

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-[#050505] relative overflow-hidden">
      
      {/* --- TŁO I EFEKTY DEKORACYJNE (Sekcja Hero) --- */}
      {/* Subtelny gradient od góry */}
      <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-blue-950/20 via-[#050505] to-[#050505] -z-10" />
      
      {/* Niebieska kula światła (lewa strona) */}
      <div className="absolute top-[-200px] left-[-200px] w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px] -z-10 opacity-40 mix-blend-screen pointer-events-none" />
      
      {/* Fioletowa kula światła (prawa strona) */}
      <div className="absolute top-[-300px] right-[-100px] w-[700px] h-[700px] bg-purple-600/15 rounded-full blur-[120px] -z-10 opacity-30 mix-blend-screen pointer-events-none" />

      {/* --- GŁÓWNY KONTENER --- */}
      <div className="container mx-auto px-6 pt-32 pb-20 relative z-10">
          
          {/* NAGŁÓWEK STRONY */}
          <div className="max-w-4xl mx-auto text-center mb-20">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
                  Wiedza, która <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">napędza rozwój</span>.
              </h1>
              <p className="text-lg md:text-xl text-slate-400 leading-relaxed max-w-2xl mx-auto">
                  Poznaj najnowsze trendy w technologii, designie i marketingu. 
                  Praktyczne poradniki i analizy, które pomogą Ci wyprzedzić konkurencję.
              </p>
          </div>
          
          {/* KOMPONENT LISTY POSTÓW (Interaktywny) */}
          {/* Przekazujemy mu dane zaimportowane z pliku posts.ts */}
          <BlogList allPosts={blogPosts} />
      </div>
    </main>
  );
}