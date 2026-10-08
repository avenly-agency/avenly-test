'use client';

import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react';
import type { Locale } from '@/lib/i18n/locale';
import type { ChatbotsCopy } from '@/lib/i18n/uslugi/chatboty-ai';
import { clamp01, lin, seg, usePin, useReducedPref } from '../../_usluga/shared';
import { Head, InboxCard, Narr, Spark, Words, setNarr, setVar } from './talk';
import './scena.css'; // style sceny głównej (prefiks ch-h-)

// 1. SCENA GŁÓWNA - pierwszy ekran + przypięty film (praca równoległa, etap 3, chat 13, runda 2).
// Scenka Oferty rozegrana jak film z kamerą, w trzech taktach z narratorem (jedno zdanie naraz):
//   „Klient pyta o ofertę o drugiej w nocy.” -> „Asystent odpowiada w kilka sekund, konkretnie.” ->
//   „Rano gotowe zapytanie czeka w Twojej skrzynce.”
// Trzy wersje do wyboru (panel na dole ekranu), każda to inna scena:
//   SceneNight  „Noc”     - bohaterem jest ZEGAR. Pierwszy ekran: ogromna godzina 22:00 wychodząca za prawą krawędź,
//                           niebo z gwiazdami i horyzont (krawędź planety z hero strony głównej). Przewijanie = czas:
//                           zegar w przyspieszeniu dojeżdża do 02:07 i odjeżdża w lewy górny róg, na niebie zapala się
//                           gwiazda klienta, rozmowa pisze się razem z przewijaniem, potem noc mija (zegar do 08:00,
//                           horyzont jaśnieje kolorem podstrony) i w skrzynce ląduje gotowe zapytanie.
//   SceneFlight „Przelot” - rozmowa stoi W GŁĘBI: wypowiedzi wiszą jedna za drugą w przestrzeni, a kamera leci przez
//                           nie do przodu - każda nadlatuje z głębi, staje w ostrości (postój na przeczytanie) i mija
//                           kamerę bokiem; lot kończy się na zapytaniu w skrzynce. W tle gwiazdy na kilku planach.
//   SceneType   „Napisy”  - rozmowa WIELKIMI LITERAMI: pytanie klienta wjeżdża zza prawej krawędzi jako obrys
//                           (pytanie bez odpowiedzi), odpowiedź asystenta wybija się pod nim pełnym pismem słowo po
//                           słowie, a rano obie linijki maleją do nagłówka zapytania w skrzynce.
// Wszystko sterowane przewijaniem (usePin pisze zmienne CSS i atrybuty wprost do DOM, bez renderów Reacta).
// Bez JS / ograniczony ruch: zwykły blok - nagłówek, rozmowa w całości, zapytanie w skrzynce, lista zdań narratora.
// Rozmowa to PRZYKŁAD (etykieta `sample`, wymyślona firma) - okna prawdziwego czatu nie ruszamy.

type P = { t: ChatbotsCopy; locale: Locale };

/** Granice trzech zdań narratora w postępie sceny (wspólne dla trzech wersji - ta sama opowieść). */
const NARR_AT = [0.1, 0.4, 0.7, 1] as const;
const RM = '(prefers-reduced-motion: reduce)';
/** Zegar nocy: start 22:00, rozmowa o 02:07 (247 min później), rano 08:00 (600 min). */
const START = 22 * 60, TALK = 247, MORNING = 600;
const fmt = (m: number) => {
  const x = (START + m) % 1440;
  return `${String(Math.floor(x / 60)).padStart(2, '0')}:${String(x % 60).padStart(2, '0')}`;
};

const setState = (el: Element | null | undefined, state: string) => {
  if (el instanceof HTMLElement && el.dataset.state !== state) el.dataset.state = state;
};
const setFlag = (el: Element | null | undefined, name: string, on: boolean) => {
  if (!el) return;
  if (on) { if (!el.hasAttribute(name)) el.setAttribute(name, ''); } else if (el.hasAttribute(name)) el.removeAttribute(name);
};
const setText = (el: HTMLElement | null, text: string) => { if (el && el.textContent !== text) el.textContent = text; };
/** Wypowiedź asystenta w scenie: `think` chowa dymek (gwiazda myśli), `on` pokazuje; gwiazda mówi, póki trwa pisanie. */
const setBot = (el: Element | null | undefined, state: 'off' | 'think' | 'on', speaking: boolean) => {
  setState(el, state);
  setState(el?.querySelector('.ch-spark'), state === 'think' ? 'think' : speaking ? 'speak' : 'idle');
};

