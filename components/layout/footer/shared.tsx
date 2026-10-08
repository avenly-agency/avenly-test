'use client';

import { useEffect, useSyncExternalStore, type MouseEvent, type ReactNode, type RefObject } from 'react';
import Link from 'next/link';
import { useLenis } from 'lenis/react';
import { ArrowRight, ArrowUp, Facebook, Github, Instagram } from 'lucide-react';
import { OPEN_SETTINGS_EVENT } from '@/lib/cookie-consent';
import { localizeHref, type Locale } from '@/lib/i18n/locale';
import type { FooterDict } from '@/lib/i18n/footer';
import { COMPANY_IDS, CONTACT, SOCIAL } from '@/lib/seo-data';

// Klocki stopki: kolumny (usługi / na skróty / kontakt), pasek prawny, przycisk "Bezpłatna
// konsultacja", godziny pracy z lib/seo-data.ts i wejście stref (useFooterReveal). Układ: footer/dot.tsx.

export interface FooterCtx {
  locale: Locale;
  t: FooterDict;
  /** Klik w kotwicę (#uslugi, #proces): Lenis na stronie głównej, ?target= z podstron. */
  onAnchor: (e: MouseEvent<HTMLAnchorElement>, href: string) => void;
  /** Strona kontaktu: CTA przewija do formularza zamiast linkować do samej siebie. */
  isContact: boolean;
}

// ── Dane ──────────────────────────────────────────────────────────────────────

type NavKey = keyof FooterDict['nav'];
const NAV: ReadonlyArray<{ key: NavKey; href: string; plOnly?: boolean }> = [
  { key: 'offer', href: '#uslugi' },
  { key: 'process', href: '#proces' },
  { key: 'projects', href: '/realizacje' },
  { key: 'about', href: '/o-nas' },
  { key: 'blog', href: '/blog', plOnly: true },
  { key: 'contact', href: '/kontakt' },
];

const SOCIALS = [
  { name: 'Facebook', href: SOCIAL.facebook, Icon: Facebook },
  { name: 'Instagram', href: SOCIAL.instagram, Icon: Instagram },
  { name: 'GitHub', href: SOCIAL.github, Icon: Github },
] as const;

type DayKey = keyof FooterDict['days'];

/** CONTACT.hours w formacie schema.org ("Mo-Fr 09:00-17:00") → pierwszy / ostatni dzień i minuty. */
const WORK_HOURS: { from: DayKey; to: DayKey; open: number; close: number } | null = (() => {
  const m = /^(Mo|Tu|We|Th|Fr|Sa|Su)(?:-(Mo|Tu|We|Th|Fr|Sa|Su))?\s+(\d{2}):(\d{2})-(\d{2}):(\d{2})$/.exec(CONTACT.hours);
  if (!m) return null;
  return { from: m[1] as DayKey, to: (m[2] ?? m[1]) as DayKey, open: +m[3] * 60 + +m[4], close: +m[5] * 60 + +m[6] };
})();

const hm = (min: number) => `${Math.floor(min / 60)}:${String(min % 60).padStart(2, '0')}`;

/** "pon-pt, 9:00-17:00" / "Mon-Fri, 9:00-17:00". */
const hoursText = (t: FooterDict) => {
  if (!WORK_HOURS) return '';
  const { from, to, open, close } = WORK_HOURS;
  const days = from === to ? t.days[from] : `${t.days[from]}-${t.days[to]}`;
  return `${days}, ${hm(open)}-${hm(close)}`;
};


// ── Hooki ─────────────────────────────────────────────────────────────────────

const REDUCED = '(prefers-reduced-motion: reduce)';

const subscribeReduced = (cb: () => void) => {
  const mq = window.matchMedia(REDUCED);
  mq.addEventListener('change', cb);
  return () => mq.removeEventListener('change', cb);
};

/** Ograniczony ruch (bez framer-motion w chunku stopki). Serwer i hydratacja: false. */
export const useReducedMotionPref = () =>
  useSyncExternalStore(subscribeReduced, () => window.matchMedia(REDUCED).matches, () => false);

