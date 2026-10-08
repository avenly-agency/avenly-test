'use client';

import { Fragment, useEffect, useRef, type CSSProperties, type MouseEvent } from 'react';
import Link from 'next/link';
import { ArrowDown, ArrowRight } from 'lucide-react';
import { useLenis } from 'lenis/react';
import type { RealizacjeDict, WorkItem } from '@/lib/i18n/projects';
import { localizeHref, type Locale } from '@/lib/i18n/locale';
import { PAGE_MEDIA, pageSlice, stageSet, stageSrc } from './media';
import { openChat } from './shared';
import { scrollToWork, workAnchor } from './versions';

// Nagłówek listy /realizacje - pierwszy ekran na mgławicy: tekst wyśrodkowany w pionie, na dole strzałka przewijania.
// Wybór właściciela (2026-09-30, runda 11): ŚRODEK = „KADRY W GŁĘBI” („zajebiste, tylko zrób je jeszcze ładniej
// i dokładniej”; Plansza tytułowa i Adres usunięte). Wokół tekstu kadry z czarnego szkła jak kadry realizacji niżej,
// a w nich ŻYWE strony klientów (pierwszy plaster zrzutu całej strony) powoli przewijające się w górę i w dół:
//   - od 1200 px: kompozycja w głębi - trzy plany (dalekie mniejsze i przyciemnione, bliskie większe; wszystkie całe
//     na ekranie, żaden nie wchodzi pod nawigację ani na tekst), bliskie mocniej reagują na kursor i przewijanie (paralaksa), unoszą się powoli; wejście
//     z głębi po kolei, gdy mgławica wyłania się z czerni; ukośny refleks na szkle idzie za kursorem; klik = plansza,
//   - poniżej: wachlarz trzech kadrów pod tekstem (środkowy z przodu; runda 14: duże kadry, boczne w głębi wychodzą poza
//     ekran, unoszą się, po szkle przechodzi refleks, przy przewijaniu rozjeżdżają się na boki).
// Kadry są ozdobą (aria-hidden, bez fokusu) - te same realizacje są niżej na planszach.
// Wejście jak w /uslugi (runda 13): czerń → mgławica → tekst po kolei (data-go) → kadry (data-cards) i strzałka - useIntro.
// Nagłówek w stylu /uslugi: jedno białe zdanie z kropką w kolorze marki.
// Kamera przy przewijaniu (--hp 0-1): treść unosi się, lekko maleje i gaśnie.

/** Kompozycja w głębi (od 1200 px): położenie (% nagłówka), szerokość (vw), obrót (deg), plan (z: 0,6 daleko - 1,15 blisko),
    main = kadr główny. Runda 12 (właściciel: „Grawerstwo Mielec i RKS daj większe i bardziej highlighted”): RKS i Grawerstwo
    to dwa duże kadry z przodu po obu stronach tekstu (lustrzane pochylenie, pełna jasność, obwódka w kolorze realizacji),
    Mcentrum i asystent - mniejsze, w dalszym planie u góry. */
const DEPTH: Record<string, { x: number; y: number; w: number; r: number; z: number; main?: boolean }> = {
  'klub-sportowy': { x: 3, y: 52, w: 24, r: 3, z: 1.15, main: true },
  'grawerstwo-kardys': { x: 73, y: 52, w: 24, r: -3, z: 1.15, main: true },
  mcentrumfizjoterapia: { x: 6, y: 13, w: 15, r: -4, z: 0.6 },
  'wirtualny-asystent-ai': { x: 79, y: 11, w: 15, r: 4, z: 0.6 },
};
/** Wachlarz (poniżej 1200 px): kolejność od lewej, środkowy z przodu (główne: RKS z przodu, Grawerstwo obok). */
const FAN = ['mcentrumfizjoterapia', 'klub-sportowy', 'grawerstwo-kardys'];
/** Indeks kadru w wachlarzu (--i: kolejność wejścia, faza unoszenia i przewijania strony): środkowy 0, boczne 1 i 2. */
const FAN_ORDER = [1, 0, 2];
const MAIN = new Set(['klub-sportowy', 'grawerstwo-kardys']);

