'use client';

import { useEffect, useRef, useState, type CSSProperties, type MouseEvent } from 'react';
import Link from 'next/link';
import { useInView, useMotionValue, useSpring } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { localizeHref, type Locale } from '@/lib/i18n/locale';
import type { ImpactDict } from '@/lib/i18n/home/impact';
import { ORBS_FS, SCAN_FS, ShaderCanvas, TOPO_FS, VOLTAGE_FS } from './shader';
import { CardViz, SCENES } from './viz';

// Sekcja "Dlaczego Avenly" - układ STOS WARSTW (wybór właściciela 2026-09-26 spośród 5 propozycji,
// razem ze stylem wizualizacji "Konstelacje"). Karty przyklejone jedna na drugiej: kolejna nasuwa
// się na poprzednią, a ta cofa się w głąb (mniejsza, ciemniejsza) - głębia bez rozmycia; przykryta
// karta stoi (shader w pauzie). Bez przechwytywania scrolla (zwykłe position: sticky) i bez
// efektów najechania. Tylko ekrany ≥ 1024 × 780 (karta mieści się w oknie); niżej zwykła lista.
// Historia w kartach biegnie na wspólnej osi czasu (VIZ_EPOCH) - bez restartu przy zmianie karty.
//
// 2026-09-26, runda 5 (właściciel: "bardziej premium feeling, czegoś brakuje"): karta ma
// NAGŁÓWEK-ZAKŁADKĘ (numer "03 / 04", kategoria, ikona) - przykryte karty pokazują właśnie ją, więc
// stos czyta się jak podpisane warstwy; tekst redakcyjny (duży tytuł).
// Runda 6 (właściciel: "zrób to na full box, a nie takie małe; pierwotnie były zbalansowane"):
// teren shadera na CAŁEJ karcie (także pod nagłówkiem) z rozkładem jak w pierwotnych kaflach -
// jasno wokół wizualizacji i przy krawędziach, czysto pod tekstem. Okno-instrument usunięte.
// Runda 7: nagłówek bez ikony (numer + kategoria), tło karty = głęboka, neutralna czerń zamiast
// granatowo-szarego ("matowego") gradientu; za stosem tło sekcji (impact/backdrop.tsx).
// Runda 8 (właściciel: "2 i 4 box odbij lustrzanie, heading z tekstem do góry albo przekmiń
// ułożenie"): karty 2 i 4 w lustrze (wizualizacja po lewej, tekst i zakładka po prawej - stos
// czyta się zygzakiem); zakładka stoi w tej samej siatce co treść, więc numer zaczyna się dokładnie
// nad tytułem. Ułożenie tekstu: "U góry" (wybór właściciela 2026-09-27; "U dołu" usunięte) - tytuł
// i opis tuż pod zakładką, dodatek (wynik 98/100, link) na dole kolumny.
// Runda 9 (właściciel: "żeby minimalnie zmieniał się kolor tła w zależności od boxa na ekranie;
// lepiej umiejscowić napisy historii"): aktywna karta (przednia w stosie / najbliżej środka ekranu
// na liście) ustawia na sekcji --im-tint = jej akcent - KSZTAŁTY tła sekcji (impact/backdrop.tsx:
// warstwice mapy) przyjmują ten kolor z płynnym przejściem
// (@property w globals.css); samo tło zostaje neutralne (poprawka właściciela). Napis kroku historii stoi
// na dole karty pod wizualizacją, z paskiem kroków na jej szerokość (wspólna linia z dodatkiem
// w kolumnie tekstu).
// Runda 11 (właściciel: "te same efekty ze scrollem co na desktopie także na telefonie"): stos działa
// na KAŻDEJ szerokości. Poza pełnym stosem (>= 1024 x 780, stała wysokość karty) karta ma wysokość
// z treści, a jej przyklejenie liczy CSS: top = min(góra stosu + i * zakładka, 100svh - wysokość
// karty - 12 px) - wysoka karta przykleja się dopiero, gdy widać jej dół (nic nie zostaje ucięte),
// a zakładki przykrytych kart widać tam, gdzie ekran na to pozwala. JS mierzy wysokości (--h),
// czyta rzeczywiste "top" każdej karty i dopiero wtedy włącza stos (data-stack) - bez JS zwykła lista.

