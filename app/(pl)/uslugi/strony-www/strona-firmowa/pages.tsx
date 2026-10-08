'use client';

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type MouseEvent, type MutableRefObject, type PointerEvent as ReactPointerEvent, type RefObject } from 'react';
import { ChevronLeft, ChevronRight, MousePointer2, Pointer, X } from 'lucide-react';
import { useReducedPref, useSeen } from '../../_usluga/shared';
import { entriesOf, Mini, nn, type Entry, type MapCopy, type Site } from './mini';

// SCENA 2 - „3 PODSTRONY TO DOPIERO POCZĄTEK” JAKO KARTY NA CAŁĄ SEKCJĘ (runda 6, telefon dopracowany w rundzie 7).
// Właściciel 2026-10-02: „daj taką wersję bardziej whole section i tak, żeby można było hoverować i się pokazuje”,
// po „Spisie” (ściana nazw): „bardziej chodziło mi o karty, nie o spis, daj kilka wersji tej sekcji”, potem
// „super, dostosuj to do mobile teraz tak, żeby było perfekcyjnie wraz z funkcjonalnością”.
// Każda z 27 podstron przykładowej strony to KARTA z makietą tej podstrony (mini.tsx) i podpisem. Sekcja nie jest
// przypięta. Cztery wersje (przełącznik w panelu na dole ekranu, po wyborze zostaje jedna - pozostałe bloki [data-v]
// w strona-firmowa.css do usunięcia):
//   stol        „Stół”        - karty rozrzucone po całej sekcji, lekko obrócone, zachodzą na siebie i wychodzą za
//                               krawędzie; pokazana prostuje się, wychodzi na wierzch i rośnie,
//   siatka      „Siatka”      - równa ściana miniatur; z pokazanej karty wyskakuje powiększona makieta,
//   harmonijka  „Harmonijka”  - rząd grzbietów kart; pokazany rozsuwa się w pełną kartę (komputer: cały rząd na
//                               szerokość sekcji; telefon / tablet: ten sam rząd jako pas przesuwany palcem),
//   tasma       „Taśma”       - trzy rzędy kart suną w przeciwne strony przez całą szerokość ekranu; rząd można
//                               przeciągnąć palcem / myszą, pokazanie karty zatrzymuje taśmę (bez automatu).
// JAK KARTA SIĘ POKAZUJE:
//   komputer          - najechanie kursorem (po zjechaniu wraca automat); duży ekran dotykowy: dotknięcie,
//   telefon / tablet  - DOTKNIĘCIE OTWIERA PODGLĄD (Viewer): duża karta na przyciemnionym tle, przesuwanie palcem
//                       w bok między podstronami (zwykłe przewijanie z dociąganiem), strzałki, licznik, zamknięcie
//                       krzyżykiem, dotknięciem obok, klawiszem Esc albo przewinięciem strony. Automat tylko delikatnie
//                       wyróżnia kolejne karty widoczne na ekranie (data-mark) - nic samo nie zasłania kart.
//                       Runda 8, właściciel: „te karty z podstronami na telefonie się chujowo używa, popraw UX; na
//                       kompach elegancko działa już”. Wcześniej karta rosła w miejscu nad sąsiadami (także sama,
//                       z automatu) - zasłaniała karty, w które chciało się trafić. NIE wracać do tego na dotyku.
//                       Wyjątek: „Harmonijka” ma własny pas przesuwany palcem (bez podglądu).
// Stan „pokazana karta” to atrybut data-on na karcie (+ data-has na sekcji: reszta przygasa) - pisany wprost do DOM,
// bez renderowania Reacta. Najechanie liczy się po polu karty (li), a rośnie jej środek (pointer-events: none) -
// inaczej powiększona karta zasłaniałaby sąsiadów przed kursorem.
// Bez JS / ograniczony ruch: komplet kart od razu, bez automatu i bez ruchu taśmy (najechanie i dotknięcie działają).

export type CardsVersion = 'stol' | 'siatka' | 'harmonijka' | 'tasma';

