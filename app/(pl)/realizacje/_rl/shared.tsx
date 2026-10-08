'use client';

import { useCallback, useEffect, useRef, useState, useSyncExternalStore, type CSSProperties, type ReactNode, type RefObject } from 'react';
import type Lenis from 'lenis';
import { useLenis } from 'lenis/react';

// Wspólne drobiazgi listy /realizacje i case study (praca równoległa, etap 2 - chat 5).

export const openChat = () => window.dispatchEvent(new Event('avenly:open-chat'));

const RM = '(prefers-reduced-motion: reduce)';
const subRM = (cb: () => void) => {
  const m = window.matchMedia(RM);
  m.addEventListener('change', cb);
  return () => m.removeEventListener('change', cb);
};
/** Ograniczony ruch (SSR i pierwszy render: false - stany „przed wejściem” i tak są tylko pod [data-live]). */
export const useReducedPref = () => useSyncExternalStore(subRM, () => window.matchMedia(RM).matches, () => false);

/** Stronę klienta w kadrze przesuwa CSS na osi przewijania (Chrome / Edge 115+, Safari 26) - tylko przy przewijaniu
    NATYWNYM (dotyk: Lenis nie wygładza dotyku), bo wtedy CSS jedzie w tej samej klatce co przewijanie. Przy kółku / gładziku
    przewija Lenis: płynnie, w ułamkach piksela, a przeglądarka przesuwa stronę o całe piksele - oś przewijania CSS dostaje
    te schodki i w efektach, które jadą szybciej niż strona (strona w kadrze ~3x), końcówka przewinięcia rwała się
    („ostatnie kilka ticków ząbkowate” - runda 12). Wtedy efekty liczy JS z ułamkowej pozycji Lenisa (scrollFrac)
    w jego klatce (lenis.on('scroll')). */
export const sda = () => typeof CSS !== 'undefined' && CSS.supports('animation-timeline: view()')
  && window.matchMedia('(pointer: coarse)').matches;

// ── Ułamkowa pozycja przewijania Lenisa ──────────────────────────────────────────────────────────
let lenisNow: Lenis | null = null;
/** Zapamiętuje instancję Lenisa (dla scrollFrac). */
export const trackLenis = (l: Lenis | null | undefined) => { if (l) lenisNow = l; };
/** Różnica między płynną (ułamkową) pozycją Lenisa a pozycją okna (całe piksele): `rect.top - scrollFrac()` =
    położenie elementu bez schodków na końcu wygładzonego przewinięcia. */
export const scrollFrac = () => (lenisNow ? lenisNow.animatedScroll - window.scrollY : 0);

/** `data-live` na korzeniu strony = JS działa (stany „przed wejściem” w CSS tylko pod nim; bez JS wszystko widać);
    `data-sda` = strony w kadrach przesuwa CSS (sda()). */
export const useLiveRoot = (ref: RefObject<HTMLElement | null>) => {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.setAttribute('data-live', '');
    if (sda()) el.setAttribute('data-sda', '');
    return () => { el.removeAttribute('data-live'); el.removeAttribute('data-sda'); };
  }, [ref]);
};

/** Kadr karty pod kursorem myszy (runda 16, właściciel: „hover tak samo niech zmienia kolor tła, tak jak jest w usługach”):
    element z data-sky w karcie, nad którą jest kursor (albo sam kadr planszy). */
export const skyOfTarget = (t: EventTarget | null): HTMLElement | null => {
  const el = (t as Element | null)?.closest?.('.rl .rl-card, .rl [data-sky]');
  if (!el) return null;
  return el.matches('[data-sky]') ? (el as HTMLElement) : el.querySelector<HTMLElement>('[data-sky]');
};

/** Kadr, wokół którego świeci mgławica (i w którego kolorze jest etykieta „Wszystkie realizacje”): karta pod kursorem,
    a bez niej kadr z data-sky najbliżej środka okna. */
export const pickSky = (hover: HTMLElement | null): { el: HTMLElement; r: DOMRect } | null => {
  const vh = window.innerHeight;
  if (hover && hover.isConnected) {
    const r = hover.getBoundingClientRect();
    if (r.width && r.bottom > 0 && r.top < vh) return { el: hover, r };
  }
  let best: { el: HTMLElement; r: DOMRect } | null = null, bd = Infinity;
  for (const el of document.querySelectorAll<HTMLElement>('.rl [data-sky]')) {
    const r = el.getBoundingClientRect();
    if (r.bottom < vh * 0.08 || r.top > vh * 0.92 || !r.width) continue;
    const d = Math.abs(r.top + r.height / 2 - vh / 2);
    if (d < bd) { bd = d; best = { el, r }; }
  }
  return best;
};

/** Wysokość widocznej nawigacji strony → `--rl-nav` (px) na korzeniu (runda 15, właściciel: filtr kategorii „wyżej, fixed,
    i niech się przesuwa, jak nawigacja się otwiera”). Nawigacja (zamrożona) chowa się przy przewijaniu w dół klasą
    `-translate-y-full` z przejściem 500 ms - śledzimy zmianę klasy, a przyklejony filtr przesuwa się w tym samym tempie
    (przejście `top` w realizacje.css). */
