'use client';

import { Fragment, useEffect, useRef, useState, type CSSProperties } from 'react';
import { User } from 'lucide-react';
import type { Locale } from '@/lib/i18n/locale';
import type { ChatbotsCopy } from '@/lib/i18n/uslugi/chatboty-ai';
import { lin, seg } from '../../_usluga/shared';
import { Msg, Narr, SectionHead, setNarr, setVar, type MsgState } from './talk';
import { KnowList, SRC, useCalm, useScene } from './wiedza';
import './wiedza-sciana.css'; // style tej wersji (prefiks ch-kw-); części wspólne: wiedza.css, chatboty.css

// SEKCJA „WIEDZA” - wersja „ŚCIANA” (runda 6). Właściciel 2026-10-05 o sześciu wcześniejszych wersjach: „nie czuję
// tej sekcji jakoś z tych propozycji aktualnych, wymyśl coś innego”. Tamte były schematami z dokumentów (karty,
// płyty, talie, okrąg, konstelacja) z rozmową z boku. Ta jest JEDNYM obrazem na cały ekran:
//   wszystko, co firma wie o sobie, płynie przez ekran wielkimi pasami tekstu (cennik, opisy, regulamin, godziny,
//   FAQ - po jednym pasie na dokument, jak pasek pod hero na stronie głównej, tylko ogromny). Pasy suną z przewijaniem
//   na przemian w lewo i w prawo. W środku ekranu jest spokojny pas rozmowy.
//   1. pasy wjeżdżają z boków - „Trenujemy go na Twoich cennikach, opisach i FAQ”,
//   2. klient pyta -> pasy zwalniają i przygasają, a w pasie tuż przy rozmowie zapalają się DOKŁADNIE te fakty,
//      z których powstaje odpowiedź (biel + zakreślenie markerem, etykieta dokumentu obok) - dwa pytania, dwa pasy,
//   3. pytanie spoza wiedzy -> pasy pędzą (asystent szuka), po drodze błyskają pojedyncze fakty, żaden się nie
//      zakreśla -> pasy gasną, asystent mówi, że nie będzie zgadywać, i oddaje rozmowę człowiekowi.
// Jedno miejsce rozmowy (środek), jedno miejsce akcji (pas przy rozmowie), narrator obok rozmowy.
// Pasy z odpowiedzią ustawia POMIAR (measure): w chwili KEY_AT etykieta dokumentu z dwoma faktami stoi pośrodku
// ekranu; gdy para nie mieści się na szerokość (telefon), pośrodku staje pierwszy fakt, a pas przejeżdża do drugiego.
// `act` (stan Reacta, tylko na progach ACT): 1 pytanie 1 · 2 asystent szuka · 3 odpowiedź · 4-6 to samo dla pytania 2 ·
// 7 pytanie spoza wiedzy · 8 szuka (pasy pędzą) · 9 odpowiedź · 10 przekazanie człowiekowi.
// Bez JS / ograniczony ruch / niski ekran: nagłówek, lista pytań z odpowiedziami (KnowList), narrator jako lista.

type P = { t: ChatbotsCopy; locale: Locale };

const NARR_AT = [0.02, 0.2, 0.66, 1];
const ACT = [0.22, 0.26, 0.29, 0.44, 0.5, 0.53, 0.66, 0.69, 0.87, 0.92];
/** Pytania sceny (indeksy w `k.items`): Cennik, Regulamin i pytanie spoza wiedzy; próg `act`, od którego widać pytanie. */
const ASKS = [0, 1, 3];
const ASK_ACT = [1, 4, 7];
/** Pasy od góry ekranu: doc = indeks w `k.wall`, sg = nad (-1) / pod (1) rozmową, k = który od rozmowy, dir = kierunek
    biegu, v = tempo, key = numer pytania, na które odpowiada ten pas (pasy tuż przy rozmowie: Cennik i Regulamin). */
const ROWS = [
  { doc: 1, sg: -1, k: 2, dir: 1, v: 0.8 },
  { doc: 0, sg: -1, k: 1, dir: -1, v: 1, key: 0 },
  { doc: 2, sg: 1, k: 1, dir: 1, v: 1, key: 1 },
  { doc: 3, sg: 1, k: 2, dir: -1, v: 0.85 },
  { doc: 4, sg: 1, k: 3, dir: 1, v: 0.7 },
] as const;
/** Ile razy pas powtarza swoje fakty (zakreślenie staje na faktach DRUGIEGO powtórzenia - z zapasem po obu stronach). */
const REPEAT = 2;
/** Chwila (postęp sceny), w której fakty z odpowiedzią stoją pośrodku ekranu - dla pasów z key 0 i 1. */
const KEY_AT = [0.29, 0.53];
/** Ile faktów błyska przy szukaniu odpowiedzi na pytanie spoza wiedzy. */
const FLASHES = 9;