/** Co ile karty pokazują się same; przerwa po dotknięciu, po zjechaniu kursorem, w trakcie przewijania; zapas na wejście. */
const AUTO_MS = 2600, TOUCH_HOLD = 8000, LEAVE_HOLD = 2200, SCROLL_HOLD = 750, ENTER_MS = 1500;
const NARROW = '(max-width: 1023.98px)', FINE = '(hover: hover) and (pointer: fine)';
const narrow = () => window.matchMedia(NARROW).matches;
/** Telefon / tablet z dotykiem: karta nie rośnie w miejscu, dotknięcie otwiera podgląd (Viewer). */
const sheet = (version: CardsVersion) => version !== 'harmonijka' && narrow() && !window.matchMedia(FINE).matches;
const FIT_VARS = ['--pop', '--dx', '--dy'];

/** Kursor w wąskim oknie komputera: karta rośnie w miejscu (skala z CSS), tylko dosuwa się w bok (--dx), żeby nie
    wyjść za ekran. */
const nudge = (li: HTMLElement, zoom: string) => {
  FIT_VARS.forEach((k) => li.style.removeProperty(k));
  const el = li.querySelector<HTMLElement>(zoom);
  if (!el) return;
  const vw = document.documentElement.clientWidth;
  const r = el.getBoundingClientRect(), cx = r.left + r.width / 2;
  const half = (el.offsetWidth * (parseFloat(getComputedStyle(li).getPropertyValue('--pop')) || 1.6)) / 2;
  const dx = cx - half < 12 ? 12 - (cx - half) : cx + half > vw - 12 ? vw - 12 - (cx + half) : 0;
  li.style.setProperty('--dx', `${dx.toFixed(1)}px`);
};

