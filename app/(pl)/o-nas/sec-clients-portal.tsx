'use client';

import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { GEM } from '@/lib/brand/logo';
import type { Locale } from '@/lib/i18n/locale';
import { tintAttr } from './page-sky';
import { Consult, More, Shot, swapText, YourSlot, type Clients } from './sec-clients-parts';
import { accentOf, tintOf, WowStage } from './sec-wow';
import { attr, css, flag, seg, text, useEnter, usePin } from './shared';

// STRONY KLIENTÓW W KADRZE - własne pliki public/o-nas/portal/<slug>-<szer>.avif (scripts/o-nas-portal-pages.mjs).
// Uwagi właściciela z 2026-10-13: „te screeny trochę są zbyt sharpen i jakby jakość traciły”, a po pierwszej poprawce
// (pliki bez wyostrzania, przeglądarka pomniejszała je o ok. 10%) o drobnych napisach na stronach klientów: „w tych
// miejscach jest ciśnięte (…) jakby takie zbyt ostre”. Każde skalowanie obrazu w przeglądarce nierówno rozkłada kreski
// drobnego pisma, dlatego obraz jest pokazywany DOKŁADNIE 1:1: pliki są w wielu szerokościach (co ok. 6%), a rama
// kadru zwęża się do najbliższego mniejszego pliku (measure niżej). Skalowanie odbywa się raz, w skrypcie (miękkie
// jądro, bez wyostrzania). Każdy obraz ma proporcje PAGE_RATIO.
/** Szerokości plików w px ekranu. Musi zgadzać się z WIDTHS w scripts/o-nas-portal-pages.mjs. */
const PORTAL_W = [
  480, 510, 540, 572, 606, 642, 660, 680, 720, 764, 800, 810, 858, 910, 964, 1000, 1022, 1084, 1150, 1220, 1294, 1372, 1454, 1542, 1634, 1732,
  1836, 1946, 2062, 2186, 2318,
];
/** Zapas WebP dla przeglądarek bez AVIF (jeden plik na klienta). */
const PORTAL_FALLBACK = 1294;
/** Wysokość obrazu strony / szerokość: dwa ekrany okna 16:10. */
const PAGE_RATIO = 1.25;
const pageFile = (slug: string, w: number, ext: 'avif' | 'webp') => `/o-nas/portal/${slug}-${w}.${ext}`;

