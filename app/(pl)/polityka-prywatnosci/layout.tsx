import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Polityka prywatności i cookies',
  description:
    'Polityka prywatności i cookies Avenly. Dowiedz się, jak przetwarzamy Twoje dane osobowe, jakich plików cookies używamy oraz jakie masz prawa zgodnie z RODO.',
  alternates: { canonical: '/polityka-prywatnosci' },
  robots: {
    index: true,
    follow: true,
  },
  // Blok openGraph strony ZASTĘPUJE blok z root layoutu (Next go nie łączy) - dlatego podany w całości (adres, typ, obrazek).
  openGraph: {
    type: 'website',
    locale: 'pl_PL',
    siteName: 'Avenly',
    url: '/polityka-prywatnosci/',
    title: 'Polityka prywatności i cookies - Avenly',
    description: 'Jak przetwarzamy Twoje dane osobowe, jakich plików cookies używamy i jakie masz prawa zgodnie z RODO.',
    images: [{ url: '/og-default.png', width: 1200, height: 630, alt: 'Avenly - agencja interaktywna', type: 'image/png' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Polityka prywatności i cookies - Avenly',
    description: 'Jak przetwarzamy Twoje dane osobowe, jakich plików cookies używamy i jakie masz prawa zgodnie z RODO.',
    images: ['/og-default.png'],
  },
};

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