/** Wspólny przesuw pasów [vw]: ruch między taktami, prawie bezruch, gdy widać odpowiedź, szybki bieg przy szukaniu. */
const drift = (p: number) => 24 * seg(p, 0, 0.2) + 4 * seg(p, 0.2, 0.24) + 2 * lin(p, 0.24, 0.42) + 26 * seg(p, 0.42, 0.5)
  + 2 * lin(p, 0.5, 0.66) + 90 * seg(p, 0.68, 0.86) + 3 * lin(p, 0.86, 1);
const DRIFT_MAX = drift(1);

type RowGeo = { el: HTMLElement; t0: number; dir: number; v: number; pan: number; at: number };

/** Położenia pasów z pomiaru: pas zwykły stoi tak, żeby przez całą scenę zakrywał ekran; pas z odpowiedzią tak, żeby
    w chwili KEY_AT etykieta dokumentu z dwoma faktami stała pośrodku ekranu. `pan` = droga z pierwszego faktu na
    drugi, gdy para jest szersza niż ekran. Scena wyłączona (brak rozmiarów) = pusta lista. */
const measure = (root: HTMLElement): RowGeo[] => {
  const W = root.querySelector<HTMLElement>('.ch-kw-wall')?.clientWidth ?? 0;
  if (!W) return [];
  const vw = W / 100;
  return Array.from(root.querySelectorAll<HTMLElement>('.ch-kw-track')).map((el, r) => {
    const cfg = ROWS[r] ?? ROWS[0];
    let t0 = -(el.offsetWidth - W) / 2 - (cfg.dir * cfg.v * DRIFT_MAX * vw) / 2;
    let pan = 0, at = 0;
    const tag = el.querySelector<HTMLElement>('[data-anchor="tag"]');
    const f1 = el.querySelector<HTMLElement>('[data-anchor="0"]');
    const f2 = el.querySelector<HTMLElement>('[data-anchor="1"]');
    if ('key' in cfg && tag && f1 && f2) {
      at = KEY_AT[cfg.key];
      const left = tag.offsetLeft, right = f2.offsetLeft + f2.offsetWidth;
      const c1 = f1.offsetLeft + f1.offsetWidth / 2, c2 = f2.offsetLeft + f2.offsetWidth / 2;
      const fits = right - left <= W - 48;
      pan = fits ? 0 : c2 - c1;
      t0 = W / 2 - (fits ? (left + right) / 2 : c1) - cfg.dir * cfg.v * drift(at) * vw;
    }
    return { el, t0, dir: cfg.dir, v: cfg.v, pan, at };
  });
};