// „DLA KOGO PRACUJEMY” - scena „PORTAL” (wybór właściciela 2026-10-13: „portal zajebisty”; jedna z siedmiu
// propozycji, reszta w docs/archiwum/o-nas-2026-10/dla-kogo-wersje/). Prefiks on-4p-.
// Ciąg dalszy wejścia: tam kamera wjechała w gwiazdę - tu przez gwiazdę widać strony klientów.
//
// UKŁAD = TEN, KTÓRY WŁAŚCICIEL WYBRAŁ: tekst po lewej, po prawej CAŁY kadr ze stroną klienta (nic nie wychodzi poza
// ekran). Uwagi właściciela z 2026-10-13 do kolejnych prób wokół nagłówka sekcji:
//   1. osobny nagłówek nad sceną („Pracujemy z firmami takimi jak Twoja”): „jakoś tak seems off, dodatkowo ciekawiej
//      zrób i urozmaić część sekcji z realizacjami”,
//   2. nagłówek obok ciemnego kadru z uchyloną gwiazdą + indeks pod kadrem: „jakoś zwykle to wygląda i layout jakoś
//      nie wiem, dziwnie”,
//   3. plansza: sam nagłówek wielkim pismem, kadr wystający z dołu i wychodzący za prawą krawędź ekranu: „nie widać
//      całego mockupu, plus to tak średnio” (druga plansza z samym tekstem zaraz po „Plakacie” wejścia).
// Stan: nagłówek jest pierwszą pozycją w polu tekstu, a obok od pierwszej chwili stoi cały kadr
// (od rundy 30 w tym samym wielkim piśmie co hasła firm - przy umiarkowanym piśmie właściciel: pierwszy ekran
// „totalnie odstaje poziomem” od pozycji firm, które „wyglądają zajebiście”)
// z prawdziwą stroną pierwszego klienta - sekcja zaczyna się obrazem, nie tekstem. Nie wracać do: osobnego ekranu
// z nagłówkiem, pustego / ciemnego kadru na starcie, kadru uciętego krawędzią ekranu, indeksu pod kadrem.
// Co ożywia realizacje:
//   - w kadrze prawdziwa strona klienta (góra strony - własne pliki public/o-nas/portal/), która przewija się o jeden ekran
//     w czasie postoju jego pozycji,
//   - kadr jak okno przeglądarki: pasek z adresem strony klienta (kropka w jego kolorze),
//   - kolejne firmy i „Twoja firma” otwierają się przez gwiazdę z logo, za każdym razem z innego miejsca kadru; przed
//     gwiazdą lecą dwa obrysy-powidoki w kolorze tego klienta,
//   - mgławica podstrony w barwie klienta na ekranie (data-sky / data-tint na kadrze - page-sky.tsx).
// Nagłówek: hasło, zdanie w akcencie klienta z kadru i opis - wszystko ze słownika (sekcja ZAMKNIĘTA 2026-10-13,
// przełącznik wersji tekstu usunięty; inne wersje są w docs/podstrony/o-nas.md, rundy 29 i 31). Bez plakietki
// „Dla kogo pracujemy” - usunięta na prośbę właściciela (runda 31: „usuń Dla kogo pracujemy, ten badge”).
// Kształt okna to clip-path z tej samej ścieżki co gwiazda logo (pisany w klatce przewijania), obrysy to SVG nad kadrem.
// Bez JS / ograniczony ruch: nagłówek, lista pozycji i siatka kadrów (nieruchome zrzuty).
//
// WYDAJNOŚĆ, SEO, TELEFON (2026-10-13, polecenie właściciela: „zoptymalizuj tą sekcję pod wydajność, SEO,
// responsywność na mobile”):
//   - strony klientów ładują się etapami: pierwsza, gdy sekcja jest 1500 px od ekranu, pozostałe tuż przed sceną;
//     plik ma dokładnie szerokość okna kadru w px ekranu (telefon bierze mniejszy - mniej pamięci po zdekodowaniu),
//   - warstwa zakryta w całości przez następną jest wyłączana (przeglądarka jej nie maluje); przewijana strona ma
//     własną warstwę kompozytora (przesunięcie bez przemalowywania okna),
//   - znaczniki: nagłówek sekcji w <header>, każda firma w <article> z h3; link „Zobacz realizację” ma w nazwie firmę
//     (trzy linki nie brzmią identycznie), obrazy stron klientów mają opisy ze słownika,
//   - telefon i tablet: układ w sec-wow.css (pion: tekst nad kadrem, kadr bierze resztę ekranu; poziom: tekst obok kadru).

const SIZES = '(max-width: 1023px) 92vw, 58vw';
/** Gwiazda logo (GEM, promień 20) jako ścieżka clip-path w pikselach kadru: środek (cx, cy), skala s. */
const starPath = (cx: number, cy: number, s: number) => {
  const P = (x: number, y: number) => `${(cx + x * s).toFixed(1)} ${(cy + y * s).toFixed(1)}`;
  return `path("M${P(0, -20)}C${P(1.4, -6.8)} ${P(6.8, -1.4)} ${P(20, 0)}C${P(6.8, 1.4)} ${P(1.4, 6.8)} ${P(0, 20)}` +
    `C${P(-1.4, 6.8)} ${P(-6.8, 1.4)} ${P(-20, 0)}C${P(-6.8, -1.4)} ${P(-1.4, -6.8)} ${P(0, -20)}Z")`;
};
const STAR_FROM = 0.25;        // skala gwiazdy na starcie przejścia (promień 5 px)
const STAR_WAIST = 7.884;      // wcięcie gwiazdy: okno zakrywa kadr, gdy wcięcia wyjdą poza jego rogi
const ECHO = [1, 1.24, 1.56];  // obrys okna i dwa powidoki przed nim
/** Skąd otwiera się gwiazda kolejnych pozycji (ułamki szerokości i wysokości okna kadru). */
const ORIGINS: [number, number][] = [[0.5, 0.5], [0.72, 0.36], [0.28, 0.62]];

// Oś sceny w vh przewinięcia: postój na nagłówku, wymiana tekstu na pierwszą firmę (kadr już ją pokazuje), potem dla
// każdej pozycji postój (strona klienta przewija się w kadrze) i otwarcie gwiazdy z następną; na końcu krótszy postój
// na „Twojej firmie”.
const HOLD0 = 20, SWAP = 26, OPEN = 44, HOLD = 56, HOLD_END = 34;
/** Przejścia między pozycjami: [0] = z nagłówka na pierwszego klienta (sam tekst), dalej otwarcia gwiazdy
    ([początek, koniec] w vh) - razem tyle, ilu klientów + 1. */
