'use client';

import { useEffect, useRef, useState, type CSSProperties, type RefObject } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { SectionLabel } from '@/components/ui/SectionLabel';
import type { BlogTeaserDict } from '@/lib/i18n/home/blog-teaser';
import { fill, type BtPost } from './data';

// Elementy wspólne sekcji "Blog".

/** Nagłówek sekcji: etykieta "Gwiazda", h2 (.im-title / .im-accent), podtytuł i link do /blog. */
export const BtHead = ({ t, className = '' }: { t: BlogTeaserDict; className?: string }) => (
  <header className={`bt-head ${className}`.trim()}>
    <div>
      <p className="im-label bt-rv"><SectionLabel align="start">{t.label}</SectionLabel></p>
      <h2 id="bt-title" className="im-title bt-rv" style={{ '--d': 1 } as CSSProperties}>
        {t.title} <span className="im-accent">{t.titleAccent}</span>
      </h2>
      <p className="im-lead bt-rv" style={{ '--d': 2 } as CSSProperties}>{t.lead}</p>
    </div>
    <Link href="/blog" prefetch={false} className="bt-all bt-rv" style={{ '--d': 3 } as CSSProperties}>
      <span className="bt-all-text">{t.all}</span>
      <ArrowRight aria-hidden="true" className="bt-arrow" />
    </Link>
  </header>
);

/** Kategoria i data wpisu. */
export const BtMeta = ({ post }: { post: BtPost }) => (
  <p className="bt-meta">
    <span>{post.category}</span>
    <span className="bt-meta-dot" aria-hidden="true" />
    <time dateTime={post.iso}>{post.date}</time>
  </p>
);

/** Stopka karty: "Czytaj wpis" + czas czytania (dekoracja - linkiem jest tytuł, rozciągnięty na kartę). */
export const BtFoot = ({ post, t }: { post: BtPost; t: BlogTeaserDict }) => (
  <p className="bt-foot" aria-hidden="true">
    <span className="bt-read">{t.read}<ArrowRight className="bt-arrow" /></span>
    <span className="bt-mins">{fill(t.minutes, { n: post.minutes })}</span>
  </p>
);

/**
 * Postęp przewijania przez wysoki blok z przyklejoną (sticky) sceną: 0, gdy góra bloku dochodzi do góry okna,
 * 1, gdy jego dół dochodzi do dołu okna. Wołane w rAF przy przewijaniu (tylko zapis do DOM / rzadkie setState).
 */
export const useStickyProgress = <T extends HTMLElement>(ref: RefObject<T | null>, onProgress: (t: number, el: T) => void) => {
  const cb = useRef(onProgress);
  useEffect(() => { cb.current = onProgress; });
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const range = r.height - window.innerHeight;
      cb.current(range > 0 ? Math.min(1, Math.max(0, -r.top / range)) : 0, el);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); };
  }, [ref]);
};

/** prefers-reduced-motion (false na serwerze i w pierwszym renderze - bez rozjazdu hydratacji). */
export const useReducedPref = () => {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const on = () => setReduced(mq.matches);
    const id = requestAnimationFrame(on);
    mq.addEventListener('change', on);
    return () => { cancelAnimationFrame(id); mq.removeEventListener('change', on); };
  }, []);
  return reduced;
};

/**
 * Wejście elementu: po hydratacji `data-live` (stany startowe z CSS), po wjechaniu w ekran `data-in`.
 * Bez JS nic nie jest ukryte. Element już widoczny przy starcie dostaje oba atrybuty naraz (bez
 * animacji od zera).
 */
export const useLive = <T extends HTMLElement>() => {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.dataset.live = '';
    if (r.top < window.innerHeight * 0.85 && r.bottom > 0) { el.dataset.in = ''; return; }
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      el.dataset.in = '';
      io.disconnect();
    }, { rootMargin: '0px 0px -16% 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
};