export const KnowWall = ({ t }: P) => {
  const calm = useCalm();
  const k = t.know;
  const pin = useRef<HTMLDivElement>(null);
  const geo = useRef<RowGeo[]>([]);
  const hot = useRef<{ idx: number; el: HTMLElement | null }>({ idx: -1, el: null });
  // serwer i pierwszy render: stan końcowy; stan początkowy ustawia pierwsza klatka sceny
  const actRef = useRef(ACT.length);
  const [act, setAct] = useState(ACT.length);

  // pomiar od nowa po zmianie rozmiaru i po wczytaniu fontów (szerokości pasów zależą od kroju)
  useEffect(() => {
    const el = pin.current;
    if (!el || calm) return;
    const reset = () => { geo.current = []; };
    const ro = new ResizeObserver(reset);
    ro.observe(el);
    let alive = true;
    void document.fonts.ready.then(() => { if (alive) reset(); });
    return () => { alive = false; ro.disconnect(); };
  }, [calm]);

  useScene(pin, (p, e, el) => {
    if (!geo.current.length) geo.current = measure(el);
    const g = geo.current;
    const W = el.clientWidth || window.innerWidth, vw = W / 100;
    const d = drift(p);
    const enter = 1 - seg(e, 0.15, 1);
    g.forEach((row) => {
      // telefon: pas z odpowiedzią przejeżdża z pierwszego zakreślonego faktu na drugi
      const pan = row.at ? row.pan * seg(p, row.at + 0.02, row.at + 0.1) : 0;
      setVar(row.el, '--tx', (row.t0 + row.dir * (row.v * d - enter * 34) * vw - pan).toFixed(1));
    });

    const h0 = seg(p, 0.27, 0.31) * (1 - seg(p, 0.42, 0.46));
    const h1 = seg(p, 0.51, 0.55) * (1 - seg(p, 0.64, 0.68));
    setVar(el, '--b', lin(e, 0.1, 0.9).toFixed(4));
    setVar(el, '--h0', h0.toFixed(4));
    setVar(el, '--h1', h1.toFixed(4));
    setVar(el, '--fo', Math.max(h0, h1).toFixed(4));
    setVar(el, '--lost', seg(p, 0.86, 0.92).toFixed(4));

    // szukanie: co chwilę błyska jeden fakt z kolejnego pasa (ten, który akurat jest w lewej części ekranu)
    const idx = p >= 0.69 && p < 0.86 ? Math.floor(lin(p, 0.69, 0.86) * FLASHES) : -1;
    if (idx !== hot.current.idx) {
      hot.current.el?.removeAttribute('data-hot');
      hot.current = { idx, el: null };
      const row = idx >= 0 && g.length ? g[idx % g.length].el : null;
      const f = row ? Array.from(row.querySelectorAll<HTMLElement>('.ch-kw-f')).find((x) => {
        const left = x.getBoundingClientRect().left;
        return left > W * 0.1 && left < W * 0.66;
      }) : undefined;
      if (f) { f.setAttribute('data-hot', ''); hot.current.el = f; }
    }

    setNarr(el, p, NARR_AT);
    let a = 0;
    for (const x of ACT) if (p >= x) a++;
    if (a !== actRef.current) { actRef.current = a; setAct(a); }
  }, !calm);

  return (
    <section className="ch-sec ch-k ch-kw" aria-labelledby="ch-k-h">
      <div className="container mx-auto px-6">
        <SectionHead id="ch-k-h" title={k.title} accent={k.titleAccent} lead={k.lead} />
        <KnowList t={t} sr />
      </div>
      <div ref={pin} className="ch-k-pin ch-kw-pin">
        <div className="ch-k-stage">
          <div className="ch-k-scene" aria-hidden="true">
            <div className="ch-kw-wall">
              {ROWS.map((cfg, r) => {
                const row = k.wall[cfg.doc] ?? k.wall[0];
                const keyed = 'key' in cfg;
                return (
                  <div
                    key={r}
                    className="ch-kw-row"
                    data-key={keyed ? cfg.key : undefined}
                    data-far={cfg.k > 2 ? '' : undefined}
                    style={{ '--sg': cfg.sg, '--k': cfg.k, '--r': r } as CSSProperties}
                  >
                    <div className="ch-kw-track">
                      {Array.from({ length: REPEAT }, (_, rep) => (
                        <Fragment key={rep}>
                          <b className="ch-kw-doc" data-anchor={rep === 1 ? 'tag' : undefined}>{row.doc}</b>
                          {row.facts.map((f, j) => (
                            <Fragment key={j}>
                              <span className="ch-kw-f" data-k={keyed && j < 2 ? j : undefined} data-anchor={rep === 1 && j < 2 ? j : undefined}>{f}</span>
                              <i className="ch-kw-sep" />
                            </Fragment>
                          ))}
                        </Fragment>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="ch-k-stage-in container mx-auto px-6">
            <div className="ch-k-only ch-kw-band" aria-hidden="true">
              <Narr className="ch-kw-narr" items={k.steps} label={k.stepsAria} />
              <div className="ch-kw-talk">
                <p className="ch-k-meta ch-kw-meta"><span className="ch-tag">{t.sample}</span><span>{k.firm}</span></p>
                <div className="ch-k-turns">
                  {ASKS.map((i, j) => {
                    const it = k.items[i];
                    const from = ASK_ACT[j], until = ASK_ACT[j + 1] ?? Infinity;
                    const on = act >= from && act < until;
                    const bot: MsgState = !on ? 'off' : act >= from + 2 ? 'on' : act >= from + 1 ? 'think' : 'off';
                    const hand = SRC[i] < 0;
                    return (
                      <div key={it.q} className="ch-k-turn" data-on={on ? '' : undefined}>
                        <Msg who="client" label={t.speakers.client} text={it.q} state={on ? 'on' : 'off'} />
                        <Msg who="bot" label={t.speakers.assistant} text={it.a} state={bot} />
                        <p className="ch-k-src ch-kw-src" data-on={on && act >= from + (hand ? 3 : 2) ? '' : undefined}>
                          {hand && <i className="ch-kw-who"><User /></i>}
                          <span>{hand ? k.handLabel : k.sourceLabel}</span> {it.src}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