const stepsFor = (clients: number): [number, number][] => {
  const out: [number, number][] = [[HOLD0, HOLD0 + SWAP]];
  for (let k = 1; k <= clients; k++) {
    const a = HOLD0 + SWAP + HOLD + (k - 1) * (OPEN + HOLD);
    out.push([a, a + OPEN]);
  }
  return out;
};


const d = (n: number) => ({ '--d': n }) as CSSProperties;

/** Strona klienta w kadrze: góra strony (dwa ekrany okna). `w` = plik o szerokości równej oknu kadru w px ekranu
    (rama kadru jest do niego dopasowana), więc obraz stoi 1:1. */
function Page({ slug, w, alt, first }: { slug: string; w: number; alt: string; first: boolean }) {
  return (
    <picture className="on-4p-page">
      <source type="image/avif" srcSet={pageFile(slug, w, 'avif')} />
      <img
        src={pageFile(slug, PORTAL_FALLBACK, 'webp')} alt={alt} width={w} height={Math.round(w * PAGE_RATIO)}
        decoding="async" draggable={false} fetchPriority={first ? undefined : 'low'}
        ref={(el) => { if (el?.complete && el.naturalWidth) el.parentElement?.setAttribute('data-ok', ''); }}
        onLoad={(e) => e.currentTarget.parentElement?.setAttribute('data-ok', '')}
      />
    </picture>
  );
}

/** Wymiary okna kadru, gęstość ekranu i proporcje obrazu strony (wysokość / szerokość) - czytane tylko przy zmianie
    rozmiaru. */
type Geo = { w: number; h: number; dpr: number; ratio: number };
type Els = {
  texts: HTMLElement[]; layers: HTMLElement[]; pages: (HTMLElement | null)[]; rings: SVGPathElement[];
  host: HTMLElement | null;
};

