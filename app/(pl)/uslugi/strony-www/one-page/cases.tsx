'use client';

import { useRef, type CSSProperties } from 'react';
import type { OnePageCopy } from '@/lib/i18n/uslugi/one-page';
import { Depth } from './depth';
import { Drawing, setPlay } from './drawings';
import { clamp01, useFrame, useReducedPref } from '../../_usluga/shared';

// SCENA 2 - „Kiedy wystarczy jedna strona”: cztery karty (teksty kafli „Dlaczego One-Page?” z pierwotnej podstrony),
// każda z rysunkiem technicznym w języku Oferty (drawings.tsx): linie RYSUJĄ SIĘ RAZEM Z PRZEWIJANIEM (--d 0-1 na
// karcie; kolejność linii --i), a po narysowaniu rysunek gra swoją scenkę w pętli.
// Układ = STOS (wybór właściciela 2026-10-01 z Panoramy / Stosu / Deski / Siatki: „stos jest fajny”): karty nasuwają
// się jedna na drugą, przykryta cofa się w głąb (--dp) i zostaje po niej zakładka z numerem i hasłem
// (wzór: „Dlaczego Avenly”).
// Karta = „Lakier” (wybór właściciela z Lakier / Deska / Plansza / Arkusz): rysunek wprost na karcie po prawej na całej
// jej wysokości; po lewej zakładka u góry, nazwa i opis u dołu, pod rysunkiem jego podpis.
// Tło karty: czerń + GŁĘBIA (depth.tsx): za rysunkiem żyje świat świecących linii, w każdej karcie INNA scena dobrana
// do treści - Zbieg / Horyzont / Fale / Orbity (właściciel: karty strony głównej „mają głębię, której szukam, ale nie
// chcę 1:1 takich samych”, potem „dla każdego unikalny shader w tle”). Bez bliku w lewym górnym rogu karty.
// Cofnięte na prośbę właściciela (NIE wracać): faza krawędzi, pasy odbicia, cień i unoszenie rysunku.
// Odrzucone (NIE wracać): rysunek w osobnym boksie pod paskiem zakładki („obrzydliwe te boxy”, pusty pas nad rysunkiem).
// Bez JS / ograniczony ruch: karty jedna pod drugą, rysunki w całości, bez scenek.

type Item = OnePageCopy['cases']['items'][number];
const nn = (i: number) => String(i + 1).padStart(2, '0');
/** Wysokość zakładki = krok stosu (o tyle niżej przykleja się każda następna karta). Zmieniać razem z --one-tab w CSS. */
const TAB = 60;

const Card = ({ it, i, n }: { it: Item; i: number; n: number }) => (
  <li className="one-b-card" style={{ '--i': i } as CSSProperties}>
    <span className="one-b-card-bg" aria-hidden="true"><Depth scene={i} /></span>
    <p className="one-b-meta">
      <span className="one-b-n" aria-hidden="true"><b>{nn(i)}</b><i> / {nn(n - 1)}</i></span>
      <span className="one-b-tag">{it.tag}</span>
    </p>
    <div className="one-b-body">
      <h3 className="one-b-t">{it.title}</h3>
      <p className="one-b-d">{it.text}</p>
    </div>
    <figure className="one-b-art" aria-hidden="true">
      <Drawing index={i} />
      <figcaption>{it.caption}</figcaption>
    </figure>
  </li>
);

export const Cases = ({ t }: { t: OnePageCopy['cases'] }) => {
  const reduced = useReducedPref();
  const ref = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLElement[]>([]);
  const farRef = useRef(false);

  useFrame((frac) => {
    const el = ref.current;
    if (!el) return;
    const set = (node: HTMLElement, k: string, v: string) => { if (node.style.getPropertyValue(k) !== v) node.style.setProperty(k, v); };
    const vh = window.innerHeight;
    // wydajność (2026-10-05): sekcja daleko od ekranu nic nie liczy - po wyjściu z zasięgu jeszcze jedno pełne
    // przeliczenie (stany końcowe, scenki zatrzymane), potem cisza do powrotu; lista kart pobierana raz
    const sr = el.getBoundingClientRect();
    const far = sr.bottom - frac < -vh || sr.top - frac > vh * 2;
    if (far && farRef.current) return;
    farRef.current = far;
    if (!cardsRef.current.length || !cardsRef.current[0].isConnected) cardsRef.current = Array.from(el.querySelectorAll<HTMLElement>('.one-b-card'));
    const cards = cardsRef.current;
    // wszystkie odczyty układu PRZED zapisami (dawniej offsetHeight po zapisie zmiennych wymuszał przeliczenie co kartę)
    const rects = cards.map((c) => c.getBoundingClientRect());
    const heights = cards.map((c) => c.offsetHeight);
    cards.forEach((node, i) => {
      const cr = rects[i];
      // wysokość karty dla przyklejenia (wysoka karta przykleja się dopiero, gdy widać jej dół)
      set(node, '--h', `${heights[i]}px`);
      // rysunek rysuje się, gdy karta wjeżdża od dołu
      const d = clamp01((vh * 0.9 - (cr.top - frac)) / (vh * 0.5));
      set(node, '--d', d.toFixed(3));
      // głębokość: ile następnych kart już się nasunęło (1 = następna stoi o zakładkę niżej)
      let depth = 0;
      for (let j = i + 1; j < cards.length; j++) depth += clamp01(1 - (rects[j].top - cr.top - TAB * (j - i)) / (cr.height * 0.9));
      set(node, '--dp', depth.toFixed(3));
      // karty są lekko przezroczyste: część przykrytą przez następną kartę odcinamy (--cut = widoczna wysokość karty
      // w jej własnych px, przed skalą), żeby przez kartę na wierzchu było widać niebo, a nie treść karty pod spodem
      let cut = Infinity;
      for (let j = i + 1; j < cards.length; j++) cut = Math.min(cut, rects[j].top - cr.top);
      const own = cr.height > 0 ? (cut + 1) * (heights[i] / cr.height) : Infinity;
      set(node, '--cut', own < heights[i] ? `${Math.max(0, own).toFixed(1)}px` : '99999px');
      // scenka rysunku gra, gdy karta jest narysowana, na ekranie i nieprzykryta
      const play = d > 0.985 && depth < 0.6 && cr.bottom > 0 && cr.top < vh;
      if ((node.dataset.play === '1') !== play) { node.dataset.play = play ? '1' : '0'; setPlay(node.querySelector('.one-b-svg'), play); }
    });
  }, !reduced);

  return (
    <section ref={ref} className="one-b" aria-labelledby="one-b-h">
      <div className="container mx-auto px-6">
        <h2 id="one-b-h" className="im-title sv-h2">{t.title} <span className="im-accent">{t.titleAccent}</span></h2>
        <p className="im-lead one-b-lead">{t.lead}</p>
        <ol className="one-b-track">
          {t.items.map((it, i) => <Card key={it.title} it={it} i={i} n={t.items.length} />)}
        </ol>
      </div>
    </section>
  );
};
