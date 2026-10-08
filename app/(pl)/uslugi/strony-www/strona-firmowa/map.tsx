'use client';

import { useEffect, useRef, type CSSProperties, type ReactNode, type RefObject } from 'react';
import type { CompanyCopy } from '@/lib/i18n/uslugi/strona-firmowa';
import { clamp01, lin, seg, usePin, useReducedPref } from '../../_usluga/shared';
import { MapCards, type CardsVersion } from './pages';

// SCENA 2 - „3 PODSTRONY TO DOPIERO POCZĄTEK”: druga przypięta scena z kamerą (poziom 2: dwie sceny zamiast jednej).
// Teksty z pierwotnej sekcji „Makieta = fragment”: nagłówek, opis i lista nazw podstron / sekcji („Blog firmowy”,
// „FAQ”, „Cennik”…, „+ co potrzebujesz”). Wspólna myśl każdej wersji: strona ROŚNIE o kolejne podstrony, a kamera
// odjeżdża, żeby pokazać całość. Start = strona główna i trzy podstrony usług („3 podstrony” z nagłówka).
// RUNDA 2 (właściciel 2026-10-02: „3 podstrony to dopiero początek - daj kilka wersji”): cztery wersje sceny
// (przełącznik w panelu na dole ekranu, klucz avenly-firmowa-mapa; po wyborze zostaje jedna - pozostałe komponenty
// i ich bloki stylów [data-v] w strona-firmowa.css są do usunięcia):
//   wieza   „Wieża”       - ciąg dalszy „Pięter” z pierwszego ekranu: każda nowa podstrona to kolejne piętro, które
//                           wsuwa się pod poprzednie; wieża gęstnieje (piętra zbliżają się do siebie), podpisy po bokach,
//   mapa    „Mapa”        - schemat strony (runda 1): pień, szyny rzędów, miniatury podstron; kamera odjeżdża,
//   gwiazdy „Konstelacja” - motyw nieba ze strony głównej: strona główna w środku, podstrony zapalają się jak gwiazdy
//                           na trzech orbitach (telefon: zygzak jak konstelacja usług w hero), kamera odjeżdża,
//   menu    „Menu”        - w kadrze przykładowej strony rozwija się menu, do którego dopisują się kolejne pozycje
//                           („trafia do menu” dosłownie); kamera zaczyna blisko pierwszych pozycji i odjeżdża.
// Sterowanie: usePin pisze --g (ile podstron już jest; domyślnie wszystkie), --gp (pasek pod sceną), --w (fala
// światła na końcu) i zmienne kamery danej wersji. Bez JS / ograniczony ruch: komplet od razu, bez przypięcia.

// RUNDA 6: cztery wersje Z KARTAMI na całą sekcję (pages.tsx: Stół / Siatka / Harmonijka / Taśma) - najechanie na kartę
// pokazuje podstronę z bliska. „Spis” z rundy 5 (ściana nazw) odrzucony („chodziło mi o karty, nie o spis”) i usunięty.
// Wersje z rundy 2 (poniżej) zostają w kodzie do decyzji, ale nie ma ich w przełączniku.
export type MapVersion = CardsVersion | 'wieza' | 'mapa' | 'gwiazdy' | 'menu';
type MapCopy = CompanyCopy['map'];
type Site = CompanyCopy['site'];
interface Props { t: MapCopy; site: Site }
interface Item { name: string; kind: 'svc' | 'base' | 'extra'; i: number }

const COLORS = 3;
/** Na starcie widać stronę główną i trzy podstrony usług. */
const START = 3;