const useActive = (ref: RefObject<HTMLElement | null>, version: CardsVersion, reduced: boolean, draggedRef: MutableRefObject<boolean>, openAt: (i: number) => void) => {
  const cur = useRef<HTMLElement | null>(null);
  const hover = useRef(false);
  const holdUntil = useRef(0);
  /** Do kiedy przewijanie pasa „Harmonijki” jest nasze (automat / dotknięcie), a nie palca. */
  const ownScroll = useRef(0);
  const auto = version !== 'tasma';
  /** Co rośnie: w „Siatce” sama makieta, w pozostałych cała karta z podpisem. */
  const zoom = version === 'siatka' ? '.sf-p-view' : '.sf-p-face';
  const hold = useCallback((ms: number) => { holdUntil.current = Math.max(holdUntil.current, performance.now() + ms); }, []);

  /** „Harmonijka” na wąskim ekranie: pas przesuwa się tak, żeby rozsunięta karta stanęła na środku. */
  const reveal = useCallback((el: HTMLElement, prev: HTMLElement | null) => {
    const list = el.parentElement;
    if (!list) return;
    const cards = Array.from(list.children) as HTMLElement[];
    const spine = cards.find((c) => c !== el && c !== prev)?.offsetWidth ?? 38;
    const cs = getComputedStyle(list);
    const gap = parseFloat(cs.columnGap) || 5, pad = parseFloat(cs.paddingLeft) || 0;
    const open = (el.querySelector<HTMLElement>('.sf-p-view')?.offsetWidth ?? 280) + 12;
    const left = pad + cards.indexOf(el) * (spine + gap);
    ownScroll.current = performance.now() + 1200;
    list.scrollTo({ left: Math.max(0, left - (list.clientWidth - open) / 2), behavior: reduced ? 'auto' : 'smooth' });
  }, [reduced]);

  /** Kolejność na wierzchu = kolejność pokazywania: każda pokazana karta (i jej rząd w „Taśmie”) dostaje wyższy
      z-index niż wszystkie wcześniejsze i ZATRZYMUJE go po schowaniu - jak karta odłożona na stół leży na wierzchu.
      NIE zdejmować z-indexu po czasie: karty w „Stole” zachodzą na siebie, więc schowana karta po chwili wskakiwała
      z powrotem pod sąsiednią (błędy zgłoszone przez właściciela: „z indexem jakby się resetują”, potem „jest
      normalnie przez chwilę i potem wraca pod poprzednią kartę”). */
  const zTop = useRef(10);

  const setOn = useCallback((el: HTMLElement | null, scroll = false) => {
    const prev = cur.current;
    if (prev === el) return;
    // telefon / tablet z dotykiem: karta jest tylko wyróżniona (data-mark), z bliska pokazuje ją podgląd
    const lb = sheet(version);
    if (prev) { prev.removeAttribute('data-on'); prev.removeAttribute('data-mark'); }
    if (el) {
      if (!lb && version !== 'harmonijka' && narrow()) nudge(el, zoom); else FIT_VARS.forEach((k) => el.style.removeProperty(k));
      const z = String(++zTop.current);
      el.setAttribute(lb ? 'data-mark' : 'data-on', '');
      el.style.zIndex = z;
      const row = el.closest<HTMLElement>('.sf-p-row');
      if (row) row.style.zIndex = z;
      if (scroll && version === 'harmonijka' && narrow()) reveal(el, prev);
    }
    cur.current = el;
    ref.current?.toggleAttribute('data-has', !!el && !lb);
  }, [ref, version, zoom, reveal]);

  // automat: bez kursora karty pokazują się po kolei - tylko te, które są teraz na ekranie
  useEffect(() => {
    const sec = ref.current;
    if (!sec || !auto || reduced) return;
    let inView = false, last = 0, readyAt = 0;
    const io = new IntersectionObserver(([e]) => { inView = e.isIntersecting; }, { threshold: 0.12 });
    io.observe(sec);
    const id = window.setInterval(() => {
      const now = performance.now();
      if (!sec.hasAttribute('data-in')) return;
      if (!readyAt) readyAt = now + ENTER_MS;
      if (!inView || document.hidden || hover.current || sec.hasAttribute('data-open') || now < holdUntil.current || now < readyAt) { last = now - AUTO_MS * 0.6; return; }
      if (now - last < AUTO_MS) return;
      last = now;
      const cards = Array.from(sec.querySelectorAll<HTMLElement>('.sf-p-card'));
      const vh = window.innerHeight;
      const pool = cards.filter((c) => { const r = c.getBoundingClientRect(), cy = r.top + r.height / 2; return cy > 96 && cy < vh - 70; });
      if (!pool.length) { setOn(null); return; }
      const at = cur.current ? cards.indexOf(cur.current) : -1;
      setOn(pool.find((c) => cards.indexOf(c) > at) ?? pool[0], true);
    }, 250);
    return () => { io.disconnect(); window.clearInterval(id); };
  }, [ref, auto, reduced, setOn]);

  // przewijanie strony: automat czeka, a karta, która wyjechała poza ekran, chowa się; zmiana szerokości okna chowa kartę
  useEffect(() => {
    let raf = 0, w = window.innerWidth;
    const check = () => {
      raf = 0;
      const el = cur.current;
      if (!el || hover.current) return;
      const r = el.getBoundingClientRect(), cy = r.top + r.height / 2;
      if (cy < 30 || cy > window.innerHeight - 30) setOn(null);
    };
    const onScroll = () => { hold(SCROLL_HOLD); if (!raf) raf = requestAnimationFrame(check); };
    const onResize = () => { if (window.innerWidth !== w) { w = window.innerWidth; setOn(null); } };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onResize); };
  }, [setOn, hold]);

  // „Harmonijka”: przesunięcie pasa palcem wstrzymuje automat
  useEffect(() => {
    const list = version === 'harmonijka' ? ref.current?.querySelector<HTMLElement>('.sf-p-list') : null;
    if (!list) return;
    const onScroll = () => { if (performance.now() > ownScroll.current) hold(TOUCH_HOLD); };
    list.addEventListener('scroll', onScroll, { passive: true });
    return () => list.removeEventListener('scroll', onScroll);
  }, [ref, version, hold]);

  const cardAt = (target: EventTarget) => (target as HTMLElement).closest<HTMLElement>('[data-p]');
  const onOver = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'touch') return;
    hover.current = true;
    const el = cardAt(e.target);
    if (el) setOn(el);
  };
  const onLeave = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'touch') return;
    hover.current = false;
    hold(LEAVE_HOLD);
    if (!auto) setOn(null);
  };
  const onClick = (e: MouseEvent<HTMLDivElement>) => {
    if (draggedRef.current) { draggedRef.current = false; return; }
    if (hover.current) return; // mysz: kartę pokazuje samo najechanie
    const act = cur.current;
    hold(TOUCH_HOLD);
    if (sheet(version)) {
      const card = cardAt(e.target);
      if (!card) return;
      setOn(card);
      openAt(Number(card.dataset.p));
      return;
    }
    if (act) {
      // dotknięcie pokazanej (powiększonej) karty chowa ją - także tam, gdzie leży nad sąsiadami
      const r = (act.querySelector(zoom) ?? act).getBoundingClientRect();
      if (e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom) { setOn(null); return; }
    }
    const el = cardAt(e.target);
    setOn(el === act ? null : el, true);
  };
  /** Wyróżnij kartę o numerze i (podgląd przesunięty na inną podstronę) albo zdejmij wyróżnienie (i < 0). */
  const show = useCallback((i: number) => {
    setOn(i < 0 ? null : ref.current?.querySelector<HTMLElement>(`.sf-p-card[data-p="${i}"]:not([data-copy])`) ?? null);
  }, [ref, setOn]);
  return { onOver, onLeave, onClick, show, hold };
};

