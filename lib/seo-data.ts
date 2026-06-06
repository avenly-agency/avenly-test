/**
 * Centralny plik z danymi firmy używanymi w schema.org JSON-LD i meta tagach.
 *
 * 👉 PODMIEŃ PLACEHOLDERY oznaczone `TODO:` na realne dane firmy.
 * Wszystkie zmiany propagują się do Organization, LocalBusiness, Footer, OG itd.
 */

export const SITE = {
  name: 'Avenly',
  legalName: 'Avenly', // TODO: pełna nazwa prawna jeśli inna (np. "Avenly Sp. z o.o.")
  url: 'https://avenly.pl',
  logo: 'https://avenly.pl/icon.png',
  ogImage: 'https://avenly.pl/og-default.png',
  description:
    'Polska agencja interaktywna. Tworzymy nowoczesne strony WWW, sklepy e-commerce, chatboty AI i prowadzimy marketing zorientowany na konwersję.',
  shortDescription: 'Strony WWW · AI · Marketing',
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
  // TODO: NIP/REGON dla trust signal i ewentualnej VAT validation
  nip: '', // np. "1234567890"
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
  reviewsCount: 2, // TODO: aktualizuj liczbę wraz ze wzrostem opinii Google
  ratingValue: 5.0, // TODO: aktualizuj średnią ocenę
} as const;

/** Lista zwracana jako `sameAs` w Organization schema - autorytatywne profile firmy w sieci. */
export const SAME_AS: string[] = [
  SOCIAL.facebook,
  SOCIAL.instagram,
  SOCIAL.github,
  ...(GOOGLE_BUSINESS.profileUrl ? [GOOGLE_BUSINESS.profileUrl] : []),
].filter(Boolean);