/** Kadr w nagłówku: rama z czarnego szkła, pasek z adresem, w oknie żywa strona klienta (albo zrzut asystenta). */
const HkFrame = ({ w, k, cls, style, go }: {
  w: WorkItem; k: number; cls: string; style?: CSSProperties; go: (slug: string) => (e: MouseEvent) => void;
}) => {
  const media = PAGE_MEDIA[w.slug];
  const h0 = media?.slices[800][0] ?? 0;
  // droga strony w oknie 16:10: plaster 800 × h0 w oknie o wysokości 800 / 1,6 = 500 px obrazu
  const tv = h0 ? -(1 - 500 / h0) * 100 : 0;
  return (
    <a
      href={`#${workAnchor(w.slug)}`} onClick={go(w.slug)} tabIndex={-1} className={cls} data-main={MAIN.has(w.slug) ? '' : undefined}
      style={{ '--ac': w.accent, '--i': k, '--tv': `${tv.toFixed(2)}%`, '--dur': `${28 + k * 5}s`, ...style } as CSSProperties}
    >
      <span className="rl-hk-in">
        <span className="rl-hk-bar"><i />{w.domain ?? 'avenly.pl'}</span>
        <span className="rl-hk-win">
          {media ? (
            <span className="rl-hk-page">
              <picture>
                <source type="image/avif" srcSet={pageSlice(w.slug, 800, 0, 'avif')} />
                <img src={pageSlice(w.slug, 800, 0, 'webp')} width={800} height={h0} alt="" decoding="async" fetchPriority="low" draggable={false} />
              </picture>
            </span>
          ) : (
            <picture>
              <source type="image/avif" srcSet={stageSet(w.slug, 'avif')} sizes="26vw" />
              <source type="image/webp" srcSet={stageSet(w.slug, 'webp')} sizes="26vw" />
              <img className="rl-hk-stage" src={stageSrc(w.slug, 720)} width={1200} height={675} alt="" decoding="async" fetchPriority="low" draggable={false} />
            </picture>
          )}
          <i className="rl-hk-glare" />
        </span>
      </span>
    </a>
  );
};

