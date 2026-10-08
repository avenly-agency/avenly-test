'use client';

import { useRef, type CSSProperties } from 'react';
import type { SystemCrmCopy } from '@/lib/i18n/uslugi/system-crm';
import { seg, usePin, useReducedPref } from '../../_usluga/shared';
import { Win } from './ui';

// SEKCJA „TWÓJ PROCES” - „BĘBNY” (WYBRANA przez właściciela 2026-10-04: „zostaw bębny wersję”, bez widocznego tytułu
// „Szyty pod Twój proces.” i opisu sekcji) - przypięta, sterowana przewijaniem. Jedno okno systemu, cztery
// branże. Każdy napis w oknie (moduły w menu, nazwy etapów, karty) i wielka nazwa branży nad oknem to bęben z czterema
// pozycjami: przewijanie obraca bębny po kolei, z opóźnieniem od lewej do prawej, więc widać, że układ zostaje ten
// sam, a zmienia się to, czym jest wypełniony. Prawdziwy ruch (przesunięcie w pionie), bez przenikania.
// Postęp trzech obrotów (--u1..3) pisze usePin; opóźnienie bębna (--d) i złożenie obrotów liczy CSS.
// Bez JS / ograniczony ruch: pierwsza branża.

/** Obroty bębnów na osi sceny p: [start, koniec]. */
const TURNS: [number, number][] = [[0.14, 0.32], [0.42, 0.6], [0.7, 0.88]];

const Reel = ({ items, d, className }: { items: string[]; d: number; className?: string }) => (
  <span className={className ? `cr-reel ${className}` : 'cr-reel'}>
    <span className="cr-reel-in" style={{ '--d': d.toFixed(2) } as CSSProperties}>
      {items.map((x, i) => <span key={i} aria-hidden={i > 0 ? true : undefined}>{x}</span>)}
    </span>
  </span>
);

export const FitReels = ({ t, headId }: { t: SystemCrmCopy; headId: string }) => {
  const d = t.builder;
  const reduced = useReducedPref();
  const ref = useRef<HTMLElement>(null);
  const trades = d.trades;
  const n = trades[0].stages.length;

  usePin(ref, (p, el) => {
    let k = 0;
    TURNS.forEach(([a, e], i) => {
      const u = seg(p, a, e);
      k += u;
      el.style.setProperty(`--u${i + 1}`, u.toFixed(4));
    });
    const at = String(Math.round(k));
    if (el.dataset.at !== at) el.dataset.at = at;
  }, !reduced);

  return (
    <section ref={ref} className="cr-p" data-at="0" aria-labelledby={headId}>
      <div className="cr-p-stage">
        <div className="container mx-auto px-6 cr-p-in">
          {/* nagłówek tylko dla czytników ekranu: widoczny tytuł i opis sekcji usunięte na prośbę właściciela
              (2026-10-04) - sekcję otwiera wielka nazwa branży */}
          <h2 id={headId} className="sr-only">{t.fit.title}</h2>
          <div className="cr-p-name">
            <Reel items={trades.map((x) => x.label)} d={0} className="cr-p-big" />
            <span className="cr-p-count" aria-hidden="true">
              {trades.map((x, i) => <i key={x.id} data-i={i} />)}
            </span>
          </div>
          <Win app={{ name: '', sub: '', badge: t.app.badge }} className="cr-p-win">
            <div className="cr-c-body">
              <ul className="cr-side" aria-label={d.modulesAria}>
                {trades[0].modules.map((_, i) => (
                  <li key={i} data-cur={i === 0 ? '' : undefined}>
                    <Reel items={trades.map((x) => x.modules[i])} d={0.06 + i * 0.05} />
                  </li>
                ))}
              </ul>
              <ol className="cr-p-board" style={{ '--n': n } as CSSProperties}>
                {trades[0].stages.map((_, i) => (
                  <li key={i} className="cr-p-col">
                    <div className="cr-p-col-h">
                      <span className="cr-d-n" aria-hidden="true">{i + 1}</span>
                      <Reel items={trades.map((x) => x.stages[i])} d={0.1 + i * 0.09} />
                    </div>
                    <div className="cr-d-card">
                      <b><Reel items={trades.map((x) => x.cards[i].t)} d={0.16 + i * 0.09} /></b>
                      <Reel items={trades.map((x) => x.cards[i].f)} d={0.2 + i * 0.09} />
                    </div>
                    {/* kolejne wpisy w etapie - same kontury, żeby tablica nie była pusta pod pierwszą kartą */}
                    <span className="cr-p-ghost" aria-hidden="true" />
                    {i % 2 === 0 && <span className="cr-p-ghost" aria-hidden="true" />}
                  </li>
                ))}
              </ol>
            </div>
          </Win>
        </div>
      </div>
    </section>
  );
};
