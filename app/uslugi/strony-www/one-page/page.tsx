import type { Metadata } from 'next';
import { OnePageClient } from './OnePageClient';

export const metadata: Metadata = {
  title: 'Strona One-Page — Landing Page & Kampanie Reklamowe | Avenly',
  description: 'Profesjonalny landing page skupiony na jednym celu. Zbieraj leady, testuj rynek i wspieraj kampanie reklamowe z błyskawicznie ładującą się stroną one-page.',
  alternates: { canonical: '/uslugi/strony-www/one-page' },
};

export default function OnePageService() {
  return <OnePageClient />;
}
