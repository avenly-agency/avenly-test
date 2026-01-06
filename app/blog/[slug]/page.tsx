import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Calendar, Clock, Share2, Facebook, Linkedin, Twitter } from 'lucide-react';
import { client } from '../../../sanity/lib/client';
import { PortableText, PortableTextComponents } from '@portabletext/react';
import { urlFor } from '../../../sanity/lib/image';

// --- 1. GENERATE STATIC PARAMS (Kluczowe dla Hostingera!) ---
// Ta funkcja mówi Next.js: "Zbuduj mi pliki HTML dla tych wszystkich slugów"
export async function generateStaticParams() {
  const query = `*[_type == "post"]{ "slug": slug.current }`;
  const posts = await client.fetch(query);

  return posts.map((post: any) => ({
    slug: post.slug,
  }));
}

// --- 2. POBIERANIE DANYCH POJEDYNCZEGO WPISU ---
async function getPost(slug: string) {
  const query = `*[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    excerpt,
    "mainImage": mainImage.asset->url,
    publishedAt,
    author->{name, "image": image.asset->url, "role": "Team Avenly"},
    categories[]->title,
    body
  }`;

  return await client.fetch(query, { slug });
}

// --- 3. DYNAMICZNE SEO ---
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getPost(params.slug);
  
  if (!post) return { title: 'Nie znaleziono' };

  return {
    title: `${post.title} | Blog Avenly`,
    description: post.excerpt,
    openGraph: {
      images: [post.mainImage],
    }
  };
}

// --- KONFIGURACJA PORTABLE TEXT (Jak wyświetlać treść) ---
const components: PortableTextComponents = {
    block: {
        h2: ({children}) => <h2 className="text-3xl font-bold text-white mt-12 mb-6">{children}</h2>,
        h3: ({children}) => <h3 className="text-2xl font-bold text-blue-100 mt-8 mb-4">{children}</h3>,
        normal: ({children}) => <p className="text-slate-300 leading-relaxed mb-6">{children}</p>,
        blockquote: ({children}) => (
            <blockquote className="border-l-4 border-blue-500 bg-white/5 p-6 my-8 rounded-r-xl italic text-slate-200">
                {children}
            </blockquote>
        ),
    },
    list: {
        bullet: ({children}) => <ul className="list-disc pl-6 mb-6 text-slate-300 space-y-2 marker:text-blue-500">{children}</ul>,
        number: ({children}) => <ol className="list-decimal pl-6 mb-6 text-slate-300 space-y-2 marker:text-blue-500">{children}</ol>,
    },
    marks: {
        link: ({children, value}) => {
            return (
                <a href={value.href} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline underline-offset-4 decoration-blue-500/30 hover:decoration-blue-500 transition-all">
                    {children}
                </a>
            )
        }
    }
}

// --- GŁÓWNY KOMPONENT STRONY ---
export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="min-h-screen bg-[#050505] selection:bg-blue-500/30">
        
        {/* HERO SECTION Z OBRAZKIEM */}
        <div className="relative w-full h-[60vh] min-h-[400px]">
            <div className="absolute inset-0">
                {post.mainImage && (
                    <Image 
                        src={post.mainImage} 
                        alt={post.title} 
                        fill 
                        className="object-cover"
                        priority
                    />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent" />
            </div>

            <div className="absolute bottom-0 left-0 w-full p-6 pb-12">
                <div className="container mx-auto max-w-4xl">
                    {/* Breadcrumb / Back Link */}
                    <Link href="/blog" className="inline-flex items-center gap-2 text-slate-300 hover:text-white transition-colors mb-6 text-sm font-medium backdrop-blur-md bg-black/30 px-4 py-2 rounded-full border border-white/10">
                        <ArrowLeft size={16} /> Wróć do bloga
                    </Link>

                    {/* Meta Data */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-300 mb-4">
                        {post.categories && post.categories.length > 0 && (
                            <span className="px-3 py-1 bg-blue-600 text-white font-bold rounded-lg text-xs uppercase tracking-wider">
                                {post.categories[0]}
                            </span>
                        )}
                        <div className="flex items-center gap-2">
                            <Calendar size={16} className="text-blue-400"/> 
                            {new Date(post.publishedAt).toLocaleDateString('pl-PL')}
                        </div>
                    </div>

                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                        {post.title}
                    </h1>

                    {/* Author */}
                    {post.author && (
                        <div className="flex items-center gap-4">
                            {post.author.image && (
                                <div className="relative w-12 h-12 rounded-full border-2 border-white/20 overflow-hidden">
                                    <Image src={post.author.image} alt={post.author.name} fill className="object-cover" />
                                </div>
                            )}
                            <div>
                                <p className="text-white font-bold">{post.author.name}</p>
                                <p className="text-slate-400 text-xs">{post.author.role || 'Redakcja Avenly'}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>

        {/* CONTENT & SIDEBAR */}
        <div className="container mx-auto px-6 py-16 lg:py-24">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-7xl mx-auto">
                
                {/* LEWA KOLUMNA: SHARE & STICKY */}
                <aside className="hidden lg:block lg:col-span-2">
                    <div className="sticky top-32 flex flex-col gap-4">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Udostępnij</p>
                        <button className="w-10 h-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-slate-400 hover:bg-[#1877F2] hover:text-white hover:border-transparent transition-all">
                            <Facebook size={18} />
                        </button>
                        <button className="w-10 h-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-slate-400 hover:bg-[#1DA1F2] hover:text-white hover:border-transparent transition-all">
                            <Twitter size={18} />
                        </button>
                        <button className="w-10 h-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-slate-400 hover:bg-[#0A66C2] hover:text-white hover:border-transparent transition-all">
                            <Linkedin size={18} />
                        </button>
                    </div>
                </aside>

                {/* ŚRODEK: TREŚĆ ARTYKUŁU */}
                <div className="lg:col-span-8">
                    
                    {/* Tutaj renderujemy treść z Sanity */}
                    <div className="prose prose-lg prose-invert max-w-none">
                        <PortableText value={post.body} components={components} />
                    </div>
                    
                    {/* --- CTA PO ARTYKULE --- */}
                    <div className="mt-20 p-8 md:p-12 rounded-3xl bg-gradient-to-br from-blue-900/20 to-indigo-900/10 border border-blue-500/20 relative overflow-hidden text-center">
                            <div className="relative z-10">
                            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Podobał Ci się ten artykuł?</h3>
                            <p className="text-slate-300 mb-8 max-w-lg mx-auto">
                                Wdrażamy takie rozwiązania u naszych klientów. Jeśli chcesz porozmawiać o technologii w Twojej firmie – napisz.
                            </p>
                            <Link href="/kontakt" className="inline-flex px-8 py-3 bg-white text-black font-bold rounded-xl hover:bg-blue-50 transition-colors">
                                Darmowa Konsultacja
                            </Link>
                            </div>
                    </div>
                </div>

                <div className="hidden lg:block lg:col-span-2"></div>
            </div>
        </div>

    </article>
  );
}