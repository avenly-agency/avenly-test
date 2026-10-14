'use client';

import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { BASE_MS, CYCLE, DRAW_MS, Drawing, beatFrames, liveFrames, timing } from '@/components/sections/services/drawings';
import type { ArtId } from '@/components/sections/services/shared';
import type { Locale } from '@/lib/i18n/locale';
import type { ONasDict } from '@/lib/i18n/o-nas';
import { BRAND_TINT, tintAttr, type Tint } from './page-sky';
import { More } from './sec-clients-parts';
import { Scene } from './scene-kit';
import { attr, css, flag, seg, text, useEnter, usePin } from './shared';
import './offer.css'; // prefiks on-of-

// „CO ROBIMY” - „OD PIERWSZEGO WRAŻENIA” (2026-10-14, w miejscu usuniętej sekcji „Nasz znak”). Właściciel: „sekcje nasz
// znak wywala (…) przekmin co by pasowało i dopasuj ją poziomem do całej strony”; temat wybrał z trzech. Po pierwszej
// wersji (układ „Portalu”: tekst po lewej, kadr po prawej): „zajebisty concept, ale layout znowu ten sam - tekst po lewej,
// po prawej box; zrób bardziej premium, a nie tak zwyczajnie”. Koncept zostaje, układ jest inny:
//
// JEDNO UJĘCIE NA CAŁY EKRAN, BEZ KADRU. Stół z rysunkami usług (te same rysunki techniczne co w Ofercie i katalogu
// /uslugi - components/sections/services/drawings.tsx, tylko używane) leży wprost na mgławicy podstrony, a na dole ekranu
// stoi pas tytułowy jak w „Plakacie”: ogromna nazwa przy lewej krawędzi wrappera, zdanie i link przy prawej, nad nimi
// linia postępu z licznikiem (jak w sekcji Blog na stronie głównej).
//   - pierwszy ekran: cały stół z sześcioma pustymi arkuszami, które rysują się piórem jeden po drugim, w pasie tytułowym
//     nagłówek sekcji wielkim pismem („Od pierwszego wrażenia / po porządek w firmie.”) i opis,
//   - przewijanie prowadzi kamerę: najazd na arkusz pierwszej usługi (duży, pośrodku, sąsiednie wystają zza krawędzi
//     ekranu), między usługami odjazd nad stół, przejazd i najazd - jedno ciągłe ujęcie; na postoju powolny najazd,
//   - arkusz w ostrości „unosi się” (sąsiednie stoją trochę mniejsze i przygaszone), jego krawędź świeci kolorem usługi,
//   - rysunek w ostrości ożywa scenką w trzech krokach (pętla na czas, jak w Ofercie), podpis kroku pod arkuszem jak napisy,
//   - nazwa usługi wysuwa się spod maski (jak słowa „Plakatu”), poprzednia odjeżdża w górę,
//   - mgławica bierze kolor usługi w ostrości (data-sky / data-tint na kotwicy w miejscu arkusza), akcenty tekstu też.
// Gwiazda z logo jako okno NIE jest tu użyta - otwiera strony klientów w sekcji tuż wyżej (znak firmowy oszczędnie).
// Bez JS / ograniczony ruch: nagłówek, lista usług z linkami i siatka narysowanych rysunków.
//
// OSTROŚĆ I WYDAJNOŚĆ: kamera = transform 2D na stole pisany w klatce przewijania, BEZ will-change i bez translate3d
// (stała warstwa kompozytora rastrowałaby rysunki w jednej skali i rozmywała linie przy najeździe); bez kamery Oferty
// wewnątrz rysunku. Linie mają stałą grubość na ekranie: --u = 1 / skala kamery (zapis przy zmianie o ponad 4%).
// Arkusze, które nie mieszczą się w polu sceny w pionie (nad pasem tytułowym / pod nawigacją) albo leżą całe poza
// ekranem w poziomie, gasną i nie są malowane. Scenkę gra tylko rysunek w ostrości; poza ekranem stoi wszystko.
// Geometria pola sceny tylko przy zmianie rozmiaru.
// Optymalizacja 2026-10-14 (właściciel: „zoptymalizuj pod SEO, wydajność, responsywność, a szczególnie na telefony”):
//   - rysunki (ok. 600 elementów SVG, ozdoba - aria-hidden) nie są w HTML z serwera i nie hydratują się z całą stroną:
//     dokłada je przeglądarka, gdy sekcja jest 1500 px od ekranu (mniejszy HTML i DOM, krótsza hydratacja wejścia),
//   - SEO: nagłówek h2, nazwy usług w h3, zdania i linki do podstron usług (nazwa usługi w nazwie linku) są w HTML
//     od razu, w kolejności czytania (pas tytułowy przed stołem),
//   - telefon: pas tytułowy niżej (32 px nad dołem - link stoi przy lewej krawędzi, a ostatni wiersz tekstu nad bąblem
//     czatu), w pasie samo pierwsze zdanie usługi (reszta jest na jej podstronie), na niskich telefonach bez podpisu
//     kroku pod arkuszem - arkusz zostaje duży.

