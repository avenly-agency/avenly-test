'use client';

import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { localizeHref, type Locale } from '@/lib/i18n/locale';
import { Sky } from './sky';
import { serviceLook } from './theme';
import { useIntro, useSeen } from './shared';
import './usluga.css'; // style szkieletu we własnym pliku (praca równoległa - PRACA-ROWNOLEGLA.md), prefiks sv-

// SZKIELET PODSTRONY USŁUGI (praca równoległa, etap 3 - chat 7, pilot one-page). Części wspólne dla 7 podstron usług:
//   ServiceShell  - korzeń .sv: kolor motywu podstrony (z adresu, lib/service-theme.ts), tło-mgławica, wejście z czerni,
//   ServiceHead   - nagłówek: jedno zdanie z kropką w kolorze podstrony + opis + „Bezpłatna konsultacja” + linia dowodów,
//   Steps         - podpisy kroków sceny (animacja tłumaczy się sama - PRODUCT.md, Design Principles 6),
//   ServiceScope  - „co dostajesz”: lista zakresu + termin (te same miejsca na każdej podstronie - drabina usług),
//   ServiceEnding - zakończenie nad stopką (do decyzji właściciela, czy w ogóle zostaje).
// Każda podstrona dokłada WŁASNĄ scenę pokazującą usługę i własne teksty. Notatki: docs/podstrony/usluga-one-page.md.

export interface ServiceHeadCopy { title: string; lead: string; cta: string; proof: string[] }
export interface ServiceScopeCopy {
  title: string; titleAccent: string;
  items: { title: string; text: string }[];
  termLabel: string; termValue: string;
  fitsLabel: string; fits: string[];
}
export interface ServiceEndingCopy { title: string; text: string; cta: string }

const NOSCRIPT = '.sv .sv-line,.sv .sv-in,.sv .sv-late,.sv .sv-wait{animation:none!important;transform:none!important;opacity:1!important}.sv .sv-rvb-real{-webkit-mask-image:none!important;mask-image:none!important}';

/** Podstrona bez mgławicy (własne tło): wejście rusza od razu po montażu. */
const NoSky = ({ onReady }: { onReady: () => void }) => {
  useEffect(() => { onReady(); }, [onReady]);
  return null;
};

