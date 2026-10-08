'use client';

import { useEffect, useRef, type CSSProperties } from 'react';
import { MessageCircle, User } from 'lucide-react';
import type { Locale } from '@/lib/i18n/locale';
import type { ChatbotsCopy } from '@/lib/i18n/uslugi/chatboty-ai';
import { useReducedPref, useSeen } from '../../_usluga/shared';
import { InboxCard, SectionHead, Spark, Words } from './talk';
import './zakres.css';

// SEKCJA 5 - ZAKRES: co dokładnie dostaje klient i kiedy.
// WYBÓR WŁAŚCICIELA 2026-10-04: „w zakresie wybieram plan” - zostaje ScopePlan; ScopeShow i ScopeTalk (opisane niżej
// dla historii) są USUNIĘTE z kodu razem ze stylami i przełącznikiem - nie przywracać bez prośby. Wersje z rundy 2:
// We wszystkich wersjach nagłówek i TERMIN na linii wymiarowej stoją w tych samych miejscach co na pozostałych
// podstronach usług (h2, tuż pod nim |--- wartość ---|, niżej lista) - drabina usług.
//   ScopeShow „Pokaz”   - numerowana lista + przyklejona scena: punkt najbliżej linii czytania sam się pokazuje
//                         (useFrame -> data-demo na scenie; pokazy wchodzą od dołu i wychodzą górą = kolejność listy),
//   ScopeTalk „Rozmowa” - zakres jako rozmowa ze stroną: pytanie z listy, odpowiedź dużym pismem + ilustracja;
//                         wcześniejsze odpowiedzi cofają się i przygasają (bez rozmycia),
//   ScopePlan „Plan”    - jeden ekran: sześć kart 3 x 2 z małym obrazem punktu (odgrywa się raz, potem stoi).
// Sześć motywów (wspólnych dla „Pokazu” i „Planu”) mówi językiem rozmowy, bez kadru przeglądarki:
//   0 bąbel w rogu + otwierające się okno z pierwszą wypowiedzią · 1 materiały firmy zapalają się wokół gwiazdy
//   asystenta · 2 ta sama wypowiedź w dwóch tonach i kolorach obwódki · 3 dymki w kilku językach · 4 zapytanie
//   w skrzynce · 5 gwiazda oddaje rozmowę człowiekowi (linia z impulsem).
// Napisy motywów: t.scope.talk.items[].show; języki z t.voice.dial.langs, pola skrzynki z t.scene.inbox (w t.scope
// nie ma tych tekstów - zgłoszone w raporcie). Motyw gra, gdy ma atrybut data-play (przejścia w zakres.css).
// Bez JS / ograniczony ruch: zwykły blok - nagłówek, termin, lista (w „Rozmowie” pełna lista pytań z odpowiedziami).

type P = { t: ChatbotsCopy; locale: Locale };
type Scope = ChatbotsCopy['scope'];
type Lang = ChatbotsCopy['voice']['dial']['langs'][number];

const vars = (v: Record<string, string | number>) => v as CSSProperties;
const nn = (i: number) => String(i + 1).padStart(2, '0');
const flag = (on: boolean | undefined) => (on ? '' : undefined);

/** Termin na linii wymiarowej (klasy szkieletu - te same miejsca na każdej podstronie usługi). */
const Term = ({ t }: { t: Scope }) => (
  <div className="sv-term ch-z-term">
    <span className="sv-term-l">{t.termLabel}</span>
    <span className="sv-term-dim"><i aria-hidden="true" /><b>{t.termValue}</b><i aria-hidden="true" /></span>
  </div>
);

// ══ MOTYWY ═══════════════════════════════════════════════════════════════════════════════════════════════════

/** 0 - bąbel czatu w rogu strony i otwierające się nad nim okno rozmowy z pierwszą wypowiedzią asystenta. */
const Widget = ({ text, play }: { text: string; play: boolean }) => (
  <div className="ch-z-m ch-z-wd" data-play={flag(play)}>
    <div className="ch-z-wd-win" style={vars({ '--k': 1 })}>
      <div className="ch-msg" data-who="bot">
        <Spark />
        <p className="ch-bub ch-z-say"><Words text={text} /></p>
      </div>
    </div>
    <span className="ch-z-wd-fab ch-z-a" style={vars({ '--k': 0 })}><MessageCircle aria-hidden="true" /></span>
  </div>
);