type OfferCopy = ONasDict['offer'];

/** Wygląd usługi (klucz = polska ścieżka podstrony): rysunek i jego akcent jak w Ofercie (LOOK w
    components/sections/services/shared.tsx), barwa mgławicy jak tło jej podstrony (app/(pl)/uslugi/_usluga/theme.ts)
    i akcent tekstu = kolor motywu podstrony (lib/service-theme.ts). */
const LOOK: Record<string, { art: ArtId; acc: string; kc: string; tint: Tint }> = {
  '/uslugi/strony-www/one-page': { art: 'onepage', acc: '147 197 253', kc: '59 130 246', tint: [[0.23, 0.51, 0.96], [0.08, 0.12, 0.42]] },
  '/uslugi/strony-www/strona-firmowa': { art: 'company', acc: '110 231 183', kc: '16 185 129', tint: [[0.06, 0.72, 0.5], [0.02, 0.2, 0.16]] },
  '/uslugi/strony-www/strona-szyta-na-miare': { art: 'custom', acc: '253 164 175', kc: '244 63 94', tint: [[0.95, 0.25, 0.38], [0.34, 0.03, 0.12]] },
  '/uslugi/strony-www/sklep-internetowy': { art: 'store', acc: '252 211 77', kc: '245 158 11', tint: [[0.96, 0.62, 0.06], [0.42, 0.14, 0.02]] },
  '/uslugi/strony-www/system-crm': { art: 'crm', acc: '125 211 252', kc: '14 165 233', tint: [[0.06, 0.64, 0.92], [0.03, 0.14, 0.36]] },
  '/uslugi/automatyzacje-ai/chatboty-ai': { art: 'chat', acc: '253 186 116', kc: '249 115 22', tint: [[0.98, 0.45, 0.1], [0.4, 0.1, 0.02]] },
};
const FALLBACK = LOOK['/uslugi/strony-www/one-page'];
const BRAND_KC = '59 130 246';

// STÓŁ: arkusz = rysunek 640 × 360 z marginesem (jednostki stołu = px układu przy skali 1). Miejsca wężykiem: górny
// rząd od lewej, dolny od prawej - kamera przechodzi z rzędu do rzędu krótkim zjazdem, a nie przez cały stół.
const PW = 704, PH = 396, GX = 96, GY = 120;
const TW = 3 * PW + 2 * GX, TH = 2 * PH + GY;
const SLOTS: [number, number][] = [[0, 0], [1, 0], [2, 0], [2, 1], [1, 1], [0, 1]];
const slot = (k: number) => {
  const [c, r] = SLOTS[k % SLOTS.length];
  return { x: c * (PW + GX), y: r * (PH + GY) };
};
const center = (k: number) => { const s = slot(k); return { x: s.x + PW / 2, y: s.y + PH / 2 }; };
/** Odstęp startu rysowania kolejnych arkuszy (ms). */
const STAGGER = 150;
/** Wysokość podpisu kroku pod arkuszem (px) - rezerwa w polu sceny. */
const CAP = 46;
/** Pas wygaszania arkuszy na górnej / dolnej granicy pola sceny (px). */
const FADE = 56;

