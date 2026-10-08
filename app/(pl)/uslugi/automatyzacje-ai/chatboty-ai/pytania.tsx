'use client';

import { useEffect, useRef, useState, useSyncExternalStore, type CSSProperties } from 'react';
import type { Locale } from '@/lib/i18n/locale';
import type { ChatbotsCopy } from '@/lib/i18n/uslugi/chatboty-ai';
import { clamp01, lin, seg, useFrame, usePin, useReducedPref } from '../../_usluga/shared';
import { Msg, Narr, SectionHead, Spark, setNarr, setVar, type MsgState } from './talk';
import './pytania.css';

// SEKCJA 2 „PYTANIA” podstrony „Chatboty AI” (runda 2, chat 13): „Setki pytań każdego dnia. Żadne bez odpowiedzi.”
// Trzy RÓŻNE sceny do wyboru w panelu na dole ekranu (style: pytania.css, prefiks ch-q-):
//   AsksFlow  „Napływ”        (.ch-q-f) - pole pytań w głębi (trzy plany, paralaksa) płynie z dołu ku górze przez
//                                         włosową linię odpowiedzi z gwiazdą asystenta; za linią każde pytanie jest
//                                         odpowiedziane (pomarańczowa obwódka + znak gwiazdy),
//   AsksRace  „Wyścig”        (.ch-q-r) - dwa tory, to samo pytanie o 21:40: asystent odpowiada od razu, formularz
//                                         czeka do rana; nad torami zegar biegnący z przewijaniem, kamera najeżdża
//                                         na tor asystenta, finał = dwa czasy wielką typografią,
//   AsksCrowd „Wszyscy naraz” (.ch-q-c) - jazda kamery w bok wzdłuż rzędu sześciu rozmów w perspektywie (za nim
//                                         przygaszony rząd w głębi), na końcu odjazd: wszystkie odpowiedziane naraz.
// Ruch = zmienne CSS pisane z postępu przewijania (bez renderów Reacta w każdej klatce; stan Reacta zmienia się
// tylko na progach). Bez JS / ograniczony ruch / niski ekran: zwykły blok ze stanem końcowym, narrator jako lista.

type P = { t: ChatbotsCopy; locale: Locale };

/** Spokojny tryb: ograniczony ruch albo niski ekran (telefon bokiem) - bez przypięcia; ten sam próg w pytania.css. */
const SHORT = '(max-height: 520px)';
const subShort = (cb: () => void) => {
  const m = window.matchMedia(SHORT);
  m.addEventListener('change', cb);
  return () => m.removeEventListener('change', cb);
};
const useCalm = () => {
  const reduced = useReducedPref();
  const short = useSyncExternalStore(subShort, () => window.matchMedia(SHORT).matches, () => false);
  return reduced || short;
};

// ═══ 1. NAPŁYW ═══════════════════════════════════════════════════════════════════════════════════════════════════
// Dymek: q = numer pytania, pl = plan (0 daleki, 1 środkowy, 2 bliski), x / xm = lewa krawędź w ułamku pola
// (komputer / telefon), d = położenie startowe względem linii odpowiedzi w wysokościach ekranu (dodatnie = pod linią).
// Położenie w kadrze: d - u * SPEED[pl] (u = postęp ujęcia); dymek jest „odpowiedziany”, gdy środek minie linię.
// Plan daleki to powtórzenia (aria-hidden) - 12 pytań ze słownika stoi na planie środkowym i bliskim.
const SPEED = [0.46, 0.84, 1.3] as const;
const LEAD = 0.2; // ruch zaczyna się już przy wjeździe sceny na ekran
const FLOW: { q: number; pl: 0 | 1 | 2; x: number; xm: number; d: number }[] = [
  { q: 2, pl: 0, x: 0.34, xm: 0.3, d: -0.26 }, { q: 6, pl: 0, x: 0.78, xm: 0.56, d: -0.17 },
  { q: 0, pl: 0, x: 0.12, xm: 0.04, d: -0.08 }, { q: 8, pl: 0, x: 0.6, xm: 0.46, d: 0.02 },
  { q: 5, pl: 0, x: 0.9, xm: 0.12, d: 0.1 }, { q: 10, pl: 0, x: 0.26, xm: 0.58, d: 0.18 },
  { q: 1, pl: 0, x: 0.7, xm: 0.24, d: 0.26 }, { q: 7, pl: 0, x: 0.04, xm: 0.5, d: 0.34 },
  { q: 4, pl: 0, x: 0.5, xm: 0.08, d: 0.42 },
  { q: 1, pl: 1, x: 0.06, xm: 0.02, d: 0.08 }, { q: 4, pl: 1, x: 0.52, xm: 0.26, d: 0.17 },
  { q: 2, pl: 1, x: 0.28, xm: 0.1, d: 0.29 }, { q: 7, pl: 1, x: 0.66, xm: 0.3, d: 0.4 },
  { q: 6, pl: 1, x: 0.02, xm: 0, d: 0.5 }, { q: 11, pl: 1, x: 0.44, xm: 0.2, d: 0.6 },
  { q: 5, pl: 1, x: 0.22, xm: 0.06, d: 0.7 }, { q: 8, pl: 1, x: 0.6, xm: 0.28, d: 0.79 },
  { q: 0, pl: 2, x: 0.58, xm: 0.34, d: 0.34 }, { q: 3, pl: 2, x: 0.1, xm: 0, d: 0.62 },
  { q: 9, pl: 2, x: 0.72, xm: 0.44, d: 0.9 }, { q: 10, pl: 2, x: 0.3, xm: 0.12, d: 1.2 },
];
const IMPULSES = [0, 1, 2];

