'use client';
/* eslint-disable @next/next/no-img-element -- static export (images.unoptimized): <img> z srcset/sizes
   to dokładnie to, co wygenerowałby next/image, bez wrappera i JS; kadry są już zoptymalizowane
   (scripts/realizacje-images.mjs). */

import { useEffect, useId, useRef, type CSSProperties } from 'react';
import Link from 'next/link';
import { useLenis } from 'lenis/react';
import type Lenis from 'lenis';
import { localizeHref, type Locale } from '@/lib/i18n/locale';
import type { RealizacjeDict, RealizacjeItem } from '@/lib/i18n/home/realizacje';
import { JsonLd } from '@/components/seo/JsonLd';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { featuredWorkSchema } from '@/lib/schemas';
import type { RealizacjeScene } from './realizacje/scene';

// Sekcja "Realizacje" strony głównej (2. sekcja, pod hero) - handoff 8b "Kurtyna"
// (claude-design/design_handoff_avenly_realizacje). Podział odpowiedzialności:
// - TEN plik: statyczny markup (SSR - kadr 01, indeks z prawdziwymi linkami, h2, JSON-LD
//   ItemList w HTML od pierwszego paintu) + leniwy start sceny.
// - app/globals.css (.rz-*): geometria kadru 1920x1080 (--k), oba układy (pinned / flow),
//   stan spoczynku bez JS (kadr 01 widoczny).
// - ./realizacje/scene.ts + nebula.ts: pętla rAF, przejścia, automat, WebGL - dynamic import
//   PO idle i dopiero, gdy sekcja zbliża się do viewportu.
// Sterowanie (decyzja właściciela): BEZ scroll-locka z makiety - kadry zmieniają się same co
// kilka sekund, klik w pozycję indeksu / swipe / strzałki ←→ przełączają ręcznie.
// Dostępność: scena jest dekoracją (aria-hidden) - treścią jest nagłówek + nawigacja
// indeksu (4 linki z nazwą i kategorią sr-only, aria-current na aktywnej pozycji). Klik w
// nieaktywną pozycję przełącza kadr, Enter z klawiatury / aktywna pozycja / modyfikatory =
// zwykła nawigacja do realizacji. Kursor nad indeksem / fokus w indeksie pauzuje automat.

const STAGE_WIDTH_DESIGN = 1200;
const STAGE_HEIGHT_DESIGN = 675;
/** Kadr sceny: 1080 jedn. kadru 1920x1080 (90% makiety) = min(56,25vw, 100vh). Celowo 1,5x
    szerokości kadru (2026-09-24): przeglądarka zmniejsza plik z zapasem zamiast pokazywać go na
    styk - drobny tekst zrzutów wyraźnie ostrzejszy (pomiar: ~85% → ~98% ostrości wzorca), a AVIF
    1800 i tak waży mniej niż dawny WebP 1200. Flow (dotyk / < 1024): szerokość kolumny, max 880 px,
    BEZ zapasu 1,5x - ekrany dotykowe mają DPR 2-3, więc plik i tak jest większy niż kadr, a zapas
    kosztowałby transfer komórkowy. Pierwsze dwa warunki = odwrotność układu sceny. */
const STAGE_SIZES = '(max-width: 1023px) min(calc(100vw - 40px), 880px), (pointer: coarse) min(calc(100vw - 64px), 880px), min(84.375vw, 150vh)';
/** Miniatura: 176 jedn. = min(9,17vw, 16,3vh); flow: 1/4 kolumny minus odstępy (max ~210 px). */
const THUMB_SIZES = '(max-width: 1023px) min(calc((100vw - 70px) / 4), 210px), (pointer: coarse) min(calc((100vw - 106px) / 4), 210px), min(9.17vw, 16.3vh)';
const THUMB_WIDTHS = [96, 192, 384];

const stageSrc = (image: string, w: number, ext: 'webp' | 'avif' = 'webp') => `/portfolio/stage/${image}-${w}.${ext}`;
const stageSrcSet = (item: RealizacjeItem, ext: 'webp' | 'avif' = 'webp') =>
  item.widths.map((w) => `${stageSrc(item.image, w, ext)} ${w}w`).join(', ');