// OŚ SCENY w vh przewinięcia: widok stołu z nagłówkiem, najazd na pierwszy arkusz, potem dla każdej usługi postój
// i przejazd do następnej; na końcu krótki postój na ostatniej.
const H0 = 24, DIVE = 42, HOLD = 40, MOVE = 36, TAIL = 16;
/** Powolny najazd na postoju (o tyle rośnie skala). */
const PUSH = 0.05;
const holdAt = (k: number) => H0 + DIVE + k * (HOLD + MOVE);
/** Przejście, które wprowadza usługę k ([początek, koniec] w vh). */
const inOf = (k: number): [number, number] => (k === 0 ? [H0, H0 + DIVE] : [holdAt(k) - MOVE, holdAt(k)]);
const mid = ([a, b]: [number, number]) => (a + b) / 2;

/** „Chwyt. Konkret.” → [chwyt, konkret] (pierwsze zdanie i reszta; na telefonie w pasie tytułowym stoi sam chwyt). */
const splitLine = (line: string): [string, string] => {
  const m = line.match(/^(.+?[.!?])\s+(.+)$/);
  return m ? [m[1], m[2]] : [line, ''];
};
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp = (v: number, a: number, b: number) => (v < a ? a : v > b ? b : v);
const nn = (k: number) => String(k + 1).padStart(2, '0');
const d = (n: number) => ({ '--d': n }) as CSSProperties;

/** cubic-bezier(.65, 0, .35, 1) - ta sama krzywa co rysowanie linii w CSS (--draw) - prowadzi pióro. */
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

/** Pole sceny (px względem kompozycji 100svh) i skale kamery - liczone tylko przy zmianie rozmiaru.
    (x0, y0) = środek arkusza w ostrości, top / bot = granice pola w pionie (arkusze poza nimi gasną),
    sf = arkusz w ostrości, so = cały stół, dip = odjazd w połowie przejazdu k → k + 1 (logarytm skali), w = szerokość
    kompozycji, cap = miejsce na podpis kroku pod arkuszem (0 = bez podpisu - niski telefon). */
type Geo = { x0: number; y0: number; top: number; bot: number; sf: number; so: number; dip: number[]; w: number; cap: number };
const geoOf = (fit: DOMRect, band: DOMRect, n: number): Geo | null => {
  const W = fit.width, H = fit.height;
  if (!W || !H) return null;
  const bt = band.top - fit.top, bl = band.left - fit.left;
  // pas tytułowy na dole (komputer, telefon pionowo) albo z boku (telefon poziomo)
  const side = band.width < W * 0.6;
  const narrow = W < 768;
  // niski telefon w pionie: bez podpisu kroku pod arkuszem, żeby arkusz został duży (scenka i tak tłumaczy się sama)
  const cap = narrow && !side && H < 600 ? 0 : CAP;
  const sx = side ? bl + band.width + 20 : 0;
  const sw = side ? W - sx - 84 : W;
  const top = side ? 56 : narrow ? 72 : 92;
  // nad pasem tytułowym stoi licznik z linią postępu (offer.css: .on-of-meter) - pole sceny kończy się nad nim
  const bot = side ? H - 12 : bt - (narrow ? 40 : 48);
  const sh = Math.max(80, bot - top - cap);
  const sf = Math.min(0.9 * sh / PH, (side ? 0.94 : narrow ? 0.9 : 0.62) * sw / PW);
  const so = 0.9 * Math.min(sw / TW, sh / TH);
  const dip: number[] = [];
  for (let k = 0; k < n - 1; k++) {
    const a = slot(k), b = slot(k + 1);
    const sm = 0.92 * Math.min(sw / (Math.abs(b.x - a.x) + PW), sh / (Math.abs(b.y - a.y) + PH));
    dip.push(Math.max(0, Math.log(sf * (1 + PUSH / 2)) - Math.log(sm)));
  }
  return { x0: sx + sw / 2, y0: top + sh / 2, top, bot, sf, so, dip, w: W, cap };
};