/** Strefy stopki (`.ft-rv` i `[data-z]`) wchodzą osobno, gdy każda sama pojawi się na ekranie
    (na telefonie stopka jest wyższa niż ekran). Na korzeniu `data-live` = JS działa, więc
    obowiązują stany startowe animacji; na strefie `data-in` (weszła) i `data-vis` (jest widoczna -
    pętle animacji stoją poza ekranem). Strefa widoczna już przy montażu dostaje `data-in` razem
    z `data-live` - bez mignięcia. */
export const useFooterReveal = (ref: RefObject<HTMLElement | null>) => {
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const zones = Array.from(root.querySelectorAll<HTMLElement>('.ft-rv, [data-z]'));
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        const z = e.target as HTMLElement;
        if (e.isIntersecting) z.setAttribute('data-in', '');
        z.toggleAttribute('data-vis', e.isIntersecting);
      }
    }, { rootMargin: '0px 0px -6% 0px' });
    // Wejście liczone też z pozycji: strefa, która przy szybkim przeskoku (koniec strony, „Wróć na górę”
    // w drugą stronę) minęła ekran bez przecięcia, i tak musi się pokazać - IO tego nie zgłasza.
    let pending = zones;
    let raf = 0;
    const check = () => {
      raf = 0;
      const vh = innerHeight;
      pending = pending.filter((z) => {
        if (z.getBoundingClientRect().top < vh * 0.94) { z.setAttribute('data-in', ''); return false; }
        return true;
      });
      if (!pending.length) removeEventListener('scroll', onScroll);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(check); };
    check();
    zones.forEach((z) => io.observe(z));
    root.setAttribute('data-live', '');
    if (pending.length) addEventListener('scroll', onScroll, { passive: true });
    return () => { io.disconnect(); cancelAnimationFrame(raf); removeEventListener('scroll', onScroll); };
  }, [ref]);
};

// ── Klocki ────────────────────────────────────────────────────────────────────

/** Tytuł końcowego akcentu - kropka na końcu w kolorze akcentu, jak w logo "AVENLY.". */
export const ClosingTitle = ({ text }: { text: string }) => (
  <h2 className="ft-title">
    {text}<span className="ft-period">.</span>
  </h2>
);

/** Jedyne CTA serwisu. Na stronie kontaktu przewija do formularza (góra strony). */
export const ConsultButton = ({ ctx, className = '' }: { ctx: FooterCtx; className?: string }) => {
  const lenis = useLenis();
  const { t, locale, isContact } = ctx;
  if (isContact) {
    return (
      <button
        type="button"
        className={`ft-cta ${className}`}
        aria-label={t.ctaHere}
        onClick={() => (lenis ? lenis.scrollTo(0, { duration: 1.4 }) : window.scrollTo({ top: 0, behavior: 'smooth' }))}
      >
        {t.cta}<ArrowUp size={18} aria-hidden="true" />
      </button>
    );
  }
  return (
    <Link href={localizeHref('/kontakt', locale)} className={`ft-cta ${className}`}>
      {t.cta}<ArrowRight size={18} aria-hidden="true" />
    </Link>
  );
};

const ColHead = ({ children }: { children: ReactNode }) => <h2 className="ft-col-head">{children}</h2>;

export const ServicesCol = ({ ctx }: { ctx: FooterCtx }) => (
  <nav className="ft-col" aria-label={ctx.t.servicesHeading}>
    <ColHead>{ctx.t.servicesHeading}</ColHead>
    <ul className="ft-list">
      {ctx.t.services.map((s) => (
        <li key={s.href}><Link href={localizeHref(s.href, ctx.locale)} className="ft-link">{s.label}</Link></li>
      ))}
      <li>
        <Link href={localizeHref('/uslugi', ctx.locale)} className="ft-link ft-link--more">
          {ctx.t.allServices}<ArrowRight size={14} aria-hidden="true" />
        </Link>
      </li>
    </ul>
  </nav>
);

