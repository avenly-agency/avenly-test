/**
 * Server component renderujący JSON-LD <script> w DOM.
 *
 * Użycie:
 *   <JsonLd data={{ '@context': 'https://schema.org', '@type': 'Organization', ... }} />
 *
 * Renderuje <script type="application/ld+json"> z bezpiecznym JSON.stringify.
 * Element jest niewidoczny dla użytkownika - czytany tylko przez wyszukiwarki / AI.
 */

type JsonLdData = Record<string, unknown> | Record<string, unknown>[];

interface JsonLdProps {
  data: JsonLdData;
  id?: string;
}

export function JsonLd({ data, id }: JsonLdProps) {
  // Zabezpieczenie XSS: escape '</script>' w wartościach string
  const json = JSON.stringify(data).replace(/</g, '\\u003c');

  return (
    <script
      type="application/ld+json"
      id={id}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
