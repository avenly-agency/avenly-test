'use client';

import type { CSSProperties } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { BlogTeaserDict } from '@/lib/i18n/home/blog-teaser';
import type { BtPost } from './data';
import { BtFoot, BtMeta, useLive } from './shared';

// Karty wpisów w stylu strony (układ KARTY - wybór właściciela 2026-09-28 z Karty / Wyróżniony / Lista):
// czerń luksusowa (jak karty "Dlaczego Avenly"), zdjęcie w ramce z ostrą obwódką, typografia jak w innych
// sekcjach, bez efektów najechania na karcie (reaguje tylko strzałka "Czytaj wpis"). Cała karta jest
// klikalna - link w tytule rozciąga się na kartę. Od 1024 px trzy karty w rzędzie, niżej poziomy pasek
// z przyciąganiem.

/** Karta wpisu. `level` = poziom nagłówka tytułu (h3 pod nagłówkiem sekcji h2; h2 na stronie /blog pod h1).
    Używana też na stronach bloga (components/blog/BlogGrid.tsx). */
export const Card = ({ post, t, level: H = 'h3' }: { post: BtPost; t: BlogTeaserDict; level?: 'h2' | 'h3' }) => (
  <article className="bt-card">
    <div className="bt-media">
      <Image src={post.image} alt="" fill sizes="(max-width: 767px) 92vw, (max-width: 1023px) 46vw, 400px" className="bt-img" loading="lazy" />
    </div>
    <div className="bt-body">
      <BtMeta post={post} />
      <H className="bt-title"><Link href={post.href} prefetch={false} className="bt-link">{post.title}</Link></H>
      <p className="bt-ex">{post.excerpt}</p>
      <BtFoot post={post} t={t} />
    </div>
  </article>
);

export const BlogCards = ({ posts, t }: { posts: BtPost[]; t: BlogTeaserDict }) => {
  const ref = useLive<HTMLOListElement>();
  return (
    <ol className="bt-grid bt-rvs" ref={ref} aria-label={t.listAria}>
      {posts.map((p, i) => (
        <li key={p.id} style={{ '--k': i } as CSSProperties}><Card post={p} t={t} /></li>
      ))}
    </ol>
  );
};
