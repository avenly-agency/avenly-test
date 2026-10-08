import type { Metadata } from 'next';
import NotFound from '../not-found';

/**
 * Dedykowana trasa /nie-znaleziono/ renderująca customowy NotFound (segment '404' jest zarezerwowany przez Next i renderuje się BEZ root layoutu - stąd inna nazwa). Powód: przy dwóch
 * root layoutach (route groups (pl)/(en)) Next NIE używa not-found.tsx z grupy
 * do globalnego /_not-found - out/404.html dostawał domyślną stronę Next.
 * Post-build `scripts/copy-404.mjs` kopiuje out/nie-znaleziono/index.html → out/404.html
 * (Apache: ErrorDocument 404 /404.html). NIE usuwać tej trasy ani skryptu.
 */

export const metadata: Metadata = {
  title: 'Strona nie znaleziona (404)',
  alternates: { canonical: '/nie-znaleziono' },
  robots: { index: false, follow: false },
};

export default function NotFoundPage() {
  return <NotFound />;
}
