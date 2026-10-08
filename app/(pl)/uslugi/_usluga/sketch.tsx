'use client';

import { useEffect, useState, type CSSProperties, type RefObject } from 'react';

// SZKIC z prawdziwego układu: rysunek techniczny (język rysunków Oferty: włosowe ramki, „tekst” jako kreski, akcent
// w kolorze usługi) generowany z POMIARU gotowego elementu - każda linijka tekstu staje się kreską, elementy oznaczone
// data-sk ramkami. Dzięki temu szkic i gotowa treść pokrywają się co do piksela bez dublowania treści w DOM
// (dawna makieta one-page trzymała dwie kopie tej samej struktury).
// Oznaczenia w treści: data-sk="box" (ramka), "btn" (przycisk - akcent), "img" (ramka z przekątnymi, bez wnętrza),
// "field" (pole formularza), "rule" (linia pozioma), "skip" (pomiń z wnętrzem).
// Rysowanie: linie rysują się po kolei (stroke-dashoffset, opóźnienie --d), gdy `draw` = true; po narysowaniu
// (data-draw="2") kreskowanie jest zdejmowane - pathLength + stroke-dasharray zostawiały w liniach drobne przerwy.
// Style: .sv-sk w usluga.css (grubość linii mnożona przez --sv-skw - pogrubienie w pomniejszonym kadrze).
// Pomiar zakłada, że między `target` a jego treścią nie ma skalowania ani obrotu (samo przesunięcie jest w porządku).

export type SketchKind = 'box' | 'soft' | 'acc' | 'bar' | 'hi' | 'xl' | 'accbar';
export interface SketchItem { k: SketchKind; d: string; sw?: number }
type Item = SketchItem;

const f = (n: number) => +n.toFixed(1);
const rr = (x: number, y: number, w: number, h: number, r: number) => {
  const q = Math.max(0, Math.min(r, w / 2, h / 2));
  return q
    ? `M${f(x + q)} ${f(y)}H${f(x + w - q)}A${f(q)} ${f(q)} 0 0 1 ${f(x + w)} ${f(y + q)}V${f(y + h - q)}A${f(q)} ${f(q)} 0 0 1 ${f(x + w - q)} ${f(y + h)}H${f(x + q)}A${f(q)} ${f(q)} 0 0 1 ${f(x)} ${f(y + h - q)}V${f(y + q)}A${f(q)} ${f(q)} 0 0 1 ${f(x + q)} ${f(y)}Z`
    : `M${f(x)} ${f(y)}H${f(x + w)}V${f(y + h)}H${f(x)}Z`;
};

