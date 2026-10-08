'use client';

import { useEffect, useRef, useSyncExternalStore } from 'react';
import type { Locale } from '@/lib/i18n/locale';
import type { ChatbotsCopy } from '@/lib/i18n/uslugi/chatboty-ai';
import { clamp01, lin, seg, usePin, useReducedPref } from '../../_usluga/shared';
import { Narr, SectionHead, Spark, setNarr } from './talk';
import './glos.css'; // style sekcji „Głos” (prefiks ch-v-)

// 4. GŁOS - „Brzmi jak Twoja marka.” (praca równoległa, etap 3, chat 13, runda 2).
// Asystent nie jest sztampowym botem: mówi tonem i językiem firmy, a z klientem z zagranicy rozmawia po jego myśli.
// WYBÓR WŁAŚCICIELA 2026-10-04: „w głos wybieram języki” - zostaje VoiceTongues; VoiceTrade i VoiceDial (opisane
// niżej dla historii) są USUNIĘTE z kodu razem ze stylami i przełącznikiem - nie przywracać bez prośby.
// Wersje z rundy 2:
//   VoiceTrade   „Twoja branża” - TALIA czterech kart rozmów stoi w głębi (karty jedna za drugą, następne wystają
//                                 zza pierwszej i wychodzą za prawą krawędź ekranu). Wybór branży = ruch kamery:
//                                 wybrana karta wychodzi z głębi na przód, karty przed nią cofają się o jedno miejsce
//                                 (wszystkie jadą po jednym torze - mijają się dokładnie w tym samym położeniu, więc
//                                 nic się nie przenika). Na karcie z przodu gra rozmowa tej firmy i wypełnia się skrzynka.
//   VoiceDial    „Pokrętło”     - jedno pytanie i odpowiedź WIELKIM pismem na bębnie: trzy tony stoją na walcu
//                                 (bieżący z przodu, pozostałe w głębi, przygaszone). Suwak tonu obraca bęben,
//                                 przyciski języka podmieniają pytanie i odpowiedź.
//   VoiceTongues „Języki”       - przypięta scena: cztery pytania w czterech językach nadlatują ku gwieździe asystenta,
//                                 odpowiedzi wracają tymi samymi torami, a na końcu kamera odjeżdża i pary zwijają
//                                 się w cztery wiersze jednej skrzynki.
// Bez JS / ograniczony ruch: zwykłe bloki - rozmowy i odpowiedzi w stanie końcowym, narrator jako lista.
// Rozmowy to PRZYKŁADY (etykieta `sample`, wymyślone firmy) - okna prawdziwego czatu nie ruszamy.

type P = { t: ChatbotsCopy; locale: Locale };

/** Kod języka z nazwy w słowniku (atrybut lang dla czytników ekranu; nieznana nazwa = bez atrybutu). */
const LANG: Record<string, string> = { Polski: 'pl', English: 'en', Deutsch: 'de', 'Українська': 'uk' };

// ── „JĘZYKI” ─────────────────────────────────────────────────────────────────────────────────────────────────

/** Granice trzech zdań narratora, starty czterech pytań i czterech odpowiedzi w postępie sceny. */
const G_NARR = [0.04, 0.38, 0.7, 1] as const;
const G_Q = [0.05, 0.12, 0.19, 0.26], G_A = [0.4, 0.46, 0.52, 0.58];

type XY = [number, number];
/** Pomiar sceny (środki elementów względem sceny, bez transformacji): gwiazda, miejsce gwiazdy w skrzynce, pary,
    pytania, odpowiedzi i wiersze skrzynki. */
type Geo = { w: number; h: number; star: XY; dock: XY; pair: XY[]; q: XY[]; a: XY[]; row: XY[] };
type Nodes = { root: HTMLElement; star: HTMLElement; inbox: HTMLElement; pairs: HTMLElement[]; qs: HTMLElement[]; as: HTMLElement[]; rows: HTMLElement[]; lines: SVGPathElement[] };

const out3 = (x: number) => 1 - (1 - x) ** 3;
const px = (x: number) => `${x.toFixed(1)}px`;
const put = (el: HTMLElement | SVGElement | undefined, name: string, value: string) => {
  if (el && el.style.getPropertyValue(name) !== value) el.style.setProperty(name, value);
};

