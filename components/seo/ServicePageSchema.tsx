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
}

export function ServicePageSchema({
  name,
  description,
  path,
  categoryName,
  categoryPath,
  serviceType,
}: Props) {
  return (
    <>
      <JsonLd
        id="ld-service"
        data={serviceSchema({ name, description, url: path, serviceType })}
      />
      <JsonLd
        id="ld-breadcrumb"
        data={breadcrumbSchema([
          { name: 'Avenly', url: '/' },
          { name: 'Usługi', url: '/uslugi' },
          { name: categoryName, url: categoryPath },
          { name, url: path },
        ])}
      />
    </>
  );
}
