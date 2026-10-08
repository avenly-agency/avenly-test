'use client';

import { useEffect, useRef, useState, type CSSProperties, type RefObject } from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { BASE_MS, CYCLE, DRAW_MS, Drawing, beatFrames, camFrames, liveFrames, timing } from '@/components/sections/services/drawings';
import type { ArtId } from '@/components/sections/services/shared';
import type { CatalogItem, CatalogModel } from './model';
import { CTA_MOTION, CtaDrawing } from './cta-art';
import { nn, useReducedPref } from './shared';

// Box usługi z animowanym rysunkiem - ten sam rysunek i ruch co w Ofercie na stronie głównej
// (components/sections/services/drawings.tsx, tylko używany - nie zmieniany): gdy box pojawi się na
// ekranie, deska otwiera się ze szczeliny jak przysłona, rysunek rysuje się linia po linii (główne ramy
// prowadzi pióro kreślarskie), pojawiają się odnośniki 1-3, a potem rysunek OŻYWA scenką w 3 krokach
// (kamera najeżdża na miejsce akcji, podpis kroku pod rysunkiem). Po krawędzi deski przesuwa się
// światło w kolorze usługi. Scenka stoi, gdy box jest poza ekranem. Pod deską: nazwa, chwyt i konkret,
// legenda 1-3 (numery jak na rysunku) i link. Link w nazwie jest rozciągnięty na cały box (reaguje strzałka).
// Reduced motion: statyczny rysunek, podpis = trzy kroki naraz. Bez JS: statyczny rysunek.
// Box „Nie wiesz, co wybrać?” ma własny rysunek (cta-art.tsx) i ten sam ruch (useArtMotion).

/** Pierwsze wejście: rysowanie rusza, gdy przysłona deski jest w połowie otwarta. */
const ENTER_MS = 600;
/** Zbliżenia kamery na małej desce (jak w Ofercie): pełna siła przy rysunku ≤ 360 px, bez wzmocnienia od 640 px. */
const camBoost = (w: number) => 1 + 0.2 * Math.min(1, Math.max(0, (640 - w) / 280));

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

/** Wejście boxu „Obrys” (wybór właściciela 2026-10-01): tło karty jako osobna warstwa (pojawia się przezroczystością;
    wygląd „Kadr” - przydymiona rama) i kontur, który rysuje się z punktem światła w kolorze usługi. Style w uslugi.css. */
const Outline = () => (
  <>
    <span className="us-art-bg" aria-hidden="true" />
    <svg className="us-art-edge" aria-hidden="true" focusable="false">
      <rect className="us-art-edge-line" pathLength={1} />
      <rect className="us-art-edge-head" pathLength={1} />
    </svg>
  </>
);

/** Wygląd karty: kafel galerii (rysunek na całą szerokość, nazwa i chwyt - wybór właściciela 2026-09-29) albo duży
    box z legendą 1-3 (szeroka karta na stronie kategorii z jedną usługą). */
export type ArtLook = 'big' | 'tile';

/** Ruch rysunku: skąd brać długość rysowania, klatki scenki i kamerę (usługa z Oferty albo box „Nie wiesz, co wybrać?”). */
interface Motion { end: number; live: (j: number) => Keyframe[][]; cam: (boost: number) => Keyframe[] }
const motionOf = (art: string): Motion => (art === 'cta' ? CTA_MOTION : {
  end: timing(art as ArtId).end,
  live: (j) => liveFrames(j, art as ArtId).map(({ frames }) => frames),
  cam: (b) => camFrames(art as ArtId, b),
});

/** Wejście boxu (przysłona deski, rysowanie), widoczność i scenka z kamerą - wspólne dla kart usług i boxu CTA. */
const useArtMotion = (ref: RefObject<HTMLElement | null>, art: string, i: number) => {
  const reduced = useReducedPref();
  const [seen, setSeen] = useState(false);
  const story = useRef<Animation[]>([]);
  const vis = useRef(false);

  // Tryb żywy, skala linii rysunku (--u = jednostki rysunku na 1 px ekranu), wejście i widoczność.
  // Widoczność mierzy cały box (deska przed wejściem ma clip-path szczeliny, który IntersectionObserver
  // w Chrome uwzględnia - dlatego sam box przed wejściem nie może być wycięty, tylko przezroczysty; uslugi.css).
  useEffect(() => {
    const root = ref.current;
    const box = root?.querySelector<HTMLElement>('.of-dw-box');
    if (!root || !box) return;
    root.setAttribute('data-live', '');
    const ro = new ResizeObserver(() => {
      const w = box.clientWidth;
      if (w) root.style.setProperty('--u', (640 / w).toFixed(3));
    });
    ro.observe(box);
    let tm = 0, want = false;
    // Karty wchodzą dopiero po tekście nagłówka (data-cards na .us - kolejność wejścia w Catalog.tsx).
    const us = root.closest('.us');
    const open = () => !us || us.hasAttribute('data-cards');
    // Odporne na ponowne uruchomienie efektu między data-enter a data-in (inaczej rysunek zostawał nienarysowany).
    const enter = () => {
      if (tm || root.hasAttribute('data-in')) return;
      root.setAttribute('data-enter', '');
      tm = window.setTimeout(() => {
        root.setAttribute('data-in', '');
        setSeen(true);
      }, reduced ? 0 : ENTER_MS + i * 110);
    };
    const io = new IntersectionObserver(([e]) => {
      const px = e.intersectionRect.height, vh = window.innerHeight;
      const v = e.isIntersecting && (e.intersectionRatio >= 0.25 || px >= vh * 0.3);
      vis.current = v;
      root.toggleAttribute('data-vis', v);
      story.current.forEach((a) => (v ? a.play() : a.pause()));
      if (!root.hasAttribute('data-in') && e.isIntersecting && (e.intersectionRatio >= 0.18 || px >= vh * 0.18)) {
        want = true;
        if (open()) enter();
      }
    }, { threshold: [0, 0.18, 0.25, 0.45, 0.7, 1] });
    io.observe(root);
    const mo = us && !open() ? new MutationObserver(() => { if (open()) { mo?.disconnect(); if (want) enter(); } }) : null;
    if (us) mo?.observe(us, { attributes: true, attributeFilter: ['data-cards'] });
    return () => {
      ro.disconnect();
      io.disconnect();
      mo?.disconnect();
      window.clearTimeout(tm);
    };
  }, [ref, reduced, i]);

  // Pióro na czole głównych linii + scenka, podpisy kroków i kamera na jednej osi czasu (jak plan.tsx w Ofercie).
  useEffect(() => {
    const dw = ref.current?.querySelector<HTMLElement>('.of-dw');
    if (!dw || !seen || reduced) return;
    const mo = motionOf(art);
    const opts: KeyframeAnimationOptions = { duration: CYCLE, delay: BASE_MS + mo.end + 700, iterations: Infinity, easing: 'linear', fill: 'forwards' };
    const list: Animation[] = [];
    dw.querySelectorAll<SVGElement>('[data-lv]').forEach((el) => {
      const j = Number(el.dataset.lv);
      mo.live(j).forEach((frames) => list.push(el.animate(frames, opts)));
    });
    dw.querySelectorAll<HTMLElement>('[data-beat]').forEach((el) => list.push(el.animate(beatFrames(Number(el.dataset.beat)), opts)));
    const cam = dw.querySelector<HTMLElement>('.of-dw-cam');
    if (cam) list.push(cam.animate(mo.cam(camBoost(cam.clientWidth || 640)), opts));
    story.current = list;
    if (!vis.current) list.forEach((a) => a.pause());

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
      list.forEach((a) => a.cancel());
      story.current = [];
    };
  }, [ref, seen, reduced, art]);
};