/** „Taśma”: rzędy suną same (px/s, co drugi w przeciwną stronę), rząd można przeciągnąć; pokazana karta albo kursor
    nad taśmą łagodnie ją zatrzymują. Pozycję pisze pętla klatek (pauza poza ekranem i przy ukrytej karcie). */
const BELT_SPEED = [24, -20, 28];
const useBelt = (ref: RefObject<HTMLElement | null>, on: boolean, draggedRef: MutableRefObject<boolean>) => {
  useEffect(() => {
    const sec = ref.current, belt = sec?.querySelector<HTMLElement>('.sf-p-belt');
    if (!sec || !belt || !on) return;
    const rows = Array.from(belt.querySelectorAll<HTMLElement>('.sf-p-row')).map((el, k) => ({ el, base: BELT_SPEED[k] ?? 24, v: 0, pos: 0, period: 1, drag: false }));
    const measure = () => rows.forEach((r) => { r.period = Math.max(1, r.el.scrollWidth / 3); });
    measure();
    const ro = new ResizeObserver(measure);
    rows.forEach((r) => ro.observe(r.el));
    document.fonts?.ready.then(measure).catch(() => {});
    let raf = 0, last = 0, inView = false, over = false;
    const frame = (now: number) => {
      raf = 0;
      const dt = Math.min(0.05, Math.max(0, (now - last) / 1000));
      last = now;
      const stop = over || sec.hasAttribute('data-has') || sec.hasAttribute('data-open');
      rows.forEach((r) => {
        if (!r.drag) {
          // po mocnym pociągnięciu rząd hamuje szybciej, potem łagodnie wraca do swojego tempa
          r.v += ((stop ? 0 : r.base) - r.v) * Math.min(1, dt * (stop ? 9 : Math.abs(r.v) > 140 ? 4.5 : 2.2));
          r.pos += r.v * dt;
        }
        const x = ((r.pos % r.period) + r.period) % r.period;
        r.el.style.transform = `translate3d(${(-x).toFixed(2)}px, 0, 0)`;
      });
      if (inView && !document.hidden) raf = requestAnimationFrame(frame);
    };
    const start = () => { if (!raf && inView && !document.hidden) { last = performance.now(); raf = requestAnimationFrame(frame); } };
    const io = new IntersectionObserver(([e]) => { inView = e.isIntersecting; start(); }, { rootMargin: '160px 0px' });
    io.observe(belt);
    document.addEventListener('visibilitychange', start);

    // przeciąganie rzędu: poziomy ruch należy do taśmy, pionowy do przewijania strony (touch-action: pan-y)
    let d: { row: (typeof rows)[number]; id: number; x0: number; x: number; t: number; moved: boolean } | null = null;
    const down = (e: PointerEvent) => {
      const el = (e.target as HTMLElement).closest('.sf-p-row');
      const row = rows.find((r) => r.el === el);
      if (!row || sec.hasAttribute('data-has') || (e.pointerType === 'mouse' && e.button !== 0)) return;
      d = { row, id: e.pointerId, x0: e.clientX, x: e.clientX, t: e.timeStamp, moved: false };
    };
    const move = (e: PointerEvent) => {
      if (!d || e.pointerId !== d.id) return;
      if (!d.moved) {
        if (Math.abs(e.clientX - d.x0) < 8) return;
        d.moved = true; d.row.drag = true; d.x = e.clientX; d.t = e.timeStamp;
        belt.setAttribute('data-drag', '');
        return;
      }
      const step = e.clientX - d.x, dt = Math.max(1, e.timeStamp - d.t);
      d.row.pos -= step;
      d.row.v = d.row.v * 0.6 + ((-step / dt) * 1000) * 0.4;
      d.x = e.clientX; d.t = e.timeStamp;
    };
    const up = (e: PointerEvent) => {
      if (!d || e.pointerId !== d.id) return;
      if (d.moved) {
        d.row.drag = false;
        d.row.v = Math.max(-1600, Math.min(1600, d.row.v));
        belt.removeAttribute('data-drag');
        // po przeciągnięciu myszą przeglądarka wyśle jeszcze kliknięcie - nie ma ono pokazywać karty
        draggedRef.current = true;
        window.setTimeout(() => { draggedRef.current = false; }, 80);
      }
      d = null;
    };
    const enter = (e: PointerEvent) => { if (e.pointerType !== 'touch') over = true; };
    const leave = () => { over = false; };
    belt.addEventListener('pointerdown', down);
    belt.addEventListener('pointerenter', enter);
    belt.addEventListener('pointerleave', leave);
    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect(); ro.disconnect();
      document.removeEventListener('visibilitychange', start);
      belt.removeEventListener('pointerdown', down);
      belt.removeEventListener('pointerenter', enter);
      belt.removeEventListener('pointerleave', leave);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', up);
      rows.forEach((r) => { r.el.style.transform = ''; });
    };
  }, [ref, on, draggedRef]);
};