const thumbSrcSet = (image: string) => THUMB_WIDTHS.map((w) => `/portfolio/stage/${image}-thumb-${w}.webp ${w}w`).join(', ');
/** Paleta mgławicy dla scene.ts: "r,g,b;r,g,b" (0-1). */
const tintAttr = (item: RealizacjeItem) => item.tint.map((c) => c.join(',')).join(';');
/** Kolor akcentu paneli (kreska, punkty listy) - "r g b" do rgb(var(--rz-c1) / a). */
const tintCss = (item: RealizacjeItem) => item.tint[0].map((v) => Math.round(v * 255)).join(' ');
/** Kolejność wejścia elementu panelu (stagger w CSS). */
const d = (n: number) => ({ '--d': n }) as CSSProperties;
const pad2 = (n: number) => String(n).padStart(2, '0');

/** Układ sceny 1920x1080 (desktop z myszą) vs kolumna flow - ten sam warunek co w CSS i scene.ts. */
const SCENE_MQ = '(min-width: 1024px) and (hover: hover) and (pointer: fine)';

export const Realizacje = ({ t, locale = 'pl' }: { t: RealizacjeDict; locale?: Locale }) => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const headingId = `${useId()}-h`;
  // Lenis (smooth scroll strony) dla wejścia sekcji: dociągnięcie do sekcji + krótka blokada
  // scrolla na czas odsłony. Ref, bo scena powstaje później (po idle) niż pierwszy render.
  const lenis = useLenis();
  const lenisRef = useRef<Lenis | undefined>(undefined);
  useEffect(() => { lenisRef.current = lenis; }, [lenis]);

  // Scena startuje, gdy sekcja jest w zasięgu ~60% viewportu, i dopiero po idle - kompilacja
  // shadera i pierwsze pomiary nie konkurują z intro hero ani z hydratacją sekcji poniżej.
  // Zmiana układu (scena ↔ flow, np. podpięcie myszy do tabletu / resize okna) = przebudowa sceny.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    let cancelled = false;
    let booted = false;
    let scene: RealizacjeScene | null = null;
    let idleId = 0;
    type IdleWin = { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number; cancelIdleCallback?: (id: number) => void };
    const w = window as unknown as IdleWin;
    const usedRic = typeof w.requestIdleCallback === 'function';

    const create = () => {
      import('./realizacje/scene')
        .then((m) => { if (!cancelled) scene = m.createRealizacjeScene(section, { getScroll: () => lenisRef.current }); })
        .catch(() => { /* brak sceny = statyczny kadr 01 + działający indeks (linki) */ });
    };
    const boot = () => { if (booted || cancelled) return; booted = true; create(); };
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      io.disconnect();
      idleId = usedRic ? w.requestIdleCallback!(boot, { timeout: 1500 }) : window.setTimeout(boot, 300);
    }, { rootMargin: '60% 0px' });
    io.observe(section);

    const mq = window.matchMedia(SCENE_MQ);
    const onMode = () => { if (!scene) return; scene.destroy(); scene = null; create(); };
    mq.addEventListener('change', onMode);

    return () => {
      cancelled = true;
      io.disconnect();
      mq.removeEventListener('change', onMode);
      if (usedRic) w.cancelIdleCallback?.(idleId); else window.clearTimeout(idleId);
      scene?.destroy();
    };
  }, []);

  // Zapas formatu: gdyby przeglądarka zgłosiła AVIF, a nie zdekodowała pliku (znane przypadki
  // w starszych Safari 16.x), usuwamy źródła AVIF - <picture> sam wybiera wtedy WebP.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const imgs = Array.from(section.querySelectorAll<HTMLImageElement>('.rz-slab-inner img'));
    const isAvif = (img: HTMLImageElement) => /\.avif(\?|$)/.test(img.currentSrc);
    const dropAvif = () => section.querySelectorAll('source[type="image/avif"]').forEach((s) => s.remove());
    // Błąd sprzed hydratacji (kadr 01 ładuje się od razu) - listener by go nie zobaczył.
    if (imgs.some((img) => img.complete && img.naturalWidth === 0 && isAvif(img))) { dropAvif(); return; }
    const onError = (e: Event) => { if (isAvif(e.currentTarget as HTMLImageElement)) dropAvif(); };
    imgs.forEach((img) => img.addEventListener('error', onError));
    return () => imgs.forEach((img) => img.removeEventListener('error', onError));
  }, []);

  const schema = featuredWorkSchema({
    name: t.listName,
    items: t.items.map((item) => ({ name: item.name, url: localizeHref(item.href, locale), image: stageSrc(item.image, 1200) })),
  });

  return (
    <section ref={sectionRef} id="realizacje" className="rz" aria-labelledby={headingId}>
      <div className="rz-box" data-rz-box="" style={{ '--rz-glow': `rgb(${tintCss(t.items[0])} / .22)`, '--rz-accent': `rgb(${tintCss(t.items[0])})` } as CSSProperties}>
        {/* 1. Tło: mgławica w barwach aktywnej realizacji - canvas WebGL tworzy nebula.ts; pod spodem statyczny gradient CSS (fallback). */}
        <div className="rz-bg" data-rz-gl="" aria-hidden="true" />

        {/* 7. Nagłówek sekcji: etykieta (h2) + tytuł + podpowiedź (desktop: automat + klik, dotyk: swipe).
            Scena: wyśrodkowany nad kadrem; flow: do lewej nad kadrem. */}
        <div className="rz-chrome">
          <h2 id={headingId} className="rz-label"><SectionLabel>{t.label}</SectionLabel></h2>
          <p className="rz-lede">{t.lede}</p>
          <p className="rz-hint">
            <span className="rz-hint-fine">{t.hint}</span>
            <span className="rz-hint-touch">{t.hintTouch}</span>
          </p>
        </div>

        {/* 5. Scena: 4 kadry (szkło) + osobne warstwy cienia (cień nie może być cięty kurtyną
            clip-path, a animowana opacity warstwy jest tańsza niż przeliczany box-shadow). */}
        <div className="rz-stage" data-rz-stage="" aria-hidden="true">
          {t.items.map((item, i) => (
            <div
              key={`shadow-${item.image}`}
              className="rz-shadow"
              data-rz-shadow=""
              data-i={i}
              style={{ '--rz-c1': tintCss(item) } as CSSProperties}
            />
          ))}
          {t.items.map((item, i) => (
            <div
              key={item.image}
              className="rz-slab"
              data-rz-slab=""
              data-i={i}
              data-tint={tintAttr(item)}
              style={{ '--rz-c1': tintCss(item) } as CSSProperties}
            >
              <div className="rz-slab-inner">
                {/* AVIF (ostrzejszy i lżejszy), WebP jako zapas - patrz scripts/realizacje-images.mjs. */}
                <picture>
                  <source type="image/avif" srcSet={stageSrcSet(item, 'avif')} sizes={STAGE_SIZES} />
                  <img
                    src={stageSrc(item.image, 1200)}
                    srcSet={stageSrcSet(item)}
                    sizes={STAGE_SIZES}
                    alt={item.alt}
                    width={STAGE_WIDTH_DESIGN}
                    height={STAGE_HEIGHT_DESIGN}
                    loading={i === 0 ? 'eager' : 'lazy'}
                    decoding="async"
                    draggable={false}
                  />
                </picture>
                <div className="rz-sweep" data-rz-sweep="" />
              </div>
            </div>
          ))}
        </div>

        {/* Odbicie kadru i podłoga z makiety usunięte (decyzja właściciela, Sesja 31) - pod kadrem
            zostaje sam indeks: linia ze wskaźnikiem + pasek miniatur. */}
        <div className="rz-ground">
          {/* 8-9. Indeks: hairline + wskaźnik + 4 pozycje (prawdziwe linki do realizacji) */}
          <nav className="rz-index" data-rz-index="" aria-label={t.navLabel}>
            <div className="rz-hairline" data-rz-hairline="" aria-hidden="true">
              <span className="rz-ind" data-rz-ind="" />
            </div>
            <ul className="rz-tabs">
              {t.items.map((item, i) => (
                <li key={item.image}>
                  <Link
                    href={localizeHref(item.href, locale)}
                    prefetch={false}
                    className="rz-tab"
                    data-rz-tab={i}
                    data-active={i === 0 ? '' : undefined}
                    aria-current={i === 0 ? 'true' : undefined}
                  >
                    <span className="rz-thumb" aria-hidden="true">
                      <img
                        data-rz-thumb=""
                        src={`/portfolio/stage/${item.image}-thumb-96.webp`}
                        srcSet={thumbSrcSet(item.image)}
                        sizes={THUMB_SIZES}
                        alt=""
                        width={96}
                        height={54}
                        loading="lazy"
                        decoding="async"
                        draggable={false}
                      />
                    </span>
                    <span className="rz-meta" data-rz-meta="">
                      <span className="rz-name">
                        {item.name}
                        <span className="sr-only">{`, ${item.category}`}</span>
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* 10. Panele informacji o realizacji (decyzja właściciela): scena = po lewej i prawej
            stronie kadru, flow = blok pod indeksem. Po jednym zestawie na projekt, widoczny tylko
            aktywny ([data-on]); nieaktywne są inert. Treść = fakty z projects.ts, bez metryk. */}
        <div className="rz-infos">
          {t.items.map((item, i) => {
            const on = i === 0;
            const { info } = item;
            return (
              <div
                key={`info-${item.image}`}
                className="rz-info"
                data-rz-info=""
                data-on={on ? '' : undefined}
                inert={!on}
                style={{ '--rz-c1': tintCss(item) } as CSSProperties}
              >
                <div className="rz-info-l" data-rz-pause="">
                  <p className="rz-in rz-info-eyebrow" style={d(0)}>
                    <span className="rz-info-n">{`${pad2(i + 1)} / ${pad2(t.items.length)}`}</span>
                    <span className="rz-info-cat">{item.category}</span>
                  </p>
                  <h3 className="rz-in rz-info-title" style={d(1)}>{item.name}</h3>
                  <span className="rz-in rz-info-rule" aria-hidden="true" style={d(2)} />
                  <p className="rz-in rz-info-sum" style={d(3)}>{info.summary}</p>
                </div>
                <div className="rz-info-r" data-rz-pause="">
                  <dl className="rz-info-facts">
                    <div className="rz-in rz-info-fact rz-info-scope" style={d(1)}>
                      <dt>{t.labels.scope}</dt>
                      <dd>
                        <ul>
                          {info.scope.map((s) => <li key={s}>{s}</li>)}
                        </ul>
                      </dd>
                    </div>
                    <div className="rz-in rz-info-fact" style={d(2)}>
                      <dt>{t.labels.tech}</dt>
                      <dd>{info.tech.join(' · ')}</dd>
                    </div>
                  </dl>
                  <div className="rz-in rz-info-links" style={d(3)}>
                    <Link href={localizeHref(item.href, locale)} prefetch={false} className="rz-info-cta">
                      {info.cta}
                      <span aria-hidden="true">→</span>
                    </Link>
                    {info.site && (
                      <a
                        href={`https://${info.site}`}
                        target="_blank"
                        rel="noopener"
                        className="rz-info-site"
                        aria-label={`${t.labels.siteAria} ${info.site}`}
                      >
                        {info.site} <span aria-hidden="true">↗</span>
                      </a>
                    )}
                    {info.chat && (
                      <button
                        type="button"
                        className="rz-info-site"
                        onClick={() => window.dispatchEvent(new Event('avenly:open-chat'))}
                      >
                        {info.chat}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <JsonLd id="ld-featured-work" data={schema} />
    </section>
  );
};