export const ArtCard = ({ it, m, look = 'big', wide = false, level = 'h3', i = 0 }: {
  it: CatalogItem; m: CatalogModel; look?: ArtLook; wide?: boolean; level?: 'h2' | 'h3'; i?: number;
}) => {
  const Heading = level;
  const ref = useRef<HTMLElement>(null);
  useArtMotion(ref, it.art, i);

  return (
    <article ref={ref} className={`us-art us-art--${look}${wide ? ' us-art--wide' : ''}`} data-soon={it.soon ? '' : undefined} data-sky={it.key} style={{ '--acc': it.acc, '--oc': it.acc, '--i': i } as CSSProperties}>
      <Outline />
      <div className="us-art-board">
        <Drawing
          i={it.n}
          art={it.art}
          acc={it.acc}
          on
          out={false}
          head={null}
          fig={nn(it.n)}
          beats={it.story}
        />
      </div>
      <div className="us-art-body">
        <p className="us-art-meta">
          <span className="us-art-n">{nn(it.n)}</span>
          <span className="us-art-cat">{it.catLabel}</span>
          {it.soon && <span className="us-soon">{m.t.soon}</span>}
        </p>
        <Heading className="us-art-name">
          {it.soon ? it.name : <Link href={it.href} prefetch={false} className="us-art-link">{it.name}</Link>}
        </Heading>
        {look === 'tile' ? (
          <p className="us-art-line"><span className="us-art-hook">{it.tile}</span></p>
        ) : (
          <>
            <p className="us-art-line"><span className="us-art-hook">{it.hook}</span> {it.body}</p>
            <ol className="us-art-legend" aria-label={m.t.legendAria}>
              {it.points.map((p, j) => (
                <li key={p}><span className="us-art-legend-n" aria-hidden="true">{j + 1}</span>{p}</li>
              ))}
            </ol>
          </>
        )}
        {!it.soon && (
          <p className="us-art-foot" aria-hidden="true">
            <span className="us-art-go">{m.t.details}<ArrowRight className="us-arrow" /></span>
            <span className="us-art-round"><ArrowUpRight /></span>
          </p>
        )}
      </div>
    </article>
  );
};

/** Box "Nie wiesz, co wybrać?" (domyka siatkę): własny rysunek konsultacji (cta-art.tsx) z tym samym ruchem co karty usług,
    pod deską pytanie, zdanie i biały przycisk „Bezpłatna konsultacja”. Kolor = jasny odcień koloru marki. */
const CTA_ACC = '96 165 250';
export const CtaCard = ({ m, look = 'big', i = 0 }: { m: CatalogModel; look?: ArtLook; i?: number }) => {
  const ref = useRef<HTMLElement>(null);
  useArtMotion(ref, 'cta', i);
  return (
    <article ref={ref} className={`us-art us-art--${look} us-art--cta`} data-sky="cta" style={{ '--acc': CTA_ACC, '--oc': CTA_ACC, '--i': i } as CSSProperties}>
      <Outline />
      <div className="us-art-board">
        <CtaDrawing acc={CTA_ACC} beats={m.t.undecidedStory} />
      </div>
      <div className="us-art-body">
        <h3 className="us-art-name">{m.t.undecided}</h3>
        <p className="us-art-line">{m.t.undecidedBody}</p>
        <div className="us-art-cta">
          <Link href={m.ctaHref} prefetch={false} className="us-cta">
            {m.t.cta}
            <ArrowRight aria-hidden="true" size={18} />
          </Link>
          <span className="us-note">{m.t.ctaNote}</span>
        </div>
      </div>
    </article>
  );
};