export const useNavOffset = (ref: RefObject<HTMLElement | null>) => {
  useEffect(() => {
    const root = ref.current;
    const nav = document.querySelector<HTMLElement>('body nav.fixed');
    if (!root || !nav) return;
    const sync = () => {
      const h = nav.classList.contains('-translate-y-full') ? 0 : nav.offsetHeight;
      const v = `${h}px`;
      if (root.style.getPropertyValue('--rl-nav') !== v) root.style.setProperty('--rl-nav', v);
    };
    sync();
    const mo = new MutationObserver(sync);
    mo.observe(nav, { attributes: true, attributeFilter: ['class'] });
    const ro = new ResizeObserver(sync);
    ro.observe(nav);
    return () => { mo.disconnect(); ro.disconnect(); root.style.removeProperty('--rl-nav'); };
  }, [ref]);
};

/** Kolejność wejścia jak w /uslugi (runda 13, właściciel: „zrób tak jak w /uslugi, że jest pitch black, potem pojawia się
    tło, potem tekst po kolei, potem reszta”): czerń → mgławica (onReady Sky = pierwsza klatka) → po TEXT_AFTER tekst po
    kolei (`data-go` na korzeniu: zdanie spod maski, opis, przyciski) → po CARDS_AFTER reszta (`data-cards`: kadry
    w nagłówku). Gdy shader się spóźnia, tekst rusza po FALLBACK_MS; ograniczony ruch - od razu. Zwraca onReady dla Sky. */
const TEXT_AFTER = 650, CARDS_AFTER = 750, FALLBACK_MS = 1500;
export const useIntro = (ref: RefObject<HTMLElement | null>) => {
  const goRef = useRef<() => void>(() => {});
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const timers: number[] = [];
    let started = false;
    const go = (delay: number) => {
      if (started) return;
      started = true;
      timers.push(window.setTimeout(() => root.setAttribute('data-go', ''), delay));
      timers.push(window.setTimeout(() => root.setAttribute('data-cards', ''), delay + CARDS_AFTER));
    };
    if (window.matchMedia(RM).matches) go(0);
    goRef.current = () => go(TEXT_AFTER);
    // mgławica mogła już zgłosić gotowość (brak WebGL / słabe urządzenie - efekt dziecka biegnie przed tym efektem)
    if (root.querySelector('.rl-sky-neb[data-ready], .rl-sky-neb[data-fail]')) go(TEXT_AFTER);
    timers.push(window.setTimeout(() => go(0), FALLBACK_MS));
    return () => { timers.forEach((t) => window.clearTimeout(t)); goRef.current = () => {}; };
  }, [ref]);
  return useCallback(() => goRef.current(), []);
};

/** Jednorazowe wejście: `data-in` na elemencie, gdy pokaże się na ekranie (część `amount`). */
export const useEnter = (ref: RefObject<HTMLElement | null>, amount = 0.25, deps: unknown[] = []) => {
  const [inView, setIn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.removeAttribute('data-in');
    setIn(false);
    const io = new IntersectionObserver((es) => {
      for (const e of es) {
        if (e.isIntersecting) {
          el.setAttribute('data-in', '');
          setIn(true);
          io.disconnect();
        }
      }
    }, { threshold: amount, rootMargin: '0px 0px -6% 0px' });
    io.observe(el);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, amount, ...deps]);
  return inView;
};

// ── Strona klienta przewija się w kadrze razem z przewijaniem strony ─────────────────────────────
// Tryby:
//   pass   - kadr w siatce: gdy przejeżdża przez ekran, strona klienta w środku przewija się od góry do dołu,
//   sticky - kadr przyklejony w wysokiej sekcji (case study): postęp = przewinięcie sekcji,
//   plate  - kadr na planszy: postęp liczy plansza (setPage() z jej pętli).
// Przewija Lenis (kółko / gładzik): liczymy w JEGO klatce (lenis.on('scroll'), bez spóźnienia o klatkę) z ułamkowej
// pozycji (scrollFrac) - końcówka wygładzonego przewinięcia jest płynna. Dotyk z sda(): przesuwa CSS na osi przewijania
// (realizacje.css, .rl[data-sda]), JS tylko mierzy drogę (--travel) i zakres (case study: --c0 / --c1). Bez Lenisa i bez
// sda(): nasłuch scroll + rAF. Transform pisany tylko przy zmianie, poza ekranem nic nie liczymy.

type LiveEntry = {
  view: HTMLElement; page: HTMLElement; host: HTMLElement | null; mode: 'pass' | 'sticky' | 'plate'; css: boolean;
  pageH: number; viewH: number; y: number;
  /** sticky: element przyklejony (data-rl-stick) - jego wysokość i odstęp od góry okna. */
  stick: HTMLElement | null; stickH: number; stickTop: number;
};
/** sticky: strona klienta przewija się SPEED razy szybciej niż strona (krótsza sekcja). */
const SPEED = 2;
const live = new Set<LiveEntry>();
let raf = 0;
const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const ease = (a: number, b: number, v: number) => { const x = clamp01((v - a) / (b - a)); return x * x * (3 - 2 * x); };

