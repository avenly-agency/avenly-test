import type { Metadata } from 'next';
import { ShopClient } from './ShopClient';
import { ServicePageSchema } from '@/components/seo/ServicePageSchema';

const SERVICE = {
  name: 'Sklep Internetowy',
  description:
    'Sklep internetowy w dwóch wariantach do wyboru: WooCommerce (klasyczny WordPress z panelem WP Admin) lub Headless Commerce (Next.js + Stripe + Sanity, 5× szybszy frontend). Pełna integracja z BLIK, kartami, kurierami (InPost, DPD).',
  path: '/uslugi/strony-www/sklep-internetowy',
};

export const metadata: Metadata = {
  title: 'Sklep Internetowy - WooCommerce lub Headless Commerce',
  description: SERVICE.description,
  alternates: { canonical: SERVICE.path },
  keywords: ['sklep internetowy', 'wycena sklepu internetowego', 'WooCommerce', 'headless commerce', 'sklep z BLIK', 'sklep z InPost', 'agencja e-commerce', 'sklep Next.js'],
  openGraph: {
    title: 'Sklep Internetowy - Avenly',
    description: SERVICE.description,
    url: SERVICE.path,
    type: 'website',
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
        serviceType="E-commerce Development - WooCommerce / Headless"
      />
      <ShopClient />
    </>
  );
}
