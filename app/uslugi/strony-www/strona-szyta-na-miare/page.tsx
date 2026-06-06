import type { Metadata } from 'next';
import { DedicatedWebsiteClient } from './DedicatedWebsiteClient';
import { ServicePageSchema } from '@/components/seo/ServicePageSchema';

const SERVICE = {
  name: 'Strona Szyta na Miarę',
  description:
    'Strona premium kodowana od zera w Next.js z Headless CMS (Sanity, Strapi lub Payload do wyboru). Błyskawicznie szybka, w 100% autorski design, a treści edytujesz sam przez nowoczesny panel CMS.',
  path: '/uslugi/strony-www/strona-szyta-na-miare',
};

export const metadata: Metadata = {
  title: 'Strona Szyta na Miarę - Next.js + Headless CMS · premium',
  description: SERVICE.description,
  alternates: { canonical: SERVICE.path },
  keywords: ['strona szyta na miarę', 'strona Next.js', 'Headless CMS', 'Sanity CMS', 'Strapi', 'Payload CMS', 'premium strona firmowa', 'custom web development'],
  openGraph: {
    title: 'Strona Szyta na Miarę - Avenly',
    description: 'Next.js + Headless CMS. Strona premium dla marek, które chcą się wyróżniać wydajnością i designem.',
    url: SERVICE.path,
    type: 'website',
  },
};

export default function StronaSzytaNaMiarePage() {
  return (
    <>
      <ServicePageSchema
        name={SERVICE.name}
        description={SERVICE.description}
        path={SERVICE.path}
        categoryName="Strony WWW"
        categoryPath="/uslugi/strony-www"
        serviceType="Custom Web Development - Next.js + Headless CMS"
      />
      <DedicatedWebsiteClient />
    </>
  );
}
