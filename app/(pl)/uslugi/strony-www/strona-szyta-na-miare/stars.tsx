'use client';

import { useCallback, useEffect, useRef, type CSSProperties } from 'react';
import type { CustomCopy } from '@/lib/i18n/uslugi/strona-szyta-na-miare';
import { clamp01, lin, seg, useFrame, useReducedPref } from '../../_usluga/shared';

// SCENA 2 - „Możliwości nie mają limitu.” - NIĆ (wybór właściciela 2026-10-05: „wybieram nić w 2., ale dopracuj to
// bardziej”; propozycje „Taśmy” i „Orbity” usunięte - NIE wracać bez prośby).
// Przykładowe funkcje strony szytej na miarę (lista z dawnego paska „Makieta = fragment”, bez obietnic CMS / strefy
// klienta / headless) jako GWIAZDY, przez które przewijanie prowadzi JEDNĄ NIĆ - motyw konstelacji usług z hero strony
// głównej + „szyta”: nić przeszywa niebo gwiazda po gwieździe. Gwiazda zapala się, gdy dojdzie do niej czoło nici
// (igła = ostra gwiazdka); za ostatnią funkcją nić biegnie dalej, do „+ cokolwiek wymyślisz”, i wychodzi poza ekran.
// DOPRACOWANIE (runda 5):
//   - KAMERA JEDZIE ZA IGŁĄ (komputer, scena przypięta): najpierw plan ogólny całego nieba z drogą nici, potem najazd
//     (niebo x1,5) i jazda od gwiazdy do gwiazdy - igła stoi blisko środka ekranu, nazwy są duże; na końcu odjazd do
//     planu ogólnego: cała konstelacja zszyta jedną nicią. Nagłówek gaśnie na czas jazdy i wraca przy odjeździe,
//   - czoło nici jest jasne (biały odcinek za igłą), gwiazda, do której nić właśnie doszła, jest wyróżniona (data-cur),
//   - licznik „07 / 16” z linią postępu w lewym dolnym rogu (jak licznik Panoramy bloga na stronie głównej),
//   - na końcu przez całą nić przebiega jeden impuls światła (lista nie ma końca),
//   - głębia: drobny pył gwiazd w polu nieba rośnie i przesuwa się razem z kamerą (paralaksa względem mgławicy).
// Telefon / tablet: zwykły przepływ - gwiazdy zygzakiem jedna pod drugą (jak konstelacja hero na telefonie), nić
// rysuje się razem z przewijaniem (linia czytania), bieżąca gwiazda wyróżniona, impuls na końcu.
// Gest odwiedzającego: kliknięcie / stuknięcie gwiazdy wysyła po nici impuls światła aż do końca (impulsy się
// nakładają). Nić liczona z POMIARU gwiazd (krzywa Catmulla-Roma w px), więc pasuje do każdego układu.
// Bez JS / ograniczony ruch: lista funkcji, wszystkie gwiazdy zapalone, bez nici.

/** Położenia gwiazd na niebie sceny (komputer), w % pola: [x, y, etykieta po lewej?]. Kolejność = kolejność nici. */
// Etykieta stoi po tej stronie gwiazdy, w którą nić NIE odchodzi (inaczej nić przecinała napisy).
const SKY: [number, number, boolean?][] = [
  [4, 60], [12, 76], [15, 92, true], [27, 89], [31, 70, true], [40, 55], [47, 80, true], [60, 67],
  [52, 37], [46, 17], [64, 8], [68, 28], [72, 48], [76, 81, true], [89, 65, true], [84, 23],
];
const MORE: [number, number, boolean] = [97, 6, true];
/** Powiększenie nieba w czasie jazdy kamery za igłą i miejsce igły w oknie (ułamki szerokości / wysokości pola). */
const ZOOM = 0.5, AT_X = 0.56, AT_Y = 0.56;
/** Czoło nici: czteroramienna gwiazda o wklęsłych bokach (jak „klejnoty” nieba w hero strony głównej), 26 px.
    Do 2026-10-05 był tu krzyżyk z punktem - właściciel 2026-10-06: „kursor na końcu zmień na gwiazdę”. */
