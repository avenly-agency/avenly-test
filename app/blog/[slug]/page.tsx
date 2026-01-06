import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, User } from 'lucide-react';
import { blogPosts } from '../../data/posts'; 

// --- 1. GENEROWANIE ŚCIEŻEK ---
// To zostaje bez zmian
export function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

// --- 2. SEO (Poprawione pod Next.js 15) ---
// Typ params musi być Promise
type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props) {
  // Rozpakowujemy paramsy za pomocą await
  const { slug } = await params; 
  
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) return { title: 'Artykuł nie znaleziony' };
  
  return {
    title: `${post.title} | Blog Avenly`,
    description: post.excerpt,
  };
}

// --- 3. GŁÓWNY KOMPONENT (Poprawiony pod Next.js 15) ---
// Komponent musi być async
export default async function BlogPostPage({ params }: Props) {
  // Tutaj kluczowa zmiana: czekamy na paramsy
  const { slug } = await params;

  // Szukamy posta używając rozpakowanego sluga
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="min-h-screen bg-[#050505] selection:bg-blue-500/30 overflow-x-hidden">
        
        {/* --- TŁO --- */}
        <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
            <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] mix-blend-screen" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] mix-blend-screen" />
        </div>

        {/* --- HERO --- */}
        <div className="relative pt-32 pb-12 md:pt-40 md:pb-20">
            <div className="container mx-auto px-6 max-w-5xl">
                
                <Link 
                    href="/blog" 
                    className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors mb-8 group"
                >
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    Wróć do listy wpisów
                </Link>

                <div className="flex flex-wrap gap-3 mb-6">
                    {post.categories.map(cat => (
                        <span key={cat} className="px-3 py-1 text-xs font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                            {cat}
                        </span>
                    ))}
                </div>

                <h1 className="text-3xl md:text-5xl md:leading-tight font-bold text-white mb-8">
                    {post.title}
                </h1>

                <div className="flex flex-wrap items-center gap-6 text-sm text-slate-400 border-t border-white/10 pt-6">
                    <div className="flex items-center gap-3">
                        <div>
                            <p className="text-white font-medium">{post.author.name}</p>
                            <p className="text-xs text-slate-500">{post.author.role}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-6 ml-auto md:ml-0">
                        <div className="flex items-center gap-2">
                            <Calendar size={16} className="text-blue-500" />
                            <span>{post.publishedAt}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock size={16} className="text-blue-500" />
                            <span>{post.readTime}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* --- ZDJĘCIE --- */}
        <div className="container mx-auto px-4 md:px-6 max-w-5xl mb-16">
            <div className="relative aspect-video w-full rounded-2xl md:rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                 {post.mainImage ? (
                    <Image 
                        src={post.mainImage} 
                        alt={post.title} 
                        fill 
                        className="object-cover"
                        priority
                    />
                 ) : (
                    <div className="w-full h-full bg-slate-900 flex items-center justify-center text-slate-500">
                        Brak zdjęcia głównego
                    </div>
                 )}
            </div>
        </div>

        {/* --- TREŚĆ --- */}
        <div className="container mx-auto px-6 max-w-5xl pb-24">
            <div 
                className="
                    prose prose-lg prose-invert max-w-none
                    prose-headings:text-white prose-headings:font-bold prose-headings:mt-12 prose-headings:mb-6
                    prose-p:text-slate-300 prose-p:leading-relaxed prose-p:mb-6
                    prose-a:text-blue-400 prose-a:no-underline hover:prose-a:text-blue-300 hover:prose-a:underline
                    prose-strong:text-white prose-strong:font-semibold
                    prose-ul:text-slate-300 prose-ul:list-disc prose-ul:pl-6 prose-ul:mb-6
                    prose-li:marker:text-blue-500 prose-li:mb-2
                    prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:bg-white/5 prose-blockquote:px-6 prose-blockquote:py-4 prose-blockquote:rounded-r-xl prose-blockquote:not-italic prose-blockquote:text-slate-200 prose-blockquote:mb-8
                    prose-ol:text-slate-300 prose-ol:list-decimal prose-ol:pl-6 prose-ol:mb-6
                    blog-content
                "
                dangerouslySetInnerHTML={{ __html: post.content }} 
            />
        </div>

    </article>
  );
}