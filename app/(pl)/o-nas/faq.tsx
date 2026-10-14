'use client';

import { useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import { MessageCircle, Plus } from 'lucide-react';
import type { ONasDict } from '@/lib/i18n/o-nas';
import { Intro } from './scene-kit';
import { openChat, useEnter } from './shared';

// FAQ (treść = źródło danych strukturalnych FAQPage, lib/i18n/o-nas.ts). Akordeon na włosowych liniach,
// „Inne pytanie? Zapytaj asystenta” otwiera prawdziwy czat z rogu strony.
// Wybór właściciela 2026-10-14 (runda 43): zostaje akordeon („aktualnie jest ładnie, ale badge trzeba usunąć,
// dorównać”) - bez plakietki sekcji (jak „Portal”, „Co robimy” i „Światło”), nagłówek w lewej kolumnie obok pytań,
// góra jego wersalików równo z górną linią listy, lista do prawej krawędzi wrappera, „Inne pytanie?” jako ostatni
// wiersz listy (przycisk w jednej pionowej linii z plusami). Telefon: nagłówek, lista.
// Runda 44 (2026-10-14, właściciel: „zrób tak, żeby się strona nie przesuwała, jak się akordeon otwiera”): sekcja ma
// STAŁĄ wysokość. Pod listą stoi rezerwa o wysokości najdłuższej odpowiedzi (pomiar przy zmianie szerokości i po
// wczytaniu fontu); otwarta odpowiedź zabiera z niej dokładnie tyle, ile sama zajmuje, w tym samym czasie i tym samym
// przebiegiem ruchu (wysokość wiersza rośnie z grid-template-rows 0fr -> 1fr, rezerwa maleje z height - obie
// przejściem 0,5 s z --on-ease), więc suma się nie zmienia: zakończenie, stopka i długość strony stoją w miejscu.
// Bez JS (i w HTML z serwera - dla wyszukiwarek) wszystkie odpowiedzi są otwarte (ready = false), po hydratacji zamknięte.

const d = (n: number) => ({ '--d': n }) as CSSProperties;

export function Faq({ t, faq, live, ready }: { t: ONasDict['faqSection']; faq: ONasDict['faq']; live: boolean; ready: boolean }) {
  const [open, setOpen] = useState(-1);
  const box = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLDivElement>(null);
  useEnter(box, live, 0.15);

  // wysokości odpowiedzi (także zamkniętych - akapit jest ułożony, tylko przycięty): --h0..--hN i najdłuższa --max.
  // Przed malowaniem (useLayoutEffect): po hydratacji odpowiedzi zwijają się w tej samej klatce, w której rośnie rezerwa.
  useLayoutEffect(() => {
    const l = list.current;
    if (!l || !ready) return;
    let w = -1;
    const measure = () => {
      const hs = Array.from(l.querySelectorAll<HTMLElement>('.on-faq-a p')).map((p) => p.getBoundingClientRect().height);
      hs.forEach((h, i) => l.style.setProperty(`--h${i}`, `${h.toFixed(2)}px`));
      l.style.setProperty('--max', `${Math.max(0, ...hs).toFixed(2)}px`);
    };
    // tylko zmiana szerokości zmienia łamanie odpowiedzi (wysokość listy jest stała)
    const ro = new ResizeObserver(([e]) => {
      if (e.contentRect.width === w) return;
      w = e.contentRect.width;
      measure();
    });
    ro.observe(l);
    let dead = false;
    document.fonts?.ready.then(() => { if (!dead) measure(); });
    return () => { dead = true; ro.disconnect(); };
  }, [ready]);

  // rezerwa = najdłuższa odpowiedź minus otwarta (przed pomiarem i bez JS: 0)
  const spare = ready ? (open >= 0 ? `calc(var(--max, 0px) - var(--h${open}, 0px))` : 'var(--max, 0px)') : '0px';
  return (
    <section className="on-sec on-faq" aria-labelledby="on-faq-h">
      <div ref={box} className="container mx-auto px-6 on-faq-box">
        <Intro id="on-faq-h" title={t.heading} lead={t.lead} live={live} className="on-faq-head" />
        <div ref={list} className="on-faq-list">
          {faq.map((f, i) => {
            const isOpen = !ready || open === i;
            return (
              <div key={i} className="on-faq-item on-in" data-open={isOpen ? '' : undefined} style={d(i)}>
                <h3 className="on-faq-q">
                  <button
                    type="button" id={`on-faq-b${i}`} aria-expanded={isOpen} aria-controls={`on-faq-a${i}`}
                    onClick={() => setOpen((o) => (o === i ? -1 : i))}
                  >
                    <span>{f.question}</span>
                    <Plus aria-hidden="true" />
                  </button>
                </h3>
                <div id={`on-faq-a${i}`} role="region" aria-labelledby={`on-faq-b${i}`} className="on-faq-a" inert={!isOpen || undefined}>
                  <div><p>{f.answer}</p></div>
                </div>
              </div>
            );
          })}
          <div className="on-faq-ask on-in" style={d(faq.length)}>
            <div>
              <p className="on-faq-ask-t">{t.askTitle}</p>
              <p className="on-faq-ask-d">{t.askDesc}</p>
            </div>
            <button type="button" className="on-ghost" onClick={openChat}>
              <MessageCircle aria-hidden="true" />
              {t.askButton}
            </button>
          </div>
          <div className="on-faq-spare" aria-hidden="true" style={{ height: spare }} />
        </div>
      </div>
    </section>
  );
}