/** Stałe „losowe” 0-1 z numeru karty (liczby całkowite - ten sam wynik na serwerze i w każdej przeglądarce). */
const rnd = (i: number, s: number) => (((Math.imul(i + 1, 73856093) ^ Math.imul(s + 7, 19349663)) >>> 0) % 1000) / 1000;
/** „Stół”: położenie i obrót karty. Komputer / tablet 9 × 3 (--x / --y), telefon 3 × 9 (--xm / --ym), w % pola;
    --edge = skrajna kolumna na komputerze (1 lewa, -1 prawa): pokazana karta dosuwa się do środka, żeby nie wyjść
    za ekran. Pole karty (li) NIE zmienia się przy pokazaniu - prostuje się i rośnie tylko jej środek; inaczej pole
    uciekało spod nieruchomego kursora i karty przełączały się w kółko. */
const spot = (i: number) => {
  const col = i % 9, row = Math.floor(i / 9), cm = i % 3, rm = Math.floor(i / 3);
  return {
    '--x': (((col + 0.5) / 9) * 100 + (rnd(i, 1) - 0.5) * 5).toFixed(2),
    '--y': (((row + 0.5) / 3) * 100 + (rnd(i, 2) - 0.5) * 15).toFixed(2),
    '--xm': (((cm + 0.5) / 3) * 100 + (rnd(i, 3) - 0.5) * 9).toFixed(2),
    '--ym': (((rm + 0.5) / 9) * 100 + (rnd(i, 4) - 0.5) * 4).toFixed(2),
    '--r': ((rnd(i, 5) - 0.5) * 17).toFixed(1),
    '--edge': col === 0 ? '1' : col === 8 ? '-1' : '0',
  };
};

