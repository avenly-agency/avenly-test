import type { Metadata } from 'next';
import { Shop } from '../../../../../(pl)/uslugi/strony-www/sklep-internetowy/Shop';
import { ServicePageSchema } from '@/components/seo/ServicePageSchema';
import { shopCopy } from '@/lib/i18n/uslugi/sklep-internetowy';
import { i18nAlternates } from '@/lib/i18n/locale';

const SERVICE = {
  name: 'Online store',
  description:
    'A store where customers buy with ease: they pay with BLIK or by card through Przelewy24 or Stripe, choose courier or parcel locker delivery, and the orders wait for you in one panel.',
  plPath: '/uslugi/strony-www/sklep-internetowy',
  enPath: '/en/services/websites/online-store',
};

export const metadata: Metadata = {
  title: 'Online store - sell online without limits',
  description: SERVICE.description,
  alternates: i18nAlternates(SERVICE.plPath, 'en'),
  keywords: ['online store', 'ecommerce store quote', 'store with BLIK', 'store with online payments', 'store with parcel locker delivery', 'ecommerce agency'],
  openGraph: {
    title: 'Online store - Avenly',
    description: SERVICE.description,
    url: SERVICE.enPath,
    type: 'website',
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
