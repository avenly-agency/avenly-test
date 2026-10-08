'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Sketch } from './sketch';
import { useReducedPref } from './shared';

// SZKIC -> GOTOWE na prawdziwej treści: blok najpierw rysuje się jako szkic (kreski i ramki z pomiaru treści -
// sketch.tsx), potem ukośna linia światła odsłania spod niego gotową treść. To ruch, który właściciel wskazał przy
// Ofercie („zajebiście mi się podoba ten motion reveal elementów na makietach”) - tu na samej stronie, nie w makiecie.
//   start="intro" - po wejściu tekstu podstrony (data-go na .sv): pierwszy ekran,
//   start="view"  - gdy blok pokaże się na ekranie (i podstrona jest po wejściu).
// Bez JS i przy ograniczonym ruchu treść widać od razu (maska tylko przy ruchu, bezpiecznik 7 s w usluga.css).

const ease = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

export const SketchReveal = ({ children, start = 'view', className, sweepAfter = 650, sweepMs = 1250 }: {
  children: ReactNode; start?: 'intro' | 'view'; className?: string;
  /** Po ilu ms od startu rysowania rusza odsłona i ile trwa. */
  sweepAfter?: number; sweepMs?: number;
}) => {
  const reduced = useReducedPref();
  const ref = useRef<HTMLDivElement>(null);
  const realRef = useRef<HTMLDivElement>(null);
  /** 0 = czeka, 1 = rysuje się i odsłania, 2 = gotowe. */
  const [phase, setPhase] = useState(0);
  const done = reduced || phase === 2;

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;
    const root = el.closest('.sv');
    const gate = start === 'intro' ? 'data-go' : 'data-on';
    let inView = start === 'intro', fired = false, raf = 0, tm = 0;
    const run = () => {
      if (fired || !inView || (root && !root.hasAttribute(gate))) return;
      fired = true;
      io?.disconnect(); mo?.disconnect();
      setPhase(1);
      tm = window.setTimeout(() => {
        const t0 = performance.now();
        const tick = (now: number) => {
          const k = Math.min(1, (now - t0) / sweepMs);
          el.style.setProperty('--rv', (-4 + ease(k) * 112).toFixed(2));
          el.style.setProperty('--rvo', Math.min(1, k * 10, (1 - k) * 6).toFixed(3));
          if (k < 1) raf = requestAnimationFrame(tick); else setPhase(2);
        };
        raf = requestAnimationFrame(tick);
      }, sweepAfter);
    };
    const io = start === 'view' ? new IntersectionObserver(([e]) => { inView = e.isIntersecting; run(); }, { threshold: 0.18, rootMargin: '0px 0px -8% 0px' }) : null;
    io?.observe(el);
    const mo = root ? new MutationObserver(run) : null;
    if (root) mo?.observe(root, { attributes: true, attributeFilter: [gate] });
    run();
    return () => { io?.disconnect(); mo?.disconnect(); cancelAnimationFrame(raf); window.clearTimeout(tm); };
  }, [reduced, start, sweepAfter, sweepMs]);

  return (
    <div ref={ref} className={className ? `sv-rvb ${className}` : 'sv-rvb'} data-done={done ? '' : undefined}>
      <div ref={realRef} className="sv-rvb-real">{children}</div>
      {!done && <div className="sv-rvb-sk" aria-hidden="true"><Sketch target={realRef} draw={phase === 1} /></div>}
      {!done && <i className="sv-rvb-beam" aria-hidden="true" />}
    </div>
  );
};
