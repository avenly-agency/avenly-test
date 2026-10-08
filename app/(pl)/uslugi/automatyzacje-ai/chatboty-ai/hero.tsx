'use client';

import { useEffect, useMemo, useRef, type CSSProperties } from 'react';
import type { Locale } from '@/lib/i18n/locale';
import type { ChatbotsCopy } from '@/lib/i18n/uslugi/chatboty-ai';
import { lin, seg, usePin, useReducedPref } from '../../_usluga/shared';
import { Head, Narr, Spark, setNarr, setVar } from './talk';
import './hero.css'; // style pierwszego ekranu i filmu pytań (prefiks ch-o-)

// HERO - „Setki pytań każdego dnia. Żadne bez odpowiedzi.”
// Runda 5 (właściciel 2026-10-04: „zrób w hero te pytania bardziej premium i feeling taki, bo teraz jest tak meh -
// rozmieszczenie, wielkość itp., rozkmiń”). Zostaje decyzja z rundy 4: tekst POŚRODKU, pytania dookoła na całym tle,
// bez linii z gwiazdą. Co się zmieniło:
//   kompozycja - tekst stoi w WĄSKIEJ kolumnie (nagłówek w trzech krótkich liniach), więc po obu stronach są dwa
//                szerokie pola. W każdym kaskada dużych dymków pierwszego planu, między nimi mniejsze dymki drugiego
//                planu, a w tle małe dymki „ktoś pisze” (trzy kropki = kolejne pytania w drodze). Ogonki dymków
//                celują w środek - wszystkie pytania są skierowane do Twojej firmy;
//   materiał   - dymek to ciemne szkło z obwódką świecącą od góry (język okna czatu), nie szary obrys. Odpowiedź =
//                światło obwódki zmienia się na pomarańcz i w rogu od strony tekstu staje gwiazda asystenta;
//   ruch       - wejście: dymki wsuwają się po kolei od zewnątrz ku tekstowi (bez skoku skali), tekst dochodzi chwilę
//                po szkle; spoczynek: dymki STOJĄ (bez unoszenia - właściciel: „usuń ten bounce”), po krawędzi szkła
//                co kilka sekund przechodzi wąski refleks, kropki „pisze” pulsują kryciem, plany przesuwają się za
//                kursorem w różnym tempie (głębia); film: pierwszy plan rośnie
//                i mija kamerę, drugi sunie wolniej, a z głębi wyłania się trzeci plan nowych pytań - pytania płyną
//                przez kadr bez końca. Od środka idzie fala odpowiedzi, na końcu zapala się „Żadne bez odpowiedzi.”
// Dymki NIGDY nie wchodzą na tekst: kolumny (col) stoją krawędzią od strony tekstu w `x` vw od środka i rosną na
// zewnątrz; pasy (band) trzymają `g` px odstępu od ZMIERZONEGO bloku tekstu (--copy-h / --mid-h).
// Telefon i tablet (< 1024 px): rzędy nad tekstem i pod nim - w rzędzie jeden dymek z pytaniem i (po drugiej stronie)
// dymek „pisze”; w filmie blok tekstu maleje, rzędy zsuwają się do środka i dochodzą kolejne. Rząd nad tekstem ma
// pytanie po PRAWEJ, rzędy pod tekstem po LEWEJ: w prawym dolnym rogu ekranu stoi prawdziwy bąbel czatu.
// Pytania przydzielane od najkrótszego (r = miejsce po długości), żeby duże dymki mieściły się w polach także w EN.
// Bez JS / ograniczony ruch: zwykły blok pośrodku - nagłówek, zdanie sekcji, narrator, lista dwunastu pytań.

type P = { t: ChatbotsCopy; locale: Locale };

const RM = '(prefers-reduced-motion: reduce)';

/** Miejsce dymka. kind: f = pierwszy plan (duży), b = drugi plan, t = „ktoś pisze” (trzy kropki, bez tekstu),
    d = plan z głębi (wyłania się dopiero w filmie; powtórzenie pytania, aria-hidden). r = pytanie (miejsce po
    długości, 0 = najkrótsze). Komputer: col + x / y (krawędź od strony tekstu w vw, wysokość w vh od środka) albo
    band + x / g (środek w vw, odstęp od bloku tekstu w px). Telefon: row (rząd nad tekstem < 0, pod > 0), side,
    late = rząd wchodzi dopiero w filmie. Bez row = dymka na telefonie nie ma. Kolejność = kolejność wejścia. */
