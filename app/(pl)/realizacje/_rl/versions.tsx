'use client';

import { useCallback, useEffect, useRef, type CSSProperties } from 'react';
import { useLenis } from 'lenis/react';
import { SectionLabel } from '@/components/ui/SectionLabel';
import type { RealizacjeDict, WorkItem } from '@/lib/i18n/projects';
import type { Locale } from '@/lib/i18n/locale';
import { CardText, NextCard, ProjectCard, ProjectFrame, nn, type Project } from './cards';
import { setPage } from './frame';
import { pickSky, scrollFrac, sda, trackLenis } from './shared';

// Lista /realizacje - wybór właściciela (2026-09-30): PLANSZE („realizacja plansze”; Przelot, Głębia jako osobna wersja,
// Najazd, Sekwencja i Orbita usunięte). Każda realizacja zaczyna się wielką nazwą jak plansza tytułowa; kamera odjeżdża,
// nazwa maleje w górny róg (plansze na przemian po lewej i po prawej), od dołu wjeżdża kadr ze stroną klienta, dochodzi
// opis, strona klienta przewija się w kadrze. Po ostatniej planszy widok z głębi: siatka wszystkich realizacji z kartą
// „Twoja firma może być następna” - karty wstają z głębi, kompozycja siatki stoi („bez shiftu kompozycji”).
// Ruch liczony z przewijania (transformacje pisane w JS tylko przy zmianie, bez layoutu). Ograniczony ruch: zwykłe rzędy
// bez ruchu (Rows). Bez JS (brak .rl[data-live]): plansze jako zwykła lista, pod nią siatka. Filtr kategorii działa tylko
// w siatce „Wszystkie realizacje” i pojawia się razem z nią (runda 7, właściciel).

export type VProps = {
  items: WorkItem[]; all: WorkItem[]; projects: Project[]; t: RealizacjeDict; locale: Locale; reduced: boolean;
};

export const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
export const smooth = (a: number, b: number, v: number) => { const x = clamp01((v - a) / (b - a)); return x * x * (3 - 2 * x); };
export const proj = (projects: Project[], slug: string) => projects.find((p) => p.slug === slug)!;
const wideMQ = '(min-width: 1024px)';

/** Wywołuje fn przy przewijaniu / zmianie rozmiaru (fn z refa - bez ponownej rejestracji). Przy Lenisie w JEGO klatce
    (lenis.on('scroll') - bez spóźnienia o klatkę względem przewijania), razem z ułamkową pozycją (scrollFrac w pinned /
    Depth): końcówka wygładzonego przewinięcia jest płynna, a nie ząbkowata (runda 12). Bez Lenisa: scroll + rAF. */
