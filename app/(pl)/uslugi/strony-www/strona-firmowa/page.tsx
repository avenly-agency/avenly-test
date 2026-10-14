import type { Metadata } from 'next';
import { StronaFirmowa } from './StronaFirmowa';
import { ServicePageSchema } from '@/components/seo/ServicePageSchema';
import { companyCopy } from '@/lib/i18n/uslugi/strona-firmowa';
import { i18nAlternates } from '@/lib/i18n/locale';

// Metadane bez obietnicy panelu CMS (PRODUCT.md „Co obiecujemy w ofercie”; dawniej „…witryna z CMS”, „Sam dodajesz
// podstrony, blog i ofertę, bez pomocy programisty”). Tytuł = nagłówek podstrony, opis do ok. 160 znaków z sedna
// usługi w Ofercie (podstrona dla każdej usługi, opinie Google i mapa dojazdu).
const SERVICE = {
  name: 'Strona firmowa',
  title: 'Strona firmowa, która buduje zaufanie',
  description:
    'Twoja firma wygląda w sieci tak solidnie, jak pracuje na co dzień. Każda usługa ma własną podstronę, a klient od razu trafia do tej, której potrzebuje.',
  path: '/uslugi/strony-www/strona-firmowa',
};

export const metadata: Metadata = {
  title: SERVICE.title,
  description: SERVICE.description,
  alternates: i18nAlternates(SERVICE.path, 'pl'),
  keywords: ['strona firmowa', 'strona internetowa dla firmy', 'profesjonalna strona dla firmy', 'wielostronicowa strona internetowa', 'wycena strony firmowej'],
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

export default function StronaFirmowaPage() {
  return (
    <>
      <ServicePageSchema
        name={SERVICE.name}
        description={SERVICE.description}
        path={SERVICE.path}
        categoryName="Strony WWW"
        categoryPath="/uslugi/strony-www"
        serviceType="Corporate Website Development"
      />
      <StronaFirmowa t={companyCopy.pl} />
    </>
  );
}
