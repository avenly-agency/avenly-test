import type { Metadata } from 'next';
import { OnePage } from './OnePage';
import { ServicePageSchema } from '@/components/seo/ServicePageSchema';
import { i18nAlternates } from '@/lib/i18n/locale';
import { onePageCopy } from '@/lib/i18n/uslugi/one-page';

const SERVICE = {
  name: 'Strona one-page',
  description:
    'Jedna strona, jeden cel. Klient od pierwszego ekranu wie, co oferujesz, i pisze do Ciebie przez formularz. Projekt od zera, wygodna na każdym telefonie, szybkie ładowanie.',
  path: '/uslugi/strony-www/one-page',
};

export const metadata: Metadata = {
  title: 'Strona one-page - jedna strona, jeden cel',
  description: SERVICE.description,
  alternates: i18nAlternates('/uslugi/strony-www/one-page', 'pl'),
  keywords: ['strona one-page', 'landing page', 'wycena one page', 'strona pod kampanię reklamową', 'strona wizytówka'],
  openGraph: {
    title: 'Strona one-page - Avenly',
    description: SERVICE.description,
    url: SERVICE.path,
    type: 'website',
  },
};

export default function OnePageService() {
  return (
    <>
      <ServicePageSchema
        name={SERVICE.name}
        description={SERVICE.description}
        path={SERVICE.path}
        categoryName="Strony WWW"
        categoryPath="/uslugi/strony-www"
        serviceType="Web Development - Landing Page"
      />
      <OnePage t={onePageCopy.pl} />
    </>
  );
}
