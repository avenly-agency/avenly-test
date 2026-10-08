'use client';

import { useCallback, useEffect, useRef, type CSSProperties } from 'react';
import { Check } from 'lucide-react';
import type { LeadCopy } from '@/lib/i18n/uslugi/system-crm-lead';
import { Steps } from '../../_usluga/parts';
import { clamp01, useFrame, useReducedPref } from '../../_usluga/shared';
import { CHANNELS, CHANNEL_ICON, Reel, clearSteps, flag, narrate, put, stepsOf, wipe } from './lead-kit';
import { SecHead, offsetTo } from './scene';
import type { SceneProps } from './types';
import { Av, Win } from './ui';
import './lead.css';

// SEKCJA „NIC JUŻ NIE GINIE”, wersja „KANAŁY” (wybrana przez właściciela 2026-10-05) - BEZ PRZYPIĘCIA (sąsiednie
// sekcje są przypięte). Uniwersalny obraz każdego CRM: zapytania z trzech źródeł wpływają do jednej listy, a każde
// od razu dostaje osobę, termin i potwierdzenie.
// UKŁAD: od 1024 px pas torów obok okna (źródła jako karty na torach, z toru odgałęzienie do wiersza). Telefon
// i tablet (dostosowanie do urządzeń mobilnych, 2026-10-05) - układ pod pion: trzy karty źródeł u góry, z każdej tor
// schodzi do górnej krawędzi okna, lista ma całą szerokość, a kanał wiersza pokazuje jego znaczek. Wszystko w CSS.
// WSZYSTKO POJAWIA SIĘ ROZEJŚCIEM (.cr-bloom, bloom.css) - bez linii światła, kurtyn i przycięć prostą krawędzią.
// ODSŁONY GRAJĄ NA CZAS, NIE Z POŁOŻENIA PRZEWIJANIA (właściciel 2026-10-05: „chcę, żeby te animacje co są reveal
// nie było sytuacji, kiedy użytkownik już zescrollował i widzi cały element, a część nie jest revealed na dole”):
//   - element startuje, gdy WEJDZIE na ekran, i gra sam do końca (przejście CSS zmiennej --bloom); zatrzymanie
//     przewijania w dowolnym miejscu nie zostawia niczego odsłoniętego w połowie,
//   - nigdy wstecz: raz odsłonięty zostaje odsłonięty; to, co po przeskoku jest już nad ekranem, pojawia się od razu
//     (bez animacji), to, co na ekranie - z animacją,
//   - źródła, tory i nagłówek okna: gdy ich górna krawędź minie ENTER wysokości okna przeglądarki,
//   - wiersz: gdy cały znajdzie się nad narratorem (zapas GAP / GAP_PHONE) - narrator stoi przy dole ekranu, więc
//     dopiero wtedy wiersz widać w całości i nic nie odsłania się pod zdaniem narratora. Ostatni wiersz rusza więc
//     dokładnie wtedy, gdy dół okna dochodzi do narratora. Po wierszu, z opóźnieniami z CSS, osoba, termin
//     i potwierdzenie. Gdy narrator NIE jest przyklejony (bardzo niski ekran, np. telefon poziomo - decyduje CSS,
//     scena czyta to z pomiaru), wiersz startuje jak reszta: gdy jego górna krawędź minie ENTER.
// Okno wygląda na domknięte w każdej chwili: nie ma jednej płyty - nagłówek (pasek firmy + „Zapytania”) to okno
// z `Win`, a każdy wiersz niesie własny kawałek; zaokrąglony dół ma zawsze ostatni odsłonięty kawałek (data-open na
// układzie, data-end na wierszu). Licznik „Zapytania” to bęben.
// Narrator (trzy zdania) idzie z położenia przewijania: jedno zdanie naraz, przyklejone do dołu ekranu w kolumnie
// okna; pojawia się, gdy nagłówek okna jest już nad nim, na końcu sekcji odkleja się i zostaje pod oknem.
// Scena mierzy położenia elementów w układzie i pas narratora tylko po zmianie rozmiaru (offsetTo, ResizeObserver),
// w klatce czyta jeden prostokąt. Czasy i opóźnienia odsłon są w lead.css (blok „Kanały”, przejścia --bloom);
// progi wejścia - stałe niżej.
// Atrybuty: data-on (element wystartował - CSS ustawia --bloom: 1), data-bloomed (koniec - maska zdjęta; żadna maska
// nie zostaje na stałe), --wait na wierszu (odstęp, gdy kilka wierszy startuje w tej samej klatce); --nv, --cn.
// Bez JS / ograniczony ruch: zwykła sekcja - komplet wierszy z osobami i terminami, zdania jako lista.