/** Kamera w chwili sv: środek kadru (jednostki stołu), skala i waga widoku całego stołu (1 = cały stół). */
const camAt = (sv: number, g: Geo, n: number) => {
  const c0 = center(0);
  if (sv <= H0) return { cx: TW / 2, cy: TH / 2, s: g.so, ov: 1 };
  if (sv < H0 + DIVE) {
    const e = seg(sv, H0, H0 + DIVE);
    return { cx: lerp(TW / 2, c0.x, e), cy: lerp(TH / 2, c0.y, e), s: Math.exp(lerp(Math.log(g.so), Math.log(g.sf), e)), ov: 1 - e };
  }
  for (let k = 0; k < n; k++) {
    const a = holdAt(k), b = a + HOLD, ck = center(k);
    if (sv <= b || k === n - 1) {
      return { cx: ck.x, cy: ck.y, s: g.sf * (1 + PUSH * seg(sv, a, b)), ov: 0 };
    }
    if (sv < b + MOVE) {
      const e = seg(sv, b, b + MOVE), c1 = center(k + 1);
      const ls = lerp(Math.log(g.sf * (1 + PUSH)), Math.log(g.sf), e) - g.dip[k] * Math.sin(Math.PI * e);
      return { cx: lerp(ck.x, c1.x, e), cy: lerp(ck.y, c1.y, e), s: Math.exp(ls), ov: 0 };
    }
  }
  return { cx: c0.x, cy: c0.y, s: g.sf, ov: 0 };
};

/** Pozycja tekstu w pasie tytułowym: nazwa wysuwa się spod maski z dołu i odjeżdża w górę, reszta przenika się. */
type Line = { el: HTMLElement; rise: HTMLElement[]; fade: HTMLElement[] };
const show = (l: Line, tin: number, out: number) => {
  const o = tin * (1 - out);
  css(l.el, 'visibility', tin < 0.002 || out > 0.998 ? 'hidden' : 'visible');
  flag(l.el, 'data-on', o > 0.6);
  const y = (1 - tin) * 112 - out * 112;
  l.rise.forEach((r) => css(r, 'transform', Math.abs(y) < 0.05 ? 'none' : `translate3d(0, ${y.toFixed(2)}%, 0)`));
  const f = (1 - tin) * 16 - out * 16;
  l.fade.forEach((r) => { css(r, 'opacity', o.toFixed(3)); css(r, 'transform', Math.abs(f) < 0.05 ? 'none' : `translate3d(0, ${f.toFixed(2)}px, 0)`); });
};

type Els = { lines: Line[]; plates: HTMLElement[]; caps: HTMLElement[] };

