'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Search, ArrowUpRight, Calendar, Clock, ArrowDownWideNarrow, ArrowUpNarrowWide, ArrowRight, Sparkles } from 'lucide-react';
import type { BlogPost } from '../../app/data/posts';

const CATEGORIES = ['Wszystkie', 'Development', 'Design & UX', 'AI & Automatyzacja', 'Biznes', 'Marketing', 'News', 'Tech'];

// Stagger entrance dla pigułek kategorii
const catContainer: Variants = { hidden: {}, visible: { transition: { staggerChildren: 0.05, delayChildren: 0.1 } } };
const catItem: Variants = { hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } } };

// Unikalne wejście narzędzi (sort + search): slide z prawej + scale, stagger
const toolContainer: Variants = { hidden: {}, visible: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } } };
const toolItem: Variants = { hidden: { opacity: 0, x: 24, scale: 0.96 }, visible: { opacity: 1, x: 0, scale: 1, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } } };

interface BlogListProps {
  allPosts: BlogPost[];
}

function fmtDate(d: string) {
  try {
    return new Date(d).toLocaleDateString('pl-PL', { day: 'numeric', month: 'long', year: 'numeric' });
  } catch {
    return d;
  }
}

function MetaRow({ post }: { post: BlogPost }) {
  return (
    <div className="flex items-center gap-4 text-xs text-slate-500 font-medium">
      <span className="inline-flex items-center gap-1.5">
        <Calendar size={14} className="text-blue-500" />
        <time dateTime={post.publishedAt}>{fmtDate(post.publishedAt)}</time>
      </span>
      <span className="inline-flex items-center gap-1.5">
        <Clock size={14} className="text-blue-500" />
        {post.readTime}
      </span>
    </div>
  );
}

function CategoryBadge({ label }: { label?: string }) {
  if (!label) return null;
  return (
    <span className="px-3 py-1 text-xs font-bold bg-black/60 backdrop-blur-md text-white rounded-lg border border-white/10">
      {label}
    </span>
  );
}

