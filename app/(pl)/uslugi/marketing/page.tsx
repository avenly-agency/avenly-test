import type { Metadata } from 'next';

// Strona-placeholder (oferta w przygotowaniu) - noindex zeby pusta tresc
// nie kanibalizowala SEO; wlasny canonical zamiast dziedziczonego '/'.
export const metadata: Metadata = {
  title: 'Marketing - oferta w przygotowaniu',
  alternates: { canonical: '/uslugi/marketing' },
  robots: { index: false, follow: true },
};

export default function MarketingPage() {
  return null;
}
