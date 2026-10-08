'use client';

import { useMemo, useState, type CSSProperties } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowDownWideNarrow, ArrowRight, ArrowUpNarrowWide, Search } from 'lucide-react';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { BlogBackdrop } from './BlogBackdrop';
import { postsLabel, type BlogCard } from './data';
import { Meta, PostCard } from './cards';
import './blog.css';

// Lista wpisów (/blog) - wersja z czerwca 2026 w układzie „Wierna” (wybór właściciela 2026-09-29): kompozycja czerwca
// 1:1 (wyśrodkowany nagłówek na tle z liniami, pigułki kategorii + sortowanie + wyszukiwarka, najnowszy wpis jako
// karta pół na pół, pozostałe w siatce) w języku strony głównej: etykieta „Gwiazda”, nagłówek .im-title z akcentem
// w kolorze marki, karty w czerni luksusowej ze zdjęciem w ramce, bez gradientowego tekstu, rozmytych kul, szkła
// i efektów najechania na kartach (reaguje strzałka i przycisk). Kategorie liczone z wpisów (w czerwcu sztywna lista
// miała 5 pustych przycisków). Style: blog.css.

const ALL = 'Wszystkie';
const STAR = 'M5 0C5.35 3.3 6.7 4.65 10 5C6.7 5.35 5.35 6.7 5 10C4.65 6.7 3.3 5.35 0 5C3.3 4.65 4.65 3.3 5 0Z';
const d = (n: number) => ({ '--d': n }) as CSSProperties;

function Featured({ post, kicker }: { post: BlogCard; kicker: string }) {
  return (
    <article className="bl-feat bl-enter">
      <div className="bl-feat-media">
        <Image src={post.image} alt="" fill priority sizes="(min-width: 1024px) 60vw, 100vw" className="bl-img" />
      </div>
      <div className="bl-feat-body">
        <div className="bl-feat-top">
          <p className="bl-kicker">
            <svg viewBox="0 0 10 10" aria-hidden="true" focusable="false"><path d={STAR} /></svg>
            {kicker}
          </p>
          <Meta post={post} minutes />
        </div>
        <h2 className="bl-feat-title">
          <Link href={post.href} className="bl-link">{post.title}</Link>
        </h2>
        <p className="bl-feat-ex">{post.excerpt}</p>
        <div className="bl-feat-foot">
          <span className="bl-author">{post.author}</span>
          <span className="bl-read">Czytaj artykuł<ArrowRight aria-hidden="true" className="bl-arrow" /></span>
        </div>
      </div>
    </article>
  );
}

export function BlogIndex({ posts }: { posts: BlogCard[] }) {
  const [filter, setFilter] = useState(ALL);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<'newest' | 'oldest'>('newest');
  const [touched, setTouched] = useState(false);

  const categories = useMemo(() => {
    const count = new Map<string, number>();
    posts.forEach((p) => p.categories.forEach((c) => count.set(c, (count.get(c) ?? 0) + 1)));
    const byUse = [...count].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'pl')).map(([label]) => label);
    return [ALL, ...byUse];
  }, [posts]);

  const q = search.trim().toLowerCase();
  const list = posts
    .filter((p) => filter === ALL || p.categories.includes(filter))
    .filter((p) => !q || p.title.toLowerCase().includes(q) || p.excerpt.toLowerCase().includes(q))
    .sort((a, b) => (sort === 'newest' ? b.iso.localeCompare(a.iso) : a.iso.localeCompare(b.iso)));
  const [feat, ...rest] = list;

  const pick = (c: string) => { setFilter(c); setTouched(true); };
  const clear = () => { setFilter(ALL); setSearch(''); setTouched(true); };

  return (
    <div className="bl">
      <BlogBackdrop />
      <div className="container mx-auto px-6 bl-in">
        <header className="bl-head">
          <p className="im-label bl-rise"><SectionLabel>Blog</SectionLabel></p>
          <h1 className="im-title bl-rise" style={d(1)}>
            Wiedza, która <br /><span className="im-accent">napędza Twój&nbsp;rozwój</span>.
          </h1>
          <p className="im-lead bl-rise" style={d(2)}>
            Poznaj najnowsze trendy w technologii, designie i marketingu. Praktyczne poradniki i analizy, które pomogą Ci wyprzedzić konkurencję.
          </p>
        </header>

        <div className="bl-bar bl-rise" style={d(3)}>
          <div className="bl-cats" role="group" aria-label="Kategorie wpisów">
            {categories.map((c) => (
              <button key={c} type="button" className="bl-cat" aria-pressed={filter === c} onClick={() => pick(c)}>
                {c}
              </button>
            ))}
          </div>
          <div className="bl-tools">
            <button
              type="button"
              className="bl-sort"
              onClick={() => { setSort((s) => (s === 'newest' ? 'oldest' : 'newest')); setTouched(true); }}
              aria-label={sort === 'newest' ? 'Sortowanie: najnowsze. Zmień na najstarsze' : 'Sortowanie: najstarsze. Zmień na najnowsze'}
            >
              {sort === 'newest' ? <ArrowDownWideNarrow aria-hidden="true" /> : <ArrowUpNarrowWide aria-hidden="true" />}
              <span className="bl-sort-t">{sort === 'newest' ? 'Najnowsze' : 'Najstarsze'}</span>
            </button>
            <label className="bl-search">
              <Search aria-hidden="true" />
              <span className="sr-only">Szukaj wpisu</span>
              <input
                type="search"
                className="bl-search-in"
                placeholder="Szukaj artykułu"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setTouched(true); }}
              />
            </label>
          </div>
        </div>

        <p className="sr-only" aria-live="polite">{touched ? postsLabel(list.length) : ''}</p>

        {feat ? (
          <div key={`${filter}|${sort}|${q}`} className="bl-list" data-again={touched ? '' : undefined}>
            <Featured post={feat} kicker={sort === 'newest' ? 'Najnowszy wpis' : 'Najstarszy wpis'} />
            {rest.length > 0 && (
              <ul className="bl-grid" aria-label="Pozostałe wpisy">
                {rest.map((p, i) => <PostCard key={p.id} post={p} i={i} />)}
              </ul>
            )}
          </div>
        ) : (
          <div className="bl-empty bl-enter">
            <p className="bl-empty-title">Brak wyników</p>
            <p className="bl-empty-text">Spróbuj zmienić kategorię lub wpisać inne hasło.</p>
            <button type="button" className="bl-clear" onClick={clear}>Wyczyść filtry</button>
          </div>
        )}
      </div>
    </div>
  );
}