/** Wejście elementu: jego górna krawędź mija tę część wysokości okna przeglądarki (źródła, tory, nagłówek okna;
    także wiersze, gdy narrator nie jest przyklejony). */
const ENTER = 0.92;
/** Wejście wiersza przy narratorze przyklejonym do dołu: cały wiersz jest tyle px nad górną krawędzią narratora.
    Telefon ma mniejszy zapas - narrator zajmuje tam większą część ekranu, a pusty pas nad nim ma być krótki. */
const GAP = 16, GAP_PHONE = 8;
/** Szerokość okna przeglądarki, poniżej której obowiązuje zapas telefonu (ten sam próg w lead.css). */
const PHONE = 640;
/** Kilka wierszy uruchomionych w tej samej klatce (szybkie przewinięcie): kolejne ruszają z takim odstępem (s). */
const STAGGER = 0.12;
/** Zapasowe zdjęcie maski (ms od startu), gdyby przeglądarka nie zgłosiła końca przejścia --bloom. */
const SAFE_MS = 2600;
/** Narrator pojawia się na takim odcinku (px), gdy jego górna krawędź mija górę pierwszego wiersza. */
const NARR_IN = 60;
/** Pasek ostatniego zdania narratora kończy się tyle px po uruchomieniu ostatniego wiersza. */
const TAIL = 160;

interface Head { el: HTMLElement; top: number; bottom: number; on: boolean }
/** `at` = krawędź wiersza, która musi minąć linię startu: dolna przy narratorze przyklejonym, górna bez niego. */
interface Row { li: HTMLElement; parts: HTMLElement[]; top: number; bottom: number; at: number; on: boolean }
interface Geo {
  h: number;
  /** Narrator przyklejony do dołu ekranu (false = stoi w zwykłym układzie pod sceną). */
  sticky: boolean;
  /** Pas u dołu ekranu zajęty przez narratora: jego wysokość + odstęp od krawędzi + zapas (px). */
  band: number;
  first: number;
  heads: Head[]; rows: Row[]; cuts: number[]; count: number; timers: number[];
}

/** Start odsłony: data-on na `holder` włącza w CSS przejście --bloom jego części (`parts`). `instant` = element jest
    już nad ekranem - bez animacji, maska zdjęta od razu. Koniec przejścia zgłasza transitionend (niżej); czasomierz
    jest tylko zapasem. */
const reveal = (timers: number[], holder: HTMLElement, parts: HTMLElement[], instant: boolean, wait: number) => {
  const done = () => parts.forEach((el) => el.setAttribute('data-bloomed', ''));
  if (instant) done();
  else {
    if (wait > 0) holder.style.setProperty('--wait', `${wait.toFixed(2)}s`);
    timers.push(window.setTimeout(done, SAFE_MS + wait * 1000));
  }
  holder.setAttribute('data-on', '');
};

