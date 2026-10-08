import type { Locale } from '@/lib/i18n/locale';

/**
 * Słownik sekcji Portfolio (homepage). Wzorzec jak hero.ts:
 * - interface PortfolioDict z samymi stringami (JSX/ikony/shadery/klasy zostają w komponencie),
 * - export portfolioDict: Record<Locale, PortfolioDict>,
 * - PL = tekst 1:1 z komponentu sprzed ekstrakcji (bajt w bajt),
 * - EN = copy marketingowe wg PRODUCT.md (benefit voice, sentence case,
 *   bez em/en dashes, zero fabrykowanych metryk).
 *
 * UWAGA: tytuły/opisy/kategorie projektów pochodzą z app/data/projects.ts
 * i NIE są tłumaczone - zostają w JSX bez zmian. Tu żyją wyłącznie nagłówki
 * sekcji, teksty karty CTA, etykiety przycisków kart i aria-labele.
 *
 * cardProjectAriaPrefix jest sklejany w komponencie z (nietłumaczonym)
 * project.title: `${t.cardProjectAriaPrefix} ${project.title}` - dlatego to
 * prefiks, a nie funkcja (interfejs trzyma się samych stringów).
 */

export interface PortfolioDict {
  sectionAriaLabel: string;
  introEyebrow: string;
  headingLine1: string;
  headingLine2Accent: string;
  introDesc: string;
  mobileHint: string;
  ctaTitle: string;
  ctaDesc: string;
  ctaPrimaryDesktop: string;
  ctaPrimaryMobile: string;
  ctaSecondary: string;
  cardTestChat: string;
  cardViewOnline: string;
  cardViewCaseStudy: string;
  cardLiveAriaLabel: string;
  cardChatAriaLabel: string;
  cardProjectAriaPrefix: string;
}

export const portfolioDict: Record<Locale, PortfolioDict> = {
  pl: {
    sectionAriaLabel: 'Portfolio Realizacji',
    introEyebrow: 'Portfolio',
    headingLine1: 'Wybrane',
    headingLine2Accent: 'Realizacje',
    introDesc: 'Zobacz, co dostają nasi klienci. Od stron WWW po chatboty AI.',
    mobileHint: 'Przesuń, aby zobaczyć.',
    ctaTitle: 'Twój projekt?',
    ctaDesc: 'Dołącz do liderów rynku i wyskaluj swój biznes.',
    ctaPrimaryDesktop: 'Rozpocznij',
    ctaPrimaryMobile: 'Działajmy',
    ctaSecondary: 'Wszystkie realizacje',
    cardTestChat: 'Przetestuj Online',
    cardViewOnline: 'Zobacz online',
    cardViewCaseStudy: 'Zobacz realizację',
    cardLiveAriaLabel: 'Zobacz stronę na żywo',
    cardChatAriaLabel: 'Otwórz asystenta AI Avenly',
    cardProjectAriaPrefix: 'Zobacz projekt',
  },
  en: {
    sectionAriaLabel: 'Project portfolio',
    introEyebrow: 'Portfolio',
    headingLine1: 'Selected',
    headingLine2Accent: 'work',
    introDesc: 'See what you get. From websites to AI chatbots.',
    mobileHint: 'Swipe to explore.',
    ctaTitle: 'Your project?',
    ctaDesc: 'Join the market leaders and scale your business.',
    ctaPrimaryDesktop: 'Get started',
    ctaPrimaryMobile: "Let's go",
    ctaSecondary: 'All projects',
    cardTestChat: 'Try it live',
    cardViewOnline: 'View live',
    cardViewCaseStudy: 'View project',
    cardLiveAriaLabel: 'View the live site',
    cardChatAriaLabel: 'Open the Avenly AI assistant',
    cardProjectAriaPrefix: 'View project',
  },
};
