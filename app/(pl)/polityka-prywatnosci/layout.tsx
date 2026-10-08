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
  openGraph: {
    title: 'Polityka prywatności i cookies | Avenly',
    description: 'Jak przetwarzamy Twoje dane osobowe, jakich cookies używamy i jakie masz prawa zgodnie z RODO - pełna polityka agencji Avenly.',
    url: '/polityka-prywatnosci',
    type: 'website',
  },
};

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
