'use client';

import { useRef, type CSSProperties } from 'react';
import type { Locale } from '@/lib/i18n/locale';
import type { ChatbotsCopy } from '@/lib/i18n/uslugi/chatboty-ai';
import { lin, seg, usePin, useReducedPref } from '../../_usluga/shared';
import { InboxCard, Narr, Spark, Words, setNarr, setVar } from './talk';
import './noc.css'; // style sceny nocy (prefiks ch-n-)

// 2. NOC - „22:00” (runda 3, właściciel 2026-10-04: „22:00 przesuń sekcję w dół i też cinematic przebuduj, że takie
// duże i na scrolla animacja”). Scenka Oferty jako pełnoekranowy, przypięty film - bohaterem jest OGROMNY ZEGAR:
//   1. Zegar 22:00 na całą szerokość ekranu, niebo z gwiazdami i horyzont (krawędź planety z hero strony głównej).
//      Przewijanie = czas: cyfry biegną do 02:07, gwiazdy suną w różnym tempie (paralaksa).
//   2. Kamera przenosi ostrość: zegar cofa się i gaśnie do tła (zostaje wielkie 02:07 za rozmową), na niebie zapala
//      się gwiazda klienta, przylatuje pytanie, asystent odpowiada słowo po słowie razem z przewijaniem.
//   3. Noc mija: cyfry biegną do 08:00, zegar wraca w pełnym świetle i wjeżdża w górę kadru, horyzont jaśnieje
//      kolorem podstrony, rozmowa odpływa, a pod zegarem ląduje gotowe zapytanie w skrzynce.
// Narrator (jedno zdanie naraz): „Klient pyta o ofertę o drugiej w nocy.” -> „Asystent odpowiada w kilka sekund,
// konkretnie.” -> „Rano gotowe zapytanie czeka w Twojej skrzynce.”
// Wszystko sterowane przewijaniem (usePin pisze zmienne CSS i atrybuty wprost do DOM).
// Bez JS / ograniczony ruch: zwykły blok - godzina, rozmowa w całości, zapytanie w skrzynce, lista zdań narratora.
// Rozmowa to PRZYKŁAD (etykieta `sample`, wymyślona firma).

type P = { t: ChatbotsCopy; locale: Locale };

const RM = '(prefers-reduced-motion: reduce)';
const NARR_AT = [0.18, 0.4, 0.7, 1] as const;
/** Zegar nocy: start 22:00, rozmowa o 02:07 (247 min później), rano 08:00 (600 min). */
const START = 22 * 60, TALK = 247, MORNING = 600;
const fmt = (m: number) => {
  const x = (START + m) % 1440;
  return `${String(Math.floor(x / 60)).padStart(2, '0')}:${String(x % 60).padStart(2, '0')}`;
};
/** Niebo: [x %, y %, rozmiar px, krycie, głębia (paralaksa przy przewijaniu)]. */
const SKY: ReadonlyArray<readonly [number, number, number, number, number]> = [
  [4, 12, 6, 0.4, 0.5], [11, 38, 5, 0.3, 0.4], [17, 8, 9, 0.7, 1], [24, 27, 5, 0.34, 0.5], [31, 14, 7, 0.5, 0.8],
  [38, 44, 5, 0.28, 0.4], [44, 6, 6, 0.42, 0.6], [53, 21, 10, 0.8, 1.2], [61, 9, 6, 0.4, 0.6], [68, 34, 5, 0.3, 0.5],
  [74, 13, 8, 0.6, 1], [81, 41, 6, 0.36, 0.6], [87, 7, 11, 0.8, 1.4], [93, 29, 6, 0.44, 0.7], [97, 15, 7, 0.5, 0.9],
  [7, 58, 5, 0.26, 0.4], [90, 60, 6, 0.3, 0.6], [47, 55, 5, 0.24, 0.4],
];

const setState = (el: Element | null | undefined, state: string) => {
  if (el instanceof HTMLElement && el.dataset.state !== state) el.dataset.state = state;
};
const setFlag = (el: Element | null | undefined, name: string, on: boolean) => {
  if (el && el.hasAttribute(name) !== on) el.toggleAttribute(name, on);
};
const setText = (el: HTMLElement | null, text: string) => { if (el && el.textContent !== text) el.textContent = text; };
/** Wypowiedź asystenta: `think` chowa dymek (gwiazda myśli), `on` pokazuje; gwiazda mówi, póki trwa pisanie. */
const setBot = (el: Element | null | undefined, state: 'off' | 'think' | 'on', speaking: boolean) => {
  setState(el, state);
  setState(el?.querySelector('.ch-spark'), state === 'think' ? 'think' : speaking ? 'speak' : 'idle');
};

