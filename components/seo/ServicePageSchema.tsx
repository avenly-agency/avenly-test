/**
 * Server component: renderuje Service + BreadcrumbList JSON-LD dla podstrony usługi.
 * Wstrzykiwany do `*Client.tsx` jako prop lub bezpośrednio w page.tsx (server).
 *
 * Użycie w client component (większość naszych podstron):
 *   import { ServicePageSchema } from '@/components/seo/ServicePageSchema';
 *   <ServicePageSchema name="..." description="..." path="..." categoryName="..." categoryPath="..." />
 */

import { JsonLd } from './JsonLd';
import { serviceSchema, breadcrumbSchema } from '@/lib/schemas';

interface Props {
  /** Nazwa usługi (np. "Strona One-Page") - pojawia się w SERP rich result. */
  name: string;
  /** Krótki opis 1-2 zdania (używany w schema description). */
  description: string;
  /** Ścieżka URL podstrony, np. "/uslugi/strony-www/one-page" (BEZ domeny). */
  path: string;
  /** Nazwa kategorii (np. "Strony WWW") - środkowy element breadcrumbs. */
  categoryName: string;
  /** Ścieżka kategorii (np. "/uslugi/strony-www"). */
  categoryPath: string;
  /** Typ usługi dla schema.org (np. "Web Development", "AI Chatbot Development"). */
  serviceType?: string;
  /**
   * Język strony. Dla 'en' podawaj name/description/path już w wersji EN
   * (path z prefiksem /en/...) - locale steruje tylko stałymi breadcrumbami
   * (home + katalog usług).
   */
  locale?: 'pl' | 'en';
}

export function ServicePageSchema({
  name,
  description,
  path,
  categoryName,
  categoryPath,
  serviceType,
  locale = 'pl',
}: Props) {
  const isEn = locale === 'en';
  return (
    <>
      <JsonLd
        id="ld-service"
        data={serviceSchema({ name, description, url: path, serviceType })}
      />
      <JsonLd
        id="ld-breadcrumb"
        data={breadcrumbSchema([
          { name: 'Avenly', url: isEn ? '/en/' : '/' },
          { name: isEn ? 'Services' : 'Usługi', url: isEn ? '/en/services' : '/uslugi' },
          { name: categoryName, url: categoryPath },
          { name, url: path },
        ])}
      />
    </>
  );
}
