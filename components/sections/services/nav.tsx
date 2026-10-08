'use client';

import { useEffect, useState, type CSSProperties, type KeyboardEvent, type RefObject } from 'react';
import type { ServicesSectionDict } from '@/lib/i18n/services';
import { nn, type OfferModel } from './shared';

// Indeks usług (lewa kolumna sekcji Oferta) - KARTY (wybór właściciela 2026-09-27 z propozycji Tor / Spis /
// Miniatury / Karty): smukłe karty w czerni luksusowej, kropka w kolorze usługi, wybrana karta z krawędzią
// oświetloną od góry w kolorze usługi (jak deska z rysunkiem) i prostą linią do deski.
// ZEGAR KARTY = OBWÓDKA (wybór właściciela 2026-09-27 z Obwódka / Tarcza / Pasek; właściciel: "podkreślenie
// na dole karty zrobiłbym inaczej i dodaj do niego ubywający czas", "usuń liczniki w sekundach"): obwódka
// wybranej karty w kolorze usługi UBYWA zgodnie z ruchem wskazówek (od środka górnej krawędzi) do zmiany
// usługi, bez cyfr. Ścieżkę z data-clock animuje plan.tsx (WAAPI). Bez automatu (po kliknięciu / reduced
// motion) zegara nie ma - zostaje oświetlona karta.

/** Zaokrąglony prostokąt jako ścieżka od środka górnej krawędzi, zgodnie z ruchem wskazówek zegara. */
const roundRect = (w: number, h: number, r: number, i = 0.75) => {
  const x0 = i, y0 = i, x1 = w - i, y1 = h - i, rr = Math.min(r - i, (y1 - y0) / 2);
  const f = (n: number) => +n.toFixed(2);
  return `M${f(w / 2)} ${f(y0)}H${f(x1 - rr)}A${f(rr)} ${f(rr)} 0 0 1 ${f(x1)} ${f(y0 + rr)}V${f(y1 - rr)}A${f(rr)} ${f(rr)} 0 0 1 ${f(x1 - rr)} ${f(y1)}H${f(x0 + rr)}A${f(rr)} ${f(rr)} 0 0 1 ${f(x0)} ${f(y1 - rr)}V${f(y0 + rr)}A${f(rr)} ${f(rr)} 0 0 1 ${f(x0 + rr)} ${f(y0)}Z`;
};
export const OfferNav = ({ t, m, on, pick, onKey, tabsRef, onGeometry }: {
  t: ServicesSectionDict;
  m: OfferModel;
  on: number;
  pick: (i: number) => void;
  onKey: (e: KeyboardEvent) => void;
  tabsRef: RefObject<HTMLDivElement | null>;
  onGeometry: () => void;
}) => {
  // Obwódka: rozmiary kart w px (ścieżka obwódki musi znać prawdziwy kształt karty / pigułki).
  const [dims, setDims] = useState<{ w: number; h: number; r: number }[]>([]);
  useEffect(() => {
    const list = tabsRef.current;
    if (!list) return;
    const tabs = Array.from(list.querySelectorAll<HTMLElement>('[data-tab]'));
    let first = true;
    const ro = new ResizeObserver(() => {
      setDims(tabs.map((b) => ({ w: b.offsetWidth, h: b.offsetHeight, r: parseFloat(getComputedStyle(b).borderTopLeftRadius) || 0 })));
      // Zegar startuje, gdy obwódka pojawi się pierwszy raz; później zmienia się tylko jej kształt
      // (ta sama ścieżka, pathLength = 1) - animacja biegnie dalej bez restartu.
      if (first) { first = false; onGeometry(); }
    });
    tabs.forEach((b) => ro.observe(b));
    return () => ro.disconnect();
  }, [tabsRef, onGeometry]);

  return (
    <div ref={tabsRef} className="of-pl-tabs" role="tablist" aria-label={t.listAria} aria-orientation="vertical" onKeyDown={onKey}>
      {m.cats.map((c) => (
        <div key={c.id} className="of-pl-group" role="presentation">
          <p className="of-pl-cat" aria-hidden="true">{c.label}</p>
          {c.items.map((it) => {
            const d = dims[it.i];
            return (
              <button
                key={it.id}
                type="button"
                role="tab"
                id={`of-pl-tab-${it.i}`}
                data-tab={it.i}
                aria-selected={on === it.i}
                aria-controls={`of-pl-panel-${it.i}`}
                tabIndex={on === it.i ? 0 : -1}
                className="of-pl-tab"
                style={{ '--ic': it.acc, '--k': it.i } as CSSProperties}
                onClick={() => pick(it.i)}
              >
                <span className="of-ix-chip" aria-hidden="true" />
                <span className="of-pl-n">{nn(it.i)}</span>
                <span className="of-pl-name">{it.name}</span>
                <span className="of-pl-short" aria-hidden="true">{it.short}</span>
                {d && (
                  <svg className="of-ix-trace" width={d.w} height={d.h} aria-hidden="true" focusable="false">
                    <path d={roundRect(d.w, d.h, d.r)} pathLength={1} data-clock={it.i} />
                  </svg>
                )}
                <span className="of-pl-lead" aria-hidden="true"><i /></span>
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
};