/** Dymek sceny (wygląd wspólnych dymków, stan pisze scena). `say` = słowa odsłaniane postępem przewijania (--say). */
const Line = ({ who, label, text, say = false, refCb }: {
  who: 'client' | 'bot'; label: string; text: string; say?: boolean; refCb: (el: HTMLDivElement | null) => void;
}) => (
  <div ref={refCb} className="ch-msg ch-n-msg" data-who={who} data-state="on">
    <span className="sr-only">{label}: </span>
    {who === 'bot' && <Spark />}
    <p className={say ? 'ch-bub ch-n-say' : 'ch-bub'} style={say ? ({ '--n': text.split(' ').length } as CSSProperties) : undefined}>
      {say ? <Words text={text} /> : text}
    </p>
  </div>
);

export const Night = ({ t }: P) => {
  const s = t.scene;
  const reduced = useReducedPref();
  const pin = useRef<HTMLDivElement>(null);
  const sky = useRef<HTMLDivElement>(null);
  const clock = useRef<HTMLParagraphElement>(null);
  const lines = useRef<(HTMLDivElement | null)[]>([]);
  const box = useRef<HTMLDivElement>(null);
  const [q1, a1, q2, a2] = s.lines;

  usePin(pin, (p, el) => {
    // pierwszy render po hydratacji nie zna jeszcze ustawienia ruchu - przy ograniczonym ruchu zostaje stan końcowy
    if (window.matchMedia(RM).matches) return;
    setText(clock.current, fmt(Math.round(TALK * seg(p, 0, 0.15) + (MORNING - TALK) * seg(p, 0.72, 0.88))));
    // --p zmienia się w każdej klatce całej sceny, a czytają je tylko gwiazdy - zapis na niebie zamiast na całym
    // przypiętym bloku (wydajność, 2026-10-05: bez przeliczania stylów zegara, rozmowy i skrzynki co klatkę)
    setVar(sky.current ?? el, '--p', p.toFixed(4));
    setVar(el, '--dim', seg(p, 0.15, 0.24).toFixed(4));
    setVar(el, '--dawn', seg(p, 0.72, 0.9).toFixed(4));
    setVar(el, '--say', lin(p, 0.44, 0.57).toFixed(4));
    setFlag(el, 'data-talk', p >= 0.19);
    const [m0, m1, m2, m3] = lines.current;
    setState(m0, p >= 0.22 ? 'on' : 'off');
    setBot(m1, p >= 0.43 ? 'on' : p >= 0.395 ? 'think' : 'off', p >= 0.43 && p < 0.58);
    setState(m2, p >= 0.605 ? 'on' : 'off');
    setBot(m3, p >= 0.655 ? 'on' : p >= 0.625 ? 'think' : 'off', p >= 0.655 && p < 0.7);
    setFlag(box.current?.querySelector('.ch-inbox'), 'data-on', p >= 0.88);
    setNarr(el, p, NARR_AT);
  }, !reduced);

  return (
    <section className="ch-sec ch-n" aria-labelledby="ch-n-h">
      <h2 id="ch-n-h" className="sr-only">{s.stepsAria}</h2>
      <div ref={pin} className="ch-n-pin">
        <div className="ch-n-stage">
          <div ref={sky} className="ch-n-sky" aria-hidden="true">
            {SKY.map(([x, y, size, o, d], i) => (
              <i key={i} className="ch-n-star" style={{ left: `${x}%`, top: `${y}%`, '--s': `${size}px`, '--o': o, '--d': d } as CSSProperties} />
            ))}
            <i className="ch-n-star ch-n-star-client" />
          </div>
          <div className="ch-n-horizon" aria-hidden="true"><i /><i /></div>

          <div className="container mx-auto px-6 ch-n-in">
            <p ref={clock} className="ch-n-clock" aria-hidden="true">{fmt(TALK)}</p>
            <p className="ch-n-status"><span>{s.status[0]}</span><Spark /><span>{s.status[1]}</span></p>
            <div className="ch-n-talk" data-sky="">
              <p className="ch-n-meta"><span className="ch-tag">{t.sample}</span><span>{s.firm}</span></p>
              <Line who="client" label={t.speakers.client} text={q1} refCb={(el) => { lines.current[0] = el; }} />
              <Line who="bot" label={t.speakers.assistant} text={a1} say refCb={(el) => { lines.current[1] = el; }} />
              <Line who="client" label={t.speakers.client} text={q2} refCb={(el) => { lines.current[2] = el; }} />
              <Line who="bot" label={t.speakers.assistant} text={a2} refCb={(el) => { lines.current[3] = el; }} />
            </div>
            <div ref={box} className="ch-n-box"><InboxCard t={t.inbox} values={s.inbox} on /></div>
            <Narr className="ch-n-narr" items={s.steps} label={s.stepsAria} />
          </div>
        </div>
      </div>
    </section>
  );
};