export const NavCol = ({ ctx }: { ctx: FooterCtx }) => (
  <nav className="ft-col" aria-label={ctx.t.menuHeading}>
    <ColHead>{ctx.t.menuHeading}</ColHead>
    <ul className="ft-list">
      {NAV.filter((n) => !(n.plOnly && ctx.locale === 'en')).map((n) => {
        const href = localizeHref(n.href, ctx.locale);
        return (
          <li key={n.key}>
            <Link href={href} className="ft-link" onClick={(e) => ctx.onAnchor(e, href)}>{ctx.t.nav[n.key]}</Link>
          </li>
        );
      })}
    </ul>
  </nav>
);

/** E-mail, telefony i godziny pracy - wszystko z lib/seo-data.ts. */
const ContactList = ({ ctx }: { ctx: FooterCtx }) => {
  const hours = hoursText(ctx.t);
  return (
    <ul className="ft-contact">
      <li><a href={`mailto:${CONTACT.email}`} className="ft-link ft-link--strong">{CONTACT.email}</a></li>
      <li><a href={`tel:${CONTACT.phone}`} className="ft-link">{CONTACT.phoneDisplay}</a></li>
      {CONTACT.phone2 && <li><a href={`tel:${CONTACT.phone2}`} className="ft-link">{CONTACT.phone2Display}</a></li>}
      {hours && <li className="ft-hours"><span className="sr-only">{ctx.t.hours}: </span>{hours}</li>}
    </ul>
  );
};

export const ContactCol = ({ ctx }: { ctx: FooterCtx }) => (
  <div className="ft-col">
    <ColHead>{ctx.t.contactHeading}</ColHead>
    <ContactList ctx={ctx} />
  </div>
);

export const Socials = ({ ctx }: { ctx: FooterCtx }) => (
  <ul className="ft-socials" aria-label={ctx.t.socialsAria}>
    {SOCIALS.map(({ name, href, Icon }) => (
      <li key={name}>
        <a href={href} target="_blank" rel="noopener noreferrer" className="ft-social" aria-label={`${name} ${ctx.t.newTab}`}>
          <Icon size={18} strokeWidth={1.6} aria-hidden="true" />
        </a>
      </li>
    ))}
  </ul>
);

export const BackToTop = ({ ctx }: { ctx: FooterCtx }) => {
  const lenis = useLenis();
  const reduced = useReducedMotionPref();
  return (
    <button
      type="button"
      className="ft-top"
      onClick={() => {
        if (reduced) window.scrollTo({ top: 0 });
        else if (lenis) lenis.scrollTo(0, { duration: 1.6 });
        else window.scrollTo({ top: 0, behavior: 'smooth' });
      }}
    >
      {ctx.t.backToTop}<ArrowUp size={15} aria-hidden="true" />
    </button>
  );
};

/** Dolny pasek: prawa autorskie, NIP (gdy uzupełniony), polityka, cookies, ocena, profile, "Wróć na górę". */
export const LegalBar = ({ ctx, className = '' }: { ctx: FooterCtx; className?: string }) => (
  <div className={`ft-legal ${className}`}>
    <div className="ft-legal-l">
      <p>{ctx.t.copyright(new Date().getFullYear())}</p>
      {COMPANY_IDS.nip && <p>{ctx.t.nip(COMPANY_IDS.nip)}</p>}
      <nav aria-label={ctx.t.legalHeading} className="ft-legal-nav">
        {/* Polityka prywatności ma tylko wersję PL - href zawsze /polityka-prywatnosci (bez localizeHref) */}
        <Link href="/polityka-prywatnosci" className="ft-link">{ctx.t.privacyPolicy}</Link>
        <button type="button" className="ft-link" onClick={() => window.dispatchEvent(new Event(OPEN_SETTINGS_EVENT))}>
          {ctx.t.cookieSettings}
        </button>
      </nav>
    </div>
    <div className="ft-legal-r">
      <Socials ctx={ctx} />
      <BackToTop ctx={ctx} />
    </div>
  </div>
);

