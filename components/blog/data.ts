import type { BlogPost } from '@/app/data/posts';
import { categoryLabel, formatDate } from '@/components/sections/blog-teaser/data';

// Model kart bloga (/blog i wpis). Dane z app/data/posts.ts tylko czytamy. Kategorie i daty pokazujemy tak samo jak
// sekcja Blog na stronie głównej (po polsku, pisownia zdaniowa, "i" zamiast "&") - te same funkcje, tylko odczyt.

export interface BlogCard {
  id: string;
  slug: string;
  href: string;
  title: string;
  excerpt: string;
  image: string;
  categories: string[];
  date: string;
  iso: string;
  minutes: number;
  author: string;
}

export const toCard = (p: BlogPost): BlogCard => ({
  id: p.id,
  slug: p.slug,
  href: `/blog/${p.slug}`,
  title: p.title,
  excerpt: p.excerpt,
  image: p.mainImage,
  categories: (p.categories.length ? p.categories : ['Blog']).map((c) => categoryLabel(c)),
  date: formatDate(p.publishedAt),
  iso: p.publishedAt,
  minutes: parseInt(p.readTime, 10) || 5,
  author: p.author.name || 'Avenly',
});

/** 1 wpis, 2-4 wpisy, 5 wpisów (także 12-14 wpisów). */
export const postsLabel = (n: number) => {
  const d = n % 10, dd = n % 100;
  if (n === 1) return '1 wpis';
  return `${n} ${d >= 2 && d <= 4 && (dd < 12 || dd > 14) ? 'wpisy' : 'wpisów'}`;
};
