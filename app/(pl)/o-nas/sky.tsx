'use client';

import { useEffect, useRef, type CSSProperties } from 'react';
import { GEM } from '@/lib/brand/logo';
import { css, useFrame } from './shared';

// Tło O nas: nocne niebo z ostrymi gwiazdami (jak niebo w hero strony głównej i gwiazda nowego logo) - bez WebGL,
// bez mgiełek i poświat. Dwie warstwy z paralaksą przy przewijaniu (dalsza wolniej), kilka „klejnotów” mruga
// samym kryciem (warstwa kompozytora). Płótno przyklejone do okna za całą treścią podstrony.

let seed = 1009;
const rnd = () => {
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
const dots = (n: number, rMin: number, rMax: number, oMin: number, oMax: number) =>
  Array.from({ length: n }, () => ({
    x: +(rnd() * 100).toFixed(2), y: +(rnd() * 100).toFixed(2),
    r: +(rMin + rnd() * (rMax - rMin)).toFixed(2), o: +(oMin + rnd() * (oMax - oMin)).toFixed(2),
  }));
// Stała tablica (ten sam układ na serwerze i w przeglądarce).
const FAR = dots(150, 0.45, 0.9, 0.18, 0.5);
const NEAR = dots(46, 0.8, 1.35, 0.3, 0.7);
const GEMS = [
  [8, 14, 7, 0], [91, 9, 9, 1.4], [77, 37, 6, 2.6], [17, 58, 8, 0.8], [62, 71, 7, 3.4], [94, 63, 6, 2],
  [36, 26, 5, 4.1], [48, 90, 8, 1.1], [5, 86, 6, 3],
].map(([x, y, s, d]) => ({ x, y, s, d }));

export function Sky({ live }: { live: boolean }) {
  const far = useRef<HTMLDivElement>(null);
  const near = useRef<HTMLDivElement>(null);
  const maxRef = useRef(0); // wysokość przewijania liczona raz (i po zmianie rozmiaru) - bez odczytu układu w klatce
  useEffect(() => {
    const reset = () => { maxRef.current = 0; };
    window.addEventListener('resize', reset);
    return () => window.removeEventListener('resize', reset);
  }, []);
  useFrame((frac) => {
    if (!maxRef.current) maxRef.current = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const t = Math.min(1, Math.max(0, (window.scrollY + frac) / maxRef.current));
    css(far.current, 'transform', `translate3d(0, ${(-t * 35).toFixed(3)}vh, 0)`);
    css(near.current, 'transform', `translate3d(0, ${(-t * 70).toFixed(3)}vh, 0)`);
  }, live);

  return (
    <div className="on-sky" aria-hidden="true">
      <div ref={far} className="on-sky-l on-sky-far">
        <svg className="on-sky-svg">
          {FAR.map((d, i) => <circle key={i} cx={`${d.x}%`} cy={`${d.y}%`} r={d.r} fillOpacity={d.o} />)}
        </svg>
      </div>
      <div ref={near} className="on-sky-l on-sky-near">
        <svg className="on-sky-svg">
          {NEAR.map((d, i) => <circle key={i} cx={`${d.x}%`} cy={`${d.y}%`} r={d.r} fillOpacity={d.o} />)}
        </svg>
        {GEMS.map((g, i) => (
          <svg
            key={i} className="on-sky-gem" viewBox="-20 -20 40 40"
            style={{ left: `${g.x}%`, top: `${g.y}%`, width: g.s * 2, height: g.s * 2, '--d': `${g.d}s` } as CSSProperties}
          >
            <path d={GEM} />
          </svg>
        ))}
      </div>
    </div>
  );
}