/** Wspólna rama filmu: wysoki kontener, w nim przyklejony ekran; nagłówek strony gaśnie przy najeździe kamery. */
const Film = ({ t, locale, look, onFrame, children }: P & { look: string; onFrame: (p: number, el: HTMLElement) => void; children: ReactNode }) => {
  const reduced = useReducedPref();
  const pin = useRef<HTMLElement>(null);
  const copy = useRef<HTMLDivElement>(null);
  // wysokość nagłówka (--copy-h): na telefonie pierwszy obiekt sceny stoi tuż pod nagłówkiem
  useEffect(() => {
    const el = copy.current, root = pin.current;
    if (!el || !root) return;
    const ro = new ResizeObserver(() => root.style.setProperty('--copy-h', `${el.offsetHeight}px`));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  usePin(pin, (p, el) => {
    // Pierwszy render po hydratacji nie zna jeszcze ustawienia ruchu (useReducedPref startuje od false), a scena
    // w p = 0 chowa rozmowę i opróżnia skrzynkę. Przy ograniczonym ruchu nic nie ruszamy - zostaje stan końcowy.
    if (window.matchMedia(RM).matches) return;
    setVar(el, '--cam', seg(p, 0, 0.11).toFixed(4));
    setFlag(el, 'data-film', p > 0.09);
    setNarr(el, p, NARR_AT);
    onFrame(p, el);
  }, !reduced);
  return (
    <section ref={pin} className={`ch-hero ch-h ch-h-${look}`} aria-labelledby="sv-h1">
      <div className="ch-h-stage">
        <div className="container mx-auto px-6 ch-hero-in ch-h-in">
          <div ref={copy} className="ch-h-copy"><Head t={t.head} locale={locale} /></div>
          {children}
        </div>
      </div>
    </section>
  );
};

/** Dymek sceny (wygląd wspólnych dymków, stan pisze scena). `say` = słowa odsłaniane postępem przewijania (--say). */
const Line = ({ who, label, text, say = false, refCb }: {
  who: 'client' | 'bot'; label: string; text: string; say?: boolean; refCb?: (el: HTMLDivElement | null) => void;
}) => (
  <div ref={refCb} className="ch-msg ch-h-msg" data-who={who} data-state="on">
    <span className="sr-only">{label}: </span>
    {who === 'bot' && <Spark />}
    <p className={say ? 'ch-bub ch-h-say' : 'ch-bub'} style={say ? ({ '--n': text.split(' ').length } as CSSProperties) : undefined}>
      {say ? <Words text={text} /> : text}
    </p>
  </div>
);

// ── „NOC” ────────────────────────────────────────────────────────────────────────────────────────────────────

/** Niebo: [x %, y %, rozmiar px, krycie, głębia (paralaksa przy najeździe kamery)]. Ostatnia = gwiazda klienta. */
const SKY: ReadonlyArray<readonly [number, number, number, number, number]> = [
  [47, 9, 6, 0.32, 0.4], [55, 31, 5, 0.3, 0.5], [61, 13, 10, 0.85, 1], [69, 38, 6, 0.42, 0.6], [74, 7, 7, 0.5, 0.7],
  [80, 27, 9, 0.6, 1.1], [86, 46, 5, 0.36, 0.5], [90, 15, 12, 0.8, 1.4], [95, 33, 7, 0.45, 0.8], [98, 7, 8, 0.55, 1.1],
  [52, 52, 5, 0.26, 0.4], [92, 62, 6, 0.3, 0.6],
];

export const SceneNight = ({ t, locale }: P) => {
  const s = t.scene;
  const clock = useRef<HTMLParagraphElement>(null);
  const lines = useRef<(HTMLDivElement | null)[]>([]);
  const box = useRef<HTMLDivElement>(null);
  const [q1, a1, q2, a2] = s.lines;

  const frame = (p: number, el: HTMLElement) => {
    setText(clock.current, fmt(Math.round(TALK * seg(p, 0, 0.11) + (MORNING - TALK) * seg(p, 0.7, 0.88))));
    setVar(el, '--dawn', seg(p, 0.7, 0.9).toFixed(4));
    setVar(el, '--say', lin(p, 0.43, 0.56).toFixed(4));
    const [m0, m1, m2, m3] = lines.current;
    setState(m0, p >= 0.13 ? 'on' : 'off');
    setBot(m1, p >= 0.42 ? 'on' : p >= 0.385 ? 'think' : 'off', p >= 0.42 && p < 0.57);
    setState(m2, p >= 0.595 ? 'on' : 'off');
    setBot(m3, p >= 0.645 ? 'on' : p >= 0.615 ? 'think' : 'off', p >= 0.645 && p < 0.69);
    setFlag(box.current?.querySelector('.ch-inbox'), 'data-on', p >= 0.84);
  };

  return (
    <Film t={t} locale={locale} look="night" onFrame={frame}>
      <div className="ch-h-sky sv-late" aria-hidden="true">
        {SKY.map(([x, y, size, o, d], i) => (
          <i key={i} className="ch-h-star" style={{ left: `${x}%`, top: `${y}%`, '--s': `${size}px`, '--o': o, '--d': d } as CSSProperties} />
        ))}
        <i className="ch-h-star ch-h-star-client" />
      </div>
      <div className="ch-h-horizon sv-late" aria-hidden="true"><i /><i /></div>

      <div className="ch-h-scene sv-late">
        <p ref={clock} className="ch-h-clock" aria-hidden="true">{fmt(TALK)}</p>
        <p className="ch-h-status"><span>{s.status[0]}</span><Spark /><span>{s.status[1]}</span></p>
        <div className="ch-h-right" data-sky="">
          <div className="ch-h-talk">
            <p className="ch-h-meta"><span className="ch-tag">{t.sample}</span><span>{s.firm}</span></p>
            <Line who="client" label={t.speakers.client} text={q1} refCb={(el) => { lines.current[0] = el; }} />
            <Line who="bot" label={t.speakers.assistant} text={a1} say refCb={(el) => { lines.current[1] = el; }} />
            <Line who="client" label={t.speakers.client} text={q2} refCb={(el) => { lines.current[2] = el; }} />
            <Line who="bot" label={t.speakers.assistant} text={a2} refCb={(el) => { lines.current[3] = el; }} />
          </div>
          <div ref={box} className="ch-h-box"><InboxCard t={t.inbox} values={s.inbox} on /></div>
        </div>
        <Narr className="ch-h-narr" items={s.steps} label={s.stepsAria} />
      </div>
    </Film>
  );
};

// ── „PRZELOT” ────────────────────────────────────────────────────────────────────────────────────────────────

/** Odstęp planów w głębi [px] i przystanki kamery: wypowiedź `i` stoi w ostrości, gdy położenie kamery = i.
    Między przystankami kamera jedzie miękko (seg), na każdym stoi - czas na przeczytanie. */
const GAP = 820;
const camAt = (p: number) =>
  -0.22 + 0.22 * seg(p, 0.04, 0.13) + seg(p, 0.25, 0.35) + seg(p, 0.5, 0.58) + seg(p, 0.64, 0.71) + seg(p, 0.79, 0.9);
/** Gwiazdy lotu: [x vw od środka, y vh od środka, głębia px, rozmiar px, krycie]. Daleko od osi, żeby mijały kadr bokiem. */
const FIELD: ReadonlyArray<readonly [number, number, number, number, number]> = [
  [-34, -22, -300, 7, 0.7], [31, -27, -700, 9, 0.8], [-41, 18, -1100, 6, 0.6], [38, 24, -1500, 10, 0.85],
  [-27, -31, -1900, 6, 0.55], [44, -9, -2300, 8, 0.7], [-46, -4, -2700, 9, 0.75], [29, 31, -3100, 6, 0.6],
  [-33, 29, -3500, 8, 0.7], [36, -30, -3900, 7, 0.65], [-24, 34, -600, 5, 0.5], [47, 12, -2900, 6, 0.55],
];

export const SceneFlight = ({ t, locale }: P) => {
  const s = t.scene;
  const items = useRef<(HTMLDivElement | null)[]>([]);
  const [q1, a1, q2, a2] = s.lines;

  const frame = (p: number, el: HTMLElement) => {
    const c = camAt(p);
    setVar(el, '--c', c.toFixed(4));
    items.current.forEach((it, i) => {
      if (!it) return;
      const d = i - c; // > 0: przed kamerą (w głębi), < 0: kamera już ją minęła
      setVar(it, '--z', `${(-d * GAP).toFixed(1)}px`);
      setVar(it, '--pass', Math.max(0, -d).toFixed(3));
      setVar(it, '--o', (d >= 0 ? clamp01(1.06 - d * 0.82) : clamp01(1 + d * 4.6)).toFixed(3));
      setFlag(it, 'data-focus', Math.abs(d) < 0.22);
      setState(it.querySelector('.ch-spark'), Math.abs(d) < 0.22 ? 'speak' : 'idle');
    });
    setFlag(items.current[4]?.querySelector('.ch-inbox'), 'data-on', p >= 0.9);
  };
  const at = (i: number) => (el: HTMLDivElement | null) => { items.current[i] = el; };

  return (
    <Film t={t} locale={locale} look="flight" onFrame={frame}>
      <div className="ch-h-scene sv-late">
        <div className="ch-h-fly" data-sky="">
          <div className="ch-h-field" aria-hidden="true">
            {FIELD.map(([x, y, z, size, o], i) => (
              <i key={i} className="ch-h-star" style={{ '--x': `${x}vw`, '--y': `${y}vh`, '--fz': `${z}px`, '--s': `${size}px`, '--o': o } as CSSProperties} />
            ))}
          </div>
          <p className="ch-h-meta"><span className="ch-tag">{t.sample}</span><span>{s.firm}</span></p>
          <div ref={at(0)} className="ch-h-item" style={{ zIndex: 9 }} data-side="r"><Line who="client" label={t.speakers.client} text={q1} /></div>
          <div ref={at(1)} className="ch-h-item" style={{ zIndex: 8 }} data-side="l"><Line who="bot" label={t.speakers.assistant} text={a1} /></div>
          <div ref={at(2)} className="ch-h-item" style={{ zIndex: 7 }} data-side="r"><Line who="client" label={t.speakers.client} text={q2} /></div>
          <div ref={at(3)} className="ch-h-item" style={{ zIndex: 6 }} data-side="l"><Line who="bot" label={t.speakers.assistant} text={a2} /></div>
          <div ref={at(4)} className="ch-h-item ch-h-item-box" style={{ zIndex: 5 }}><InboxCard t={t.inbox} values={s.inbox} on /></div>
        </div>
        <Narr className="ch-h-narr" items={s.steps} label={s.stepsAria} />
      </div>
    </Film>
  );
};

// ── „NAPISY” ─────────────────────────────────────────────────────────────────────────────────────────────────

export const SceneType = ({ t, locale }: P) => {
  const s = t.scene;
  const time = useRef<HTMLParagraphElement>(null);
  const answer = useRef<HTMLParagraphElement>(null);
  const box = useRef<HTMLDivElement>(null);

  const frame = (p: number, el: HTMLElement) => {
    setVar(el, '--say', lin(p, 0.42, 0.6).toFixed(4));
    setVar(el, '--end', seg(p, 0.7, 0.84).toFixed(4));
    setText(time.current, fmt(p >= 0.78 ? MORNING : TALK));
    setState(answer.current?.querySelector('.ch-spark'), p >= 0.4 && p < 0.42 ? 'think' : p >= 0.42 && p < 0.61 ? 'speak' : 'idle');
    setFlag(answer.current, 'data-on', p >= 0.4);
    setFlag(box.current?.querySelector('.ch-inbox'), 'data-on', p >= 0.86);
  };

  return (
    <Film t={t} locale={locale} look="type" onFrame={frame}>
      <div className="ch-h-scene sv-late">
        <div className="ch-h-lines" data-sky="">
          <p className="ch-h-meta">
            <span ref={time} className="ch-h-time" aria-hidden="true">{fmt(TALK)}</span>
            <span className="ch-tag">{t.sample}</span>
            <span>{s.firm}</span>
          </p>
          <div className="ch-h-big">
            <p className="ch-h-q"><span className="sr-only">{t.speakers.client}: </span>{s.big.q}</p>
            <p ref={answer} className="ch-h-a" data-on="">
              <span className="sr-only">{t.speakers.assistant}: </span>
              <Spark />
              <span className="ch-h-say" style={{ '--n': s.big.a.split(' ').length } as CSSProperties}><Words text={s.big.a} /></span>
            </p>
          </div>
        </div>
        <div ref={box} className="ch-h-box"><InboxCard t={t.inbox} values={s.inbox} on /></div>
        <Narr className="ch-h-narr" items={s.steps} label={s.stepsAria} />
      </div>
    </Film>
  );
};