/** Pomiar elementu: kreski i ramki we współrzędnych elementu (px). Używany też przez plany / miniatury stron. */
export const scanSketch = (root: HTMLElement): { items: Item[]; w: number; h: number } => {
  // na czas pomiaru podstrona zdejmuje własne przekształcenia sterowane przewijaniem (.sv[data-scan] w jej CSS)
  const sv = root.closest('.sv');
  sv?.setAttribute('data-scan', '');
  const R = root.getBoundingClientRect();
  const items: Item[] = [];
  const range = document.createRange();

  const text = (node: Text, fs: number, inBtn: boolean) => {
    range.selectNodeContents(node);
    const lines: { l: number; r: number; t: number; b: number }[] = [];
    for (const c of range.getClientRects()) {
      if (c.width < 2) continue;
      const hit = lines.find((ln) => Math.abs((ln.t + ln.b) / 2 - (c.top + c.height / 2)) < c.height * 0.5);
      if (hit) { hit.l = Math.min(hit.l, c.left); hit.r = Math.max(hit.r, c.right); } else lines.push({ l: c.left, r: c.right, t: c.top, b: c.bottom });
    }
    const th = Math.min(18, Math.max(3, fs * 0.4));
    for (const ln of lines) {
      const y = (ln.t + ln.b) / 2 - R.top, x0 = ln.l - R.left + th / 2, x1 = Math.max(x0 + 0.1, ln.r - R.left - th / 2);
      items.push({ k: inBtn ? 'accbar' : fs >= 30 ? 'xl' : fs >= 17 ? 'hi' : 'bar', d: `M${f(x0)} ${f(y)}H${f(x1)}`, sw: f(th) });
    }
  };

  const walk = (el: Element, inBtn: boolean) => {
    const sk = (el as HTMLElement).dataset?.sk;
    if (sk === 'skip') return;
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden') return;
    let btn = inBtn;
    if (sk) {
      const r = el.getBoundingClientRect();
      const x = r.left - R.left, y = r.top - R.top, rad = parseFloat(cs.borderTopLeftRadius) || 0;
      if (r.width > 1 && r.height > 0) {
        if (sk === 'rule') items.push({ k: 'soft', d: `M${f(x)} ${f(y)}H${f(x + r.width)}` });
        else if (sk === 'img') {
          items.push({ k: 'box', d: rr(x, y, r.width, r.height, rad) });
          const q = rad * 0.3; // przekątne kończą się na zaokrąglonych narożnikach
          items.push({ k: 'soft', d: `M${f(x + q)} ${f(y + q)}L${f(x + r.width - q)} ${f(y + r.height - q)}M${f(x + r.width - q)} ${f(y + q)}L${f(x + q)} ${f(y + r.height - q)}` });
          return;
        } else if (sk === 'btn') { items.push({ k: 'acc', d: rr(x, y, r.width, r.height, rad) }); btn = true; }
        else items.push({ k: sk === 'field' ? 'soft' : 'box', d: rr(x, y, r.width, r.height, rad) });
      }
    }
    const fs = parseFloat(cs.fontSize) || 16;
    for (const n of el.childNodes) {
      if (n.nodeType === 1) walk(n as Element, btn);
      else if (n.nodeType === 3 && n.textContent && n.textContent.trim()) text(n as Text, fs, btn);
    }
  };
  walk(root, false);
  const size = { w: root.offsetWidth, h: root.offsetHeight };
  sv?.removeAttribute('data-scan');
  return { items, ...size };
};

export const Sketch = ({ target, draw = true, className }: {
  target: RefObject<HTMLElement | null>;
  /** Linie rysują się, gdy true (przed tym szkic jest pusty); bez ruchu - od razu cały. */
  draw?: boolean;
  className?: string;
}) => {
  const [g, setG] = useState<{ items: Item[]; w: number; h: number } | null>(null);
  const [done, setDone] = useState(false);
  const count = g?.items.length ?? 0;

  // po narysowaniu ostatniej linii: stan „gotowe” (bez kreskowania)
  useEffect(() => {
    if (!draw || !count) return;
    const id = window.setTimeout(() => setDone(true), count * Math.min(26, 1300 / count) + 1100);
    return () => window.clearTimeout(id);
  }, [draw, count]);

  useEffect(() => {
    const el = target.current;
    if (!el) return;
    let raf = 0, dead = false, lw = -1, lh = -1;
    const run = () => { raf = 0; if (dead) return; lw = el.offsetWidth; lh = el.offsetHeight; setG(scanSketch(el)); };
    const ask = () => { if (!raf) raf = requestAnimationFrame(run); };
    ask();
    // pomiar od nowa tylko przy zmianie rozmiaru (nie przy każdym przesunięciu) i po wczytaniu fontów
    const ro = new ResizeObserver(() => { if (el.offsetWidth !== lw || el.offsetHeight !== lh) ask(); });
    ro.observe(el);
    document.fonts?.ready.then(() => { if (!dead) ask(); }).catch(() => {});
    return () => { dead = true; cancelAnimationFrame(raf); ro.disconnect(); };
  }, [target]);

  if (!g) return null;
  const step = Math.min(26, 1300 / Math.max(1, g.items.length));
  return (
    <svg
      className={className ? `sv-sk ${className}` : 'sv-sk'} data-draw={draw ? (done ? '2' : '1') : '0'} width={g.w} height={g.h}
      viewBox={`0 0 ${g.w} ${g.h}`} aria-hidden="true" focusable="false"
    >
      {g.items.map((it, i) => (
        <path
          key={i} d={it.d} pathLength={1} className={`sv-sk-${it.k}`}
          style={{ '--d': `${Math.round(i * step)}ms`, strokeWidth: it.sw } as CSSProperties}
        />
      ))}
    </svg>
  );
};
