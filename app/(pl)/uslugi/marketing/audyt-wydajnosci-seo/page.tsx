import type { Metadata } from 'next';

// Strona-placeholder (oferta w przygotowaniu) - noindex zeby pusta tresc
// nie kanibalizowala SEO; wlasny canonical zamiast dziedziczonego '/'.
export const metadata: Metadata = {
  title: 'Audyt wydajności i SEO - oferta w przygotowaniu',
  alternates: { canonical: '/uslugi/marketing/audyt-wydajnosci-seo' },
  robots: { index: false, follow: true },
};

export default function AudytWydajnosciSeoPage() {
  return null;
}