/** Klatka sceny „Języki”: położenia liczone z pomiaru, zapis wprost do DOM (zmienne CSS, atrybuty). */
const paint = (p: number, g: Geo, n: Nodes) => {
  const pull = seg(p, 0.72, 0.92), gone = 1 - lin(pull, 0.62, 1);
  // jedna kolumna (telefon, tablet): pary stoją jedna pod drugą - pytania nadlatują na przemian z lewej i z prawej
  const one = g.pair.length > 1 && Math.abs(g.pair[0][0] - g.pair[1][0]) < 40;
  put(n.root, '--gone', gone.toFixed(3));
  n.pairs.forEach((pair, i) => {
    const H = g.q[i], A = g.a[i];
    // 1. pytanie nadlatuje ze swojej strony ku gwieździe i staje w swojej ćwiartce
    const qi = out3(lin(p, G_Q[i], G_Q[i] + 0.12));
    const sx = one ? (i % 2 ? 1 : -1) : Math.sign(H[0] - g.star[0]) || 1;
    const sy = one ? 0 : Math.sign(H[1] - g.star[1]) * 0.45;
    put(n.qs[i], '--x', px((1 - qi) * sx * g.w * 0.62));
    put(n.qs[i], '--y', px((1 - qi) * sy * g.h * 0.5));
    put(n.qs[i], '--s', (1 + (1 - qi) * 0.4).toFixed(4));
    put(n.qs[i], '--o', clamp01(qi * 2.4).toFixed(3));
    // 2. odpowiedź wraca tym samym torem: od gwiazdy do pytania
    const ai = seg(p, G_A[i], G_A[i] + 0.1);
    put(n.as[i], '--x', px((1 - ai) * (g.star[0] - A[0])));
    put(n.as[i], '--y', px((1 - ai) * (g.star[1] - A[1])));
    put(n.as[i], '--s', (0.2 + ai * 0.8).toFixed(4));
    put(n.as[i], '--o', clamp01(ai * 3).toFixed(3));
    // 3. kamera odjeżdża: para zwija się do swojego wiersza w skrzynce
    put(pair, '--x', px(pull * (g.row[i][0] - g.pair[i][0])));
    put(pair, '--y', px(pull * (g.row[i][1] - g.pair[i][1])));
    put(pair, '--s', (1 - pull * 0.64).toFixed(4));
    put(pair, '--o', gone.toFixed(3));
    put(n.rows[i], '--o', seg(p, 0.86 + i * 0.015, 0.93 + i * 0.015).toFixed(3));
    // tor pytania: rysuje się razem z nadlatującym pytaniem, po odpowiedzi świeci kolorem podstrony
    const ln = n.lines[i];
    if (ln) { put(ln, '--d', (1 - qi).toFixed(4)); ln.toggleAttribute('data-on', ai > 0.98); }
  });
  // gwiazda: myśli przed odpowiedziami, mówi w ich trakcie, na końcu ląduje przy tytule skrzynki
  put(n.star, '--x', px(pull * (g.dock[0] - g.star[0])));
  put(n.star, '--y', px(pull * (g.dock[1] - g.star[1])));
  put(n.star, '--s', (1 - pull * 0.6).toFixed(4));
  const state = p >= 0.4 && p < 0.69 ? 'speak' : p >= 0.31 && p < 0.4 ? 'think' : 'idle';
  if (n.star.dataset.state !== state) n.star.dataset.state = state;
  // skrzynka wschodzi razem z odjazdem kamery (wcześniej zasłaniałaby dolne pary)
  const box = seg(p, 0.72, 0.84);
  put(n.inbox, '--o', box.toFixed(3));
  put(n.inbox, '--y', px((1 - box) * 26));
  n.inbox.toggleAttribute('data-on', p >= 0.93);
};

/** Niski ekran (telefon bokiem): scena bez przypięcia, jak przy ograniczonym ruchu. */
const TALL = '(min-height: 521px)';
const subTall = (cb: () => void) => {
  const m = window.matchMedia(TALL);
  m.addEventListener('change', cb);
  return () => m.removeEventListener('change', cb);
};
const useTall = () => useSyncExternalStore(subTall, () => window.matchMedia(TALL).matches, () => true);