const itemsOf = (t: MapCopy, site: Site): Item[] => [
  ...site.services.map((s, i): Item => ({ name: s.name, kind: 'svc', i })),
  { name: site.nav.about, kind: 'base', i: site.services.length },
  { name: site.nav.contact, kind: 'base', i: site.services.length + 1 },
  ...t.items.map((name, k): Item => ({ name, kind: 'extra', i: site.services.length + 2 + k })),
];
/** Numer elementu + materiał usługi (wypełnienie, tekst, obwódka / linia, ton pośredni, bok płyty) - jak color() w site.tsx. */
const tint = (i: number, extra?: Record<string, string | number>) => {
  const n = (i % COLORS) + 1;
  return { '--i': i, '--c': `var(--st-c${n})`, '--ct': `var(--st-t${n})`, '--cb': `var(--st-b${n})`, '--cm': `var(--st-m${n})`, '--cs': `var(--st-s${n})`, ...extra } as CSSProperties;
};
const nn = (i: number) => String(i + 1).padStart(2, '0');
const growth = (p: number, total: number) => START + (total - START) * lin(p, 0.08, 0.82);
const offsetIn = (el: HTMLElement, root: HTMLElement, key: 'offsetTop' | 'offsetLeft') => {
  let v = 0;
  for (let n: HTMLElement | null = el; n && n !== root; n = n.offsetParent as HTMLElement | null) v += n[key];
  return v;
};
/** Wartość z pomiaru dla ułamkowej liczby elementów g (płynnie między przedostatnim a ostatnim widocznym). */
const at = (arr: number[], g: number) => {
  const i0 = Math.max(0, Math.min(arr.length - 1, Math.ceil(g) - 1)), prev = Math.max(0, i0 - 1);
  const f = clamp01(g - Math.floor(g - 1e-6));
  return (arr[prev] ?? 0) + ((arr[i0] ?? 0) - (arr[prev] ?? 0)) * f;
};
const setter = (el: HTMLElement) => (k: string, v: string) => { if (el.style.getPropertyValue(k) !== v) el.style.setProperty(k, v); };
/** Wspólne zmienne każdej wersji: ile podstron jest (--g), pasek pod sceną (--gp), fala światła na końcu (--w). */
const common = (p: number, total: number, set: (k: string, v: string) => void) => {
  const g = growth(p, total);
  set('--g', g.toFixed(3));
  set('--gp', lin(p, 0.08, 0.82).toFixed(3));
  set('--w', lin(p, 0.86, 0.99).toFixed(3));
  // „świeżość” podpisów: jasny jest podpis najnowszej podstrony; na końcu sceny jaśnieją wszystkie
  const all = lin(p, 0.83, 0.9);
  set('--gr', (g * (1 - all) - 99 * all).toFixed(3));
  return g;
};
/** Kamera „zawsze najbliżej, jak się da, żeby dotychczasowa treść była w kadrze” - więc odjeżdża, gdy treść rośnie.
    Telefon (wąski kadr): treść jest wyższa niż kadr - kamera jedzie w dół za najnowszym elementem, a na końcu
    odjeżdża i pokazuje całość na środku. Zwraca skalę i przesunięcie dla transform-origin 0 0. */