type Benefit = 1 | 2 | 3 | 4;

export interface StackProps {
  t: ImpactDict;
  locale: Locale;
  reduced: boolean;
  /** "Sprawdź ofertę" - płynny przejazd do sekcji oferty na stronie głównej. */
  onOffer: (e: MouseEvent<HTMLAnchorElement>) => void;
}

/** Korzyść: shader karty, akcent (kolor shadera "r g b" + jasny odcień dla wizualizacji). */
const META: Record<Benefit, { fs: string; rgb: string; hi: string }> = {
  1: { fs: TOPO_FS, rgb: '59 130 246', hi: '147 197 253' },
  2: { fs: ORBS_FS, rgb: '129 140 248', hi: '199 210 254' },
  3: { fs: VOLTAGE_FS, rgb: '245 190 60', hi: '253 230 138' },
  4: { fs: SCAN_FS, rgb: '87 199 115', hi: '167 243 208' },
};
const ALL: Benefit[] = [1, 2, 3, 4];
const nn = (i: number) => String(i).padStart(2, '0');
const copy = (t: ImpactDict, n: Benefit): [string, string] =>
  ([[t.card1Title, t.card1Desc], [t.card2Title, t.card2Desc], [t.card3Title, t.card3Desc], [t.card4Title, t.card4Desc]] as const)[n - 1] as [string, string];
/** Akcent korzyści jako zmienne CSS (--ic, --ic-hi): obwódka, podpisy, historia. */
const accent = (n: Benefit) => ({ '--ic': META[n].rgb, '--ic-hi': META[n].hi }) as CSSProperties;
const clamp01 = (v: number) => Math.min(Math.max(v, 0), 1);

// --- WYDAJNY LICZNIK --- (useRef + onChange: bez renderu 60 razy na sekundę)
function Counter({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-20px' });
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { damping: 30, stiffness: 60 });
  useEffect(() => {
    if (isInView) motionValue.set(value);
  }, [isInView, value, motionValue]);
  useEffect(() => springValue.on('change', (latest) => {
    if (ref.current) ref.current.textContent = Math.round(latest).toString();
  }), [springValue]);
  return <span ref={ref}>0</span>;
}

/** Tekst korzyści (tytuł, opis, dodatek) - `data-im-shield`: pod tą kolumną shader łagodnie
    wygasza warstwice (miękka elipsa, bez prostokątów). */
const BenefitText = ({ n, t, locale }: { n: Benefit; t: ImpactDict; locale: Locale }) => {
  const [title, desc] = copy(t, n);
  return (
    <div className="il-st-text">
      <h3 className="il-title" data-im-shield="text">{title}</h3>
      <p className="il-desc" data-im-shield="text">{desc}</p>
      {n === 2 && (
        <Link href={localizeHref('/uslugi/automatyzacje-ai/chatboty-ai', locale)} prefetch={false} className="im-link il-extra" data-im-shield="extra">
          {t.card2Tag}
          <ArrowRight aria-hidden="true" />
        </Link>
      )}
      {n === 3 && (
        <div className="im-score il-score il-extra" data-im-shield="extra">
          <span className="sr-only">{t.card3CounterAria}</span>
          <span className="im-score-num" aria-hidden="true">
            <Counter value={98} />
            <small>/100</small>
          </span>
          <span className="im-score-label" aria-hidden="true">{t.card3CounterLabel}</span>
        </div>
      )}
    </div>
  );
};

/** Karta: teren shadera na całej powierzchni, nagłówek-zakładka (numer, kategoria), tekst + wizualizacja z historią;
    `paused` = przykryta w stosie; karty 2 i 4 (i nieparzyste) w lustrze - od 1024 px. */
