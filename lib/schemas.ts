/**
 * Builder functions dla schema.org JSON-LD.
 * Każda funkcja zwraca gotowy obiekt do podania w <JsonLd data={...} />
 */

import { SITE, CONTACT, ADDRESS, SAME_AS, GOOGLE_BUSINESS, COMPANY_IDS } from './seo-data';

/** Organization - globalna na każdej stronie. Generuje Knowledge Panel signal. */
export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE.url}/#organization`,
    name: SITE.name,
    legalName: SITE.legalName,
    url: SITE.url,
    logo: {
      '@type': 'ImageObject',
      url: SITE.logo,
      width: 512,
      height: 512,
    },
    image: SITE.ogImage,
    description: SITE.description,
    foundingDate: SITE.founded,
    email: CONTACT.email,
    telephone: CONTACT.phone,
    sameAs: SAME_AS,
    // taxID dodajemy tylko gdy firma ma realny NIP (po rejestracji działalności)
    ...(COMPANY_IDS.nip ? { taxID: COMPANY_IDS.nip } : {}),
    // (REGON nie ma odpowiednika w schema.org - pomijamy)
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: CONTACT.phone,
      email: CONTACT.email,
      contactType: 'customer support',
      areaServed: 'PL',
      availableLanguage: ['Polish', 'English'],
    },
  };
}

/** LocalBusiness / ProfessionalService - kluczowe dla lokalnego SEO PL.
 *  Działa też dla agencji bez fizycznego biura (areaServed: Polska). */
export function localBusinessSchema() {
  const hasAddress = ADDRESS.streetAddress && ADDRESS.addressLocality;
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': `${SITE.url}/#localbusiness`,
    name: SITE.name,
    image: SITE.ogImage,
    url: SITE.url,
    telephone: CONTACT.phone,
    email: CONTACT.email,
    // priceRange dodajemy tylko gdy chcesz publicznie zadeklarować poziom cenowy
    // ...({ priceRange: '$$' }),
    address: hasAddress
      ? {
          '@type': 'PostalAddress',
          streetAddress: ADDRESS.streetAddress,
          addressLocality: ADDRESS.addressLocality,
          postalCode: ADDRESS.postalCode,
          addressRegion: ADDRESS.addressRegion,
          addressCountry: ADDRESS.addressCountry,
        }
      : {
          // Tryb "virtual business" - bez fizycznego biura
          '@type': 'PostalAddress',
          addressCountry: ADDRESS.addressCountry,
        },
    areaServed: {
      '@type': 'Country',
      name: 'Polska',
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '17:00',
      },
    ],
    sameAs: SAME_AS,
    // AggregateRating - tylko jeśli mamy realne dane
    ...(GOOGLE_BUSINESS.reviewsCount > 0 && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: GOOGLE_BUSINESS.ratingValue.toFixed(1),
        reviewCount: GOOGLE_BUSINESS.reviewsCount,
        bestRating: 5,
        worstRating: 1,
      },
    }),
  };
}

/** WebSite + SearchAction - daje Google sitelinks searchbox w SERP. */
export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE.url}/#website`,
    url: SITE.url,
    name: SITE.name,
    description: SITE.description,
    inLanguage: SITE.language,
    publisher: { '@id': `${SITE.url}/#organization` },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE.url}/blog?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

/** BreadcrumbList - rich breadcrumbs w SERP zamiast brzydkiego URL. */
export function breadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${SITE.url}${item.url}`,
    })),
  };
}

/** BlogPosting - rich results dla artykułów (Top Stories, headline z thumbnail). */
export function blogPostingSchema(post: {
  title: string;
  excerpt: string;
  slug: string;
  publishedAt: string;
  author: { name: string; role?: string };
  mainImage: string;
  categories?: string[];
}) {
  const url = `${SITE.url}/blog/${post.slug}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `${url}#article`,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    headline: post.title,
    description: post.excerpt,
    image: post.mainImage,
    url,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt, // TODO: dodać `updatedAt` w posts.ts jeśli chcesz
    author: {
      '@type': 'Person',
      name: post.author.name,
      ...(post.author.role && { jobTitle: post.author.role }),
    },
    publisher: { '@id': `${SITE.url}/#organization` },
    inLanguage: SITE.language,
    ...(post.categories?.length && {
      articleSection: post.categories,
      keywords: post.categories.join(', '),
    }),
  };
}

/** Service - rich results dla podstron usług (z provider, areaServed, offers). */
export function serviceSchema(service: {
  name: string;
  description: string;
  url: string; // ścieżka, np. "/uslugi/strony-www/one-page"
  serviceType?: string;
  priceRange?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name,
    description: service.description,
    url: `${SITE.url}${service.url}`,
    provider: { '@id': `${SITE.url}/#organization` },
    areaServed: { '@type': 'Country', name: 'Polska' },
    serviceType: service.serviceType || service.name,
    ...(service.priceRange && {
      offers: {
        '@type': 'Offer',
        priceCurrency: 'PLN',
        priceSpecification: {
          '@type': 'PriceSpecification',
          priceCurrency: 'PLN',
          description: service.priceRange,
        },
      },
    }),
  };
}

/** FAQPage - rich snippet z rozwijanymi pytaniami w SERP. */
export function faqPageSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/** CreativeWork dla case studies (Realizacje). */
export function caseStudySchema(project: {
  title: string;
  description: string;
  slug: string;
  client: string;
  year: string;
  mainImage: string;
}) {
  const url = `${SITE.url}/realizacje/${project.slug}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    '@id': `${url}#case-study`,
    name: project.title,
    description: project.description,
    url,
    image: project.mainImage,
    datePublished: `${project.year}-01-01`,
    creator: { '@id': `${SITE.url}/#organization` },
    about: project.client,
    inLanguage: SITE.language,
  };
}
