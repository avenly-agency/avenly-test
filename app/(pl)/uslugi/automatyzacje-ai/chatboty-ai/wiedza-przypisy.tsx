'use client';

import { Fragment, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { User } from 'lucide-react';
import type { Locale } from '@/lib/i18n/locale';
import type { ChatbotsCopy } from '@/lib/i18n/uslugi/chatboty-ai';
import { clamp01, lin, seg } from '../../_usluga/shared';
import { Msg, Narr, SectionHead, Spark, setNarr, setVar, type SparkState } from './talk';
import { FAR, KnowList, NEAR, Plane, useCalm, useScene } from './wiedza';
import './wiedza-przypisy.css'; // style tej wersji (prefiks ch-kn-); wspólne części przypiętych scen: wiedza.css

// SEKCJA „WIEDZA”, wersja „PRZYPISY” (runda 3 sekcji Wiedza - właściciel: „bardziej premium animacje”).
// Pomysł redakcyjny: odpowiedź asystenta WIELKIM pismem z przypisami, jak w starannym artykule - każdy fakt ma źródło.
// Po prawej stoi talia dokumentów firmy (pięć kart w głębi, CSS 3D). Przypięta scena (100svh + 280vh), trzy takty:
//   1. talia się buduje: karty wlatują z prawej jedna po drugiej (tylna pierwsza), przy lądowaniu rysują się linie,
//   2. pytanie klienta -> odpowiedź pisze się słowo po słowie Z PRZEWIJANIEM (--say); potem marker zakreśla fragment
//      odpowiedzi I tę samą linijkę na karcie dokumentu (--m1 / --m2), za fragmentem wyskakuje numer przypisu,
//      a linijka dokumentu odlatuje jako pasek i dokuje pod odpowiedzią jako przypis 1 / 2 (--f1 / --f2),
//   3. pytanie spoza wiedzy -> talia przegląda wszystkie dokumenty: karta z przodu wysuwa się ku kamerze, przechodzi
//      po niej BIAŁA linia skanu, karta odjeżdża w prawo i wraca na koniec talii (pięć razy; żaden marker się nie
//      zapala) -> krótka odpowiedź, gniazdo przypisu zostaje puste (przerywana ramka), pytanie trafia do człowieka.
// Po lewej JEDNO miejsce rozmowy (pytanie, odpowiedź, przypisy), po prawej jedno miejsce akcji (talia), na dole narrator.
// `act` (stan Reacta, zmieniany tylko na progach ACT): 1 pytanie · 2 odpowiedź się pisze · 3 napisana (markery
// i przypisy) · 4 drugie pytanie · 5 przegląd talii · 6 druga odpowiedź się pisze · 7 napisana · 8 u człowieka.
// Lot paska = różnica położeń linijki na karcie i paska w gnieździe, mierzona w JS (measure) w stanie spoczynku.
// Bez JS / ograniczony ruch / niski ekran: nagłówek, lista pytań z odpowiedziami (KnowList), narrator jako lista.

type P = { t: ChatbotsCopy; locale: Locale };
type Cite = ChatbotsCopy['know']['cite'];

const NARR_AT = [0.02, 0.2, 0.64, 1];
const ACT = [0.2, 0.23, 0.36, 0.655, 0.68, 0.82, 0.9, 0.92];
/** Markery i przypisy: początek i długość odcinka postępu dzielonego równo między przypisy (potem postój do 0,6). */
const MARK_AT = 0.37, MARK_SPAN = 0.16;
/** Budowa talii: ile „kolejek” trwa lądowanie jednej karty (karty startują co jedną kolejkę, więc loty się zazębiają). */
const LAND = 2.2;
/** Włosowe linie pod treścią dokumentu: szerokości w % karty. */
const ROWS = [100, 82, 64, 90, 74, 52];
const STRIP_VARS = ['--dx', '--dy', '--zs', '--ox', '--oy'];

/** Kawałek słowa: zwykły tekst (ref = 0) albo fragment wzięty z materiałów (ref = numer przypisu). `a` / `b` =
    początek i długość kawałka w całym zakreśleniu (0-1, liczone znakami) - marker przechodzi przez kawałki po kolei. */
type Frag = { text: string; ref: number; a: number; b: number; first: boolean; last: boolean };

/** Odpowiedź pocięta na słowa z numeracją przez wszystkie fragmenty. Słowo = wszystko między zwykłymi spacjami
    (twarda spacja i znak przestankowy z sąsiedniego fragmentu zostają w tym samym słowie - nic nie spada samo
    do następnej linii); słowo może mieć kawałek zakreślany i zwykły („zł” + przecinek). */
const toTokens = (parts: Cite['parts']): Frag[][] => {
  const out: Frag[][] = [];
  let cur: Frag[] = [];
  for (const part of parts) {
    part.text.split(' ').forEach((piece, n) => {
      if (n > 0 && cur.length) { out.push(cur); cur = []; }
      if (piece) cur.push({ text: piece, ref: part.ref ?? 0, a: 0, b: 1, first: false, last: false });
    });
  }
  if (cur.length) out.push(cur);
  const marked = new Map<number, Frag[]>();
  for (const tok of out) for (const f of tok) if (f.ref) marked.set(f.ref, [...(marked.get(f.ref) ?? []), f]);
  marked.forEach((list) => {
    const total = list.reduce((sum, f) => sum + f.text.length + 1, 0);
    let at = 0;
    list.forEach((f, j) => {
      const len = f.text.length + 1; // + odstęp po słowie
      f.a = at / total; f.b = len / total; f.first = j === 0; f.last = j === list.length - 1;
      at += len;
    });
  });
  return out;
};

/** Numer przypisu, którego źródłem jest ta linijka dokumentu (0 = żaden). */
const refOf = (notes: Cite['notes'], doc: string, line: string) => notes.findIndex((x) => x.doc === doc && x.line === line) + 1;

/** Skąd leci pasek przypisu: różnica położeń linijki na karcie dokumentu i tej samej linijki w pasku stojącym
    w gnieździe. Pomiar w stanie spoczynku - atrybut data-measure zdejmuje na chwilę ruch sceny (talia ułożona, pasek
    na miejscu, rozmowa nieprzesunięta); atrybut znika przed malowaniem. Brak rozmiarów (scena wyłączona) = bez lotu:
    pasek po prostu się podnosi (wartości zapasowe w CSS). */
const measure = (el: HTMLElement) => {
  el.setAttribute('data-measure', '');
  el.querySelectorAll<HTMLElement>('.ch-kn-strip').forEach((strip) => {
    const src = el.querySelector<HTMLElement>(`.ch-kn-card .ch-kn-mk[data-ref="${strip.dataset.ref ?? ''}"]`);
    const dst = strip.querySelector<HTMLElement>('.ch-kn-strip-l > span');
    const a = src?.getBoundingClientRect(), b = dst?.getBoundingClientRect(), c = strip.getBoundingClientRect();
    if (a && b && a.width > 1 && a.height > 1 && b.width > 1 && b.height > 1) {
      setVar(strip, '--dx', (a.left - b.left).toFixed(1));
      setVar(strip, '--dy', (a.top - b.top).toFixed(1));
      setVar(strip, '--zs', Math.min(1.5, Math.max(0.8, a.height / b.height)).toFixed(3));
      setVar(strip, '--ox', (b.left - c.left).toFixed(1));
      setVar(strip, '--oy', (b.top - c.top).toFixed(1));
    } else {
      STRIP_VARS.forEach((name) => strip.style.removeProperty(name));
    }
  });
  el.removeAttribute('data-measure');
};

/** Odpowiedź wielkim pismem: gwiazda asystenta jako autor, słowa odsłaniane postępem przewijania (zmienna `say`),
    fragmenty z materiałów z markerem i numerem przypisu. `say` / `star` = nazwy zmiennych sceny dla tej wypowiedzi. */
const Big = ({ toks, say, star, state }: { toks: Frag[][]; say: string; star: string; state: SparkState }) => (
  <p className="ch-kn-big" style={{ '--n': toks.length, '--sy': `var(${say}, 1)`, '--sk': `var(${star}, 1)` } as CSSProperties}>
    <Spark state={state} />
    {toks.map((tok, i) => {
      const end = tok[tok.length - 1];
      return (
        <span key={i} className="ch-kn-w" data-join={end.ref && !end.last ? '' : undefined} style={{ '--i': i } as CSSProperties}>
          {tok.map((f, j) => (f.ref ? (
            <Fragment key={j}>
              <span
                className="ch-kn-mk"
                data-first={f.first ? '' : undefined}
                data-last={f.last ? '' : undefined}
                data-join={!f.last && j === tok.length - 1 ? '' : undefined}
                style={{ '--m': `var(--m${f.ref}, 1)`, '--a': f.a.toFixed(4), '--b': f.b.toFixed(4) } as CSSProperties}
              >
                {f.text}
              </span>
              {f.last ? <sup className="ch-kn-sup" style={{ '--m': `var(--m${f.ref}, 1)` } as CSSProperties}><i>{f.ref}</i></sup> : null}
            </Fragment>
          ) : f.text))}
        </span>
      );
    })}
  </p>
);

export const KnowNotes = ({ t }: P) => {
  const calm = useCalm();
  const k = t.know, c = k.cite;
  const pin = useRef<HTMLDivElement>(null);
  const cards = useRef<HTMLElement[]>([]);
  // serwer i pierwszy render: stan końcowy; stan początkowy ustawia pierwsza klatka sceny
  const actRef = useRef(ACT.length);
  const [act, setAct] = useState(ACT.length);
  const answer = useMemo(() => toTokens(c.parts), [c.parts]);
  const refusal = useMemo(() => toTokens([{ text: c.miss.text }]), [c.miss.text]);
  const noteCount = c.notes.length;

  useScene(pin, (p, e, el) => {
    if (!cards.current[0]?.isConnected) cards.current = Array.from(el.querySelectorAll<HTMLElement>('.ch-kn-card'));
    const n = cards.current.length;
    // budowa talii: część przy wjeździe sceny, reszta w pierwszym takcie; tylna karta ląduje pierwsza
    const build = lin(e, 0.3, 1) * 0.4 + lin(p, 0, 0.16) * 0.6;
    // przegląd: karta z przodu (numer `front`) wysuwa się ku kamerze, przechodzi skan, odjeżdża w prawo i wraca
    // na koniec talii; reszta przesuwa się o jedno miejsce do przodu. Zmiana kolejności (--z) dzieje się, gdy karta
    // jest za prawą krawędzią ekranu. Po pięciu kartach talia stoi jak na początku.
    const flip = lin(p, 0.68, 0.82) * n;
    const riffle = flip > 0 && flip < n;
    const front = Math.min(n - 1, Math.floor(flip)), u = flip - front;
    cards.current.forEach((card, i) => {
      const q = clamp01((build * (n - 1 + LAND) - (n - 1 - i)) / LAND);
      let s = i, x = (1 - q) ** 3, w = 0, scan = 0, z = n - i;
      if (riffle) {
        const r = (i - front + n) % n;
        if (r === 0) {
          const back = u >= 0.72;
          s = back ? n - 1 : 0;
          x = back ? 1 - seg(u, 0.72, 1) : seg(u, 0.42, 0.72);
          w = seg(u, 0, 0.14) * (1 - seg(u, 0.36, 0.5));
          scan = lin(u, 0.06, 0.4);
          z = back ? 1 : n;
        } else {
          s = r - seg(u, 0.46, 1);
          z = n - r + (u >= 0.72 ? 1 : 0);
        }
      }
      setVar(card, '--s', s.toFixed(3));
      setVar(card, '--x', x.toFixed(4));
      setVar(card, '--w', w.toFixed(3));
      setVar(card, '--sc', scan.toFixed(3));
      setVar(card, '--z', String(z));
      setVar(card, '--rw', seg(q, 0.6, 1).toFixed(3));
    });

    setVar(el, '--p', p.toFixed(4));
    setVar(el, '--sp', seg(p, 0.205, 0.23).toFixed(3));
    setVar(el, '--say', lin(p, 0.23, 0.36).toFixed(4));
    // marker (odpowiedź i linijka dokumentu jednocześnie), zaraz po nim lot paska do gniazda przypisu
    const step = MARK_SPAN / Math.max(1, noteCount);
    for (let r = 0; r < noteCount; r++) {
      const at = MARK_AT + r * step;
      setVar(el, `--m${r + 1}`, seg(p, at, at + step * 0.45).toFixed(4));
      setVar(el, `--f${r + 1}`, seg(p, at + step * 0.3, at + step * 0.9).toFixed(4));
    }
    setVar(el, '--hot', (seg(p, MARK_AT, MARK_AT + 0.03) * (1 - seg(p, 0.6, 0.655))).toFixed(3));
    setVar(el, '--out', seg(p, 0.615, 0.655).toFixed(4));
    setVar(el, '--sp2', seg(p, 0.66, 0.68).toFixed(3));
    setVar(el, '--say2', lin(p, 0.82, 0.89).toFixed(4));
    setVar(el, '--void', seg(p, 0.875, 0.905).toFixed(3));
    setVar(el, '--dim', seg(p, 0.92, 0.97).toFixed(3));
    setNarr(el, p, NARR_AT);
    let a = 0;
    for (const x of ACT) if (p >= x) a++;
    if (a !== actRef.current) { actRef.current = a; setAct(a); }
  }, !calm);

  // lot pasków: pomiar po montażu, po zmianie rozmiaru sceny lub rozmowy (łamanie tekstu) i po wczytaniu fontów
  useEffect(() => {
    const el = pin.current;
    if (!el || calm) return;
    const run = () => measure(el);
    run();
    const ro = new ResizeObserver(run);
    ro.observe(el);
    const side = el.querySelector('.ch-kn-side');
    if (side) ro.observe(side);
    let alive = true;
    void document.fonts.ready.then(() => { if (alive) run(); });
    return () => { alive = false; ro.disconnect(); };
  }, [calm]);

  const spark: SparkState = act === 2 || act === 6 ? 'speak' : act === 5 ? 'think' : 'idle';

  return (
    <section className="ch-sec ch-k ch-kn" aria-labelledby="ch-k-h">
      <div className="container mx-auto px-6">
        <SectionHead id="ch-k-h" title={k.title} accent={k.titleAccent} lead={k.lead} />
        <KnowList t={t} sr />
      </div>
      <div ref={pin} className="ch-k-pin ch-kn-pin">
        <div className="ch-k-stage">
          <div className="ch-k-scene" aria-hidden="true">
            <Plane items={FAR} depth="far" />
            <div className="ch-kn-deck" data-sky="">
              {k.sheets.map((s, i) => {
                const refs = s.lines.map((l) => refOf(c.notes, s.name, l));
                return (
                  <div key={s.name} className="ch-kn-card ch-lit" data-src={refs.some(Boolean) ? '' : undefined} style={{ '--i': i } as CSSProperties}>
                    <b>{s.name}</b>
                    <div className="ch-kn-lines">
                      {s.lines.map((l, j) => (
                        <span key={l} className="ch-kn-ln">
                          {refs[j] ? (
                            <span className="ch-kn-mk" data-first="" data-last="" data-ref={refs[j]} style={{ '--m': `var(--m${refs[j]}, 1)` } as CSSProperties}>{l}</span>
                          ) : l}
                        </span>
                      ))}
                    </div>
                    <div className="ch-kn-rows">
                      {ROWS.map((width, r) => <i key={r} style={{ '--r': r, width: `${width}%` } as CSSProperties} />)}
                    </div>
                  </div>
                );
              })}
            </div>
            <Plane items={NEAR} depth="near" />
          </div>
          <div className="ch-k-stage-in container mx-auto px-6">
            <div className="ch-k-only ch-kn-side" aria-hidden="true">
              <p className="ch-k-meta"><span className="ch-tag">{t.sample}</span><span>{k.firm}</span></p>
              <div className="ch-kn-turns">
                {/* pytanie z materiałów: odpowiedź z markerami i przypisami (całość odjeżdża z --out) */}
                <div className="ch-kn-turn" data-turn="0">
                  <Msg who="client" label={t.speakers.client} text={c.q} state={act >= 1 ? 'on' : 'off'} />
                  <Big toks={answer} say="--say" star="--sp" state={spark} />
                  <ol className="ch-kn-notes">
                    {c.notes.map((x, r) => (
                      <li key={r} className="ch-kn-note" style={{ '--f': `var(--f${r + 1}, 1)` } as CSSProperties}>
                        <span className="ch-kn-num">{r + 1}</span>
                        <span className="ch-kn-strip ch-lit" data-ref={r + 1}>
                          <span className="ch-kn-strip-d">{x.doc}</span>
                          <span className="ch-kn-strip-l"><span>{x.line}</span></span>
                        </span>
                      </li>
                    ))}
                  </ol>
                </div>
                {/* pytanie spoza wiedzy: krótka odpowiedź, puste gniazdo przypisu, przekazanie człowiekowi */}
                <div className="ch-kn-turn" data-turn="1">
                  <Msg who="client" label={t.speakers.client} text={c.miss.q} state={act >= 4 ? 'on' : 'off'} />
                  <Big toks={refusal} say="--say2" star="--sp2" state={spark} />
                  <div className="ch-kn-notes ch-kn-miss">
                    <p className="ch-kn-none">{c.miss.note}</p>
                    <p className="ch-kn-hand" data-on={act >= 8 ? '' : undefined}>
                      <i><User /></i>
                      <span><b>{k.team}</b> {c.miss.hand}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <Narr className="ch-k-narr" items={k.steps} label={k.stepsAria} />
          </div>
        </div>
      </div>
    </section>
  );
};
