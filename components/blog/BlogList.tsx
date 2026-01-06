'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Search, ArrowUpRight, Calendar, Clock, Tag } from 'lucide-react';

// --- MOCK DATA (Struktura 1:1 pod Sanity.io) ---
// Później zamienimy to na fetch z CMS
const MOCK_POSTS = [
    {
        id: '1',
        title: 'Jak wdrożyć AI w małej firmie i nie zbankrutować?',
        slug: 'wdrozenie-ai-w-malej-firmie',
        excerpt: 'Automatyzacja nie jest zarezerwowana dla gigantów. Pokazujemy 5 narzędzi, które realnie oszczędzają czas i kosztują grosze.',
        mainImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1000&auto=format&fit=crop',
        publishedAt: '2024-05-15',
        readTime: '5 min',
        author: { name: 'Kamil Nowak', image: 'https://i.pravatar.cc/150?u=a042581f4e29026024d' },
        categories: ['AI & Automatyzacja', 'Biznes']
    },
    {
        id: '2',
        title: 'Next.js 14 vs 15 – Czy warto już migrować?',
        slug: 'nextjs-14-vs-15-migracja',
        excerpt: 'Analiza wydajności i nowych ficzerów. Sprawdzamy Server Actions i Partial Prerendering w praktyce.',
        mainImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=1000&auto=format&fit=crop',
        publishedAt: '2024-05-10',
        readTime: '8 min',
        author: { name: 'Jan Kowalski', image: 'https://i.pravatar.cc/150?u=a04258114e29026302d' },
        categories: ['Development', 'Tech']
    },
    {
        id: '3',
        title: 'Dlaczego Twoja strona nie sprzedaje? 5 błędów UX.',
        slug: 'dlaczego-strona-nie-sprzedaje-ux',
        excerpt: 'Masz ruch, ale nie masz leadów? Prawdopodobnie popełniasz jeden z tych krytycznych błędów w designie.',
        mainImage: 'https://images.unsplash.com/photo-1586717791821-3f44a5638d48?q=80&w=1000&auto=format&fit=crop',
        publishedAt: '2024-04-28',
        readTime: '6 min',
        author: { name: 'Anna Nowak', image: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' },
        categories: ['Design & UX', 'Marketing']
    },
    {
        id: '4',
        title: 'Headless CMS – Przyszłość czy modny buzzword?',
        slug: 'headless-cms-przyszlosc',
        excerpt: 'Porównanie Sanity, Strapi i WordPressa. Kiedy warto odciąć głowę od CMS-a?',
        mainImage: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?q=80&w=1000&auto=format&fit=crop',
        publishedAt: '2024-04-15',
        readTime: '7 min',
        author: { name: 'Kamil Nowak', image: 'https://i.pravatar.cc/150?u=a042581f4e29026024d' },
        categories: ['Tech', 'Development']
    }
];

const CATEGORIES = ["Wszystkie", "Development", "Design & UX", "AI & Automatyzacja", "Biznes", "Marketing"];

export default function BlogList() {
    const [filter, setFilter] = useState("Wszystkie");
    const [search, setSearch] = useState("");

    // --- LOGIKA FILTROWANIA ---
    const filteredPosts = MOCK_POSTS.filter(post => {
        const matchesCategory = filter === "Wszystkie" || post.categories.includes(filter);
        const matchesSearch = post.title.toLowerCase().includes(search.toLowerCase()) || 
                              post.excerpt.toLowerCase().includes(search.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="space-y-12">
            
            {/* --- PASEK NARZĘDZI (Search + Kategorie) --- */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 pb-8 border-b border-white/5">
                
                {/* Kategorie (Scrollowalne na mobile) */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 w-full lg:w-auto scrollbar-hide mask-fade-right">
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setFilter(cat)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap border ${
                                filter === cat 
                                ? 'bg-white text-black border-white' 
                                : 'bg-white/5 text-slate-400 border-white/5 hover:bg-white/10 hover:text-white'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Search Bar */}
                <div className="relative w-full lg:w-72 group">
                    <input 
                        type="text" 
                        placeholder="Szukaj artykułu..." 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-[#080808] border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm text-white focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all placeholder:text-slate-600"
                    />
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4 group-focus-within:text-blue-400 transition-colors" />
                </div>
            </div>

            {/* --- GRID ARTYKUŁÓW --- */}
            {filteredPosts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <AnimatePresence mode="popLayout">
                        {filteredPosts.map((post) => (
                            <motion.article
                                key={post.id}
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.3 }}
                                className="group flex flex-col h-full bg-[#080808] border border-white/5 rounded-3xl overflow-hidden hover:border-blue-500/30 transition-all duration-500 hover:shadow-[0_0_30px_-10px_rgba(37,99,235,0.15)]"
                            >
                                {/* IMAGE */}
                                <Link href={`/blog/${post.slug}`} className="relative h-56 w-full overflow-hidden block">
                                    <Image 
                                        src={post.mainImage} 
                                        alt={post.title}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    {/* Kategoria Badge */}
                                    <div className="absolute top-4 left-4">
                                        <span className="px-3 py-1 text-xs font-bold bg-black/60 backdrop-blur-md text-white rounded-lg border border-white/10">
                                            {post.categories[0]}
                                        </span>
                                    </div>
                                </Link>

                                {/* CONTENT */}
                                <div className="flex flex-col flex-1 p-6 md:p-8">
                                    {/* Meta Info */}
                                    <div className="flex items-center gap-4 text-xs text-slate-500 mb-4 font-medium">
                                        <div className="flex items-center gap-1.5">
                                            <Calendar size={14} className="text-blue-500" />
                                            <time dateTime={post.publishedAt}>{post.publishedAt}</time>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Clock size={14} className="text-blue-500" />
                                            <span>{post.readTime}</span>
                                        </div>
                                    </div>

                                    <Link href={`/blog/${post.slug}`} className="block group-hover:text-blue-400 transition-colors">
                                        <h2 className="text-xl font-bold text-white mb-3 line-clamp-2">
                                            {post.title}
                                        </h2>
                                    </Link>
                                    
                                    <p className="text-slate-400 text-sm leading-relaxed mb-6 line-clamp-3 flex-1">
                                        {post.excerpt}
                                    </p>

                                    {/* Footer: Author & Link */}
                                    <div className="flex items-center justify-between mt-auto pt-6 border-t border-white/5">
                                        <div className="flex items-center gap-3">
                                            <div className="relative w-8 h-8 rounded-full overflow-hidden border border-white/10">
                                                <Image src={post.author.image} alt={post.author.name} fill className="object-cover" />
                                            </div>
                                            <span className="text-xs text-slate-300 font-medium">{post.author.name}</span>
                                        </div>

                                        <Link 
                                            href={`/blog/${post.slug}`}
                                            className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white group-hover:bg-blue-600 group-hover:scale-110 transition-all duration-300"
                                            aria-label="Czytaj dalej"
                                        >
                                            <ArrowUpRight size={16} />
                                        </Link>
                                    </div>
                                </div>
                            </motion.article>
                        ))}
                    </AnimatePresence>
                </div>
            ) : (
                // EMPTY STATE
                <div className="text-center py-20">
                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-500">
                        <Search size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Brak wyników</h3>
                    <p className="text-slate-400">Spróbuj zmienić kategorię lub wpisać inne hasło.</p>
                    <button 
                        onClick={() => { setFilter("Wszystkie"); setSearch(""); }}
                        className="mt-6 text-blue-400 hover:text-blue-300 text-sm font-bold"
                    >
                        Wyczyść filtry
                    </button>
                </div>
            )}
        </div>
    );
}