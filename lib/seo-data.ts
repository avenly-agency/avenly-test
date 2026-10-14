/**
 * Centralny plik z danymi firmy używanymi w schema.org JSON-LD i meta tagach.
 *
 * 👉 PODMIEŃ PLACEHOLDERY oznaczone `TODO:` na realne dane firmy.
 * Wszystkie zmiany propagują się do Organization, LocalBusiness, Footer, OG itd.
 */

export const SITE = {
  name: 'Avenly',
  legalName: 'Avenly Michał Grzejdak', // nazwa działalności w CEIDG (JDG, od 2026-10-14); tylko w danych strukturalnych
  url: 'https://avenly.pl',
  logo: 'https://avenly.pl/icon.png',
  ogImage: 'https://avenly.pl/og-default.png',
  // Opis firmy w danych strukturalnych (Organization, WebSite) i zapasowy opis meta. Tylko usługi z oferty
  // (bez marketingu i „e-commerce”); opis strony głównej w głosie korzyści jest w app/(pl)/layout.tsx.
  description:
    'Avenly to polska agencja interaktywna. Projektujemy i budujemy strony WWW, sklepy internetowe, systemy CRM i chatboty AI dla firm.',
  shortDescription: 'Strony WWW · sklepy internetowe · chatboty AI',
  language: 'pl-PL',
  founded: '2026',
} as const;

export const CONTACT = {
  email: 'kontakt@avenly.pl',
  phone: '+48668124367', // format E.164 (bez spacji) dla schema.org
  phoneDisplay: '+48 668 124 367',
  phone2: '+48531104402', // drugi numer kontaktowy (E.164)
  phone2Display: '+48 531 104 402',
  hours: 'Mo-Fr 09:00-17:00', // schema.org openingHours format
} as const;

export const ADDRESS = {
  // TODO: uzupełnij realny adres firmy (kluczowe dla lokalnego SEO PL)
  streetAddress: '', // np. "ul. Marszałkowska 1"
  addressLocality: '', // np. "Warszawa"
  postalCode: '', // np. "00-001"
  addressRegion: 'Polska', // województwo
  addressCountry: 'PL',
  // Jeśli firma działa zdalnie bez fizycznego biura, zostaw puste pola
  // i ustaw `serviceArea: 'PL'` w LocalBusiness - to też jest valid.
} as const;

export const COMPANY_IDS = {
  // NIP z 2026-10-14 (właściciel: jednoosobowa działalność „Avenly Michał Grzejdak”, CEIDG). TODO: REGON, jeśli ma być
  // pokazywany (stopka pokazuje tylko NIP, polityka prywatności oba, gdy są uzupełnione).
  nip: '5381873554',
  regon: '', // np. "123456789"
  krs: '', // jeśli sp. z o.o.
} as const;

export const SOCIAL = {
  facebook: 'https://www.facebook.com/profile.php?id=61581862509345',
  instagram: 'https://www.instagram.com/avenly.pl/',
  github: 'https://github.com/avenly-agency',
  // TODO opcjonalnie: linkedin, youtube, tiktok, x
} as const;

export const GOOGLE_BUSINESS = {
  profileUrl: 'https://share.google/YgHXGeqFgrSX4FEGs',
  // Dane archiwalne: od 2026-09-28 ocena NIE jest pokazywana ani wysyłana w JSON-LD (decyzja właściciela:
  // "5,0 na Google" = słaby social proof). Zostają na wypadek powrotu do tematu przy większej liczbie opinii.
  reviewsCount: 2,
  ratingValue: 5.0,
} as const;

/** Lista zwracana jako `sameAs` w Organization schema - autorytatywne profile firmy w sieci. */
export const SAME_AS: string[] = [
  SOCIAL.facebook,
  SOCIAL.instagram,
  SOCIAL.github,
  ...(GOOGLE_BUSINESS.profileUrl ? [GOOGLE_BUSINESS.profileUrl] : []),
].filter(Boolean);
