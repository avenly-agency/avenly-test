import type { Metadata } from 'next';
import { blogPosts } from '@/app/data/posts';
import { BlogIndex } from '@/components/blog/BlogIndex';
import { toCard } from '@/components/blog/data';

// Lista wpisów bloga (tylko PL). Wersja z czerwca 2026 zmodernizowana do języka strony głównej, układ „Wierna”
// (wybór właściciela 2026-09-29) - components/blog/BlogIndex.tsx + blog.css.

export const metadata: Metadata = {
  title: 'Blog - strony internetowe, szybkość i AI dla firm',
  description:
    'Krótkie artykuły o tym, jak strona internetowa, jej szybkość i AI wpływają na Twój biznes. Konkretna wiedza bez żargonu, dla właścicieli firm.',
  alternates: { canonical: '/blog' },
  keywords: [
    'blog agencja interaktywna',
    'blog strony internetowe',
    'blog AI dla biznesu',
    'szybkość strony a SEO',
    'blog chatbot AI',
    'strona internetowa dla firmy',
  ],
  // Blok openGraph strony ZASTĘPUJE blok z root layoutu (Next go nie łączy) - dlatego podany w całości (adres, typ, obrazek).
  openGraph: {
    type: 'website',
    locale: 'pl_PL',
    siteName: 'Avenly',
    url: '/blog/',
    title: 'Blog Avenly - konkretna wiedza bez żargonu',
    description: 'Krótkie artykuły o tym, jak strona internetowa, jej szybkość i AI wpływają na Twój biznes.',
    images: [{ url: '/og-default.png', width: 1200, height: 630, alt: 'Avenly - agencja interaktywna', type: 'image/png' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog Avenly - konkretna wiedza bez żargonu',
    description: 'Krótkie artykuły o tym, jak strona internetowa, jej szybkość i AI wpływają na Twój biznes.',
    images: ['/og-default.png'],
  },
};

export default function BlogPage() {
  return <BlogIndex posts={blogPosts.map(toCard)} />;
}
