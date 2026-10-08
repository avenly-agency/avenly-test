'use client';

import './footer.css';
import { useCallback, type CSSProperties, type MouseEvent } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useLenis } from 'lenis/react';
import { localeFromPathname } from '@/lib/i18n/locale';
import { footerDict } from '@/lib/i18n/footer';
import { getServiceTheme } from '@/lib/service-theme';
import type { FooterCtx } from './footer/shared';
import { DotFooter } from './footer/dot';

// Stopka jest na każdej podstronie (AppShell) i w wersji EN. Od 2026-09-27 zamyka stronę główną
// (końcowa sekcja CTA usunięta). Układ „Kropka” z zakończeniem „Nad i” (wybór właściciela 2026-09-28):
// footer/dot.tsx, wspólne klocki i dane z lib/seo-data.ts: footer/shared.tsx, style: footer.css
// (prefiks .ft-). Akcent = kolor motywu podstrony (niebieski na stronie głównej, np. bursztyn na
// podstronie sklepu) - jak nawigacja, pasek przewijania i czat.

export const Footer = () => {
  const pathname = usePathname();
  const router = useRouter();
  const lenis = useLenis();

  const locale = localeFromPathname(pathname);
  const t = footerDict[locale];
  const theme = getServiceTheme(pathname);
  const isHome = pathname === '/' || pathname === '/en';
  const homeHref = locale === 'en' ? '/en/' : '/';

  const onAnchor = useCallback((e: MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!href.startsWith('#')) return;
    e.preventDefault();
    if (isHome) lenis?.scrollTo(href, { offset: -100, duration: 1.5 });
    else router.push(`${homeHref}?target=${href.slice(1)}`);
  }, [isHome, lenis, router, homeHref]);

  const ctx: FooterCtx = {
    locale,
    t,
    onAnchor,
    isContact: pathname === '/kontakt' || pathname === '/en/contact',
  };

  return (
    <footer className="ft" style={{ '--ft-accent': theme.hex } as CSSProperties}>
      <DotFooter ctx={ctx} />
    </footer>
  );
};