export const ServiceShell = ({ children, className, sky = true }: {
  children: ReactNode; className?: string;
  /** false = bez mgławicy (podstrona ma własne tło). */
  sky?: boolean;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const look = serviceLook(usePathname());
  const onSky = useIntro(ref);
  return (
    <div ref={ref} className={className ? `sv ${className}` : 'sv'} style={{ '--sv-ac': look.accent } as CSSProperties}>
      <noscript><style>{NOSCRIPT}</style></noscript>
      {sky ? <Sky tint={look.tint} onReady={onSky} /> : <NoSky onReady={onSky} />}
      {children}
      <div className="sv-sky-end" aria-hidden="true" />
    </div>
  );
};

/** Biały przycisk „Bezpłatna konsultacja” (jak w hero strony głównej, stopce i na zamkniętych podstronach). */
export const ConsultLink = ({ label, locale, className }: { label: string; locale: Locale; className?: string }) => (
  <Link href={localizeHref('/kontakt', locale)} prefetch={false} className={className ? `sv-cta ${className}` : 'sv-cta'} data-sk="btn">
    {label}
    <ArrowRight aria-hidden="true" />
  </Link>
);

/** Linia dowodów pod przyciskiem (tylko obronne fakty - PRODUCT.md). */
export const Proof = ({ items, className, style }: { items: string[]; className?: string; style?: CSSProperties }) => (
  <p className={className ? `sv-proof ${className}` : 'sv-proof'} style={style}>
    {items.map((p, i) => (
      <span key={p}>{i > 0 && <span className="sv-proof-dot" aria-hidden="true">·</span>}{p}</span>
    ))}
  </p>
);

/** Nagłówek podstrony: zdanie wysuwa się spod maski, kropka na końcu w kolorze podstrony (jak „AVENLY.”).
    `plain` = bez własnego wejścia (wejście robi scena, np. szkic -> gotowa treść). */
export const ServiceHead = ({ t, locale, align = 'center', plain = false, id = 'sv-h1', children }: {
  t: ServiceHeadCopy; locale: Locale; align?: 'center' | 'start'; plain?: boolean; id?: string; children?: ReactNode;
}) => {
  const cls = (c: string) => (plain ? '' : ` ${c}`);
  return (
    <header className="sv-head" data-align={align}>
      <h1 id={id} className="im-title sv-title">
        <span className={plain ? undefined : 'sv-mask'}>
          <span className={plain ? undefined : 'sv-line'}>{t.title}<span className="im-accent">.</span></span>
        </span>
      </h1>
      <p className={`im-lead sv-lead${cls('sv-in')}`} style={{ '--d': 3 } as CSSProperties}>{t.lead}</p>
      <div className={`sv-actions${cls('sv-in')}`} style={{ '--d': 4 } as CSSProperties}>
        <ConsultLink label={t.cta} locale={locale} />
      </div>
      <Proof items={t.proof} className={plain ? undefined : 'sv-in'} style={{ '--d': 5 } as CSSProperties} />
      {children}
    </header>
  );
};

/** Podpisy kroków sceny. Aktywny krok i wypełnienie pasków ustawia scena przez setSteps (bez renderów Reacta).
    Bez JS / ograniczony ruch: zwykła numerowana lista wszystkich kroków. */
export const Steps = ({ items, label }: { items: string[]; label: string }) => (
  <ol className="sv-steps" aria-label={label}>
    {items.map((s, i) => (
      <li key={i} className="sv-step" style={{ '--i': i } as CSSProperties}>
        <span className="sv-step-bar" aria-hidden="true"><i /></span>
        <span className="sv-step-body">
          <span className="sv-step-n" aria-hidden="true">{i + 1}</span>
          <span className="sv-step-t">{s}</span>
        </span>
      </li>
    ))}
  </ol>
);
/** Krok `active` (indeks) + wypełnienia pasków 0-1. Pisze tylko przy zmianie. */
export const setSteps = (steps: HTMLElement[], active: number, fills: number[]) => {
  steps.forEach((li, i) => {
    const on = i === active ? '1' : i < active ? '2' : '0';
    if (li.dataset.on !== on) li.dataset.on = on;
    const v = fills[i].toFixed(3);
    if (li.style.getPropertyValue('--f') !== v) li.style.setProperty('--f', v);
  });
};

/** „Co dostajesz”: nagłówek, termin na linii wymiarowej (motyw rysunków Oferty), „sprawdza się”, lista zakresu.
    Wiersze listy tylko się pojawiają (linia rysuje się od lewej, tekst po niej) - bez zmiany pozycji. */
export const ScopeBody = ({ t, level = 'h2', id }: { t: ServiceScopeCopy; level?: 'h2' | 'h3'; id?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  useSeen(ref, 0.12);
  const H = level;
  return (
    <div ref={ref} className="sv-scope-in">
      <div className="sv-scope-head">
        <H id={id} className="im-title sv-h2">{t.title} <span className="im-accent">{t.titleAccent}</span></H>
        <div className="sv-term">
          <span className="sv-term-l">{t.termLabel}</span>
          <span className="sv-term-dim"><i aria-hidden="true" /><b>{t.termValue}</b><i aria-hidden="true" /></span>
        </div>
        <p className="sv-fits">
          <span className="sv-fits-l">{t.fitsLabel}</span>
          {t.fits.map((x) => <span key={x} className="sv-fits-i">{x}</span>)}
        </p>
      </div>
      <ol className="sv-scope-list">
        {t.items.map((it, i) => (
          <li key={it.title} className="sv-scope-row" style={{ '--i': i } as CSSProperties}>
            <span className="sv-scope-n" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
            <span className="sv-scope-t">{it.title}</span>
            <span className="sv-scope-d">{it.text}</span>
          </li>
        ))}
      </ol>
    </div>
  );
};
export const ServiceScope = ({ t }: { t: ServiceScopeCopy }) => (
  <section className="sv-scope" aria-labelledby="sv-scope-h">
    <div className="container mx-auto px-6">
      <ScopeBody t={t} id="sv-scope-h" />
    </div>
  </section>
);

/** Zakończenie nad stopką: jedno zdanie z kropką i przycisk (propozycja - do decyzji właściciela, czy zostaje). */
export const ServiceEnding = ({ t, locale }: { t: ServiceEndingCopy; locale: Locale }) => {
  const ref = useRef<HTMLDivElement>(null);
  useSeen(ref, 0.3);
  return (
    <section className="sv-end" aria-labelledby="sv-end-h">
      <div ref={ref} className="container mx-auto px-6 sv-end-in">
        <h2 id="sv-end-h" className="im-title sv-h2">{t.title}<span className="im-accent">.</span></h2>
        <p className="im-lead sv-end-lead">{t.text}</p>
        <div><ConsultLink label={t.cta} locale={locale} /></div>
      </div>
    </section>
  );
};
