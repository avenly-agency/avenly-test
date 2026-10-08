import type { Locale } from '@/lib/i18n/locale';

/**
 * Słownik globalnej stopki (components/layout/Footer.tsx + components/layout/footer/*).
 *
 * Footer to komponent GLOBALNY ('use client', montowany w AppShell) - nie
 * dostaje propsów ze stron. Locale wykrywa sam przez
 * localeFromPathname(usePathname()), słownik importuje bezpośrednio
 * (oba języki w bundlu - akceptowalne, same krótkie stringi).
 *
 * Dane firmy (e-mail, telefony, godziny, NIP, profile, ocena Google) NIE są
 * tutaj - pochodzą z lib/seo-data.ts. Tu tylko etykiety.
 *
 * EN = naturalny angielski wg PRODUCT.md (benefit voice, sentence case,
 * bez em/en dashes). Zero JSX.
 *
 * Uwaga i18n:
 * - Blog jest PL-only - w wersji EN link Blog jest ukrywany w komponencie.
 * - Polityka prywatności ma tylko wersję PL - link celowo prowadzi do
 *   /polityka-prywatnosci w OBU językach (bez localizeHref).
 */

type NavKey = 'offer' | 'process' | 'projects' | 'about' | 'blog' | 'contact';

export interface FooterDict {
  menuHeading: string;
  servicesHeading: string;
  contactHeading: string;
  legalHeading: string;
  nav: Record<NavKey, string>;
  services: ReadonlyArray<{ label: string; href: string }>;
  allServices: string;
  /** Skróty dni tygodnia do godzin pracy (klucze jak w schema.org: Mo, Tu...). */
  days: Record<'Mo' | 'Tu' | 'We' | 'Th' | 'Fr' | 'Sa' | 'Su', string>;
  hours: string;
  privacyPolicy: string;
  cookieSettings: string;
  /** Renderuje pełny wiersz praw autorskich, np. "© 2026 Avenly." */
  copyright: (year: number) => string;
  nip: (nip: string) => string;
  socialsAria: string;
  newTab: string;
  backToTop: string;
  cta: string;
  /** Na stronie kontaktu przycisk nie prowadzi do samej siebie, tylko przewija do formularza. */
  ctaHere: string;
  /** Końcowy akcent stopki. Tytuł MUSI kończyć się literą „i” - jej kropkę rysuje stopka
      (niebieska kropka marki spada na literę). */
  dot: { title: string; lead: string };
}

export const footerDict: Record<Locale, FooterDict> = {
  pl: {
    menuHeading: 'Na skróty',
    servicesHeading: 'Usługi',
    contactHeading: 'Kontakt',
    legalHeading: 'Informacje prawne',
    nav: {
      offer: 'Oferta',
      process: 'Proces',
      projects: 'Realizacje',
      about: 'O nas',
      blog: 'Blog',
      contact: 'Kontakt',
    },
    services: [
      { label: 'Strona one-page', href: '/uslugi/strony-www/one-page' },
      { label: 'Strona firmowa', href: '/uslugi/strony-www/strona-firmowa' },
      { label: 'Strona interaktywna', href: '/uslugi/strony-www/strona-szyta-na-miare' },
      { label: 'Sklep internetowy', href: '/uslugi/strony-www/sklep-internetowy' },
      { label: 'System CRM', href: '/uslugi/strony-www/system-crm' },
      { label: 'Chatboty AI', href: '/uslugi/automatyzacje-ai/chatboty-ai' },
    ],
    allServices: 'Wszystkie usługi',
    days: { Mo: 'pon', Tu: 'wt', We: 'śr', Th: 'czw', Fr: 'pt', Sa: 'sob', Su: 'ndz' },
    hours: 'Godziny pracy',
    privacyPolicy: 'Polityka prywatności',
    cookieSettings: 'Ustawienia cookies',
    copyright: (year) => `© ${year} Avenly.`,
    nip: (nip) => `NIP ${nip}`,
    socialsAria: 'Avenly w mediach społecznościowych',
    newTab: '(otwiera się w nowej karcie)',
    backToTop: 'Wróć na górę',
    cta: 'Bezpłatna konsultacja',
    ctaHere: 'Bezpłatna konsultacja - przejdź do formularza',
    dot: {
      title: 'Postaw kropkę nad i',
      lead: 'Dobra firma zasługuje na stronę, która domyka całość. Zacznij od bezpłatnej rozmowy, a odpowiedź dostaniesz w ciągu 24 h.',
    },
  },
  en: {
    menuHeading: 'Shortcuts',
    servicesHeading: 'Services',
    contactHeading: 'Contact',
    legalHeading: 'Legal',
    nav: {
      offer: 'Services',
      process: 'Process',
      projects: 'Projects',
      about: 'About us',
      blog: 'Blog',
      contact: 'Contact',
    },
    services: [
      { label: 'One-page website', href: '/uslugi/strony-www/one-page' },
      { label: 'Company website', href: '/uslugi/strony-www/strona-firmowa' },
      { label: 'Interactive website', href: '/uslugi/strony-www/strona-szyta-na-miare' },
      { label: 'Online store', href: '/uslugi/strony-www/sklep-internetowy' },
      { label: 'CRM system', href: '/uslugi/strony-www/system-crm' },
      { label: 'AI chatbots', href: '/uslugi/automatyzacje-ai/chatboty-ai' },
    ],
    allServices: 'All services',
    days: { Mo: 'Mon', Tu: 'Tue', We: 'Wed', Th: 'Thu', Fr: 'Fri', Sa: 'Sat', Su: 'Sun' },
    hours: 'Working hours',
    privacyPolicy: 'Privacy policy',
    cookieSettings: 'Cookie settings',
    copyright: (year) => `© ${year} Avenly.`,
    nip: (nip) => `Tax ID ${nip}`,
    socialsAria: 'Avenly on social media',
    newTab: '(opens in a new tab)',
    backToTop: 'Back to top',
    cta: 'Free consultation',
    ctaHere: 'Free consultation - go to the form',
    dot: {
      title: 'Dot the i',
      lead: 'A good business deserves a website that completes the picture. Start with a free conversation and hear back within 24 hours.',
    },
  },
};
