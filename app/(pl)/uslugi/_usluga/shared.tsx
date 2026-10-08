'use client';

import { useCallback, useEffect, useRef, useState, useSyncExternalStore, type RefObject } from 'react';
import { useLenis } from 'lenis/react';

// Wspólne drobiazgi SZKIELETU podstron usług (praca równoległa, etap 3 - chat 7; klasy sv- w usluga.css).
// Kolejność wejścia jak w /uslugi i /realizacje (decyzja właściciela z etapu 2): czerń -> tło rodzi się z czerni ->
// tekst po kolei -> treść. Atrybuty na korzeniu .sv: data-live (JS działa), data-go (tekst), data-on (scena).

export const openChat = () => window.dispatchEvent(new Event('avenly:open-chat'));

const RM = '(prefers-reduced-motion: reduce)';
const subRM = (cb: () => void) => {
  const m = window.matchMedia(RM);
  m.addEventListener('change', cb);
  return () => m.removeEventListener('change', cb);
};
/** Ograniczony ruch (serwer i pierwszy render: false - stany „przed wejściem” są tylko pod [data-live]). */
export const useReducedPref = () => useSyncExternalStore(subRM, () => window.matchMedia(RM).matches, () => false);

export const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
/** Postęp odcinka a-b (0-1) z miękkim startem i końcem. */
export const seg = (p: number, a: number, b: number) => { const x = clamp01((p - a) / (b - a)); return x * x * (3 - 2 * x); };
/** Postęp odcinka a-b (0-1), liniowo. */
export const lin = (p: number, a: number, b: number) => clamp01((p - a) / (b - a));

/** Wejście: czerń -> tło (onReady = pierwsza klatka mgławicy) -> po TEXT_AFTER tekst (data-go) -> po SCENE_AFTER scena
    (data-on). Tło się spóźnia - tekst rusza po FALLBACK_MS; ograniczony ruch - od razu. Zwraca onReady dla tła. */
const TEXT_AFTER = 650, SCENE_AFTER = 750, FALLBACK_MS = 1500;
export const useIntro = (ref: RefObject<HTMLElement | null>) => {
  const goRef = useRef<() => void>(() => {});
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    root.setAttribute('data-live', '');
    const timers: number[] = [];
    let started = false;
    const go = (delay: number) => {
      if (started) return;
      started = true;
      timers.push(window.setTimeout(() => root.setAttribute('data-go', ''), delay));
      timers.push(window.setTimeout(() => root.setAttribute('data-on', ''), delay + SCENE_AFTER));
    };
    if (window.matchMedia(RM).matches) go(0);
    goRef.current = () => go(TEXT_AFTER);
    // tło mogło już zgłosić gotowość (brak WebGL / słabe urządzenie - efekt dziecka biegnie przed tym efektem)
    if (root.querySelector('.sv-sky-neb[data-ready], .sv-sky-neb[data-fail]')) go(TEXT_AFTER);
    timers.push(window.setTimeout(() => go(0), FALLBACK_MS));
    return () => {
      timers.forEach((t) => window.clearTimeout(t));
      goRef.current = () => {};
      root.removeAttribute('data-live'); root.removeAttribute('data-go'); root.removeAttribute('data-on');
    };
  }, [ref]);
  return useCallback(() => goRef.current(), []);
};

/** Element pokazał się na ekranie (część `amount`) ORAZ strona jest po wejściu (data-on na .sv): atrybut data-in + true. */
export const useSeen = (ref: RefObject<HTMLElement | null>, amount = 0.2) => {
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const root = el.closest('.sv');
    let inView = false, done = false;
    const check = () => {
      if (done || !inView || (root && !root.hasAttribute('data-on'))) return;
      done = true;
      el.setAttribute('data-in', '');
      setSeen(true);
      io.disconnect(); mo?.disconnect();
    };
    const io = new IntersectionObserver(([e]) => { inView = e.isIntersecting; check(); }, { threshold: amount, rootMargin: '0px 0px -6% 0px' });
    io.observe(el);
    const mo = root ? new MutationObserver(check) : null;
    if (root) mo?.observe(root, { attributes: true, attributeFilter: ['data-on'] });
    return () => { io.disconnect(); mo?.disconnect(); };
  }, [ref, amount]);
  return seen;
};

/** Postęp przypiętej sceny (0-1): element wysoki, w nim przyklejony ekran. Liczony w klatce Lenisa z jego ułamkowej
    pozycji (bez schodków na końcu wygładzonego przewinięcia - wzorzec z /realizacje), bez Lenisa: scroll + rAF.
    `cb` pisze zmienne CSS / atrybuty wprost do DOM (bez renderów Reacta). */
export const usePin = (ref: RefObject<HTMLElement | null>, cb: (p: number, el: HTMLElement) => void, on = true) => {
  const lenis = useLenis();
  const cbRef = useRef(cb);
  useEffect(() => { cbRef.current = cb; });
  useEffect(() => {
    const el = ref.current;
    if (!el || !on) return;
    let raf = 0, last = -1;
    const calc = () => {
      raf = 0;
      const r = el.getBoundingClientRect(), vh = window.innerHeight;
      const frac = lenis ? lenis.animatedScroll - window.scrollY : 0;
      const p = clamp01(-(r.top - frac) / Math.max(1, r.height - vh));
      if (p !== last) { last = p; cbRef.current(p, el); }
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(calc); };
    const onLenis = () => { cancelAnimationFrame(raf); calc(); };
    const onResize = () => { last = -1; onScroll(); };
    if (lenis) lenis.on('scroll', onLenis); else window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    calc();
    return () => {
      cancelAnimationFrame(raf);
      if (lenis) lenis.off('scroll', onLenis); else window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, [ref, lenis, on]);
};

/** Wywołuje `cb` w każdej klatce przewijania (klatka Lenisa albo scroll + rAF) i przy zmianie rozmiaru okna.
    `frac` = ułamkowa poprawka pozycji Lenisa (odejmij od rect.top, żeby ruch nie schodkował). Do scen, które same
    liczą położenia (jazda w bok, aktywny element listy). `cb` pisze wprost do DOM. */
export const useFrame = (cb: (frac: number) => void, on = true) => {
  const lenis = useLenis();
  const cbRef = useRef(cb);
  useEffect(() => { cbRef.current = cb; });
  useEffect(() => {
    if (!on) return;
    let raf = 0;
    const run = () => { raf = 0; cbRef.current(lenis ? lenis.animatedScroll - window.scrollY : 0); };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(run); };
    const onLenis = () => { cancelAnimationFrame(raf); run(); };
    if (lenis) lenis.on('scroll', onLenis); else window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    run();
    return () => {
      cancelAnimationFrame(raf);
      if (lenis) lenis.off('scroll', onLenis); else window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [lenis, on]);
};
