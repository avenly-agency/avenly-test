'use client';

import { useEffect, useRef, useState, type CSSProperties, type ReactNode, type RefObject } from 'react';
import { PAGE_MEDIA, pageSlice, stageSet, stageSrc } from './media';
import { useEnter, useLivePage, useReducedPref } from './shared';

// Kadr realizacji w SZKLE (wybór właściciela 2026-09-30; odmiany szkła: atrybut data-glass na korzeniu .rl, przełącznik
// „Realizacje - szkło kadru”, cały wygląd w realizacje.css). Markup: rama (.rl-frame-rim), pasek z adresem, okno.
// Wejście jak na stronie głównej (anim="enter"): kurtyna odsłania kadr od dołu, obraz podjeżdża, raz przelatuje
// światło. Na planszach (anim="none") odsłonę i przewijanie strony w kadrze liczy plansza.
// Żywy motyw: w kadrze jest CAŁA strona klienta (zrzut z 2026-09-29), która przewija się razem z przewijaniem.
// Runda 16: `hit` = klikalna warstwa na całym kadrze (karty i plansze - link do realizacji, asystent - czat).

export type FrameSize = 'sm' | 'lg' | 'case';

export const Frame = ({
  slug, alt, accent, domain, size, live = true, eager = false, sizes, hostRef, manual = false, anim = 'enter', sky,
  className, style, children, hit,
}: {
  slug: string; alt: string; accent: string; domain: string | null; size: FrameSize;
  live?: boolean; eager?: boolean; sizes: string;
  /** Tryb sticky (case study): sekcja, w której kadr jest przyklejony. */
  hostRef?: RefObject<HTMLElement | null>;
  /** Przewijanie strony w kadrze liczy rodzic (wersje z przypiętą sceną). */
  manual?: boolean;
  anim?: 'enter' | 'none';
  className?: string; style?: CSSProperties;
  /** Klucz barwy mgławicy (slug realizacji / 'next') - mgławica świeci wokół kadru z data-sky najbliżej środka okna. */
  sky?: string;
  /** Własna zawartość okna (pusty kadr „Twoja firma może być następna”). */
  children?: ReactNode;
  /** Klikalna warstwa na całym kadrze (link do realizacji / czat) - runda 16. */
  hit?: ReactNode;
}) => {
  const reduced = useReducedPref();
  const ref = useRef<HTMLElement>(null);
  const viewRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);
  const media = live && !children ? PAGE_MEDIA[slug] : undefined;
  const w = size === 'sm' ? 800 : 1600;
  useEnter(ref, 0.2);
  const near = useNear(ref, !!media, manual);
  useLivePage(viewRef, pageRef, { enabled: !!media && !reduced, mode: manual ? 'plate' : hostRef ? 'sticky' : 'pass', hostRef });

  return (
    <figure
      ref={ref} className={`rl-frame${className ? ` ${className}` : ''}`} data-size={size} data-anim={anim} data-sky={sky}
      style={{ ...(accent ? { '--ac': accent } : null), ...style } as CSSProperties}
    >
      <div className="rl-frame-rim">
        <div className="rl-frame-bar" aria-hidden="true">
          <span className="rl-frame-url">
            <i className="rl-frame-dot" />
            <span className="rl-frame-host">{domain}</span>
          </span>
        </div>
        <div className="rl-frame-win">
        <div ref={viewRef} className="rl-frame-view" data-kind={children ? 'empty' : media ? 'page' : 'stage'}>
          <div className="rl-frame-cur">
            {children ?? (media ? (
              <div ref={pageRef} className="rl-page">
                {media.slices[w].map((h, i) => (
                  i === 0 || near ? (
                    <picture key={i}>
                      <source type="image/avif" srcSet={pageSlice(slug, w, i, 'avif')} />
                      <img
                        src={pageSlice(slug, w, i, 'webp')} width={w} height={h} alt={i === 0 ? alt : ''}
                        loading={i === 0 && !eager ? 'lazy' : 'eager'} decoding="async" draggable={false}
                        // pierwszy plaster kadru na pierwszym ekranie = największy obraz strony: pierwszeństwo pobierania,
                        // dalsze plastry (pod spodem, widoczne dopiero po przewinięciu) z niskim priorytetem
                        fetchPriority={i === 0 ? (eager ? 'high' : undefined) : 'low'}
                      />
                    </picture>
                  ) : (
                    <div key={i} className="rl-page-ph" style={{ aspectRatio: `${w} / ${h}` }} />
                  )
                ))}
              </div>
            ) : (
              <picture>
                <source type="image/avif" srcSet={stageSet(slug, 'avif')} sizes={sizes} />
                <source type="image/webp" srcSet={stageSet(slug, 'webp')} sizes={sizes} />
                <img className="rl-stage" src={stageSrc(slug)} width={1200} height={675} alt={alt} loading={eager ? 'eager' : 'lazy'} decoding="async" draggable={false} />
              </picture>
            ))}
          </div>
          <i className="rl-frame-sweep" aria-hidden="true" />
        </div>
        </div>
      </div>
      {hit}
    </figure>
  );
};

/** Dalsze plastry strony ładujemy dopiero, gdy kadr zbliża się do ekranu (w przypiętej scenie - od razu po montażu). */
const useNear = (ref: RefObject<HTMLElement | null>, on: boolean, now: boolean) => {
  const [near, setNear] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!on || !el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setNear(true); io.disconnect(); } }, { rootMargin: now ? '1400px 0px' : '700px 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, [ref, on, now]);
  return near;
};

/** Przesuwa stronę klienta w kadrze do postępu p (0-1) - dla scen, które same liczą postęp. */
export const setPage = (frame: Element | null, p: number) => {
  if (!frame) return;
  const view = frame.querySelector<HTMLElement>('.rl-frame-view');
  const page = frame.querySelector<HTMLElement>('.rl-page');
  if (!view || !page) return;
  const travel = Math.max(0, page.offsetHeight - view.clientHeight);
  const y = Math.round(-Math.min(1, Math.max(0, p)) * travel * 8) / 8;
  const v = `translate3d(0, ${y}px, 0)`;
  if (page.style.transform !== v) page.style.transform = v;
};