const STAR = 'M0 -13C1.2 -4.4 4.4 -1.2 13 0C4.4 1.2 1.2 4.4 0 13C-1.2 4.4 -4.4 1.2 -13 0C-4.4 -1.2 -1.2 -4.4 0 -13Z';
const nn = (i: number) => String(i).padStart(2, '0');

export const Stars = ({ t }: { t: CustomCopy['stars'] }) => {
  const reduced = useReducedPref();
  const ref = useRef<HTMLElement>(null);
  const countRef = useRef<HTMLElement>(null);
  const geo = useRef<{ len: number; at: number[] }>({ len: 0, at: [] });
  const live = useRef({ cur: -2, ended: false });
  const n = t.items.length;

  // nić z pomiaru: krzywa przez środki gwiazd (układ pola, bez przekształceń), dalej łukiem poza krawędź
  useEffect(() => {
    const root = ref.current;
    const box = root?.querySelector<HTMLElement>('.sm-g-sky');
    const svg = root?.querySelector<SVGSVGElement>('.sm-g-svg');
    if (!root || !box || !svg || reduced) return;
    // droga, nić i jasne czoło (znak na czole nici - gwiazda - ma własne ścieżki w grupie .sm-g-needle)
    const paths = Array.from(svg.querySelectorAll<SVGPathElement>('.sm-g-route, .sm-g-thread, .sm-g-tip'));
    const probe = paths[0];
    const measure = () => {
      const W = box.clientWidth, H = box.clientHeight;
      if (!W || !H || !probe) return;
      const pts = Array.from(box.querySelectorAll<HTMLElement>('.sm-g-gem')).map((g) => {
        let x = g.offsetWidth / 2, y = g.offsetHeight / 2;
        for (let el: HTMLElement | null = g; el && el !== box; el = el.offsetParent as HTMLElement | null) { x += el.offsetLeft; y += el.offsetTop; }
        return [x, y];
      });
      if (pts.length < 2) return;
      const last = pts[pts.length - 1];
      // koniec nici poza ekranem: na niebie (komputer) w prawo, w układzie „jedna pod drugą” w lewo - etykieta
      // ostatniej gwiazdy stoi wtedy po prawej i nić przecinałaby napis
      const all = [...pts, window.matchMedia('(min-width: 1024px)').matches ? [W + 90, last[1] - 40] : [-80, last[1] + 64]];
      const f = (v: number) => v.toFixed(1);
      let d = `M${f(all[0][0])} ${f(all[0][1])}`;
      const at: number[] = [0];
      svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
      for (let i = 0; i < all.length - 1; i++) {
        const p0 = all[Math.max(0, i - 1)], p1 = all[i], p2 = all[i + 1], p3 = all[Math.min(all.length - 1, i + 2)];
        const k = 0.19;
        d += `C${f(p1[0] + (p2[0] - p0[0]) * k)} ${f(p1[1] + (p2[1] - p0[1]) * k)} ${f(p2[0] - (p3[0] - p1[0]) * k)} ${f(p2[1] - (p3[1] - p1[1]) * k)} ${f(p2[0])} ${f(p2[1])}`;
        probe.setAttribute('d', d);
        at.push(probe.getTotalLength());
      }
      const len = at[at.length - 1];
      geo.current = { len, at: at.map((v) => v / len) };
      paths.forEach((p) => p.setAttribute('d', d));
      root.style.setProperty('--len', len.toFixed(1));
      root.setAttribute('data-ready', '');
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(box);
    document.fonts?.ready.then(measure).catch(() => {});
    return () => { ro.disconnect(); root.removeAttribute('data-ready'); };
  }, [reduced]);

  // impuls światła od wskazanej gwiazdy do końca nici (kolejne się nakładają)
  const pulse = useCallback((i: number) => {
    const root = ref.current;
    const src = root?.querySelector<SVGPathElement>('.sm-g-thread');
    const { at } = geo.current;
    if (!root || !src || !at.length || typeof src.animate !== 'function') return;
    const el = src.cloneNode(false) as SVGPathElement;
    el.setAttribute('class', 'sm-g-pulse');
    el.setAttribute('pathLength', '1');
    src.parentNode?.appendChild(el);
    const from = at[i] ?? 0;
    const anim = el.animate([{ strokeDashoffset: -from, opacity: 1 }, { strokeDashoffset: -1.03, opacity: 1 }], { duration: 900 + (1 - from) * 2600, easing: 'cubic-bezier(.45, 0, .2, 1)' });
    anim.onfinish = () => el.remove();
    anim.oncancel = () => el.remove();
  }, []);

  // wydajność (2026-10-05): elementy sceny i zapytanie o szerokość pobierane raz; sekcja daleko od ekranu nic nie
  // liczy (po wyjściu z zasięgu jeszcze jedno pełne przeliczenie = stan końcowy); igła i kamera przeliczane tylko
  // przy zmianie postępu (dawniej getPointAtLength i zapis atrybutu SVG w każdej klatce przewijania całej strony)
  const dom = useRef<{ sky: HTMLElement | null; stars: HTMLElement[]; head: SVGPathElement | null; needle: SVGGElement | null; mq: MediaQueryList | null; far: boolean; key: string }>({ sky: null, stars: [], head: null, needle: null, mq: null, far: false, key: '' });
  useFrame((frac) => {
    const root = ref.current;
    if (!root) return;
    const vh = window.innerHeight, r = root.getBoundingClientRect();
    const c = dom.current;
    const far = r.bottom - frac < -vh || r.top - frac > vh * 2;
    if (far && c.far) return;
    c.far = far;
    if (!c.sky || !c.sky.isConnected) {
      c.sky = root.querySelector<HTMLElement>('.sm-g-sky');
      c.stars = Array.from(root.querySelectorAll<HTMLElement>('.sm-g-star'));
      c.head = root.querySelector<SVGPathElement>('.sm-g-thread');
      c.needle = root.querySelector<SVGGElement>('.sm-g-needle');
      c.key = '';
    }
    const sky = c.sky;
    if (!sky) return;
    const set = (el: HTMLElement, k: string, v: string) => { if (el.style.getPropertyValue(k) !== v) el.style.setProperty(k, v); };
    c.mq ??= window.matchMedia('(min-width: 1024px)');
    const wide = c.mq.matches;
    // rozmiar nieba czytany przed zapisami (dawniej po nich - wymuszone przeliczenie układu w środku klatki)
    const W = sky.clientWidth, H = sky.clientHeight;
    // p = postęp nici (0-1), zoom = jazda kamery za igłą (0 = plan ogólny, 1 = pełne zbliżenie), done = koniec sceny
    let p: number, zoom = 0, done: boolean, back: boolean;
    if (wide) {
      const q = clamp01(-(r.top - frac) / Math.max(1, r.height - vh));
      p = lin(q, 0.07, 0.86);
      zoom = Math.min(seg(q, 0.01, 0.12), 1 - seg(q, 0.8, 0.96));
      done = q > 0.955; back = q < 0.85;
    } else {
      const b = sky.getBoundingClientRect();
      p = clamp01((vh * 0.66 - (b.top - frac)) / Math.max(1, b.height));
      done = p >= 0.995; back = p < 0.9;
    }
    set(root, '--t', p.toFixed(4));
    set(root, '--zoom', zoom.toFixed(3));

    // gwiazdy: zapalone, gdy doszła do nich nić; ostatnia zapalona = bieżąca
    const { at, len } = geo.current;
    const stars = c.stars;
    let cur = -1;
    stars.forEach((li, i) => {
      const on = !at.length || p >= at[i] - 0.004;
      li.toggleAttribute('data-on', on);
      if (on && at.length) cur = i;
    });
    const st = live.current;
    if (cur !== st.cur) {
      st.cur = cur;
      stars.forEach((li, i) => li.toggleAttribute('data-cur', i === cur));
      // licznik: ile funkcji nić już przeszyła; za ostatnią („+ cokolwiek wymyślisz”) plus
      if (countRef.current) countRef.current.textContent = cur >= n ? `${nn(n)}+` : nn(Math.max(0, cur + 1));
    }

    // igła na czole nici + kamera jadąca za igłą (komputer)
    const head = c.head, needle = c.needle;
    // klucz = wszystko, od czego zależy położenie igły i kamery (postęp, zbliżenie, długość nici, układ, rozmiar nieba)
    const key = `${p.toFixed(5)} ${zoom.toFixed(4)} ${len} ${wide} ${W} ${H}`;
    if (head && len && key !== c.key) {
      c.key = key;
      const pt = head.getPointAtLength(len * p);
      needle?.setAttribute('transform', `translate(${pt.x.toFixed(1)} ${pt.y.toFixed(1)})`);
      if (wide) {
        const s = 1 + ZOOM * zoom;
        // igła w stałym miejscu okna; niebo nigdy nie odsłania swoich krawędzi (przy s = 1 przesunięcie = 0)
        const tx = Math.min(0, Math.max(W - W * s, W * AT_X - pt.x * s));
        const ty = Math.min(0, Math.max(H - H * s, H * AT_Y - pt.y * s));
        set(sky, '--cx', `${tx.toFixed(1)}px`);
        set(sky, '--cy', `${ty.toFixed(1)}px`);
        set(sky, '--cs', s.toFixed(4));
      }
    }

    // koniec: jeden impuls światła przez całą nić (raz na dojście do końca)
    if (done && !st.ended && at.length) { st.ended = true; pulse(0); }
    else if (back && st.ended) st.ended = false;
  }, !reduced);

  return (
    <section ref={ref} className="sm-g" aria-labelledby="sm-g-h">
      <div className="sm-g-stage">
        <div className="sm-g-in container mx-auto px-6">
          <div className="sm-g-head">
            <h2 id="sm-g-h" className="im-title sv-h2">{t.title} <span className="im-accent">{t.titleAccent}</span></h2>
            <p className="im-lead sm-g-lead">{t.lead}</p>
          </div>
          <div className="sm-g-sky">
            <svg className="sm-g-svg" aria-hidden="true" focusable="false">
              <path className="sm-g-route" />
              <path className="sm-g-thread" />
              <path className="sm-g-tip" />
              <g className="sm-g-needle"><path className="sm-g-needle-b" d={STAR} transform="rotate(45) scale(.55)" /><path d={STAR} /></g>
            </svg>
            <ul className="sm-g-list" aria-label={t.aria}>
              {t.items.map((it, i) => (
                <li key={it} className="sm-g-star" data-left={SKY[i]?.[2] ? '' : undefined} style={{ '--x': SKY[i]?.[0], '--y': SKY[i]?.[1], '--i': i } as CSSProperties} onClick={() => pulse(i)}>
                  <i className="sm-g-gem" /><span>{it}</span>
                </li>
              ))}
              <li className="sm-g-star sm-g-star--more" data-left="" style={{ '--x': MORE[0], '--y': MORE[1], '--i': n } as CSSProperties} onClick={() => pulse(n)}>
                <i className="sm-g-gem" /><span>{t.more}</span>
              </li>
            </ul>
          </div>
          <p className="sm-g-count" aria-hidden="true"><b ref={countRef}>00</b><span> / {nn(n)}</span><i /></p>
        </div>
      </div>
    </section>
  );
};
