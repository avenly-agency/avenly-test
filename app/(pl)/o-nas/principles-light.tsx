'use client';

import { useCallback, useEffect, useMemo, useRef } from 'react';
import { GEM } from '@/lib/brand/logo';
import { axis, clamp01, lerp, pad, sm, type Pr } from './principles-kit';
import { Scene } from './scene-kit';
import { css, usePin } from './shared';
import './principles-light.css'; // prefiks on-p7-

// „W CO WIERZYMY” - SCENA „ŚWIATŁO”: wybór właściciela 2026-10-14 („światło jest git”) z pięciu propozycji (Manifest,
// Cięcie, Światło, Orbita, Z mgławicy) i wcześniejszych (Przelot, Stacje na linii, Gwiazdozbiór, Karty); pozostałe są
// w docs/archiwum/o-nas-2026-10/zasady-wersje/. Język wejścia „Panorama” (gwiazda jako źródło światła, „litery
// zapalają się z ciemności”): zasady stoją jako długa ściana ogromnych CIEMNYCH słów (sylwetki z delikatną krawędzią
// na mgławicy). Gwiazda z logo przesuwa się po ścianie, kamera jedzie za nią - litery, przez które przechodzi,
// zapalają się (jasny ślad za gwiazdą + blask wokół niej), zasada na postoju jest jasna i czytelna, nad nią numer,
// pod nią jedno zdanie; mijane zasady gasną. Komputer i telefon poziomo: ściana pozioma (zasady na przemian wyżej
// i niżej), kamera jedzie w bok; telefon pionowo: ściana pionowa, kamera jedzie w dół. Blask mgławicy podstrony stoi
// przy gwieździe (data-sky). Pierwsza pozycja = nagłówek sekcji w tym samym piśmie (bez plakietki).
// Bez JS / ograniczony ruch: nagłówek i lista zasad białymi literami (principles-kit.css).
//
// Dopracowanie 2026-10-14 (właściciel: „dostosuj do responsywności, mobile, SEO, wydajność”):
//   - miejsca liczone od samego HASŁA (nad nim stoi numer) - wcześniej od góry pozycji, więc gwiazda i światło były
//     o wysokość numeru za nisko, a na telefonie kolejne zasady mogły na siebie nachodzić,
//   - pole sceny pod nawigacją i nad dolną krawędzią (telefon: nad bąblem czatu), dwa rzędy ściany środkują się
//     w pionie i nie wychodzą poza pole (niski ekran: rzędy się zbliżają), na telefonie kamera środkuje całą pozycję
//     (numer, hasło, zdanie), gwiazda nie wychodzi za prawą krawędź ekranu,
//   - SEO: h2 i h3 to prawdziwy tekst w kolejności czytania (światło to tylko kolor liter - background-clip),
//     akcent nagłówka w kolorze marki widać bez ruchu,
//   - wydajność: ściana przesuwana transformem na własnej warstwie kompozytora (samo przesunięcie, bez skali - litery
//     zostają ostre), światło pisane tylko dla napisów przy kamerze i tylko przy zmianie, układ mierzony tylko przy
//     zmianie rozmiaru i po wczytaniu fontu.

const H0 = 18, MOVE = 46, HOLD = 30, END = 12;
const DARK = [23, 25, 31], LIGHT = [229, 235, 245];
const mixRgb = (k: number) => DARK.map((d, i) => Math.round(d + (LIGHT[i] - d) * k)).join(' ');

type P = { x: number; y: number };
type Box = { x: number; y: number; w: number; h: number; cap: number };
type Geo = { boxes: Box[]; rest: P[]; entry: P[]; cams: P[]; vertical: boolean; H: number };