export const LeadChannels = ({ t, x, headId }: SceneProps<LeadCopy>) => {
  const b = x.inbox;
  const reduced = useReducedPref();
  const bodyRef = useRef<HTMLDivElement>(null);
  const flowRef = useRef<HTMLDivElement>(null);
  const narrRef = useRef<HTMLDivElement>(null);
  const geo = useRef<Geo | null>(null);
  const stepEls = useRef<HTMLElement[]>([]);
  const counts = Array.from({ length: b.rows.length + 1 }, (_, i) => String(i));

  const frame = useCallback((frac: number) => {
    const body = bodyRef.current, flow = flowRef.current, g = geo.current;
    if (!body || !flow || !g) return;
    const vh = window.innerHeight;
    const top = flow.getBoundingClientRect().top - frac;
    // linie w układzie sceny: górna krawędź ekranu, linia wejścia (dół ekranu z zapasem) i linia startu wierszy
    // (górna krawędź przyklejonego narratora z zapasem; bez przyklejonego narratora - linia wejścia)
    const sky = -top;
    const enterY = vh * ENTER - top;
    const lineY = g.sticky ? vh - g.band - top : enterY;
    // źródła, tory, nagłówek okna: start przy wejściu na ekran (to, co już nad ekranem - od razu)
    g.heads.forEach((u) => {
      if (u.on || u.top > enterY) return;
      u.on = true;
      reveal(g.timers, u.el, [u.el], u.bottom < sky, 0);
    });
    // wiersze: start, gdy wiersz minie linię startu; nigdy wstecz
    let fresh = 0, count = 0;
    g.rows.forEach((r) => {
      if (!r.on && r.at <= lineY) {
        r.on = true;
        const instant = r.bottom < sky;
        reveal(g.timers, r.li, r.parts, instant, instant ? 0 : fresh * STAGGER);
        if (!instant) fresh += 1;
      }
      if (r.on) count += 1;
    });
    if (count !== g.count) {
      g.count = count;
      // okno domknięte w każdej chwili: zaokrąglony dół ma ostatni uruchomiony wiersz (bez wierszy - nagłówek okna)
      g.rows.forEach((r, i) => flag(r.li, 'data-end', i === count - 1));
      flag(flow, 'data-open', count > 0);
      put(body, '--cn', String(count));
    }
    // narrator: pojawia się, gdy nagłówek okna jest już nad nim; zdania zmieniają się razem ze startem wierszy
    put(body, '--nv', g.sticky ? clamp01((lineY - g.first + NARR_IN / 2) / NARR_IN).toFixed(3) : '1');
    narrate(stepEls.current, lineY, g.cuts, g.h + TAIL);
  }, []);

  useEffect(() => {
    const body = bodyRef.current, flow = flowRef.current, narr = narrRef.current;
    if (!body || !flow || !narr) return;
    const headEls = Array.from(flow.querySelectorAll<HTMLElement>('.cr7-c-srcs, .cr7-c-rails, .cr7-c-win'));
    const rowEls = Array.from(flow.querySelectorAll<HTMLElement>('.cr7-c-row'));
    /** Części wiersza z własnym rozejściem: pole wiersza i trzy dopiski. */
    const parts = rowEls.map((li) => Array.from(li.querySelectorAll<HTMLElement>('.cr-bloom')));
    const steps = stepsOf(body);
    stepEls.current = steps;
    const timers: number[] = [];
    /** Zdejmuje wszystko, co scena zapisała - zostaje stan końcowy z CSS. */
    const reset = () => {
      timers.forEach((id) => window.clearTimeout(id));
      timers.length = 0;
      geo.current = null;
      wipe(body, ['--cn', '--nv']);
      flow.removeAttribute('data-open');
      [...headEls, ...rowEls].forEach((el) => wipe(el, ['--wait'], ['data-on', 'data-end']));
      [...headEls, ...parts.flat()].forEach((el) => el.removeAttribute('data-bloomed'));
      clearSteps(steps);
    };
    if (reduced) { reset(); return; }
    let alive = true;
    // koniec przejścia --bloom: maska zdjęta (odsłony nie cofają się, więc każdy koniec to koniec odsłony)
    const onEnd = (ev: TransitionEvent) => {
      const el = ev.target;
      if (ev.propertyName === '--bloom' && el instanceof HTMLElement && el.classList.contains('cr-bloom')) el.setAttribute('data-bloomed', '');
    };
    flow.addEventListener('transitionend', onEnd);
    const measure = () => {
      const h = flow.offsetHeight;
      if (!alive || h < 40) return;
      // narrator: przyklejony do dołu ekranu czy w zwykłym układzie (decyduje CSS - szerokość i wysokość ekranu)
      const cs = getComputedStyle(narr);
      const sticky = cs.position === 'sticky';
      const band = sticky ? narr.offsetHeight + (parseFloat(cs.bottom) || 0) + (window.innerWidth < PHONE ? GAP_PHONE : GAP) : 0;
      const box = (el: HTMLElement) => { const r = offsetTo(el, flow); return { top: r.y, bottom: r.y + r.h }; };
      const heads = headEls.map((el): Head => ({ el, ...box(el), on: el.hasAttribute('data-on') }));
      const rows = rowEls.map((li, i): Row => {
        const r = box(li);
        return { li, parts: parts[i], top: r.top, bottom: r.bottom, at: sticky ? r.bottom : r.top, on: li.hasAttribute('data-on') };
      });
      // zdania narratora zmieniają się, gdy ruszają kolejne wiersze (równo rozłożone po liście)
      const n = steps.length;
      const cuts = Array.from({ length: Math.max(0, n - 1) }, (_, s) => {
        const row = rows[Math.min(rows.length - 1, Math.round(((s + 1) * rows.length) / n))];
        return row ? row.at : h;
      });
      geo.current = { h, sticky, band, heads, rows, cuts, timers, first: rows.length ? rows[0].top : h, count: -1 };
      frame(0);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(flow); ro.observe(narr);
    document.fonts?.ready.then(measure).catch(() => {});
    // pierwszy pomiar biegnie, zanim korzeń podstrony dostanie data-live (narrator jest wtedy zwykłą listą) -
    // dwie klatki później mierzymy jeszcze raz, już na układzie „na żywo”
    let again = requestAnimationFrame(() => { again = requestAnimationFrame(measure); });
    return () => {
      alive = false;
      cancelAnimationFrame(again);
      ro.disconnect();
      flow.removeEventListener('transitionend', onEnd);
      reset();
    };
  }, [frame, reduced]);

  useFrame(frame, !reduced);

  return (
    <section className="cr-sec cr7-c" aria-labelledby={headId}>
      <div className="container mx-auto px-6">
        <SecHead id={headId} title={x.title} lead={x.lead} />
        <div ref={bodyRef} className="cr7-c-body">
          <div className="cr7-c-scene">
            <div ref={flowRef} className="cr7-c-flow">
              <ul className="cr7-c-srcs cr-bloom" aria-label={b.sourcesAria}>
                {CHANNELS.map((ch, k) => {
                  const Icon = CHANNEL_ICON[ch];
                  return (
                    <li key={ch} className="cr7-c-src" style={{ '--k': k } as CSSProperties}>
                      <span className="cr7-c-src-ico"><Icon aria-hidden="true" /></span>
                      <span>{x.channels[ch]}</span>
                    </li>
                  );
                })}
              </ul>
              {/* pas torów obok okna - tylko od 1024 px (na telefonie i tablecie tory wychodzą z kart źródeł) */}
              <div className="cr7-c-rails cr-bloom" aria-hidden="true">
                {CHANNELS.map((ch, k) => <i key={ch} style={{ '--k': k } as CSSProperties} />)}
              </div>
              {/* kolumna okna: nagłówek (okno z paskiem firmy) i lista pod nim; data-sky = blask mgławicy wokół całości */}
              <div className="cr7-c-col" data-sky="">
                <Win app={t.app} className="cr7-c-win cr-bloom">
                  <p className="cr7-c-h">
                    <span>{b.listTitle}</span>
                    <Reel items={counts} className="cr7-c-count" />
                  </p>
                </Win>
                <ol className="cr7-c-list" aria-label={b.listAria}>
                  {b.rows.map((row) => {
                    const Icon = CHANNEL_ICON[row.ch];
                    const who = t.team[row.who] ?? t.team[0];
                    return (
                      <li key={row.name} className="cr7-c-row" style={{ '--lane': Math.max(0, CHANNELS.indexOf(row.ch)) } as CSSProperties}>
                        {/* wiersz z własnym kawałkiem okna; od 1024 px pole rozejścia sięga w pas torów (węzeł i odgałęzienie) */}
                        <div className="cr7-c-seg cr-bloom">
                          <span className="cr7-c-branch" aria-hidden="true" />
                          <span className="cr7-c-node" aria-hidden="true" />
                          <div className="cr7-c-pane">
                            <span className="cr7-c-ico"><Icon aria-hidden="true" /></span>
                            <div className="cr7-c-msg">
                              <p className="cr7-c-top">
                                <b>{row.name}</b>
                                <span><span className="cr7-c-ch">{x.channels[row.ch]} · </span>{row.time}</span>
                              </p>
                              <p className="cr7-c-text">{row.text}</p>
                            </div>
                            <p className="cr7-c-auto">
                              <span className="cr7-c-who cr-bloom"><Av name={who.name} />{who.name}</span>
                              <span className="cr-chip cr7-c-due cr-bloom" data-fresh="">{row.due}</span>
                              <span className="cr7-c-done cr-bloom"><Check aria-hidden="true" />{row.done}</span>
                            </p>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </div>
            </div>
          </div>
          <div ref={narrRef} className="cr-narr cr7-narr cr7-c-narr" style={{ '--n': b.steps.length } as CSSProperties}>
            <Steps items={b.steps} label={t.film.stepsAria} />
          </div>
        </div>
      </div>
    </section>
  );
};