const StackCard = ({ n, i, t, locale, reduced, paused }: {
  n: Benefit; i: number; t: ImpactDict; locale: Locale; reduced: boolean; paused: boolean;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <article className={`im-card il-st-card${i % 2 ? ' il-st-card--flip' : ''}`} style={{ ...accent(n), '--i': i } as CSSProperties}>
      {!reduced && (
        <div className="absolute inset-px" aria-hidden="true">
          <ShaderCanvas fragmentShader={META[n].fs} scene={SCENES[n]} overlayRef={ref} paused={paused} />
        </div>
      )}
      <header className="il-st-head">
        <span className="il-st-tag">
          <span className="il-st-idx" aria-hidden="true"><b>{nn(i + 1)}</b><i>/ {nn(ALL.length)}</i></span>
          <span className="il-st-kicker">{t.kickers[n - 1]}</span>
        </span>
      </header>
      <div className="il-st-body">
        <BenefitText n={n} t={t} locale={locale} />
        <div className="il-st-view">
          <CardViz card={n} t={t} frameRef={ref} />
        </div>
      </div>
      <span className="il-st-shade" aria-hidden="true" />
    </article>
  );
};


export const StackLayout = ({ t, locale, reduced, onOffer }: StackProps) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const [covered, setCovered] = useState<boolean[]>(() => ALL.map(() => false));

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const cards = Array.from(root.querySelectorAll<HTMLElement>('.il-st-card'));
    const section = root.closest<HTMLElement>('section');
    let raf = 0;
    let lastCov = '';
    let lastTint = -1;
    let tops: number[] = cards.map(() => 0);
    // Wysokości kart (--h) -> CSS liczy "top" przyklejenia; odczytany "top" = punkt, w którym karta
    // staje (także ujemny, gdy karta jest wyższa niż wolne miejsce na ekranie).
    const measure = () => {
      cards.forEach((c) => c.style.setProperty('--h', `${c.offsetHeight}px`));
      root.setAttribute('data-stack', '');
      tops = cards.map((c) => parseFloat(getComputedStyle(c).top) || 0);
    };
    const update = () => {
      raf = 0;
      // Ile karta i nasunęła się na poprzednią (0 = jeszcze niżej, 1 = przyklejona).
      const cover = cards.map((c, i) => (i === 0 ? 0 : clamp01(1 - (c.getBoundingClientRect().top - tops[i]) / c.offsetHeight)));
      // Przykryta karta cofa się w głąb: mniejsza i ciemniejsza, ale jej zakładka zostaje czytelna
      // (bez ruchu przy reduced motion - samo nakładanie kart zostaje).
      cards.forEach((c, i) => {
        let depth = 0;
        for (let j = i + 1; j < cards.length; j++) depth += cover[j];
        c.style.transform = !reduced && depth > 0.001 ? `scale(${(1 - 0.03 * depth).toFixed(4)})` : '';
        c.style.setProperty('--sh', !reduced ? Math.min(depth * 0.26, 0.6).toFixed(3) : '0');
      });
      // Aktywna karta = przednia w stosie (nasunięta w ponad połowie).
      let active = 0;
      cover.forEach((v, i) => { if (v > 0.5) active = i; });
      if (active !== lastTint && section) {
        lastTint = active;
        section.style.setProperty('--im-tint', `rgb(${META[ALL[active]].rgb})`);
      }
      const cov = cards.map((_, i) => i + 1 < cards.length && cover[i + 1] > 0.97);
      const key = cov.join();
      if (key !== lastCov) {
        lastCov = key;
        setCovered(cov);
      }
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    // Zmiana wysokości kart (szerokość, fonty, układ tekstu) -> ponowny pomiar w następnej klatce.
    let mraf = 0;
    const onResize = () => {
      if (mraf) return;
      mraf = requestAnimationFrame(() => { mraf = 0; measure(); update(); });
    };
    measure();
    update();
    const ro = new ResizeObserver(onResize);
    cards.forEach((c) => ro.observe(c));
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    return () => {
      ro.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(raf);
      cancelAnimationFrame(mraf);
    };
  }, [reduced]);

  return (
    <>
      <div ref={rootRef} className="il-st">
        {ALL.map((n, i) => (
          <StackCard key={n} n={n} i={i} t={t} locale={locale} reduced={reduced} paused={covered[i]} />
        ))}
        <div className="il-st-end" aria-hidden="true" />
      </div>
      <div className="il-cta-row" style={accent(1)}>
        <Link href={localizeHref('/#oferta', locale)} onClick={onOffer} className="im-cta">
          {t.card4Cta}
          <ArrowRight aria-hidden="true" />
        </Link>
      </div>
    </>
  );
};
