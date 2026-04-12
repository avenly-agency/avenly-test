import type { Metadata } from 'next';
import { ServicesHub } from './ServicesHub';

export const metadata: Metadata = {
  title: 'Usługi — Strony WWW, Design, AI & Marketing | Avenly',
  description:
    'Kompleksowa oferta cyfrowa dla firm: profesjonalne strony internetowe, projektowanie UI/UX, automatyzacja AI z chatbotami oraz audyt SEO i wydajności. Zbuduj cyfrowe imperium razem z Avenly.',
  openGraph: {
    title: 'Katalog Usług — Avenly',
    description:
      'Strony WWW, design, chatboty AI i marketing SEO — wszystko czego potrzebujesz, żeby dominować online.',
  },
  alternates: {
    canonical: '/uslugi',
  },
};

export default function ServicesPage() {
  return <ServicesHub />;
}
