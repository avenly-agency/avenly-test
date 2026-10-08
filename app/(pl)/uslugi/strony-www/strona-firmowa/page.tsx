import type { Metadata } from 'next';
import { StronaFirmowa } from './StronaFirmowa';
import { ServicePageSchema } from '@/components/seo/ServicePageSchema';
import { companyCopy } from '@/lib/i18n/uslugi/strona-firmowa';
import { i18nAlternates } from '@/lib/i18n/locale';

// Metadane bez obietnicy panelu CMS (PRODUCT.md „Co obiecujemy w ofercie”; dawniej „…witryna z CMS”, „Sam dodajesz
// podstrony, blog i ofertę, bez pomocy programisty”). Tytuł w sentence case.
const SERVICE = {
  name: 'Strona firmowa',
  description:
    'Wielostronicowa strona firmowa, która buduje zaufanie: oferta, o nas, realizacje, kontakt. Każda usługa ma własną podstronę, do tego opinie Google, mapa dojazdu i wersje językowe. Projekt od zera, szybkie ładowanie.',
  path: '/uslugi/strony-www/strona-firmowa',
};

export const metadata: Metadata = {
  title: 'Strona firmowa - wielostronicowa strona, która buduje zaufanie',
  description: SERVICE.description,
  alternates: i18nAlternates(SERVICE.path, 'pl'),
  keywords: ['strona firmowa', 'profesjonalna strona dla firmy', 'wielostronicowa strona internetowa', 'strona internetowa dla firmy', 'strona B2B', 'Core Web Vitals'],
  openGraph: {
    title: 'Strona firmowa - Avenly',
    description: 'Wielostronicowa strona firmowa: każda usługa ma własną podstronę, a klient bez szukania trafia do tej, której potrzebuje.',
    url: SERVICE.path,
    type: 'website',
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