const fitCam = (o: { camW: number; camH: number; xr: number; yb: number; fullW: number; fullH: number; p: number; max?: number }) => {
  const wide = o.camW >= 880;
  const out = seg(o.p, 0.82, 0.95);
  const fit = Math.min(o.max ?? 2, o.camW / Math.max(1, o.xr));
  const end = Math.min(1, o.camH / Math.max(1, o.fullH), o.camW / Math.max(1, o.fullW));
  const s = wide ? Math.min(fit, (o.camH - 8) / Math.max(1, o.yb)) : fit + (end - fit) * out;
  const my = Math.min(0, o.camH - 8 - o.yb * s);
  const mx = wide ? 0 : Math.max(0, (o.camW - o.fullW * s) / 2) * out;
  return { s, mx, my };
};
/** Blask mgławicy przy scenie tylko na komputerze (na telefonie rozjaśniałby tło pod drobnymi podpisami). */
const useDesktopSky = (ref: RefObject<HTMLElement | null>, selector: string) => {
  useEffect(() => {
    const el = ref.current?.querySelector<HTMLElement>(selector);
    if (!el) return;
    const mq = window.matchMedia('(min-width: 1024px)');
    const apply = () => { if (mq.matches) el.setAttribute('data-sky', 'scene'); else el.removeAttribute('data-sky'); };
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, [ref, selector]);
};

const Shell = ({ sref, t, total, version, children }: { sref: RefObject<HTMLElement | null>; t: MapCopy; total: number; version: MapVersion; children: ReactNode }) => (
  <section ref={sref} className="sf-m" data-v={version} aria-labelledby="sf-m-h" style={{ '--n': total } as CSSProperties}>
    <div className="sf-m-stage">
      <div className="sf-m-in container mx-auto px-6">
        <div className="sf-m-copy">
          <h2 id="sf-m-h" className="im-title sv-h2">{t.title} <span className="im-accent">{t.titleAccent}</span></h2>
          <p className="im-lead sf-m-lead">{t.lead}</p>
        </div>
        <div className="sf-m-cam">{children}</div>
        <p className="sf-m-cap">{t.caption}</p>
      </div>
    </div>
  </section>
);

// ── „Wieża”: każda nowa podstrona to kolejne piętro ─────────────────────────────────────────────────────────────
// Płyty w rzucie aksonometrycznym (ten sam kąt co stos pięter na pierwszym ekranie) leżą jedna pod drugą; nowa
// wsuwa się z boku pod spód wieży. Przy kilku piętrach płyty są rozsunięte, potem wieża GĘSTNIEJE (--pitch maleje),
// a dopiero na końcu kamera lekko odjeżdża - podpisy po bokach mają cały czas ten sam rozmiar.
const MapTower = ({ t, site }: Props) => {
  const reduced = useReducedPref();
  const ref = useRef<HTMLElement>(null);
  const geo = useRef({ camH: 0, ph: 120, minP: 15, maxP: 58 });
  const items = itemsOf(t, site);
  const total = items.length + 1;
  useDesktopSky(ref, '.sf-mt');

  useEffect(() => {
    const cam = ref.current?.querySelector<HTMLElement>('.sf-m-cam');
    const tower = ref.current?.querySelector<HTMLElement>('.sf-mt');
    if (!cam || !tower) return;
    const measure = () => {
      const cs = getComputedStyle(tower);
      const num = (k: string, d: number) => parseFloat(cs.getPropertyValue(k)) || d;
      geo.current = { camH: cam.clientHeight, ph: num('--ph', 120), minP: num('--pmin', 15), maxP: num('--pmax', 58) };
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(cam);
    return () => ro.disconnect();
  }, []);

  usePin(ref, (p, el) => {
    const set = setter(el);
    const g = common(p, total, set);
    const { camH, ph, minP, maxP } = geo.current;
    // wysokość wieży: strona główna + g pięter w odstępie `pitch` + rzut jednej płyty
    const height = (pitch: number) => (g + 1) * pitch + ph;
    let s = Math.max(1, Math.min(1.4, camH / height(maxP)));
    const pitch = Math.max(minP, Math.min(maxP, (camH / s - ph) / (g + 1)));
    if (height(pitch) * s > camH) s = camH / height(pitch);
    set('--pitch', `${pitch.toFixed(2)}px`);
    set('--ms', s.toFixed(4));
  }, !reduced);

  const row = (name: string, i: number, kind: string) => (
    <li key={name} className="sf-mt-row" data-kind={kind} data-side={i % 2 ? 'l' : 'r'} style={tint(i)}>
      <span className="sf-mt-slab"><i /><b /></span>
      <span className="sf-mt-name">{name}</span>
    </li>
  );
  return (
    <Shell sref={ref} t={t} total={total} version="wieza">
      <div className="sf-mt">
        <ol className="sf-mt-list">
          <li className="sf-mt-row" data-kind="home" data-side="l" style={{ '--i': -1 } as CSSProperties}>
            <span className="sf-mt-slab"><i /><b /></span>
            <span className="sf-mt-name">{t.home}</span>
          </li>
          {items.map((it) => row(it.name, it.i, it.kind))}
          <li className="sf-mt-row" data-kind="more" data-side={(total - 1) % 2 ? 'l' : 'r'} style={tint(total - 1)}>
            <span className="sf-mt-slab"><i /><b /></span>
            <span className="sf-mt-name">{t.more}</span>
          </li>
        </ol>
      </div>
    </Shell>
  );
};

// ── „Mapa”: schemat strony, pień po lewej, szyny rzędów, miniatury podstron (runda 1) ────────────────────────────
const MapTree = ({ t, site }: Props) => {
  const reduced = useReducedPref();
  const ref = useRef<HTMLElement>(null);
  const geo = useRef({ bottoms: [] as number[], rights: [] as number[], buses: [] as number[], camH: 0, camW: 0, fullW: 0, fullH: 0, trunk: 0 });
  const items = itemsOf(t, site);
  const total = items.length + 1;
  useDesktopSky(ref, '.sf-m-tree');

  useEffect(() => {
    const cam = ref.current?.querySelector<HTMLElement>('.sf-m-cam');
    const tree = ref.current?.querySelector<HTMLElement>('.sf-m-tree');
    const rows = ref.current?.querySelector<HTMLElement>('.sf-m-rows');
    if (!cam || !tree || !rows) return;
    const measure = () => {
      const tiles = Array.from(tree.querySelectorAll<HTMLElement>('.sf-m-tile'));
      if (!tiles.length) return;
      const bottoms = tiles.map((el) => offsetIn(el, tree, 'offsetTop') + el.offsetHeight);
      // prawa krawędź mapy po dołączeniu kafla i (rośnie do pełnej szerokości w pierwszym rzędzie)
      let far = 0;
      const rights = tiles.map((el) => (far = Math.max(far, offsetIn(el, tree, 'offsetLeft') + el.offsetWidth + 10)));
      // pień: od góry do szyny ostatniego rzędu; szyna rzędu każdego kafla (pień rośnie razem z mapą)
      const top0 = offsetIn(rows, tree, 'offsetTop');
      const buses = tiles.map((el) => offsetIn(el, tree, 'offsetTop') - top0);
      const trunk = buses[buses.length - 1];
      rows.style.setProperty('--th', `${trunk}px`);
      geo.current = { bottoms, rights, buses, camH: cam.clientHeight, camW: cam.clientWidth, fullW: far, fullH: tree.offsetHeight, trunk };
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(cam); ro.observe(tree);
    document.fonts?.ready.then(measure).catch(() => {});
    return () => ro.disconnect();
  }, []);

  usePin(ref, (p, el) => {
    const set = setter(el);
    const g = common(p, total, set);
    const { bottoms, rights, buses, camH, camW, fullW, fullH, trunk } = geo.current;
    const { s, mx, my } = fitCam({ camW, camH, xr: at(rights, g), yb: at(bottoms, g), fullW, fullH, p });
    set('--ms', s.toFixed(4));
    set('--mx', `${mx.toFixed(1)}px`);
    set('--my', `${my.toFixed(1)}px`);
    set('--fd', my < -2 ? '1' : '0');
    set('--tg', trunk > 0 ? clamp01(at(buses, g) / trunk).toFixed(3) : '1');
  }, !reduced);

  return (
    <Shell sref={ref} t={t} total={total} version="mapa">
      <div className="sf-m-tree">
        <div className="sf-m-home">
          <span className="sf-m-thumb">
            <span className="sf-m-menu" aria-hidden="true">
              {Array.from({ length: total - 1 }, (_, i) => <i key={i} style={{ '--i': i } as CSSProperties} />)}
            </span>
            <i /><b /><b />
          </span>
          <span className="sf-m-name">{t.home}</span>
        </div>
        <div className="sf-m-rows">
          <ol className="sf-m-grid">
            {items.map((it) => (
              <li key={it.name} className="sf-m-tile" data-kind={it.kind} style={tint(it.i)}>
                <span className="sf-m-thumb"><i /><b /><b /></span>
                <span className="sf-m-name">{it.name}</span>
              </li>
            ))}
            <li className="sf-m-tile" data-kind="more" style={{ '--i': total - 1 } as CSSProperties}>
              <span className="sf-m-more">{t.more}</span>
            </li>
          </ol>
        </div>
      </div>
    </Shell>
  );
};

// ── „Konstelacja”: strona główna w środku, podstrony jak gwiazdy na trzech orbitach ─────────────────────────────
// Komputer / tablet: orbity (5 + 9 + 12 gwiazd), kamera stoi blisko pierwszej orbity i odjeżdża, gdy zapalają się
// kolejne; podpisy mają stały rozmiar (gwiazdy są skalowane odwrotnie do kamery). Telefon: zygzak - każda gwiazda ma
// własny rząd, na przemian po lewej i prawej (jak konstelacja usług w hero strony głównej), kamera jedzie w dół.
const RINGS = [{ n: 5, r: 0.36, a: -0.94 }, { n: 9, r: 0.68, a: 0.24 }, { n: 12, r: 1, a: -0.12 }];
const starPos = (i: number) => {
  let k = 0, j = i;
  while (k < RINGS.length - 1 && j >= RINGS[k].n) { j -= RINGS[k].n; k++; }
  const ring = RINGS[k], ang = ring.a + (j / ring.n) * Math.PI * 2;
  return { ring: k, cx: +(Math.cos(ang) * ring.r).toFixed(4), cy: +(Math.sin(ang) * ring.r).toFixed(4) };
};
const MapStars = ({ t, site }: Props) => {
  const reduced = useReducedPref();
  const ref = useRef<HTMLElement>(null);
  const geo = useRef({ camH: 0, camW: 0, fullH: 0, row: 30 });
  const items = itemsOf(t, site);
  const total = items.length + 1;
  const all = [...items.map((it) => ({ name: it.name, kind: it.kind as string, i: it.i })), { name: t.more, kind: 'more', i: total - 1 }];
  useDesktopSky(ref, '.sf-ms');

  useEffect(() => {
    const cam = ref.current?.querySelector<HTMLElement>('.sf-m-cam');
    const field = ref.current?.querySelector<HTMLElement>('.sf-ms');
    if (!cam || !field) return;
    const measure = () => {
      geo.current = { camH: cam.clientHeight, camW: cam.clientWidth, fullH: field.offsetHeight, row: parseFloat(getComputedStyle(field).getPropertyValue('--row')) || 30 };
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(cam); ro.observe(field);
    return () => ro.disconnect();
  }, []);

  usePin(ref, (p, el) => {
    const set = setter(el);
    const g = common(p, total, set);
    const { camH, camW, fullH, row } = geo.current;
    if (camW >= 768) {
      // kamera odjeżdża, gdy zapala się pierwsza gwiazda kolejnej orbity
      const [r0, r1, r2] = RINGS.map((x) => x.r);
      const n0 = RINGS[0].n, n1 = n0 + RINGS[1].n;
      const reach = r0 + (r1 - r0) * seg(g, n0 - 0.4, n0 + 1.6) + (r2 - r1) * seg(g, n1 - 0.4, n1 + 1.6);
      set('--ms', Math.min(2.5, 1 / reach).toFixed(4));
      set('--mx', '0px'); set('--my', '0px'); set('--fd', '0');
    } else {
      const { s, mx, my } = fitCam({ camW, camH, xr: camW, yb: (g + 3.1) * row, fullW: camW, fullH, p, max: 1 });
      set('--ms', s.toFixed(4));
      set('--mx', `${mx.toFixed(1)}px`);
      set('--my', `${my.toFixed(1)}px`);
      set('--fd', my < -2 ? '1' : '0');
    }
  }, !reduced);

  const stars = all.map((it) => ({ ...it, ...starPos(it.i) }));
  const zx = (i: number) => (i % 2 ? 76 : 24);
  const zig = `50,0.9 ${stars.map((s) => `${zx(s.i)},${(s.i + 2.7).toFixed(1)}`).join(' ')}`;
  const ringFrom = RINGS.map((_, k) => RINGS.slice(0, k).reduce((sum, x) => sum + x.n, 0));
  return (
    <Shell sref={ref} t={t} total={total} version="gwiazdy">
      <div className="sf-ms" style={{ '--rows': total + 3.3 } as CSSProperties}>
        <svg className="sf-ms-rings" viewBox="-100 -100 200 200" preserveAspectRatio="none" aria-hidden="true" focusable="false">
          {RINGS.map((ring, k) => (
            <ellipse key={k} cx="0" cy="0" rx={ring.r * 72} ry={ring.r * 82} style={{ '--from': ringFrom[k], '--cnt': ring.n } as CSSProperties} />
          ))}
          {stars.filter((s) => s.ring === 0).map((s) => (
            <line key={s.i} x1="0" y1="0" x2={s.cx * 72} y2={s.cy * 82} style={{ '--i': s.i } as CSSProperties} />
          ))}
        </svg>
        <svg className="sf-ms-zig" viewBox={`0 0 100 ${total + 3.3}`} preserveAspectRatio="none" aria-hidden="true" focusable="false">
          <polyline points={zig} />
        </svg>
        <div className="sf-ms-star sf-ms-home" data-kind="home" style={{ '--i': -1, '--cx': 0, '--cy': 0 } as CSSProperties}>
          <i className="sf-ms-gem" /><span className="sf-ms-name">{t.home}</span>
        </div>
        {stars.map((s) => (
          <div
            key={s.name} className="sf-ms-star" data-kind={s.kind} data-side={s.cx >= 0 ? 'r' : 'l'} data-z={s.i % 2 ? 'r' : 'l'}
            style={tint(s.i, { '--cx': s.cx, '--cy': s.cy, '--zx': `${zx(s.i)}%` })}
          >
            <i className="sf-ms-gem" /><span className="sf-ms-name">{s.name}</span>
          </div>
        ))}
      </div>
    </Shell>
  );
};

// ── „Menu”: w kadrze przykładowej strony rozwija się menu, do którego dopisują się kolejne pozycje ───────────────
const MapMenu = ({ t, site }: Props) => {
  const reduced = useReducedPref();
  const ref = useRef<HTMLElement>(null);
  const geo = useRef({ bottoms: [] as number[], rights: [] as number[], camH: 0, camW: 0, fullW: 0, fullH: 0 });
  const items = itemsOf(t, site);
  const total = items.length + 1;
  useDesktopSky(ref, '.sf-mm');

  useEffect(() => {
    const cam = ref.current?.querySelector<HTMLElement>('.sf-m-cam');
    const frame = ref.current?.querySelector<HTMLElement>('.sf-mm');
    if (!cam || !frame) return;
    const measure = () => {
      const rows = Array.from(frame.querySelectorAll<HTMLElement>('.sf-mm-item'));
      if (!rows.length) return;
      const fullW = frame.offsetWidth, fullH = frame.offsetHeight;
      const pad = offsetIn(rows[0], frame, 'offsetLeft');
      let far = 0, low = 0;
      const rights = rows.map((el) => (far = Math.max(far, Math.min(fullW, offsetIn(el, frame, 'offsetLeft') + el.offsetWidth + pad))));
      const bottoms = rows.map((el) => (low = Math.max(low, Math.min(fullH, offsetIn(el, frame, 'offsetTop') + el.offsetHeight + pad * 0.5))));
      geo.current = { bottoms, rights, camH: cam.clientHeight, camW: cam.clientWidth, fullW, fullH };
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(cam); ro.observe(frame);
    document.fonts?.ready.then(measure).catch(() => {});
    return () => ro.disconnect();
  }, []);

  usePin(ref, (p, el) => {
    const set = setter(el);
    const g = common(p, total, set);
    const { bottoms, rights, camH, camW, fullW, fullH } = geo.current;
    const { s, mx, my } = fitCam({ camW, camH, xr: at(rights, g), yb: at(bottoms, g), fullW, fullH, p, max: 2.2 });
    set('--ms', s.toFixed(4));
    set('--mx', `${mx.toFixed(1)}px`);
    set('--my', `${my.toFixed(1)}px`);
    set('--fd', my < -2 ? '1' : '0');
  }, !reduced);

  return (
    <Shell sref={ref} t={t} total={total} version="menu">
      <div className="sf-mm">
        <div className="sf-fr-rim">
          <div className="sf-fr-bar"><span className="sf-fr-url"><i />{site.domain}</span></div>
          <div className="sf-fr-view">
            <div className="sf-st">
              <div className="sf-st-in">
                <div className="sf-st-nav">
                  <span className="sf-st-logo"><i />{site.brand}</span>
                  <span className="sf-st-navbtn">{site.navCta}</span>
                </div>
                <ol className="sf-mm-list">
                  {items.map((it) => (
                    <li key={it.name} className="sf-mm-item" data-kind={it.kind} style={tint(it.i)}>
                      <span className="sf-mm-n">{nn(it.i)}</span><i /><span className="sf-mm-t">{it.name}</span>
                    </li>
                  ))}
                  <li className="sf-mm-item" data-kind="more" style={tint(total - 1)}>
                    <span className="sf-mm-n">{nn(total - 1)}</span><i /><span className="sf-mm-t">{t.more}</span>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
};

export const SiteMap = ({ t, site, version }: Props & { version: MapVersion }) => {
  if (version === 'stol' || version === 'siatka' || version === 'harmonijka' || version === 'tasma') return <MapCards t={t} site={site} version={version} />;
  if (version === 'mapa') return <MapTree t={t} site={site} />;
  if (version === 'gwiazdy') return <MapStars t={t} site={site} />;
  if (version === 'menu') return <MapMenu t={t} site={site} />;
  return <MapTower t={t} site={site} />;
};
