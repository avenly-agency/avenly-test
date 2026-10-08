import { blogPosts, type BlogPost } from '@/app/data/posts';

// Model sekcji "Blog" na stronie głównej. Źródłem są wpisy z app/data/posts.ts (te same, które
// zasilają /blog) - tylko CZYTAMY je: nic w danych się nie zmienia. Data po polsku z tablicy
// miesięcy (bez Intl - identycznie na serwerze i w przeglądarce).

export interface BtPost {
  id: string;
  slug: string;
  href: string;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  date: string;
  iso: string;
  minutes: number;
}

const MONTHS = ['stycznia', 'lutego', 'marca', 'kwietnia', 'maja', 'czerwca', 'lipca', 'sierpnia', 'września', 'października', 'listopada', 'grudnia'];

export const formatDate = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number);
  return m && d ? `${d} ${MONTHS[m - 1]} ${y}` : iso;
};

// Kategorie w danych są częściowo po angielsku i z "&" (np. "AI & Automatyzacja", "Performance").
// Na stronie głównej pokazujemy je zgodnie z zasadami copy (PRODUCT.md): po polsku, pisownia zdaniowa, "i".
const CATEGORY: Record<string, string> = {
  'AI & Automatyzacja': 'AI i automatyzacja',
  Performance: 'Wydajność',
};
export const categoryLabel = (c = 'Blog') => CATEGORY[c] ?? c.replace(/\s*&\s*/g, ' i ');

/** Wpis z posts.ts → dane karty (wspólne dla sekcji na stronie głównej i strony /blog). */
export const toBtPost = (p: BlogPost): BtPost => ({
  id: p.id,
  slug: p.slug,
  href: `/blog/${p.slug}`,
  title: p.title,
  excerpt: p.excerpt,
  image: p.mainImage,
  category: categoryLabel(p.categories?.[0]),
  date: formatDate(p.publishedAt),
  iso: p.publishedAt,
  minutes: parseInt(p.readTime, 10) || 5,
});

/** Wszystkie wpisy od najnowszego. */
export const byNewest = (a: BlogPost, b: BlogPost) => b.publishedAt.localeCompare(a.publishedAt);

/** Trzy najnowsze wpisy (sortowanie po dacie publikacji). Liczone raz przy imporcie modułu. */
export const LATEST: BtPost[] = [...blogPosts].sort(byNewest).slice(0, 3).map(toBtPost);

/** Podstawienie {klucz} w tekście słownika. */
export const fill = (s: string, v: Record<string, string | number>) => s.replace(/\{(\w+)\}/g, (_, k) => String(v[k] ?? ''));
