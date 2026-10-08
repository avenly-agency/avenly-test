'use client';

import { useEffect, useId, useRef, type CSSProperties } from 'react';
import Link from 'next/link';
import { geistMono } from '@/lib/fonts';
import { localizeHref, type Locale } from '@/lib/i18n/locale';
import type { HeroDict } from '@/lib/i18n/home/hero';

// Hero strony głównej - scena z handoffu 12a (claude-design/design_handoff_avenly_hero),
// koncept CTA zmieniony przez właściciela (patrz lib/i18n/home/hero.ts): zamiast pola
// "adres Twojej strony" - nagłówek o BIZNESIE + "Bezpłatna konsultacja" i link do realizacji.
// Podział odpowiedzialności:
// - TEN plik: statyczny markup (SSR - cała treść w HTML od pierwszego paintu), leniwy start sceny.
// - app/globals.css (.hero-*): layout, geometria planety, animacje wejścia (czysty CSS).
// - ./hero/scene.ts: canvas/WebGL (planeta, logotyp z cząstek, odbicie, niebo) -
//   dynamic import PO idle, poza krytycznym bundlem i oknem hydratacji.
// Kolejność wejścia (decyzja właściciela): PLANETA → logotyp AVENLY → nagłówek + przyciski.
// - Planeta to statyczny render shadera (<picture>) widoczny od pierwszej klatki - jest też
//   elementem LCP na każdej szerokości, więc późne wejście tekstu NIE psuje LCP.
//   Na desktopie WebGL płynnie zastępuje obraz, gdy narysuje pierwszą klatkę.
// - Tekst (klasy hero-t-*) czeka na atrybut data-text na sekcji. Ustawia go scena, gdy
//   logotyp jest w większości złożony (scene.ts), a jako bezpiecznik - timer TEXT_FALLBACK_MS
//   (inline script dla SSR, zanim React się zhydratuje + useEffect dla nawigacji SPA).
//   Bez JS / reduced motion tekst jest widoczny od razu (noscript + media query w CSS).

// Geist Mono (lib/fonts.ts - jedna deklaracja dla hero i sekcji Realizacje; preload:false,
// tekst mono nie jest LCP). Klasa geistMono.variable ustawia --font-geist-mono na sekcji.

/** Najpóźniejszy moment pokazania tekstu, gdy scena startuje wolno albo wcale. */
const TEXT_FALLBACK_MS = 4000;
const TEXT_FALLBACK_SCRIPT = `setTimeout(function(){var h=document.querySelector('.hero');if(h)h.setAttribute('data-text','')},${TEXT_FALLBACK_MS})`;

const delay = (ms: number, dur?: number) =>
  ({ '--delay': `${ms}ms`, ...(dur ? { '--dur': `${dur}ms` } : {}) }) as CSSProperties;

