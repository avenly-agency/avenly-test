import type { Metadata } from 'next';
import { OnePageClient } from './OnePageClient';
import { ServicePageSchema } from '@/components/seo/ServicePageSchema';

const SERVICE = {
  name: 'One-Page',
  description:
    'Jedna strona, jeden cel. Profesjonalny landing page Next.js skupiony na konwersji - idealny pod kampanie reklamowe, MVP i lead generation. Błyskawiczne ładowanie, responsywność i SEO w standardzie.',
  path: '/uslugi/strony-www/one-page',
};

export const metadata: Metadata = {
  title: 'One-Page - Landing Page Next.js & Kampanie Reklamowe',
  description: SERVICE.description,
  alternates: { canonical: SERVICE.path },
  keywords: ['strona one-page', 'landing page', 'wycena one page', 'strona pod kampanię reklamową', 'lead generation strona'],
  openGraph: {
    title: 'Strona One-Page - Avenly',
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
      <OnePageClient />
    </>
  );
}
