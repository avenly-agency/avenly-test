'use client';

import { useRef, type CSSProperties } from 'react';
import type { CustomCopy } from '@/lib/i18n/uslugi/strona-szyta-na-miare';
import { clamp01, useFrame, useReducedPref, useSeen } from '../../_usluga/shared';

// SCENA 5 - „Od konceptu po wdrożenie.”: DWIE KOLEJNE PROPOZYCJE (runda 2, 2026-10-02). Trzecia to lista z pokazem
// w kadrze (scope.tsx, wzorzec pilota). Nagłówek i termin na linii wymiarowej stoją w tych samych miejscach we
// wszystkich wersjach (drabina usług).
//   Axis „Oś”     - scena przypięta: linia wymiarowa terminu ciągnie się przez cały ekran jako oś czasu, sześć etapów
//                   jedzie wzdłuż niej w bok razem z przewijaniem; etap przy znaczniku jest w pełnym świetle.
//   Grid „Plan”   - wszystkie etapy naraz: sześć pól w siatce 3 x 2 połączonych jedną linią z numerami, pola rysują
//                   się po kolei przy wejściu. Spokojna, czytelna wersja na jeden ekran.
// Bez JS / ograniczony ruch: nagłówek, termin i lista etapów.

type T = CustomCopy['scope'];

const Head = ({ t, id }: { t: T; id: string }) => (
  <>
    <h2 id={id} className="im-title sv-h2">{t.title} <span className="im-accent">{t.titleAccent}</span></h2>
    <div className="sm-term">
      <span className="sm-term-l">{t.termLabel}</span>
      <span className="sm-term-dim"><i aria-hidden="true" /><b>{t.termValue}</b><i aria-hidden="true" /></span>
    </div>
  </>
);
const nn = (i: number) => String(i + 1).padStart(2, '0');

export const ScopeAxis = ({ t }: { t: T }) => {
  const reduced = useReducedPref();
  const ref = useRef<HTMLElement>(null);
  useFrame((frac) => {
    const el = ref.current;
    const track = el?.querySelector<HTMLElement>('.sm-ca-track');
    if (!el || !track) return;
    const r = el.getBoundingClientRect(), vh = window.innerHeight;
    const p = clamp01(-(r.top - frac) / Math.max(1, r.height - vh));
    const items = Array.from(track.querySelectorAll<HTMLElement>('.sm-ca-item'));
    if (!items.length) return;
    // tor jedzie tak, żeby kolejne etapy stawały przy znaczniku (lewa krawędź treści)
    const first = items[0].offsetLeft, last = items[items.length - 1].offsetLeft;
    const x = -(last - first) * p;
    const v = `${x.toFixed(1)}px`;
    if (track.style.getPropertyValue('--x') !== v) track.style.setProperty('--x', v);
    const f = p.toFixed(4);
    if (el.style.getPropertyValue('--p') !== f) el.style.setProperty('--p', f);
    const at = Math.round(p * (items.length - 1));
    items.forEach((li, i) => li.toggleAttribute('data-on', i === at));
  }, !reduced);
  return (
    <section ref={ref} className="sm-c sm-ca" aria-labelledby="sm-ca-h">
      <div className="sm-ca-stage">
        <div className="sm-ca-in container mx-auto px-6">
          <div className="sm-ca-head"><Head t={t} id="sm-ca-h" /></div>
          <div className="sm-ca-axis" aria-hidden="true"><i /></div>
          <ol className="sm-ca-track">
            {t.items.map((it, i) => (
              <li key={it.title} className="sm-ca-item" style={{ '--i': i } as CSSProperties}>
                <span className="sm-ca-n" aria-hidden="true">{nn(i)}</span>
                <span className="sm-c-t">{it.title}</span>
                <span className="sm-c-d">{it.text}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
};

export const ScopeGrid = ({ t }: { t: T }) => {
  const ref = useRef<HTMLDivElement>(null);
  useSeen(ref, 0.15);
  return (
    <section className="sm-c sm-cg" aria-labelledby="sm-cg-h">
      <div ref={ref} className="sm-cg-in container mx-auto px-6">
        <div className="sm-cg-head"><Head t={t} id="sm-cg-h" /></div>
        <ol className="sm-cg-list">
          {t.items.map((it, i) => (
            <li key={it.title} className="sm-cg-item" style={{ '--i': i } as CSSProperties}>
              <span className="sm-cg-n" aria-hidden="true">{nn(i)}</span>
              <span className="sm-c-t">{it.title}</span>
              <span className="sm-c-d">{it.text}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};