export const useScrollLoop = (fn: () => void, on: boolean, deps: unknown[]) => {
  const fnRef = useRef(fn);
  fnRef.current = fn;
  const lenis = useLenis();
  useEffect(() => {
    if (!on) return;
    trackLenis(lenis);
    let raf = 0;
    const tick = () => { raf = 0; fnRef.current(); };
    const kick = () => { if (!raf) raf = requestAnimationFrame(tick); };
    const sync = () => { cancelAnimationFrame(raf); raf = 0; fnRef.current(); };
    kick();
    const late = window.setTimeout(kick, 400); // po wczytaniu obrazów / fontów
    const off = lenis ? lenis.on('scroll', sync) : null;
    if (!lenis) window.addEventListener('scroll', kick, { passive: true });
    window.addEventListener('resize', kick);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(late);
      off?.();
      window.removeEventListener('scroll', kick);
      window.removeEventListener('resize', kick);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [on, lenis, ...deps]);
};

export const put = (el: HTMLElement | null, transform: string, opacity?: number) => {
  if (!el) return;
  if (el.style.transform !== transform) el.style.transform = transform;
  if (opacity !== undefined) { const o = opacity.toFixed(3); if (el.style.opacity !== o) el.style.opacity = o; }
};

/** Położenie refleksu szkła „Refleks” (--q 0-1 na kadrze / planszy) - zapis tylko przy zmianie. */
const putQ = (el: HTMLElement | null, q: number) => {
  if (!el) return;
  const v = q.toFixed(3);
  if (el.style.getPropertyValue('--q') !== v) el.style.setProperty('--q', v);
};

/** Postęp przypiętej sekcji 0-1 (0 = scena dopiero się przykleiła, 1 = zaraz odjedzie). */
const pinned = (sec: HTMLElement, stage: HTMLElement) => {
  const r = sec.getBoundingClientRect();
  const y = r.top - scrollFrac(); // ułamkowe położenie (bez schodków na końcu przewinięcia)
  const top = parseFloat(getComputedStyle(stage).top) || 0;
  return { p: clamp01((top - y) / Math.max(1, r.height - stage.offsetHeight)), visible: r.bottom > 0 && r.top < window.innerHeight };
};

// ── Widok z głębi: siatka wszystkich realizacji po planszach ─────────────────────────────────────
/** Siatka 3 kolumn (2 na tablecie, 1 na telefonie); karty wstają z głębi - pochylone w tył jak plansze na stole,
    prostują się, gdy dojadą do ~60% ekranu. Kolumny stoją równo (bez paralaksy). */
const Depth = ({ items, all, projects, t, locale, reduced }: VProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const n = items.length;
  const s3 = (3 - (n % 3)) % 3, s2 = n % 2;
  useScrollLoop(() => {
    const grid = ref.current;
    if (!grid) return;
    const vh = window.innerHeight;
    const f = scrollFrac();
    grid.querySelectorAll<HTMLElement>('.rl-dg-cell').forEach((cell) => {
      const r = cell.getBoundingClientRect();
      if (r.bottom < -200 || r.top > vh + 200) return;
      const top = r.top - f;
      // 1 = karta dopiero wchodzi od dołu (pochylona w głąb), 0 = stoi (gdy jej górna część minęła 62% ekranu)
      const vi = smooth(0.58, 1.04, (top + Math.min(r.height, vh) * 0.3) / vh);
      put(cell.firstElementChild as HTMLElement, `translate3d(0, ${(vi * 120).toFixed(1)}px, ${(-vi * 260).toFixed(1)}px) rotateX(${(vi * 24).toFixed(2)}deg)`, 1 - vi * 0.8);
      putQ(cell, clamp01(1 - (top + r.height / 2) / vh));
    });
  }, !reduced, [items]);

  return (
    <div className="container mx-auto px-6">
      <div ref={ref} className="rl-grid rl-dg">
        {items.map((w, k) => (
          <div key={w.slug} className="rl-dg-cell" data-col={k % 3}>
            <ProjectCard item={w} project={proj(projects, w.slug)} num={all.indexOf(w) + 1} t={t} locale={locale} size="sm" style={{ '--i': k % 3 } as CSSProperties} />
          </div>
        ))}
        {/* „Twoja firma może być następna” zawsze na końcu: w wolnym miejscu ostatniego rzędu albo w nowym rzędzie */}
        <div className="rl-dg-cell rl-dg-next" data-col={n % 3} data-s3={s3} data-s2={s2}>
          <NextCard t={t} locale={locale} num={all.length + 1} size="sm" style={{ '--i': n % 3 } as CSSProperties} />
        </div>
      </div>
    </div>
  );
};


// ── Ograniczony ruch: realizacja w rzędzie (kadr i tekst na przemian), bez ruchu ──────────────────
export const Rows = ({ items, all, projects, t, locale }: VProps) => (
  <div className="rl-nj container mx-auto px-6">
    {items.map((w, k) => (
      <ProjectCard
        key={w.slug} id={workAnchor(w.slug)} item={w} project={proj(projects, w.slug)} num={all.indexOf(w) + 1} t={t} locale={locale}
        size="lg" scope className={`rl-nj-row${k % 2 ? ' rl-nj-row--flip' : ''}`}
      />
    ))}
  </div>
);

// ── PLANSZE ─────────────────────────────────────────────────────────────────────────────────────
const longest = (s: string) => Math.max(...s.split(' ').map((w) => w.length));
/** Długa jednowyrazowa nazwa: miejsce łamania na telefonie (bez łącznika, <wbr>) - nazwa na planszy może być wtedy
    większa (runda 14). Na szerszych ekranach mieści się w jednej linijce i się nie łamie. */
const BREAK: Record<string, number> = { mcentrumfizjoterapia: 8 };
const nameParts = (w: WorkItem) => {
  const at = BREAK[w.slug];
  return at && !w.name.includes(' ') && w.name.length > at ? [w.name.slice(0, at), w.name.slice(at)] : null;
};
/** Kotwica realizacji (plansza / rząd) - nagłówek przewija do niej (spis, konstelacja). */
export const workAnchor = (slug: string) => `rl-w-${slug}`;
/** Faza przewijania strony klienta w kadrze (postęp planszy); CSS: animation-range w realizacje.css (contain 42% - 98%). */
const PAGE_FROM = 0.42, PAGE_TO = 0.98;

/** Przewija do realizacji: na planszy do postępu `at` (domyślnie 0,5 = kadr i opis już stoją, przed przewijaniem strony
    w kadrze; 0,02 = początek planszy, nazwa stoi wielka). */
export const scrollToWork = (slug: string, go: (y: number) => void, at = 0.5) => {
  const el = document.getElementById(workAnchor(slug));
  if (!el) return;
  const r = el.getBoundingClientRect();
  const top = window.scrollY + r.top;
  const pin = el.classList.contains('rl-pl') && el.offsetHeight > window.innerHeight * 1.2;
  go(pin ? top + (el.offsetHeight - window.innerHeight) * at : top - 110);
};

const Plate = ({ w, all, projects, t, locale, i, flip }: { w: WorkItem; all: WorkItem[]; projects: Project[]; t: RealizacjeDict; locale: Locale; i: number; flip: boolean }) => {
  const secRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const inRef = useRef<HTMLDivElement>(null);
  const grpRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const project = proj(projects, w.slug);
  const parts = nameParts(w);
  const geo = useRef({ y0: 0, s1: 0.3, down: 600 });

  // Geometria: kompozycja końcowa (nazwa + kadr i opis) stoi WYŚRODKOWANA w pionie między nawigacją a dołem ekranu
  // (runda 7, właściciel: „spacing feels off”); nazwa zaczyna wielka, wyśrodkowana na ekranie, i kończy w górnym rogu
  // tej kompozycji (co druga plansza w prawym) w rozmiarze ~40 px (tablet 34 px, telefon 30 px).
  useEffect(() => {
    const box = inRef.current, grp = grpRef.current, title = titleRef.current;
    if (!box || !grp || !title) return;
    const measure = () => {
      const nameEl = title.querySelector<HTMLElement>('.rl-pl-name');
      const fs = nameEl ? parseFloat(getComputedStyle(nameEl).fontSize) : 120;
      const final = window.matchMedia(wideMQ).matches ? 40 : window.matchMedia('(min-width: 640px)').matches ? 34 : 30;
      const s1 = Math.min(1, final / fs);
      const th = title.offsetHeight;
      const cs = getComputedStyle(box);
      const inner = box.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
      // start: środek nazwy na środku ekranu (lekko nad środkiem, jak plansza tytułowa)
      geo.current = { y0: box.clientHeight * 0.47 - th / 2 - grp.offsetTop, s1, down: inner };
      box.style.setProperty('--tf', `${Math.round(th * s1)}px`);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(box);
    ro.observe(grp);
    ro.observe(title);
    document.fonts?.ready.then(measure);
    return () => ro.disconnect();
  }, []);

  useScrollLoop(() => {
    const sec = secRef.current, stage = stageRef.current;
    if (!sec || !stage) return;
    const { p: q, visible } = pinned(sec, stage);
    if (!visible) return;
    const { y0, s1, down } = geo.current;
    const a = smooth(0.04, 0.4, q);
    put(titleRef.current, `translate3d(0, ${((1 - a) * y0).toFixed(1)}px, 0) scale(${(1 - a * (1 - s1)).toFixed(4)})`);
    // numer i rodzaj nad nazwą gasną, gdy nazwa maleje w róg
    const meta = titleRef.current?.querySelector<HTMLElement>('.rl-pl-meta');
    if (meta) { const o = clamp01(1 - a * 1.6).toFixed(3); if (meta.style.opacity !== o) meta.style.opacity = o; }
    putQ(sec, q);
    const body = bodyRef.current;
    if (body) {
      const fr = body.querySelector<HTMLElement>('.rl-pl-fr');
      // kadr wjeżdża od dołu i od swojej strony (co druga plansza z prawej)
      put(fr, `translate3d(${((1 - a) * (flip ? 72 : -72)).toFixed(1)}px, ${((1 - a) * down * 0.85).toFixed(1)}px, 0) scale(${(0.72 + a * 0.28).toFixed(4)})`, smooth(0.08, 0.28, q));
      put(body.querySelector<HTMLElement>('.rl-pl-tx'), `translate3d(0, ${((1 - smooth(0.3, 0.48, q)) * 40).toFixed(1)}px, 0)`, smooth(0.3, 0.48, q));
      // strona klienta w kadrze: przy sda() przesuwa ją CSS na osi przewijania planszy (płynnie, bez opóźnienia JS)
      if (fr && !sda()) setPage(fr.querySelector('.rl-frame'), smooth(PAGE_FROM, PAGE_TO, q));
    }
  }, true, [flip]);

  return (
    <section ref={secRef} id={workAnchor(w.slug)} className="rl-pin rl-pl" data-flip={flip ? '' : undefined} style={{ '--ac': w.accent } as CSSProperties} aria-label={w.name}>
      <div ref={stageRef} className="rl-pin-stage">
        <div ref={inRef} className="rl-pin-in rl-pl-in container mx-auto px-6">
          <div ref={grpRef} className="rl-pl-grp">
            <div ref={titleRef} className="rl-pl-title" style={{ '--len': longest(w.name), '--len-s': parts ? Math.max(...parts.map((s) => s.length)) : longest(w.name) } as CSSProperties}>
              <p className="rl-pl-meta"><span className="rl-card-num">{nn(all.indexOf(w) + 1)}</span><span>{w.kind}</span></p>
              <h3 className="rl-pl-name">{parts ? <>{parts[0]}<wbr />{parts[1]}</> : w.name}</h3>
            </div>
            <div ref={bodyRef} className="rl-pl-body">
              <div className="rl-pl-fr"><ProjectFrame item={w} project={project} t={t} size="lg" manual anim="none" eager={i < 1} locale={locale} /></div>
              <div className="rl-pl-tx">
                <CardText item={w} project={project} num={all.indexOf(w) + 1} t={t} locale={locale} scope stretch={false} big head={false} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

/** Plansze wszystkich realizacji, na przemian po lewej i po prawej (filtr działa dopiero w „Wszystkie realizacje”). */
export const Plates = (props: VProps) => (
  <div className="rl-pls">
    {props.items.map((w, i) => (
      <Plate key={w.slug} w={w} i={i} flip={i % 2 === 1} all={props.all} projects={props.projects} t={props.t} locale={props.locale} />
    ))}
  </div>
);

/** „Wszystkie realizacje”: etykieta, siatka z głębi (filtr wstawia rodzic nad siatką). Gwiazdki i linie etykiety w kolorze
    realizacji, wokół której świeci mgławica (kadr z data-sky najbliżej środka okna; „Twoja firma może być następna” =
    kolor marki). Runda 15, właściciel: „badge z gwiazdkami też niech zmienia kolor z niebieskiego”. Przejście koloru
    w CSS (--rl-lc, @property). Od 2026-10-05 bez pierwszeństwa karty pod kursorem - mgławica nie reaguje już na kursor
    (właściciel: „z realizacji też usuń”), więc etykieta idzie za tym samym kadrem co ona. */
export const AllLabel = ({ t, id }: { t: RealizacjeDict; id: string }) => {
  const ref = useRef<HTMLHeadingElement>(null);
  const last = useRef<Element | null>(null);
  const update = useCallback(() => {
    const lab = ref.current;
    if (!lab) return;
    const vh = window.innerHeight;
    const lr = lab.getBoundingClientRect();
    if (lr.top > vh * 2.5 || lr.bottom < -vh * 0.5) return; // daleko od ekranu - nic nie liczymy
    const best = pickSky(null)?.el;
    if (!best || best === last.current) return;
    last.current = best;
    const ac = getComputedStyle(best).getPropertyValue('--ac').trim();
    if (ac) lab.style.setProperty('--rl-la', ac);
  }, []);
  useScrollLoop(update, true, []);
  // filtr kategorii podmienia karty bez przewijania - po kliknięciu na stronie przeliczamy raz (bez nasłuchu ruchu myszy)
  useEffect(() => {
    let t1 = 0, t2 = 0;
    const onClick = () => {
      window.clearTimeout(t1); window.clearTimeout(t2);
      t1 = window.setTimeout(update, 60); t2 = window.setTimeout(update, 600);
    };
    document.addEventListener('click', onClick, { passive: true });
    return () => { window.clearTimeout(t1); window.clearTimeout(t2); document.removeEventListener('click', onClick); };
  }, [update]);
  return (
    <div className="rl-pls-all container mx-auto px-6">
      <h2 ref={ref} id={id} className="im-label rl-label"><SectionLabel>{t.allTitle}</SectionLabel></h2>
    </div>
  );
};
export { Depth };
