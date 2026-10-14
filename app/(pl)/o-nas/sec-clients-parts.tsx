'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { GEM } from '@/lib/brand/logo';
import { localizeHref, type Locale } from '@/lib/i18n/locale';
import type { ONasDict } from '@/lib/i18n/o-nas';
import { css, flag } from './shared';
import './sec.css'; // klasy on-3c- (tekst pozycji, pole sceny)

// SEKCJA „DLA KOGO PRACUJEMY” - klocki sceny „Portal” (sec-clients-portal.tsx; temat i wersja wybrane 2026-10-13):
// wymiana tekstu pozycji, zrzut strony klienta (tryb bez ruchu), wolne miejsce „Twoja firma”, link i przycisk. Treść: trzy rodzaje firm
// z prawdziwymi realizacjami + „Twoja firma” z przyciskiem. Pozostałe wersje sceny: docs/archiwum/o-nas-2026-10/.

export type Clients = ONasDict['clients'];

/** Blok tekstu pozycji: jedna naraz - poprzednia odjeżdża w górę, następna wjeżdża z dołu; klikalna tylko widoczna. */
export const swapText = (el: Element | null, tin: number, out: number, dy = 26) => {
  const o = tin * (1 - out);
  css(el, 'opacity', o.toFixed(3));
  css(el, 'visibility', o < 0.002 ? 'hidden' : 'visible');
  css(el, 'transform', o >= 0.9995 ? 'none' : `translate3d(0, ${((1 - tin) * dy - out * dy).toFixed(2)}px, 0)`);
  flag(el, 'data-on', o > 0.6);
};

const img = (slug: string, w: number, ext: 'avif' | 'webp') => `/portfolio/stage/${slug}-${w}.${ext}`;
const set = (slug: string, ext: 'avif' | 'webp', big: boolean) =>
  `${img(slug, 720, ext)} 720w, ${img(slug, 1200, ext)} 1200w${big ? `, ${img(slug, 1800, ext)} 1800w` : ''}`;

/** Zrzut strony klienta (public/portfolio/stage/ - te same kadry co w sekcji Realizacje na stronie głównej).
    `big` dokłada plik 1800 px dla kadrów szerokich na cały wrapper albo powiększanych kamerą. */
export function Shot({ slug, sizes, alt = '', big = false }: { slug: string; sizes: string; alt?: string; big?: boolean }) {
  return (
    <picture>
      <source type="image/avif" srcSet={set(slug, 'avif', big)} sizes={sizes} />
      <source type="image/webp" srcSet={set(slug, 'webp', big)} sizes={sizes} />
      <img src={img(slug, 1200, 'webp')} alt={alt} width={1200} height={675} loading="lazy" decoding="async" />
    </picture>
  );
}

/** Wnętrze pustego kadru „Twoja firma”: gwiazda z logo i podpis. */
export function YourSlot({ label }: { label: string }) {
  return (
    <>
      <svg viewBox="-20 -20 40 40" focusable="false"><path d={GEM} /></svg>
      <span>{label}</span>
    </>
  );
}

/** Link „Zobacz realizację” pozycji klienta. `name` = nazwa firmy dopisana do nazwy linku dla czytników ekranu
    i wyszukiwarek (trzy linki sekcji nie mają wtedy identycznej treści). */
export function More({ href, label, name, locale }: { href: string; label: string; name?: string; locale: Locale }) {
  return (
    <Link href={localizeHref(href, locale)} prefetch={false} className="on-3c-more">
      {label}
      {name && <span className="sr-only">: {name}</span>}
      <ArrowRight aria-hidden="true" />
    </Link>
  );
}

/** Przycisk „Bezpłatna konsultacja” pozycji „Twoja firma”. */
export function Consult({ label, locale }: { label: string; locale: Locale }) {
  return (
    <Link href={localizeHref('/kontakt', locale)} prefetch={false} className="on-cta">
      {label}
      <ArrowRight aria-hidden="true" />
    </Link>
  );
}