/** 1 - konstelacja wiedzy: nazwy materiałów firmy wokół gwiazdy asystenta, linie od gwiazdy do nazw zapalają się
    po kolei. Układ nazw robi CSS (wiersze flex - wytrzymuje dłuższe teksty EN i wąskie karty), a końce linii liczy
    pomiar (offsetLeft / offsetTop - niezależne od transformacji warstw wyżej). */
const Stars = ({ labels, play }: { labels: string[]; play: boolean }) => {
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const hub = el.querySelector<HTMLElement>('.ch-z-st-hub');
    const nodes = Array.from(el.querySelectorAll<HTMLElement>('.ch-z-st-l'));
    const lines = Array.from(el.querySelectorAll<SVGLineElement>('line'));
    const measure = () => {
      if (!hub || !el.offsetWidth) return;
      const cx = hub.offsetLeft + hub.offsetWidth / 2, cy = hub.offsetTop + hub.offsetHeight / 2;
      const r0 = hub.offsetWidth / 2 + 6;
      nodes.forEach((n, i) => {
        const ln = lines[i];
        if (!ln) return;
        const dx = n.offsetLeft + n.offsetWidth / 2 - cx, dy = n.offsetTop + n.offsetHeight / 2 - cy;
        const len = Math.hypot(dx, dy) || 1;
        // linia zaczyna się tuż za gwiazdą i kończy tuż przed obwódką nazwy (nie przechodzi pod tekstem)
        const cut = Math.min(1, (n.offsetWidth / 2 + 5) / Math.max(1, Math.abs(dx)), (n.offsetHeight / 2 + 5) / Math.max(1, Math.abs(dy)));
        const a = Math.min(1, r0 / len), b = Math.max(a, 1 - cut);
        ln.setAttribute('x1', (cx + dx * a).toFixed(1)); ln.setAttribute('y1', (cy + dy * a).toFixed(1));
        ln.setAttribute('x2', (cx + dx * b).toFixed(1)); ln.setAttribute('y2', (cy + dy * b).toFixed(1));
      });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [labels.length]);

  const pill = (s: string, k: number) => <span key={s} className="ch-z-st-l" style={vars({ '--k': k })}>{s}</span>;
  const top = labels.slice(0, 3), mid = labels.slice(3, 5), bot = labels.slice(5);
  return (
    <div ref={box} className="ch-z-m ch-z-st" data-play={flag(play)}>
      <svg className="ch-z-st-net" aria-hidden="true" focusable="false">
        {labels.map((s, i) => <line key={s} pathLength={1} style={vars({ '--k': i })} />)}
      </svg>
      <div className="ch-z-st-row" data-r="top">{top.map((s, i) => pill(s, i))}</div>
      <div className="ch-z-st-row" data-r="mid">
        {mid[0] ? pill(mid[0], 3) : null}
        <span className="ch-z-st-hub"><Spark /></span>
        {mid[1] ? pill(mid[1], 4) : null}
      </div>
      <div className="ch-z-st-row" data-r="bot">{bot.map((s, i) => pill(s, i + 5))}</div>
    </div>
  );
};

/** 2 - ton i wygląd: ta sama wypowiedź w kilku tonach, każdy dymek z inną obwódką. `swap` = dymki w jednym miejscu,
    zmieniają się na zmianę (scena „Pokazu”); bez `swap` stoją jeden pod drugim. */
const Tones = ({ lines, play, swap }: { lines: string[]; play: boolean; swap?: boolean }) => (
  <div className="ch-z-m ch-z-tn" data-play={flag(play)} data-swap={flag(swap)}>
    <div className="ch-z-tn-stack">
      {lines.map((s, i) => (
        <div key={s} className={swap ? 'ch-msg ch-z-tn-b' : 'ch-msg ch-z-tn-b ch-z-a'} data-who="bot" data-tone={i} style={vars({ '--k': i })}>
          <Spark />
          <p className="ch-bub">{s}</p>
        </div>
      ))}
    </div>
    <span className="ch-z-tn-sw">
      {lines.map((s, i) => <i key={s} data-tone={i} style={vars({ '--k': i })} />)}
    </span>
  </div>
);

/** 3 - języki: pytanie klienta i odpowiedź asystenta w tym samym języku. `cycle` = języki zmieniają się po kolei
    (scena „Pokazu”); bez `cycle` jedna rozmowa w drugim języku z listy + nazwy wszystkich języków. */