export const ListHero = ({ t, locale, all, reduced }: {
  t: RealizacjeDict; locale: Locale; all: WorkItem[]; reduced: boolean;
}) => {
  const heroRef = useRef<HTMLElement>(null);
  const lenis = useLenis();
  const first = all[0];
  const bySlug = (slug: string) => all.find((w) => w.slug === slug);

  // Kamera przy przewijaniu: --hp = postęp wyjazdu z nagłówka (0-1); kadry: --mx / --my = kursor (-1..1, wygładzony w CSS).
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero || reduced) return;
    let raf = 0, hp = -1;
    const update = () => {
      raf = 0;
      const r = hero.getBoundingClientRect();
      const n = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height)));
      if (Math.abs(n - hp) > 0.001) { hp = n; hero.style.setProperty('--hp', n.toFixed(3)); }
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    // wydajność (2026-10-05): zapis raz na klatkę i tylko, gdy nagłówek jest na ekranie (dawniej każdy ruch myszy
    // gdziekolwiek na stronie przeliczał style nagłówka)
    let mraf = 0, mx = 0, my = 0;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse' || hp >= 0.999) return;
      mx = (e.clientX / window.innerWidth) * 2 - 1; my = (e.clientY / window.innerHeight) * 2 - 1;
      if (!mraf) mraf = requestAnimationFrame(() => {
        mraf = 0;
        hero.style.setProperty('--mx', mx.toFixed(3));
        hero.style.setProperty('--my', my.toFixed(3));
      });
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      cancelAnimationFrame(mraf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      window.removeEventListener('pointermove', onMove);
      hero.style.removeProperty('--hp');
    };
  }, [reduced]);

  /** Przejazd do planszy realizacji (`at` = postęp planszy; bez JS - zwykła kotwica). */
  const goTo = (slug: string, at: number) => (e: MouseEvent) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    scrollToWork(slug, (y) => {
      if (lenis && !reduced) lenis.scrollTo(y, { duration: 1.8 });
      else window.scrollTo({ top: y, behavior: reduced ? 'auto' : 'smooth' });
    }, at);
  };
  /** Klik w kadr: plansza tej realizacji, gdy kadr i opis już stoją. */
  const goFrame = (slug: string) => goTo(slug, 0.5);

  return (
    <section ref={heroRef} className="rl-hero" aria-labelledby="rl-h1">
      <div className="rl-hk" aria-hidden="true">
        {all.map((w, k) => {
          const d = DEPTH[w.slug];
          if (!d) return null;
          return (
            <HkFrame
              key={w.slug} w={w} k={k} cls="rl-hk-fr" go={goFrame}
              style={{ '--x': `${d.x}%`, '--y': `${d.y}%`, '--w': `${d.w}vw`, '--r': `${d.r}deg`, '--z': d.z } as CSSProperties}
            />
          );
        })}
      </div>

      <div className="rl-hero-in container mx-auto px-6">
        <div className="rl-hero-copy">
          {/* Styl nagłówka /uslugi („Kropka”, runda 13): jedno białe zdanie wysuwa się spod maski, kropka na końcu w kolorze
              marki (jak w logo „AVENLY.”). */}
          <h1 id="rl-h1" className="im-title rl-title">
            <span className="rl-mask"><span className="rl-line">{t.h1Lead} {t.h1Accent.replace(/\.$/, '')}<span className="im-accent">.</span></span></span>
          </h1>
          <p className="im-lead rl-lead rl-in" style={{ '--d': 3 } as CSSProperties}>{t.leadShort}</p>
          <div className="rl-hero-cta rl-in" style={{ '--d': 4 } as CSSProperties}>
            <Link href={localizeHref('/kontakt', locale)} prefetch={false} className="rl-cta">
              {t.cta}
              <ArrowRight aria-hidden="true" />
            </Link>
            <button type="button" className="rl-ghost" onClick={openChat} aria-label={t.chatAria}>{t.chat}</button>
          </div>
          <p className="rl-proof rl-in" style={{ '--d': 5 } as CSSProperties}>
            {t.proof.map((p, k) => (
              <Fragment key={p}>{k > 0 && <span className="rl-proof-dot" aria-hidden="true">·</span>}{p}</Fragment>
            ))}
          </p>
          {/* telefon i tablet: wachlarz trzech kadrów pod tekstem */}
          <div className="rl-hk-fan" aria-hidden="true">
            {FAN.map((slug, k) => {
              const w = bySlug(slug);
              // kolejność wejścia: środkowy pierwszy, potem boczne
              return w ? <HkFrame key={slug} w={w} k={FAN_ORDER[k]} cls="rl-hk-fr rl-hk-fr--fan" go={goFrame} /> : null;
            })}
          </div>
        </div>
      </div>

      {/* Strzałka przewijania na dole pierwszego ekranu: kółko jak przycisk „Porozmawiaj z asystentem”, strzałka co chwilę
          wyjeżdża w dół i wraca od góry. */}
      {first && (
        <a href={`#${workAnchor(first.slug)}`} onClick={goTo(first.slug, 0.02)} className="rl-cue" aria-label={t.cueTitle}>
          <span className="rl-cue-ring rl-in" style={{ '--d': 9 } as CSSProperties}>
            <ArrowDown className="rl-cue-arrow" aria-hidden="true" />
          </span>
        </a>
      )}
    </section>
  );
};