export const AsksFlow = ({ t }: P) => {
  const calm = useCalm();
  const pinRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<HTMLDivElement>(null);
  const markRef = useRef<HTMLElement>(null);
  const ruleRef = useRef<HTMLDivElement>(null);
  const mem = useRef<{ a: boolean[]; els: HTMLElement[]; primed: boolean; imp: number; timer: number }>({ a: [], els: [], primed: false, imp: 0, timer: 0 });

  useEffect(() => {
    const m = mem.current;
    return () => window.clearTimeout(m.timer);
  }, []);

  useFrame((frac) => {
    const pin = pinRef.current, stage = stageRef.current, view = viewRef.current, mark = markRef.current, rule = ruleRef.current;
    if (!pin || !stage || !view || !mark || !rule) return;
    const r = pin.getBoundingClientRect(), vh = window.innerHeight;
    if (r.top - frac > vh * 1.5 || r.bottom - frac < -vh * 0.5) return; // daleko poza ekranem: nic nie piszemy
    // telefon / tablet: nagłówek stoi nad przyklejonym kadrem (znacznik = naturalna góra kadru); komputer: w kadrze
    const split = mark.offsetParent !== null;
    const top = (split ? mark.getBoundingClientRect().top : r.top) - frac;
    const sh = (split ? view : stage).offsetHeight;
    const p = clamp01(-top / Math.max(1, r.bottom - frac - top - sh));
    const e = clamp01(1 - top / vh);
    const u = p + (e - 1) * LEAD;

    const m = mem.current;
    if (!m.els.length || !m.els[0].isConnected) m.els = Array.from(rule.querySelectorAll<HTMLElement>('.ch-q-f-b'));
    let hit: HTMLElement | null = null;
    for (let i = 0; i < FLOW.length; i++) {
      const a = FLOW[i].d - u * SPEED[FLOW[i].pl] < 0;
      if (m.a[i] === a) continue;
      m.a[i] = a;
      const li = m.els[i];
      if (!li) continue;
      li.toggleAttribute('data-a', a);
      if (a && m.primed && li.offsetWidth > 0) hit = li;
    }
    if (hit) {
      // odpowiedź biegnie po linii od gwiazdy do pytania, gwiazda „mówi”
      const star = rule.querySelector<HTMLElement>('.ch-q-f-star');
      const imp = rule.querySelectorAll<HTMLElement>('.ch-q-f-imp')[m.imp++ % IMPULSES.length];
      if (star && imp) {
        const sr = star.getBoundingClientRect(), br = hit.getBoundingClientRect();
        const w = Math.max(0, br.left + Math.min(br.width / 2, 120) - (sr.left + sr.width / 2));
        imp.style.width = `${w.toFixed(0)}px`;
        if (typeof imp.animate === 'function') {
          imp.animate(
            [{ transform: 'scaleX(0)', opacity: 1 }, { transform: 'scaleX(1)', opacity: 1, offset: 0.6 }, { transform: 'scaleX(1)', opacity: 0 }],
            { duration: 900, easing: 'cubic-bezier(.16, 1, .3, 1)' },
          );
        }
        star.dataset.state = 'speak';
        window.clearTimeout(m.timer);
        m.timer = window.setTimeout(() => { star.dataset.state = 'idle'; }, 1300);
      }
    }
    m.primed = true;
    setVar(pin, '--u', u.toFixed(4));
    setNarr(pin, p, [0.04, 0.36, 0.68, 1]);
  }, !calm);

  return (
    <section className="ch-sec ch-q ch-q-f" aria-labelledby="ch-q-h">
      <div ref={pinRef} className="ch-q-pin ch-q-f-pin">
        <div ref={stageRef} className="ch-q-stage ch-q-f-stage">
          <div className="container mx-auto px-6 ch-q-f-in">
            <SectionHead id="ch-q-h" title={t.asks.title} accent={t.asks.titleAccent} lead={t.asks.lead} />
            <i ref={markRef} className="ch-q-f-mark" aria-hidden="true" />
            <div ref={viewRef} className="ch-q-f-view">
              <div ref={ruleRef} className="ch-q-f-rule">
                <i className="ch-q-f-sky" data-sky="" aria-hidden="true" />
                <i className="ch-q-f-hair" aria-hidden="true" />
                {IMPULSES.map((i) => <i key={i} className="ch-q-f-imp" aria-hidden="true" />)}
                <ul className="ch-q-f-list">
                  {FLOW.map((b, i) => (
                    <li
                      key={i}
                      className="ch-q-f-b"
                      data-pl={b.pl}
                      aria-hidden={b.pl === 0 ? true : undefined}
                      style={{ '--x': b.x, '--xm': b.xm, '--d0': b.d, '--s': SPEED[b.pl] } as CSSProperties}
                    >
                      <span className="ch-q-f-t">{t.asks.questions[b.q]}</span>
                      <Spark className="ch-q-f-ok" />
                    </li>
                  ))}
                </ul>
                <Spark className="ch-q-f-star" />
              </div>
              <div className="ch-q-f-foot">
                <p className="ch-q-f-note"><Spark className="ch-q-f-note-s" />{t.asks.answered}</p>
                <Narr items={t.asks.steps} label={t.asks.stepsAria} className="ch-q-f-narr" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ═══ 2. WYŚCIG ═══════════════════════════════════════════════════════════════════════════════════════════════════
// To samo pytanie o 21:40 na dwóch torach. Zegar biegnie z przewijaniem do rana następnego dnia (08:15).
const T0 = 21 * 60 + 40, NIGHT = 635; // start w minutach doby i długość nocy w minutach
const clockText = (min: number, locale: Locale) => {
  const m = ((Math.round(min) % 1440) + 1440) % 1440, h = Math.floor(m / 60), mm = String(m % 60).padStart(2, '0');
  if (locale === 'en') return `${h % 12 || 12}:${mm} ${h < 12 ? 'a.m.' : 'p.m.'}`;
  return `${String(h).padStart(2, '0')}:${mm}`;
};
type Race = { bot: 0 | 1 | 2; bs: number; fs: number; fa: boolean; bt: boolean; ft: boolean; fin: boolean };
const RACE_END: Race = { bot: 2, bs: 2, fs: 2, fa: true, bt: true, ft: true, fin: true };
const raceAt = (p: number): Race => ({
  bot: p < 0.06 ? 0 : p < 0.11 ? 1 : 2,
  bs: p < 0.08 ? 0 : p < 0.46 ? 1 : 2,
  fs: p < 0.2 ? 0 : p < 0.74 ? 1 : 2,
  fa: p >= 0.76,
  bt: p >= 0.18,
  ft: p >= 0.8,
  fin: p >= 0.87,
});
const raceKey = (s: Race) => `${s.bot}${s.bs}${s.fs}${+s.fa}${+s.bt}${+s.ft}${+s.fin}`;
const stepOn = (i: number, on: number) => (i === on ? '1' : i < on ? '2' : '0');

export const AsksRace = ({ t, locale }: P) => {
  const calm = useCalm();
  const pinRef = useRef<HTMLDivElement>(null);
  const clockRef = useRef<HTMLElement>(null);
  const keyRef = useRef(raceKey(RACE_END));
  const [st, setSt] = useState<Race>(RACE_END);
  const race = t.asks.race;

  usePin(pinRef, (p, el) => {
    const night = lin(p, 0.2, 0.74);
    const cam = seg(p, 0.24, 0.52) * (1 - seg(p, 0.84, 0.97));
    setVar(el, '--cam', cam.toFixed(4));
    setVar(el, '--wait', night.toFixed(4));
    setVar(el, '--fin', seg(p, 0.86, 0.98).toFixed(4));
    const clock = clockRef.current;
    if (clock) {
      const text = clockText(T0 + night * NIGHT, locale);
      if (clock.textContent !== text) clock.textContent = text;
    }
    const next = raceAt(p), key = raceKey(next);
    if (key !== keyRef.current) { keyRef.current = key; setSt(next); }
  }, !calm);

  const botState: MsgState = st.bot === 2 ? 'on' : st.bot === 1 ? 'think' : 'off';
  return (
    <section className="ch-sec ch-q ch-q-r" aria-labelledby="ch-q-h">
      <div className="container mx-auto px-6">
        <SectionHead id="ch-q-h" title={t.asks.title} accent={t.asks.titleAccent} lead={t.asks.lead} />
      </div>
      <div ref={pinRef} className="ch-q-pin ch-q-r-pin" data-fin={st.fin ? '' : undefined}>
        <div className="ch-q-stage ch-q-r-stage">
          <div className="container mx-auto px-6 ch-q-r-in">
            <div className="ch-q-r-top">
              <p className="ch-q-r-clock" aria-hidden="true">
                <b ref={clockRef} className="ch-q-r-time">{clockText(T0 + NIGHT, locale)}</b>
                <span className="ch-q-r-track"><i /></span>
              </p>
              <span className="ch-tag ch-q-r-tag">{t.sample}</span>
            </div>
            <div className="ch-q-r-lanes">
              <article className="ch-q-r-lane" data-lane="form" aria-labelledby="ch-q-r-form">
                <h3 id="ch-q-r-form" className="ch-q-r-name">{race.form.title}</h3>
                <div className="ch-q-r-thread">
                  <Msg who="client" label={t.speakers.client} text={race.question} state="on" />
                  <span className="ch-q-r-wait" aria-hidden="true"><i /></span>
                  <div className="ch-q-r-late" data-on={st.fa ? '' : undefined}>
                    <span className="sr-only">{race.form.title}: </span>
                    <p className="ch-bub">{race.answer}</p>
                  </div>
                </div>
                <div className="ch-q-r-end">
                  <ol className="ch-q-r-say" aria-labelledby="ch-q-r-form">
                    {race.form.steps.map((s, i) => <li key={i} data-on={stepOn(i, st.fs)}>{s}</li>)}
                  </ol>
                  <p className="ch-q-r-big" data-on={st.ft ? '' : undefined}>{race.form.time}</p>
                </div>
              </article>
              <article className="ch-q-r-lane" data-lane="bot" data-sky="" aria-labelledby="ch-q-r-bot">
                <h3 id="ch-q-r-bot" className="ch-q-r-name"><Spark state={st.bot === 1 ? 'think' : st.bot === 2 && !st.bt ? 'speak' : 'idle'} />{race.bot.title}</h3>
                <div className="ch-q-r-thread">
                  <Msg who="client" label={t.speakers.client} text={race.question} state="on" />
                  <Msg who="bot" label={t.speakers.assistant} text={race.answer} state={botState} />
                </div>
                <div className="ch-q-r-end">
                  <ol className="ch-q-r-say" aria-labelledby="ch-q-r-bot">
                    {race.bot.steps.map((s, i) => <li key={i} data-on={stepOn(i, st.bs)}>{s}</li>)}
                  </ol>
                  <p className="ch-q-r-big" data-on={st.bt ? '' : undefined}>{race.bot.time}</p>
                </div>
              </article>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ═══ 3. WSZYSCY NARAZ ════════════════════════════════════════════════════════════════════════════════════════════
// Rząd sześciu rozmów w perspektywie, kamera jedzie w bok (--dolly w px), za nim przygaszony rząd pustych rozmów
// jedzie wolniej. Stan karty z położenia w kadrze: 0 = pusta, 1 = pytanie (asystent myśli), 2 = odpowiedź.
// Finał (--g): rząd prostuje się i układa w siatkę (cele --tx / --ty / --sg liczone z pomiaru), widać wszystkie naraz.
const GHOSTS = [0, 1, 2, 3, 4, 5, 6, 7, 8];
const STEP = 1.07; // odstęp kart w rzędzie = 7% szerokości karty (to samo w pytania.css)

export const AsksCrowd = ({ t }: P) => {
  const calm = useCalm();
  const pinRef = useRef<HTMLDivElement>(null);
  const rigRef = useRef<HTMLDivElement>(null);
  const geo = useRef({ rw: 0, cw: 0, p: 0, flat: false });
  const keyRef = useRef('');
  const crowd = t.asks.crowd;
  const n = crowd.length;
  const [cs, setCs] = useState<number[]>(() => crowd.map(() => 2));
  const [done, setDone] = useState(true);

  const apply = (p: number) => {
    const el = pinRef.current, g = geo.current;
    g.p = p;
    if (!el || !g.cw) return;
    const run = seg(p, 0.02, 0.74), fin = seg(p, 0.78, 0.96);
    const from = g.rw - g.cw * 0.6, to = -(n - 1) * g.cw * STEP + (g.rw - g.cw) * 0.3;
    const dolly = from + (to - from) * run;
    setVar(el, '--dolly', `${dolly.toFixed(1)}px`);
    // wąski ekran (flat): siatka finału pomniejszałaby karty do nieczytelnych - rząd zostaje rzędem, wchodzi samo zdanie
    setVar(el, '--g', (g.flat ? 0 : fin).toFixed(4));
    const next = crowd.map((_, i) => {
      const x = i * g.cw * STEP + dolly;
      return x + g.cw * 0.85 < g.rw ? 2 : x + g.cw * 0.3 < g.rw ? 1 : 0;
    });
    const fine = fin > 0.55;
    const key = `${next.join('')}${+fine}`;
    if (key !== keyRef.current) { keyRef.current = key; setCs(next); setDone(fine); }
    setNarr(el, p, [0.02, 0.3, 0.6, 1]);
  };
  const applyRef = useRef(apply);
  useEffect(() => { applyRef.current = apply; });

  usePin(pinRef, (p) => applyRef.current(p), !calm);

  // pomiar: szerokość kadru i karty -> krok rzędu, cele siatki finału (wyrównane do lewej krawędzi kontenera)
  useEffect(() => {
    const rig = rigRef.current;
    if (!rig || calm) return;
    const measure = () => {
      const cards = Array.from(rig.querySelectorAll<HTMLElement>('.ch-q-c-card'));
      const rw = rig.clientWidth, rh = rig.clientHeight, cw = cards[0]?.offsetWidth ?? 0, ch = cards[0]?.offsetHeight ?? 0;
      if (!rw || !cw || !ch) return;
      const cols = rw >= 880 ? 3 : 2, rows = Math.ceil(cards.length / cols), gap = rw >= 880 ? 20 : 10;
      const sg = Math.max(0.3, Math.min(1, (rw - (cols - 1) * gap) / (cols * cw), (rh - (rows - 1) * gap) / (rows * ch)));
      const gh = rows * ch * sg + (rows - 1) * gap;
      rig.style.setProperty('--step', `${(cw * STEP).toFixed(1)}px`);
      rig.style.setProperty('--sg', sg.toFixed(4));
      cards.forEach((c, i) => {
        c.style.setProperty('--tx', `${((i % cols) * (cw * sg + gap)).toFixed(1)}px`);
        c.style.setProperty('--ty', `${(-gh / 2 + Math.floor(i / cols) * (ch * sg + gap) + ch / 2).toFixed(1)}px`);
      });
      geo.current.rw = rw; geo.current.cw = cw; geo.current.flat = sg < 0.6;
      applyRef.current(geo.current.p);
    };
    const ro = new ResizeObserver(measure);
    ro.observe(rig);
    return () => ro.disconnect();
  }, [calm]);

  return (
    <section className="ch-sec ch-q ch-q-c" aria-labelledby="ch-q-h">
      <div className="container mx-auto px-6">
        <SectionHead id="ch-q-h" title={t.asks.title} accent={t.asks.titleAccent} lead={t.asks.lead} />
      </div>
      <div ref={pinRef} className="ch-q-pin ch-q-c-pin">
        <div className="ch-q-stage ch-q-c-stage">
          <div className="container mx-auto px-6 ch-q-c-in">
            <div className="ch-q-c-top">
              <span className="ch-tag">{t.sample}</span>
              <p className="ch-q-c-note" data-on={done ? '' : undefined}>{t.asks.crowdNote}</p>
            </div>
            <div className="ch-q-c-cam">
              <div ref={rigRef} className="ch-q-c-rig" data-sky="">
                <div className="ch-q-c-back" aria-hidden="true">
                  {GHOSTS.map((i) => <i key={i} className="ch-q-c-ghost" style={{ '--i': i } as CSSProperties} />)}
                </div>
                <ul className="ch-q-c-row">
                  {crowd.map((c, i) => (
                    <li key={i} className="ch-q-c-card" data-st={cs[i] ?? 2} style={{ '--i': i } as CSSProperties}>
                      <Msg who="client" label={t.speakers.client} text={c.q} state={(cs[i] ?? 2) > 0 ? 'on' : 'off'} />
                      <Msg who="bot" label={t.speakers.assistant} text={c.a} state={(cs[i] ?? 2) === 2 ? 'on' : (cs[i] ?? 2) === 1 ? 'think' : 'off'} />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <Narr items={t.asks.steps} label={t.asks.stepsAria} className="ch-q-c-narr" />
          </div>
        </div>
      </div>
    </section>
  );
};