export function Offer({ t, locale, live }: { t: OfferCopy; locale: Locale; live: boolean }) {
  const root = useRef<HTMLElement>(null);
  const pin = useRef<HTMLDivElement>(null), table = useRef<HTMLDivElement>(null), band = useRef<HTMLDivElement>(null);
  const glow = useRef<HTMLDivElement>(null), cap = useRef<HTMLParagraphElement>(null);
  const bar = useRef<HTMLDivElement>(null), count = useRef<HTMLSpanElement>(null);
  const intro = useRef<HTMLElement>(null);
  const geo = useRef<Geo | null>(null);
  const els = useRef<Els | null>(null);
  const prog = useRef(0);
  const lastU = useRef(0);
  const act = useRef(-2);          // usługa w ostrości (-1 = widok stołu, -2 = jeszcze nie ustawione)
  const vis = useRef(false);       // sekcja na ekranie
  const drawnAt = useRef(-1);      // chwila startu rysowania stołu (performance.now)
  const stories = useRef<(Animation[] | null)[]>([]);
  // rysunki dokładane dopiero, gdy sekcja jest 1500 px od ekranu (nie ma ich w HTML z serwera - ozdoba, aria-hidden)
  const [near, setNear] = useState(false);
  const items = t.items;
  const n = items.length;
  const looks = useMemo(() => items.map((it) => LOOK[it.href] ?? FALLBACK), [items]);
  const lines = useMemo(() => items.map((it) => splitLine(it.line)), [items]);
  const len = H0 + DIVE + n * HOLD + (n - 1) * MOVE + TAIL;
  useEnter(intro, live, 0.1);

  useEffect(() => {
    const sec = root.current;
    if (!sec || near) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { io.disconnect(); setNear(true); } }, { rootMargin: '1500px 0px' });
    io.observe(sec);
    return () => io.disconnect();
  }, [near]);

  /** Scenka rysunku k (i podpisy jego kroków): tworzona przy pierwszym wejściu w ostrość, startuje po narysowaniu. */
  const story = useCallback((k: number) => {
    const have = stories.current[k];
    if (have) return have;
    const plate = els.current?.plates[k], cg = els.current?.caps[k];
    // rysunek jeszcze nie dołożony: bez zapamiętania (scenka powstanie przy następnej zmianie)
    if (!plate || !cg || !plate.querySelector('.of-dw')) return null;
    const art = (LOOK[items[k]?.href] ?? FALLBACK).art;
    const now = performance.now();
    const from = drawnAt.current < 0 ? now : drawnAt.current;
    const done = from + BASE_MS + k * STAGGER + timing(art).end + 700;
    const opts: KeyframeAnimationOptions = { duration: CYCLE, delay: Math.max(0, done - now), iterations: Infinity, easing: 'linear', fill: 'forwards' };
    const list: Animation[] = [];
    plate.querySelectorAll<SVGElement>('[data-lv]').forEach((el) => {
      liveFrames(Number(el.dataset.lv), art).forEach(({ frames }) => list.push(el.animate(frames, opts)));
    });
    cg.querySelectorAll<HTMLElement>('[data-beat]').forEach((el) => list.push(el.animate(beatFrames(Number(el.dataset.beat)), opts)));
    stories.current[k] = list;
    return list;
  }, [items]);
  const run = useCallback((k: number, on: boolean) => {
    if (k < 0) return;
    if (on) story(k)?.forEach((a) => a.play());
    else stories.current[k]?.forEach((a) => a.pause());
  }, [story]);

  /** Pole sceny z położenia pasa tytułowego: kotwica blasku mgławicy w miejscu arkusza w ostrości, podpis pod nim. */
  const measure = useCallback(() => {
    const el = pin.current, bd = band.current;
    const fit = el?.querySelector<HTMLElement>('.on-k-fit');
    if (!fit || !bd) return null;
    const g = geoOf(fit.getBoundingClientRect(), bd.getBoundingClientRect(), n);
    if (!g) return null;
    const w = PW * g.sf, h = PH * g.sf;
    const gl = glow.current?.style;
    if (gl) { gl.left = `${(g.x0 - w / 2).toFixed(1)}px`; gl.top = `${(g.y0 - h / 2).toFixed(1)}px`; gl.width = `${w.toFixed(1)}px`; gl.height = `${h.toFixed(1)}px`; }
    flag(root.current, 'data-nocap', g.cap === 0);
    const cs = cap.current?.style;
    // podpis pod dolną krawędzią arkusza (z zapasem na powolny najazd na postoju)
    if (cs) { cs.left = `${g.x0.toFixed(1)}px`; cs.top = `${(g.y0 + (h / 2) * (1 + PUSH) + 12).toFixed(1)}px`; cs.width = `${Math.max(240, w).toFixed(1)}px`; }
    return g;
  }, [n]);

  const paint = useCallback(() => {
    const el = pin.current, tb = table.current;
    if (!el || !tb) return;
    const g = (geo.current ??= measure());
    if (!g) return;
    const c = (els.current ??= {
      lines: Array.from(el.querySelectorAll<HTMLElement>('.on-of-t')).map((x) => ({
        el: x,
        rise: Array.from(x.querySelectorAll<HTMLElement>('.on-of-rise')),
        fade: Array.from(x.querySelectorAll<HTMLElement>('.on-of-fade')),
      })),
      plates: Array.from(tb.querySelectorAll<HTMLElement>('.on-of-plate')),
      caps: Array.from(el.querySelectorAll<HTMLElement>('.on-of-capg')),
    });
    const sv = prog.current * len; // vh przewinięte w scenie

    // kamera: transform 2D na stole (bez warstwy kompozytora - rysunek ostry w każdej skali)
    const cam = camAt(sv, g, n);
    const tx = g.x0 - cam.cx * cam.s, ty = g.y0 - cam.cy * cam.s;
    css(tb, 'transform', `translate(${tx.toFixed(2)}px, ${ty.toFixed(2)}px) scale(${cam.s.toFixed(4)})`);
    // grubość linii na ekranie: zapis co ok. 4% zmiany skali (różnica niewidoczna, mniej przeliczeń stylu rysunków)
    const u = clamp(1 / cam.s, 0.6, 3.6);
    if (Math.abs(u - lastU.current) > lastU.current * 0.04) { lastU.current = u; css(tb, '--u', u.toFixed(3)); }
    // arkusz w ostrości unosi się, dalsze stoją niżej i przygasają; arkusze poza polem sceny w pionie gasną,
    // arkusze całe poza ekranem w poziomie nie są malowane
    c.plates.forEach((pl, k) => {
      const q = center(k), s0 = slot(k);
      const close = 1 - Math.min(1, Math.hypot(cam.cx - q.x, cam.cy - q.y) / (PW + GX));
      const lift = Math.max(cam.ov, close);
      const top = ty + s0.y * cam.s, bot = top + PH * cam.s;
      const left = tx + s0.x * cam.s, right = left + PW * cam.s;
      const inside = right > -24 && left < g.w + 24 ? 1 : 0;
      const fit = inside * Math.min(clamp((top - g.top + FADE) / FADE, 0, 1), clamp((g.bot - g.cap - bot + FADE) / FADE, 0, 1));
      const o = fit * (0.34 + 0.66 * lift);
      css(pl, 'opacity', o.toFixed(2));
      css(pl, 'visibility', o < 0.01 ? 'hidden' : 'visible');
      css(pl, 'transform', lift > 0.999 ? 'none' : `scale(${(0.93 + 0.07 * lift).toFixed(4)})`);
    });

    // pas tytułowy: jedna pozycja naraz (nagłówek, potem usługi)
    c.lines.forEach((l, j) => {
      if (j === 0) { const io = inOf(0); show(l, 1, seg(sv, io[0], mid(io))); return; }
      const k = j - 1, io = inOf(k);
      const out = k === n - 1 ? 0 : seg(sv, inOf(k + 1)[0], mid(inOf(k + 1)));
      show(l, seg(sv, mid(io), io[1]), out);
    });
    // linia postępu nad pasem tytułowym (od pierwszej usługi do ostatniej)
    const span = holdAt(n - 1) - mid(inOf(0));
    css(bar.current, 'transform', `scaleX(${clamp((sv - mid(inOf(0))) / Math.max(1, span), 0, 1).toFixed(4)})`);

    // usługa w ostrości: zmiana w połowie przejścia - kolor mgławicy, akcenty, podpis, krawędź arkusza i scenka
    let on = -1;
    for (let k = 0; k < n; k++) if (sv >= mid(inOf(k))) on = k;
    if (on !== act.current) {
      const prev = act.current;
      act.current = on;
      run(prev, false);
      if (vis.current) run(on, true);
      const look = on >= 0 ? looks[on] : null;
      attr(glow.current, 'data-tint', tintAttr(look ? look.tint : BRAND_TINT));
      css(root.current, '--kc', look ? look.kc : BRAND_KC);
      flag(root.current, 'data-focus', on >= 0);
      text(count.current, nn(Math.max(0, on)));
      c.caps.forEach((cg, j) => flag(cg, 'data-on', j === on));
      c.plates.forEach((pl, j) => flag(pl, 'data-on', j === on));
    }
  }, [len, looks, measure, n, run]);

  // wymiary pola sceny i widoczność sekcji (scenka gra tylko na ekranie)
  useEffect(() => {
    if (!live) return;
    const sec = root.current, bd = band.current;
    const fit = pin.current?.querySelector<HTMLElement>('.on-k-fit');
    if (!sec || !bd || !fit) return;
    const anims = stories; // scenki rysunków (sprzątane przy odmontowaniu)
    const ro = new ResizeObserver(() => { geo.current = null; paint(); });
    ro.observe(fit); ro.observe(bd);
    const seen = new IntersectionObserver(([e]) => {
      vis.current = e.isIntersecting;
      run(act.current, e.isIntersecting);
    });
    seen.observe(sec);
    return () => {
      ro.disconnect(); seen.disconnect();
      anims.current.forEach((l) => l?.forEach((a) => a.cancel()));
      anims.current = [];
      act.current = -2; vis.current = false; lastU.current = 0;
      geo.current = null; els.current = null;
    };
  }, [live, paint, run]);

  // rysowanie stołu: dopiero gdy rysunki są dołożone (near); raz, gdy scena jest w większości na ekranie (wejście
  // gra do końca na czas), pióro na czole głównych linii - jedna pętla dla wszystkich arkuszy
  useEffect(() => {
    if (!live || !near) return;
    const tb = table.current;
    const fit = pin.current?.querySelector<HTMLElement>('.on-k-fit');
    if (!tb || !fit) return;
    let raf = 0;
    // usługa w ostrości jeszcze przed dołożeniem rysunków (np. strona otwarta w połowie sekcji): scenka teraz
    if (act.current >= 0 && vis.current) run(act.current, true);
    const pens = () => {
      const list = Array.from(tb.querySelectorAll<SVGPathElement>('path[data-pen]')).map((p) => {
        const plate = p.closest<HTMLElement>('.on-of-plate');
        return {
          p,
          dot: plate?.querySelector<SVGCircleElement>(`[data-pen-dot="${p.dataset.pen}"]`) ?? null,
          len: p.getTotalLength(),
          delay: parseFloat(plate?.style.getPropertyValue('--base') || '0') + parseFloat(p.style.getPropertyValue('--d') || '0'),
        };
      });
      const t0 = performance.now();
      const tick = (now: number) => {
        let alive = false;
        for (const { p, dot, len: l, delay } of list) {
          if (!dot) continue;
          const k = (now - t0 - delay) / DRAW_MS;
          if (k <= 0 || k >= 1) { css(dot, 'opacity', '0'); if (k <= 0) alive = true; continue; }
          alive = true;
          const pt = p.getPointAtLength(DRAW_EASE(k) * l);
          attr(dot, 'cx', pt.x.toFixed(1));
          attr(dot, 'cy', pt.y.toFixed(1));
          css(dot, 'opacity', '1');
        }
        raf = alive ? requestAnimationFrame(tick) : 0;
      };
      if (list.length) raf = requestAnimationFrame(tick);
    };
    const draw = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting || drawnAt.current >= 0) return;
      draw.disconnect();
      drawnAt.current = performance.now();
      tb.setAttribute('data-in', '');
      pens();
    }, { threshold: 0.4 });
    draw.observe(fit);
    return () => {
      draw.disconnect(); cancelAnimationFrame(raf);
      tb.removeAttribute('data-in');
      drawnAt.current = -1;
    };
  }, [live, near, run]);
  usePin(pin, (p) => { prog.current = p; paint(); }, live);

  return (
    <section ref={root} className="on-sec on-of" aria-labelledby="on-of-h">
      <Scene pin={pin} len={len}>
        {/* pas tytułowy (w HTML przed stołem - bez ruchu i bez JS czyta się jako nagłówek i lista usług) */}
        <div ref={band} className="container mx-auto px-6 on-of-band">
          <div className="on-of-meter on-of-chrome" aria-hidden="true">
            <span className="on-of-count"><span ref={count}>01</span> / {nn(n - 1)}</span>
            <span className="on-of-track"><i ref={bar} /></span>
          </div>
          <div className="on-of-texts">
            {/* pierwsza pozycja: nagłówek sekcji w piśmie nazw usług (obok od początku cały stół z rysunkami) */}
            <header ref={intro} className="on-of-t on-of-intro">
              <h2 id="on-of-h" className="on-of-l on-of-name">
                <span className="on-of-mask"><span className="on-of-rise"><span className="on-rise" style={d(1)}>{t.heading}</span></span></span>{' '}
                <span className="on-of-mask on-of-acc"><span className="on-of-rise"><span className="on-rise" style={d(3)}>{t.headingAccent}</span></span></span>
              </h2>
              <div className="on-of-r on-of-fade">
                <p className="on-of-line on-in" style={d(5)}>{t.lead}</p>
              </div>
            </header>
            {items.map((it, k) => (
              <article key={it.href} className="on-of-t" style={{ '--kc': looks[k].kc } as CSSProperties}>
                <h3 className="on-of-l on-of-name">
                  <span className="on-of-mask"><span className="on-of-rise">{it.name}</span></span>
                </h3>
                <div className="on-of-r on-of-fade">
                  {/* chwyt jaśniej, konkret ciszej; na telefonie w pasie stoi sam chwyt (offer.css) */}
                  <p className="on-of-line">
                    <span className="on-of-hook">{lines[k][0]}</span>
                    {lines[k][1] && <>{' '}<span className="on-of-body">{lines[k][1]}</span></>}
                  </p>
                  <More href={it.href} label={t.details} name={it.name} locale={locale} />
                </div>
              </article>
            ))}
          </div>
        </div>
        {/* stół z arkuszami: ilustracja pozycji z pasa tytułowego (nazwy i linki są w tekście) */}
        <div className="on-of-world" aria-hidden="true">
          <div className="container mx-auto px-6 on-of-wrap">
            <div ref={table} className="on-of-table">
              {items.map((it, k) => {
                const look = looks[k], s = slot(k);
                return (
                  <div
                    key={it.href}
                    className="on-of-plate"
                    style={{ '--x': `${s.x}px`, '--y': `${s.y}px`, '--base': `${BASE_MS + k * STAGGER}ms`, '--pa': look.acc } as CSSProperties}
                  >
                    {near && <Drawing i={k} art={look.art} acc={look.acc} on out={false} head={null} fig="" beats={it.story} />}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        {/* kotwica blasku mgławicy w miejscu arkusza w ostrości (data-sky; data-tint = barwa usługi - pisze paint) */}
        <div ref={glow} className="on-of-glow" data-sky="" data-tint={tintAttr(BRAND_TINT)} aria-hidden="true" />
        {/* podpis kroku scenki pod arkuszem jak napisy („Rys. 01 …”, jak w Ofercie); kroki zmienia oś czasu scenki */}
        <p ref={cap} className="on-of-cap on-of-chrome" aria-hidden="true">
          {items.map((it, k) => (
            <span key={it.href} className="on-of-capg" style={{ '--kc': looks[k].kc } as CSSProperties}>
              <b>{t.fig} {nn(k)}</b>
              <span className="on-of-beats">
                {it.story.map((b, j) => <span key={j} data-beat={j}>{b}</span>)}
              </span>
            </span>
          ))}
        </p>
      </Scene>
    </section>
  );
}
