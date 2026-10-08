'use client';

import { Fragment, useEffect, useRef, type CSSProperties } from 'react';
import type { ONasDict } from '@/lib/i18n/o-nas';
import { OnCraft, OnFacts, OnFaq, useInView } from '../parts';

// Propozycja "LIST": kilka słów od założycieli jak list, a każde zdanie, które coś obiecuje,
// ma przypis na marginesie z faktem (98/100, godziny pracy, projekt przed kodem, opieka).
// Komputer: przypis stoi na wysokości swojego numeru, cienka linia łączy go z tekstem.
// Telefon: przypisy pod akapitem. Na końcu podpis z kreską rysowaną piórem.

type Part = string | { note: string; n: number };

const Row = ({ parts, label }: { parts: Part[]; label: string }) => {
  const ref = useInView<HTMLDivElement>('0px 0px -20% 0px');
  const notes = parts.filter((p): p is { note: string; n: number } => typeof p !== 'string');
  return (
    <div ref={ref} className="on-l-row">
      <p className="on-l-p">
        {parts.map((p, i) => {
          if (typeof p !== 'string') return null; // numer przypisu idzie razem z tekstem przed nim
          const next = parts[i + 1];
          if (!next || typeof next === 'string') return <Fragment key={i}>{p}</Fragment>;
          // Ostatnie słowo + numer bez łamania wiersza (numer nie zostaje sam w nowej linii).
          const cut = p.lastIndexOf(' ') + 1;
          return (
            <Fragment key={i}>
              {p.slice(0, cut)}
              <span className="on-l-glue">
                {p.slice(cut)}
                <sup className="on-l-ref">
                  <a href={`#on-n-${next.n}`} id={`on-r-${next.n}`} aria-label={`${label} ${next.n}`}>{next.n}</a>
                </sup>
              </span>
            </Fragment>
          );
        })}
      </p>
      {notes.length > 0 && (
        <ol className="on-l-notes">
          {notes.map((nt, i) => (
            <li key={nt.n} id={`on-n-${nt.n}`} className="on-l-note" data-n={nt.n} style={{ '--i': i } as CSSProperties}>
              <span className="on-l-note-n" aria-hidden="true">{nt.n}</span>
              <span className="on-l-note-t">{nt.note}</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
};

const Sign = ({ t }: { t: ONasDict }) => {
  const ref = useInView<HTMLDivElement>('0px 0px -12% 0px');
  return (
    <div ref={ref} className="on-l-sign">
      <p className="on-l-name">{t.letter.signature}</p>
      <svg className="on-l-swash" viewBox="0 0 300 36" aria-hidden="true" focusable="false">
        <path d="M3 27C44 17 88 11 132 13C170 15 196 25 234 24C258 23 280 17 297 7" pathLength={1} />
      </svg>
      <p className="on-l-role">{t.letter.role}</p>
    </div>
  );
};

const Letter = ({ t }: { t: ONasDict }) => {
  const ref = useRef<HTMLElement>(null);

  // Przypisy na marginesie (od 1024 px): każdy na wysokości swojego numeru w tekście, bez
  // nachodzenia na siebie. Bez JS / na telefonie stoją pod akapitem (zwykły przepływ).
  useEffect(() => {
    const sec = ref.current;
    if (!sec) return;
    const mq = window.matchMedia('(min-width: 1024px)');
    const layout = () => {
      sec.querySelectorAll<HTMLElement>('.on-l-row').forEach((row) => {
        const list = row.querySelector<HTMLElement>('.on-l-notes');
        if (!list) return;
        const items = Array.from(list.querySelectorAll<HTMLElement>('.on-l-note'));
        if (!mq.matches) {
          list.style.minHeight = '';
          items.forEach((li) => { li.style.top = ''; });
          delete list.dataset.side;
          return;
        }
        list.dataset.side = '';
        const top = list.getBoundingClientRect().top;
        let bottom = -Infinity;
        items.forEach((li) => {
          const refEl = row.querySelector<HTMLElement>(`#on-r-${li.dataset.n}`);
          if (!refEl) return;
          const r = refEl.getBoundingClientRect();
          const y = Math.max(Math.round(r.top - top - 2), bottom + 14);
          li.style.top = `${y}px`;
          bottom = y + li.offsetHeight;
        });
        list.style.minHeight = `${Math.max(0, bottom)}px`;
      });
    };
    layout();
    const ro = new ResizeObserver(layout);
    ro.observe(sec);
    mq.addEventListener('change', layout);
    document.fonts?.ready.then(layout).catch(() => {});
    return () => { ro.disconnect(); mq.removeEventListener('change', layout); };
  }, []);

  let n = 0;
  const paragraphs: Part[][] = t.letter.paragraphs.map((parts) =>
    parts.map((p) => (typeof p === 'string' ? p : { note: p.note, n: ++n })));

  return (
    <section ref={ref} className="on-sec on-l" aria-labelledby="on-l-h">
      <div className="container mx-auto px-6">
        <div className="on-body">
          <h2 id="on-l-h" className="on-h2 on-l-h">{t.letter.heading}</h2>
          {paragraphs.map((parts, i) => <Row key={i} parts={parts} label={t.letter.notesLabel} />)}
          <Sign t={t} />
        </div>
      </div>
    </section>
  );
};

export const ListPage = ({ t }: { t: ONasDict }) => (
  <>
    <Letter t={t} />
    <OnFacts t={t} />
    <OnCraft t={t} />
    <OnFaq t={t} />
  </>
);
