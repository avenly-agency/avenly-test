'use client';

import { useCallback, useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from 'react';
import { ARTS, BASE_MS, CYCLE, DRAW_MS, Drawing, beatFrames, camFrames, liveFrames, timing } from './drawings';
import { OfferNav } from './nav';
import { ItemLink, nn, type VariantProps } from './shared';

// Sekcja "Oferta" - PLAN (wybór właściciela 2026-09-27, potem prośba: "nadaj tej sekcji trochę duszy,
// zajebiście mi się podoba ten motion reveal elementów na makietach"). Oferta jako teczka rysunków
// technicznych: po lewej indeks usług w kategoriach, po prawej czarna deska, na której rysunek
// wybranej usługi rysuje się linia po linii (główne ramy prowadzi pióro kreślarskie), a potem OŻYWA:
// krótka scenka w 3 krokach pokazuje, co usługa robi dla klienta, z podpisem kroku pod rysunkiem
// ("Rys. 4  Klient płaci BLIK-iem lub kartą."). Przy zmianie poprzedni rysunek zwija się, nowy
// rysuje od zera. Numery 1-3 na rysunku = legenda pod deską. Indeks = karty (nav.tsx); obwódka wybranej
// karty to zegar automatu, na którym czas UBYWA (8 s, WAAPI - akurat jedna scenka; bez liczników sekund).
// Ruch kinowy (część sekcji): kamera najeżdża na akcję scenki (camFrames), deska otwiera się jak przysłona,
// światło przesuwa się po krawędzi deski, podpisy kroków jak napisy w filmie. Tło sekcji: czysta czerń.
// Automat: rusza przy pierwszym pokazaniu, pauza przy kursorze / fokusie / poza ekranem / po
// dotknięciu (10 s), klik = wybór i koniec automatu (WCAG 2.2.2). Scenki grają dalej przy kursorze
// (to je się ogląda), stoją poza ekranem. Telefon: indeks = poziomy pasek pigułek, swipe po desce.
// Reduced motion: bez automatu, rysowania i scenek (statyczny rysunek, podpis = trzy kroki naraz).
// Bez JS: pierwsza deska + wszystkie opisy z linkami jako lista.
const AUTO_MS = 8000;
/** Zegar karty: obwódka ubywa zgodnie z ruchem wskazówek (stroke-dashoffset 0 → -1 na pathLength = 1). */
const CLOCK: Keyframe[] = [{ strokeDashoffset: '0' }, { strokeDashoffset: '-1' }];
const TOUCH_HOLD = 10000;
/** Pierwsze wejście: rysunek rusza, gdy przysłona deski jest w połowie otwarta. */
const ENTER_MS = 600;
/** Zbliżenia kamery na małej desce: pełna siła przy rysunku ≤ 360 px, bez wzmocnienia od 640 px. */
const camBoost = (w: number) => 1 + 0.2 * Math.min(1, Math.max(0, (640 - w) / 280));
/** Przeciąganie rysunku palcem: opór (część drogi palca) i próg zmiany usługi. */
const DRAG_K = 0.42, DRAG_MAX = 88, SWIPE_MIN = 44;

/** cubic-bezier(.65, 0, .35, 1) - ta sama krzywa co rysowanie linii w CSS (--draw). */
const DRAW_EASE = (() => {
  const x1 = 0.65, y1 = 0, x2 = 0.35, y2 = 1;
  const bx = (t: number) => 3 * x1 * t * (1 - t) ** 2 + 3 * x2 * t * t * (1 - t) + t ** 3;
  const by = (t: number) => 3 * y1 * t * (1 - t) ** 2 + 3 * y2 * t * t * (1 - t) + t ** 3;
  return (x: number) => {
    let lo = 0, hi = 1, t = x;
    for (let k = 0; k < 20; k++) {
      t = (lo + hi) / 2;
      if (bx(t) < x) lo = t; else hi = t;
    }
    return by(t);
  };
})();

export const PlanOffer = ({ t, m, reduced }: VariantProps) => {
  const N = m.items.length;
  const [on, setOn] = useState(0);
  const [prev, setPrev] = useState(-1);
  const [auto, setAuto] = useState(true);
  const [seen, setSeen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const clocks = useRef<Animation[]>([]);
  const [geo, setGeo] = useState(0);
  const onGeometry = useCallback(() => setGeo((g) => g + 1), []);
  const story = useRef<Animation[]>([]);
  const flags = useRef({ vis: false, hover: false, focus: false, hold: 0 });
  const swipe = useRef<{ x: number; y: number; id: number; drag: HTMLElement | null } | null>(null);

  const sync = useCallback(() => {
    const f = flags.current;
    const run = f.vis && !f.hover && !f.focus && !f.hold;
    clocks.current.forEach((a) => (run ? a.play() : a.pause()));
    story.current.forEach((s) => (f.vis ? s.play() : s.pause()));
  }, []);

  const go = useCallback((from: number, to: number) => {
    const next = (to + N) % N;
    if (next === from) return;
    setPrev(from);
    setOn(next);
  }, [N]);

  const pick = (i: number, focus = false) => {
    go(on, i);
    setAuto(false);
    if (focus) rootRef.current?.querySelector<HTMLElement>(`[data-tab="${(i + N) % N}"]`)?.focus();
  };

  // Tryb żywy, skala linii rysunku (--u = jednostki rysunku na 1 px ekranu), wejście i widoczność.
  // Wejście liczy się od DESKI, nie od całego bloku: na telefonie blok (pigułki + deska + opis) jest wyższy
  // od ekranu, więc przysłona i rysowanie grały poza ekranem. Gdy deska jest w większości widoczna:
  // data-enter (deska otwiera się jak przysłona, karty wchodzą kaskadą, opis dochodzi), a po ENTER_MS
  // data-in (rysunek zaczyna się rysować w otwierającej się desce). Widoczność (automat, scenki, światło
  // na krawędzi) = deska widoczna przynajmniej w jednej trzeciej.
  useEffect(() => {
    const root = rootRef.current;
    const box = root?.querySelector<HTMLElement>('.of-dw-box');
    const board = root?.querySelector<HTMLElement>('.of-pl-frame');
    if (!root || !box || !board) return;
    root.setAttribute('data-live', '');
    const ro = new ResizeObserver(() => {
      const w = box.clientWidth;
      if (w) root.style.setProperty('--u', (640 / w).toFixed(3));
    });
    ro.observe(box);
    let tm = 0;
    const io = new IntersectionObserver(([e]) => {
      const seenPx = e.intersectionRect.height, vh = window.innerHeight;
      const v = e.isIntersecting && (e.intersectionRatio >= 0.35 || seenPx >= vh * 0.4);
      flags.current.vis = v;
      root.toggleAttribute('data-vis', v);
      if (!root.hasAttribute('data-enter') && e.isIntersecting && (e.intersectionRatio >= 0.55 || seenPx >= vh * 0.5)) {
        root.setAttribute('data-enter', '');
        tm = window.setTimeout(() => {
          root.setAttribute('data-in', '');
          setSeen(true);
        }, reduced ? 0 : ENTER_MS);
      }
      sync();
    }, { threshold: [0, 0.2, 0.35, 0.55, 0.8] });
    io.observe(board);
    const f = flags.current;
    return () => {
      ro.disconnect();
      io.disconnect();
      window.clearTimeout(tm);
      window.clearTimeout(f.hold);
    };
  }, [sync, reduced]);

  // Automat: zegarem jest obwódka aktywnej karty (data-clock, nav.tsx) - czas UBYWA do zmiany usługi.
  useEffect(() => {
    const root = rootRef.current;
    const els = Array.from(root?.querySelectorAll<SVGElement>(`[data-clock="${on}"]`) ?? []);
    if (!root || !auto || reduced || !els.length) return;
    const list = els.map((el) => el.animate(CLOCK, { duration: AUTO_MS, easing: 'linear', fill: 'both' }));
    list[0].onfinish = () => go(on, on + 1);
    clocks.current = list;
    sync();
    return () => {
      list[0].onfinish = null;
      list.forEach((a) => a.cancel());
      clocks.current = [];
    };
  }, [on, auto, reduced, go, sync, geo]);

  // Rysunek aktywnej usługi: pióro na czole głównych linii + scenka i podpisy kroków (jedna oś czasu).
  useEffect(() => {
    const dw = rootRef.current?.querySelector<HTMLElement>(`.of-dw[data-i="${on}"]`);
    if (!dw || !seen || reduced) return;
    const art = m.items[on].art;
    const { end } = timing(art);
    // fill 'forwards': w czasie opóźnienia (rysowanie) obowiązuje stan z CSS - elementy widoczne w spoczynku
    // rysują się razem z resztą rysunku, zamiast pojawić się od razu z pierwszej klatki scenki.
    const opts: KeyframeAnimationOptions = { duration: CYCLE, delay: BASE_MS + end + 700, iterations: Infinity, easing: 'linear', fill: 'forwards' };
    const list: Animation[] = [];
    const keep: Animation[] = []; // ruch elementów widocznych w spoczynku - zostaje przy zwijaniu (bez skoku)
    dw.querySelectorAll<SVGElement>('[data-lv]').forEach((el) => {
      el.style.removeProperty('transform');
      const j = Number(el.dataset.lv);
      liveFrames(j, art).forEach(({ prop, frames }) => {
        const a = el.animate(frames, opts);
        list.push(a);
        if (prop === 'transform' && ARTS[art].live[j].rest) keep.push(a);
      });
    });
    dw.querySelectorAll<HTMLElement>('[data-beat]').forEach((el) => list.push(el.animate(beatFrames(Number(el.dataset.beat)), opts)));
    // Kamera najeżdża na miejsce akcji w każdym kroku (ta sama oś czasu co scenka), na małej desce bliżej;
    // przy zmianie usługi kadr zostaje, gdzie był (commitStyles), i odjeżdża razem ze zwijaniem (CSS).
    const cam = dw.querySelector<HTMLElement>('.of-dw-cam');
    if (cam) {
      cam.style.removeProperty('transform');
      const a = cam.animate(camFrames(art, camBoost(cam.clientWidth || 640)), opts);
      list.push(a);
      keep.push(a);
    }
    story.current = list;
    sync();

    // Pióro: jasna kropka na czole linii, zsynchronizowana z przejściem CSS (to samo opóźnienie i krzywa).
    const pens = Array.from(dw.querySelectorAll<SVGPathElement>('path[data-pen]')).map((p) => ({
      p,
      dot: dw.querySelector<SVGCircleElement>(`[data-pen-dot="${p.dataset.pen}"]`),
      len: p.getTotalLength(),
      delay: BASE_MS + parseFloat(p.style.getPropertyValue('--d') || '0'),
    }));
    const t0 = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      let live = false;
      for (const { p, dot, len, delay } of pens) {
        if (!dot) continue;
        const k = (now - t0 - delay) / DRAW_MS;
        if (k <= 0 || k >= 1) { dot.style.opacity = '0'; if (k <= 0) live = true; continue; }
        live = true;
        const pt = p.getPointAtLength(DRAW_EASE(k) * len);
        dot.setAttribute('cx', pt.x.toFixed(1));
        dot.setAttribute('cy', pt.y.toFixed(1));
        dot.style.opacity = '1';
      }
      if (live) raf = requestAnimationFrame(tick);
    };
    if (pens.length) raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      pens.forEach(({ dot }) => dot?.style.setProperty('opacity', '0'));
      keep.forEach((a) => { try { a.commitStyles(); } catch { /* element poza renderem */ } });
      list.forEach((a) => a.cancel());
      story.current = [];
    };
  }, [on, seen, reduced, m.items, sync]);

  // Kolor aktywnej usługi na całej sekcji (tło sekcji, separatory, stopka, etykieta).
  useEffect(() => {
    const sec = rootRef.current?.closest<HTMLElement>('.of');
    if (!sec) return;
    sec.style.setProperty('--oc', m.items[on].acc);
    return () => { sec.style.removeProperty('--oc'); };
  }, [on, m.items]);

  // Telefon: aktywna zakładka wjeżdża w pasek (przewijanie tylko w poziomie, bez skoku strony).
  useEffect(() => {
    const list = tabsRef.current;
    const tab = list?.querySelector<HTMLElement>(`[data-tab="${on}"]`);
    if (!list || !tab || list.scrollWidth <= list.clientWidth + 2) return;
    list.scrollTo({ left: tab.offsetLeft - (list.clientWidth - tab.offsetWidth) / 2, behavior: reduced ? 'auto' : 'smooth' });
  }, [on, reduced]);

  const setFlag = (k: 'hover' | 'focus', v: boolean) => {
    flags.current[k] = v;
    sync();
  };
  const holdTouch = () => {
    const f = flags.current;
    window.clearTimeout(f.hold);
    f.hold = window.setTimeout(() => {
      f.hold = 0;
      sync();
    }, TOUCH_HOLD);
    sync();
  };

  const onKey = (e: KeyboardEvent) => {
    const k = e.key;
    if (k === 'ArrowDown' || k === 'ArrowRight') pick(on + 1, true);
    else if (k === 'ArrowUp' || k === 'ArrowLeft') pick(on - 1, true);
    else if (k === 'Home') pick(0, true);
    else if (k === 'End') pick(N - 1, true);
    else return;
    e.preventDefault();
  };

  // Swipe po desce (dotyk): obraz aktywnego rysunku (.of-dw-drag) przesuwa się w nieruchomym kadrze za palcem
  // z oporem i lekko przygasa, po puszczeniu wraca sprężyście (CSS), a przy wystarczającym ruchu zmienia usługę
  // (stary zwija się, nowy rysuje).
  // Pion zostaje przeglądarce (touch-action: pan-y) - ruch w pionie kończy gest bez przesuwania rysunku.
  const follow = (el: HTMLElement, dx: number) => {
    if (reduced) return;
    const d = Math.sign(dx) * DRAG_MAX * (1 - Math.exp((-Math.abs(dx) * DRAG_K) / DRAG_MAX));
    el.style.transition = 'none';
    el.style.transform = `translate3d(${d.toFixed(1)}px, 0, 0)`;
    el.style.opacity = (1 - (Math.abs(d) / DRAG_MAX) * 0.4).toFixed(3);
  };
  const release = (el: HTMLElement | null | undefined) => {
    if (!el) return;
    el.style.removeProperty('transition');
    el.style.removeProperty('transform');
    el.style.removeProperty('opacity');
  };
  const onDown = (e: PointerEvent) => {
    if (e.pointerType === 'mouse') return;
    swipe.current = { x: e.clientX, y: e.clientY, id: e.pointerId, drag: null };
  };
  const onMove = (e: PointerEvent) => {
    const s = swipe.current;
    if (!s || s.id !== e.pointerId) return;
    const dx = e.clientX - s.x, dy = e.clientY - s.y;
    if (!s.drag) {
      if (Math.abs(dy) > 10 && Math.abs(dy) > Math.abs(dx)) { swipe.current = null; return; }
      if (Math.abs(dx) < 8) return;
      s.drag = rootRef.current?.querySelector<HTMLElement>('.of-dw[data-on] .of-dw-drag') ?? null;
      if (!s.drag) return;
    }
    follow(s.drag, dx);
  };
  const onUp = (e: PointerEvent) => {
    const s = swipe.current;
    swipe.current = null;
    if (!s || s.id !== e.pointerId) return;
    release(s.drag);
    const dx = e.clientX - s.x, dy = e.clientY - s.y;
    if (Math.abs(dx) > SWIPE_MIN && Math.abs(dx) > Math.abs(dy) * 1.2) pick(on + (dx < 0 ? 1 : -1));
  };
  const onCancel = () => {
    release(swipe.current?.drag);
    swipe.current = null;
  };

  const cur = m.items[on];

  return (
    <div
      ref={rootRef}
      className="of-pl container mx-auto px-6"
      data-auto={auto && !reduced ? '' : undefined}
      style={{ '--oc': cur.acc } as CSSProperties}
      onPointerEnter={(e) => e.pointerType === 'mouse' && setFlag('hover', true)}
      onPointerLeave={(e) => e.pointerType === 'mouse' && setFlag('hover', false)}
      onPointerDownCapture={(e) => e.pointerType !== 'mouse' && holdTouch()}
      onFocus={() => setFlag('focus', true)}
      onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFlag('focus', false); }}
    >
      <div className="of-pl-grid">
        <OfferNav t={t} m={m} on={on} pick={pick} onKey={onKey} tabsRef={tabsRef} onGeometry={onGeometry} />

        <div className="of-pl-stage">
          {/* of-pl-frame = pomiar widoczności deski (sama deska ma clip-path przysłony, który IntersectionObserver
              w Chrome uwzględnia - zamknięta szczelina nigdy nie byłaby "widoczna"). */}
          <div className="of-pl-frame">
          <div className="of-pl-board" onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onCancel}>
            <span className="of-pl-crop" aria-hidden="true" />
            <div className="of-pl-figs">
              {m.items.map((it) => (
                <Drawing
                  key={it.id}
                  i={it.i}
                  art={it.art}
                  acc={it.acc}
                  on={on === it.i}
                  out={prev === it.i && on !== it.i}
                  fig={`${t.figLabel} ${it.i + 1}`}
                  beats={it.story}
                  head={
                    <p className="of-dw-head">
                      <b>{nn(it.i)}</b>&nbsp;/ {nn(N - 1)}<span className="of-dw-cat">{it.catLabel}</span>
                    </p>
                  }
                />
              ))}
            </div>
          </div>
          </div>

          <div className="of-pl-panels">
            {m.items.map((it) => (
              <div
                key={it.id}
                role="tabpanel"
                id={`of-pl-panel-${it.i}`}
                aria-labelledby={`of-pl-tab-${it.i}`}
                className="of-pl-panel"
                data-on={on === it.i || undefined}
                style={{ '--ic': it.acc } as CSSProperties}
              >
                <div className="of-pl-copy">
                  <h3 className="of-name">{it.name}</h3>
                  <p className="of-line">{it.line}</p>
                </div>
                <div className="of-pl-meta">
                  <ol className="of-legend" aria-label={t.legendAria}>
                    {it.points.map((p, j) => (
                      <li key={j}><span className="of-legend-n" aria-hidden="true">{j + 1}</span>{p}</li>
                    ))}
                  </ol>
                  <ItemLink item={it} t={t} allHref={m.allHref} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