const tick = () => {
  raf = 0;
  const vh = window.innerHeight;
  const f = scrollFrac();
  for (const e of live) {
    if (e.css || e.mode === 'plate') continue;
    const travel = Math.max(0, e.pageH - e.viewH);
    if (!travel) continue;
    let p: number;
    if (e.mode === 'sticky' && e.host) {
      const r = e.host.getBoundingClientRect();
      if (r.bottom < -200 || r.top > vh + 200) continue;
      p = clamp01((e.stickTop - (r.top - f)) / Math.max(1, r.height - e.stickH));
    } else {
      const r = e.view.getBoundingClientRect();
      if (r.bottom < -200 || r.top > vh + 200) continue;
      p = ease(0.14, 0.86, (vh - (r.top - f)) / (vh + r.height));
    }
    const y = Math.round(-p * travel * 8) / 8;
    if (y !== e.y) { e.y = y; e.page.style.transform = `translate3d(0, ${y}px, 0)`; }
  }
};
const onScroll = () => { if (!raf) raf = requestAnimationFrame(tick); };
const onLenis = () => { cancelAnimationFrame(raf); tick(); };

/** Jeden wspólny nasłuch: Lenis (w jego klatce) albo scroll okna. */
let hooked: Lenis | 'window' | null = null;
const hook = (l: Lenis | null | undefined) => {
  const want = l ?? 'window';
  if (hooked === want) return;
  unhook();
  if (want === 'window') window.addEventListener('scroll', onScroll, { passive: true });
  else want.on('scroll', onLenis);
  window.addEventListener('resize', onScroll);
  hooked = want;
};
const unhook = () => {
  if (hooked === 'window') window.removeEventListener('scroll', onScroll);
  else if (hooked) hooked.off('scroll', onLenis);
  window.removeEventListener('resize', onScroll);
  cancelAnimationFrame(raf);
  raf = 0;
  hooked = null;
};

export const useLivePage = (
  viewRef: RefObject<HTMLElement | null>,
  pageRef: RefObject<HTMLElement | null>,
  opts: { enabled: boolean; mode?: 'pass' | 'sticky' | 'plate'; hostRef?: RefObject<HTMLElement | null> },
) => {
  const { enabled, mode = 'pass', hostRef } = opts;
  const lenis = useLenis();
  useEffect(() => {
    const view = viewRef.current, page = pageRef.current;
    if (!enabled || !view || !page) return;
    trackLenis(lenis);
    const e: LiveEntry = {
      view, page, host: hostRef?.current ?? null, mode, css: sda(), pageH: 0, viewH: 0, y: NaN,
      stick: mode === 'sticky' ? view.closest<HTMLElement>('[data-rl-stick]') : null, stickH: 0, stickTop: 0,
    };
    const measure = () => {
      e.pageH = page.offsetHeight; e.viewH = view.clientHeight; e.y = NaN;
      // sticky: wysokość sekcji = kadr + droga strony klienta / SPEED (kadr stoi, strona w nim jedzie)
      if (e.stick && e.host) {
        e.stickH = e.stick.offsetHeight;
        e.stickTop = parseFloat(getComputedStyle(e.stick).top) || 0;
        e.host.style.height = `${Math.round(e.stickH + Math.max(0, e.pageH - e.viewH) / SPEED)}px`;
      }
      page.style.setProperty('--travel', `${Math.max(0, e.pageH - e.viewH)}px`);
      // sticky + CSS: zakres osi przewijania sekcji (cover %) = od przyklejenia kadru do jego odklejenia
      if (e.css && e.stick && e.host) {
        const V = window.innerHeight, H = e.host.offsetHeight, S = e.stickTop, h = e.stickH, T = Math.max(1, V + H);
        page.style.setProperty('--c0', `${(((V - S) / T) * 100).toFixed(3)}%`);
        page.style.setProperty('--c1', `${(((V - S - h + H) / T) * 100).toFixed(3)}%`);
      }
      onScroll();
    };
    const ro = new ResizeObserver(measure);
    ro.observe(view);
    ro.observe(page);
    if (e.stick) ro.observe(e.stick);
    hook(lenis);
    window.addEventListener('resize', measure);
    live.add(e);
    measure();
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
      live.delete(e);
      page.style.transform = '';
      page.style.removeProperty('--travel');
      if (e.stick && e.host) e.host.style.height = '';
      if (!live.size) unhook();
    };
  }, [viewRef, pageRef, hostRef, enabled, mode, lenis]);
};

/** Blok wchodzący przy pierwszym pokazaniu na ekranie (`data-in`; style .rl-rv w realizacje.css). */
export const Rv = ({ className, children, style, amount = 0.2 }: {
  className?: string; children: ReactNode; style?: CSSProperties; amount?: number;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  useEnter(ref, amount);
  return <div ref={ref} className={className ? `rl-rv ${className}` : 'rl-rv'} style={style}>{children}</div>;
};
