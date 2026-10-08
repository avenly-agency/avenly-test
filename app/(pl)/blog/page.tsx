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
  openGraph: {
    title: 'Blog Avenly - konkretna wiedza bez żargonu',
    description: 'Krótkie artykuły o tym, jak strona internetowa, jej szybkość i AI wpływają na Twój biznes.',
    url: '/blog',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog Avenly',
    description: 'Konkretna wiedza o stronach, szybkości i AI. Bez żargonu.',
  },
};

export default function BlogPage() {
  return <BlogIndex posts={blogPosts.map(toCard)} />;
}
