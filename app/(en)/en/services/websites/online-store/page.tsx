import type { Metadata } from 'next';
import { Shop } from '../../../../../(pl)/uslugi/strony-www/sklep-internetowy/Shop';
import { ServicePageSchema } from '@/components/seo/ServicePageSchema';
import { shopCopy } from '@/lib/i18n/uslugi/sklep-internetowy';
import { i18nAlternates } from '@/lib/i18n/locale';

// The title comes from the core of the page ("Not a template. Your brand."), not from the hero heading, which is
// still waiting for the owner's choice. Description kept to about 160 characters.
const SERVICE = {
  name: 'Online store',
  title: 'Online store designed around your brand',
  description:
    'Not a template. Your brand. Customers pay with BLIK or by card, choose courier or parcel locker delivery, and the orders wait for you in one panel.',
  plPath: '/uslugi/strony-www/sklep-internetowy',
  enPath: '/en/services/websites/online-store',
};

export const metadata: Metadata = {
  title: SERVICE.title,
  description: SERVICE.description,
  alternates: i18nAlternates(SERVICE.plPath, 'en'),
  keywords: ['online store', 'online store development', 'ecommerce store quote', 'store with BLIK', 'store with online payments', 'store with parcel locker delivery'],
  // The page-level openGraph block REPLACES the root layout one (Next does not merge them), so it is given in full.
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Avenly',
    url: `${SERVICE.enPath}/`,
    title: SERVICE.title,
    description: SERVICE.description,
    images: [{ url: '/og-default.png', width: 1200, height: 630, alt: 'Avenly - interactive agency', type: 'image/png' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: SERVICE.title,
    description: SERVICE.description,
    images: ['/og-default.png'],
  },
};

export default function ShopPageEn() {
  return (
    <>
      <ServicePageSchema
        name={SERVICE.name}
        description={SERVICE.description}
        path={SERVICE.enPath}
        categoryName="Websites"
        categoryPath="/en/services/websites"
        serviceType="E-commerce Development"
        locale="en"
      />
      <Shop t={shopCopy.en} locale="en" />
    </>
  );
}
