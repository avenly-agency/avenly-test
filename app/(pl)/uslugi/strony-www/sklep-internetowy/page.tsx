import type { Metadata } from 'next';
import { Shop } from './Shop';
import { ServicePageSchema } from '@/components/seo/ServicePageSchema';
import { shopCopy } from '@/lib/i18n/uslugi/sklep-internetowy';
import { i18nAlternates } from '@/lib/i18n/locale';

// Tytuł z sedna podstrony („Nie szablon. Twoja marka.”), nie z nagłówka hero - ten czeka na wybór właściciela.
// Opis do ok. 160 znaków: płatność i wysyłka jak w PRODUCT.md („Co obiecujemy w ofercie”).
const SERVICE = {
  name: 'Sklep internetowy',
  title: 'Sklep internetowy zaprojektowany pod Twoją markę',
  description:
    'Nie szablon. Twoja marka. Klient płaci BLIK-iem lub kartą, wybiera kuriera albo paczkomat, a zamówienia czekają na Ciebie w jednym panelu.',
  path: '/uslugi/strony-www/sklep-internetowy',
};

export const metadata: Metadata = {
  title: SERVICE.title,
  description: SERVICE.description,
  alternates: i18nAlternates(SERVICE.path, 'pl'),
  keywords: ['sklep internetowy', 'tworzenie sklepów internetowych', 'wycena sklepu internetowego', 'sklep z BLIK', 'sklep z płatnościami online', 'sklep z dostawą do paczkomatu'],
  // Blok openGraph strony ZASTĘPUJE blok z root layoutu (Next go nie łączy) - dlatego podany w całości (adres, typ, obrazek).
  openGraph: {
    type: 'website',
    locale: 'pl_PL',
    siteName: 'Avenly',
    url: `${SERVICE.path}/`,
    title: SERVICE.title,
    description: SERVICE.description,
    images: [{ url: '/og-default.png', width: 1200, height: 630, alt: 'Avenly - agencja interaktywna', type: 'image/png' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: SERVICE.title,
    description: SERVICE.description,
    images: ['/og-default.png'],
  },
};

export default function SklepPage() {
  return (
    <>
      <ServicePageSchema
        name={SERVICE.name}
        description={SERVICE.description}
        path={SERVICE.path}
        categoryName="Strony WWW"
        categoryPath="/uslugi/strony-www"
        serviceType="E-commerce Development"
      />
      <Shop t={shopCopy.pl} />
    </>
  );
}