const Langs = ({ langs, play, cycle }: { langs: Lang[]; play: boolean; cycle?: boolean }) => (
  <div className="ch-z-m ch-z-lg" data-play={flag(play)} data-cycle={flag(cycle)}>
    <ul className="ch-z-lg-names">
      {langs.map((l, i) => <li key={l.name} style={vars({ '--k': i })}>{l.name}</li>)}
    </ul>
    <div className="ch-z-lg-stack">
      {langs.map((l, i) => (
        <div key={l.name} className="ch-z-lg-pair" style={vars({ '--k': i })}>
          <div className="ch-msg ch-z-a" data-who="client" style={vars({ '--k': 1 })}><p className="ch-bub">{l.q}</p></div>
          <div className="ch-msg ch-z-a" data-who="bot" style={vars({ '--k': 2 })}><Spark /><p className="ch-bub">{l.a}</p></div>
        </div>
      ))}
    </div>
  </div>
);

/** 5 - przekazanie człowiekowi: gwiazda asystenta, linia z impulsem, ikona osoby. `loop` = impuls biegnie w pętli
    (scena „Pokazu”, tylko gdy punkt jest aktywny); bez `loop` dwa przebiegi i spokój. */
const Handover = ({ show, play, loop }: { show: string[]; play: boolean; loop?: boolean }) => (
  <div className="ch-z-m ch-z-hd" data-play={flag(play)} data-loop={flag(loop)}>
    <span className="ch-z-hd-node" data-who="bot">
      <span className="ch-z-hd-ico"><Spark /></span>
      <em>{show[0]}</em>
    </span>
    <span className="ch-z-hd-line"><i /></span>
    <span className="ch-z-hd-node" data-who="team">
      <span className="ch-z-hd-ico"><User aria-hidden="true" /></span>
      <em>{show[1]}</em>
    </span>
    <p className="ch-z-hd-note">{show[2]}</p>
  </div>
);

/** Motyw punktu `k` (kolejność = t.scope.items). `stage` = duża scena „Pokazu” (pętle), bez niego mała karta „Planu”. */
const Motif = ({ k, t, play, stage }: { k: number; t: ChatbotsCopy; play: boolean; stage?: boolean }) => {
  const talk = t.scope.talk.items;
  if (k === 0) return <Widget text={talk[3].show[0]} play={play} />;
  if (k === 1) return <Stars labels={talk[0].show} play={play} />;
  if (k === 2) return <Tones lines={talk[3].show.slice(0, 2)} play={play} swap={stage} />;
  if (k === 3) return <Langs langs={t.voice.dial.langs.slice(0, 4)} play={play} cycle={stage} />;
  if (k === 4) return <div className="ch-z-m ch-z-ib" data-play={flag(play)}><InboxCard t={t.inbox} values={t.scene.inbox} on={play} /></div>;
  return <Handover show={talk[2].show} play={play} loop={stage} />;
};

// ══ 3. PLAN ══════════════════════════════════════════════════════════════════════════════════════════════════

/** Karta punktu: u góry mały obraz (odgrywa się raz, gdy karta pojawi się na ekranie), pod nim numer, tytuł, opis. */
const PlanCard = ({ t, i, reduced }: { t: ChatbotsCopy; i: number; reduced: boolean }) => {
  const ref = useRef<HTMLLIElement>(null);
  const seen = useSeen(ref, 0.3);
  const it = t.scope.items[i];
  return (
    <li ref={ref} className="ch-z-card" style={vars({ '--c3': i % 3, '--c2': i % 2 })}>
      <div className="ch-z-card-vis" aria-hidden="true"><Motif k={i} t={t} play={reduced || seen} /></div>
      <span className="ch-z-n" aria-hidden="true">{nn(i)}</span>
      <h3 className="ch-z-card-t">{it.title}</h3>
      <p className="ch-z-card-d">{it.text}</p>
    </li>
  );
};

export const ScopePlan = ({ t }: P) => {
  const reduced = useReducedPref();
  const s = t.scope;
  return (
    <section className="ch-sec ch-z ch-z-plan" aria-labelledby="ch-z-h">
      <div className="container mx-auto px-6">
        <div className="ch-z-plan-top">
          <div className="ch-z-plan-head">
            <SectionHead id="ch-z-h" title={s.title} accent={s.titleAccent} />
            <Term t={s} />
          </div>
          <span className="ch-tag ch-z-plan-tag">{t.sample}</span>
        </div>
        <ol className="ch-z-grid" data-sky="">
          {s.items.map((it, i) => <PlanCard key={it.title} t={t} i={i} reduced={reduced} />)}
        </ol>
      </div>
    </section>
  );
};
