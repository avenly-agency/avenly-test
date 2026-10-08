import type { Locale } from '@/lib/i18n/locale';

/**
 * Słownik sekcji Hero (homepage) - scena z handoffu 12a, koncept CTA zmieniony przez właściciela.
 * WZORZEC dla wszystkich słowników sekcji:
 * - interface XxxDict z samymi stringami (JSX/ikony/klasy zostają w komponencie),
 * - export xxxDict: Record<Locale, XxxDict>,
 * - EN = copy marketingowe wg PRODUCT.md (benefit voice, sentence case,
 *   bez em/en dashes, zero fabrykowanych metryk).
 * Import WYŁĄCZNIE w server page (przez lib/i18n/home/index.ts) - słownik
 * wędruje do klienta jako props (RSC payload), nie w bundlu JS.
 *
 * KONCEPT: makieta 12a "Audyt" kazała wpisać adres strony ("Twoja strona ma potencjał...").
 * Odrzucone - wykluczało osoby BEZ strony. Hero mówi o BIZNESIE, a akcją jest jedyna fraza CTA
 * serwisu ("Bezpłatna konsultacja", PRODUCT.md) + link do realizacji. Nie wracać do pola URL.
 * `proof`: tylko obronne fakty (PRODUCT.md): bezpłatnie, bez zobowiązań, kontakt < 24 h. Bez oceny
 * "5,0 na Google" (2026-09-28, decyzja właściciela: słaby social proof - usunięta z całej strony).
 * Węzeł 06 = "Lokalne SEO" (2026-09-28, dawniej "SEO i marketing"): marketingu nie ma w ofercie,
 * a audyt SEO to skromny dodatek (PRODUCT.md "Co obiecujemy w ofercie"); lokalne SEO = fakt z realizacji.
 * Węzeł 03 = "Strony interaktywne" (2026-10-01 "Strony na miarę", dawniej "Design UI/UX"): właściciel usunął
 * projekt UI/UX jako osobną usługę (jest częścią każdej usługi); konstelacja musi mieć dokładnie 6 węzłów.
 * 2026-10-06: usługa „Strona szyta na miarę” nazywa się „Strona interaktywna” (właściciel: „każda firma tak
 * pisze i jest to cringe”) - nie wracać do „na miarę” w nazwach; adres podstrony na razie bez zmian.
 */

export interface HeroServiceNode {
  /** Etykieta węzła konstelacji (renderowana UPPERCASE przez CSS). */
  label: string;
  /** Ścieżka PL - komponent lokalizuje przez localizeHref. */
  href: string;
}

export interface HeroDict {
  h1Lead: string;
  h1Accent: string;
  ctaPrimary: string;
  ctaSecondary: string;
  /** Linia dowodów; na mobile łamana w połowie (2 równe linie). */
  proof: string[];
  servicesLabel: string;
  /** Dokładnie 6 węzłów, kolejność = indeksy 01-06 z makiety. */
  nodes: HeroServiceNode[];
}

export const heroDict: Record<Locale, HeroDict> = {
  pl: {
    h1Lead: 'Twój biznes ma potencjał.',
    h1Accent: 'Zamień go w klientów.',
    ctaPrimary: 'Bezpłatna konsultacja',
    ctaSecondary: 'Zobacz realizacje',
    proof: ['Bezpłatnie', 'bez zobowiązań', 'odpowiedź w 24 h'],
    servicesLabel: 'Usługi Avenly',
    nodes: [
      { label: 'Strony WWW', href: '/uslugi/strony-www' },
      { label: 'Sklepy online', href: '/uslugi/strony-www/sklep-internetowy' },
      { label: 'Strony interaktywne', href: '/uslugi/strony-www/strona-szyta-na-miare' },
      { label: 'Chatboty AI', href: '/uslugi/automatyzacje-ai/chatboty-ai' },
      { label: 'Automatyzacje', href: '/uslugi/strony-www/system-crm' },
      { label: 'Lokalne SEO', href: '/uslugi' },
    ],
  },
  en: {
    h1Lead: 'Your business has potential.',
    h1Accent: 'Turn it into customers.',
    ctaPrimary: 'Free consultation',
    ctaSecondary: 'See our work',
    proof: ['Free', 'no strings attached', 'reply within 24 h'],
    servicesLabel: 'Avenly services',
    nodes: [
      { label: 'Websites', href: '/uslugi/strony-www' },
      { label: 'Online stores', href: '/uslugi/strony-www/sklep-internetowy' },
      { label: 'Interactive websites', href: '/uslugi/strony-www/strona-szyta-na-miare' },
      { label: 'AI chatbots', href: '/uslugi/automatyzacje-ai/chatboty-ai' },
      { label: 'Automation', href: '/uslugi/strony-www/system-crm' },
      { label: 'Local SEO', href: '/uslugi' },
    ],
  },
};