// ── Wyróżniony post (pierwszy z aktualnej listy) - duża pozioma karta ──
function FeaturedCard({ post }: { post: BlogPost }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="group grid lg:grid-cols-2 rounded-3xl overflow-hidden border border-white/10 bg-[#080808] transition-all duration-500 hover:border-blue-500/30 hover:shadow-[0_30px_90px_-30px_rgba(37,99,235,0.45)]"
    >
      <Link href={`/blog/${post.slug}`} className="relative h-60 lg:h-auto lg:min-h-[360px] w-full overflow-hidden block bg-slate-900 cursor-pointer">
        {post.mainImage ? (
          <Image src={post.mainImage} alt={post.title} fill className="object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
        ) : (
          <div className="flex items-center justify-center h-full w-full text-slate-700 bg-white/5 text-xs">Brak zdjęcia</div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" aria-hidden="true" />
        <div className="absolute top-4 left-4">
          <CategoryBadge label={post.categories?.[0]} />
        </div>
      </Link>

      <div className="flex flex-col justify-center gap-5 p-6 sm:p-8 md:p-10 lg:p-12">
        <span className="inline-flex items-center gap-2 self-start px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[11px] font-bold uppercase tracking-widest">
          <Sparkles size={12} /> Wyróżnione
        </span>
        <MetaRow post={post} />
        <Link href={`/blog/${post.slug}`} className="cursor-pointer">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight tracking-tight group-hover:text-blue-200 transition-colors line-clamp-3">
            {post.title}
          </h2>
        </Link>
        <p className="text-slate-400 md:text-lg leading-relaxed line-clamp-3">{post.excerpt}</p>
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <span className="text-sm text-slate-300 font-medium">{post.author.name}</span>
          <Link
            href={`/blog/${post.slug}`}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-black text-sm font-bold hover:bg-blue-50 transition-all hover:scale-105 cursor-pointer"
          >
            Czytaj artykuł
            <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}

// ── Zwykła karta ──
function PostCard({ post }: { post: BlogPost }) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.3 }}
      className="group flex flex-col h-full rounded-3xl overflow-hidden border border-white/10 bg-[#080808] transition-all duration-500 hover:border-blue-500/30 hover:-translate-y-1 hover:shadow-[0_24px_60px_-24px_rgba(37,99,235,0.4)]"
    >
      <Link href={`/blog/${post.slug}`} className="relative h-52 w-full overflow-hidden block bg-slate-900 cursor-pointer">
        {post.mainImage ? (
          <Image src={post.mainImage} alt={post.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
        ) : (
          <div className="flex items-center justify-center h-full w-full text-slate-700 bg-white/5 text-xs">Brak zdjęcia</div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" aria-hidden="true" />
        <div className="absolute top-4 left-4">
          <CategoryBadge label={post.categories?.[0]} />
        </div>
      </Link>

      <div className="flex flex-col flex-1 p-6 md:p-7">
        <div className="mb-4">
          <MetaRow post={post} />
        </div>
        <Link href={`/blog/${post.slug}`} className="block cursor-pointer">
          <h2 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-blue-200 transition-colors">{post.title}</h2>
        </Link>
        <p className="text-slate-400 text-sm leading-relaxed mb-6 line-clamp-3 flex-1">{post.excerpt}</p>
        <div className="flex items-center justify-between mt-auto pt-5 border-t border-white/5">
          <span className="text-xs text-slate-300 font-medium">{post.author.name}</span>
          <Link
            href={`/blog/${post.slug}`}
            className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-white group-hover:bg-blue-600 group-hover:scale-110 transition-all duration-300 cursor-pointer"
            aria-label="Czytaj dalej"
          >
            <ArrowUpRight size={16} />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}

export default function BlogList({ allPosts }: BlogListProps) {
  const [filter, setFilter] = useState('Wszystkie');
  const [search, setSearch] = useState('');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

  const scrollRef = useRef<HTMLDivElement>(null);
  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const isDragging = useRef(false);

  // Drag-scroll kategorii (tylko myszka; dotyk = natywny scroll)
  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === 'touch') return;
    if (!scrollRef.current) return;
    isDown.current = true;
    isDragging.current = false;
    startX.current = e.pageX - scrollRef.current.offsetLeft;
    scrollLeft.current = scrollRef.current.scrollLeft;
    scrollRef.current.style.cursor = 'grabbing';
  };
  const handlePointerLeave = () => {
    isDown.current = false;
    if (scrollRef.current) scrollRef.current.style.cursor = 'grab';
  };
  const handlePointerUp = () => {
    isDown.current = false;
    if (scrollRef.current) scrollRef.current.style.cursor = 'grab';
    setTimeout(() => { isDragging.current = false; }, 0);
  };
  const handlePointerMove = (e: React.PointerEvent) => {
    if (e.pointerType === 'touch' || !isDown.current || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX.current) * 2;
    if (Math.abs(x - startX.current) > 5) isDragging.current = true;
    scrollRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const filteredPosts = allPosts.filter((post) => {
    const matchesCategory = filter === 'Wszystkie' || post.categories.includes(filter);
    const titleMatch = post.title?.toLowerCase().includes(search.toLowerCase()) || false;
    const excerptMatch = post.excerpt?.toLowerCase().includes(search.toLowerCase()) || false;
    return matchesCategory && (titleMatch || excerptMatch);
  });

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    const dateA = new Date(a.publishedAt).getTime();
    const dateB = new Date(b.publishedAt).getTime();
    return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
  });

  const toggleSort = () => setSortOrder((prev) => (prev === 'newest' ? 'oldest' : 'newest'));

  const featured = sortedPosts[0];
  const rest = sortedPosts.slice(1);

  return (
    <div className="space-y-12">

      {/* --- PASEK NARZĘDZI --- */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 pb-8 border-b border-white/5">
        <motion.div
          ref={scrollRef}
          variants={catContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          onPointerDown={handlePointerDown}
          onPointerLeave={handlePointerLeave}
          onPointerUp={handlePointerUp}
          onPointerMove={handlePointerMove}
          className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 w-full lg:w-auto select-none mask-fade-right cursor-grab active:cursor-grabbing scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] touch-pan-x"
        >
          {CATEGORIES.map((cat) => (
            <motion.button
              key={cat}
              variants={catItem}
              onClick={() => { if (!isDragging.current) setFilter(cat); }}
              onPointerDown={(e) => { if (e.pointerType === 'mouse') e.preventDefault(); }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap border shrink-0 cursor-pointer ${
                filter === cat
                  ? 'bg-white text-black border-white'
                  : 'bg-white/5 text-slate-400 border-white/5 hover:bg-white/10 hover:text-white'
              }`}
            >
              {cat}
            </motion.button>
          ))}
        </motion.div>

        <motion.div
          variants={toolContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto"
        >
          <motion.button
            variants={toolItem}
            onClick={toggleSort}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-[#080808] border border-white/10 rounded-xl text-sm text-slate-300 hover:text-white hover:border-white/20 transition-all cursor-pointer whitespace-nowrap"
          >
            {sortOrder === 'newest' ? (
              <><ArrowDownWideNarrow size={16} /><span>Najnowsze</span></>
            ) : (
              <><ArrowUpNarrowWide size={16} /><span>Najstarsze</span></>
            )}
          </motion.button>

          <motion.div variants={toolItem} className="relative w-full lg:w-72 group">
            <input
              type="text"
              placeholder="Szukaj artykułu..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#080808] border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm text-white focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all placeholder:text-slate-600"
            />
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4 group-focus-within:text-blue-400 transition-colors" />
          </motion.div>
        </motion.div>
      </div>

      {/* --- TREŚĆ --- */}
      {sortedPosts.length > 0 ? (
        <div className="space-y-8">
          {/* Wyróżniony */}
          <AnimatePresence mode="wait">
            <FeaturedCard key={featured.id} post={featured} />
          </AnimatePresence>

          {/* Pozostałe */}
          {rest.length > 0 && (
            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatePresence mode="popLayout">
                {rest.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-500">
            <Search size={32} />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Brak wyników</h3>
          <p className="text-slate-400">Spróbuj zmienić kategorię lub wpisać inne hasło.</p>
          <button
            onClick={() => { setFilter('Wszystkie'); setSearch(''); }}
            className="mt-6 text-blue-400 hover:text-blue-300 text-sm font-bold cursor-pointer"
          >
            Wyczyść filtry
          </button>
        </div>
      )}
    </div>
  );
}
