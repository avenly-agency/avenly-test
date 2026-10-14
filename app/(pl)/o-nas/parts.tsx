'use client';

import { useRef, type CSSProperties, type Ref } from 'react';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { css, useEnter } from './shared';

// Wspólne klocki O nas (przebudowa 2026-10-09): nagłówek sekcji (etykieta „Gwiazda” - gwiazdka jak w nowym logo,
// h2 wysuwany spod maski, opis) i narrator sceny (jedno zdanie naraz, paski kroków). Sekcja z nagłówkiem h1
// (po wjeździe w gwiazdę) ma własny plik: poster.tsx.
// Klocki niewybranych wersji (ujęcia, podpisy, podpowiedź „Przewiń”) są w docs/archiwum/o-nas-2026-10/.

const d = (n: number) => ({ '--d': n }) as CSSProperties;

export function Head({ id, label, title, accent, lead, live }: {
  id: string; label: string; title: string; accent?: string; lead?: string; live: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  useEnter(ref, live);
  return (
    <header ref={ref} className="container mx-auto px-6 on-head">
      <div className="on-label on-in" style={d(0)}><SectionLabel align="start">{label}</SectionLabel></div>
      <h2 id={id} className="on-h2">
        <span className="on-mask"><span className="on-rise" style={d(1)}>{title}</span></span>
        {accent && <>{' '}<span className="on-mask"><span className="on-rise im-accent" style={d(2)}>{accent}</span></span></>}
      </h2>
      {lead && <p className="on-lead on-in" style={d(4)}>{lead}</p>}
    </header>
  );
}

/** Narrator sceny: pod spodem jedno zdanie naraz, nad nim paski kroków. Bez JS / ograniczony ruch: zwykła lista. */
export function Narrator({ items, label, ref }: { items: string[]; label: string; ref?: Ref<HTMLOListElement> }) {
  return (
    <ol ref={ref} className="on-narr" aria-label={label}>
      {items.map((s, i) => (
        <li key={i} className="on-narr-i" data-on={i === 0 ? '1' : '0'}>
          <span className="on-narr-bar" style={{ gridColumn: String(i + 1) }} aria-hidden="true"><i /></span>
          <span className="on-narr-t"><b aria-hidden="true">{i + 1}</b>{s}</span>
        </li>
      ))}
    </ol>
  );
}

/** Aktywny krok narratora i wypełnienia pasków (0-1). Pisze tylko przy zmianie. */
export const setNarrator = (ol: HTMLOListElement | null, active: number, fills: number[]) => {
  if (!ol) return;
  Array.from(ol.children).forEach((li, i) => {
    const on = i === active ? '1' : i < active ? '2' : '0';
    if ((li as HTMLElement).dataset.on !== on) (li as HTMLElement).dataset.on = on;
    css(li.firstElementChild, '--f', (fills[i] ?? 0).toFixed(3));
  });
};

