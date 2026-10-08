import type { Metadata } from 'next';
import { Shop } from './Shop';
import { ServicePageSchema } from '@/components/seo/ServicePageSchema';
import { shopCopy } from '@/lib/i18n/uslugi/sklep-internetowy';
import { i18nAlternates } from '@/lib/i18n/locale';

const SERVICE = {
  name: 'Sklep internetowy',
  description:
    'Sklep, w którym klient kupuje łatwo: płaci BLIK-iem lub kartą przez Przelewy24 albo Stripe, wybiera wysyłkę kurierem lub do paczkomatu, a zamówienia czekają na Ciebie w jednym panelu.',
  path: '/uslugi/strony-www/sklep-internetowy',
};

export const metadata: Metadata = {
  title: 'Sklep internetowy - sprzedawaj online bez ograniczeń',
  description: SERVICE.description,
  alternates: i18nAlternates(SERVICE.path, 'pl'),
  keywords: ['sklep internetowy', 'wycena sklepu internetowego', 'sklep z BLIK', 'sklep z płatnościami online', 'sklep z dostawą do paczkomatu', 'agencja e-commerce'],
  openGraph: {
    title: 'Sklep internetowy - Avenly',
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
        serviceType="E-commerce Development"
      />
      <Shop t={shopCopy.pl} />
    </>
  );
}
