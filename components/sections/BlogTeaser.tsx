'use client';

import Link from 'next/link';
import { ArrowRight, Calendar, Clock, Tag } from 'lucide-react';
// 👇 POPRAWKA 1: Prawidłowy import (blogPosts zamiast posts)
import { blogPosts } from '@/app/data/posts'; 

export function BlogTeaser() {
  // Pobieramy 3 najnowsze posty
  const latestPosts = blogPosts.slice(0, 3);

  return (
    <section className="py-24 border-t border-white/10 bg-[#050505] relative overflow-hidden">
      
      {/* Tło dekoracyjne */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <span className="text-blue-500 font-mono text-sm tracking-widest uppercase mb-4 block">
              // Wiedza i Insight
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
              Najnowsze ze świata <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
                Technologii i Biznesu
              </span>
            </h2>
          </div>
          
          <Link 
            href="/blog" 
            className="group flex items-center gap-2 text-slate-400 hover:text-white transition-colors pb-2 border-b border-transparent hover:border-blue-500"
          >
            Zobacz wszystkie wpisy
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* GRID POSTÓW */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {latestPosts.map((post: any) => {
            // 👇 POPRAWKA 2: Bezpieczne pobieranie danych (fallbacki)
            // Dzięki temu zadziała niezależnie czy w bazie masz 'image', 'mainImage', 'date' czy 'publishedAt'
            const imageUrl = post.image || post.mainImage || post.coverImage;
            const date = post.date || post.publishedAt || post.createdAt;
            const category = post.category || (post.categories ? post.categories[0] : 'Blog');
            const slug = post.slug?.current || post.slug; // Obsługa Sanity CMS i zwykłego stringa

            return (
              <Link 
                key={post.id || slug} 
                href={`/blog/${slug}`}
                className="group flex flex-col h-full bg-[#0a0a0a] border border-white/5 rounded-2xl overflow-hidden hover:border-blue-500/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-900/10"
              >
                {/* IMAGE */}
                <div className="h-48 w-full bg-[#111] relative overflow-hidden group-hover:brightness-110 transition-all">
                    {imageUrl ? (
                        <img 
                          src={imageUrl} 
                          alt={post.title} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                    ) : (
                        // Fallback gradient
                        <div className="w-full h-full bg-gradient-to-br from-slate-900 to-blue-900/20" />
                    )}
                    
                    {/* KATEGORIA */}
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-black/60 backdrop-blur-md border border-white/10 text-xs font-medium text-white rounded-full flex items-center gap-1.5">
                          <Tag size={10} className="text-blue-400" />
                          {category}
                      </span>
                    </div>
                </div>

                {/* CONTENT */}
                <div className="p-6 flex flex-col flex-grow">
                  
                  {/* DATA I CZAS */}
                  <div className="flex items-center gap-4 text-xs text-slate-500 font-mono mb-4">
                      <div className="flex items-center gap-1.5">
                          <Calendar size={12} />
                          {date}
                      </div>
                      {post.readTime && (
                          <div className="flex items-center gap-1.5">
                              <Clock size={12} />
                              {post.readTime}
                          </div>
                      )}
                  </div>

                  {/* TYTUŁ */}
                  <h3 className="text-xl font-bold text-white mb-3 leading-snug group-hover:text-blue-400 transition-colors">
                      {post.title}
                  </h3>

                  {/* EXCERPT (Zajawka) */}
                  <p className="text-slate-400 text-sm leading-relaxed line-clamp-3 mb-6 flex-grow">
                      {post.excerpt}
                  </p>

                  {/* FOOTER KARTY */}
                  <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                      <span className="text-sm font-medium text-white group-hover:underline decoration-blue-500 decoration-1 underline-offset-4">
                          Czytaj dalej
                      </span>
                      <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                          <ArrowRight size={14} />
                      </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

      </div>
    </section>
  );
}