const Card = ({ en, i, brand, style, copy }: { en: Entry; i: number; brand: string; style?: Record<string, string>; copy?: boolean }) => (
  <li
    className="sf-p-card" data-p={i} data-kind={en.kind === 'more' ? 'more' : undefined}
    data-copy={copy ? '' : undefined} aria-hidden={copy ? true : undefined} style={{ '--i': i, ...style } as CSSProperties}
  >
    <div className="sf-p-face">
      <div className="sf-p-view" aria-hidden="true"><Mini en={en} brand={brand} /></div>
      <div className="sf-p-tag">{en.kind !== 'more' && <b aria-hidden="true">{nn(i)}</b>}<span className="sf-p-name">{en.name}</span></div>
      <div className="sf-p-info" aria-hidden="true"><strong>{en.name}</strong><span>{en.url}</span></div>
    </div>
  </li>
);

/** PODGLĄD na telefonie / tablecie: duże karty wszystkich podstron w pasie przewijanym palcem (dociąganie do środka),
    licznik, strzałki i zamknięcie. Zamyka się krzyżykiem, dotknięciem obok karty, klawiszem Esc, przewinięciem strony
    i zmianą szerokości okna (obrót telefonu). Dotknięcie sąsiedniej, wystającej karty przesuwa do niej. */