type Slot = {
  kind: 'f' | 'b' | 't' | 'd'; r?: number; x: number; y?: number; col?: 'l' | 'r'; band?: 't' | 'b'; g?: number;
  row?: number; side?: 'l' | 'r'; late?: true;
};
const FIELD: Slot[] = [
  // pierwszy plan: kaskada po obu stronach tekstu
  { kind: 'f', r: 0, col: 'l', x: -25.5, y: -25, row: 1, side: 'l' },
  { kind: 'f', r: 1, col: 'r', x: 28.5, y: -19, row: -1, side: 'r' },
  { kind: 'f', r: 2, col: 'l', x: -29.5, y: -1.5, row: 2, side: 'l' },
  { kind: 'f', r: 3, col: 'r', x: 25, y: 4.5 },
  { kind: 'f', r: 4, col: 'l', x: -25, y: 23, row: -2, side: 'l', late: true },
  { kind: 'f', r: 5, col: 'r', x: 29, y: 27.5 },
  // drugi plan: między dużymi dymkami, dalej od tekstu; dwa najdłuższe pytania w pasach nad i pod tekstem
  { kind: 'b', r: 6, col: 'l', x: -33, y: -13.5, row: 3, side: 'l', late: true },
  { kind: 'b', r: 7, col: 'r', x: 34, y: -31.5 },
  { kind: 'b', r: 8, col: 'l', x: -34, y: 11 },
  { kind: 'b', r: 9, col: 'r', x: 33.5, y: -7.5 },
  { kind: 'b', r: 10, band: 't', x: 8.5, g: 22 },
  { kind: 'b', r: 11, band: 'b', x: -8, g: 24 },
  // „ktoś pisze”: kolejne pytania w drodze
  { kind: 't', col: 'l', x: -30, y: -38, row: -1, side: 'l' },
  { kind: 't', col: 'r', x: 31, y: 16, row: 1, side: 'r' },
  { kind: 't', col: 'l', x: -31, y: 35.5, row: -2, side: 'r', late: true },
  { kind: 't', band: 't', x: -10, g: 28 },
  { kind: 't', band: 'b', x: 10.5, g: 34 },
  // plan z głębi: rośnie w filmie w miejscu zwolnionym przez pierwszy plan
  { kind: 'd', r: 1, col: 'l', x: -25.5, y: -22 },
  { kind: 'd', r: 0, col: 'r', x: 26, y: -15 },
  { kind: 'd', r: 5, col: 'l', x: -26, y: 19.5 },
  { kind: 'd', r: 2, col: 'r', x: 25.5, y: 23 },
];
/** Fala odpowiedzi idzie od środka: próg dymka = jego (przybliżona) odległość od środka ekranu; plan z głębi
    dostaje odpowiedzi na końcu (wyłania się w połowie filmu). */
const DIST = FIELD.map((s) => (s.band
  ? Math.hypot(s.x / 50, (27 + (s.g ?? 0) / 9) / 50)
  : Math.hypot((Math.abs(s.x) + 9) / 50, (s.y ?? 0) / 50)));
const D_MIN = Math.min(...DIST), D_MAX = Math.max(...DIST);
const DEEP_FROM = FIELD.findIndex((s) => s.kind === 'd');
const AT = FIELD.map((s, i) => (s.kind === 'd' ? 0.84 + (i - DEEP_FROM) * 0.04 : 0.05 + (0.72 * (DIST[i] - D_MIN)) / (D_MAX - D_MIN)));
const NARR_AT = [0.1, 0.38, 0.66, 1] as const;