export const Hero = ({ t, locale = 'pl' }: { t: HeroDict; locale?: Locale }) => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const headingId = `${useId()}-h`;

  // Scena startuje po idle: kompilacja shadera + sampling ~30k cząstek nie konkurują
  // z hydratacją. Cleanup czeka też na import w locie (Strict Mode / szybka nawigacja).
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    let cancelled = false;
    let scene: { destroy(): void } | null = null;
    const boot = () => {
      import('./hero/scene').then((m) => {
        if (!cancelled) scene = m.createHeroScene(section);
      }).catch(() => { /* brak sceny = zostaje kompletny fallback CSS */ });
    };
    type IdleCb = (cb: () => void, opts?: { timeout: number }) => number;
    const ric = (window as unknown as { requestIdleCallback?: IdleCb }).requestIdleCallback;
    const cic = (window as unknown as { cancelIdleCallback?: (id: number) => void }).cancelIdleCallback;
    // Mobile: dłuższy limit - na wolnym telefonie scena czeka na realny idle (hydratacja
    // sekcji poniżej trwa tam sekundy), na szybkim rIC i tak odpala od razu.
    const mobile = !window.matchMedia('(min-width: 1024px)').matches;
    const id = ric ? ric(boot, { timeout: mobile ? 2000 : 700 }) : window.setTimeout(boot, 200);
    // Bezpiecznik dla nawigacji SPA (inline script z SSR wykonuje się tylko przy pełnym loadzie).
    const textTimer = window.setTimeout(() => section.setAttribute('data-text', ''), TEXT_FALLBACK_MS);
    return () => {
      cancelled = true;
      if (ric && cic) cic(id); else window.clearTimeout(id);
      window.clearTimeout(textTimer);
      scene?.destroy();
    };
  }, []);

  // Linia dowodów: na mobile łamana w połowie (2 równe linie), bez kropki na końcu pierwszej.
  const proofBreak = Math.ceil(t.proof.length / 2) - 1;

  return (
    <section
      ref={sectionRef}
      aria-labelledby={headingId}
      className={`hero ${geistMono.variable}`}
      suppressHydrationWarning /* data-text może dojść z inline scriptu przed hydratacją */
    >
      <script dangerouslySetInnerHTML={{ __html: TEXT_FALLBACK_SCRIPT }} />
      <noscript>
        <style>{'.hero-t-rise{transform:none!important;opacity:1!important}.hero-t-up,.hero-t-fade{opacity:1!important}'}</style>
      </noscript>
      {/* Blok CTA jest PIERWSZY w DOM (kolejność czytania: h1 → przyciski → usługi),
          a kolejność malowania ustawiają z-indexy z globals.css. */}
      <div className="hero-cta">
        <div className="hero-planet-fade" aria-hidden="true">
          <div className="hero-planet-in">
          <div className="hero-planet" data-hero-anchor="" />
          {/* Statyczny render shadera planety - PIERWSZY element sceny i element LCP
              (największy obiekt w kadrze, malowany od pierwszej klatki; bez niego LCP przejmował
              późny tekst albo akapit banera cookies). Dwa kadry: <1024 px = 1440 jedn. szerokości
              (100vw), desktop = 2560 jedn. (pokrywa też ultrawide), oba z horyzontem 302 jedn. od góry. */}
          <picture>
            <source
              media="(max-width: 1023.98px)"
              type="image/webp"
              srcSet="/hero-planet-840.webp 840w, /hero-planet-1280.webp 1280w"
              sizes="100vw"
            />
            <source
              type="image/webp"
              srcSet="/hero-planet-wide-1920.webp 1920w, /hero-planet-wide-2560.webp 2560w, /hero-planet-wide-3840.webp 3840w"
              sizes="min(170vw, 272vh)"
            />
            <img
              className="hero-planet-img"
              src="/hero-planet-wide-1920.webp"
              alt=""
              decoding="async"
              fetchPriority="high"
            />
          </picture>
          </div>
        </div>
        {/* Mgławica PO wrapperze planety (ten sam z-index, późniejsza w DOM = nad obrazem):
            render planety jest nieprzezroczysty i pod spodem ucinałby ją poziomą krawędzią. */}
        <div className="hero-nebula hero-a-fade" style={delay(400, 1600)} aria-hidden="true" />
        <div className="hero-shade hero-a-fade" style={delay(0, 2600)} aria-hidden="true" />

        <h1 id={headingId} className="hero-h1">
          <span className="hero-h1-mask">
            <span className="hero-t-rise">
              {t.h1Lead}{' '}
              <span className="hero-h1-accent">{t.h1Accent}</span>
            </span>
          </span>
        </h1>

        {/* prefetch={false}: prefetche tras nie mogą startować w oknie LCP (i tak są statyczne). */}
        <div className="hero-actions hero-t-up">
          <Link href={localizeHref('/kontakt', locale)} prefetch={false} className="hero-btn hero-btn-primary">
            {t.ctaPrimary}
            <span className="hero-btn-arrow" aria-hidden="true">→</span>
          </Link>
          <Link href={localizeHref('/realizacje', locale)} prefetch={false} className="hero-btn hero-btn-ghost">
            {t.ctaSecondary}
          </Link>
        </div>

        <div className="hero-foot hero-t-fade">
          <p className="hero-proof hero-mono">
            {/* Spacja MIĘDZY spanami = jedyne miejsce łamania (pozycje się nie rozrywają). */}
            {t.proof.map((item, i) => (
              <span key={item}>
                <span className="whitespace-nowrap">
                  {item}
                  {i < t.proof.length - 1 && (
                    <span aria-hidden="true" className={i === proofBreak ? 'hero-proof-sep-br' : undefined}> ·</span>
                  )}
                </span>{' '}
                {i === proofBreak && <br className="hero-proof-br" aria-hidden="true" />}
              </span>
            ))}
          </p>
        </div>
      </div>

      <div data-hero-gl="" aria-hidden="true" />
      <canvas data-hero-reflect="" aria-hidden="true" />
      <canvas data-hero-dots="" aria-hidden="true" />
      <canvas data-hero-sky="" aria-hidden="true" />

      {/* Konstelacja usług: grafika na canvasie, a linki to realny DOM (SEO + a11y). Jeden <a> na
          usługę obejmuje GWIAZDĘ (.hero-node-hit - niewidzialne pole 40x40 nad węzłem z canvasa)
          i etykietę - klik działa na obu, a tab-stop jest jeden. */}
      <nav className="hero-nodes hero-mono" aria-label={t.servicesLabel}>
        <ul>
          {t.nodes.map((node, i) => (
            <li key={node.href + i} data-hero-node="">
              <Link href={localizeHref(node.href, locale)} prefetch={false}>
                <span className="hero-node-hit" aria-hidden="true" />
                <span className="hero-node-text">
                  <span aria-hidden="true">{`0${i + 1}`}</span>
                  <span>{node.label}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </section>
  );
};
