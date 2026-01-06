'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Search, ArrowUpRight, Calendar, Clock } from 'lucide-react';
// Importujemy Twój typ danych z pliku
import type { BlogPost } from '../../app/data/posts';

// Kategorie do filtrowania
const CATEGORIES = ["Wszystkie", "Development", "Design & UX", "AI & Automatyzacja", "Biznes", "Marketing", "News", "Tech"];

// Definicja propsów - to naprawia Twój błąd!
interface BlogListProps {
  allPosts: BlogPost[]; // Musi się nazywać allPosts, tak jak w page.tsx
}

export default function BlogList({ allPosts }: BlogListProps) {
    const [filter, setFilter] = useState("Wszystkie");
    const [search, setSearch] = useState("");

    // --- LOGIKA FILTROWANIA ---
    const filteredPosts = allPosts.filter(post => {
        const matchesCategory = filter === "Wszystkie" || post.categories.includes(filter);
        
        // Zabezpieczenie na wypadek gdyby title/excerpt były puste
        const titleMatch = post.title?.toLowerCase().includes(search.toLowerCase()) || false;
        const excerptMatch = post.excerpt?.toLowerCase().includes(search.toLowerCase()) || false;

        return matchesCategory && (titleMatch || excerptMatch);
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
                                <Link href={`/blog/${post.slug}`} className="relative h-56 w-full overflow-hidden block bg-slate-900">
                                    {post.mainImage ? (
                                        <Image 
                                            src={post.mainImage} 
                                            alt={post.title}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-full w-full text-slate-700 bg-white/5">
                                            <span className="text-xs">Brak zdjęcia</span>
                                        </div>
                                    )}
                                    
                                    {/* Kategoria Badge */}
                                    {post.categories && post.categories[0] && (
                                        <div className="absolute top-4 left-4">
                                            <span className="px-3 py-1 text-xs font-bold bg-black/60 backdrop-blur-md text-white rounded-lg border border-white/10">
                                                {post.categories[0]}
                                            </span>
                                        </div>
                                    )}
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