export const Opening = ({ t, locale }: P) => {
  const a = t.asks;
  const reduced = useReducedPref();
  const pin = useRef<HTMLElement>(null);
  const copy = useRef<HTMLDivElement>(null);
  const mid = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const mem = useRef<{ a: boolean[]; els: HTMLElement[]; all: boolean | null }>({ a: [], els: [], all: null });
  // pytania od najkrótszego (kolejność stała - przy równej długości zostaje kolejność ze słownika)
  const byLen = useMemo(() => a.questions.map((q, i) => ({ q, i })).sort((m, n) => m.q.length - n.q.length || m.i - n.i).map((m) => m.q), [a.questions]);

  // wysokość tekstu pierwszego ekranu i tekstu filmu: pasy i rzędy pytań trzymają od nich stały odstęp
  useEffect(() => {
    const root = pin.current, c = copy.current, m = mid.current;
    if (!root || !c || !m) return;
    const put = () => {
      setVar(root, '--copy-h', `${c.offsetHeight}px`);
      setVar(root, '--mid-h', `${m.offsetHeight}px`);
    };
    const ro = new ResizeObserver(put);
    ro.observe(c);
    ro.observe(m);
    put();
    return () => ro.disconnect();
  }, []);

  // głębia za kursorem: plany przesuwają się w różnym tempie (--px / --py od -1 do 1, z wygładzeniem); tylko mysz
  useEffect(() => {
    const root = pin.current;
    if (!root || reduced || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    // zmienne kursora czytają tylko dymki (.ch-o-b w liście) - zapis na liście zamiast na całej sekcji (wydajność, 2026-10-05)
    const host: HTMLElement = list.current ?? root;
    let raf = 0, tx = 0, ty = 0, cx = 0, cy = 0;
    const tick = () => {
      cx += (tx - cx) * 0.07;
      cy += (ty - cy) * 0.07;
      setVar(host, '--px', cx.toFixed(4));
      setVar(host, '--py', cy.toFixed(4));
      raf = Math.abs(tx - cx) + Math.abs(ty - cy) > 0.002 ? requestAnimationFrame(tick) : 0;
    };
    const onMove = (e: PointerEvent) => {
      tx = (e.clientX / window.innerWidth) * 2 - 1;
      ty = (e.clientY / window.innerHeight) * 2 - 1;
      if (!raf) raf = requestAnimationFrame(tick);
    };
    root.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      root.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(raf);
    };
  }, [reduced]);

  // wydajność (2026-10-05): refleks na dymkach animuje background-position (animacja głównego wątku, 21 dymków) -
  // gdy pierwszy ekran zjedzie z ekranu, animacje refleksu i kropek „pisze” stoją (data-off -> hero.css)
  useEffect(() => {
    const root = pin.current;
    if (!root) return;
    const io = new IntersectionObserver((es) => root.toggleAttribute('data-off', !es[es.length - 1].isIntersecting));
    io.observe(root);
    return () => { io.disconnect(); root.removeAttribute('data-off'); };
  }, []);

  usePin(pin, (p, el) => {
    // pierwszy render po hydratacji nie zna jeszcze ustawienia ruchu - przy ograniczonym ruchu zostaje stan końcowy
    if (window.matchMedia(RM).matches) return;
    setVar(el, '--cam', seg(p, 0, 0.12).toFixed(4));
    // powiększenie planów rośnie z przewijaniem i łagodnie wyhamowuje do końca sceny - BEZ cofania kamery na końcu
    // (właściciel 2026-10-05: „usuń ten bounce pod koniec animacji tych pytań”)
    setVar(el, '--z', (1 - Math.pow(1 - lin(p, 0, 0.94), 1.6)).toFixed(4));
    if (el.hasAttribute('data-film') !== p > 0.1) el.toggleAttribute('data-film', p > 0.1);

    const m = mem.current, ul = list.current;
    if (ul) {
      if (!m.els.length || !m.els[0].isConnected) m.els = Array.from(ul.querySelectorAll<HTMLElement>('.ch-o-b'));
      const u = lin(p, 0.16, 0.8);
      let all = true;
      for (let i = 0; i < FIELD.length; i++) {
        const done = u >= AT[i];
        if (!done) all = false;
        if (m.a[i] === done) continue;
        m.a[i] = done;
        m.els[i]?.toggleAttribute('data-a', done);
      }
      if (m.all !== all) { m.all = all; el.toggleAttribute('data-all', all); }
    }
    setNarr(el, p, NARR_AT);
  }, !reduced);

  return (
    <section ref={pin} className="ch-hero ch-o" aria-labelledby="sv-h1" data-all="">
      <div className="ch-o-stage">
        <div className="container mx-auto px-6 ch-o-in">
          <div ref={copy} className="ch-o-copy"><Head t={t.head} locale={locale} align="center" /></div>
          <div ref={mid} className="ch-o-mid sv-wait">
            <h2 className="im-title ch-o-title">{a.title} <span className="im-accent ch-o-acc">{a.titleAccent}</span></h2>
            <p className="ch-o-note"><Spark className="ch-o-note-s" />{a.answered}</p>
            <Narr className="ch-o-narr" items={a.steps} label={a.stepsAria} />
          </div>
        </div>

        <div className="container mx-auto px-6 ch-o-field sv-wait">
          <ul ref={list} className="ch-o-list">
            {FIELD.map((s, i) => (
              <li
                key={i}
                className="ch-o-b"
                data-pl={s.kind}
                data-col={s.col}
                data-band={s.band}
                data-side={s.side}
                data-row={s.row}
                data-late={s.late ? '' : undefined}
                data-a=""
                aria-hidden={s.kind === 't' || s.kind === 'd' ? true : undefined}
                style={{
                  '--x': s.x, '--y': s.y ?? 0, '--g': s.g ?? 0, '--sg': s.band === 't' ? -1 : 1,
                  '--ms': (s.row ?? 1) < 0 ? -1 : 1, '--rn': Math.abs(s.row ?? 1),
                  '--n': i, '--gd': `${(3 + ((i * 1.37) % 9)).toFixed(2)}s`,
                } as CSSProperties}
              >
                <span className="ch-o-pop">
                  <span className="ch-o-box ch-lit">
                    {s.kind === 't'
                      ? <span className="ch-o-dots"><i /><i /><i /></span>
                      : <span className="ch-o-txt">{byLen[s.r ?? 0]}</span>}
                    {s.kind !== 't' && <Spark className="ch-o-ok" />}
                    <i className="ch-o-glint" />
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};