export function SecClientsPortal({ t, locale, live }: {
  t: Clients; locale: Locale; live: boolean;
}) {
  const root = useRef<HTMLElement>(null);
  const pin = useRef<HTMLDivElement>(null), stage = useRef<HTMLDivElement>(null), fit = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLDivElement>(null), glass = useRef<HTMLDivElement>(null);
  const intro = useRef<HTMLElement>(null);
  const geo = useRef<Geo | null>(null);
  const els = useRef<Els | null>(null);
  const prog = useRef(0);
  const fileW = useRef(0);
  // strony klientów doładowują się etapami (nie przy wejściu na podstronę): 1 = pierwsza, gdy sekcja jest 1500 px od
  // ekranu; 2 = pozostałe, gdy sekcja jest tuż pod ekranem. `file` = szerokość pliku strony dobranego do okna kadru.
  const [load, setLoad] = useState<0 | 1 | 2>(0);
  const [file, setFile] = useState(PORTAL_FALLBACK);
  const count = t.items.length; // klienci; pozycje sceny: 0 = nagłówek, 1..count = klienci, count + 1 = „Twoja firma”
  const steps = useMemo(() => stepsFor(count), [count]);
  const len = steps[count][1] + HOLD_END;
  const title = t.heading, accent = t.headingAccent, lead = t.lead;
  useEnter(intro, live, 0.1);

  const paint = useCallback(() => {
    const el = pin.current, fr = frame.current, gl = glass.current;
    if (!el || !fr || !gl) return;
    // wymiary okna kadru - tylko przy zmianie rozmiaru
    const g = (geo.current ??= {
      w: gl.clientWidth, h: gl.clientHeight, dpr: Math.min(window.devicePixelRatio || 1, 3), ratio: PAGE_RATIO,
    });
    if (!g.w || !g.h) return;
    const c = (els.current ??= (() => {
      const layers = Array.from(el.querySelectorAll<HTMLElement>('.on-4p-layer'));
      return {
        texts: Array.from(el.querySelectorAll<HTMLElement>('.on-3c-t')),
        layers,
        pages: layers.map((l) => l.querySelector<HTMLElement>('.on-4p-page')),
        rings: Array.from(el.querySelectorAll<SVGPathElement>('.on-4p-ring')),
        host: el.querySelector<HTMLElement>('.on-4p-host'),
      };
    })());
    const sv = prog.current * len; // vh przewinięte w scenie
    const mid = (j: number) => (steps[j][0] + steps[j][1]) / 2;
    // pozycja na ekranie (zmiana w połowie przejścia)
    let on = 0;
    for (let j = 0; j <= count; j++) if (sv >= mid(j)) on = j + 1;
    // kadr od początku pokazuje pierwszego klienta - jego barwa i adres obowiązują także przy nagłówku
    const shown = on > count ? undefined : t.items[Math.max(0, on - 1)];

    // tekst: jedna pozycja naraz (nagłówek, firmy, „Twoja firma”)
    c.texts.forEach((tx, j) => {
      const tin = j === 0 ? 1 : seg(sv, mid(j - 1), steps[j - 1][1]);
      const out = j === count + 1 ? 0 : seg(sv, steps[j][0], mid(j));
      swapText(tx, tin, out);
    });

    // warstwy kadru (klienci, potem „Twoja firma”): pierwsza stoi od początku, kolejne otwiera gwiazda-okno, które
    // rośnie wykładniczo, aż jego wcięcia wyjdą poza rogi okna
    let open = -1, os = 0, ox = 0, oy = 0;
    c.layers.forEach((l, k) => {
      const b = k === 0 ? 1 : seg(sv, steps[k][0], steps[k][1]);
      // warstwa widoczna, gdy już się otwiera i dopóki następna nie zakryła jej w całości (zakrytej nie malujemy)
      const covered = k < count && seg(sv, steps[k + 1][0], steps[k + 1][1]) >= 0.998;
      css(l, 'visibility', b < 0.002 || covered ? 'hidden' : 'visible');
      if (k > 0) {
        const [fx, fy] = ORIGINS[k - 1] ?? [0.5, 0.5];
        const cx = fx * g.w, cy = fy * g.h;
        const full = (Math.hypot(Math.max(cx, g.w - cx), Math.max(cy, g.h - cy)) * 1.08) / STAR_WAIST;
        if (b >= 0.002 && b < 0.998) {
          const s = STAR_FROM * Math.pow(full / STAR_FROM, b);
          css(l, 'clip-path', starPath(cx, cy, s));
          open = k; os = s; ox = cx; oy = cy;
        } else css(l, 'clip-path', 'none');
      }
      // strona klienta przewija się o jeden ekran okna w czasie postoju jego pozycji (obraz na szerokość okna)
      const page = c.pages[k];
      if (page && k < count) {
        const travel = Math.max(0, Math.min(g.w * g.ratio - g.h, g.h));
        const q = seg(sv, k === 0 ? steps[0][0] : mid(k), steps[k + 1][0] + OPEN * 0.4);
        css(page, 'transform', `translate3d(0, ${(-Math.round(q * travel * g.dpr) / g.dpr).toFixed(2)}px, 0)`);
      }
    });
    // obrys okna i powidoki przed nim (w kolorze klienta, który się otwiera)
    c.rings.forEach((ring, i) => {
      css(ring, 'visibility', open < 0 ? 'hidden' : 'visible');
      if (open < 0) return;
      attr(ring, 'transform', `translate(${ox.toFixed(1)} ${oy.toFixed(1)}) scale(${(os * ECHO[i]).toFixed(4)})`);
    });
    css(fr, '--kn', accentOf(open < 0 ? shown?.image : t.items[open]?.image));

    // pasek adresu, akcent i barwa mgławicy = klient w kadrze („Twoja firma”: błękit marki)
    text(c.host, shown ? shown.domain : t.yours.domain);
    css(root.current, '--kc', accentOf(shown?.image));
    flag(fr, 'data-you', on === count + 1);
    attr(fr, 'data-tint', tintAttr(tintOf(shown?.image)));
  }, [count, len, steps, t]);

  useEffect(() => {
    if (!live) return;
    const gl = glass.current, ft = fit.current, sec = root.current, fr = frame.current;
    if (!gl || !ft || !sec || !fr) return;
    /** Rama kadru dopasowana do pliku: największy plik nie szerszy od okna kadru (px ekranu), a rama zwęża się tak,
        żeby okno miało dokładnie jego szerokość - obraz stoi 1:1, przeglądarka go nie skaluje. */
    const measure = () => {
      const dpr = window.devicePixelRatio || 1;
      fr.style.maxWidth = '';
      const full = gl.getBoundingClientRect().width;        // okno z samego układu, bez dopasowania
      const pad = fr.getBoundingClientRect().width - full;  // dopełnienie ramy
      let w = 0;
      for (const c of PORTAL_W) if (c <= full * dpr + 0.5) w = c;
      if (w) fr.style.maxWidth = `${(w / dpr + pad).toFixed(3)}px`;
      else w = PORTAL_W[0]; // okno węższe od najmniejszego pliku: bez dopasowania (obraz lekko pomniejszony)
      if (w !== fileW.current) { fileW.current = w; setFile(w); }
    };
    // dopasowanie poza wywołaniem ResizeObserver (zmiana szerokości obserwowanego okna w jego własnym wywołaniu
    // kończy się błędem „ResizeObserver loop”); po dopasowaniu wymiary sceny od nowa
    let mraf = 0;
    const fitFrame = () => {
      cancelAnimationFrame(mraf);
      mraf = requestAnimationFrame(() => { measure(); geo.current = null; paint(); });
    };
    const ro = new ResizeObserver(() => { geo.current = null; paint(); if (fileW.current) fitFrame(); });
    ro.observe(gl); ro.observe(ft);
    const far = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      far.disconnect();
      measure();
      setLoad((v) => (v < 1 ? 1 : v));
    }, { rootMargin: '1500px 0px' });
    const close = new IntersectionObserver(([e]) => { if (e.isIntersecting) { close.disconnect(); setLoad(2); } }, { rootMargin: '250px 0px' });
    far.observe(sec); close.observe(sec);
    return () => {
      ro.disconnect(); far.disconnect(); close.disconnect(); cancelAnimationFrame(mraf);
      fr.style.maxWidth = ''; fileW.current = 0; geo.current = null; els.current = null;
    };
  }, [live, paint]);
  // po doładowaniu stron klientów: wymiary i lista elementów sceny od nowa (doszły obrazy) i klatka z ich położeniem
  useEffect(() => { if (live && load) { geo.current = null; els.current = null; paint(); } }, [live, load, file, paint]);
  usePin(pin, (p) => { prog.current = p; paint(); }, live);

  return (
    <section ref={root} className="on-sec on-3 on-3c on-4 on-4p" aria-labelledby="on-3-h">
      <WowStage pin={pin} stage={stage} fit={fit} len={len}>
        <div className="container mx-auto px-6 on-3c-box on-4p-box">
          <div className="on-3c-texts">
            {/* pierwsza pozycja: nagłówek sekcji (obok stoi już cały kadr ze stroną pierwszego klienta) */}
            <header ref={intro} className="on-3c-t on-4p-intro">
              {/* to samo pismo co hasła firm niżej (on-3c-type): wielkie białe hasło, pod nim zdanie w akcencie klienta
                  z kadru (--kc; przy czerwonej mgławicy RKS błękit marki „nie pasuje” - właściciel, runda 32)
                  i opis jak przy firmach - pierwsza pozycja nie może odstawać od następnych (właściciel, 2026-10-13) */}
              <h2 id="on-3-h" className="on-4p-h">
                <span className="on-mask on-3c-type on-4p-title"><span className="on-rise" style={d(1)}>{title}</span></span>{' '}
                <span className="on-mask on-4p-sub"><span className="on-rise" style={d(3)}>{accent}</span></span>
              </h2>
              <p className="on-3c-line on-4p-lead on-in" style={d(5)}>{lead}</p>
            </header>
            {t.items.map((it) => (
              <article key={it.href} className="on-3c-t">
                <h3 className="on-3c-type">{it.type}</h3>
                <p className="on-3c-name">{it.name}</p>
                <p className="on-3c-line">{it.line}</p>
                <More href={it.href} label={t.more} name={it.name} locale={locale} />
              </article>
            ))}
            <article className="on-3c-t">
              <h3 className="on-3c-type im-accent">{t.yours.type}</h3>
              <p className="on-3c-line on-3c-line--you">{t.yours.line}</p>
              <Consult label={t.yours.cta} locale={locale} />
            </article>
          </div>
          {/* kadr jest ilustracją pozycji z listy obok (nazwy i linki są w tekście); data-sky: wokół niego staje blask
              mgławicy podstrony (data-tint z barwą klienta pisze paint) */}
          <div ref={frame} className="on-4-frame on-4p-frame" data-sky="" aria-hidden="true">
            <div className="on-4p-bar"><i className="on-4p-dot" /><span className="on-4p-host">{t.items[0]?.domain}</span></div>
            <div ref={glass} className="on-4p-glass">
              {t.items.map((it, i) => (
                <div key={it.image} className="on-4p-layer">
                  {live
                    ? load > (i === 0 ? 0 : 1) && <Page slug={it.image} w={file} alt={it.alt} first={i === 0} />
                    : <Shot slug={it.image} sizes={SIZES} alt={it.alt} big />}
                </div>
              ))}
              <div className="on-4p-layer on-4p-layer--you"><div className="on-4p-slot"><YourSlot label={t.yours.frame} /></div></div>
              <svg className="on-4p-rings" focusable="false">
                {ECHO.map((e) => <path key={e} className="on-4p-ring" d={GEM} vectorEffect="non-scaling-stroke" />)}
              </svg>
            </div>
          </div>
        </div>
      </WowStage>
    </section>
  );
}