export function PrinciplesLight({ t, live }: { t: Pr; live: boolean }) {
  const pin = useRef<HTMLDivElement>(null), box = useRef<HTMLDivElement>(null), strip = useRef<HTMLDivElement>(null);
  const star = useRef<HTMLSpanElement>(null);
  const geo = useRef<Geo | null>(null);
  const els = useRef<{ items: HTMLElement[]; titles: HTMLElement[]; rest: HTMLElement[][] } | null>(null);
  const prog = useRef(0);
  const N = t.items.length;
  const ax = useMemo(() => axis(N, H0, MOVE, HOLD), [N]);
  const len = ax.len + END;

  /** Ściana: miejsca haseł (w układzie ściany), punkty gwiazdy (postój za ostatnią literą, wejście przed pierwszą)
      i kadry kamery. Tylko przy zmianie rozmiaru i po wczytaniu fontu. */
  const measure = useCallback((): Geo | null => {
    const b = box.current, c = els.current;
    if (!b || !c) return null;
    const W = b.clientWidth - 48, H = b.clientHeight;
    if (W <= 0 || !H) return null;
    const vertical = W < 720;
    const low = H < 560; // telefon poziomo / niski ekran
    // pole sceny: pod nawigacją, nad dolną krawędzią (telefon pionowo: nad bąblem czatu)
    const T = vertical ? 76 : low ? 52 : 92, B = vertical ? 100 : low ? 14 : 56;
    // wymiary pozycji: hasło (z jego miejscem w pozycji - nad nim numer), cała pozycja
    const d = c.items.map((it, j) => {
      const ti = c.titles[j];
      return {
        tx: ti.offsetLeft, ty: ti.offsetTop, w: ti.offsetWidth, h: ti.offsetHeight, ih: it.offsetHeight,
        cap: 0.727 * (parseFloat(getComputedStyle(ti).fontSize) || 80),
      };
    });
    const tops: P[] = []; // lewy górny róg każdej pozycji w układzie ściany
    if (vertical) {
      let y = T + (H - T - B) * 0.18;
      d.forEach((q, j) => {
        if (j > 0) y += d[j - 1].ih + Math.max(56, (H - T - B) * 0.16);
        tops.push({ x: 0, y });
      });
    } else {
      // dwa rzędy: hasła na przemian wyżej i niżej; pod dolnym rzędem musi zmieścić się zdanie
      const above = Math.max(...d.map((q) => q.ty)), below = Math.max(...d.map((q) => q.ih - q.ty - q.h));
      const maxH = Math.max(...d.map((q) => q.h));
      let up = T + above;
      let lo = Math.max(up, Math.min(up + H * 0.2, H - B - maxH - below));
      const spare = Math.max(0, H - B - (lo + maxH + below)) / 2; // dwa rzędy na środku pola w pionie
      up += spare; lo += spare;
      let x = 0;
      d.forEach((q, j) => {
        if (j > 0) x += d[j - 1].w + W * 0.07;
        tops.push({ x: x - q.tx, y: (j % 2 === 0 ? up : lo) - q.ty });
      });
    }
    c.items.forEach((it, j) => css(it, 'transform', `translate(${tops[j].x.toFixed(1)}px, ${tops[j].y.toFixed(1)}px)`));
    const boxes: Box[] = d.map((q, j) => ({ x: tops[j].x + q.tx, y: tops[j].y + q.ty, w: q.w, h: q.h, cap: q.cap }));
    c.titles.forEach((ti, j) => ti.style.setProperty('--lr', `${(2.34 * boxes[j].cap).toFixed(1)}px`));
    // gwiazda za ostatnią literą (na telefonie nie dalej niż przy prawej krawędzi ekranu)
    const rest = boxes.map((q) => ({ x: Math.min(q.x + q.w + 0.32 * q.cap, vertical ? W + 10 : Infinity), y: q.y + q.h / 2 }));
    const entry = boxes.map((q) => ({ x: q.x - 0.5 * q.cap, y: q.y + q.h / 2 }));
    const cams = boxes.map((q, j) => (vertical
      // telefon: cała pozycja (numer, hasło, zdanie) na środku pola sceny
      ? { x: 0, y: Math.max(0, tops[j].y + d[j].ih / 2 - (T + (H - T - B) / 2)) }
      // ściana pozioma: hasło na środku kadru, nagłówek przy lewej krawędzi wrappera
      : { x: j === 0 ? 0 : Math.max(0, q.x + q.w / 2 - W / 2), y: 0 }));
    css(star.current, '--sz', `${Math.max(16, (boxes[0]?.cap ?? 60) * 0.42).toFixed(1)}px`);
    return { boxes, rest, entry, cams, vertical, H };
  }, []);

  const paint = useCallback(() => {
    const el = pin.current;
    if (!el) return;
    const c = (els.current ??= (() => {
      const items = Array.from(el.querySelectorAll<HTMLElement>('.on-p7-it'));
      return {
        items,
        titles: items.map((it) => it.querySelector<HTMLElement>('.on-p7-t')!),
        rest: items.map((it) => Array.from(it.querySelectorAll<HTMLElement>('.on-p7-n, .on-p7-d'))),
      };
    })());
    const g = (geo.current ??= measure());
    if (!g) return;
    const cam = ax.cam(prog.current * len);
    const k = Math.min(Math.floor(cam), N), q = cam - k;
    // gwiazda: postój za ostatnią literą; w przejściu łukiem do początku następnej zasady i wzdłuż niej (zapala litery)
    let p: P = g.rest[k], target = k;
    if (k < N && q > 0) {
      target = k + 1;
      const A = g.rest[k], E = g.entry[k + 1], R = g.rest[k + 1];
      if (q < 0.38) {
        const u = sm(q / 0.38);
        // ściana pionowa (telefon): łuk w dół, potem w lewo - w obrębie ekranu; pozioma: łuk górą między rzędami
        const C = g.vertical ? { x: A.x, y: E.y } : { x: (A.x + E.x) / 2, y: Math.min(A.y, E.y) - g.H * 0.12 };
        p = { x: (1 - u) ** 2 * A.x + 2 * (1 - u) * u * C.x + u * u * E.x, y: (1 - u) ** 2 * A.y + 2 * (1 - u) * u * C.y + u * u * E.y };
      } else {
        const u = sm((q - 0.38) / 0.62);
        p = { x: lerp(E.x, R.x, u), y: lerp(E.y, R.y, u) };
      }
    }
    const camP = k < N ? { x: lerp(g.cams[k].x, g.cams[k + 1].x, q), y: lerp(g.cams[k].y, g.cams[k + 1].y, q) } : g.cams[N];
    css(strip.current, 'transform', `translate3d(${(-camP.x).toFixed(2)}px, ${(-camP.y).toFixed(2)}px, 0)`);
    css(star.current, 'transform', `translate(${p.x.toFixed(2)}px, ${p.y.toFixed(2)}px)`);

    c.titles.forEach((ti, j) => {
      const bx = g.boxes[j];
      const near = Math.abs(cam - j) < 1.7;
      // jasny ślad: litery do miejsca gwiazdy (zasada, przez którą przechodzi gwiazda) albo cały napis (już oświetlony)
      const sx = j === target ? clamp01((p.x - bx.x) / Math.max(1, bx.w)) * bx.w : j < target ? bx.w + 40 : -40;
      // mijane zasady gasną za kamerą, zasada na postoju jest jasna
      const lit = j < target ? 1 - sm((cam - j - 0.15) / 0.7) : j === target ? 1 : 0;
      css(ti, '--sx', `${sx.toFixed(1)}px`);
      css(ti, '--lit', mixRgb(lit));
      css(ti, '--lx', near ? `${(p.x - bx.x).toFixed(1)}px` : '-9999px');
      css(ti, '--ly', near ? `${(p.y - bx.y).toFixed(1)}px` : '0px');
      const a = 1 - sm(Math.abs(cam - j) / 0.2);
      c.rest[j].forEach((x) => { css(x, 'opacity', a.toFixed(3)); css(x, 'visibility', a < 0.002 ? 'hidden' : 'visible'); });
    });
  }, [ax, len, measure, N]);

  useEffect(() => {
    if (!live) return;
    const b = box.current;
    if (!b) return;
    const ro = new ResizeObserver(() => { geo.current = null; paint(); });
    ro.observe(b);
    let dead = false;
    document.fonts?.ready.then(() => { if (!dead) { geo.current = null; paint(); } });
    return () => { dead = true; ro.disconnect(); geo.current = null; els.current = null; };
  }, [live, paint]);
  usePin(pin, (p) => { prog.current = p; paint(); }, live);

  return (
    <section className="on-sec on-p7" aria-labelledby="on-p7-h">
      <Scene pin={pin} len={len}>
        <div ref={box} className="container mx-auto px-6 on-p7-box">
          <div ref={strip} className="on-p7-strip">
            {/* gwiazda z logo - źródło światła (data-sky: blask mgławicy podstrony stoi przy niej) */}
            <span ref={star} className="on-pk-fx on-p7-star" data-sky="" aria-hidden="true">
              <svg viewBox="-20 -20 40 40" focusable="false"><path d={GEM} /></svg>
            </span>
            <header className="on-p7-it on-p7-head">
              <h2 id="on-p7-h" className="on-pk-h on-p7-t">{t.heading} <span className="on-pk-acc">{t.headingAccent}</span></h2>
              <p className="on-pk-lead on-p7-d">{t.lead}</p>
            </header>
            <ol className="on-pk-list on-p7-list">
              {t.items.map((it, i) => (
                <li key={i} className="on-p7-it">
                  <p className="on-pk-n on-p7-n" aria-hidden="true">{pad(i + 1)} / {pad(N)}</p>
                  <h3 className="on-pk-t on-p7-t">{it.title}</h3>
                  <p className="on-pk-d on-p7-d">{it.desc}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </Scene>
    </section>
  );
}
