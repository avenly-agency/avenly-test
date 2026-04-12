import type { Metadata } from 'next';
import { ShopClient } from './ShopClient';

export const metadata: Metadata = {
  title: 'Sklepy Internetowe — E-commerce WooCommerce & Przelewy24 | Avenly',
  description: 'Profesjonalny sklep internetowy z integracją płatności BLIK, kart i kurierów. Sprzedawaj 24/7 bez udziału człowieka — zoptymalizowany pod konwersję i Mobile.',
  alternates: { canonical: '/uslugi/strony-www/sklepy-internetowe' },
};

export default function ShopPage() {
  return <ShopClient />;
}