export const VoiceTongues = ({ t, locale }: P) => {
  const reduced = useReducedPref();
  const tall = useTall();
  const on = !reduced && tall;
  const pin = useRef<HTMLDivElement>(null);
  const geo = useRef<Geo | null>(null);
  const nodes = useRef<Nodes | null>(null);
  const last = useRef(0);
  const v = t.voice, langs = v.dial.langs;

  usePin(pin, (p, el) => {
    last.current = p;
    setNarr(el, p, G_NARR);
    if (geo.current && nodes.current) paint(p, geo.current, nodes.current);
  }, on);

  // pomiar sceny: przy starcie, zmianie rozmiaru i po wczytaniu fontów (transformacje na czas pomiaru zdjęte w CSS)
  useEffect(() => {
    const el = pin.current;
    if (!el || !on) return;
    const scene = el.querySelector<HTMLElement>('.ch-v-g-scene'), field = el.querySelector<HTMLElement>('.ch-v-g-field');
    const star = el.querySelector<HTMLElement>('.ch-v-g-star'), dock = el.querySelector<HTMLElement>('.ch-v-g-dock');
    const inbox = el.querySelector<HTMLElement>('.ch-v-g-inbox');
    if (!scene || !field || !star || !dock || !inbox) return;
    const all = <T extends Element>(sel: string) => Array.from(el.querySelectorAll<T>(sel));
    const n: Nodes = {
      root: el, star, inbox,
      pairs: all<HTMLElement>('.ch-v-g-pair'), qs: all<HTMLElement>('.ch-v-g-q'), as: all<HTMLElement>('.ch-v-g-a'),
      rows: all<HTMLElement>('.ch-v-g-row'), lines: all<SVGPathElement>('.ch-v-g-web path'),
    };
    nodes.current = n;
    let dead = false;
    const measure = () => {
      if (dead) return;
      el.setAttribute('data-measure', '');
      // rozmowy wyższe niż pole sceny (niski telefon): pismo pola maleje, najwyżej o jedną piątą
      el.style.setProperty('--fit', '1');
      const need = field.scrollHeight, room = field.clientHeight;
      if (need > room + 1) el.style.setProperty('--fit', Math.max(0.8, room / need).toFixed(3));
      const b = scene.getBoundingClientRect();
      const mid = (x: Element): XY => { const r = x.getBoundingClientRect(); return [r.left - b.left + r.width / 2, r.top - b.top + r.height / 2]; };
      const g: Geo = { w: b.width, h: b.height, star: mid(star), dock: mid(dock), pair: n.pairs.map(mid), q: n.qs.map(mid), a: n.as.map(mid), row: n.rows.map(mid) };
      el.removeAttribute('data-measure');
      geo.current = g;
      n.lines.forEach((ln, i) => {
        if (g.q[i]) ln.setAttribute('d', `M${g.q[i][0].toFixed(1)} ${g.q[i][1].toFixed(1)}L${g.star[0].toFixed(1)} ${g.star[1].toFixed(1)}`);
      });
      paint(last.current, g, n);
    };
    const ro = new ResizeObserver(measure);
    ro.observe(scene);
    measure();
    document.fonts?.ready.then(measure).catch(() => {});
    return () => { dead = true; ro.disconnect(); nodes.current = null; geo.current = null; };
  }, [on]);

  return (
    <section className="ch-sec ch-v ch-v-tongues" aria-labelledby="ch-v-h">
      <div className="container mx-auto px-6">
        <SectionHead id="ch-v-h" title={v.title} accent={v.titleAccent} lead={v.lead} />
      </div>
      <div ref={pin} className="ch-v-g-pin">
        <div className="ch-v-g-stage">
          <div className="container mx-auto px-6 ch-v-g-in">
            <div className="ch-v-g-scene">
              <div className="ch-v-g-field" data-sky="">
                <svg className="ch-v-g-web" aria-hidden="true" focusable="false">
                  {langs.map((x) => <path key={x.name} pathLength={1} />)}
                </svg>
                <span className="ch-tag ch-v-g-tag">{t.sample}</span>
                <Spark className="ch-v-g-star" />
                {langs.map((x, i) => (
                  <div key={x.name} className="ch-v-g-pair" data-side={i % 2 ? 'r' : 'l'} lang={LANG[x.name]}>
                    <div className="ch-v-g-q">
                      <span className="ch-v-g-name">{x.name}</span>
                      <p className="ch-v-bub" data-who="client"><span className="sr-only" lang={locale}>{t.speakers.client}: </span>{x.q}</p>
                    </div>
                    <div className="ch-v-g-a">
                      <p className="ch-v-bub" data-who="bot"><span className="sr-only" lang={locale}>{t.speakers.assistant}: </span>{x.a}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="ch-inbox ch-lit ch-v-g-inbox" data-on="">
                <p className="ch-inbox-t"><i className="ch-v-g-dock" aria-hidden="true" />{t.inbox.title}</p>
                <ol className="ch-v-g-rows">
                  {langs.map((x) => (
                    <li key={x.name} className="ch-v-g-row">
                      <span>{x.name}</span>
                      <span lang={LANG[x.name]}>{x.q}</span>
                    </li>
                  ))}
                </ol>
              </div>
              <Narr className="ch-v-g-narr" items={v.steps} label={v.stepsAria} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