const Viewer = ({ entries, brand, at, t, label, onClose, onChange }: {
  entries: Entry[]; brand: string; at: number; t: MapCopy; label: string; onClose: () => void; onChange: (i: number) => void;
}) => {
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [i, setI] = useState(at);
  const iRef = useRef(at);
  const total = entries.length;

  const goTo = useCallback((k: number, smooth = true) => {
    const tr = track.current, slide = tr?.children[Math.max(0, Math.min(total - 1, k))] as HTMLElement | undefined;
    if (!tr || !slide) return;
    tr.scrollTo({ left: slide.offsetLeft - (tr.clientWidth - slide.offsetWidth) / 2, behavior: smooth ? 'smooth' : 'auto' });
  }, [total]);

  // start na dotkniętej karcie (przed pierwszym malowaniem, bez animacji)
  useLayoutEffect(() => { goTo(at, false); }, [at, goTo]);

  // która karta stoi na środku (licznik, wyróżnienie karty w polu pod spodem)
  useEffect(() => {
    const tr = track.current;
    if (!tr) return;
    let raf = 0;
    const read = () => {
      raf = 0;
      const mid = tr.scrollLeft + tr.clientWidth / 2;
      let best = 0, dist = Infinity;
      for (let k = 0; k < tr.children.length; k++) {
        const el = tr.children[k] as HTMLElement, d = Math.abs(el.offsetLeft + el.offsetWidth / 2 - mid);
        if (d < dist) { dist = d; best = k; }
      }
      if (best !== iRef.current) { iRef.current = best; setI(best); onChange(best); }
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(read); };
    tr.addEventListener('scroll', onScroll, { passive: true });
    return () => { cancelAnimationFrame(raf); tr.removeEventListener('scroll', onScroll); };
  }, [onChange]);

  // zamykanie: przewinięcie strony, Esc, zmiana szerokości okna; strzałki klawiatury przesuwają
  useEffect(() => {
    const y0 = window.scrollY, w0 = window.innerWidth;
    const back = document.activeElement as HTMLElement | null;
    const onScroll = () => { if (Math.abs(window.scrollY - y0) > 36) onClose(); };
    const onResize = () => { if (window.innerWidth !== w0) onClose(); };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight') goTo(iRef.current + 1);
      else if (e.key === 'ArrowLeft') goTo(iRef.current - 1);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    window.addEventListener('keydown', onKey);
    root.current?.querySelector<HTMLElement>('[data-close]')?.focus({ preventScroll: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('keydown', onKey);
      back?.focus?.({ preventScroll: true });
    };
  }, [onClose, goTo]);

  const onTap = (e: MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.closest('.sf-p-lb-bar')) return;
    const slide = target.closest('.sf-p-lb-card')?.parentElement;
    if (!slide) { onClose(); return; }
    const k = Number(slide.dataset.k);
    if (k !== iRef.current) goTo(k);
  };

  return (
    <div ref={root} className="sf-p-lb" role="dialog" aria-modal="true" aria-label={label} onClick={onTap}>
      <div ref={track} className="sf-p-lb-track">
        {entries.map((en, k) => (
          <div key={en.name} className="sf-p-lb-slide" data-k={k} data-cur={k === i ? '' : undefined} aria-hidden={k === i ? undefined : true}>
            <div className="sf-p-lb-card">
              <div className="sf-p-lb-view" aria-hidden="true"><Mini en={en} brand={brand} /></div>
              <p className="sf-p-lb-name">{en.kind !== 'more' && <b aria-hidden="true">{nn(k)}</b>}{en.name}</p>
              <p className="sf-p-lb-url">{en.url}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="sf-p-lb-bar">
        <button type="button" className="sf-p-lb-btn" aria-label={t.prev} disabled={i === 0} onClick={() => goTo(i - 1)}><ChevronLeft aria-hidden="true" /></button>
        <span className="sf-p-lb-count" aria-live="polite">{nn(i)} / {total}</span>
        <button type="button" className="sf-p-lb-btn" aria-label={t.next} disabled={i === total - 1} onClick={() => goTo(i + 1)}><ChevronRight aria-hidden="true" /></button>
        <button type="button" className="sf-p-lb-btn sf-p-lb-close" data-close="" aria-label={t.close} onClick={onClose}><X aria-hidden="true" /></button>
      </div>
    </div>
  );
};

export const MapCards = ({ t, site, version }: { t: MapCopy; site: Site; version: CardsVersion }) => {
  const reduced = useReducedPref();
  const ref = useRef<HTMLElement>(null);
  const draggedRef = useRef(false);
  const entries = entriesOf(t, site);
  const per = Math.ceil(entries.length / 3);
  useSeen(ref, 0.12);
  /** Numer karty otwartej w podglądzie (telefon / tablet) albo null. */
  const [zoomAt, setZoomAt] = useState<number | null>(null);
  const openAt = useCallback((i: number) => setZoomAt(i), []);
  const { onOver, onLeave, onClick, show, hold } = useActive(ref, version, reduced, draggedRef, openAt);
  const close = useCallback(() => {
    setZoomAt(null);
    hold(TOUCH_HOLD);
    if (version === 'tasma') show(-1);
  }, [hold, show, version]);
  useBelt(ref, version === 'tasma' && !reduced, draggedRef);

  return (
    <section ref={ref} className="sf-p" data-v={version} data-open={zoomAt !== null ? '' : undefined} aria-labelledby="sf-m-h">
      <div className="container mx-auto px-6">
        <h2 id="sf-m-h" className="im-title sv-h2">{t.title} <span className="im-accent">{t.titleAccent}</span></h2>
        <div className="sf-p-top">
          <p className="im-lead sf-m-lead">{t.lead}</p>
          <p className="sf-p-hint">
            <span data-m=""><MousePointer2 aria-hidden="true" />{t.hint}</span>
            <span data-t=""><Pointer aria-hidden="true" />{t.hintTouch}</span>
          </p>
        </div>
        <div className="sf-p-stage" onPointerOver={onOver} onPointerLeave={onLeave} onClick={onClick}>
          {version === 'tasma' ? (
            <div className="sf-p-belt">
              {[0, 1, 2].map((r) => (
                <ol key={r} className="sf-p-row">
                  {[0, 1, 2].flatMap((c) => entries.slice(r * per, r * per + per).map((en, k) => (
                    <Card key={`${c}-${en.name}`} en={en} i={r * per + k} brand={site.brand} copy={c > 0} />
                  )))}
                </ol>
              ))}
            </div>
          ) : (
            <ol className="sf-p-list">
              {entries.map((en, i) => <Card key={en.name} en={en} i={i} brand={site.brand} style={version === 'stol' ? spot(i) : undefined} />)}
            </ol>
          )}
        </div>
        <p className="sf-m-cap">{t.caption}</p>
      </div>
      {zoomAt !== null && (
        <Viewer entries={entries} brand={site.brand} at={zoomAt} t={t} label={`${t.title} ${t.titleAccent}`} onClose={close} onChange={show} />
      )}
    </section>
  );
};
